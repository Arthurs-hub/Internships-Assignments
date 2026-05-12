'use client';

import React from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuditInput, ToolName, UseCase, ToolUsage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Calculator } from 'lucide-react';

const INITIAL_STATE: AuditInput = {
  tools: [],
  teamSize: 1,
  primaryUseCase: 'coding',
};

const TOOL_OPTIONS: ToolName[] = [
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Anthropic API',
  'OpenAI API',
  'Gemini',
  'Windsurf',
];

const TOOL_PLANS: Record<ToolName, string[]> = {
  'Cursor': ['Hobby', 'Pro', 'Business'],
  'GitHub Copilot': ['Individual', 'Business', 'Enterprise'],
  'Claude': ['Free', 'Pro', 'Team'],
  'ChatGPT': ['Plus', 'Team', 'Enterprise'],
  'Anthropic API': ['Direct (Pay-as-you-go)'],
  'OpenAI API': ['Direct (Pay-as-you-go)'],
  'Gemini': ['Free', 'Advanced'],
  'Windsurf': ['Free', 'Pro', 'Teams'],
  'v0': ['Free', 'Premium'],
};

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

export default function SpendForm({ onAudit }: { onAudit: (data: AuditInput) => void }) {
  const [formData, setFormData] = useLocalStorage<AuditInput>('audit-form-data', INITIAL_STATE);

  const addTool = () => {
    const newTool: ToolUsage = {
      tool: 'Cursor',
      plan: 'Pro',
      monthlySpend: 20,
      seats: 1,
    };
    setFormData({ ...formData, tools: [...formData.tools, newTool] });
  };

  const removeTool = (index: number) => {
    const newTools = [...formData.tools];
    newTools.splice(index, 1);
    setFormData({ ...formData, tools: newTools });
  };

  const updateTool = (index: number, updates: Partial<ToolUsage>) => {
    const newTools = [...formData.tools];
    // Reset plan to first option when tool changes
    if (updates.tool && updates.tool !== newTools[index].tool) {
      updates.plan = TOOL_PLANS[updates.tool][0];
    }
    newTools[index] = { ...newTools[index], ...updates };
    setFormData({ ...formData, tools: newTools });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">1. Your AI Stack</h2>
        <div className="space-y-4">
          {formData.tools.map((toolUsage, index) => (
            <div key={index} className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
                <select
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={toolUsage.tool}
                  onChange={(e) => updateTool(index, { tool: e.target.value as ToolName })}
                >
                  {TOOL_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={toolUsage.plan}
                  onChange={(e) => updateTool(index, { plan: e.target.value })}
                >
                  {(TOOL_PLANS[toolUsage.tool] ?? []).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Spend ($/mo)</label>
                <Input
                  type="number"
                  value={toolUsage.monthlySpend}
                  onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <Input
                  type="number"
                  value={toolUsage.seats}
                  onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeTool(index)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed py-6"
          onClick={addTool}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Tool
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Total Team Size</label>
          <Input
            type="number"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Primary Use Case</label>
          <select
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.primaryUseCase}
            onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as UseCase })}
          >
            {USE_CASES.map((u) => (
              <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full text-lg h-14" disabled={formData.tools.length === 0}>
        <Calculator className="mr-2 h-5 w-5" /> Generate Instant Audit
      </Button>
    </form>
  );
}
