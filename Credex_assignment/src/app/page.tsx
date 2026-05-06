'use client';

import React, { useState } from 'react';
import SpendForm from '@/components/SpendForm';
import AuditResults from '@/components/AuditResults';
import { AuditInput, AuditReport } from '@/types';
import { runAudit } from '@/lib/audit-engine';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async (data: AuditInput) => {
    setLoading(true);
    // Simulate engine processing
    const result = runAudit(data);
    
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditData: result }),
      });
      const { summary } = await response.json();
      result.personalizedSummary = summary;
    } catch (error) {
      console.error('Summary generation failed', error);
    }

    // Save audit to Supabase (via API route)
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit: result }),
      });
    } catch (error) {
      console.error('Audit storage failed', error);
    }

    setReport(result);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>AI Spend Audit by Credex</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Stop overpaying for <span className="text-blue-600">AI tools</span>.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get an instant, defensible audit of your AI spend. Identify the right plans, cheaper alternatives, and exclusive credit opportunities.
          </p>
        </div>

        {!report ? (
          <div className="space-y-8">
            <SpendForm onAudit={handleAudit} />
            {loading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Analyzing stack and benchmarking costs...</p>
              </div>
            )}
          </div>
        ) : (
          <AuditResults 
            report={report} 
            onShare={() => alert('Share functionality coming soon!')} 
          />
        )}

        {/* Footer / Social Proof Mock */}
        {!report && (
          <div className="pt-12 text-center space-y-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gray-200"></span>
              Trusted by founders at
              <span className="h-px w-12 bg-gray-200"></span>
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
              <span className="text-2xl font-bold italic">TechFlow</span>
              <span className="text-2xl font-bold italic">Nexus AI</span>
              <span className="text-2xl font-bold italic">Stellar</span>
              <span className="text-2xl font-bold italic">Orbit</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
