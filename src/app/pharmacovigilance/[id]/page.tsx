'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  Printer,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  UserCheck,
  Send,
  FileText,
  Stethoscope
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { SafetyCase } from '@/types';

export default function SafetyCaseDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [safetyCase, setSafetyCase] = useState<SafetyCase | null>(null);

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      const c = ctmsStore.getState().safetyCases.find((item) => item.id === id);
      setSafetyCase(c || null);
    });
    const found = ctmsStore.getState().safetyCases.find((item) => item.id === id);
    setSafetyCase(found || null);
    return () => unsub();
  }, [id]);

  if (!safetyCase) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">Safety case not found.</p>
          <Link href="/pharmacovigilance" className="inline-block mt-2 text-xs font-semibold text-rose-700">
            ← Return to Safety Desk
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleForwardToCDSCO = () => {
    if (confirm('Forward this safety case dossier to Central Drugs Standard Control Organisation (CDSCO) & DSMB?')) {
      ctmsStore.updateSafetyCase(safetyCase.id, {
        submissionStatus: 'Forwarded to CDSCO',
        submissionDate: new Date().toISOString(),
        ackReference: `CDSCO-ACK-2026-${Math.floor(1000 + Math.random() * 9000)}`
      });
      alert('Case dossier transmitted to CDSCO with formal transmission acknowledgement.');
    }
  };

  const handleCloseCase = () => {
    if (confirm('Mark this adverse event case resolved and closed in NPvCC database?')) {
      ctmsStore.updateSafetyCase(safetyCase.id, {
        submissionStatus: 'Closed'
      });
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 text-xs">
        {/* Header Navigation & Action Bar */}
        <div className="no-print flex items-center justify-between">
          <Link
            href="/pharmacovigilance"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to NPvCC Safety Desk</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center space-x-1.5 border border-slate-300 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print CIOMS-I Dossier</span>
            </button>

            {hasPermission('canSubmitToAuthority') && safetyCase.submissionStatus !== 'Forwarded to CDSCO' && safetyCase.submissionStatus !== 'Closed' && (
              <button
                onClick={handleForwardToCDSCO}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Forward to CDSCO</span>
              </button>
            )}

            {safetyCase.submissionStatus !== 'Closed' && (
              <button
                onClick={handleCloseCase}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Close Case</span>
              </button>
            )}
          </div>
        </div>

        {/* Formal Institutional CIOMS-I / MedWatch Format Dossier */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          {/* Institutional Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                Ministry of Ayush · National Pharmacovigilance Program of India
              </span>
              <h1 className="text-lg font-black text-slate-900 mt-0.5">
                INDIVIDUAL CASE SAFETY REPORT (ICSR) DOSSIER
              </h1>
              <p className="text-[11px] text-slate-500 font-mono">
                NPvCC Coordinating Centre · All India Institute of Ayurveda, New Delhi
              </p>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-rose-700 font-mono block">
                {safetyCase.caseNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                Status: {safetyCase.submissionStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Section 1: Administrative Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Protocol Code</span>
              <span className="font-bold text-slate-800">{safetyCase.studyCode}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Subject Synthetic ID</span>
              <span className="font-mono font-bold text-slate-900">{safetyCase.syntheticParticipantId}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Reporting Site</span>
              <span className="font-semibold text-slate-800">{safetyCase.siteName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Report Received</span>
              <span className="font-semibold text-slate-800">{safetyCase.receivedDate.split('T')[0]}</span>
            </div>
          </div>

          {/* Section 2: Adverse Event Description & Seriousness */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5">
              I. Reaction / Adverse Event Specifics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px] block">Event Term:</span>
                <p className="font-bold text-slate-900 text-sm">{safetyCase.eventTerm}</p>
                <p className="text-[11px] text-emerald-800 font-medium">Classical Ayush Term: {safetyCase.ayushTermEquivalent}</p>
                <p className="text-[10px] text-slate-400 font-mono">MedDRA Code: {safetyCase.meddraSyntheticCode}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px] block">Onset & Clinical Outcome:</span>
                <p className="text-slate-800">Onset Date: <strong>{safetyCase.eventOnsetDate}</strong></p>
                <p className="text-slate-800">Outcome: <strong>{safetyCase.outcome}</strong></p>
                <p className="text-slate-800">Severity: <strong>{safetyCase.severity}</strong> · Expectedness: <strong>{safetyCase.expectedness}</strong></p>
              </div>
            </div>

            {/* Seriousness Checklist */}
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1.5">
              <span className="font-bold text-rose-900 text-[11px] uppercase block">
                Seriousness Criteria Fulfilled:
              </span>
              <div className="flex flex-wrap gap-2">
                {safetyCase.seriousnessCriteria.length > 0 ? (
                  safetyCase.seriousnessCriteria.map((crit, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px] uppercase">
                      ✓ {crit.replace('_', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px]">Non-serious adverse reaction</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Suspected Ayush Medication */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5">
              II. Suspected Investigational Product (ASU Formulation)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Product Name</span>
                <p className="font-bold text-slate-900 mt-0.5">{safetyCase.suspectedProduct}</p>
                <p className="text-[11px] text-slate-500">Form: {safetyCase.ayushDosageForm}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Dosage & Batch</span>
                <p className="font-medium text-slate-800 mt-0.5">{safetyCase.dosageAndRoute}</p>
                <p className="text-[11px] text-slate-500 font-mono">Lot: {safetyCase.batchNumber}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Dechallenge / Rechallenge</span>
                <p className="font-medium text-slate-800 mt-0.5">Dechallenge: {safetyCase.dechallenge}</p>
                <p className="text-[11px] text-slate-500">Rechallenge: {safetyCase.rechallenge}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Medical Evaluation & WHO-UMC Algorithm */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5">
              III. Medical Assessment & WHO-UMC Causality Algorithm
            </h2>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Assessed Causality:</span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                    {safetyCase.causalityAssessment}
                  </span>
                </div>
                {safetyCase.naranjoScore && (
                  <span className="text-slate-600 font-medium">Naranjo Score: <strong>{safetyCase.naranjoScore}</strong></span>
                )}
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Clinical Medical Narrative:</span>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {safetyCase.medicalSummary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <span>Medical Reviewer: <strong className="text-slate-800">{safetyCase.assessedBy}</strong></span>
                <span>DSMB Review: <strong className="text-emerald-800">{safetyCase.dsmbReviewStatus}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 5: Regulatory Compliance & Audit Chain */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5">
              IV. Statutory Reporting & Authority Acknowledgement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Reporting Pathway</span>
                <p className="text-slate-800 font-semibold">GCP-ASU Statutory Deadline ({safetyCase.regulatoryDeadlineHours} Hours)</p>
                <p className="text-slate-500 text-[11px]">Deadline Due: {safetyCase.deadlineDate}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Reference</span>
                <p className="font-mono text-emerald-800 font-bold">{safetyCase.ackReference || 'Internal NPvCC Registration'}</p>
                <p className="text-slate-500 text-[11px]">Submission Date: {safetyCase.submissionDate || 'Pending Final Sign-off'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
