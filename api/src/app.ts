import express from 'express'
import cors from 'cors'
import { chatRouter } from './routes/chat.js'
import { healthRouter } from './routes/health.js'
import { versionRouter } from './routes/version.js'
import { logger } from './services/logger.js'

export function createApp(): express.Express {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '256kb' }))
  app.use(
    cors({
      origin: (_origin, cb) => cb(null, true),
      credentials: false,
    })
  )

  app.use((req, _res, next) => {
    logger.debug({ method: req.method, path: req.path }, 'request')
    next()
  })

  app.use(healthRouter)
  app.use(versionRouter)
  app.use(chatRouter)

  app.use((req, res) => {
    res.status(404).json({ error: 'not_found', path: req.path })
  })

  return app
}
