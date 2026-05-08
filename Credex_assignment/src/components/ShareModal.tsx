'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Link as LinkIcon, Check, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title: string;
  reportId?: string;
  totalSavings?: number;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  onClick?: () => void;
}

export default function ShareModal({ isOpen, onClose, shareUrl, title, reportId }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [recipientEmail, setRecipientEmail] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setIsSending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recipientEmail,
          reportId: reportId,
          totalSavings: totalSavings,
          source: 'share_modal'
        }),
      });
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setShowEmailForm(false);
        setRecipientEmail('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send email share', error);
    } finally {
      setIsSending(false);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      color: 'bg-[#0077b5]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      color: 'bg-[#1da1f2]',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      color: 'bg-[#1877f2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-gray-600',
      onClick: () => setShowEmailForm(true),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {showEmailForm && (
                    <button 
                      onClick={() => setShowEmailForm(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-1"
                    >
                      <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">
                    {showEmailForm ? 'Send to Email' : 'Share Results'}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!showEmailForm ? (
                  <motion.div
                    key="options"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                  >
                    {shareOptions.map((option) => {
                      const isExternal = !!option.href;
                      return (
                        <a
                          key={option.name}
                          href={option.href || '#'}
                          onClick={(e) => {
                            if (!isExternal && option.onClick) {
                              e.preventDefault();
                              option.onClick();
                            }
                          }}
                          target={isExternal ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
                        >
                          <div className={`${option.color} text-white p-2 rounded-lg`}>
                            {option.icon}
                          </div>
                          <span className="font-medium text-gray-700">{option.name}</span>
                        </a>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="email-form"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="mb-8"
                  >
                    {isSent ? (
                      <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
                        <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="font-bold text-green-900 text-lg">Report Sent!</p>
                        <p className="text-green-800 text-sm">Check the inbox for your audit results.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleEmailSend} className="space-y-4">
                        <p className="text-sm text-gray-600">Enter the email address where you want to receive the audit results.</p>
                        <div className="space-y-3">
                          <Input
                            placeholder="Recipient's Email"
                            type="email"
                            required
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            autoFocus
                          />
                          <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSending}
                          >
                            {isSending ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                            ) : (
                              <><Send className="mr-2 h-4 w-4" /> Send Report</>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500">Or copy link</p>
                <div className="flex gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent border-none focus:ring-0 text-sm text-gray-600 flex-1 px-2"
                  />
                  <Button
                    onClick={handleCopy}
                    className={`shrink-0 ${copied ? 'bg-green-600' : 'bg-blue-600'} hover:opacity-90 h-9`}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <LinkIcon className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
