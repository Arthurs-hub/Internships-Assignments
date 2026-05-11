import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import AuditResults from '@/components/AuditResults';
import { AuditReport } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getAudit(id: string): Promise<AuditReport | null> {
  console.log('[getAudit] id:', id);
  console.log('[getAudit] SUPABASE_URL:', process.env.SUPABASE_URL ? 'set' : 'missing');
  console.log('[getAudit] SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'set' : 'missing');

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!process.env.SUPABASE_URL || !supabaseKey) return null;
  
  const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);
  const { data, error } = await supabase
    .from('audits')
    .select('data')
    .eq('id', id)
    .single();

  console.log('[getAudit] data:', data);
  console.log('[getAudit] error:', error);
    
  if (error || !data) return null;
  const raw = data.data;
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as AuditReport;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const audit = await getAudit(params.id);
  
  if (!audit) {
    return { title: 'Audit Not Found - Credex' };
  }

  return {
    title: `AI Spend Audit: $${audit.totalMonthlySavings.toLocaleString()}/mo Savings`,
    description: `I just saved $${audit.totalAnnualSavings.toLocaleString()} on my AI stack using Credex. Get your free audit now.`,
    openGraph: {
      title: 'AI Spend Audit Results',
      description: `Potential savings: $${audit.totalMonthlySavings.toLocaleString()}/mo`,
      images: ['/og-image.png'], // Placeholder
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Spend Audit Results',
      description: `Potential savings: $${audit.totalMonthlySavings.toLocaleString()}/mo`,
    },
  };
}

export default async function AuditPage({ params }: { params: { id: string } }) {
  const audit = await getAudit(params.id);

  if (!audit) {
    // For demo purposes, if no DB, we could show a placeholder or 404
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AuditResults report={audit} />
      </div>
    </main>
  );
}
