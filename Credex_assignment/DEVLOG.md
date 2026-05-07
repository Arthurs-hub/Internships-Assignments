# DEVLOG.md

## Day 1 — 2026-05-06
**Hours worked:** 1
**What I did:**
- Initialized Next.js project with TypeScript and Tailwind CSS.
- Defined project structure and created initial documentation files.
- Planned MVP features and architecture.
- Implemented core Audit Engine logic and Spend Form.
- Switched from Anthropic to Google Gemini API for free tier compatibility.
- Resolved build errors related to missing environment variables.
- Successfully deployed the application to Vercel.

**What I learned:**
- Next.js 15+ has some changes in configuration files (e.g., `next.config.ts`).
- npm naming restrictions require lowercase project names when using `create-next-app`.
- Vercel build process requires careful handling of optional environment variables for Supabase/AI clients.

**Blockers / what I'm stuck on:**
- None so far. Initial setup is complete.

**Plan for tomorrow:**
- Implement the Spend Input Form.
- Gather pricing data for the Audit Engine.
- Create `PRICING_DATA.md`.
