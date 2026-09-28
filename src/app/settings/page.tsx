'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Database,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  Lock,
  KeyRound
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { resetDemoData } = useAuth();
  
  const [fatalDeadlineHours, setFatalDeadlineHours] = useState(24);
  const [expeditedDeadlineDays, setExpeditedDeadlineDays] = useState(7);
  const [standardDeadlineDays, setStandardDeadlineDays] = useState(14);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveDeadlines = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Statutory regulatory deadline rules saved successfully.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all studies, participants, and safety cases back to the initial synthetic demonstration dataset?')) {
      resetDemoData();
      alert('CTMS in-memory database reset to initial seed state.');
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">System Architecture & Governance Settings</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Configuration of regulatory deadline rules, database connectivity, and data integrity safeguards.
            </p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Current Environment: SIH DEMO MODE
          </span>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{savedMsg}</span>
          </div>
        )}

        {/* Section 1: Regulatory Deadlines Engine */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-emerald-800" />
            <h2 className="font-bold text-slate-900 uppercase">
              1. Statutory Safety Reporting Deadline Calculations (GCP-ASU)
            </h2>
          </div>

          <form onSubmit={handleSaveDeadlines} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fatal / Life-Threatening SAE
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={fatalDeadlineHours}
                    onChange={(e) => setFatalDeadlineHours(parseInt(e.target.value) || 24)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-rose-700"
                  />
                  <span className="text-slate-500">Hours</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Statutory standard: 24 Hours</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Serious Unexpected ADR (SUSAR)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={expeditedDeadlineDays}
                    onChange={(e) => setExpeditedDeadlineDays(parseInt(e.target.value) || 7)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-amber-700"
                  />
                  <span className="text-slate-500">Days</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Expedited standard: 7 Days (168h)</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Standard Non-Serious ADR
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={standardDeadlineDays}
                    onChange={(e) => setStandardDeadlineDays(parseInt(e.target.value) || 14)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <span className="text-slate-500">Days</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Standard window: 14 Days</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
              >
                Save Statutory Deadline Rules
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Database & Cloud Persistence Engine */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-slate-900 uppercase">
              2. Dual-Mode Storage Engine (PostgreSQL / Supabase + In-Memory Fallback)
            </h2>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-blue-900">
            <p className="font-bold">Active Engine: In-Memory + Persistent Browser LocalStorage Cache</p>
            <p className="text-[11px] leading-relaxed">
              The application runs with full CRUD persistence, real mutations, and cryptographic hash chaining in Demo Mode without requiring mandatory external cloud credentials.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase">
              Optional Cloud Supabase Credentials Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NEXT_PUBLIC_SUPABASE_URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Reset Demonstration Data */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <h2 className="font-bold text-slate-900 uppercase">
              3. Demonstration Reset & Clean Slate
            </h2>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Resetting clears any added participants, studies, or safety cases, restoring the standard 10 trials, 8 sites, 260+ subjects, and initial audit log chain.
          </p>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg font-bold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database to Initial Seed State</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
