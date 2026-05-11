import { Metadata } from 'next';
import AuditResults from '@/components/AuditResults';
import { AuditReport } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const SUPABASE_URL = 'https://dfpzqambxazdpnryezwj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcHpxYW1ieGF6ZHBucnllendqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxNTMxOCwiZXhwIjoyMDk0MDkxMzE4fQ.ulBI6BNJxDhpNztrV4NHth2KlWeyqBNiT-JDEm23dYg';

async function getAudit(id: string): Promise<AuditReport | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/audits?id=eq.${id}&select=data`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Cache-Control': 'no-store',
        },
        cache: 'no-store',
      }
    );
    const rows = await res.json();
    console.log('[getAudit] status:', res.status, 'rows:', rows.length ?? 'N/A');
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const raw = rows[0].data;
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as AuditReport;
  } catch (e) {
    console.error('[getAudit] error:', e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return { title: 'Audit Not Found - Credex' };
  return {
    title: `AI Spend Audit: $${audit.totalMonthlySavings.toLocaleString()}/mo Savings`,
    description: `I just saved $${audit.totalAnnualSavings.toLocaleString()} on my AI stack using Credex.`,
    openGraph: {
      title: 'AI Spend Audit Results',
      description: `Potential savings: $${audit.totalMonthlySavings.toLocaleString()}/mo`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Spend Audit Results',
      description: `Potential savings: $${audit.totalMonthlySavings.toLocaleString()}/mo`,
    },
  };
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AuditResults report={audit} />
      </div>
    </main>
  );
}
