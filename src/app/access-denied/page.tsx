'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/auth';

export default function AccessDeniedPage() {
  const { user, role, switchRole } = useAuth();
  const currentRoleInfo = ROLE_LABELS[role] || ROLE_LABELS.admin;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            HTTP 403 · Access Denied
          </span>
          <h1 className="text-xl font-extrabold text-slate-900">
            Institutional Authorization Required
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current authenticated profile does not possess the requisite operational credentials to access or modify this clinical resource.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Authenticated Actor:</span>
            <span className="font-semibold text-slate-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Role:</span>
            <span className="font-semibold text-slate-800">{currentRoleInfo.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Clearance:</span>
            <span className="font-mono text-emerald-700 font-medium">GCP-ASU Tier 2</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <button
            onClick={() => switchRole('admin')}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch to Admin (Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
