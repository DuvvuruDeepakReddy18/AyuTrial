'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users2,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Plus,
  Activity
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Participant } from '@/types';

function ParticipantsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { hasPermission } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>(ctmsStore.getState().participants);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [studyFilter, setStudyFilter] = useState('all');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setParticipants(ctmsStore.getState().participants);
    });
    return () => unsub();
  }, []);

  const studies = ctmsStore.getState().studies;

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.syntheticId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.screeningNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.siteCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.currentStatus === statusFilter;
    const matchesStudy = studyFilter === 'all' || p.studyId === studyFilter;

    return matchesSearch && matchesStatus && matchesStudy;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Users2 className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Participants Registry</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                {filtered.length} Subjects
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Synthetic de-identified participant IDs (DEMO-series). Compliant with ICMR and DPDP confidentiality guidelines.
            </p>
          </div>

          {hasPermission('canRegisterParticipant') && (
            <Link
              href="/screening"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1.5 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Screen / Enrol Participant</span>
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by DEMO ID, screening #, or site..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-1 text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="Active Treatment">Active Treatment</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Screen Failure">Screen Failure</option>
              <option value="Completed">Completed</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            <select
              value={studyFilter}
              onChange={(e) => setStudyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Studies</option>
              {studies.map((s) => (
                <option key={s.id} value={s.id}>{s.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Participant Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Subject ID</th>
                  <th className="py-3 px-3">Study / Site</th>
                  <th className="py-3 px-3">Demographics</th>
                  <th className="py-3 px-3">Screening #</th>
                  <th className="py-3 px-3">Consent Status</th>
                  <th className="py-3 px-3">Lifecycle Status</th>
                  <th className="py-3 px-3">Visits Progress</th>
                  <th className="py-3 px-3">Adherence</th>
                  <th className="py-3 px-3">Safety Event</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice(0, 50).map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {part.syntheticId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{part.studyCode}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{part.siteCode}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {part.age}y · {part.gender}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {part.screeningNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        part.consentStatus === 'Consented' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {part.consentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        part.currentStatus === 'Active Treatment'
                          ? 'bg-blue-100 text-blue-800'
                          : part.currentStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : part.currentStatus === 'Screen Failure'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {part.currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">
                        {part.completedVisitsCount} / {part.totalScheduledVisits}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{part.adherencePercentage}%</span>
                    </td>
                    <td className="py-3 px-3">
                      {part.hasAdverseEvent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 w-fit">
                          <Activity className="w-3 h-3 text-rose-600" />
                          <span>SAE/ADR</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/participants/${part.id}`}
                        className="text-emerald-800 hover:text-emerald-900 font-bold inline-flex items-center space-x-0.5"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-slate-500 text-[11px]">
            Showing 50 of {filtered.length} total synthetic subject records.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function ParticipantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading Participants...</div>}>
      <ParticipantsContent />
    </Suspense>
  );
}
