# Architecture

## Request flow

```
Browser
  │  (sign in via Auth.js credentials)
  ▼
Next.js web (Vercel)
  │  marketing pages  ──► Sanity headless CMS (optional at build time)
  │  portal pages     ──► auth session (JWT)
  │  ChatBox.tsx      ──► POST /api/chat  (Next.js route handler)
  ▼
/api/chat (Next.js route handler)
  │  attaches x-user-id from the session
  │  attaches Bearer CHAT_API_SHARED_SECRET
  ▼
Express chat API (local dev) OR AWS Lambda + API Gateway (prod)
  │  sharedSecretAuth  ──► 401 if secret mismatch
  │  chatRateLimiter   ──► 429 if user exceeds window
  │  routes/chat.ts    ──► validates body with zod
  │
  ├── services/conversations.ts
  │     └── upsert chat_conversations, append user message
  │
  ├── services/rag.ts
  │     ├── embeddings.embedQuery(question)  (OpenAI text-embedding-3-small)
  │     ├── pgvector: ORDER BY embedding <=> $1 LIMIT 4
  │     └── prompt | chatModel | StringOutputParser  (LangChain)
  │
  ├── services/conversations.ts
  │     └── append assistant message with latency_ms + retrieved_ids
  │
  └── optional: services/transcripts.ts
        └── S3 archive for QA review (prod only)
```

## Data model

`knowledge_chunks` — the RAG corpus.

| col | type | notes |
|---|---|---|
| id | bigserial | |
| source | text | `product/removal-flow`, `billing/plans`, etc. |
| title | text | short human label |
| content | text | 1–3 sentence chunk |
| embedding | vector(1536) | `text-embedding-3-small` |
| metadata | jsonb | tokens, source-specific fields |

Index: `ivfflat (embedding vector_cosine_ops) WITH (lists=100)`.

`chat_conversations` — one row per member session.
`chat_messages` — role, content, `latency_ms`, `retrieved_ids[]`.

## Auth model

Auth.js v5 credentials provider on the web app, JWT session strategy. The portal routes are gated by `auth()` in the route segment. The chat API uses a separate shared-secret Bearer token between the Next.js server and Express, so the frontend never touches the secret. User identity is forwarded as the `x-user-id` header for audit logging and rate limiting.

## Why Express plus Next.js, instead of just Next.js route handlers?

Three reasons:

1. The chat service runs cold-start cleanly on AWS Lambda as its own package, which keeps the portal's Vercel bundle small.
2. Keeping the RAG code in a plain Node runtime avoids Next.js edge/runtime gotchas around `pg` and `@langchain/openai`.
3. Rate limiting, pooling, and request logging are easier to reason about in a single Express app than in scattered route handlers.

## Deployment

- **web/** → Vercel. `vercel.json` pins the framework and build command.
- **api/** → AWS SAM. `infra/template.yaml` deploys a single Lambda behind API Gateway using the `serverless-http` adapter in `lambda.ts`. The function needs `DATABASE_URL` pointing at an RDS PostgreSQL instance with the `vector` extension enabled.
- **infra/docker-compose.yml** uses the `pgvector/pgvector:pg16` image locally so dev matches prod behaviour.

## Testing

Vitest covers:

- `tests/auth.test.ts` — shared-secret middleware accepts / rejects correctly and forwards `x-user-id`.
- `tests/chat.validation.test.ts` — zod schema handles empty, oversized, and malformed input.
- `tests/rag.test.ts` — retrieval path mocked end-to-end so CI can run without OpenAI or Postgres.

CI runs typecheck + tests on every PR via GitHub Actions.
