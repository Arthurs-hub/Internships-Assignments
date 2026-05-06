# REFLECTION.md

## 1. The Hardest Bug
The hardest bug was related to **Next.js hydration errors** when using `localStorage` with the Spend Form. Because `localStorage` is only available on the client, the initial server-render of the form would use the default state, while the client would immediately overwrite it with the stored state, causing a mismatch. 
- **Hypothesis**: I initially thought it was a React `useEffect` race condition.
- **Tried**: I tried moving the logic into `useEffect`, but that caused a visible "flash" of empty content.
- **Solution**: I implemented a "hasHydrated" state in a custom hook that returns the initial value on the server and the stored value only after the first mount, ensuring the server and client initial renders match.

## 2. A Decision Reversed
Mid-week, I reversed the decision to use **AI for the audit math**. I initially thought an LLM could handle the logic more dynamically, but I quickly realized that:
1. LLMs are non-deterministic and could give different savings for the same input.
2. Defensibility is key for a finance-focused tool. 
I switched to a **hardcoded rule engine** for the math and reserved the AI for the **personalized summary**, which is where its creative strengths actually add value.

## 3. Week 2 Roadmap
If I had another week, I would build:
- **PDF Export**: A professional "Executive Summary" PDF that a CTO could directly slack to their CFO.
- **Real-time API benchmarking**: Connecting to a dummy bank feed or CSV upload to automate the tool identification.
- **Team Comparison**: A "How you compare" benchmark mode using anonymized data from all audits.

## 4. Use of AI Tools
I used **Cursor and Claude 3.5 Sonnet** extensively for UI scaffolding and boilerplate logic. 
- **What I didn't trust**: The audit logic itself. I manually verified all pricing data and wrote the rules myself to ensure defensibility.
- **AI Error**: At one point, the AI suggested a ChatGPT Team plan price that was outdated by 6 months. I caught it during the `PRICING_DATA.md` verification phase and corrected the engine logic.

## 5. Self-Rating
- **Discipline (9/10)**: Commits spread across the week, daily devlog entries maintained.
- **Code Quality (8/10)**: Clean TypeScript types, modular components, but some logic could be further abstracted.
- **Design Sense (8/10)**: Clean, professional UI using Tailwind, though more custom animations could be added.
- **Problem Solving (9/10)**: Handled the hydration and persistence issues efficiently.
- **Entrepreneurial Thinking (10/10)**: Deep focus on lead-gen, unit economics, and the viral sharing loop.
