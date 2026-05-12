'use client';

import React from 'react';
import { AuditReport } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrendingDown, CheckCircle2, AlertCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ShareModal from './ShareModal';

export default function AuditResults({ report }: { report: AuditReport }) {
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const isHighSavings = report.totalMonthlySavings > 500;
  const isOptimal = report.isOptimal;

  const handleLeadCapture = async () => {
    if (!email || honeypot) return; // Silent fail if bot filled honeypot
    setLoading(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize: report.input.teamSize,
          reportId: report.id,
          totalSavings: report.totalMonthlySavings,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Lead capture failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700 items-start">
      {/* Left Column: Audit Content */}
      <div className="lg:col-span-8 space-y-8">
        {/* Hero Savings Card */}
        {isOptimal ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-8 rounded-2xl shadow-xl text-center"
          >
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">You&apos;re spending well.</h2>
            <p className="text-lg opacity-90 max-w-md mx-auto">
              Your current AI stack looks optimized for your team size and use case. No significant overspend detected.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-xl text-center"
          >
            <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-medium opacity-90 mb-2">Total Potential Savings</h2>
            <div className="flex justify-center items-baseline gap-4 mb-6">
              <span className="text-6xl font-bold">${report.totalMonthlySavings.toLocaleString()}</span>
              <span className="text-2xl opacity-80">/mo</span>
            </div>
            <div className="bg-white/10 rounded-full py-2 px-6 inline-block backdrop-blur-sm border border-white/20">
              That&apos;s <span className="font-bold text-green-300">${report.totalAnnualSavings.toLocaleString()}</span> every year.
            </div>
          </motion.div>
        )}

        {/* Tool Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Breakdown by Tool</h3>
          <div className="grid gap-4">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{rec.tool}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">{rec.currentPlan}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{rec.reason}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-medium">Recommendation</p>
                      <p className="font-semibold text-blue-600">{rec.recommendedAction}</p>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-xs text-gray-500 uppercase font-medium">Savings</p>
                      <p className="font-bold text-green-600">${rec.monthlySavings.toLocaleString()}/mo</p>
                    </div>
                  </div>
                </div>
                {rec.alternativeTool && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-sm">
                    <span className="font-semibold text-amber-800">Alternative: </span>
                    <span className="text-amber-700">{rec.alternativeTool} — {rec.alternativeReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personalized AI Summary */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h4 className="font-bold text-blue-900">Personalized Audit Summary</h4>
          </div>
          <p className="text-blue-800 leading-relaxed italic">
            {report.personalizedSummary || "Analyzing your stack to generate a custom optimization strategy..."}
          </p>
        </div>
      </div>

      {/* Right Column: Lead Capture & Actions (Sticky) */}
      <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-10 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-900">Report Sent!</h3>
              <p className="text-sm text-green-800 mt-2">Check your inbox for the breakdown.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-bold text-gray-900">
                  {isOptimal ? 'Stay in the loop' : 'Capture Savings'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOptimal
                    ? 'Notify me when new optimizations apply to my stack.'
                    : 'Get your full report and Credex credits.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  placeholder="Company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Input 
                  placeholder="Role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                />
                <input type="text" className="hidden" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleLeadCapture}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : isOptimal ? 'Notify Me' : 'Book Consultation'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-white shadow-sm" 
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-4 w-4" /> Share Results
        </Button>

        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
          <p className="text-xs text-orange-800 leading-tight">
            <strong>Insider tip:</strong> {isHighSavings ? 'You qualify for additional 30% credits via Credex.' : 'Even small optimizations compound over time.'}
          </p>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/audit/${report.id}` : ''}
        title="My AI Spend Audit Results"
        reportId={report.id}
        totalSavings={report.totalMonthlySavings}
      />
    </div>
  );
}
