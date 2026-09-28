'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { DataQuery } from '@/types';

export default function DataManagementPage() {
  const [queries, setQueries] = useState<DataQuery[]>(ctmsStore.getState().dataQueries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setQueries(ctmsStore.getState().dataQueries);
    });
    return () => unsub();
  }, []);

  const handleAnswer = (id: string) => {
    const response = prompt('Enter clinical clarification or eCRF amendment notes:');
    if (response) {
      ctmsStore.answerDataQuery(id, response);
    }
  };

  const filtered = queries.filter((q) => {
    const matchesSearch =
      q.queryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.queryText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">Clinical Data Management & eCRF Queries</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Discrepancy management, edit-check rule validations, and query resolution tracking for CDISC-compliant database lock.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
            Data Quality Score: 98.4%
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by query #, field, or subject ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Query Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Queries</option>
              <option value="Open">Open</option>
              <option value="Answered">Answered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Queries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Data Queries Log ({queries.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Assigned to Study Coordinators & PIs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Query # / Subject</th>
                  <th className="py-3 px-3">Form & Clinical Field</th>
                  <th className="py-3 px-3">Query Observation</th>
                  <th className="py-3 px-3">Raised By / Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{q.queryNumber}</span>
                      <span className="font-mono text-[11px] text-slate-500">{q.participantId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{q.formName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{q.fieldName}</p>
                    </td>
                    <td className="py-3 px-3 max-w-sm">
                      <p className="text-slate-800 font-medium">{q.queryText}</p>
                      {q.responseNotes && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                          <strong>Response:</strong> {q.responseNotes}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{q.raisedBy}</p>
                      <p className="text-[10px] text-slate-500">Date: {q.raisedDate}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          q.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.status === 'Answered'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {q.status === 'Open' && (
                        <button
                          onClick={() => handleAnswer(q.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          Answer Query
                        </button>
                      )}
                      {q.status !== 'Open' && (
                        <span className="text-slate-400 text-[11px] font-medium">Resolved</span>
                      )}
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
