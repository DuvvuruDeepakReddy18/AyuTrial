'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  Check,
  XCircle,
  HelpCircle
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { EthicsSubmission } from '@/types';

export default function EthicsPage() {
  const { user, hasPermission } = useAuth();
  
  const [submissions, setSubmissions] = useState<EthicsSubmission[]>(ctmsStore.getState().ethicsSubmissions);
  const [selectedSub, setSelectedSub] = useState<EthicsSubmission | null>(submissions[0] || null);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Queries Raised' | 'Provisional Approval'>('Approved');
  const [approvalRef, setApprovalRef] = useState('AIIA/IEC/APPROVAL/2026/014');
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      const list = ctmsStore.getState().ethicsSubmissions;
      setSubmissions(list);
      if (selectedSub) {
        const updated = list.find((s) => s.id === selectedSub.id);
        setSelectedSub(updated || list[0] || null);
      }
    });
    return () => unsub();
  }, [selectedSub]);

  const handleCommitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    // Update in store
    const list = ctmsStore.getState().ethicsSubmissions;
    const idx = list.findIndex((s) => s.id === selectedSub.id);
    if (idx !== -1) {
      list[idx].approvalStatus = reviewDecision;
      if (reviewDecision === 'Approved') {
        list[idx].approvalRef = approvalRef;
        list[idx].approvalDate = new Date().toISOString().split('T')[0];
        list[idx].expiryDate = '2028-10-04';
      }

      // Also update study status if it was awaiting_ethics
      const study = ctmsStore.getState().studies.find((s) => s.id === selectedSub.studyId);
      if (study && study.status === 'awaiting_ethics' && reviewDecision === 'Approved') {
        study.status = 'ready_to_start';
        study.iecStatus = 'Approved';
        study.iecApprovalRef = approvalRef;
        // Complete milestone
        const m = study.milestones.find((m) => m.category === 'ethics');
        if (m) {
          m.status = 'completed';
          m.actualDate = new Date().toISOString().split('T')[0];
        }
      }

      ctmsStore.addAuditEntry(
        'APPROVE',
        'Study',
        selectedSub.studyId,
        selectedSub.submissionRef,
        `IEC review decision recorded by ${user.name}: ${reviewDecision} (${approvalRef})`
      );

      setActionSuccess(`Ethics review successfully committed. Decision: ${reviewDecision}. Study milestone updated.`);
      setTimeout(() => setActionSuccess(''), 5000);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-indigo-700" />
              <h1 className="text-xl font-extrabold text-slate-900">Institutional Ethics Committee (IEC) Workspace</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Registered with CDSCO (ECR/123/Inst/DL/2013/RR-19). Oversight under ICMR Ethical Guidelines 2017 & GCP-ASU.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
            IEC Chair: Prof. V. K. Joshi
          </span>
        </div>

        {/* Urgent Expiry Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="font-bold text-amber-900 text-xs">
                Continuing Review Expiration Warning (AIIA-CT-2024-002)
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Protocol approval for AYUSH-64 Trial expires in 27 days (25-Oct-2026). Mandatory annual progress renewal dossier is required.
              </p>
            </div>
          </div>
          <Link
            href="/studies/study-002"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 transition"
          >
            Review Study →
          </Link>
        </div>

        {/* Submissions & Review Master-Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Ethics Dossiers ({submissions.length})
            </h2>

            <div className="space-y-2">
              {submissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{sub.studyCode}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.approvalStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.approvalStatus === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sub.approvalStatus}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 mt-1">{sub.iecName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ref: {sub.submissionRef}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier Inspection & Review Decision Panel */}
          {selectedSub && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 lg:col-span-2">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {selectedSub.studyCode}
                    </span>
                    <span className="text-[11px] text-slate-500">Version: {selectedSub.protocolVersion}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    Ethics Dossier: {selectedSub.submissionRef}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Review Meeting</span>
                  <span className="font-bold text-slate-800">{selectedSub.reviewMeetingDate}</span>
                </div>
              </div>

              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{actionSuccess}</span>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[11px]">
                  Required Document Validation Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSub.requiredDocumentsChecklist.map((doc, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <span className="font-medium text-slate-700">{doc.docName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Submitted
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IEC Review Decision Form */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                    Record Formal Ethics Review Decision (IEC Action)
                  </h4>
                  <span className="text-[10px] text-indigo-700 font-semibold">
                    {hasPermission('canReviewEthics') ? 'Authorized IEC Member' : 'Viewing in Read-Only Mode'}
                  </span>
                </div>

                <form onSubmit={handleCommitReview} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Decision</label>
                      <select
                        value={reviewDecision}
                        onChange={(e) => setReviewDecision(e.target.value as any)}
                        disabled={!hasPermission('canReviewEthics')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 disabled:opacity-50"
                      >
                        <option value="Approved">Approved (Full Certification)</option>
                        <option value="Provisional Approval">Provisional Approval (Subject to minor revisions)</option>
                        <option value="Queries Raised">Queries Raised (Major clinical queries)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Formal Approval Certificate Ref #</label>
                      <input
                        type="text"
                        value={approvalRef}
                        onChange={(e) => setApprovalRef(e.target.value)}
                        disabled={!hasPermission('canReviewEthics')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Committee Deliberation & Minute Summary</label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      disabled={!hasPermission('canReviewEthics')}
                      placeholder="Protocol risk-benefit ratio verified favorable. Informed consent vernacular documents approved..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs disabled:opacity-50"
                    />
                  </div>

                  {hasPermission('canReviewEthics') ? (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center space-x-1.5 shadow-sm transition"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Commit IEC Formal Decision & Update Study Milestones</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg text-center text-[11px]">
                      Switch to <strong>Institutional Ethics Committee</strong> persona from top menu to execute review.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
