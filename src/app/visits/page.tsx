'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Stethoscope,
  Pill,
  FlaskConical
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const participants = ctmsStore.getState().participants.slice(0, 20);

  // Generate realistic scheduled visit records for these participants
  const visitRows = participants.flatMap((p, idx) => [
    {
      id: `v-${p.id}-1`,
      participantId: p.syntheticId,
      studyCode: p.studyCode,
      siteCode: p.siteCode,
      visitName: 'Visit 1 (Day 0 - Baseline)',
      plannedDate: p.screeningDate,
      actualDate: p.screeningDate,
      status: 'completed',
      vitals: true,
      ayushAssessment: true,
      labSpecimen: true,
      drugDispensed: true,
      complianceRate: 100,
      examiner: 'Dr. Sujata Sharma'
    },
    {
      id: `v-${p.id}-2`,
      participantId: p.syntheticId,
      studyCode: p.studyCode,
      siteCode: p.siteCode,
      visitName: 'Visit 2 (Day 14 - Follow-up)',
      plannedDate: '2024-07-28',
      actualDate: p.completedVisitsCount >= 2 ? '2024-07-28' : undefined,
      status: p.completedVisitsCount >= 2 ? 'completed' : idx % 3 === 0 ? 'deviated' : 'scheduled',
      vitals: p.completedVisitsCount >= 2,
      ayushAssessment: p.completedVisitsCount >= 2,
      labSpecimen: false,
      drugDispensed: p.completedVisitsCount >= 2,
      complianceRate: 96,
      examiner: 'Rajesh Kumar (CRC)'
    },
    {
      id: `v-${p.id}-3`,
      participantId: p.syntheticId,
      studyCode: p.studyCode,
      siteCode: p.siteCode,
      visitName: 'Visit 3 (Day 28 - Safety Triage)',
      plannedDate: '2024-08-12',
      actualDate: p.completedVisitsCount >= 3 ? '2024-08-12' : undefined,
      status: p.completedVisitsCount >= 3 ? 'completed' : 'scheduled',
      vitals: p.completedVisitsCount >= 3,
      ayushAssessment: p.completedVisitsCount >= 3,
      labSpecimen: p.completedVisitsCount >= 3,
      drugDispensed: p.completedVisitsCount >= 3,
      complianceRate: 98,
      examiner: 'Dr. Sujata Sharma'
    }
  ]);

  const filtered = visitRows.filter((v) => {
    const matchesSearch =
      v.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.studyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.siteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Study Visits Matrix & Window Adherence</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Tracks scheduled protocol encounters, biological specimen collection, drug accountability, and Ayush clinical assessments.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by DEMO ID or study code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Visit Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="deviated">Deviated (Window Exceeded)</option>
            </select>
          </div>
        </div>

        {/* Visits Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Participant ID</th>
                  <th className="py-3 px-3">Protocol / Site</th>
                  <th className="py-3 px-3">Visit Milestone</th>
                  <th className="py-3 px-3">Planned Window</th>
                  <th className="py-3 px-3">Ayush Exam</th>
                  <th className="py-3 px-3">Drug Dispense</th>
                  <th className="py-3 px-3">Labs</th>
                  <th className="py-3 px-3">Compliance</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {v.participantId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{v.studyCode}</p>
                      <p className="text-[10px] text-slate-500">{v.siteCode}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {v.visitName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {v.plannedDate}
                    </td>
                    <td className="py-3 px-3">
                      {v.ayushAssessment ? (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Prakriti Logged</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {v.drugDispensed ? (
                        <span className="text-blue-700 font-semibold text-[11px] flex items-center space-x-1">
                          <Pill className="w-3.5 h-3.5" />
                          <span>Dispensed</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {v.labSpecimen ? (
                        <span className="text-purple-700 font-semibold text-[11px] flex items-center space-x-1">
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Collected</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{v.complianceRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'deviated'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
