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
    console.log('Using model: gemini-1.5-flash');

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
      summary: "We've analyzed your AI spend and identified several high-impact savings opportunities through plan optimization and Credex credits." 
    });
  }
}

function generateFallbackSummary(auditData: AuditReport) {
  return `Based on your AI stack analysis, you have a significant optimization opportunity with total potential annual savings of $${auditData.totalAnnualSavings.toLocaleString()}. By switching plans for ${auditData.recommendations.length} of your tools and leveraging Credex infrastructure credits, you can drastically reduce your burn without sacrificing performance. We recommend starting with your highest-spend tools to capture immediate ROI.`;
}
