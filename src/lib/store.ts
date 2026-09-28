'use client';

// Persistent Client/Server CTMS Store with Real Mutation Capabilities and Cryptographic Audit Log
import {
  UserProfile,
  Study,
  ResearchSite,
  Participant,
  MonitoringVisit,
  MonitoringFinding,
  ProtocolDeviation,
  DataQuery,
  SafetyCase,
  EthicsSubmission,
  AuditLogEntry,
  AppNotification,
  UserRole
} from '@/types';
import {
  MOCK_USERS,
  MOCK_SITES,
  MOCK_STUDIES,
  MOCK_PARTICIPANTS,
  MOCK_SAFETY_CASES,
  MOCK_MONITORING_VISITS,
  MOCK_MONITORING_FINDINGS,
  MOCK_DEVIATIONS,
  MOCK_DATA_QUERIES,
  MOCK_ETHICS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS
} from './mockData';
import { syncComputeSimpleHash } from './crypto';

interface StoreState {
  currentUser: UserProfile;
  isDemoMode: boolean;
  studies: Study[];
  sites: ResearchSite[];
  participants: Participant[];
  safetyCases: SafetyCase[];
  monitoringVisits: MonitoringVisit[];
  monitoringFindings: MonitoringFinding[];
  deviations: ProtocolDeviation[];
  dataQueries: DataQuery[];
  ethicsSubmissions: EthicsSubmission[];
  auditLogs: AuditLogEntry[];
  notifications: AppNotification[];
}

const STORAGE_KEY = 'aiia_ctms_v1_state';

class CTMSStore {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): StoreState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed;
        }
      } catch (e) {
        console.error('Failed to load state from localStorage', e);
      }
    }
    return {
      currentUser: MOCK_USERS[5], // default to Admin for SIH Demo: Vikramaditya Sen
      isDemoMode: true,
      studies: [...MOCK_STUDIES],
      sites: [...MOCK_SITES],
      participants: [...MOCK_PARTICIPANTS],
      safetyCases: [...MOCK_SAFETY_CASES],
      monitoringVisits: [...MOCK_MONITORING_VISITS],
      monitoringFindings: [...MOCK_MONITORING_FINDINGS],
      deviations: [...MOCK_DEVIATIONS],
      dataQueries: [...MOCK_DATA_QUERIES],
      ethicsSubmissions: [...MOCK_ETHICS],
      auditLogs: [...MOCK_AUDIT_LOGS],
      notifications: [...MOCK_NOTIFICATIONS]
    };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('Failed to persist state', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getState(): StoreState {
    return this.state;
  }

  public resetToDefaultDemo() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = {
      currentUser: MOCK_USERS[5],
      isDemoMode: true,
      studies: [...MOCK_STUDIES],
      sites: [...MOCK_SITES],
      participants: [...MOCK_PARTICIPANTS],
      safetyCases: [...MOCK_SAFETY_CASES],
      monitoringVisits: [...MOCK_MONITORING_VISITS],
      monitoringFindings: [...MOCK_MONITORING_FINDINGS],
      deviations: [...MOCK_DEVIATIONS],
      dataQueries: [...MOCK_DATA_QUERIES],
      ethicsSubmissions: [...MOCK_ETHICS],
      auditLogs: [...MOCK_AUDIT_LOGS],
      notifications: [...MOCK_NOTIFICATIONS]
    };
    this.persist();
  }

  // Role Switcher for Demo
  public setCurrentUserByRole(role: UserRole) {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) {
      this.state.currentUser = user;
      this.addAuditEntry('LOGIN', 'User', user.id, user.name, `Switched demo role to ${user.title} (${role})`);
      this.persist();
    }
  }

  public setCurrentUser(user: UserProfile) {
    this.state.currentUser = user;
    this.addAuditEntry('LOGIN', 'User', user.id, user.name, `Logged in as ${user.title}`);
    this.persist();
  }

  // ALCOA+ Cryptographic Audit Logger
  public addAuditEntry(
    action: AuditLogEntry['action'],
    recordType: AuditLogEntry['recordType'],
    recordId: string,
    recordIdentifier: string,
    details: string
  ) {
    const prevLog = this.state.auditLogs[this.state.auditLogs.length - 1];
    const prevHash = prevLog ? prevLog.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const seq = (prevLog ? prevLog.sequenceNumber : 0) + 1;
    const timestamp = new Date().toISOString();
    const actor = this.state.currentUser;

    const payload = `${prevHash}|${seq}|${timestamp}|${actor.id}|${action}|${recordType}|${recordId}|${details}`;
    const currentHash = syncComputeSimpleHash(payload);

    const newEntry: AuditLogEntry = {
      id: `audit-${seq}`,
      sequenceNumber: seq,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      recordType,
      recordId,
      recordIdentifier,
      timestamp,
      details,
      ipAddress: '14.139.58.12 (AIIA Campus Network)',
      previousHash: prevHash,
      currentHash
    };

    this.state.auditLogs.push(newEntry);
  }

  // STUDY OPERATIONS
  public createStudy(newStudyData: Omit<Study, 'id' | 'createdAt' | 'updatedAt' | 'documentsCount' | 'enrolledCount' | 'screenedCount' | 'completedCount' | 'milestones'>): Study {
    const id = `study-${String(this.state.studies.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const study: Study = {
      ...newStudyData,
      id,
      enrolledCount: 0,
      screenedCount: 0,
      completedCount: 0,
      documentsCount: 4,
      createdAt: now,
      updatedAt: now,
      milestones: [
        {
          id: `m-${id}-1`,
          title: 'Initial Protocol Registration',
          category: 'protocol',
          plannedDate: newStudyData.startDate,
          actualDate: now.split('T')[0],
          responsiblePerson: newStudyData.principalInvestigator,
          status: 'completed'
        },
        {
          id: `m-${id}-2`,
          title: 'Institutional Ethics Committee Review',
          category: 'ethics',
          plannedDate: newStudyData.startDate,
          responsiblePerson: 'Prof. V. K. Joshi',
          status: 'in_progress'
        },
        {
          id: `m-${id}-3`,
          title: 'CTRI Prospective Registration Verification',
          category: 'ctri',
          plannedDate: newStudyData.startDate,
          responsiblePerson: newStudyData.principalInvestigator,
          status: 'pending'
        }
      ]
    };

    this.state.studies.unshift(study);
    this.addAuditEntry('CREATE', 'Study', study.id, study.code, `New clinical study registered: "${study.title}" by ${this.state.currentUser.name}`);
    this.persist();
    return study;
  }

  public updateStudy(id: string, updates: Partial<Study>) {
    const idx = this.state.studies.findIndex(s => s.id === id);
    if (idx !== -1) {
      const old = this.state.studies[idx];
      this.state.studies[idx] = {
        ...old,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.addAuditEntry('UPDATE', 'Study', id, old.code, `Study details modified for ${old.code}. Status: ${updates.status || old.status}`);
      this.persist();
    }
  }

  // PARTICIPANT OPERATIONS
  public registerParticipant(data: {
    studyId: string;
    siteId: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    eligibilityStatus: Participant['eligibilityStatus'];
    screenFailureReason?: string;
    consentStatus: Participant['consentStatus'];
    enrolmentStatus: Participant['enrolmentStatus'];
    treatmentArm?: Participant['treatmentArm'];
  }): Participant {
    const study = this.state.studies.find(s => s.id === data.studyId);
    const site = this.state.sites.find(s => s.id === data.siteId);
    const idNum = this.state.participants.length + 1;
    const syntheticId = `DEMO-${String(idNum).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newPart: Participant = {
      id: `part-${idNum}`,
      syntheticId,
      studyId: data.studyId,
      studyCode: study ? study.code : 'AIIA-STUDY',
      siteId: data.siteId,
      siteCode: site ? site.code : 'SITE-01',
      age: data.age,
      gender: data.gender,
      screeningNumber: `SCR-${site ? site.code : 'DEL'}-${100 + idNum}`,
      screeningDate: today,
      eligibilityStatus: data.eligibilityStatus,
      screenFailureReason: data.screenFailureReason,
      consentStatus: data.consentStatus,
      consentDate: data.consentStatus === 'Consented' ? today : undefined,
      enrolmentStatus: data.enrolmentStatus,
      enrolmentDate: data.enrolmentStatus === 'Enrolled' ? today : undefined,
      randomizationId: data.enrolmentStatus === 'Enrolled' ? `RND-${site ? site.code : 'DEL'}-${600 + idNum}` : undefined,
      treatmentArm: data.treatmentArm || 'Experimental (ASU Formulation)',
      currentStatus: data.enrolmentStatus === 'Enrolled' ? 'Active Treatment' : data.eligibilityStatus === 'Screen Failure' ? 'Screen Failure' : 'Screened',
      adherencePercentage: 100,
      completedVisitsCount: 1,
      totalScheduledVisits: 6,
      hasAdverseEvent: false
    };

    this.state.participants.unshift(newPart);

    // Update study counts
    if (study) {
      study.screenedCount += 1;
      if (data.enrolmentStatus === 'Enrolled') {
        study.enrolledCount += 1;
      }
    }
    // Update site counts
    if (site && data.enrolmentStatus === 'Enrolled') {
      site.enrolledCount += 1;
    }

    this.addAuditEntry(
      'CREATE',
      'Participant',
      newPart.id,
      newPart.syntheticId,
      `Participant ${newPart.syntheticId} registered under study ${newPart.studyCode}. Status: ${newPart.currentStatus}`
    );
    this.persist();
    return newPart;
  }

  // PHARMACOVIGILANCE SAFETY REPORTING
  public createSafetyCase(data: Omit<SafetyCase, 'id' | 'caseNumber' | 'receivedDate' | 'overdue'>): SafetyCase {
    const count = this.state.safetyCases.length + 1;
    const now = new Date().toISOString();
    const caseNumber = `NPVCC/2026/${data.isSerious ? 'SAE' : 'ADR'}-${String(count).padStart(3, '0')}`;

    const newCase: SafetyCase = {
      ...data,
      id: `case-pv-${String(count).padStart(3, '0')}`,
      caseNumber,
      receivedDate: now,
      overdue: false
    };

    this.state.safetyCases.unshift(newCase);

    // Add high-priority notification if serious
    if (newCase.isSerious) {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        category: 'safety',
        title: `URGENT SAE: ${newCase.caseNumber}`,
        message: `${newCase.eventTerm} reported for ${newCase.syntheticParticipantId} (${newCase.suspectedProduct}). 24h reporting clock active.`,
        priority: 'critical',
        actionUrl: `/pharmacovigilance/${newCase.id}`,
        isRead: false,
        createdAt: now,
        responsibleRole: 'pharmacovigilance_officer'
      });
    }

    this.addAuditEntry(
      'SAFETY_SUBMIT',
      'SafetyCase',
      newCase.id,
      newCase.caseNumber,
      `Safety report ${newCase.caseNumber} filed for ${newCase.syntheticParticipantId} (${newCase.eventTerm}) by ${this.state.currentUser.name}`
    );

    this.persist();
    return newCase;
  }

  public updateSafetyCase(id: string, updates: Partial<SafetyCase>) {
    const idx = this.state.safetyCases.findIndex(c => c.id === id);
    if (idx !== -1) {
      const old = this.state.safetyCases[idx];
      this.state.safetyCases[idx] = { ...old, ...updates };
      this.addAuditEntry(
        'UPDATE',
        'SafetyCase',
        id,
        old.caseNumber,
        `Safety case ${old.caseNumber} updated. Assessment: ${updates.causalityAssessment || old.causalityAssessment}, Status: ${updates.submissionStatus || old.submissionStatus}`
      );
      this.persist();
    }
  }

  // MONITORING & FINDINGS
  public addMonitoringFinding(finding: Omit<MonitoringFinding, 'id'>) {
    const id = `find-${String(this.state.monitoringFindings.length + 1).padStart(3, '0')}`;
    const newFinding: MonitoringFinding = { ...finding, id };
    this.state.monitoringFindings.unshift(newFinding);
    this.addAuditEntry('CREATE', 'Monitoring', id, id, `Monitoring finding logged: ${newFinding.category} (${newFinding.severity})`);
    this.persist();
  }

  public resolveMonitoringFinding(id: string, resolutionNotes: string) {
    const finding = this.state.monitoringFindings.find(f => f.id === id);
    if (finding) {
      finding.status = 'Resolved';
      finding.resolutionNotes = resolutionNotes;
      finding.resolvedAt = new Date().toISOString();
      this.addAuditEntry('UPDATE', 'Monitoring', id, id, `Monitoring finding ${id} marked Resolved: ${resolutionNotes}`);
      this.persist();
    }
  }

  // PROTOCOL DEVIATIONS
  public createDeviation(dev: Omit<ProtocolDeviation, 'id' | 'deviationCode'>) {
    const code = `DEV-2026-${String(this.state.deviations.length + 1).padStart(3, '0')}`;
    const newDev: ProtocolDeviation = {
      ...dev,
      id: `dev-${this.state.deviations.length + 1}`,
      deviationCode: code
    };
    this.state.deviations.unshift(newDev);
    this.addAuditEntry('CREATE', 'Deviation', newDev.id, newDev.deviationCode, `Protocol deviation ${code} logged: ${newDev.category} (${newDev.severity})`);
    this.persist();
  }

  public updateDeviationStatus(id: string, status: ProtocolDeviation['status'], notes?: string) {
    const dev = this.state.deviations.find(d => d.id === id);
    if (dev) {
      dev.status = status;
      this.addAuditEntry('STATUS_CHANGE', 'Deviation', id, dev.deviationCode, `Deviation status updated to ${status}${notes ? ` - ${notes}` : ''}`);
      this.persist();
    }
  }

  // DATA QUERIES
  public answerDataQuery(id: string, notes: string) {
    const query = this.state.dataQueries.find(q => q.id === id);
    if (query) {
      query.status = 'Answered';
      query.responseNotes = notes;
      query.closedDate = new Date().toISOString().split('T')[0];
      this.addAuditEntry('UPDATE', 'Query', id, query.queryNumber, `Data query answered: ${query.queryNumber}`);
      this.persist();
    }
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }

  // DERIVED KPIS
  public getDerivedKPIs() {
    const activeStudies = this.state.studies.filter(s => s.status === 'recruiting' || s.status === 'active').length;
    const awaitingEthics = this.state.studies.filter(s => s.status === 'awaiting_ethics' || s.status === 'under_review').length;
    const totalScreened = this.state.participants.length;
    const totalEnrolled = this.state.participants.filter(p => p.enrolmentStatus === 'Enrolled').length;
    const totalPlanned = this.state.studies.reduce((sum, s) => sum + s.plannedTarget, 0);
    const targetAchievementPct = totalPlanned > 0 ? Math.round((totalEnrolled / totalPlanned) * 100) : 0;
    const overdueMonitoring = this.state.monitoringVisits.filter(v => v.status === 'overdue').length;
    const openDeviations = this.state.deviations.filter(d => d.status === 'Open' || d.status === 'Under Investigation').length;
    const openQueries = this.state.dataQueries.filter(q => q.status === 'Open').length;
    const pendingRegulatoryMilestones = this.state.studies.flatMap(s => s.milestones).filter(m => m.category === 'ctri' && m.status !== 'completed').length;
    const openSafetyReports = this.state.safetyCases.filter(c => c.submissionStatus !== 'Closed').length;
    const criticalSAEs = this.state.safetyCases.filter(c => c.isSerious && c.submissionStatus !== 'Closed').length;

    return {
      activeStudies,
      awaitingEthics,
      totalScreened,
      totalEnrolled,
      targetAchievementPct,
      overdueMonitoring,
      openDeviations,
      openQueries,
      pendingRegulatoryMilestones,
      openSafetyReports,
      criticalSAEs
    };
  }
}

// Global Singleton Store Instance
export const ctmsStore = new CTMSStore();
