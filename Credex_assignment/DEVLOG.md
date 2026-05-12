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

## Day 2 — 2026-05-07
**Hours worked:** 2
**What I did:**
- Enhanced the Lead Capture form with additional fields (Company, Role).
- Integrated Resend for transactional emails (API route setup).
- Implemented "Share Results" functionality with clipboard copy.
- Verified and documented all 5 mandatory tests for the Audit Engine.
- Updated `PROMPTS.md` and `PRICING_DATA.md` for full compliance.
- Polished the Audit Results UI for better mobile responsiveness and viral sharing.

**What I learned:**
- Resend's `onboarding@resend.dev` address is restricted to the account owner's email until domain verification.
- Metadata generation in Next.js App Router requires careful handling of dynamic routes to ensure OG tags work correctly.

**Blockers / what I'm stuck on:**
- Email delivery issues during testing (resolved by clarifying Resend's sandbox limits).

## Day 3 — 2026-05-08
**Hours worked:** 3.5
**What I did:**
- Refactored Audit Engine logic to include "Consolidation" suggestions.
- Added data privacy and management benefits to the recommendation UI.
- Implemented interactive Share Modal with social media integrations (LinkedIn, X, Facebook, Email).
- Drafted the core GTM (Go-To-Market) strategy and viral loop design.
- Started outreach to potential users for interviews.

**What I learned:**
- framer-motion AnimatePresence requires `mode="wait"` to avoid layout conflicts when switching between modal views.
- Lucide React icon imports must be exact named exports — wrong names cause silent build failures.

**Blockers / what I'm stuck on:**
- Email sharing via Resend only works for the account owner's address in sandbox mode. Need domain verification for production.

**Plan for tomorrow:**
- Day off.

## Day 4 — 2026-05-09
**Hours worked:** 0
**What I did:** Day off.

**What I learned:** —
**Blockers / what I'm stuck on:** —
**Plan for tomorrow:** Day off.

## Day 5 — 2026-05-10
**Hours worked:** 0
**What I did:** Day off.

**What I learned:** —
**Blockers / what I'm stuck on:** —
**Plan for tomorrow:** Resume work on Day 6 — finalize docs, conduct user outreach, polish UI.

## Day 6 — 2026-05-11
**Hours worked:** 4
**What I did:**
- Finalized all 12+ documentation files.
- Completed the "Reflection" document with a detailed debugging story.
- Performed a full end-to-end security and performance audit of the app.
- Conducted real-world outreach to professional users (Software Engineers) for live feedback.
- Cleaned up `USER_INTERVIEWS.md` by removing AI-generated mock interviews.
- Documented first real interview with Vasili Stoleicov and added placeholders for remaining required interviews.
- Debugged and fixed shareable URL (404 issue): root cause was Supabase PostgREST not returning rows via JS client due to new JWT key system — resolved by switching to direct REST fetch with service_role key.
- Created `audits` and `leads` tables in Supabase with RLS policies.
- Fixed Gemini model from deprecated `gemini-1.5-flash` to `gemini-2.0-flash`.
- Fixed audit storage to save as proper JSON blob.
- Added `force-dynamic` and `fetchCache: force-no-store` to audit page to prevent static caching.

## Day 7 — 2026-05-12
**Hours worked:** 3
**What I did:**
- Added Interview 2 (Danil Karataev) to `USER_INTERVIEWS.md` — outreach result documented honestly.
- Fixed CI workflow: corrected `node-of-version` typo to `node-version`, added `working-directory` for monorepo structure.
- Updated DEVLOG Day 3 to remove reference to AI-generated interviews.
- Fixed incorrect technology references: replaced "Anthropic API" with "Google Gemini API" across README.md and ARCHITECTURE.md.
- Fixed PRICING_DATA.md: moved Gemini pricing into its own `## Gemini` section (was incorrectly appended to Windsurf section).
- Documented ChatGPT Enterprise $60 floor estimate used in audit engine with honest explanation in PRICING_DATA.md.
- Added Abuse Protection section to ARCHITECTURE.md documenting honeypot implementation and rationale.
- Clarified Resend sandbox limitation in ARCHITECTURE.md (delivery restricted to verified sender until domain verified).
- Corrected ARCHITECTURE.md: removed SES (not integrated), clarified UI components are hand-written following shadcn/ui pattern without the package.
- Fixed layout.tsx: replaced default Next.js placeholder title/description with real product metadata.
- Final review of all documentation files for accuracy and consistency.
- Awaiting third user interview response.

**What I learned:**
- CI workflows in monorepos require explicit `working-directory` or `defaults.run.working-directory` to run commands in the right folder.
- Resend sandbox restricts delivery to the account owner's verified email until a custom domain is added.

**Blockers / what I'm stuck on:**
- Third user interview still pending.

**Plan for tomorrow:**
- Add third interview once response arrives.
- Final submission.
