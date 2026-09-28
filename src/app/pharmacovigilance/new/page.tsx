'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  Save,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { SeriousnessCriterion, WhoUmcCausality } from '@/types';

export default function NewSafetyCasePage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const studies = ctmsStore.getState().studies;
  const sites = ctmsStore.getState().sites;

  const [formData, setFormData] = useState({
    studyId: studies[0]?.id || 'study-001',
    siteId: sites[0]?.id || 'site-01',
    syntheticParticipantId: 'DEMO-0015',
    reportType: 'Initial' as const,
    reporterName: user.name,
    reporterRole: user.title,

    // Event Info
    eventTerm: '',
    meddraSyntheticCode: 'MEDDRA-SYN-10028491',
    ayushTermEquivalent: 'Twak Vikara / Kotha (Skin Manifestation)',
    eventOnsetDate: new Date().toISOString().split('T')[0],
    outcome: 'Recovering / Resolving' as const,
    isSerious: true,
    seriousnessCriteria: ['hospitalization'] as SeriousnessCriterion[],
    severity: 'Severe' as const,
    expectedness: 'Unexpected' as const,

    // Suspected Ayush Product
    suspectedProduct: 'Standardized Ashwagandha Aqueous Extract 300mg',
    ayushDosageForm: 'Capsule' as const,
    batchNumber: 'ASH-LOT-26-004',
    dosageAndRoute: '1 capsule bid orally after meals',
    therapyStartDate: '2026-09-10',
    therapyStopDate: new Date().toISOString().split('T')[0],
    dechallenge: 'Positive (improved upon stopping)' as const,
    rechallenge: 'Not Done' as const,
    concomitantMedications: 'None documented',

    // Assessment & Causality
    causalityAssessment: 'Probable / Likely' as WhoUmcCausality,
    naranjoScore: 6,
    medicalSummary: '',
    assessedBy: user.name,
    assessedDate: new Date().toISOString(),
    dsmbReviewStatus: 'Pending DSMB' as const,

    // Deadlines
    regulatoryDeadlineHours: 24,
    submissionStatus: 'Submitted to NPvCC' as const,
    ackReference: 'NPVCC-ACK-2026-AUTO'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!hasPermission('canCreateSafetyReport')) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-slate-800">Safety Reporting Unauthorized</h2>
          <p className="text-xs text-slate-500 mt-1">
            Safety case creation requires Pharmacovigilance Officer, PI, or Monitor role authorization.
          </p>
        </div>
      </AppShell>
    );
  }

  const toggleSeriousnessCriterion = (crit: SeriousnessCriterion) => {
    const exists = formData.seriousnessCriteria.includes(crit);
    const updated = exists
      ? formData.seriousnessCriteria.filter((c) => c !== crit)
      : [...formData.seriousnessCriteria, crit];

    const isSerious = updated.length > 0;
    // Set statutory deadline rule based on seriousness
    const deadlineHours = updated.includes('death') || updated.includes('life_threatening') ? 24 : isSerious ? 168 : 336;

    setFormData({
      ...formData,
      seriousnessCriteria: updated,
      isSerious,
      regulatoryDeadlineHours: deadlineHours
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventTerm || !formData.suspectedProduct || !formData.medicalSummary) {
      setErrorMsg('Please complete the adverse event description, suspected product, and medical review summary.');
      return;
    }

    setIsSubmitting(true);
    const study = studies.find((s) => s.id === formData.studyId);
    const site = sites.find((s) => s.id === formData.siteId);

    const deadline = new Date(Date.now() + formData.regulatoryDeadlineHours * 3600 * 1000).toISOString();

    const created = ctmsStore.createSafetyCase({
      ...formData,
      studyCode: study ? study.code : 'AIIA-STUDY',
      siteName: site ? site.name : 'AIIA Apex Centre',
      deadlineDate: deadline
    });

    router.push(`/pharmacovigilance/${created.id}`);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 text-xs">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/pharmacovigilance"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Safety Desk</span>
          </Link>
          <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            ICSR Form (GCP-ASU / WHO-UMC Aligned)
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-xl font-extrabold text-slate-900">
              National Pharmacovigilance Safety Report (ICSR)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              File an Adverse Event (AE), Adverse Drug Reaction (ADR), or Serious Adverse Event (SAE) with statutory regulatory clock triage.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Case Identification */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Case Identification & Source Protocol
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Study Protocol *</label>
                  <select
                    value={formData.studyId}
                    onChange={(e) => setFormData({ ...formData, studyId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {studies.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} - {s.title.slice(0, 30)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporting Site *</label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Participant Synthetic ID *</label>
                  <input
                    type="text"
                    value={formData.syntheticParticipantId}
                    onChange={(e) => setFormData({ ...formData, syntheticParticipantId: e.target.value })}
                    required
                    placeholder="e.g. DEMO-0015"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporter Name & Role</label>
                  <input
                    type="text"
                    value={`${formData.reporterName} (${formData.reporterRole})`}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs text-slate-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Report Classification</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Initial">Initial Report</option>
                    <option value="Follow-up 1">Follow-up 1</option>
                    <option value="Follow-up 2">Follow-up 2</option>
                    <option value="Final">Final Report</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Event & Seriousness */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Clinical Event & Seriousness Criteria
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adverse Event Clinical Term *</label>
                  <input
                    type="text"
                    value={formData.eventTerm}
                    onChange={(e) => setFormData({ ...formData, eventTerm: e.target.value })}
                    required
                    placeholder="e.g. Generalized Maculopapular Rash with Pruritus"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ayush Classical Term Equivalent</label>
                  <input
                    type="text"
                    value={formData.ayushTermEquivalent}
                    onChange={(e) => setFormData({ ...formData, ayushTermEquivalent: e.target.value })}
                    placeholder="e.g. Sheetapitta / Udarda"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Onset Date *</label>
                  <input
                    type="date"
                    value={formData.eventOnsetDate}
                    onChange={(e) => setFormData({ ...formData, eventOnsetDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity Grading</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Mild">Mild (No intervention required)</option>
                    <option value="Moderate">Moderate (Minimal intervention)</option>
                    <option value="Severe">Severe (Major clinical intervention)</option>
                    <option value="Life-threatening">Life-threatening</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protocol Expectedness</label>
                  <select
                    value={formData.expectedness}
                    onChange={(e) => setFormData({ ...formData, expectedness: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Unexpected">Unexpected (SUSAR)</option>
                    <option value="Expected">Expected (Documented in IB)</option>
                  </select>
                </div>
              </div>

              {/* Seriousness Criteria Checkbox Grid */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 uppercase text-[11px] block">
                    Statutory Seriousness Criteria (Check all that apply)
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    {formData.isSerious ? `Clock: ${formData.regulatoryDeadlineHours} Hours` : 'Non-Serious (14 Days)'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'death' as SeriousnessCriterion, label: 'Results in Death (24h Clock)' },
                    { id: 'life_threatening' as SeriousnessCriterion, label: 'Life-Threatening (24h Clock)' },
                    { id: 'hospitalization' as SeriousnessCriterion, label: 'Inpatient Hospitalization' },
                    { id: 'disability' as SeriousnessCriterion, label: 'Persistent Disability / Incapacity' },
                    { id: 'congenital_anomaly' as SeriousnessCriterion, label: 'Congenital Anomaly / Birth Defect' },
                    { id: 'medically_significant' as SeriousnessCriterion, label: 'Medically Significant Event' }
                  ].map((crit) => (
                    <label key={crit.id} className="flex items-center space-x-2 text-xs cursor-pointer font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={formData.seriousnessCriteria.includes(crit.id)}
                        onChange={() => toggleSeriousnessCriterion(crit.id)}
                        className="rounded text-rose-700"
                      />
                      <span>{crit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Suspected ASU Formulation */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Suspected Ayush Investigational Product (IP)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suspected Product Name *</label>
                  <input
                    type="text"
                    value={formData.suspectedProduct}
                    onChange={(e) => setFormData({ ...formData, suspectedProduct: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ayush Dosage Form *</label>
                  <select
                    value={formData.ayushDosageForm}
                    onChange={(e) => setFormData({ ...formData, ayushDosageForm: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Capsule">Capsule</option>
                    <option value="Vati / Gutika (Tablet)">Vati / Gutika (Tablet)</option>
                    <option value="Kashaya (Decoction)">Kashaya (Decoction)</option>
                    <option value="Churna (Powder)">Churna (Powder)</option>
                    <option value="Taila (Medicated Oil)">Taila (Medicated Oil)</option>
                    <option value="Asava / Arishta (Fermented)">Asava / Arishta (Fermented)</option>
                    <option value="Syrup">Syrup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturing Batch #</label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dechallenge Outcome</label>
                  <select
                    value={formData.dechallenge}
                    onChange={(e) => setFormData({ ...formData, dechallenge: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Positive (improved upon stopping)">Positive (improved upon stopping)</option>
                    <option value="Negative (no change)">Negative (no change)</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Concomitant Medications</label>
                  <input
                    type="text"
                    value={formData.concomitantMedications}
                    onChange={(e) => setFormData({ ...formData, concomitantMedications: e.target.value })}
                    placeholder="List all concurrent drugs..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Causality & Medical Summary */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Medical Assessment & WHO-UMC Causality Algorithm
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WHO-UMC Causality Category *</label>
                  <select
                    value={formData.causalityAssessment}
                    onChange={(e) => setFormData({ ...formData, causalityAssessment: e.target.value as WhoUmcCausality })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-900"
                  >
                    <option value="Certain">Certain (Plausible time, positive dechallenge & rechallenge)</option>
                    <option value="Probable / Likely">Probable / Likely (Reasonable time relationship, unlikely other cause)</option>
                    <option value="Possible">Possible (Reasonable time, but other factors could explain)</option>
                    <option value="Unlikely">Unlikely (Temporal relationship makes causality improbable)</option>
                    <option value="Conditional / Unclassified">Conditional / Unclassified (More data required)</option>
                    <option value="Unassessable / Unclassifiable">Unassessable / Unclassifiable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Naranjo Probability Score (0 to 9+)</label>
                  <input
                    type="number"
                    value={formData.naranjoScore}
                    onChange={(e) => setFormData({ ...formData, naranjoScore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Review Narrative Summary *</label>
                <textarea
                  rows={3}
                  value={formData.medicalSummary}
                  onChange={(e) => setFormData({ ...formData, medicalSummary: e.target.value })}
                  required
                  placeholder="Provide chronological clinical history, interventions, laboratory results, and medical opinion..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Submission Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <Link
                href="/pharmacovigilance"
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to NPvCC...' : 'Transmit ICSR Report & Log Audit Trail'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
