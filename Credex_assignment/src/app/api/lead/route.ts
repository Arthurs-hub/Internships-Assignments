import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { email, company, role, teamSize, reportId, totalSavings } = await req.json();

    // 1. Store in Supabase (if keys exist)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      const { error } = await supabase
        .from('leads')
        .insert([{ 
          email, 
          company, 
          role, 
          team_size: teamSize, 
          report_id: reportId, 
          total_savings: totalSavings 
        }]);
      
      if (error) console.error('Supabase Error:', error);
    }

    // 2. Send Email (if API key exists)
    if (process.env.RESEND_API_KEY) {
      console.log('Attempting to send email via Resend...');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'AI Spend Audit <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI Spend Audit Results',
        html: `<h1>Your Audit is ready</h1><p>You can save $${totalSavings.toLocaleString()} per month.</p>`,
      });

      if (error) {
        console.error('Resend Error:', error);
      } else {
        console.log('Resend Success:', data);
      }
    } else {
      console.warn('RESEND_API_KEY is missing');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
