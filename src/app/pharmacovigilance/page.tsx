'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Plus,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  FileText,
  Building2,
  Stethoscope,
  TrendingUp,
  Award
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { SafetyCase } from '@/types';

export default function PharmacovigilancePage() {
  const { user, hasPermission } = useAuth();
  
  const [cases, setCases] = useState<SafetyCase[]>(ctmsStore.getState().safetyCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setCases(ctmsStore.getState().safetyCases);
    });
    return () => unsub();
  }, []);

  const totalCases = cases.length;
  const seriousCount = cases.filter((c) => c.isSerious).length;
  const urgentCount = cases.filter((c) => c.regulatoryDeadlineHours <= 24 && c.submissionStatus !== 'Closed').length;
  const pendingReview = cases.filter((c) => c.submissionStatus === 'Draft' || c.submissionStatus === 'Submitted to NPvCC').length;

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.syntheticParticipantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.eventTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.suspectedProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studyCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'serious' && c.isSerious) ||
      (filterType === 'urgent' && c.regulatoryDeadlineHours <= 24) ||
      (filterType === 'dsmb' && c.dsmbReviewStatus === 'Pending DSMB');

    return matchesSearch && matchesFilter;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Institutional Apex Header */}
        <div className="bg-gradient-to-r from-[#0b192c] via-[#0f2922] to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                National Apex Coordination Centre
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 text-xs font-semibold">ASU&H Pharmacovigilance Program of India</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AIIA National Pharmacovigilance Command Centre (NPvCC)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Centralized AE, ADR, and Serious Adverse Event (SAE) reporting infrastructure for Ayurvedic, Siddha, Unani, and Homeopathic clinical trials and post-marketing surveillance.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {hasPermission('canCreateSafetyReport') && (
              <Link
                href="/pharmacovigilance/new"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-950/50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Report New AE / ADR / SAE</span>
              </Link>
            )}
          </div>
        </div>

        {/* Triage & Deadline Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Safety Cases</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalCases}</p>
            <p className="text-[10px] text-slate-500">ICSR dossiers filed</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700 uppercase">24-Hour Urgent Clock</span>
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-rose-700">{urgentCount}</p>
            <p className="text-[10px] text-rose-600 font-medium">Fatal / Life-threatening SAEs</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Serious ADRs (7-Day)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-800">{seriousCount}</p>
            <p className="text-[10px] text-amber-700 font-medium">Expedited regulatory triage</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">DSMB Signal Review</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-800">
              {cases.filter(c => c.dsmbReviewStatus === 'DSMB Concurrence').length}
            </p>
            <p className="text-[10px] text-slate-500">Board consensus achieved</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search case #, subject, formulation, or event..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setFilterType('urgent')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                filterType === 'urgent' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              24h Urgent Clock
            </button>
            <button
              onClick={() => setFilterType('serious')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                filterType === 'serious' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Serious Only (SAE)
            </button>
            <button
              onClick={() => setFilterType('dsmb')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                filterType === 'dsmb' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              Pending DSMB
            </button>
          </div>
        </div>

        {/* Safety Cases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              NPvCC Individual Case Safety Reports (ICSR) Log ({filtered.length})
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              WHO-UMC Causality Algorithm
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Case # / Severity</th>
                  <th className="py-3 px-3">Subject / Protocol</th>
                  <th className="py-3 px-3">Event Diagnosis & Ayush Equivalent</th>
                  <th className="py-3 px-3">Suspected ASU Formulation</th>
                  <th className="py-3 px-3">Causality (WHO-UMC)</th>
                  <th className="py-3 px-3">Deadline Window</th>
                  <th className="py-3 px-3">Regulatory Status</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{c.caseNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mt-1 ${
                          c.isSerious
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.isSerious ? 'SAE (SERIOUS)' : 'ADR (NON-SERIOUS)'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-slate-800">{c.syntheticParticipantId}</p>
                      <p className="text-[11px] text-slate-500">{c.studyCode}</p>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-bold text-slate-900">{c.eventTerm}</p>
                      <p className="text-[10px] text-emerald-800 font-medium">{c.ayushTermEquivalent}</p>
                      <span className="text-[10px] text-slate-400 font-mono">MedDRA Syn: {c.meddraSyntheticCode}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-semibold text-slate-800">{c.suspectedProduct}</p>
                      <p className="text-[11px] text-slate-500">{c.ayushDosageForm} · Batch: {c.batchNumber}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit ${
                          c.causalityAssessment === 'Certain'
                            ? 'bg-rose-100 text-rose-800'
                            : c.causalityAssessment === 'Probable / Likely'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.causalityAssessment}
                      </span>
                      <span className="text-[10px] text-slate-400">Naranjo: {c.naranjoScore || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold text-[11px] ${
                          c.regulatoryDeadlineHours <= 24 ? 'text-rose-600 font-mono' : 'text-slate-700'
                        }`}
                      >
                        {c.regulatoryDeadlineHours} Hours
                      </span>
                      <p className="text-[10px] text-slate-500">Due: {c.deadlineDate.split('T')[0]}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.submissionStatus === 'Forwarded to CDSCO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.submissionStatus === 'Submitted to NPvCC'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.submissionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/pharmacovigilance/${c.id}`}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 inline-flex items-center space-x-0.5"
                      >
                        <span>Case Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
