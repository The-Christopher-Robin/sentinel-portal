import { Router } from 'express'
import { query } from '../services/db.js'

export const healthRouter = Router()

healthRouter.get('/health', async (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

healthRouter.get('/health/ready', async (_req, res) => {
  try {
    await query('SELECT 1')
    res.json({ status: 'ready' })
  } catch {
    res.status(503).json({ status: 'degraded', reason: 'db_unreachable' })
  }
})
