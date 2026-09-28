'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { MonitoringVisit, MonitoringFinding } from '@/types';

export default function MonitoringPage() {
  const { user, hasPermission } = useAuth();
  
  const [visits, setVisits] = useState<MonitoringVisit[]>(ctmsStore.getState().monitoringVisits);
  const [findings, setFindings] = useState<MonitoringFinding[]>(ctmsStore.getState().monitoringFindings);
  const [showNewFindingModal, setShowNewFindingModal] = useState(false);

  // Form state
  const [selectedStudyId, setSelectedStudyId] = useState('study-001');
  const [selectedSiteId, setSelectedSiteId] = useState('site-01');
  const [category, setCategory] = useState<MonitoringFinding['category']>('IP Accountability');
  const [severity, setSeverity] = useState<MonitoringFinding['severity']>('Major');
  const [description, setDescription] = useState('');
  const [capaAction, setCapaAction] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Dr. Sujata Sharma');
  const [dueDate, setDueDate] = useState('2026-10-15');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setVisits(ctmsStore.getState().monitoringVisits);
      setFindings(ctmsStore.getState().monitoringFindings);
    });
    return () => unsub();
  }, []);

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !capaAction) return;

    ctmsStore.addMonitoringFinding({
      monitoringVisitId: visits[0]?.id || 'mon-001',
      studyId: selectedStudyId,
      siteId: selectedSiteId,
      category,
      severity,
      description,
      capaAction,
      responsiblePerson,
      dueDate,
      status: 'Open'
    });

    setDescription('');
    setCapaAction('');
    setShowNewFindingModal(false);
  };

  const handleResolve = (id: string) => {
    const notes = prompt('Enter CAPA verification and resolution notes:', 'Corrective action verified in on-site clinical binder by CRA.');
    if (notes) {
      ctmsStore.resolveMonitoringFinding(id, notes);
    }
  };

  const studies = ctmsStore.getState().studies;
  const sites = ctmsStore.getState().sites;

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Clinical Research Monitoring & CAPA Tracker</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Clinical Research Associate (CRA) site oversight, source data verification (SDV), and corrective action compliance.
            </p>
          </div>

          {hasPermission('canLogMonitoringVisit') && (
            <button
              onClick={() => setShowNewFindingModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Monitoring Finding / CAPA</span>
            </button>
          )}
        </div>

        {/* Monitoring Visits Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            CRA Monitoring Visits Portfolio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visits.map((visit) => (
              <div key={visit.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{visit.visitNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      visit.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : visit.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {visit.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900">{visit.visitType}</h4>
                <p className="text-slate-500 text-[11px]">CRA: <strong>{visit.monitorName}</strong></p>
                <p className="text-slate-600 line-clamp-2 text-[11px]">{visit.summaryFindings}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                  <span className="text-slate-500">Scheduled: {visit.scheduledDate}</span>
                  <span className="font-bold text-slate-800">{visit.openFindings} Open Findings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corrective & Preventive Action (CAPA) Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Active Corrective and Preventive Actions (CAPA) Log ({findings.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Audit trail verified for GCP inspections
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Severity / Category</th>
                  <th className="py-3 px-3">Finding Description</th>
                  <th className="py-3 px-3">Corrective & Preventive Action</th>
                  <th className="py-3 px-3">Owner / Due Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {findings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit mb-1 ${
                          finding.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : finding.severity === 'Major'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-slate-500 text-[11px]">{finding.category}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium max-w-xs">
                      {finding.description}
                      {finding.resolutionNotes && (
                        <p className="text-[10px] text-emerald-700 mt-1">Resolution: {finding.resolutionNotes}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs leading-relaxed">
                      {finding.capaAction}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{finding.responsiblePerson}</p>
                      <p className="text-[10px] text-slate-500">Due: {finding.dueDate}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          finding.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : finding.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {finding.status !== 'Resolved' && hasPermission('canManageCAPA') && (
                        <button
                          onClick={() => handleResolve(finding.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          Resolve CAPA
                        </button>
                      )}
                      {finding.status === 'Resolved' && (
                        <span className="text-[11px] text-slate-400 font-medium">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Issue Finding */}
        {showNewFindingModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Issue Monitoring Finding & Assign CAPA</h3>
                <button
                  onClick={() => setShowNewFindingModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFinding} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Study</label>
                    <select
                      value={selectedStudyId}
                      onChange={(e) => setSelectedStudyId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      {studies.map((s) => (
                        <option key={s.id} value={s.id}>{s.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Site</label>
                    <select
                      value={selectedSiteId}
                      onChange={(e) => setSelectedSiteId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      {sites.map((s) => (
                        <option key={s.id} value={s.id}>{s.code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Consent & Regulatory">Consent & Regulatory</option>
                      <option value="IP Accountability">IP Accountability</option>
                      <option value="Source Data Verification">Source Data Verification</option>
                      <option value="Protocol Adherence">Protocol Adherence</option>
                      <option value="Safety Reporting">Safety Reporting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Observation / Non-conformance *</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe specific audit finding or non-conformance..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corrective & Preventive Action (CAPA) *</label>
                  <textarea
                    rows={2}
                    value={capaAction}
                    onChange={(e) => setCapaAction(e.target.value)}
                    required
                    placeholder="Specify action required to prevent recurrence..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Responsible Owner</label>
                    <input
                      type="text"
                      value={responsiblePerson}
                      onChange={(e) => setResponsiblePerson(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFindingModal(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-700"
                  >
                    Issue Finding & Log Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
