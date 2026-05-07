'use client';

import React from 'react';
import { AuditReport } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrendingDown, CheckCircle2, AlertCircle, ArrowRight, Share2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditResults({ report }: { report: AuditReport }) {
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const isOptimal = report.totalMonthlySavings < 100;
  const highSavings = report.totalMonthlySavings > 500;

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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/audit/${report.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const LeadFormFields = () => (
    <div className="space-y-3 max-w-md mx-auto text-left">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
        <Input 
          placeholder="your@email.com" 
          type="email"
          required
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Company</label>
          <Input 
            placeholder="e.g. Acme Inc" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Role</label>
          <Input 
            placeholder="e.g. CTO" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>
      {/* Honeypot field - hidden from users */}
      <input 
        type="text" 
        className="hidden" 
        value={honeypot} 
        onChange={(e) => setHoneypot(e.target.value)} 
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Savings Card */}
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

      {/* Tool Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Breakdown by Tool</h3>
        <div className="grid gap-4">
          {report.recommendations.map((rec, i) => (
            <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{rec.tool}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">{rec.currentPlan}</span>
                </div>
                <p className="text-gray-600 text-sm">{rec.reason}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium">Recommendation</p>
                  <p className="font-semibold text-blue-600">{rec.recommendedAction}</p>
                </div>
                <div className="w-24 text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium">Savings</p>
                  <p className="font-bold text-green-600">${rec.monthlySavings}/mo</p>
                </div>
              </div>
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

      {/* Lead Generation Section */}
      {submitted ? (
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-900">Report Sent!</h3>
          <p className="text-green-800">Check your inbox for the full breakdown and Credex guide.</p>
        </div>
      ) : highSavings ? (
        <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl text-center space-y-6">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-orange-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-orange-900">You&apos;re leaving money on the table.</h3>
            <p className="text-orange-800 max-w-md mx-auto">
              Your savings qualify you for Credex Insider Credits. Capture more savings through our exclusive partner pool.
            </p>
          </div>
          <div className="space-y-4">
            <LeadFormFields />
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 w-full max-w-md mx-auto"
              onClick={handleLeadCapture}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Book Consultation'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : isOptimal ? (
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center space-y-6">
          <h3 className="text-2xl font-bold text-green-900">You&apos;re spending well!</h3>
          <p className="text-green-800">
            Your setup is highly optimized. We&apos;ll notify you when new credits or plans become available.
          </p>
          <div className="space-y-4">
            <LeadFormFields />
            <Button className="w-full max-w-md mx-auto" onClick={handleLeadCapture} disabled={loading}>
              {loading ? 'Submitting...' : 'Notify Me'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Capture this Audit</h3>
            <p className="text-gray-600">Enter your details to receive the full report and optimization guide.</p>
          </div>
          <div className="space-y-4">
            <LeadFormFields />
            <Button className="w-full max-w-md mx-auto" onClick={handleLeadCapture} disabled={loading}>
              {loading ? 'Sending...' : 'Get Report'} <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Share Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" /> {copied ? 'Link Copied!' : 'Share Results'}
        </Button>
      </div>
    </div>
  );
}
