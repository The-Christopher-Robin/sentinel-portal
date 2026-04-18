import { describe, expect, it, vi } from 'vitest'
import type { Request, Response } from 'express'
import { sharedSecretAuth } from '../src/middleware/auth.js'
import { env } from '../src/env.js'

function makeReq(headers: Record<string, string>): Request {
  return {
    header(name: string) {
      return headers[name.toLowerCase()]
    },
  } as unknown as Request
}

function makeRes(): Response & { body?: unknown; statusCode: number } {
  const res: any = {
    statusCode: 200,
    status(code: number) {
      res.statusCode = code
      return res
    },
    json(payload: unknown) {
      res.body = payload
      return res
    },
  }
  return res
}

describe('sharedSecretAuth', () => {
  it('rejects missing token', () => {
    const req = makeReq({})
    const res = makeRes()
    const next = vi.fn()
    sharedSecretAuth(req, res, next)
    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects wrong token', () => {
    const req = makeReq({ authorization: 'Bearer nope' })
    const res = makeRes()
    const next = vi.fn()
    sharedSecretAuth(req, res, next)
    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('accepts the configured token and forwards user id', () => {
    const req = makeReq({
      authorization: `Bearer ${env.CHAT_API_SHARED_SECRET}`,
      'x-user-id': 'u_42',
    }) as any
    const res = makeRes()
    const next = vi.fn()
    sharedSecretAuth(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(req.userId).toBe('u_42')
  })

  it('defaults user id to null when not provided', () => {
    const req = makeReq({
      authorization: `Bearer ${env.CHAT_API_SHARED_SECRET}`,
    }) as any
    const res = makeRes()
    const next = vi.fn()
    sharedSecretAuth(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(req.userId).toBeNull()
  })
})
