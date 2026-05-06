# AI Spend Audit Tool

## Summary
AI Spend Audit is a free tool designed to help startups and engineering managers identify overspend on AI tools like Cursor, Claude, and ChatGPT. By analyzing current plans and team sizes, it provides a defensible audit with actionable recommendations and surfaces significant savings opportunities through Credex credits.

## Screenshots
[To be added after implementation]

## Quick Start
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run locally**:
   ```bash
   npm run dev
   ```
3. **Deploy**:
   Push to GitHub and connect to Vercel/Netlify.

## Decisions & Trade-offs
1. **Next.js (App Router)**: Chose for its excellent performance, SEO capabilities (critical for viral sharing), and built-in API routes for AI integration.
2. **Hardcoded Audit Logic**: Decided against using AI for the core audit math to ensure 100% accuracy and defensibility. AI is reserved for the personalized summary.
3. **Supabase for Backend**: Selected for its speed of development and built-in PostgreSQL, which allows for robust lead capture and future scalability.
4. **LocalStorage for Persistence**: Implemented local persistence to ensure users don't lose progress if they accidentally refresh the form.
5. **Shadcn/UI**: Used for a high-quality, professional aesthetic that builds trust with founders and finance personas.

## Live URL
[Link to be added after deployment]
