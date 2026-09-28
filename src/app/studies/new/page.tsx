'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  FileCheck2,
  Stethoscope
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { StudyType, StudyPhase, StudyStatus } from '@/types';

export default function NewStudyPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [formData, setFormData] = useState({
    code: 'AIIA-CT-2026-011',
    title: '',
    protocolNumber: 'AIIA/CLIN/2026/PROT-11',
    protocolVersion: 'v1.0',
    studyType: 'Interventional RCT' as StudyType,
    phase: 'Phase II' as StudyPhase,
    principalInvestigator: user.name,
    piId: user.id,
    sponsor: 'Ministry of Ayush / AIIA Research Fund',
    indication: '',
    ayushSystem: 'Ayurveda' as const,
    investigationalProduct: '',
    comparatorProduct: 'Matched Inactive Placebo',
    plannedTarget: 120,
    startDate: '2026-11-01',
    endDate: '2028-06-30',
    status: 'awaiting_ethics' as StudyStatus,
    participatingSiteIds: ['site-01'],
    ctriNumber: 'CTRI/PENDING/2026-11',
    ctriStatus: 'Not Submitted' as const,
    iecName: 'AIIA Institutional Ethics Committee for Human Studies',
    iecApprovalRef: 'AIIA/IEC/SUB-2026-022',
    iecStatus: 'Under Review' as const,
    budgetAllocatedLakhs: 45.0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!hasPermission('canCreateStudy')) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Permission Restricted</h2>
          <p className="text-xs text-slate-600">
            Only Principal Investigators and Institutional Administrators are authorized to register new clinical research protocols.
          </p>
          <Link
            href="/studies"
            className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
          >
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.indication || !formData.investigationalProduct) {
      setErrorMsg('Please complete all required clinical protocol fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = ctmsStore.createStudy({
        ...formData,
        assignedTeam: [
          { userId: user.id, name: user.name, role: user.role }
        ]
      });
      router.push(`/studies/${created.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register study.';
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  const allSites = ctmsStore.getState().sites;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Title */}
        <div className="flex items-center justify-between">
          <Link
            href="/studies"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studies Portfolio</span>
          </Link>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            GCP-ASU Compliant Protocol Registration
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-xl font-extrabold text-slate-900">
              Register New Clinical Protocol
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Initialize a new research study. Initial registration will set status to &quot;Awaiting Ethics&quot; until formal IEC approval is recorded.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Section 1: Protocol Identification */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Protocol Identification & Classification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Study Internal Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protocol Number *</label>
                  <input
                    type="text"
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protocol Version *</label>
                  <input
                    type="text"
                    value={formData.protocolVersion}
                    onChange={(e) => setFormData({ ...formData, protocolVersion: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Scientific Protocol Title *</label>
                <textarea
                  rows={2}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g. A Multicentre Double-Blind RCT of Standardized Ashwagandha Extract in Generalized Anxiety..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Study Design / Type *</label>
                  <select
                    value={formData.studyType}
                    onChange={(e) => setFormData({ ...formData, studyType: e.target.value as StudyType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Interventional RCT">Interventional RCT</option>
                    <option value="Observational Cohort">Observational Cohort</option>
                    <option value="Pragmatic Clinical Trial">Pragmatic Clinical Trial</option>
                    <option value="Safety & Pharmacovigilance Registry">Safety & Pharmacovigilance Registry</option>
                    <option value="Comparative Effectiveness">Comparative Effectiveness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Phase *</label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value as StudyPhase })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                    <option value="Phase IV / Post-Marketing">Phase IV / Post-Marketing</option>
                    <option value="Pilot / Exploratory">Pilot / Exploratory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ayush System *</label>
                  <select
                    value={formData.ayushSystem}
                    onChange={(e) => setFormData({ ...formData, ayushSystem: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Ayurveda">Ayurveda</option>
                    <option value="Siddha">Siddha</option>
                    <option value="Unani">Unani</option>
                    <option value="Homeopathy">Homeopathy</option>
                    <option value="Integrative">Integrative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Details */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Clinical Target & Interventions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Indication / Condition *</label>
                  <input
                    type="text"
                    value={formData.indication}
                    onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                    required
                    placeholder="e.g. Mild to Moderate Osteoarthritis (Sandhigatavata)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Principal Investigator *</label>
                  <input
                    type="text"
                    value={formData.principalInvestigator}
                    onChange={(e) => setFormData({ ...formData, principalInvestigator: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Investigational Product (IP) *</label>
                  <input
                    type="text"
                    value={formData.investigationalProduct}
                    onChange={(e) => setFormData({ ...formData, investigationalProduct: e.target.value })}
                    required
                    placeholder="e.g. Standardized Withania somnifera Extract 300mg bid"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Comparator / Control</label>
                  <input
                    type="text"
                    value={formData.comparatorProduct}
                    onChange={(e) => setFormData({ ...formData, comparatorProduct: e.target.value })}
                    placeholder="e.g. Matched Inactive Starch Placebo Capsule bid"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned Sample Size *</label>
                  <input
                    type="number"
                    value={formData.plannedTarget}
                    onChange={(e) => setFormData({ ...formData, plannedTarget: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Sites & Governance */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Participating Sites & Ethics Oversight
              </h2>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Participating Research Sites</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
                  {allSites.map((site) => {
                    const isChecked = formData.participatingSiteIds.includes(site.id);
                    return (
                      <label key={site.id} className="flex items-center space-x-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, participatingSiteIds: [...formData.participatingSiteIds, site.id] });
                            } else {
                              setFormData({ ...formData, participatingSiteIds: formData.participatingSiteIds.filter(id => id !== site.id) });
                            }
                          }}
                          className="rounded text-emerald-800 focus:ring-emerald-700"
                        />
                        <span className="font-semibold text-slate-800">{site.code}</span>
                        <span className="text-slate-500 truncate">- {site.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ethics Committee (IEC) Name</label>
                  <input
                    type="text"
                    value={formData.iecName}
                    onChange={(e) => setFormData({ ...formData, iecName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IEC Submission / Approval Ref</label>
                  <input
                    type="text"
                    value={formData.iecApprovalRef}
                    onChange={(e) => setFormData({ ...formData, iecApprovalRef: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTRI Registration Number</label>
                  <input
                    type="text"
                    value={formData.ctriNumber}
                    onChange={(e) => setFormData({ ...formData, ctriNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Budget (₹ in Lakhs)</label>
                  <input
                    type="number"
                    value={formData.budgetAllocatedLakhs}
                    onChange={(e) => setFormData({ ...formData, budgetAllocatedLakhs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <Link
                href="/studies"
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Protocol...' : 'Register Protocol & Log Audit Trail'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
