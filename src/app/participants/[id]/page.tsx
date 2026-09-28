'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Users2,
  ArrowLeft,
  Calendar,
  Building2,
  FileCheck2,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Stethoscope,
  ExternalLink
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { Participant } from '@/types';

export default function ParticipantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      const p = ctmsStore.getState().participants.find((item) => item.id === id);
      setParticipant(p || null);
    });
    const found = ctmsStore.getState().participants.find((item) => item.id === id);
    setParticipant(found || null);
    return () => unsub();
  }, [id]);

  if (!participant) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">Participant record not found.</p>
          <Link href="/participants" className="inline-block mt-2 text-xs font-semibold text-emerald-800">
            ← Return to Registry
          </Link>
        </div>
      </AppShell>
    );
  }

  const relatedSafety = ctmsStore.getState().safetyCases.filter(
    (c) => c.syntheticParticipantId === participant.syntheticId
  );

  const visits = [
    { name: 'Visit 1 (Day 0 - Baseline & Dispensing)', targetDate: participant.screeningDate, status: 'completed', vitals: 'Normal', compliance: '100%' },
    { name: 'Visit 2 (Day 14 - Follow-up)', targetDate: '2024-07-28', status: participant.completedVisitsCount >= 2 ? 'completed' : 'scheduled', vitals: 'Normal', compliance: '98%' },
    { name: 'Visit 3 (Day 28 - Safety Evaluation)', targetDate: '2024-08-12', status: participant.completedVisitsCount >= 3 ? 'completed' : 'scheduled', vitals: 'Reviewed', compliance: '95%' },
    { name: 'Visit 4 (Day 60 - Interim Efficacy)', targetDate: '2024-09-15', status: participant.completedVisitsCount >= 4 ? 'completed' : 'scheduled', vitals: 'Normal', compliance: '96%' },
    { name: 'Visit 5 (Day 90 - Secondary Endpoints)', targetDate: '2024-10-14', status: participant.completedVisitsCount >= 5 ? 'completed' : 'scheduled', vitals: 'Scheduled', compliance: 'Pending' },
    { name: 'Visit 6 (Day 120 - End of Study Lock)', targetDate: '2024-11-15', status: participant.completedVisitsCount >= 6 ? 'completed' : 'scheduled', vitals: 'Scheduled', compliance: 'Pending' }
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 text-xs">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/participants"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Participants Registry</span>
          </Link>
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {participant.studyCode} · {participant.siteCode}
          </span>
        </div>

        {/* Participant Dossier Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-900 font-mono">
                  {participant.syntheticId}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {participant.currentStatus}
                </span>
                {participant.randomizationId && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                    Randomized: {participant.randomizationId}
                  </span>
                )}
              </div>
              <p className="text-slate-500 mt-1">
                Screening Ref: <strong className="text-slate-700">{participant.screeningNumber}</strong> · Demographics: {participant.age} years, {participant.gender}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Treatment Arm</span>
              <span className="font-bold text-emerald-800">{participant.treatmentArm || 'Blinded Group'}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Consent Status</span>
              <span className="font-bold text-emerald-800">{participant.consentStatus}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Date: {participant.consentDate || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Enrolment Date</span>
              <span className="font-bold text-slate-800">{participant.enrolmentDate || 'Screen Failure'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Eligibility: {participant.eligibilityStatus}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Visit Completion</span>
              <span className="font-bold text-slate-800">{participant.completedVisitsCount} / {participant.totalScheduledVisits}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Scheduled timeline</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Medication Adherence</span>
              <span className="font-bold text-emerald-800">{participant.adherencePercentage}%</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Pill count verified</span>
            </div>
          </div>

          {/* Scheduled Visit Matrix */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Scheduled Study Visit Matrix & Adherence
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {visits.map((v, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{v.name}</p>
                    <p className="text-[11px] text-slate-500">Planned Window: {v.targetDate} · Vitals: {v.vitals}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-semibold text-slate-600">Compliance: {v.compliance}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Case Dossier Link if Any */}
          {relatedSafety.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>Pharmacovigilance Safety Dossier Logged</span>
              </div>
              {relatedSafety.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-rose-900">{c.caseNumber}</span>: {c.eventTerm} ({c.severity})
                  </div>
                  <Link
                    href={`/pharmacovigilance/${c.id}`}
                    className="font-bold text-rose-800 underline hover:text-rose-900"
                  >
                    View NPvCC Dossier →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
