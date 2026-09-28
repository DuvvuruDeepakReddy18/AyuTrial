'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Network,
  Download,
  Copy,
  CheckCircle2,
  FileCode2,
  Database,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Layers
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { ctmsStore } from '@/lib/store';

export default function InteroperabilityPage() {
  const [activeTab, setActiveTab] = useState<'cdisc' | 'fhir' | 'abdm'>('cdisc');
  const [selectedDomain, setSelectedDomain] = useState<'DM' | 'AE' | 'EX' | 'VS' | 'LB'>('DM');
  const [copied, setCopied] = useState(false);

  const studies = ctmsStore.getState().studies;
  const participants = ctmsStore.getState().participants.slice(0, 15);
  const safetyCases = ctmsStore.getState().safetyCases.slice(0, 8);

  // CDISC SDTM Domain Data Mappings
  const sdtmDM = participants.map((p) => ({
    STUDYID: p.studyCode,
    DOMAIN: 'DM',
    USUBJID: `${p.studyCode}-${p.syntheticId}`,
    SUBJID: p.syntheticId,
    RFSTDTC: p.enrolmentDate || p.screeningDate,
    RFXSTDTC: p.enrolmentDate || 'N/A',
    SITEID: p.siteCode,
    AGE: p.age,
    AGEU: 'YEARS',
    SEX: p.gender === 'Female' ? 'F' : 'M',
    RACE: 'ASIAN (INDIAN)',
    ARMCD: p.treatmentArm?.includes('Experimental') ? 'TRT_A' : 'CTRL_B',
    ARM: p.treatmentArm || 'Active Comparator'
  }));

  const sdtmAE = safetyCases.map((c) => ({
    STUDYID: c.studyCode,
    DOMAIN: 'AE',
    USUBJID: `${c.studyCode}-${c.syntheticParticipantId}`,
    AESEQ: 1,
    AETERM: c.eventTerm,
    AEDECOD: c.eventTerm.split(' ')[0],
    AESTDTC: c.eventOnsetDate,
    AESER: c.isSerious ? 'Y' : 'N',
    AESEV: c.severity.toUpperCase(),
    AEREL: c.causalityAssessment.toUpperCase(),
    AEOUT: c.outcome.toUpperCase(),
    AETOXGR: c.severity === 'Severe' ? '3' : c.severity === 'Moderate' ? '2' : '1'
  }));

  const sdtmEX = participants.slice(0, 10).map((p) => ({
    STUDYID: p.studyCode,
    DOMAIN: 'EX',
    USUBJID: `${p.studyCode}-${p.syntheticId}`,
    EXTRT: 'ASHWAGANDHA AQUEOUS EXTRACT',
    EXDOSE: 300,
    EXDOSU: 'mg',
    EXDOSFRM: 'CAPSULE',
    EXROUTE: 'ORAL',
    EXSTDTC: p.enrolmentDate || '2024-06-18',
    EXLOT: 'ASH-LOT-24-098B'
  }));

  const sdtmVS = participants.slice(0, 10).map((p) => ({
    STUDYID: p.studyCode,
    DOMAIN: 'VS',
    USUBJID: `${p.studyCode}-${p.syntheticId}`,
    VSTESTCD: 'SYSBP',
    VSTEST: 'Systolic Blood Pressure',
    VSORRES: 122,
    VSORRESU: 'mmHg',
    VISITNUM: 1,
    VISIT: 'BASELINE DAY 0',
    VSDTC: p.screeningDate
  }));

  const sdtmLB = participants.slice(0, 10).map((p) => ({
    STUDYID: p.studyCode,
    DOMAIN: 'LB',
    USUBJID: `${p.studyCode}-${p.syntheticId}`,
    LBTESTCD: 'ALT',
    LBTEST: 'Alanine Aminotransferase',
    LBORRES: 24,
    LBORRESU: 'U/L',
    VISITNUM: 1,
    VISIT: 'BASELINE DAY 0',
    LBDTC: p.screeningDate
  }));

  const currentSDTMData =
    selectedDomain === 'DM'
      ? sdtmDM
      : selectedDomain === 'AE'
      ? sdtmAE
      : selectedDomain === 'EX'
      ? sdtmEX
      : selectedDomain === 'VS'
      ? sdtmVS
      : sdtmLB;

  // Synthetic FHIR R4 Bundle JSON
  const fhirResearchStudyBundle = {
    resourceType: 'Bundle',
    type: 'collection',
    id: 'aiia-ctms-fhir-r4-bundle-001',
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: 'urn:uuid:study-001',
        resource: {
          resourceType: 'ResearchStudy',
          id: 'AIIA-CT-2024-001',
          identifier: [
            { system: 'https://ctri.nic.in', value: 'CTRI/2024/05/067812' },
            { system: 'https://aiia.gov.in/ctms', value: 'AIIA-CT-2024-001' }
          ],
          title: studies[0]?.title,
          status: 'active',
          primaryPurposeType: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/research-study-prim-purp-type', code: 'treatment' }]
          },
          phase: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/research-study-phase', code: 'phase-3' }]
          },
          sponsor: {
            display: 'Ministry of Ayush / Central Council for Research in Ayurvedic Sciences'
          },
          principalInvestigator: {
            display: 'Dr. Sujata Sharma, MD (Ayu), PhD'
          }
        }
      },
      {
        fullUrl: 'urn:uuid:subject-0011',
        resource: {
          resourceType: 'ResearchSubject',
          id: 'DEMO-0011',
          identifier: [{ system: 'https://aiia.gov.in/ctms/subjects', value: 'DEMO-0011' }],
          status: 'active',
          study: { reference: 'ResearchStudy/AIIA-CT-2024-001' },
          individual: { display: 'De-identified Synthetic Patient (DEMO-0011)' },
          assignedArm: 'Experimental (Standardized Withania somnifera Extract 300mg bid)'
        }
      },
      {
        fullUrl: 'urn:uuid:safety-001',
        resource: {
          resourceType: 'AdverseEvent',
          id: 'NPVCC-2026-SAE-001',
          actuality: 'actual',
          category: [
            {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', code: 'product-use-error' }]
            }
          ],
          event: {
            coding: [
              { system: 'https://aiia.gov.in/npvcc/ayush-terms', code: 'Sheetapitta-Shotha', display: 'Sheetapitta / Kotha with Shotha' }
            ],
            text: 'Acute Urticaria with Facial Angioedema'
          },
          subject: { reference: 'ResearchSubject/DEMO-0011' },
          date: '2026-09-26T08:30:00Z',
          seriousness: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness', code: 'Serious' }]
          },
          severity: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-severity', code: 'Severe' }]
          },
          causality: [
            {
              assessment: {
                coding: [{ system: 'http://who-umc.org/causality', code: 'Probable', display: 'Probable / Likely' }]
              },
              productRelatedness: 'Standardized Ashwagandha Aqueous Extract 300mg (Batch: ASH-LOT-24-098B)'
            }
          ]
        }
      }
    ]
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirResearchStudyBundle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCDISC = () => {
    const keys = Object.keys(currentSDTMData[0] || {});
    let csv = keys.join(',') + '\n';
    currentSDTMData.forEach((row: any) => {
      csv += keys.map((k) => `"${row[k] || ''}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CDISC_SDTM_${selectedDomain}_Demonstration_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AppShell>
      <div className="space-y-6 text-xs">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl font-extrabold text-slate-900">
                CDISC, HL7 FHIR R4 & ABDM Interoperability
              </h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Global clinical data tabulation standards (SDTM/CDASH), HL7 FHIR R4 ResearchStudy resource modeling, and Ayushman Bharat Digital Mission readiness.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              CDISC SDTM v3.3 · FHIR R4 Compliant
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
          <nav className="flex space-x-6 text-xs font-semibold">
            {[
              { id: 'cdisc', label: 'CDISC SDTM Tabulation Model' },
              { id: 'fhir', label: 'HL7 FHIR R4 Resources' },
              { id: 'abdm', label: 'ABDM Ayushman Bharat Readiness' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 font-bold transition ${
                  activeTab === tab.id
                    ? 'border-emerald-800 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab 1: CDISC SDTM Demonstration */}
        {activeTab === 'cdisc' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-700">Select SDTM Domain:</span>
                {(['DM', 'AE', 'EX', 'VS', 'LB'] as const).map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition ${
                      selectedDomain === dom
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDownloadCDISC}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SDTM {selectedDomain} Dataset (CSV)</span>
              </button>
            </div>

            {/* SDTM Table Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase">
                    SDTM Domain: {selectedDomain} ({selectedDomain === 'DM' ? 'Demographics' : selectedDomain === 'AE' ? 'Adverse Events' : selectedDomain === 'EX' ? 'Exposure' : selectedDomain === 'VS' ? 'Vital Signs' : 'Laboratory Test Results'})
                  </h3>
                  <p className="text-[11px] text-slate-500">Standards-oriented clinical data representation</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {currentSDTMData.length} Records Mapped
                </span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 sticky top-0">
                    <tr>
                      {Object.keys(currentSDTMData[0] || {}).map((col) => (
                        <th key={col} className="py-2.5 px-3 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {currentSDTMData.map((row: any, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {Object.keys(row).map((k) => (
                          <td key={k} className="py-2 px-3 whitespace-nowrap">{String(row[k])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Define-XML 2.0 Metadata Preview */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Define-XML 2.0 Machine-Readable Metadata Specimen
                </span>
                <span className="text-[10px] text-slate-400">CDISC Metadata Model</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-40">
{`<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3" FileType="Snapshot" Originator="AIIA CTMS" CreationDateTime="2026-09-28T20:00:00Z">
  <MetaDataVersion OID="MDV.AIIA-CT-2024-001.SDTMIG.3.3" Name="AIIA Ashwagandha RCT SDTM 3.3 Definition">
    <ItemGroupDef OID="IG.DM" Name="Demographics" Repeating="No" Domain="DM" Purpose="Tabulation">
      <ItemRef ItemOID="IT.STUDYID" OrderNumber="1" Mandatory="Yes"/>
      <ItemRef ItemOID="IT.USUBJID" OrderNumber="2" Mandatory="Yes"/>
      <ItemRef ItemOID="IT.SUBJID" OrderNumber="3" Mandatory="Yes"/>
      <ItemRef ItemOID="IT.AGE" OrderNumber="4" Mandatory="Yes"/>
      <ItemRef ItemOID="IT.SEX" OrderNumber="5" Mandatory="Yes"/>
    </ItemGroupDef>
  </MetaDataVersion>
</ODM>`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: HL7 FHIR R4 */}
        {activeTab === 'fhir' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 uppercase">
                  HL7 FHIR R4 Clinical Trial Bundle Specification
                </h3>
                <p className="text-[11px] text-slate-500">
                  Contains mapped ResearchStudy, ResearchSubject, and AdverseEvent resources with Ayush terminology extensions.
                </p>
              </div>

              <button
                onClick={handleCopyJSON}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy FHIR JSON'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(fhirResearchStudyBundle, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: ABDM Readiness Assessment */}
        {activeTab === 'abdm' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 uppercase">
                Ayushman Bharat Digital Mission (ABDM) Interoperability Matrix
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Architectural readiness evaluation for connecting research subjects with ABHA (Ayushman Bharat Health Account) networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-emerald-800 text-xs block">1. ABHA Address Verification Interface</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sandbox-ready endpoint structures designed to allow voluntary participant linkage to ABHA ID with strict informed consent opt-in.
                </p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Schema Designed · Sandbox Ready
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-blue-800 text-xs block">2. Health Information Provider (HIP) Adapter</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  FHIR R4 DiagnosticReport & Encounter profile adapters for sharing research laboratory findings back to participant personal health records (PHR).
                </p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  FHIR R4 Aligned
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-purple-800 text-xs block">3. Consent Manager & Gateway (M1/M2/M3)</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Support for ABDM Milestone 1 (ABHA creation), Milestone 2 (HIP linkage), and Milestone 3 (HIU data pulling with electronic consent artifact).
                </p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                  Specification Compliant
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-amber-800 text-xs block">4. NAMASTE / Ayush Terminology Mapping</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  National Ayush Morbidity and Standardized Terminologies Electronic (NAMASTE) code mapping engine for ICD-11 Traditional Medicine chapter alignment.
                </p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  NAMASTE Mapped
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
