import { createApp } from './app.js'
import { env } from './env.js'
import { logger } from './services/logger.js'
import { shutdown } from './services/db.js'

const app = createApp()

const server = app.listen(env.CHAT_API_PORT, () => {
  logger.info({ port: env.CHAT_API_PORT }, 'chat api listening')
})

async function stop(signal: string) {
  logger.info({ signal }, 'shutting down')
  server.close(async (err) => {
    if (err) logger.error({ err }, 'server close error')
    await shutdown().catch(() => undefined)
    process.exit(err ? 1 : 0)
  })
  setTimeout(() => process.exit(1), 8_000).unref()
}

process.on('SIGINT', () => stop('SIGINT'))
process.on('SIGTERM', () => stop('SIGTERM'))
