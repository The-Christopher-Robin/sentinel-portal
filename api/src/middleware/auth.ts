import type { NextFunction, Request, Response } from 'express'
import { env } from '../env.js'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string | null
  }
}

export function sharedSecretAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.header('authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '').trim()

  if (!token || token !== env.CHAT_API_SHARED_SECRET) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const userId = req.header('x-user-id') ?? null
  req.userId = userId
  next()
}
