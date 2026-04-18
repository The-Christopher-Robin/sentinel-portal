import pino from 'pino'
import { env } from '../env.js'

const base = {
  service: 'sentinel-chat-api',
  env: env.NODE_ENV,
  region: env.AWS_REGION,
  logGroup: env.AWS_LOG_GROUP,
}

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  base,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label }
    },
  },
})

export type Logger = typeof logger
