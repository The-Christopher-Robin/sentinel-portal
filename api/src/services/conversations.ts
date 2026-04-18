import { randomUUID } from 'node:crypto'
import { query } from './db.js'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  latencyMs?: number
  retrievedIds?: number[]
}

export async function ensureConversation(
  conversationId: string | undefined,
  userId: string | null
): Promise<string> {
  const id = conversationId ?? randomUUID()
  await query(
    `INSERT INTO chat_conversations (id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET last_message_at = NOW()`,
    [id, userId]
  )
  return id
}

export async function appendMessage(
  conversationId: string,
  message: Message
): Promise<void> {
  await query(
    `INSERT INTO chat_messages
       (conversation_id, role, content, latency_ms, retrieved_ids)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      conversationId,
      message.role,
      message.content,
      message.latencyMs ?? null,
      message.retrievedIds ?? null,
    ]
  )
}

export async function loadHistory(
  conversationId: string,
  limit = 20
): Promise<Message[]> {
  const { rows } = await query<{ role: Message['role']; content: string }>(
    `SELECT role, content FROM chat_messages
     WHERE conversation_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [conversationId, limit]
  )
  return rows.reverse().map((r) => ({ role: r.role, content: r.content }))
}
