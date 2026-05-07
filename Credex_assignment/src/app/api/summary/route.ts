import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuditReport } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { auditData }: { auditData: AuditReport } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is missing, using fallback summary');
      return NextResponse.json({ summary: generateFallbackSummary(auditData) });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Attempting Gemini with model: gemini-1.5-flash');

    const prompt = `Generate a 100-word personalized summary for an AI spend audit. 
    Total Monthly Savings: $${auditData.totalMonthlySavings}.
    Total Annual Savings: $${auditData.totalAnnualSavings}.
    Tools: ${auditData.recommendations.map((r) => r.tool).join(', ')}.
    Focus on the biggest savings and the value of Credex credits. Tone: Professional, entrepreneurial. 
    Keep it strictly under 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text() || generateFallbackSummary(auditData);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    return NextResponse.json({ 
      summary: "Credex AI Audit Analysis: We've identified high-impact savings opportunities through plan optimization and infrastructure credits." 
    });
  }
}

function generateFallbackSummary(auditData: AuditReport) {
  const topTool = auditData.recommendations.sort((a, b) => b.savings - a.savings)[0];
  return `Credex Executive Summary: Our analysis reveals a massive efficiency gap in your AI infrastructure. By optimizing your ${auditData.recommendations.length} primary tools, specifically targeting ${topTool?.tool || 'high-spend areas'}, you can capture $${auditData.totalAnnualSavings.toLocaleString()} in annual run-rate savings. We recommend immediate migration to Credex-partnered tiers to unlock additional infrastructure credits and stabilize your burn rate.`;
}
