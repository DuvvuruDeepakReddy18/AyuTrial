'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  ArrowLeft,
  Building2,
  Users2,
  Calendar,
  FileCheck2,
  Award,
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Plus,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Stethoscope
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Study, StudyStatus } from '@/types';

export default function StudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [study, setStudy] = useState<Study | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'team' | 'milestones' | 'safety' | 'deviations'>('overview');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      const found = ctmsStore.getState().studies.find((s) => s.id === id);
      setStudy(found || null);
    });

    const initial = ctmsStore.getState().studies.find((s) => s.id === id);
    setStudy(initial || null);

    return () => unsub();
  }, [id]);

  if (!study) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Study Protocol Not Found</h2>
          <p className="text-xs text-slate-500">The requested protocol ID ({id}) does not exist in the active clinical database.</p>
          <Link href="/studies" className="inline-block px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold">
            ← Back to Studies Portfolio
          </Link>
        </div>
      </AppShell>
    );
  }

  const allSites = ctmsStore.getState().sites.filter((s) => study.participatingSiteIds.includes(s.id));
  const relatedSafetyCases = ctmsStore.getState().safetyCases.filter((c) => c.studyId === study.id);
  const relatedDeviations = ctmsStore.getState().deviations.filter((d) => d.studyId === study.id);

  const progressPct = Math.min(100, Math.round((study.enrolledCount / study.plannedTarget) * 100));

  // Visual Study Lifecycle Stages
  const lifecycleStages = [
    { title: 'Protocol Draft', status: 'completed' },
    { title: 'IEC Submission', status: 'completed' },
    { title: 'IEC Approval', status: study.iecStatus === 'Approved' ? 'completed' : 'in_progress' },
    { title: 'CTRI Registration', status: study.ctriStatus === 'Registered' ? 'completed' : 'in_progress' },
    { title: 'Site Activation', status: study.status === 'recruiting' || study.status === 'active' || study.status === 'completed' ? 'completed' : 'in_progress' },
    { title: 'Participant Screening', status: study.screenedCount > 0 ? 'completed' : 'pending' },
    { title: 'Enrolment', status: study.enrolledCount > 0 ? (study.enrolledCount >= study.plannedTarget ? 'completed' : 'in_progress') : 'pending' },
    { title: 'Follow-up Visits', status: study.completedCount > 0 ? 'in_progress' : 'pending' },
    { title: 'Data Review', status: study.status === 'completed' ? 'completed' : 'pending' },
    { title: 'Study Close-out', status: study.status === 'completed' ? 'completed' : 'pending' }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/studies" className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Studies Portfolio</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {study.code}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {study.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {study.title}
            </h1>
            <p className="text-xs text-slate-500">
              Protocol: <span className="font-mono text-slate-700">{study.protocolNumber} ({study.protocolVersion})</span> · PI: <span className="font-semibold text-slate-700">{study.principalInvestigator}</span> · Phase: {study.phase}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {hasPermission('canEditStudy') && (
              <Link
                href={`/studies/${study.id}/edit`}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center space-x-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Protocol</span>
              </Link>
            )}
            {hasPermission('canCreateSafetyReport') && (
              <Link
                href="/pharmacovigilance/new"
                className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center space-x-1.5 transition"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Report SAE</span>
              </Link>
            )}
            {hasPermission('canRegisterParticipant') && (
              <Link
                href="/screening"
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Screen Participant</span>
              </Link>
            )}
          </div>
        </div>

        {/* Visual Study Lifecycle Stepper */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Standardized Clinical Trial Lifecycle Pipeline
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">GCP-ASU Regulatory Roadmap</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[760px] justify-between relative">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-200 -z-0" />
              {lifecycleStages.map((stage, idx) => {
                const isDone = stage.status === 'completed';
                const isCurrent = stage.status === 'in_progress';
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 text-center px-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                          : isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium max-w-[70px] leading-tight ${isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                      {stage.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics Quick Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Enrolment Target</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{study.enrolledCount} / {study.plannedTarget}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Screened</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{study.screenedCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Screen failure rate: ~18%</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Active Sites</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{study.participatingSiteIds.length}</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">All sites active</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">CTRI Status</p>
            <p className="text-sm font-bold text-emerald-800 mt-1 truncate">{study.ctriStatus}</p>
            <p className="text-[10px] font-mono text-slate-500 truncate">{study.ctriNumber}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">IEC Approval</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{study.iecStatus}</p>
            <p className="text-[10px] text-slate-500">Exp: {study.iecExpiryDate || 'Active'}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Safety Reports</p>
            <p className="text-lg font-black text-rose-700 mt-0.5">{relatedSafetyCases.length}</p>
            <p className="text-[10px] text-rose-600 font-medium">Logged in NPvCC</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
          <nav className="flex space-x-6 text-xs font-semibold overflow-x-auto">
            {[
              { id: 'overview', label: 'Protocol Summary & Design' },
              { id: 'milestones', label: `Milestones (${study.milestones.length})` },
              { id: 'sites', label: `Participating Sites (${allSites.length})` },
              { id: 'team', label: `Clinical Team (${study.assignedTeam.length})` },
              { id: 'safety', label: `Safety Cases (${relatedSafetyCases.length})` },
              { id: 'deviations', label: `Deviations (${relatedDeviations.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-800 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab 1: Protocol Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Protocol Scientific Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Investigational Product (IP):</span>
                  <p className="font-bold text-slate-800">{study.investigationalProduct}</p>
                  <p className="text-[11px] text-slate-500">Ayush System: {study.ayushSystem}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Control / Comparator:</span>
                  <p className="font-bold text-slate-800">{study.comparatorProduct || 'None (Open Label)'}</p>
                  <p className="text-[11px] text-slate-500">Double-dummy matched where applicable</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-700">Clinical Indication / Research Hypothesis:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {study.indication}. Designed to assess efficacy, pharmacokinetic profiles, and biomarker moderation in accordance with Ayurvedic Pharmacopoeia of India (API) standards and GCP-ASU guidelines.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Start Date</span>
                  <span className="font-semibold text-slate-800">{study.startDate}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Planned Completion</span>
                  <span className="font-semibold text-slate-800">{study.endDate}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Documents Archival</span>
                  <span className="font-semibold text-slate-800">{study.documentsCount} Files</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Allocated Budget</span>
                  <span className="font-semibold text-slate-800">₹{study.budgetAllocatedLakhs} Lakhs</span>
                </div>
              </div>
            </div>

            {/* Regulatory Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Regulatory Clearance Summary
              </h2>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">CTRI Registration</span>
                  <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 font-bold text-[10px] rounded">
                    {study.ctriStatus}
                  </span>
                </div>
                <p className="font-mono text-xs text-emerald-900 font-bold">{study.ctriNumber}</p>
                {study.ctriUrl && (
                  <a
                    href={study.ctriUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] text-emerald-800 underline font-semibold mt-1"
                  >
                    <span>View Public CTRI Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Ethics Committee</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold text-[10px] rounded">
                    {study.iecStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{study.iecName}</p>
                <p className="text-[11px] text-slate-500 font-mono">Ref: {study.iecApprovalRef}</p>
                {study.iecExpiryDate && (
                  <p className="text-[11px] text-slate-500">Valid through: {study.iecExpiryDate}</p>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Continuing Review:</strong> Annual ethics progress report submission required 60 days prior to approval expiration.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Milestones */}
        {activeTab === 'milestones' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Clinical Protocol Milestones
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              {study.milestones.map((milestone) => (
                <div key={milestone.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{milestone.title}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {milestone.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Responsible: <strong className="text-slate-700">{milestone.responsiblePerson}</strong> · Planned: {milestone.plannedDate}
                      {milestone.actualDate && ` · Completed: ${milestone.actualDate}`}
                    </p>
                    {milestone.comments && (
                      <p className="text-[11px] text-amber-700 font-medium">Note: {milestone.comments}</p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full text-center shrink-0 ${
                      milestone.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : milestone.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {milestone.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Participating Sites */}
        {activeTab === 'sites' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Participating Clinical Research Sites ({allSites.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSites.map((site) => (
                <div key={site.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {site.code}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                      {site.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{site.name}</h4>
                  <p className="text-slate-500 text-[11px]">{site.city}, {site.state}</p>
                  <p className="text-slate-700">Site PI: <strong>{site.principalInvestigator}</strong></p>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                    <span className="text-slate-500">Recruited at Site:</span>
                    <span className="font-bold text-slate-800">{site.enrolledCount} subjects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Study Team */}
        {activeTab === 'team' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Authorized Trial Personnel & Investigators
            </h2>
            <div className="divide-y divide-slate-100">
              {study.assignedTeam.map((member, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{member.name}</p>
                    <p className="text-[11px] text-slate-500">System Role: {member.role}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-700 rounded-full">
                    GCP Certified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Related Safety Cases */}
        {activeTab === 'safety' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Pharmacovigilance Events Logged for this Protocol
              </h2>
              <Link
                href="/pharmacovigilance/new"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File New ADR / SAE</span>
              </Link>
            </div>

            {relatedSafetyCases.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No safety cases reported for this study to date.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {relatedSafetyCases.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-rose-700">{c.caseNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.isSerious ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                          {c.isSerious ? 'SERIOUS' : 'NON-SERIOUS'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">{c.eventTerm}</p>
                      <p className="text-[11px] text-slate-500">
                        Subject: <strong>{c.syntheticParticipantId}</strong> · Causality: {c.causalityAssessment}
                      </p>
                    </div>
                    <Link
                      href={`/pharmacovigilance/${c.id}`}
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Dossier →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Protocol Deviations */}
        {activeTab === 'deviations' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Protocol Deviations & CAPA Tracking
              </h2>
              <Link
                href="/deviations"
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Manage all deviations →
              </Link>
            </div>

            {relatedDeviations.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No active deviations logged under this protocol.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {relatedDeviations.map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800">{d.deviationCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {d.severity}
                        </span>
                      </div>
                      <p className="font-medium text-slate-800">{d.description}</p>
                      <p className="text-[11px] text-slate-500">CAPA: {d.correctiveAction}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 rounded-full">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
