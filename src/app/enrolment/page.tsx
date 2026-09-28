'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  TrendingUp,
  Target,
  Users2,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function EnrolmentPage() {
  const [studies, setStudies] = useState(ctmsStore.getState().studies);
  const [sites, setSites] = useState(ctmsStore.getState().sites);
  const [participants, setParticipants] = useState(ctmsStore.getState().participants);

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setStudies(ctmsStore.getState().studies);
      setSites(ctmsStore.getState().sites);
      setParticipants(ctmsStore.getState().participants);
    });
    return () => unsub();
  }, []);

  const totalScreened = participants.length;
  const totalEligible = participants.filter((p) => p.eligibilityStatus === 'Eligible').length;
  const totalConsented = participants.filter((p) => p.consentStatus === 'Consented').length;
  const totalEnrolled = participants.filter((p) => p.enrolmentStatus === 'Enrolled').length;
  const totalCompleted = participants.filter((p) => p.currentStatus === 'Completed').length;

  const funnelData = [
    { stage: '1. Screened', count: totalScreened, fill: '#3b82f6' },
    { stage: '2. Eligible', count: totalEligible, fill: '#0ea5e9' },
    { stage: '3. Consented', count: totalConsented, fill: '#10b981' },
    { stage: '4. Enrolled', count: totalEnrolled, fill: '#059669' },
    { stage: '5. Completed', count: totalCompleted, fill: '#0f382a' }
  ];

  const studyEnrolmentData = studies.map((s) => ({
    name: s.code.replace('AIIA-CT-', ''),
    Enrolled: s.enrolledCount,
    Target: s.plannedTarget
  }));

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Enrolment Velocity & Recruitment Analytics</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Real-time subject accrual tracking against protocol recruitment milestones and site targets.
            </p>
          </div>
          <Link
            href="/screening"
            className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition"
          >
            + Register New Participant
          </Link>
        </div>

        {/* Funnel Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {funnelData.map((item, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{item.stage}</span>
              <p className="text-xl font-black text-slate-900">{item.count}</p>
              <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                <div
                  className="h-1 rounded-full"
                  style={{
                    backgroundColor: item.fill,
                    width: `${totalScreened > 0 ? (item.count / totalScreened) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Study Comparison */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Protocol Recruitment Target Attainment
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyEnrolmentData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Enrolled" fill="#0f382a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Funnel Conversion Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Screening-to-Completion Funnel Conversion
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#134e3a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Site Breakdown Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide">
            Site-by-Site Accrual Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Site Code</th>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">Principal Investigator</th>
                  <th className="py-2.5 px-3">Enrolled</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Attainment %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sites.map((site) => {
                  const pct = Math.round((site.enrolledCount / site.recruitmentTarget) * 100);
                  return (
                    <tr key={site.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{site.code}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{site.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{site.principalInvestigator}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{site.enrolledCount}</td>
                      <td className="py-2.5 px-3 text-slate-500">{site.recruitmentTarget}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800">{pct}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
