import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AuditReport } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { auditData }: { auditData: AuditReport } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ summary: generateFallbackSummary(auditData) });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Generate a 100-word personalized summary for an AI spend audit. 
          Total Monthly Savings: $${auditData.totalMonthlySavings}.
          Total Annual Savings: $${auditData.totalAnnualSavings}.
          Tools: ${auditData.recommendations.map((r) => r.tool).join(', ')}.
          Focus on the biggest savings and the value of Credex credits. Tone: Professional, entrepreneurial.`,
        },
      ],
    });

    const summary = response.content[0].type === 'text' ? response.content[0].text : generateFallbackSummary(auditData);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    const data = await req.json();
    return NextResponse.json({ summary: generateFallbackSummary(data.auditData) });
  }
}

function generateFallbackSummary(auditData: AuditReport) {
  return `Based on your AI stack analysis, you have a significant optimization opportunity with total potential annual savings of $${auditData.totalAnnualSavings.toLocaleString()}. By switching plans for ${auditData.recommendations.length} of your tools and leveraging Credex infrastructure credits, you can drastically reduce your burn without sacrificing performance. We recommend starting with your highest-spend tools to capture immediate ROI.`;
}
