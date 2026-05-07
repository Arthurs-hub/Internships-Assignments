import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { email, reportId, totalSavings } = await req.json();

    // 1. Store in Supabase (if keys exist)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      const { error } = await supabase
        .from('leads')
        .insert([{ email, report_id: reportId, total_savings: totalSavings }]);
      
      if (error) console.error('Supabase Error:', error);
    }

    // 2. Send Email (if API key exists)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Audit <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI Spend Audit Results',
        html: `<h1>Your Audit is ready</h1><p>You can save $${totalSavings.toLocaleString()} per month.</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
