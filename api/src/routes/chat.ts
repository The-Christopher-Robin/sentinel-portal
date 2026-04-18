import { Router } from 'express'
import { z } from 'zod'
import { answerQuestion } from '../services/rag.js'
import {
  appendMessage,
  ensureConversation,
  loadHistory,
} from '../services/conversations.js'
import { archiveTranscript } from '../services/transcripts.js'
import { sharedSecretAuth } from '../middleware/auth.js'
import { chatRateLimiter } from '../middleware/rateLimit.js'
import { logger } from '../services/logger.js'

export const chatRouter = Router()

const chatSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
})

chatRouter.post('/chat', sharedSecretAuth, chatRateLimiter, async (req, res) => {
  const parsed = chatSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues })
    return
  }

  const { question, conversationId } = parsed.data
  const userId = req.userId ?? null

  try {
    const convId = await ensureConversation(conversationId, userId)
    await appendMessage(convId, { role: 'user', content: question })

    const result = await answerQuestion(question)

    await appendMessage(convId, {
      role: 'assistant',
      content: result.answer,
      latencyMs: result.latencyMs,
      retrievedIds: result.retrievedIds,
    })

    logger.info(
      {
        conversationId: convId,
        userId,
        latencyMs: result.latencyMs,
        retrieved: result.retrievedIds.length,
      },
      'chat.answered'
    )

    res.json({
      conversationId: convId,
      answer: result.answer,
      sources: result.retrieved.map((c) => ({
        id: c.id,
        title: c.title,
        source: c.source,
        score: Number(c.score.toFixed(4)),
      })),
      latencyMs: result.latencyMs,
    })
  } catch (err) {
    logger.error({ err }, 'chat.failed')
    const message = err instanceof Error ? err.message : 'unknown'
    res.status(500).json({ error: 'chat_failed', message })
  }
})

chatRouter.get(
  '/chat/:conversationId/history',
  sharedSecretAuth,
  async (req, res) => {
    const { conversationId } = req.params
    if (!/^[0-9a-f-]{36}$/i.test(conversationId)) {
      res.status(400).json({ error: 'invalid_conversation_id' })
      return
    }
    try {
      const messages = await loadHistory(conversationId)
      res.json({ conversationId, messages })
    } catch (err) {
      logger.error({ err, conversationId }, 'history.failed')
      res.status(500).json({ error: 'history_failed' })
    }
  }
)

chatRouter.post(
  '/chat/:conversationId/archive',
  sharedSecretAuth,
  async (req, res) => {
    const { conversationId } = req.params
    try {
      const messages = await loadHistory(conversationId, 500)
      await archiveTranscript({
        conversationId,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: new Date().toISOString(),
        })),
      })
      res.json({ ok: true })
    } catch (err) {
      logger.error({ err, conversationId }, 'archive.failed')
      res.status(500).json({ error: 'archive_failed' })
    }
  }
)
