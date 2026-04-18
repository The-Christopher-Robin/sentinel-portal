import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const chatSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
})

describe('chat request schema', () => {
  it('accepts a plain question', () => {
    const r = chatSchema.safeParse({ question: 'How do refunds work?' })
    expect(r.success).toBe(true)
  })

  it('accepts a question with a valid conversationId', () => {
    const r = chatSchema.safeParse({
      question: 'What is the status?',
      conversationId: '11111111-1111-4111-8111-111111111111',
    })
    expect(r.success).toBe(true)
  })

  it('rejects empty questions', () => {
    const r = chatSchema.safeParse({ question: '   ' })
    expect(r.success).toBe(false)
  })

  it('rejects questions over 2000 chars', () => {
    const r = chatSchema.safeParse({ question: 'a'.repeat(2001) })
    expect(r.success).toBe(false)
  })

  it('rejects malformed conversationId', () => {
    const r = chatSchema.safeParse({
      question: 'Hello',
      conversationId: 'not-a-uuid',
    })
    expect(r.success).toBe(false)
  })
})
