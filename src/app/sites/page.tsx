'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { ResearchSite } from '@/types';

export default function SitesPage() {
  const [sites, setSites] = useState<ResearchSite[]>(ctmsStore.getState().sites);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setSites(ctmsStore.getState().sites);
    });
    return () => unsub();
  }, []);

  const filteredSites = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Participating Clinical Research Sites</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                {sites.length} Institutional Centres
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              National network of NABL-accredited and GCP-compliant Ayurveda academic hospitals and research facilities.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search site, city, or investigator..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSites.map((site) => {
            const achievementPct = Math.round((site.enrolledCount / site.recruitmentTarget) * 100);
            return (
              <div
                key={site.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {site.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {site.status === 'active' ? 'Active Site' : 'Pending Activation'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{site.name}</h3>
                      <p className="text-slate-500 text-[11px] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{site.city}, {site.state}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-700">
                      Site PI: <strong>{site.principalInvestigator}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px] flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{site.piPhone}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Recruitment Progress */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Recruitment Target</span>
                      <span className="font-bold text-slate-800">
                        {site.enrolledCount} / {site.recruitmentTarget} enrolled ({achievementPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, achievementPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Monitoring & Findings Indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Next CRA Visit: {site.nextMonitoringDate}</span>
                    </div>
                    <div>
                      {site.openFindingsCount > 0 ? (
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {site.openFindingsCount} Open Findings
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          No Findings
                        </span>
                      )}
                    </div>
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
