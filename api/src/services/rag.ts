import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { env } from '../env.js'
import { query } from './db.js'
import { logger } from './logger.js'

export interface RetrievedChunk {
  id: number
  source: string
  title: string
  content: string
  score: number
}

export interface AnswerResult {
  answer: string
  retrievedIds: number[]
  retrieved: RetrievedChunk[]
  latencyMs: number
}

const systemPrompt = `You are SentinelPortal's support assistant.
You help members understand how we remove their personal data from broker sites,
and you answer account and billing questions.

Rules:
- Ground every claim in the provided context. If the context does not cover the
  user's question, say so plainly and suggest opening a support ticket.
- Never fabricate URLs, prices, SLAs, or legal guarantees.
- Keep answers under six sentences unless the user explicitly asks for detail.
- If the user describes an urgent safety concern (doxxing, stalking, threats),
  recommend contacting local authorities first, then offer product guidance.`

const userPrompt = `Context:
{context}

Question: {question}

Answer the question using only the context above. If the answer is not in the
context, say you don't know and suggest a support ticket.`

const chatModel = new ChatOpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: env.OPENAI_CHAT_MODEL,
  temperature: 0.2,
  maxRetries: 2,
})

const embeddings = new OpenAIEmbeddings({
  apiKey: env.OPENAI_API_KEY,
  model: env.OPENAI_EMBEDDING_MODEL,
})

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  ['user', userPrompt],
])

const chain = prompt.pipe(chatModel).pipe(new StringOutputParser())

export async function embed(text: string): Promise<number[]> {
  const [vector] = await embeddings.embedDocuments([text])
  return vector
}

export async function retrieveChunks(
  question: string,
  k = 4
): Promise<RetrievedChunk[]> {
  const vector = await embeddings.embedQuery(question)
  const vectorLiteral = `[${vector.join(',')}]`
  const { rows } = await query<{
    id: number
    source: string
    title: string
    content: string
    score: string
  }>(
    `SELECT id, source, title, content,
            1 - (embedding <=> $1::vector) AS score
     FROM knowledge_chunks
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [vectorLiteral, k]
  )
  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    title: r.title,
    content: r.content,
    score: Number(r.score),
  }))
}

export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return '(no relevant context found)'
  }
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.title} (source: ${c.source})\n${c.content.trim()}`
    )
    .join('\n\n')
}

export async function answerQuestion(question: string): Promise<AnswerResult> {
  const started = Date.now()
  const retrieved = await retrieveChunks(question, 4)
  const context = formatContext(retrieved)

  let answer: string
  try {
    answer = await chain.invoke({ context, question })
  } catch (err) {
    logger.error({ err }, 'chat model invocation failed')
    throw new Error('chat model unavailable')
  }

  const latencyMs = Date.now() - started
  return {
    answer: answer.trim(),
    retrievedIds: retrieved.map((c) => c.id),
    retrieved,
    latencyMs,
  }
}
