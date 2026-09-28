'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  FileCheck2
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { ProtocolDeviation } from '@/types';

export default function DeviationsPage() {
  const { user, hasPermission } = useAuth();
  const [deviations, setDeviations] = useState<ProtocolDeviation[]>(ctmsStore.getState().deviations);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [selectedStudyId, setSelectedStudyId] = useState('study-001');
  const [selectedSiteId, setSelectedSiteId] = useState('site-01');
  const [participantId, setParticipantId] = useState('DEMO-0018');
  const [category, setCategory] = useState<ProtocolDeviation['category']>('Visit Window Exceeded');
  const [severity, setSeverity] = useState<ProtocolDeviation['severity']>('Minor');
  const [description, setDescription] = useState('');
  const [impactAssessment, setImpactAssessment] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Rajesh Kumar (CRC)');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [reportedToIEC, setReportedToIEC] = useState(false);

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setDeviations(ctmsStore.getState().deviations);
    });
    return () => unsub();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !correctiveAction) return;

    ctmsStore.createDeviation({
      studyId: selectedStudyId,
      siteId: selectedSiteId,
      participantId,
      dateIdentified: new Date().toISOString().split('T')[0],
      category,
      severity,
      description,
      impactAssessment: impactAssessment || 'Evaluated for protocol efficacy integrity.',
      rootCause: rootCause || 'Operational oversight.',
      correctiveAction,
      preventiveAction: preventiveAction || 'Staff retrained on GCP-ASU adherence.',
      responsiblePerson,
      dueDate,
      reportedToIEC,
      iecNotificationDate: reportedToIEC ? new Date().toISOString().split('T')[0] : undefined,
      status: 'Open'
    });

    setDescription('');
    setCorrectiveAction('');
    setShowModal(false);
  };

  const handleStatusChange = (id: string, newStatus: ProtocolDeviation['status']) => {
    ctmsStore.updateDeviationStatus(id, newStatus);
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
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h1 className="text-xl font-extrabold text-slate-900">Protocol Deviations & Violations Governance</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Tracking protocol non-compliances, root cause analyses, and reporting to Institutional Ethics Committees (IEC).
            </p>
          </div>

          {hasPermission('canLogDeviation') && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Log Protocol Deviation</span>
            </button>
          )}
        </div>

        {/* Deviations Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Logged Protocol Deviations ({deviations.length})
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              IEC Escalation Monitored
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Code / Severity</th>
                  <th className="py-3 px-3">Protocol / Subject</th>
                  <th className="py-3 px-3">Category & Observation</th>
                  <th className="py-3 px-3">Root Cause & CAPA</th>
                  <th className="py-3 px-3">IEC Notified</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deviations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{d.deviationCode}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mt-1 ${
                          d.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : d.severity === 'Major'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{d.studyId}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Subj: {d.participantId || 'Site Level'}</p>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <span className="font-semibold text-slate-800 block text-[11px]">{d.category}</span>
                      <p className="text-slate-600 line-clamp-2 mt-0.5">{d.description}</p>
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-600">
                      <p className="text-[11px]"><strong>Cause:</strong> {d.rootCause}</p>
                      <p className="text-[11px] text-emerald-800 mt-0.5"><strong>Action:</strong> {d.correctiveAction}</p>
                    </td>
                    <td className="py-3 px-3">
                      {d.reportedToIEC ? (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Notified</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Internal Only</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {d.status !== 'Closed' && (
                        <select
                          value={d.status}
                          onChange={(e) => handleStatusChange(d.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="Open">Open</option>
                          <option value="Under Investigation">Investigating</option>
                          <option value="CAPA Implemented">CAPA Implemented</option>
                          <option value="Closed">Close Out</option>
                        </select>
                      )}
                      {d.status === 'Closed' && (
                        <span className="text-[11px] text-slate-400 font-medium">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Log Deviation */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Log New Protocol Deviation</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
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
                    <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Minor">Minor</option>
                      <option value="Major">Major</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Visit Window Exceeded">Visit Window Exceeded</option>
                      <option value="Prohibited Concomitant Med">Prohibited Concomitant Med</option>
                      <option value="IP Dosing / Non-compliance">IP Dosing / Non-compliance</option>
                      <option value="Informed Consent">Informed Consent</option>
                      <option value="Eligibility Criteria">Eligibility Criteria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Participant DEMO ID</label>
                    <input
                      type="text"
                      value={participantId}
                      onChange={(e) => setParticipantId(e.target.value)}
                      placeholder="e.g. DEMO-0018"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deviation Description *</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Specific departure from approved protocol..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Root Cause Analysis</label>
                  <input
                    type="text"
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    placeholder="Identified root cause..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corrective Action (CAPA) *</label>
                  <input
                    type="text"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    required
                    placeholder="Remediation steps executed..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    checked={reportedToIEC}
                    onChange={(e) => setReportedToIEC(e.target.checked)}
                    id="iecCheckbox"
                    className="rounded text-emerald-800"
                  />
                  <label htmlFor="iecCheckbox" className="font-semibold text-slate-700 cursor-pointer">
                    Report deviation to Institutional Ethics Committee (Mandatory for Major/Critical)
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-700"
                  >
                    Log Deviation & Commit Audit
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
