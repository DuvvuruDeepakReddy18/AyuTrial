'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Study, StudyStatus } from '@/types';

export default function StudyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [study, setStudy] = useState<Study | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'recruiting' as StudyStatus,
    principalInvestigator: '',
    plannedTarget: 0,
    ctriNumber: '',
    ctriStatus: 'Registered' as any,
    iecStatus: 'Approved' as any
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const s = ctmsStore.getState().studies.find((item) => item.id === id);
    if (s) {
      setStudy(s);
      setFormData({
        title: s.title,
        status: s.status,
        principalInvestigator: s.principalInvestigator,
        plannedTarget: s.plannedTarget,
        ctriNumber: s.ctriNumber,
        ctriStatus: s.ctriStatus,
        iecStatus: s.iecStatus
      });
    }
  }, [id]);

  if (!hasPermission('canEditStudy')) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-slate-800">Edit Permission Restricted</h2>
          <p className="text-xs text-slate-500 mt-1">Only Principal Investigators and Administrators can modify study parameters.</p>
        </div>
      </AppShell>
    );
  }

  if (!study) {
    return (
      <AppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">Loading study...</p>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    ctmsStore.updateStudy(study.id, formData);
    setMessage('Study parameters updated successfully and logged in ALCOA+ audit trail.');
    setIsSubmitting(false);
    setTimeout(() => {
      router.push(`/studies/${study.id}`);
    }, 800);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 text-xs">
        <div className="flex items-center justify-between">
          <Link
            href={`/studies/${study.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Back to Dossier</span>
          </Link>
          <span className="font-mono text-emerald-800 font-bold">{study.code}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Modify Protocol Parameters</h1>
            <p className="text-xs text-slate-500 mt-0.5">Status transitions and recruitment targets require audit attribution.</p>
          </div>

          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Protocol Title</label>
              <textarea
                rows={2}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Lifecycle Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StudyStatus })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="awaiting_ethics">Awaiting Ethics</option>
                  <option value="ready_to_start">Ready to Start</option>
                  <option value="recruiting">Recruiting</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Planned Participant Target</label>
                <input
                  type="number"
                  value={formData.plannedTarget}
                  onChange={(e) => setFormData({ ...formData, plannedTarget: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Principal Investigator</label>
                <input
                  type="text"
                  value={formData.principalInvestigator}
                  onChange={(e) => setFormData({ ...formData, principalInvestigator: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CTRI Registration Number</label>
                <input
                  type="text"
                  value={formData.ctriNumber}
                  onChange={(e) => setFormData({ ...formData, ctriNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
              <Link
                href={`/studies/${study.id}`}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Commit Changes to Ledger'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
