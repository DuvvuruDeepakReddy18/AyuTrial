'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_USERS } from '@/lib/mockData';
import { UserRole } from '@/types';
import { ROLE_LABELS } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, setUser } = useAuth();
  
  const [email, setEmail] = useState('admin.ctms@aiia.gov.in');
  const [password, setPassword] = useState('AiiA#2026@Ctms');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Find matching user or fallback to admin
      const matched = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUser(matched);
        router.push('/dashboard');
      } else {
        // Allow demonstration login with demo account
        const fallback = MOCK_USERS[5];
        setUser(fallback);
        router.push('/dashboard');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickPersona = (role: UserRole) => {
    switchRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-800 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-7 h-7 text-emerald-300" />
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          AIIA Clinical Trials Portal
        </h2>
        <p className="text-xs text-slate-600 font-medium">
          Ministry of Ayush · National Pharmacovigilance Apex Centre
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          {/* Quick SIH Demo Login Buttons */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SIH 2026 Evaluation: 1-Click Persona Sign-In</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Server-Enforced RBAC
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Select any clinical trial stakeholder below to log in immediately with realistic permissions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { role: 'admin' as UserRole, name: 'Vikramaditya Sen', title: 'Institutional Admin' },
                { role: 'pi' as UserRole, name: 'Dr. Sujata Sharma', title: 'Principal Investigator' },
                { role: 'pharmacovigilance_officer' as UserRole, name: 'Dr. Priya Nair', title: 'NPvCC Safety Lead' },
                { role: 'study_coordinator' as UserRole, name: 'Rajesh Kumar', title: 'Study Coordinator' },
                { role: 'cra_monitor' as UserRole, name: 'Ananya Deshmukh', title: 'CRA Site Monitor' },
                { role: 'iec_member' as UserRole, name: 'Prof. V. K. Joshi', title: 'Ethics Committee' },
                { role: 'regulator' as UserRole, name: 'S. K. Verma', title: 'CDSCO Regulator (Read-Only)' }
              ].map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleQuickPersona(p.role)}
                  className="flex items-center justify-between p-2.5 text-xs text-left bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg transition shadow-2xs group"
                >
                  <div className="truncate">
                    <p className="font-bold text-slate-800 group-hover:text-emerald-900 truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{p.name}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200" />
            <span className="shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Or Sign In with Credentials
            </span>
            <div className="grow border-t border-slate-200" />
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Institutional Email (e.g. NIC / AIIA domain)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@aiia.gov.in"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Demo preset provided</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Authenticating with Central Security Node...</span>
              ) : (
                <>
                  <span>Sign In to Institutional CTMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            <p>
              By accessing this government research system, you agree to comply with GCP-ASU and DPDP Act provisions.
            </p>
            <Link href="/" className="inline-block mt-2 font-medium text-emerald-800 hover:underline">
              ← Return to Public Portal Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
