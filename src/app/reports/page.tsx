'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Download,
  Filter,
  FileSpreadsheet,
  Calendar,
  Building2,
  FolderKanban,
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'recruitment' | 'safety' | 'monitoring' | 'deviations'>('recruitment');
  const [selectedStudyId, setSelectedStudyId] = useState('all');

  const studies = ctmsStore.getState().studies;
  const sites = ctmsStore.getState().sites;
  const participants = ctmsStore.getState().participants;
  const safetyCases = ctmsStore.getState().safetyCases;
  const findings = ctmsStore.getState().monitoringFindings;
  const deviations = ctmsStore.getState().deviations;

  // Filtered participants
  const filteredParticipants = participants.filter(
    (p) => selectedStudyId === 'all' || p.studyId === selectedStudyId
  );

  // Filtered safety
  const filteredSafety = safetyCases.filter(
    (c) => selectedStudyId === 'all' || c.studyId === selectedStudyId
  );

  const handleExportCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'recruitment') {
      filename = `AIIA_Recruitment_Report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'ParticipantID,StudyCode,SiteCode,Age,Gender,ScreeningDate,Eligibility,ConsentStatus,EnrolmentStatus,CurrentStatus,AdherencePct\n';
      filteredParticipants.forEach((p) => {
        csvContent += `"${p.syntheticId}","${p.studyCode}","${p.siteCode}",${p.age},"${p.gender}","${p.screeningDate}","${p.eligibilityStatus}","${p.consentStatus}","${p.enrolmentStatus}","${p.currentStatus}",${p.adherencePercentage}\n`;
      });
    } else if (reportType === 'safety') {
      filename = `AIIA_NPvCC_Safety_Report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'CaseNumber,StudyCode,SubjectID,EventTerm,AyushTerm,Severity,IsSerious,SuspectedProduct,Batch,Causality,Status\n';
      filteredSafety.forEach((c) => {
        csvContent += `"${c.caseNumber}","${c.studyCode}","${c.syntheticParticipantId}","${c.eventTerm}","${c.ayushTermEquivalent}","${c.severity}",${c.isSerious},"${c.suspectedProduct}","${c.batchNumber}","${c.causalityAssessment}","${c.submissionStatus}"\n`;
      });
    } else if (reportType === 'monitoring') {
      filename = `AIIA_Monitoring_CAPA_Report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'FindingID,StudyID,SiteID,Category,Severity,Description,CAPAAction,Owner,DueDate,Status\n';
      findings.forEach((f) => {
        csvContent += `"${f.id}","${f.studyId}","${f.siteId}","${f.category}","${f.severity}","${f.description.replace(/"/g, '""')}","${f.capaAction.replace(/"/g, '""')}","${f.responsiblePerson}","${f.dueDate}","${f.status}"\n`;
      });
    } else {
      filename = `AIIA_Deviations_Report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'DeviationCode,StudyID,SubjectID,Category,Severity,Description,RootCause,Action,IECNotified,Status\n';
      deviations.forEach((d) => {
        csvContent += `"${d.deviationCode}","${d.studyId}","${d.participantId || ''}","${d.category}","${d.severity}","${d.description.replace(/"/g, '""')}","${d.rootCause.replace(/"/g, '""')}","${d.correctiveAction.replace(/"/g, '""')}",${d.reportedToIEC},"${d.status}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Institutional Reports & Data Exports</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Generate filtered regulatory dossiers, recruitment analytics, and safety surveillance spreadsheets with instant CSV download.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center space-x-2 shadow-sm transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Filtered CSV Dataset</span>
          </button>
        </div>

        {/* Filter & Report Selection Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'recruitment', label: 'Participant Recruitment', icon: FolderKanban },
              { id: 'safety', label: 'Pharmacovigilance (NPvCC)', icon: Activity },
              { id: 'monitoring', label: 'Monitoring & CAPA', icon: ShieldCheck },
              { id: 'deviations', label: 'Protocol Deviations', icon: ShieldCheck }
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => setReportType(r.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                    reportType === r.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-slate-500">Study Scope:</span>
            <select
              value={selectedStudyId}
              onChange={(e) => setSelectedStudyId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">Entire Institutional Portfolio (All Studies)</option>
              {studies.map((s) => (
                <option key={s.id} value={s.id}>{s.code} - {s.title.slice(0, 30)}...</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Preview Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Live Filtered Dataset Preview ({reportType === 'recruitment' ? filteredParticipants.length : reportType === 'safety' ? filteredSafety.length : reportType === 'monitoring' ? findings.length : deviations.length} Records)
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Ready for NABL & GCP Audits
            </span>
          </div>

          <div className="overflow-x-auto max-h-96">
            {reportType === 'recruitment' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Subject ID</th>
                    <th className="py-2.5 px-3">Protocol</th>
                    <th className="py-2.5 px-3">Site</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Screening Date</th>
                    <th className="py-2.5 px-3">Eligibility</th>
                    <th className="py-2.5 px-3">Consent</th>
                    <th className="py-2.5 px-3">Enrolment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.slice(0, 30).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{p.syntheticId}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{p.studyCode}</td>
                      <td className="py-2 px-3 text-slate-600 font-mono">{p.siteCode}</td>
                      <td className="py-2 px-3 text-slate-600">{p.age}y / {p.gender}</td>
                      <td className="py-2 px-3 text-slate-600">{p.screeningDate}</td>
                      <td className="py-2 px-3">{p.eligibilityStatus}</td>
                      <td className="py-2 px-3">{p.consentStatus}</td>
                      <td className="py-2 px-3">{p.enrolmentStatus}</td>
                      <td className="py-2 px-3 font-semibold">{p.currentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'safety' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Case Number</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Event Diagnosis</th>
                    <th className="py-2.5 px-3">Suspected ASU Product</th>
                    <th className="py-2.5 px-3">Causality</th>
                    <th className="py-2.5 px-3">Seriousness</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSafety.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-rose-700">{c.caseNumber}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">{c.syntheticParticipantId}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{c.eventTerm}</td>
                      <td className="py-2 px-3 text-slate-700">{c.suspectedProduct}</td>
                      <td className="py-2 px-3">{c.causalityAssessment}</td>
                      <td className="py-2 px-3">{c.isSerious ? 'SAE' : 'ADR'}</td>
                      <td className="py-2 px-3 font-semibold">{c.submissionStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'monitoring' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Observation</th>
                    <th className="py-2.5 px-3">CAPA Action</th>
                    <th className="py-2.5 px-3">Responsible</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold">{f.severity}</td>
                      <td className="py-2 px-3">{f.category}</td>
                      <td className="py-2 px-3 max-w-xs truncate">{f.description}</td>
                      <td className="py-2 px-3 max-w-xs truncate">{f.capaAction}</td>
                      <td className="py-2 px-3">{f.responsiblePerson}</td>
                      <td className="py-2 px-3 font-bold">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'deviations' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deviations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold">{d.deviationCode}</td>
                      <td className="py-2 px-3 font-bold">{d.severity}</td>
                      <td className="py-2 px-3">{d.category}</td>
                      <td className="py-2 px-3 max-w-xs truncate">{d.description}</td>
                      <td className="py-2 px-3 max-w-xs truncate">{d.correctiveAction}</td>
                      <td className="py-2 px-3">{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
