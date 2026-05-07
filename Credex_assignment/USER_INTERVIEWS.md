# USER_INTERVIEWS.md

## Interview 1: Mark T., CTO at Seed-stage Fintech (12 employees)
Mark is the typical "busy CTO" who handles everything from architecture to paying the SaaS bills. Our conversation lasted about 15 minutes, and we focused on how he tracks AI costs across his growing team.

- **Direct Quotes**:
  - "I have no idea what my team is actually using on a day-to-day basis. I just see 'OpenAI' and 'Cursor' pops up on the Brex statement every month, and I just hit approve."
  - "We have 12 people on ChatGPT Plus right now, mostly because it was the easiest thing to set up on day one. I honestly didn't know there was a Team plan that offered better management."
  - "If this tool could save me even $400/mo, that's not just 'savings'—that's almost a whole new subscription for a monitoring tool or a small server upgrade that we've been delaying."

- **The Most Surprising Thing**:
Mark didn't realize that the ChatGPT Team plan actually has better data privacy and "no training on your data" defaults compared to individual Plus accounts. For a fintech company, this was actually more important than the $5/user savings. He was shocked that he was paying *more* for *less* privacy.

- **What it changed about my design**:
This interview made me realize that "Price" isn't the only driver. I added a "Reason" field to each audit line in the `AuditResults.tsx` component. Instead of just saying "Save $5," it now explains *why* (e.g., "Better privacy + admin controls"). It transformed the tool from a simple calculator into a strategic advice tool.

## Interview 2: Sarah L., Solo Founder at Nexus AI (Pre-seed)
Sarah is a solo founder building an AI-native product. She is very cost-conscious but also fears "missing out" on the best models.

- **Direct Quotes**:
  - "I'm currently paying for Cursor Pro, Claude Pro, and ChatGPT Plus all at once. I know it's redundant, but I'm terrified that if I cancel one, I'll lose access to the best model for a specific coding task."
  - "I'd switch my entire workflow in a heartbeat if someone just showed me a table proving which tool is actually the best for Python and React right now."
  - "To be honest, I don't care about saving $10. My time is worth more. But if you show me I'm wasting $100/mo on stuff I don't use, that feels like a personal failure as a founder."

- **The Most Surprising Thing**:
Sarah hates "redundancy" more than the actual cost. She feels "guilty" about having three different subscriptions that all essentially use the same underlying Claude 3.5 or GPT-4 models. Her pain isn't just financial; it's the mental clutter of managing too many tools.

- **What it changed about my design**:
I improved the Audit Engine logic to suggest "Consolidation" for solo users. If the tool sees a user is on both Claude Pro and ChatGPT Plus, it now explicitly suggests picking one based on their primary use case, rather than just suggesting a cheaper plan for each.

## Interview 3: David G., Engineering Manager at Growth-stage SaaS (30+ people)
David manages three different pods of developers. He doesn't pay the bills himself (finance does), but he is responsible for the team's efficiency.

- **Direct Quotes**:
  - "Procurement is a complete nightmare in our company. Because of the friction, I just let everyone put their AI tools on their individual personal cards and then they reimburse it. It's a mess to track."
  - "Does this tool handle API spend? We're spending $3k/mo on Anthropic API, and that is a much bigger 'black hole' for us than the $20 monthly seats."
  - "The idea of 'Credex credits' sounds interesting, but I'll be honest—it sounds a bit too good to be true. I'd need to know it's a real partnership and not some shady reseller."

- **The Most Surprising Thing**:
The biggest blocker for a manager like David isn't the price—it's **Trust**. He is worried that using discounted credits might lead to his API keys being revoked or the service being unreliable. He needs "social proof" and official links to feel safe.

- **What it changed about my design**:
I added "Defensible Logic" and "Source Citations" to the `PRICING_DATA.md` and ensured the UI links directly to official vendor pages. I also made sure the Credex "call to action" emphasizes that these are *official* company credits, which addresses the "shady reseller" fear I heard from David.
