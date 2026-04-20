# SentinelPortal

Privacy member portal with an automated AI chatbox. Customers sign in, see which data-broker removals are in flight, and ask a support assistant that answers from the knowledge base (RAG over pgvector) and archives every conversation to S3 for compliance.

This is a resume project, but it's wired end-to-end: auth, CMS-driven marketing site, authenticated portal, streaming-ready chat API, background persistence, CI, and a deploy path to Vercel + AWS Lambda.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind, shadcn/ui |
| Auth | Auth.js v5 (Credentials provider, JWT sessions) |
| CMS | Sanity (landing page + blog schemas) |
| Chat API | Node.js / Express, Zod, Pino, `express-rate-limit` |
| AI | LangChain with a pluggable LLM layer. Default: self-hosted **Ollama** (`llama3.1:8b` chat, `nomic-embed-text` embeddings). Drop-in fallback: OpenAI (`gpt-4o-mini`, `text-embedding-3-small`) via `LLM_PROVIDER=openai` |
| Data | PostgreSQL 16 + `pgvector` (cosine similarity) |
| Storage | AWS S3 (transcript archive, JSONL) |
| Serverless | `serverless-http` + AWS SAM (API Gateway → Lambda) |
| Tests | Vitest |
| CI | GitHub Actions (typecheck + build + test) |

## Repo layout

```
sentinel-portal/
├── web/         Next.js app (marketing + portal + /api/chat proxy)
├── api/         Express chat API (also packaged as a Lambda handler)
├── sanity/      Sanity studio config and content schemas
├── infra/       docker-compose (Postgres+pgvector) and SAM template
└── .github/     CI workflows
```

The repo is an npm workspaces monorepo; a single `npm install` at the root hydrates all three packages.

## Running it locally

The default setup is fully self-hosted — **no API keys, no per-token cost**, just Ollama running on your machine.

```bash
# 1. Pull the open-weight models (one-time, ~5 GB)
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# 2. Configure env
cp .env.example .env                                # sensible defaults

# 3. Start Postgres + pgvector
docker compose -f infra/docker-compose.yml up -d

# 4. Install + seed + run
npm install
npm -w api run seed                                 # embed the starter KB with Ollama
npm -w api run dev                                  # :4000
npm -w web run dev                                  # :3000
```

Sign in at `http://localhost:3000/signin` with the demo credentials printed in the server logs, then head to `/portal` and open the chat widget.

### Using OpenAI instead

Swap the provider without touching code:

```bash
# .env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

…and bump the vector column in `infra/init.sql` from `vector(768)` to `vector(1536)` before re-seeding (OpenAI's `text-embedding-3-small` is 1536-dim, Ollama's `nomic-embed-text` is 768-dim).

## Chat flow

1. Browser posts to `web` (`/api/chat`).
2. `web` forwards to the Express API with a shared-secret header.
3. API embeds the question with OpenAI, runs a cosine similarity search in `pgvector` over `knowledge_chunks`, and feeds the top hits as grounding context to `gpt-4o-mini`.
4. The reply and retrieved chunks are written to Postgres (`conversations`, `messages`) and, on conversation close, uploaded to S3 as a JSONL transcript.

## Deploy

- **Frontend** deploys to Vercel straight from `web/`.
- **Chat API** deploys to AWS Lambda behind API Gateway via `infra/template.yaml` (SAM).
- **Postgres** is expected to be any managed pgvector-capable instance (RDS, Neon, Supabase, etc.).
- **Sanity** Studio deploys to `<project>.sanity.studio` with `npm -w sanity run deploy`.

## Tests

```bash
npm -w api run test          # vitest
npm -w web run typecheck
npm -w api run typecheck
```

CI runs the same three commands on every push to `main`.

## Notes

The token-auth pattern between `web` and `api` is intentionally boring (shared secret in header + rate limiting per IP) so this repo stays focused on the RAG + portal story instead of re-implementing auth plumbing.
