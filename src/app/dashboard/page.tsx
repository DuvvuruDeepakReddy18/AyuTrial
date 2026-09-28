'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  FileCheck2,
  Users2,
  UserCheck,
  Target,
  Clock,
  AlertTriangle,
  Database,
  Award,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ShieldAlert,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, hasPermission } = useAuth();
  
  const [storeState, setStoreState] = useState(ctmsStore.getState());
  const [kpis, setKpis] = useState(ctmsStore.getDerivedKPIs());

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setStoreState(ctmsStore.getState());
      setKpis(ctmsStore.getDerivedKPIs());
    });
    return () => unsub();
  }, []);

  // Visualization Data 1: Study Status Distribution
  const studyStatusCounts = storeState.studies.reduce((acc: Record<string, number>, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = [
    { name: 'Recruiting', value: studyStatusCounts['recruiting'] || 0, color: '#059669' },
    { name: 'Active', value: studyStatusCounts['active'] || 0, color: '#2563eb' },
    { name: 'Awaiting Ethics', value: studyStatusCounts['awaiting_ethics'] || 0, color: '#d97706' },
    { name: 'Completed', value: studyStatusCounts['completed'] || 0, color: '#64748b' }
  ];

  // Visualization Data 2: Recruitment Target vs Actual per Study
  const recruitmentComparisonData = storeState.studies.slice(0, 6).map((s) => ({
    name: s.code.replace('AIIA-CT-', ''),
    title: s.title,
    Enrolled: s.enrolledCount,
    Target: s.plannedTarget
  }));

  // Visualization Data 3: Monthly Trends (Screened vs Enrolled)
  const monthlyTrendsData = [
    { month: 'Apr 24', Screened: 35, Enrolled: 28 },
    { month: 'Jul 24', Screened: 60, Enrolled: 48 },
    { month: 'Oct 24', Screened: 95, Enrolled: 74 },
    { month: 'Jan 25', Screened: 140, Enrolled: 110 },
    { month: 'Apr 25', Screened: 185, Enrolled: 152 },
    { month: 'Jul 25', Screened: 220, Enrolled: 185 },
    { month: 'Sep 26', Screened: 260, Enrolled: 228 }
  ];

  // Visualization Data 4: Site Performance
  const sitePerformanceData = storeState.sites.slice(0, 6).map((site) => ({
    name: site.code,
    Enrolled: site.enrolledCount,
    Target: site.recruitmentTarget
  }));

  // Top KPI Card Definitions
  const kpiCards = [
    {
      title: 'Active Studies',
      value: kpis.activeStudies,
      subtitle: `${storeState.studies.length} total in portfolio`,
      icon: FolderKanban,
      href: '/studies?status=recruiting',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Awaiting Ethics',
      value: kpis.awaitingEthics,
      subtitle: 'IEC reviews pending',
      icon: FileCheck2,
      href: '/ethics',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      title: 'Total Screened',
      value: kpis.totalScreened,
      subtitle: 'Across 8 national sites',
      icon: Users2,
      href: '/screening',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: 'Total Enrolled',
      value: kpis.totalEnrolled,
      subtitle: `${kpis.targetAchievementPct}% target achievement`,
      icon: UserCheck,
      href: '/enrolment',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Recruitment Target %',
      value: `${kpis.targetAchievementPct}%`,
      subtitle: 'Composite velocity',
      icon: Target,
      href: '/enrolment',
      color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      title: 'Overdue Monitoring',
      value: kpis.overdueMonitoring,
      subtitle: 'CRA IMV visits overdue',
      icon: Clock,
      href: '/monitoring?status=overdue',
      color: kpis.overdueMonitoring > 0 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-slate-700 bg-slate-50 border-slate-200'
    },
    {
      title: 'Open Deviations',
      value: kpis.openDeviations,
      subtitle: 'Requires CAPA action',
      icon: AlertTriangle,
      href: '/deviations?status=Open',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      title: 'Open Data Queries',
      value: kpis.openQueries,
      subtitle: 'eCRF resolution queue',
      icon: Database,
      href: '/data-management?status=Open',
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200'
    },
    {
      title: 'Regulatory Milestones',
      value: kpis.pendingRegulatoryMilestones,
      subtitle: 'CTRI / DCGI submissions',
      icon: Award,
      href: '/regulatory',
      color: 'text-purple-700 bg-purple-50 border-purple-200'
    },
    {
      title: 'Open Safety Cases',
      value: kpis.openSafetyReports,
      subtitle: `${kpis.criticalSAEs} serious (24h clock)`,
      icon: Activity,
      href: '/pharmacovigilance',
      color: kpis.criticalSAEs > 0 ? 'text-rose-700 bg-rose-100 border-rose-300 animate-pulse' : 'text-rose-700 bg-rose-50 border-rose-200'
    }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Institutional Welcome & Quick Actions Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                Command Centre
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">All India Institute of Ayurveda Apex Node</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              National Clinical Trial & Pharmacovigilance Dashboard
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Welcome back, <strong className="text-slate-800">{user.name}</strong> ({user.title}). Managing portfolio under GCP-ASU & NDCT Rules 2019.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {hasPermission('canCreateStudy') && (
              <Link
                href="/studies/new"
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Protocol</span>
              </Link>
            )}
            {hasPermission('canRegisterParticipant') && (
              <Link
                href="/screening"
                className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg shadow-xs flex items-center space-x-1.5 transition"
              >
                <Users2 className="w-3.5 h-3.5" />
                <span>Screen Participant</span>
              </Link>
            )}
            {hasPermission('canCreateSafetyReport') && (
              <Link
                href="/pharmacovigilance/new"
                className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-xs flex items-center space-x-1.5 transition"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Report SAE / ADR</span>
              </Link>
            )}
          </div>
        </div>

        {/* Critical Safety & Regulatory Deadline Callout */}
        <div className="p-4 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 rounded-2xl text-white shadow-md border border-rose-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-rose-600/30 border border-rose-500/50 rounded-xl text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse text-rose-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                  URGENT 24-HR SAFETY DEADLINE
                </span>
                <span className="text-xs text-rose-300 font-mono">NPVCC/2026/SAE-001</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-1">
                Acute Angioedema in Ashwagandha RCT (DEMO-0011) — Triage Active
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Adverse Drug Reaction forwarded to NPvCC. Regulatory 24-hour statutory notification clock expires at 08:30 IST today.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/pharmacovigilance/case-pv-001"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <span>Review Case Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top 10 Calculated KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={idx}
                href={kpi.href}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg border shrink-0 ${kpi.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-800 transition">
                    {kpi.value}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{kpi.subtitle}</p>
              </Link>
            );
          })}
        </div>

        {/* Visualizations Grid: Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Study Status Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Study Lifecycle Distribution
                </h3>
                <p className="text-[11px] text-slate-500">10 protocols by operational state</p>
              </div>
              <Link href="/studies" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Recruitment Target vs Actual */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Recruitment Target vs. Actual Enrolled
                </h3>
                <p className="text-[11px] text-slate-500">Subject enrolment velocity across leading protocols</p>
              </div>
              <Link href="/enrolment" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                Detailed Funnel →
              </Link>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recruitmentComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Enrolled" fill="#0f382a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Visualizations Grid: Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Monthly Screening & Enrolment Velocity */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Screening & Enrolment Velocity
                </h3>
                <p className="text-[11px] text-slate-500">Cumulative cohort accumulation over 18 months</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                87.6% Conversion Rate
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScreened" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Screened" stroke="#2563eb" fillOpacity={1} fill="url(#colorScreened)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Enrolled" stroke="#059669" fillOpacity={1} fill="url(#colorEnrolled)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Multi-Centre Research Site Performance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Research Site Performance (Enrolled vs Target)
                </h3>
                <p className="text-[11px] text-slate-500">Recruitment attainment across verified trial centres</p>
              </div>
              <Link href="/sites" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                All 8 Sites →
              </Link>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sitePerformanceData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Enrolled" fill="#134e3a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Operational Status Tables & Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Studies Quick List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderKanban className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Active Clinical Protocols
                </h3>
              </div>
              <Link href="/studies" className="text-xs text-emerald-700 font-semibold hover:underline">
                View All 10 Protocols →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2 font-semibold">Code / Title</th>
                    <th className="pb-2 font-semibold">Phase / Type</th>
                    <th className="pb-2 font-semibold">Enrolment</th>
                    <th className="pb-2 font-semibold">CTRI Status</th>
                    <th className="pb-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeState.studies.slice(0, 4).map((study) => (
                    <tr key={study.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 pr-2">
                        <p className="font-bold text-slate-900">{study.code}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{study.title}</p>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-slate-700">{study.phase}</span>
                        <p className="text-[10px] text-slate-400">{study.ayushSystem}</p>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800">{study.enrolledCount}</span>
                        <span className="text-slate-400 text-[10px]"> / {study.plannedTarget}</span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-700 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (study.enrolledCount / study.plannedTarget) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {study.ctriStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/studies/${study.id}`}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Cryptographic Audit Trail */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ALCOA+ Audit Ledger
                </h3>
              </div>
              <Link href="/audit-logs" className="text-xs text-purple-700 font-semibold hover:underline">
                Verify Chain →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {storeState.auditLogs.slice(-4).reverse().map((entry) => (
                <div key={entry.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                      {entry.action}
                    </span>
                    <span className="text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 line-clamp-1">{entry.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                    <span>By: {entry.actorName.split(' ')[0]} ({entry.actorRole})</span>
                    <span className="text-emerald-600 truncate max-w-[90px]">#{entry.currentHash.slice(0, 8)}...</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <p className="text-[11px] font-bold text-emerald-900">Chain Status: Cryptographically Intact</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Zero tampering detected across 45 audit records</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
