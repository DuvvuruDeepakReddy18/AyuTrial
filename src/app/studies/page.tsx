'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Study, StudyStatus } from '@/types';

function StudiesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const { hasPermission } = useAuth();
  const [studies, setStudies] = useState<Study[]>(ctmsStore.getState().studies);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [phaseFilter, setPhaseFilter] = useState('all');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setStudies(ctmsStore.getState().studies);
    });
    return () => unsub();
  }, []);

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.indication.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    const matchesPhase = phaseFilter === 'all' || study.phase === phaseFilter;

    return matchesSearch && matchesStatus && matchesPhase;
  });

  const getStatusBadge = (status: StudyStatus) => {
    switch (status) {
      case 'recruiting':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Recruiting</span>;
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Active</span>;
      case 'awaiting_ethics':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Awaiting Ethics</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Clinical Studies Portfolio</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                {filteredStudies.length} Studies
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-centre interventional RCTs, pragmatic trials, and active pharmacovigilance registries across AIIA network.
            </p>
          </div>

          {hasPermission('canCreateStudy') && (
            <Link
              href="/studies/new"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1.5 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Protocol</span>
            </Link>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code, title, PI, or indication..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="recruiting">Recruiting</option>
              <option value="active">Active</option>
              <option value="awaiting_ethics">Awaiting Ethics</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 text-slate-700"
            >
              <option value="all">All Phases</option>
              <option value="Phase I">Phase I</option>
              <option value="Phase II">Phase II</option>
              <option value="Phase III">Phase III</option>
              <option value="Phase IV / Post-Marketing">Phase IV</option>
            </select>
          </div>
        </div>

        {/* Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudies.map((study) => {
            const progressPct = Math.min(100, Math.round((study.enrolledCount / study.plannedTarget) * 100));
            return (
              <div
                key={study.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {study.code}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {study.phase} · {study.studyType}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-2">
                        {study.title}
                      </h2>
                    </div>
                    {getStatusBadge(study.status)}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    <strong className="text-slate-700">Indication:</strong> {study.indication}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600 line-clamp-1">
                      <strong className="text-slate-700">IP:</strong> {study.investigationalProduct}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      PI: <span className="font-semibold text-slate-700">{study.principalInvestigator}</span> · Sponsor: {study.sponsor}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Recruitment Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Recruitment Progress</span>
                      <span className="font-bold text-slate-800">
                        {study.enrolledCount} / {study.plannedTarget} enrolled ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="font-mono text-emerald-800 font-semibold">{study.ctriNumber}</span>
                      <span>·</span>
                      <span>{study.participatingSiteIds.length} Sites</span>
                    </div>
                    <Link
                      href={`/studies/${study.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Study Dossier</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

export default function StudiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading Studies Portfolio...</div>}>
      <StudiesContent />
    </Suspense>
  );
}
