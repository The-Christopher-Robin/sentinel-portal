import pg from 'pg'
import { env } from '../env.js'
import { logger } from './logger.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 4_000,
})

pool.on('error', (err) => {
  logger.error({ err }, 'postgres pool error')
})

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  const started = Date.now()
  try {
    const res = await pool.query<T>(text, params as any[])
    const elapsed = Date.now() - started
    if (elapsed > 500) {
      logger.warn({ elapsed, rows: res.rowCount, sql: text.slice(0, 80) }, 'slow query')
    }
    return res
  } catch (err) {
    logger.error({ err, sql: text.slice(0, 80) }, 'query failed')
    throw err
  }
}

export async function shutdown(): Promise<void> {
  await pool.end()
}
