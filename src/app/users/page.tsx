'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCog,
  Search,
  ShieldCheck,
  Building2,
  Mail,
  Award,
  CheckCircle2,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_USERS } from '@/lib/mockData';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function UsersPage() {
  const { switchRole, role: activeRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <UserCog className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Investigators & User Access Directory</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Role-Based Access Control (RBAC) governance across Principal Investigators, Study Coordinators, CRAs, IEC, and Regulators.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            7 Verified Clinical Roles
          </span>
        </div>

        {/* User Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((userProfile) => {
            const roleInfo = ROLE_LABELS[userProfile.role];
            const isCurrent = userProfile.role === activeRole;
            const perms = ROLE_PERMISSIONS[userProfile.role];

            return (
              <div
                key={userProfile.id}
                className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                        {userProfile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{userProfile.name}</h3>
                        <p className="text-[11px] text-slate-500">{userProfile.title}</p>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${roleInfo.badgeColor}`}>
                    {roleInfo.label}
                  </span>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <p className="flex items-center space-x-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{userProfile.email}</span>
                    </p>
                    <p className="flex items-center space-x-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{userProfile.institution}</span>
                    </p>
                  </div>

                  {/* Permissions Summary Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Granted Clearances:</span>
                    <div className="flex flex-wrap gap-1">
                      {perms.canCreateStudy && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">Create Study</span>}
                      {perms.canRegisterParticipant && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">Register Subject</span>}
                      {perms.canLogMonitoringVisit && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">Site Audit</span>}
                      {perms.canAssessSafety && <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-bold">Safety Assess</span>}
                      {perms.canReviewEthics && <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold">IEC Approval</span>}
                      {perms.isReadOnly && <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">Read-Only</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {userProfile.assignedStudyIds.length} Studies Assigned
                  </span>

                  <button
                    onClick={() => switchRole(userProfile.role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      isCurrent
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700'
                    }`}
                  >
                    {isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    <span>{isCurrent ? 'Active Persona' : 'Simulate Role'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
