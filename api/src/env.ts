import { z } from 'zod'
import 'dotenv/config'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CHAT_API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).default('postgres://sentinel:sentinel@localhost:5432/sentinel'),
  OPENAI_API_KEY: z.string().min(1).default('sk-test'),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  CHAT_API_SHARED_SECRET: z.string().default('change-me'),
  CHAT_RATE_LIMIT_PER_MIN: z.coerce.number().int().positive().default(30),
  AWS_REGION: z.string().default('us-west-2'),
  AWS_LOG_GROUP: z.string().default('/sentinel/chat-api'),
  S3_TRANSCRIPT_BUCKET: z.string().default('sentinel-portal-transcripts'),
})

export const env = schema.parse(process.env)
export type Env = z.infer<typeof schema>
