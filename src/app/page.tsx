'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Activity,
  FolderKanban,
  FileCheck2,
  Network,
  History,
  Lock,
  ArrowRight,
  Building2,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Clock,
  Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const handleRoleLaunch = (role: UserRole) => {
    switchRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      {/* Top National Identity Bar */}
      <header className="bg-[#071322] text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-emerald-400">भारत सरकार | Government of India</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">आयुष मंत्रालय | Ministry of Ayush</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-semibold">
              SIH 2026 Problem SIH26046
            </span>
            <span className="hidden md:inline text-slate-400">NPvCC Apex Node</span>
          </div>
        </div>

        {/* Main Navigation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center text-white shadow-md border border-emerald-500/40">
              <Stethoscope className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">AIIA AyuTrial CTMS</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  SIH Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">All India Institute of Ayurveda · New Delhi</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-md shadow-emerald-900/30 rounded-lg transition flex items-center space-x-1.5"
            >
              <span>Launch Command Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071322] via-[#091b2c] to-slate-900 text-white pt-16 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>National Clinical Trials Management System & ASU&H Pharmacovigilance Apex</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Institutional Clinical Research Operations for the <span className="text-emerald-400">Ayurveda Renaissance</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Consolidating multi-centre clinical trials, GCP-ASU protocol tracking, CTRI milestones, participant screening, and the National Pharmacovigilance Coordination Centre (NPvCC) into an audit-ready, CDISC & FHIR interoperable cloud command centre.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/50 rounded-xl transition flex items-center space-x-2"
            >
              <span>Explore Active Trials Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pharmacovigilance"
              className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <Activity className="w-4 h-4 text-rose-400" />
              <span>NPvCC Safety & ADR Desk</span>
            </Link>
          </div>

          {/* Institutional Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-emerald-400">10</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">Active Ayurveda Protocols</p>
              <p className="text-[10px] text-slate-400">Phase I - IV Interventional RCTs</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-blue-400">8 Sites</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">National Research Network</p>
              <p className="text-[10px] text-slate-400">AIIA, ITRA, NIA, BHU, CCRAS</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-400">260+</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">Synthetic Study Subjects</p>
              <p className="text-[10px] text-slate-400">Screening to Enrolment Funnel</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-purple-400">SHA-256</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">Cryptographic Audit Chain</p>
              <p className="text-[10px] text-slate-400">Immutable ALCOA+ Ledger</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instant 1-Click Role Switcher for SIH Evaluators */}
      <section className="bg-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 rounded-full text-xs font-bold uppercase tracking-wider">
              Smart India Hackathon 2026 Evaluation Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant 1-Click Persona Simulator
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl mx-auto">
              Test how server-enforced role permissions adapt the dashboard for every clinical trial stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                role: 'admin' as UserRole,
                title: 'Institutional Administrator',
                name: 'Vikramaditya Sen',
                desc: 'Full institutional oversight, user management, and system configuration.',
                color: 'border-purple-500/40 hover:border-purple-400 bg-purple-950/20'
              },
              {
                role: 'pi' as UserRole,
                title: 'Principal Investigator',
                name: 'Dr. Sujata Sharma',
                desc: 'Protocol creation, study performance, safety sign-offs, and recruitment tracking.',
                color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20'
              },
              {
                role: 'pharmacovigilance_officer' as UserRole,
                title: 'NPvCC Safety Officer',
                name: 'Dr. Priya Nair',
                desc: 'AIIA National Pharmacovigilance desk, 24h SAE countdown, and causality scoring.',
                color: 'border-rose-500/40 hover:border-rose-400 bg-rose-950/20'
              },
              {
                role: 'study_coordinator' as UserRole,
                title: 'Study Coordinator (CRC)',
                name: 'Rajesh Kumar',
                desc: 'Participant screening logs, eligibility checks, eCRF data entry, and visit matrices.',
                color: 'border-blue-500/40 hover:border-blue-400 bg-blue-950/20'
              },
              {
                role: 'cra_monitor' as UserRole,
                title: 'CRA Site Monitor',
                name: 'Ananya Deshmukh',
                desc: 'Monitoring visit reports, source data verification, CAPA tracking, and deviations.',
                color: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20'
              },
              {
                role: 'iec_member' as UserRole,
                title: 'Ethics Committee (IEC)',
                name: 'Prof. V. K. Joshi',
                desc: 'Protocol ethics reviews, continuing review renewal approvals, and consent oversight.',
                color: 'border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20'
              },
              {
                role: 'regulator' as UserRole,
                title: 'Read-only Regulator',
                name: 'S. K. Verma',
                desc: 'CDSCO & Ayush inspection mode: read-only audit log inspection and milestone verification.',
                color: 'border-slate-500/40 hover:border-slate-400 bg-slate-900/40'
              },
              {
                role: 'admin' as UserRole,
                title: 'All-In-One SIH Quick Tour',
                name: 'Judge Evaluation Mode',
                desc: 'Opens full operations centre with active alerts, safety countdowns, and analytics.',
                color: 'border-emerald-400 bg-emerald-900/60 font-bold'
              }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRoleLaunch(p.role)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between ${p.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">{p.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">{p.name}</p>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-medium text-emerald-400">
                  <span>Simulate Persona</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            AIIA Institutional Architecture
          </h2>
          <p className="text-3xl font-extrabold text-slate-900">
            Engineered for Stringent Clinical Compliance
          </p>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Meeting ICMR National Ethical Guidelines 2017, New Drugs and Clinical Trials Rules 2019, and GCP-ASU standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Study Portfolio & CTRI Lifecycle</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track protocol drafting, IEC submission, CTRI prospective registration, site initiation, recruitment progress, and database lock with dependency validation.
            </p>
            <Link href="/studies" className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              <span>View 10 Active Studies</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">NPvCC ASU&H Pharmacovigilance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AIIA hosts the National Pharmacovigilance Coordination Centre. Features 24-hour fatal/life-threatening SAE triage, WHO-UMC causality assessments, and CDSCO submission pipelines.
            </p>
            <Link href="/pharmacovigilance" className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-700 hover:text-rose-800">
              <span>Inspect Safety Desk</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ALCOA+ Cryptographic Audit Trail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every creation, status transition, and clinical modification is sealed into an SHA-256 hash-chained ledger for absolute tamper detection and regulatory audit inspection.
            </p>
            <Link href="/audit-logs" className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-700 hover:text-purple-800">
              <span>Verify Audit Hash Chain</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">CDISC & HL7 FHIR Interoperability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates SDTM domains (DM, AE, EX, LB, VS, DS, SV) with Define-XML metadata previews alongside FHIR R4 ResearchStudy & AdverseEvent JSON generation.
            </p>
            <Link href="/interoperability" className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-800">
              <span>Explore Interoperability</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Monitoring & Protocol Deviations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete CRA workflows: Site Initiation, Interim Monitoring, For-Cause Audits, Corrective and Preventive Action (CAPA) tracking, and root cause classification.
            </p>
            <Link href="/monitoring" className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 hover:text-amber-800">
              <span>View Monitoring Findings</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ethics & Audio-Visual Consent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              IEC approval tracking, continuing review renewal countdowns, multi-lingual vernacular consent logs, and audio-visual consent recording compliance.
            </p>
            <Link href="/ethics" className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800">
              <span>Track Ethics Submissions</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto bg-[#071322] text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">All India Institute of Ayurveda (AIIA)</p>
                <p className="text-[11px] text-slate-400">Autonomous Institute under Ministry of Ayush, Government of India</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <Link href="/dashboard" className="text-slate-300 hover:text-white">Live Dashboard</Link>
              <Link href="/reports" className="text-slate-300 hover:text-white">Reports</Link>
              <Link href="/interoperability" className="text-slate-300 hover:text-white">Standards</Link>
              <Link href="/audit-logs" className="text-slate-300 hover:text-white">Audit Ledger</Link>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>© 2026 AIIA Clinical Trials Dashboard · Smart India Hackathon 2026 (SIH26046)</p>
            <p>De-identified Synthetic Demonstration Environment · Not for Direct Human Clinical Decision Making</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
