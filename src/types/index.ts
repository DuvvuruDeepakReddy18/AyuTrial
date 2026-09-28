// Type definitions for AIIA Clinical Trial Management System (AyuTrial)

export type UserRole =
  | 'pi'                      // Principal Investigator
  | 'study_coordinator'       // Study Coordinator
  | 'cra_monitor'             // Clinical Research Associate / Monitor
  | 'iec_member'              // Institutional Ethics Committee
  | 'pharmacovigilance_officer'// Pharmacovigilance Officer (NPvCC)
  | 'admin'                   // Institutional Administrator
  | 'regulator';              // Read-only Regulator (CDSCO/Ayush)

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  institution: string;
  department: string;
  assignedStudyIds: string[];
  assignedSiteIds: string[];
  avatarUrl?: string;
}

export type StudyStatus =
  | 'draft'
  | 'under_review'
  | 'awaiting_ethics'
  | 'awaiting_ctri'
  | 'ready_to_start'
  | 'recruiting'
  | 'active'
  | 'suspended'
  | 'completed'
  | 'closed';

export type StudyType =
  | 'Interventional RCT'
  | 'Observational Cohort'
  | 'Pragmatic Clinical Trial'
  | 'Safety & Pharmacovigilance Registry'
  | 'Comparative Effectiveness';

export type StudyPhase = 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV / Post-Marketing' | 'Pilot / Exploratory';

export interface Milestone {
  id: string;
  title: string;
  category: 'protocol' | 'ethics' | 'ctri' | 'site_activation' | 'recruitment' | 'data_lock' | 'reporting';
  plannedDate: string;
  actualDate?: string;
  responsiblePerson: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dependencies?: string[];
  evidenceRef?: string;
  comments?: string;
}

export interface Study {
  id: string;
  code: string;
  title: string;
  protocolNumber: string;
  protocolVersion: string;
  studyType: StudyType;
  phase: StudyPhase;
  principalInvestigator: string;
  piId: string;
  sponsor: string;
  indication: string;
  ayushSystem: 'Ayurveda' | 'Siddha' | 'Unani' | 'Homeopathy' | 'Integrative';
  investigationalProduct: string;
  comparatorProduct?: string;
  plannedTarget: number;
  enrolledCount: number;
  screenedCount: number;
  completedCount: number;
  startDate: string;
  endDate: string;
  status: StudyStatus;
  participatingSiteIds: string[];
  ctriNumber: string;
  ctriStatus: 'Registered' | 'Pending Verification' | 'Query Raised' | 'Not Submitted';
  ctriUrl?: string;
  iecName: string;
  iecApprovalRef: string;
  iecApprovalDate?: string;
  iecExpiryDate?: string;
  iecStatus: 'Approved' | 'Under Review' | 'Queries Raised' | 'Expired';
  milestones: Milestone[];
  assignedTeam: {
    userId: string;
    name: string;
    role: UserRole;
  }[];
  documentsCount: number;
  budgetAllocatedLakhs: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSite {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  principalInvestigator: string;
  piPhone: string;
  status: 'active' | 'pending_activation' | 'suspended' | 'closed';
  recruitmentTarget: number;
  enrolledCount: number;
  lastMonitoringDate?: string;
  nextMonitoringDate: string;
  openFindingsCount: number;
  ethicsApprovalStatus: 'Approved' | 'Pending' | 'Renewal Required';
}

export type ParticipantStatus =
  | 'Screened'
  | 'Eligible'
  | 'Screen Failure'
  | 'Enrolled'
  | 'Active Treatment'
  | 'In Follow-up'
  | 'Completed'
  | 'Withdrawn'
  | 'Lost to Follow-up';

export interface Participant {
  id: string;
  syntheticId: string; // e.g. DEMO-001
  studyId: string;
  studyCode: string;
  siteId: string;
  siteCode: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  screeningNumber: string;
  screeningDate: string;
  eligibilityStatus: 'Eligible' | 'Screen Failure' | 'Pending';
  screenFailureReason?: string;
  consentStatus: 'Consented' | 'Pending' | 'Re-consent Required' | 'Withdrawn';
  consentDate?: string;
  enrolmentStatus: 'Enrolled' | 'Not Enrolled';
  enrolmentDate?: string;
  randomizationId?: string;
  treatmentArm?: 'Experimental (ASU Formulation)' | 'Active Comparator' | 'Placebo Control';
  currentStatus: ParticipantStatus;
  adherencePercentage: number;
  completedVisitsCount: number;
  totalScheduledVisits: number;
  hasAdverseEvent: boolean;
  notes?: string;
}

export interface ScheduledVisit {
  id: string;
  participantId: string;
  syntheticId: string;
  studyId: string;
  visitName: string;
  visitCode: string;
  plannedDate: string;
  actualDate?: string;
  windowDaysAllowed: number;
  status: 'scheduled' | 'completed' | 'missed' | 'deviated' | 'overdue';
  vitalsCompleted: boolean;
  ayushAssessmentCompleted: boolean;
  labSpecimensCollected: boolean;
  drugDispensed: boolean;
  drugComplianceRate?: number;
  examinerName: string;
  notes?: string;
}

export interface MonitoringVisit {
  id: string;
  visitNumber: string;
  studyId: string;
  siteId: string;
  monitorName: string;
  visitType: 'Site Initiation (SIV)' | 'Interim Monitoring (IMV)' | 'For-Cause Audit' | 'Close-out (COV)';
  scheduledDate: string;
  conductedDate?: string;
  status: 'planned' | 'completed' | 'overdue' | 'draft_report';
  summaryFindings: string;
  totalFindings: number;
  openFindings: number;
  capaRequired: boolean;
}

export interface MonitoringFinding {
  id: string;
  monitoringVisitId: string;
  studyId: string;
  siteId: string;
  category: 'Consent & Regulatory' | 'IP Accountability' | 'Source Data Verification' | 'Protocol Adherence' | 'Safety Reporting';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  rootCause?: string;
  capaAction: string;
  responsiblePerson: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Overdue';
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface ProtocolDeviation {
  id: string;
  deviationCode: string;
  studyId: string;
  siteId: string;
  participantId?: string;
  dateIdentified: string;
  category: 'Informed Consent' | 'Eligibility Criteria' | 'IP Dosing / Non-compliance' | 'Visit Window Exceeded' | 'Prohibited Concomitant Med' | 'Lab Assessment Missed';
  severity: 'Minor' | 'Major' | 'Critical';
  description: string;
  impactAssessment: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  reportedToIEC: boolean;
  iecNotificationDate?: string;
  status: 'Open' | 'Under Investigation' | 'CAPA Implemented' | 'Closed';
}

export interface DataQuery {
  id: string;
  queryNumber: string;
  studyId: string;
  siteId: string;
  participantId: string;
  formName: string;
  fieldName: string;
  queryText: string;
  raisedBy: string;
  raisedDate: string;
  assignedRole: UserRole;
  status: 'Open' | 'Answered' | 'Closed' | 'Cancelled';
  responseNotes?: string;
  closedDate?: string;
}

export type SeriousnessCriterion =
  | 'death'
  | 'life_threatening'
  | 'hospitalization'
  | 'disability'
  | 'congenital_anomaly'
  | 'medically_significant';

export type WhoUmcCausality =
  | 'Certain'
  | 'Probable / Likely'
  | 'Possible'
  | 'Unlikely'
  | 'Conditional / Unclassified'
  | 'Unassessable / Unclassifiable';

export type AyushDosageForm =
  | 'Kashaya (Decoction)'
  | 'Vati / Gutika (Tablet)'
  | 'Churna (Powder)'
  | 'Taila (Medicated Oil)'
  | 'Asava / Arishta (Fermented)'
  | 'Capsule'
  | 'Syrup'
  | 'Tablet'
  | 'Kupipakwa Rasayana (Sublimated Formulation)'
  | 'Bhasma'
  | 'Other';

export interface SafetyCase {
  id: string;
  caseNumber: string;
  studyId: string;
  studyCode: string;
  siteId: string;
  siteName: string;
  syntheticParticipantId: string;
  reportType: 'Initial' | 'Follow-up 1' | 'Follow-up 2' | 'Final';
  receivedDate: string;
  reporterName: string;
  reporterRole: string;
  
  // Event Information
  eventTerm: string;
  meddraSyntheticCode: string;
  ayushTermEquivalent: string;
  eventOnsetDate: string;
  eventEndDate?: string;
  outcome: 'Recovered / Resolved' | 'Recovering / Resolving' | 'Not Recovered' | 'Fatal' | 'Unknown';
  isSerious: boolean;
  seriousnessCriteria: SeriousnessCriterion[];
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';
  expectedness: 'Expected' | 'Unexpected';
  
  // Suspected Product Details (Ayush focus)
  suspectedProduct: string;
  ayushDosageForm: AyushDosageForm;
  batchNumber: string;
  dosageAndRoute: string;
  therapyStartDate: string;
  therapyStopDate?: string;
  dechallenge: 'Positive (improved upon stopping)' | 'Negative (no change)' | 'Not Applicable';
  rechallenge: 'Not Done' | 'Positive (recurred)' | 'Negative';
  concomitantMedications: string;

  // Assessments & Medical Review
  causalityAssessment: WhoUmcCausality;
  naranjoScore?: number;
  medicalSummary: string;
  assessedBy: string;
  assessedDate?: string;
  dsmbReviewStatus: 'Pending DSMB' | 'DSMB Concurrence' | 'Action Recommended' | 'Not Required';

  // Regulatory Reporting Deadlines (Configured)
  regulatoryDeadlineHours: number; // 24 for fatal/life threatening SAE, 168 (7 days) for serious unexpected, 336 (14 days) standard
  deadlineDate: string;
  submissionStatus: 'Draft' | 'Submitted to NPvCC' | 'Forwarded to CDSCO' | 'Closed';
  submissionDate?: string;
  ackReference?: string;
  overdue: boolean;
}

export interface EthicsSubmission {
  id: string;
  studyId: string;
  studyCode: string;
  iecName: string;
  submissionRef: string;
  protocolVersion: string;
  submissionDate: string;
  reviewMeetingDate: string;
  approvalStatus: 'Approved' | 'Provisional Approval' | 'Queries Raised' | 'Under Review' | 'Expired';
  approvalRef: string;
  approvalDate: string;
  expiryDate: string;
  isNearingExpiry: boolean;
  continuingReviewDueDate: string;
  requiredDocumentsChecklist: {
    docName: string;
    submitted: boolean;
    approved: boolean;
  }[];
}

export interface InformedConsentRecord {
  id: string;
  participantId: string;
  syntheticId: string;
  studyId: string;
  documentVersion: string;
  language: 'Hindi' | 'English' | 'Sanskrit' | 'Tamil' | 'Marathi' | 'Bengali';
  consentDate: string;
  status: 'Consented' | 'Re-consent Required' | 'Withdrawn' | 'Pending';
  obtainedBy: string;
  audioVideoConsentRequired: boolean;
  audioVideoRecorded: boolean;
  witnessName?: string;
  withdrawalReason?: string;
  documentRef: string;
}

export interface AuditLogEntry {
  id: string;
  sequenceNumber: number;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'APPROVE' | 'EXPORT' | 'SAFETY_SUBMIT' | 'LOGIN';
  recordType: 'Study' | 'Participant' | 'SafetyCase' | 'Monitoring' | 'Deviation' | 'Consent' | 'Query' | 'User';
  recordId: string;
  recordIdentifier: string;
  timestamp: string;
  details: string;
  ipAddress: string;
  previousHash: string;
  currentHash: string;
}

export interface AppNotification {
  id: string;
  category: 'safety' | 'regulatory' | 'ethics' | 'recruitment' | 'monitoring' | 'deviation';
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  relatedRecordId?: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
  responsibleRole: UserRole;
}
