import { runAudit } from './audit-engine';
import { AuditInput } from '@/types';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('Audit Engine', () => {
  test('recommends downgrading Cursor Business to Pro for small teams', () => {
    const input: AuditInput = {
      tools: [{ tool: 'Cursor', plan: 'Business', monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      primaryUseCase: 'coding',
    };
    const report = runAudit(input);
    const rec = report.recommendations.find(r => r.tool === 'Cursor');
    expect(rec?.recommendedAction).toBe('Switch to Cursor Pro');
    expect(rec?.monthlySavings).toBe(40); // (40 - 20) * 2
  });

  test('recommends moving to ChatGPT Team for 5+ seats on Plus', () => {
    const input: AuditInput = {
      tools: [{ tool: 'ChatGPT', plan: 'Plus', monthlySpend: 100, seats: 5 }],
      teamSize: 5,
      primaryUseCase: 'coding',
    };
    const report = runAudit(input);
    const rec = report.recommendations.find(r => r.tool === 'ChatGPT');
    expect(rec?.recommendedAction).toBe('Move to ChatGPT Team');
  });

  test('identifies Credex credit opportunities for high spend', () => {
    const input: AuditInput = {
      tools: [{ tool: 'OpenAI API', plan: 'Direct', monthlySpend: 1000, seats: 1 }],
      teamSize: 10,
      primaryUseCase: 'mixed',
    };
    const report = runAudit(input);
    const rec = report.recommendations.find(r => r.tool === 'OpenAI API');
    expect(rec?.recommendedAction).toBe('Get Credex Credits');
    expect(rec?.monthlySavings).toBeGreaterThan(0);
  });

  test('recommends Claude Pro over Team for teams < 5', () => {
    const input: AuditInput = {
      tools: [{ tool: 'Claude', plan: 'Team', monthlySpend: 90, seats: 3 }],
      teamSize: 3,
      primaryUseCase: 'writing',
    };
    const report = runAudit(input);
    const rec = report.recommendations.find(r => r.tool === 'Claude');
    expect(rec?.recommendedAction).toBe('Switch to Claude Pro');
    expect(rec?.monthlySavings).toBe(30); // (30 - 20) * 3
  });

  test('correctly calculates total annual savings', () => {
    const input: AuditInput = {
      tools: [
        { tool: 'Cursor', plan: 'Business', monthlySpend: 80, seats: 2 },
        { tool: 'Claude', plan: 'Team', monthlySpend: 90, seats: 3 }
      ],
      teamSize: 5,
      primaryUseCase: 'coding',
    };
    const report = runAudit(input);
    const totalMonthly = 40 + 30; // From previous tests
    expect(report.totalMonthlySavings).toBe(totalMonthly);
    expect(report.totalAnnualSavings).toBe(totalMonthly * 12);
  });

  test('marks report as optimal when total savings < $100', () => {
    const input: AuditInput = {
      tools: [{ tool: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    };
    const report = runAudit(input);
    expect(report.totalMonthlySavings).toBe(0);
    expect(report.isOptimal).toBe(true);
  });

  test('suggests alternative tool when plan is optimal and use case matches', () => {
    const input: AuditInput = {
      tools: [{ tool: 'GitHub Copilot', plan: 'Individual', monthlySpend: 10, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    };
    const report = runAudit(input);
    const rec = report.recommendations.find(r => r.tool === 'GitHub Copilot');
    expect(rec?.alternativeTool).toBe('Windsurf Pro');
  });
});
