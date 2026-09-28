'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSignature,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Video,
  Languages,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';

export default function ConsentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [langFilter, setLangFilter] = useState('all');

  const participants = ctmsStore.getState().participants.slice(0, 24);

  const consentRecords = participants.map((p, idx) => ({
    id: `icf-${p.id}`,
    participantId: p.syntheticId,
    studyCode: p.studyCode,
    siteCode: p.siteCode,
    version: 'v3.2 (Approved 12-Apr-2024)',
    language: idx % 4 === 0 ? 'Hindi' : idx % 4 === 1 ? 'English' : idx % 4 === 2 ? 'Marathi' : 'Tamil',
    consentDate: p.consentDate || '2024-06-14',
    status: p.consentStatus,
    obtainedBy: idx % 2 === 0 ? 'Rajesh Kumar (CRC)' : 'Dr. Sujata Sharma (PI)',
    audioVideoRecorded: idx % 5 === 0, // AV recorded for vulnerable subjects
    witnessName: idx % 3 === 0 ? 'Impartial Family Witness Present' : 'Self-Consenting Literate Adult',
    docRef: `ICF-DOC-${p.studyCode}-${p.syntheticId}`
  }));

  const filtered = consentRecords.filter((c) => {
    const matchesSearch =
      c.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.obtainedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = langFilter === 'all' || c.language === langFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSignature className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Informed Consent Management (ICF)</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              GCP-ASU and ICMR compliance for participant autonomy, vernacular language translations, and audio-visual recording logs.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            Vernacular Coverage: 6 Indian Languages
          </span>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by participant ID, study, or CRC..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Language:</span>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Languages</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="English">English</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
            </select>
          </div>
        </div>

        {/* Consent Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Consent Logs ({filtered.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Verified by CRA Monitor during SDV
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Subject ID</th>
                  <th className="py-3 px-3">Protocol / Site</th>
                  <th className="py-3 px-3">ICF Version & Language</th>
                  <th className="py-3 px-3">Consent Date</th>
                  <th className="py-3 px-3">Person Obtaining Consent</th>
                  <th className="py-3 px-3">Audio-Visual Recording</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {c.participantId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{c.studyCode}</p>
                      <p className="text-[10px] text-slate-500">{c.siteCode}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{c.language}</p>
                      <p className="text-[10px] text-slate-500">{c.version}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {c.consentDate}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{c.obtainedBy}</p>
                      <p className="text-[10px] text-slate-400">{c.witnessName}</p>
                    </td>
                    <td className="py-3 px-3">
                      {c.audioVideoRecorded ? (
                        <span className="text-purple-700 font-bold text-[11px] flex items-center space-x-1">
                          <Video className="w-3.5 h-3.5" />
                          <span>AV Recorded</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard Written</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {c.status}
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
