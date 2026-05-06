import { AuditInput, AuditRecommendation, AuditReport, ToolUsage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const PRICING = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
  },
  'GitHub Copilot': {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Team: 30, // Min 5 seats
  },
  ChatGPT: {
    Plus: 20,
    Team: 25, // Billed annually, usually 30 monthly
    Enterprise: 60, // Estimate
  },
};

export function runAudit(input: AuditInput): AuditReport {
  const recommendations: AuditRecommendation[] = [];

  input.tools.forEach((usage) => {
    const rec = evaluateTool(usage);
    if (rec) recommendations.push(rec);
  });

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    id: uuidv4(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    createdAt: new Date().toISOString(),
  };
}

function evaluateTool(usage: ToolUsage): AuditRecommendation | null {
  const { tool, plan, monthlySpend, seats } = usage;
  let recommendedAction = 'Keep current plan';
  let monthlySavings = 0;
  let reason = 'Your current plan is optimal for your team size.';

  if (tool === 'Cursor') {
    if (plan.toLowerCase() === 'business' && seats < 3) {
      recommendedAction = 'Switch to Cursor Pro';
      monthlySavings = (PRICING.Cursor.Business - PRICING.Cursor.Pro) * seats;
      reason = `Business plan features aren't fully utilized for ${seats} seats. Pro saves $20/user.`;
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
  }

  // General check for retail vs credits
  if (monthlySpend > 500 && !recommendedAction.includes('Credex')) {
    recommendedAction = 'Get Credex Credits';
    const potentialSavings = monthlySpend * 0.2; // Assume 20% discount via Credex
    monthlySavings = Math.max(monthlySavings, potentialSavings);
    reason = 'You are eligible for 20-30% off retail prices via Credex credits.';
  }

  return {
    tool,
    currentPlan: plan,
    recommendedAction,
    monthlySavings,
    reason,
  };
}
