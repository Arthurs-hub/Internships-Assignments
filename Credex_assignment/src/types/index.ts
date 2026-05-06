export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Gemini' 
  | 'Windsurf' 
  | 'v0';

export type PlanType = string;

export interface ToolUsage {
  tool: ToolName;
  plan: PlanType;
  monthlySpend: number;
  seats: number;
}

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface AuditInput {
  tools: ToolUsage[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface AuditRecommendation {
  tool: ToolName;
  currentPlan: PlanType;
  recommendedAction: string;
  monthlySavings: number;
  reason: string;
}

export interface AuditReport {
  id: string;
  input: AuditInput;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  personalizedSummary?: string;
  createdAt: string;
}
