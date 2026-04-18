import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../env.js'
import { logger } from './logger.js'

const s3 = new S3Client({ region: env.AWS_REGION })

export interface TranscriptPayload {
  conversationId: string
  messages: Array<{ role: string; content: string; createdAt: string }>
}

export async function archiveTranscript(payload: TranscriptPayload): Promise<void> {
  if (env.NODE_ENV !== 'production') {
    logger.debug({ conversationId: payload.conversationId }, 'skip s3 upload (non-prod)')
    return
  }
  const key = `conversations/${new Date().toISOString().slice(0, 10)}/${payload.conversationId}.json`
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: env.S3_TRANSCRIPT_BUCKET,
        Key: key,
        Body: JSON.stringify(payload, null, 2),
        ContentType: 'application/json',
      })
    )
    logger.info({ key }, 'transcript archived')
  } catch (err) {
    logger.error({ err, conversationId: payload.conversationId }, 's3 upload failed')
  }
}
