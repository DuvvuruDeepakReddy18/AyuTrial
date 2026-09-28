'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Users2,
  Building2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Participant } from '@/types';

export default function ScreeningPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  
  const [studies, setStudies] = useState(ctmsStore.getState().studies);
  const [sites, setSites] = useState(ctmsStore.getState().sites);
  const [participants, setParticipants] = useState<Participant[]>(ctmsStore.getState().participants);

  const [selectedStudyId, setSelectedStudyId] = useState(studies[0]?.id || '');
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
  const [age, setAge] = useState(38);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');

  // Checklist
  const [inc1, setInc1] = useState(true);
  const [inc2, setInc2] = useState(true);
  const [inc3, setInc3] = useState(true);
  const [exc1, setExc1] = useState(false);
  const [exc2, setExc2] = useState(false);
  const [exc3, setExc3] = useState(false);

  const [consentStatus, setConsentStatus] = useState<'Consented' | 'Pending'>('Consented');
  const [enrolNow, setEnrolNow] = useState(true);
  const [screenFailureReason, setScreenFailureReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setStudies(ctmsStore.getState().studies);
      setSites(ctmsStore.getState().sites);
      setParticipants(ctmsStore.getState().participants);
    });
    return () => unsub();
  }, []);

  const isEligible = inc1 && inc2 && inc3 && !exc1 && !exc2 && !exc3;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const eligibilityStatus = isEligible ? 'Eligible' : 'Screen Failure';
    const enrolmentStatus = isEligible && enrolNow ? 'Enrolled' : 'Not Enrolled';

    const newPart = ctmsStore.registerParticipant({
      studyId: selectedStudyId,
      siteId: selectedSiteId,
      age: Number(age),
      gender,
      eligibilityStatus,
      screenFailureReason: !isEligible ? (screenFailureReason || 'Failed protocol inclusion/exclusion criteria') : undefined,
      consentStatus: consentStatus,
      enrolmentStatus,
      treatmentArm: 'Experimental (ASU Formulation)'
    });

    setSuccessMsg(`Subject ${newPart.syntheticId} registered successfully! Status: ${newPart.currentStatus}`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSearch className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Participant Screening & Eligibility Checklist</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Screening log management under GCP-ASU. Evaluates strict protocol eligibility prior to enrolment and randomization.
            </p>
          </div>
          <Link
            href="/participants"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-slate-700"
          >
            View All Enrolled Subjects →
          </Link>
        </div>

        {/* Screening Form & Eligibility Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 lg:col-span-2">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Screen & Enrol Synthetic Participant
              </h2>
              <p className="text-[11px] text-slate-500">
                Automated eligibility calculation based on inclusion and exclusion criteria validation.
              </p>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Study Protocol *</label>
                  <select
                    value={selectedStudyId}
                    onChange={(e) => setSelectedStudyId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {studies.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} - {s.title.slice(0, 45)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Research Site *</label>
                  <select
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Age (Years) *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    min={18}
                    max={85}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Informed Consent Status *</label>
                  <select
                    value={consentStatus}
                    onChange={(e) => setConsentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-emerald-800"
                  >
                    <option value="Consented">Consented (Vernacular Signed)</option>
                    <option value="Pending">Pending Consent</option>
                  </select>
                </div>
              </div>

              {/* Protocol Inclusion Criteria */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                  Mandatory Inclusion Criteria (All must be TRUE)
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inc1}
                    onChange={(e) => setInc1(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>1. Written informed consent obtained in participant&apos;s preferred language prior to any study procedure.</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inc2}
                    onChange={(e) => setInc2(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>2. Clinical diagnosis fulfills protocol disease severity & diagnostic criteria.</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inc3}
                    onChange={(e) => setInc3(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>3. Willingness and cognitive capability to adhere to scheduled visit matrix and drug regimen.</span>
                </label>
              </div>

              {/* Exclusion Criteria */}
              <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <span className="font-bold text-rose-900 uppercase tracking-wide text-[10px] block">
                  Exclusion Criteria (All must be FALSE)
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exc1}
                    onChange={(e) => setExc1(e.target.checked)}
                    className="rounded text-rose-700"
                  />
                  <span>1. Known hypersensitivity or past adverse reaction to investigational Ayurvedic ingredients.</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exc2}
                    onChange={(e) => setExc2(e.target.checked)}
                    className="rounded text-rose-700"
                  />
                  <span>2. Concomitant use of prohibited allopathic immunosuppressants or NSAIDs in past 30 days.</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exc3}
                    onChange={(e) => setExc3(e.target.checked)}
                    className="rounded text-rose-700"
                  />
                  <span>3. Severe hepatic or renal impairment (Serum Creatinine &gt; 1.5x ULN, SGOT/SGPT &gt; 3x ULN).</span>
                </label>
              </div>

              {!isEligible && (
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Reason for Screen Failure *</label>
                  <input
                    type="text"
                    value={screenFailureReason}
                    onChange={(e) => setScreenFailureReason(e.target.value)}
                    placeholder="Specify reason for failing inclusion/exclusion..."
                    className="w-full px-3 py-2 border border-rose-300 rounded-lg text-xs bg-rose-50"
                  />
                </div>
              )}

              {isEligible && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block">Eligibility Verified: Passed All Criteria</span>
                    <span className="text-[11px] text-emerald-700">Ready for enrolment and random treatment assignment.</span>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-emerald-900">
                    <input
                      type="checkbox"
                      checked={enrolNow}
                      onChange={(e) => setEnrolNow(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Enrol Immediately</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center space-x-2 shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Screening Record & Commit to Ledger</span>
              </button>
            </form>
          </div>

          {/* Quick Screening Summary Stats */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs">
                Screening Metrics Overview
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Total Screened:</span>
                  <span className="font-bold text-slate-800">{participants.length}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-emerald-50">
                  <span className="text-emerald-800">Enrolled & Active:</span>
                  <span className="font-bold text-emerald-900">
                    {participants.filter(p => p.enrolmentStatus === 'Enrolled').length}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Screen Failures:</span>
                  <span className="font-bold text-rose-700">
                    {participants.filter(p => p.eligibilityStatus === 'Screen Failure').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400">GCP-ASU Requirement</span>
              <h4 className="font-bold text-xs">Screening Log Retention</h4>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                All screened subjects (whether enrolled or failed) must be documented with rationale in accordance with Indian GCP guidelines section 3.4.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
