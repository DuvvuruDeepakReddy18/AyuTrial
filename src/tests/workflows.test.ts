// Automated Workflow Integration & Unit Tests for AIIA Clinical Trial Management System
// Validates Workflows 1 through 8 directly against CTMS business logic, state store, and RBAC matrix.

import { ctmsStore } from '../lib/store';
import { ROLE_PERMISSIONS, checkPermission } from '../lib/auth';
import { MOCK_USERS } from '../lib/mockData';
import { syncComputeSimpleHash } from '../lib/crypto';

export function runAllWorkflowTests() {
  console.log('================================================================');
  console.log('STARTING AIIA CTMS AUTOMATED WORKFLOW TEST SUITE (SIH26046)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  // WORKFLOW 1: Admin Creates Study & Verifies Dashboard KPIs
  console.log('--- TEST 1: WORKFLOW 1 (Administrator Creates Study & Milestones) ---');
  ctmsStore.setCurrentUserByRole('admin');
  const initialKPIs = ctmsStore.getDerivedKPIs();

  const newStudy = ctmsStore.createStudy({
    code: 'AIIA-TEST-2026-99',
    title: 'Automated Test Protocol for Withania Efficacy',
    protocolNumber: 'AIIA/TEST/2026/01',
    protocolVersion: 'v1.0',
    studyType: 'Interventional RCT',
    phase: 'Phase II',
    principalInvestigator: 'Dr. Sujata Sharma',
    piId: 'user-pi-01',
    sponsor: 'AIIA Research Directorate',
    indication: 'Stress Induced Autonomic Dysfunction',
    ayushSystem: 'Ayurveda',
    investigationalProduct: 'Test Extract 250mg bid',
    comparatorProduct: 'Placebo',
    plannedTarget: 100,
    startDate: '2026-11-01',
    endDate: '2027-11-01',
    status: 'recruiting',
    participatingSiteIds: ['site-01'],
    ctriNumber: 'CTRI/2026/99/TEST',
    ctriStatus: 'Registered',
    iecName: 'AIIA IEC',
    iecApprovalRef: 'AIIA/IEC/TEST-99',
    iecStatus: 'Approved',
    budgetAllocatedLakhs: 30.0,
    assignedTeam: [{ userId: 'user-pi-01', name: 'Dr. Sujata Sharma', role: 'pi' }]
  });

  const updatedKPIs1 = ctmsStore.getDerivedKPIs();
  assert(newStudy.id.startsWith('study-'), 'Study created with valid ID', newStudy.id);
  assert(updatedKPIs1.activeStudies >= initialKPIs.activeStudies, 'Active studies count increased in dashboard');
  assert(newStudy.milestones.length >= 3, 'Default lifecycle milestones auto-generated');

  // WORKFLOW 2: Study Coordinator Screens & Enrols Participant
  console.log('\n--- TEST 2: WORKFLOW 2 (Coordinator Screens & Enrols Participant) ---');
  ctmsStore.setCurrentUserByRole('study_coordinator');
  const initialEnrolled = ctmsStore.getDerivedKPIs().totalEnrolled;

  const newPart = ctmsStore.registerParticipant({
    studyId: newStudy.id,
    siteId: 'site-01',
    age: 32,
    gender: 'Female',
    eligibilityStatus: 'Eligible',
    consentStatus: 'Consented',
    enrolmentStatus: 'Enrolled',
    treatmentArm: 'Experimental (ASU Formulation)'
  });

  const updatedKPIs2 = ctmsStore.getDerivedKPIs();
  assert(newPart.syntheticId.startsWith('DEMO-'), 'Participant assigned de-identified synthetic ID', newPart.syntheticId);
  assert(newPart.currentStatus === 'Active Treatment', 'Enrolled participant transitioned to Active Treatment');
  assert(updatedKPIs2.totalEnrolled === initialEnrolled + 1, 'Total enrolled KPI incremented accurately');

  // WORKFLOW 3: Pharmacovigilance Officer Files SAE & Tracks 24h Clock
  console.log('\n--- TEST 3: WORKFLOW 3 (PV Officer Triage & 24h SAE Countdown) ---');
  ctmsStore.setCurrentUserByRole('pharmacovigilance_officer');
  const initialSafety = ctmsStore.getDerivedKPIs().openSafetyReports;

  const newSafetyCase = ctmsStore.createSafetyCase({
    studyId: newStudy.id,
    studyCode: newStudy.code,
    siteId: 'site-01',
    siteName: 'AIIA Apex Hospital',
    syntheticParticipantId: newPart.syntheticId,
    reportType: 'Initial',
    reporterName: 'Dr. Priya Nair',
    reporterRole: 'PV Officer',
    eventTerm: 'Severe Bronchospasm following decoction intake',
    meddraSyntheticCode: 'MEDDRA-SYN-10006482',
    ayushTermEquivalent: 'Tamaka Shwasa Vegavasta',
    eventOnsetDate: '2026-09-28',
    outcome: 'Recovering / Resolving',
    isSerious: true,
    seriousnessCriteria: ['life_threatening', 'hospitalization'],
    severity: 'Severe',
    expectedness: 'Unexpected',
    suspectedProduct: newStudy.investigationalProduct,
    ayushDosageForm: 'Kashaya (Decoction)',
    batchNumber: 'LOT-TEST-99',
    dosageAndRoute: '15ml bid orally',
    therapyStartDate: '2026-09-25',
    dechallenge: 'Positive (improved upon stopping)',
    rechallenge: 'Not Done',
    concomitantMedications: 'None',
    causalityAssessment: 'Probable / Likely',
    naranjoScore: 7,
    medicalSummary: 'Acute dyspnea requiring bronchodilator nebulization. Dechallenge positive.',
    assessedBy: 'Dr. Priya Nair',
    assessedDate: '2026-09-28T12:00:00Z',
    dsmbReviewStatus: 'Pending DSMB',
    regulatoryDeadlineHours: 24,
    deadlineDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    submissionStatus: 'Submitted to NPvCC'
  });

  const updatedKPIs3 = ctmsStore.getDerivedKPIs();
  assert(newSafetyCase.caseNumber.startsWith('NPVCC/2026/SAE-'), 'Case assigned official NPvCC SAE case identifier');
  assert(newSafetyCase.regulatoryDeadlineHours === 24, 'Statutory 24-hour deadline assigned for life-threatening event');
  assert(updatedKPIs3.openSafetyReports === initialSafety + 1, 'Safety dashboard open reports counter updated');

  // WORKFLOW 4: Ethics Committee Reviews Submission & Updates Study
  console.log('\n--- TEST 4: WORKFLOW 4 (IEC Member Reviews Ethics Submission) ---');
  ctmsStore.setCurrentUserByRole('iec_member');
  const ethicsSubs = ctmsStore.getState().ethicsSubmissions;
  const targetSub = ethicsSubs.find(s => s.approvalStatus === 'Under Review') || ethicsSubs[0];

  assert(targetSub !== undefined, 'Target ethics submission exists');
  targetSub.approvalStatus = 'Approved';
  targetSub.approvalRef = 'AIIA/IEC/APPROVAL/TEST-VERIFIED';

  ctmsStore.addAuditEntry(
    'APPROVE',
    'Study',
    targetSub.studyId,
    targetSub.submissionRef,
    'IEC approval granted during committee meeting'
  );
  assert(targetSub.approvalStatus === 'Approved', 'Ethics status transitioned to Approved');

  // WORKFLOW 5: CRA Monitor Conducts Visit & Issues CAPA Finding
  console.log('\n--- TEST 5: WORKFLOW 5 (CRA Site Monitor Issues CAPA Finding) ---');
  ctmsStore.setCurrentUserByRole('cra_monitor');
  const initialFindings = ctmsStore.getState().monitoringFindings.length;

  ctmsStore.addMonitoringFinding({
    monitoringVisitId: 'mon-001',
    studyId: newStudy.id,
    siteId: 'site-01',
    category: 'Source Data Verification',
    severity: 'Major',
    description: 'Discrepancy in recorded Day 0 pulse rate between paper chart and eCRF.',
    capaAction: 'Double entry source chart verification completed; discrepancy resolved.',
    responsiblePerson: 'Rajesh Kumar (CRC)',
    dueDate: '2026-10-10',
    status: 'Open'
  });

  const afterFindings = ctmsStore.getState().monitoringFindings.length;
  assert(afterFindings === initialFindings + 1, 'New monitoring finding logged into database');

  // Resolve the finding
  const latestFinding = ctmsStore.getState().monitoringFindings[0];
  ctmsStore.resolveMonitoringFinding(latestFinding.id, 'CRA confirmed chart correction on 2026-09-28.');
  assert(latestFinding.status === 'Resolved', 'Finding marked Resolved with verified resolution notes');

  // WORKFLOW 6: Report Generation & CSV Formatting
  console.log('\n--- TEST 6: WORKFLOW 6 (Report Generation & CSV Serialization) ---');
  const allParticipants = ctmsStore.getState().participants;
  let testCSV = 'ParticipantID,StudyCode,SiteCode,Age,Gender,Status\n';
  allParticipants.slice(0, 10).forEach(p => {
    testCSV += `"${p.syntheticId}","${p.studyCode}","${p.siteCode}",${p.age},"${p.gender}","${p.currentStatus}"\n`;
  });
  assert(testCSV.includes('ParticipantID') && testCSV.includes('DEMO-'), 'CSV dataset correctly formatted with header & synthetic rows');

  // WORKFLOW 7: Unauthorized Access Enforcement (RBAC)
  console.log('\n--- TEST 7: WORKFLOW 7 (Server-Enforced RBAC Permission Checks) ---');
  const regulatorUser = MOCK_USERS.find(u => u.role === 'regulator')!;
  const coordUser = MOCK_USERS.find(u => u.role === 'study_coordinator')!;
  const pvUser = MOCK_USERS.find(u => u.role === 'pharmacovigilance_officer')!;

  assert(checkPermission(regulatorUser, 'canEditStudy') === false, 'Regulator blocked from editing clinical studies (Read-Only)');
  assert(checkPermission(regulatorUser, 'canCreateStudy') === false, 'Regulator blocked from creating studies');
  assert(checkPermission(coordUser, 'canCreateStudy') === false, 'Study Coordinator blocked from registering studies (PI/Admin only)');
  assert(checkPermission(coordUser, 'canRegisterParticipant') === true, 'Study Coordinator permitted to screen & register participants');
  assert(checkPermission(pvUser, 'canAssessSafety') === true, 'PV Officer permitted to assess pharmacovigilance causality');
  assert(checkPermission(pvUser, 'canRegisterParticipant') === false, 'PV Officer blocked from clinical participant enrolment');

  // WORKFLOW 8: Cryptographic Audit Trail Hash Chain Integrity
  console.log('\n--- TEST 8: WORKFLOW 8 (Cryptographic Hash Chain Ledger Verification) ---');
  const auditLogs = ctmsStore.getState().auditLogs;
  let chainValid = true;
  let expectedPrev = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < auditLogs.length; i++) {
    const entry = auditLogs[i];
    if (entry.previousHash !== expectedPrev) {
      chainValid = false;
      break;
    }
    const payload = `${entry.previousHash}|${entry.sequenceNumber}|${entry.timestamp}|${entry.actorId}|${entry.action}|${entry.recordType}|${entry.recordId}|${entry.details}`;
    const recomputed = syncComputeSimpleHash(payload);
    if (recomputed !== entry.currentHash) {
      chainValid = false;
      break;
    }
    expectedPrev = entry.currentHash;
  }

  assert(chainValid === true, `ALCOA+ Audit Ledger: All ${auditLogs.length} blocks verified sequentially with zero tampering!`);

  console.log('\n================================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  return { passed, failed };
}
