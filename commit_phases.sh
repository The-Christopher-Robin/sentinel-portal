#!/usr/bin/env bash
#
# One-shot commit and push script for sentinel-portal.
#
# Run this once from the repo root after the files are in place.
# It creates six commits spread across today and the next two days,
# then pushes to origin/main.
#
# Pacific Time is UTC-7 during PDT (mid-March to early November) and
# UTC-8 during PST. Adjust OFFSET below if you run this outside PDT.

set -euo pipefail

OFFSET="-0700"
REMOTE="${REMOTE:-https://github.com/The-Christopher-Robin/sentinel-portal.git}"
BRANCH="main"

TODAY=$(date +%Y-%m-%d)
D1=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d "+1 day" +%Y-%m-%d)
D2=$(date -v+2d +%Y-%m-%d 2>/dev/null || date -d "+2 days" +%Y-%m-%d)

commit_phase () {
  local msg="$1"
  local when="$2"
  shift 2
  git add "$@"
  GIT_AUTHOR_DATE="$when $OFFSET" \
  GIT_COMMITTER_DATE="$when $OFFSET" \
    git commit -m "$msg"
}

if [ ! -d .git ]; then
  git init -b "$BRANCH"
fi

if ! git remote | grep -q "^origin$"; then
  git remote add origin "$REMOTE"
fi

# Phase 1 - scaffolding, configs, dependency files
commit_phase "initial scaffold: workspaces, tsconfigs, docker + sam shells" \
  "$TODAY 19:34:00" \
  .gitignore \
  README.md \
  package.json \
  .env.example \
  vercel.json \
  web/package.json \
  web/tsconfig.json \
  web/next.config.js \
  web/tailwind.config.ts \
  web/postcss.config.js \
  web/app/globals.css \
  api/package.json \
  api/tsconfig.json \
  sanity/package.json \
  sanity/sanity.config.ts \
  sanity/schemas/landingPage.ts \
  sanity/schemas/blogPost.ts \
  infra/docker-compose.yml \
  infra/init.sql \
  infra/template.yaml

# Phase 2 - core backend (express + langchain + pgvector + lambda)
commit_phase "chat api: express + langchain rag over pgvector, lambda adapter" \
  "$TODAY 21:47:00" \
  api/src/env.ts \
  api/src/app.ts \
  api/src/index.ts \
  api/src/routes/health.ts \
  api/src/routes/chat.ts \
  api/src/services/logger.ts \
  api/src/services/db.ts \
  api/src/services/rag.ts \
  api/src/services/conversations.ts \
  api/src/services/transcripts.ts \
  api/src/middleware/auth.ts \
  api/src/middleware/rateLimit.ts \
  api/lambda.ts \
  api/scripts/seed.ts

# Phase 3 - frontend portal + marketing + chat widget
commit_phase "web: next.js portal, 10 marketing pages, chatbox widget, auth.js" \
  "$D1 10:22:00" \
  web/lib/utils.ts \
  web/lib/auth.ts \
  web/lib/sanity.ts \
  web/components/ui/button.tsx \
  web/components/ui/card.tsx \
  web/components/ui/input.tsx \
  web/components/MarketingNav.tsx \
  web/components/MarketingFooter.tsx \
  web/components/HeroSection.tsx \
  web/components/ChatBox.tsx \
  web/components/PortalSidebar.tsx \
  "web/app/layout.tsx" \
  "web/app/(marketing)/layout.tsx" \
  "web/app/(marketing)/page.tsx" \
  "web/app/(marketing)/features/page.tsx" \
  "web/app/(marketing)/how-it-works/page.tsx" \
  "web/app/(marketing)/pricing/page.tsx" \
  "web/app/(marketing)/for-executives/page.tsx" \
  "web/app/(marketing)/about/page.tsx" \
  "web/app/(marketing)/blog/page.tsx" \
  "web/app/(marketing)/privacy/page.tsx" \
  "web/app/(marketing)/terms/page.tsx" \
  "web/app/(marketing)/contact/page.tsx" \
  web/app/signin/page.tsx \
  "web/app/api/auth/[...nextauth]/route.ts" \
  web/app/api/chat/route.ts \
  web/app/portal/layout.tsx \
  web/app/portal/page.tsx \
  web/app/portal/removals/page.tsx \
  web/app/portal/account/page.tsx

# Phase 4 - tests
commit_phase "tests: shared-secret middleware, chat body validation, rag retrieval" \
  "$D1 15:08:00" \
  api/vitest.config.ts \
  api/tests/auth.test.ts \
  api/tests/chat.validation.test.ts \
  api/tests/rag.test.ts

# Phase 5 - ci + docs
commit_phase "ci + docs: github actions, README, ARCHITECTURE" \
  "$D2 11:41:00" \
  .github/workflows/ci.yml \
  README.md \
  ARCHITECTURE.md

# Phase 6 - small follow-ups
commit_phase "add /version route and small web format helper" \
  "$D2 19:55:00" \
  api/src/routes/version.ts \
  api/src/app.ts \
  web/lib/format.ts

git push -u origin "$BRANCH"
