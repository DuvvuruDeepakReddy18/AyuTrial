'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';

export default function RegulatoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const regulatoryItems = [
    {
      id: 'reg-01',
      title: 'CTRI Prospective Registration Verification',
      authority: 'Clinical Trials Registry - India (ICMR-NIMS)',
      framework: 'GCP-ASU & CTRI Mandate',
      studyCode: 'AIIA-CT-2024-001',
      status: 'Compliant',
      refNumber: 'CTRI/2024/05/067812',
      verificationDate: '2024-05-08',
      dueDate: '2026-11-30',
      notes: 'Prospective registration verified before first participant enrolment in accordance with WHO ICMJE standard.'
    },
    {
      id: 'reg-02',
      title: 'IEC Ethics Committee Registration Renewal',
      authority: 'CDSCO Ethics Committee Registration (Rule 122DD)',
      framework: 'NDCT Rules, 2019',
      studyCode: 'Institutional Apex',
      status: 'Compliant',
      refNumber: 'ECR/123/Inst/DL/2013/RR-19',
      verificationDate: '2024-01-10',
      dueDate: '2027-01-09',
      notes: 'Institutional Ethics Committee fully registered with Central Licensing Authority.'
    },
    {
      id: 'reg-03',
      title: 'Annual Continuing Review Progress Report',
      authority: 'Institutional Ethics Committee, AIIA',
      framework: 'ICMR Ethical Guidelines 2017',
      studyCode: 'AIIA-CT-2024-002',
      status: 'Action Required',
      refNumber: 'AIIA/CEC/2024/044',
      verificationDate: '2025-01-15',
      dueDate: '2026-10-15',
      notes: 'Ethics approval expires on 25-Oct-2026. Annual safety update dossier required immediately.'
    },
    {
      id: 'reg-04',
      title: 'GMP & Heavy Metal NABL Certification for Herbal Batches',
      authority: 'Ayurvedic Pharmacopoeia of India (API) Lab',
      framework: 'Drugs & Cosmetics Act Schedule T (GMP)',
      studyCode: 'AIIA-CT-2025-006',
      status: 'Compliant',
      refNumber: 'NABL-LAB-REP-2025-88',
      verificationDate: '2025-02-18',
      dueDate: '2027-02-15',
      notes: 'Lead, Cadmium, Arsenic, and Mercury tested below permissible limits for Punarnavadi Mandura lots.'
    },
    {
      id: 'reg-05',
      title: 'Digital Personal Data Protection (DPDP) Act Compliance',
      authority: 'Data Protection Board of India / MeitY',
      framework: 'DPDP Act, 2023',
      studyCode: 'All Protocols',
      status: 'Compliant',
      refNumber: 'DPDP-AIIA-SEC-2026',
      verificationDate: '2026-06-01',
      dueDate: '2027-06-01',
      notes: 'Synthetic and de-identified data policies active. Direct personal identifiers isolated.'
    }
  ];

  const filtered = regulatoryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Regulatory Governance & Compliance Matrix</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Statutory oversight covering GCP-ASU, ICMR National Ethical Guidelines, NDCT Rules 2019, CTRI mandates, and DPDP Act.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            AIIA Compliance Index: 100% Audit Ready
          </span>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Active Regulatory Deliverables ({filtered.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Milestone / Scope</th>
                  <th className="py-3 px-3">Regulatory Authority</th>
                  <th className="py-3 px-3">Statutory Framework</th>
                  <th className="py-3 px-3">Reference / Verification</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500">{item.studyCode}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.notes}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {item.authority}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        {item.framework}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-800 font-semibold">
                      {item.refNumber}
                      <span className="block text-[10px] text-slate-400 font-sans">Verified: {item.verificationDate}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {item.status.toUpperCase()}
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
