import { Metadata } from 'next';
import AuditResults from '@/components/AuditResults';
import { AuditReport } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getAudit(id: string): Promise<AuditReport | null> {
  const url = process.env.SUPABASE_URL || 'https://dfpzqambxazdpnryezwj.supabase.co';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcHpxYW1ieGF6ZHBucnllendqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxNTMxOCwiZXhwIjoyMDk0MDkxMzE4fQ.ulBI6BNJxDhpNztrV4NHth2KlWeyqBNiT-JDEm23dYg';
  if (!url || !key) { console.log('[getAudit] missing env vars'); return null; }

  const res = await fetch(
    `${url}/rest/v1/audits?id=eq.${id}&select=data`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store' }
  );
  console.log('[getAudit] fetch url:', `${url}/rest/v1/audits?id=eq.${id}&select=data`);
  console.log('[getAudit] status:', res.status);
  const text = await res.text();
  console.log('[getAudit] body:', text.slice(0, 200));
  const rows = JSON.parse(text);
  console.log('[getAudit] rows:', JSON.stringify(rows));
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const raw = rows[0].data;
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
