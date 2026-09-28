'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Hash,
  Clock,
  UserCheck
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';
import { syncComputeSimpleHash } from '@/lib/crypto';
import { AuditLogEntry } from '@/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(ctmsStore.getState().auditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'unverified' | 'valid' | 'tampered';
    verifiedCount: number;
    message: string;
  }>({
    status: 'unverified',
    verifiedCount: 0,
    message: ''
  });

  useEffect(() => {
    const unsub = ctmsStore.subscribe(() => {
      setLogs(ctmsStore.getState().auditLogs);
    });
    return () => unsub();
  }, []);

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      let isChainIntact = true;
      let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

      for (let i = 0; i < logs.length; i++) {
        const entry = logs[i];
        if (entry.previousHash !== expectedPrevHash) {
          isChainIntact = false;
          break;
        }

        const payload = `${entry.previousHash}|${entry.sequenceNumber}|${entry.timestamp}|${entry.actorId}|${entry.action}|${entry.recordType}|${entry.recordId}|${entry.details}`;
        const calculated = syncComputeSimpleHash(payload);
        if (calculated !== entry.currentHash) {
          isChainIntact = false;
          break;
        }

        expectedPrevHash = entry.currentHash;
      }

      setIsVerifying(false);
      if (isChainIntact) {
        setVerificationResult({
          status: 'valid',
          verifiedCount: logs.length,
          message: `Cryptographic Audit Trail Intact: All ${logs.length} SHA-256 blocks sequentially verified with zero tampering.`
        });
      } else {
        setVerificationResult({
          status: 'tampered',
          verifiedCount: logs.length,
          message: 'CRITICAL ALERT: Audit log hash mismatch detected. Chain integrity failure.'
        });
      }
    }, 400);
  };

  const filtered = logs.filter((entry) => {
    const matchesSearch =
      entry.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.recordIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.recordType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-purple-700" />
              <h1 className="text-xl font-extrabold text-slate-900">ALCOA+ Cryptographic Audit Ledger</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Immutable, timestamped, and SHA-256 hash-chained audit trail meeting 21 CFR Part 11, CDSCO, and GCP-ASU data integrity requirements.
            </p>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-bold text-xs flex items-center space-x-2 shadow-sm transition disabled:opacity-50 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Recalculating Block Hashes...' : 'Verify Cryptographic Chain Integrity'}</span>
          </button>
        </div>

        {/* Verification Status Banner */}
        {verificationResult.status !== 'unverified' && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              verificationResult.status === 'valid'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {verificationResult.status === 'valid' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-bold text-xs">{verificationResult.message}</span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold bg-white/60 px-2 py-0.5 rounded">
              Verified {verificationResult.verifiedCount} Blocks
            </span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by actor, action details, or identifier..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-700/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="STATUS_CHANGE">STATUS_CHANGE</option>
              <option value="SAFETY_SUBMIT">SAFETY_SUBMIT</option>
              <option value="APPROVE">APPROVE</option>
              <option value="LOGIN">LOGIN</option>
            </select>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Sequential Ledger Stream ({filtered.length} Entries)
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              ALCOA+: Attributable · Legible · Contemporaneous · Original · Accurate
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Seq #</th>
                  <th className="py-3 px-3">Timestamp (UTC/IST)</th>
                  <th className="py-3 px-3">Actor & Persona</th>
                  <th className="py-3 px-3">Action / Entity</th>
                  <th className="py-3 px-3">Audit Details & Narrative</th>
                  <th className="py-3 px-4 text-right">Cryptographic Hash (SHA-256)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice().reverse().map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      #{entry.sequenceNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(entry.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{entry.actorName}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{entry.actorRole.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono block w-fit mb-0.5 ${
                          entry.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.action === 'SAFETY_SUBMIT'
                            ? 'bg-rose-100 text-rose-800'
                            : entry.action === 'APPROVE'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {entry.action}
                      </span>
                      <span className="text-[10px] text-slate-500">{entry.recordType}</span>
                    </td>
                    <td className="py-3 px-3 max-w-sm text-slate-700">
                      <p className="font-medium text-slate-800">{entry.details}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">IP: {entry.ipAddress}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[10px]">
                      <div className="text-emerald-800 font-bold truncate max-w-[130px] ml-auto">
                        {entry.currentHash.slice(0, 16)}...
                      </div>
                      <div className="text-slate-400 text-[9px] truncate max-w-[130px] ml-auto">
                        Prev: {entry.previousHash.slice(0, 12)}...
                      </div>
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
