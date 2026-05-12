import { AuditInput, AuditRecommendation, AuditReport, ToolUsage, UseCase } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const PRICING = {
  Cursor: { Hobby: 0, Pro: 20, Business: 40 },
  'GitHub Copilot': { Individual: 10, Business: 19, Enterprise: 39 },
  Claude: { Free: 0, Pro: 20, Team: 30 },
  ChatGPT: { Plus: 20, Team: 25, Enterprise: 60 },
  Windsurf: { Free: 0, Pro: 15, Teams: 35 },
};

// Cheaper alternative tools by use case — only suggested when savings are substantial
const ALTERNATIVES: Partial<Record<string, { useCase: UseCase[]; alternative: string; reason: string }>> = {
  'GitHub Copilot': {
    useCase: ['coding'],
    alternative: 'Windsurf Pro',
    reason: 'Windsurf Pro ($15/user) offers comparable AI code completion to Copilot Individual ($10/user) with a more modern UX. For coding-focused teams already paying for Copilot Business or Enterprise, Windsurf Pro cuts per-seat cost significantly.',
  },
  'ChatGPT': {
    useCase: ['writing', 'research', 'mixed'],
    alternative: 'Claude Pro',
    reason: 'Claude Pro ($20/mo) matches ChatGPT Plus for writing and research tasks and is widely regarded as stronger for long-form content. For teams on ChatGPT Plus paying per seat, switching to Claude Pro individual accounts saves $0–$5/user/mo with comparable capability.',
  },
};

export function runAudit(input: AuditInput): AuditReport {
  const recommendations: AuditRecommendation[] = [];

  input.tools.forEach((usage) => {
    const rec = evaluateTool(usage, input.primaryUseCase);
    if (rec) recommendations.push(rec);
  });

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isOptimal = totalMonthlySavings < 100;

  return {
    id: uuidv4(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal,
    createdAt: new Date().toISOString(),
  };
}

function evaluateTool(usage: ToolUsage, useCase: UseCase): AuditRecommendation | null {
  const { tool, plan, monthlySpend, seats } = usage;
  let recommendedAction = 'Keep current plan';
  let monthlySavings = 0;
  let reason = 'Your current plan is optimal for your team size.';
  let alternativeTool: string | undefined;
  let alternativeReason: string | undefined;

  if (tool === 'Cursor') {
    if (plan.toLowerCase() === 'business' && seats < 3) {
      recommendedAction = 'Switch to Cursor Pro';
      monthlySavings = (PRICING.Cursor.Business - PRICING.Cursor.Pro) * seats;
      reason = `Business plan features aren't fully utilized for ${seats} seats. Pro saves $20/user.`;
    }
  } else if (tool === 'GitHub Copilot') {
    if (plan.toLowerCase() === 'enterprise' && seats < 50) {
      recommendedAction = 'Downgrade to GitHub Copilot Business';
      monthlySavings = (PRICING['GitHub Copilot'].Enterprise - PRICING['GitHub Copilot'].Business) * seats;
      reason = `Copilot Enterprise adds audit logs and fine-tuning — overkill for teams under 50. Business saves $20/user.`;
    } else if (plan.toLowerCase() === 'business' && seats < 5) {
      recommendedAction = 'Switch to GitHub Copilot Individual';
      monthlySavings = (PRICING['GitHub Copilot'].Business - PRICING['GitHub Copilot'].Individual) * seats;
      reason = `Business plan admin controls aren't needed for teams under 5. Individual saves $9/user.`;
    }
  } else if (tool === 'ChatGPT') {
    if (plan.toLowerCase() === 'plus' && seats >= 5) {
      recommendedAction = 'Move to ChatGPT Team';
      reason = 'Team plan offers better admin controls and data privacy for teams of 5+.';
    } else if (plan.toLowerCase() === 'enterprise' && seats < 20) {
      recommendedAction = 'Downgrade to ChatGPT Team';
      monthlySavings = (PRICING.ChatGPT.Enterprise - PRICING.ChatGPT.Team) * seats;
      reason = 'Enterprise is likely overkill for a team of this size.';
    }
  } else if (tool === 'Claude') {
    if (plan.toLowerCase() === 'team' && seats < 5) {
      recommendedAction = 'Switch to Claude Pro';
      monthlySavings = (PRICING.Claude.Team - PRICING.Claude.Pro) * seats;
      reason = 'Claude Team has a 5-seat minimum; individual Pro accounts are cheaper for small teams.';
    }
  } else if (tool === 'Windsurf') {
    if (plan.toLowerCase() === 'teams' && seats < 3) {
      recommendedAction = 'Switch to Windsurf Pro';
      monthlySavings = (PRICING.Windsurf.Teams - PRICING.Windsurf.Pro) * seats;
      reason = `Windsurf Teams is designed for 3+ users. Pro plan saves $20/user for small teams.`;
    }
  } else if (tool === 'Anthropic API' || tool === 'OpenAI API' || tool === 'Gemini') {
    if (monthlySpend > 200) {
      recommendedAction = 'Get Credex Credits';
      monthlySavings = monthlySpend * 0.25;
      reason = `Direct API spend at $${monthlySpend}/mo qualifies for Credex credits at 20-30% off retail. Caching repeated prompts can cut token usage by an additional 15-20%.`;
    }
  }

  // General high-spend check
  if (monthlySpend > 500 && monthlySavings === 0) {
    recommendedAction = 'Get Credex Credits';
    monthlySavings = monthlySpend * 0.2;
    reason = 'You are eligible for 20-30% off retail prices via Credex credits.';
  }

  // Alternative tool suggestion — only when plan is already optimal and use case matches
  if (monthlySavings === 0) {
    const alt = ALTERNATIVES[tool];
    if (alt && alt.useCase.includes(useCase)) {
      alternativeTool = alt.alternative;
      alternativeReason = alt.reason;
    }
  }

  return {
    tool,
    currentPlan: plan,
    recommendedAction,
    monthlySavings,
    reason,
    alternativeTool,
    alternativeReason,
  };
}
