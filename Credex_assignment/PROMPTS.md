# PROMPTS.md

## Audit Summary Prompt
This prompt is used in `/api/summary` to generate a personalized audit overview.

### The Prompt
```text
Generate a 100-word personalized summary for an AI spend audit. 
Total Monthly Savings: ${auditData.totalMonthlySavings}.
Total Annual Savings: ${auditData.totalAnnualSavings}.
Tools: ${auditData.recommendations.map((r: any) => r.tool).join(', ')}.
Focus on the biggest savings and the value of Credex credits. Tone: Professional, entrepreneurial.
```

### Why I wrote it this way
1. **Constraint on length**: "100-word" ensures the summary is skimmable and fits the UI layout.
2. **Context-rich**: Providing the actual savings numbers allows the LLM to be specific rather than generic.
3. **Tone control**: "Professional, entrepreneurial" matches the target persona of a startup founder.
4. **Action-oriented**: Explicitly asking to focus on "biggest savings" and "Credex credits" ensures the summary acts as a lead-gen tool for Credex.

### What didn't work
- **Initial attempt**: I didn't specify the tone, and the AI sounded too much like a generic "customer support" agent.
- **Second attempt**: I didn't provide the tool names, and the AI made up examples of what we *might* be saving on, which felt fake.
