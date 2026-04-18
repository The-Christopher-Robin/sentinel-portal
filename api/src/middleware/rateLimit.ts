import rateLimit from 'express-rate-limit'
import { env } from '../env.js'

export const chatRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: env.CHAT_RATE_LIMIT_PER_MIN,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => req.header('x-user-id') ?? req.ip ?? 'unknown',
  message: { error: 'rate_limited' },
})
