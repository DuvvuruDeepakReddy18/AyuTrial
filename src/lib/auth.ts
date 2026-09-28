import { UserProfile, UserRole } from '@/types';

export interface RolePermissions {
  canCreateStudy: boolean;
  canEditStudy: boolean;
  canRegisterParticipant: boolean;
  canEditClinicalData: boolean;
  canLogMonitoringVisit: boolean;
  canManageCAPA: boolean;
  canLogDeviation: boolean;
  canCreateSafetyReport: boolean;
  canAssessSafety: boolean;
  canSubmitToAuthority: boolean;
  canReviewEthics: boolean;
  canManageUsers: boolean;
  canExportCDISC: boolean;
  canInspectAuditTrail: boolean;
  isReadOnly: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateStudy: true,
    canEditStudy: true,
    canRegisterParticipant: true,
    canEditClinicalData: true,
    canLogMonitoringVisit: true,
    canManageCAPA: true,
    canLogDeviation: true,
    canCreateSafetyReport: true,
    canAssessSafety: true,
    canSubmitToAuthority: true,
    canReviewEthics: true,
    canManageUsers: true,
    canExportCDISC: true,
    canInspectAuditTrail: true,
    isReadOnly: false
  },
  pi: {
    canCreateStudy: true,
    canEditStudy: true,
    canRegisterParticipant: false,
    canEditClinicalData: true,
    canLogMonitoringVisit: false,
    canManageCAPA: true,
    canLogDeviation: true,
    canCreateSafetyReport: true,
    canAssessSafety: true,
    canSubmitToAuthority: false,
    canReviewEthics: false,
    canManageUsers: false,
    canExportCDISC: true,
    canInspectAuditTrail: true,
    isReadOnly: false
  },
  study_coordinator: {
    canCreateStudy: false,
    canEditStudy: false,
    canRegisterParticipant: true,
    canEditClinicalData: true,
    canLogMonitoringVisit: false,
    canManageCAPA: false,
    canLogDeviation: true,
    canCreateSafetyReport: true,
    canAssessSafety: false,
    canSubmitToAuthority: false,
    canReviewEthics: false,
    canManageUsers: false,
    canExportCDISC: false,
    canInspectAuditTrail: false,
    isReadOnly: false
  },
  cra_monitor: {
    canCreateStudy: false,
    canEditStudy: false,
    canRegisterParticipant: false,
    canEditClinicalData: false,
    canLogMonitoringVisit: true,
    canManageCAPA: true,
    canLogDeviation: true,
    canCreateSafetyReport: true,
    canAssessSafety: false,
    canSubmitToAuthority: false,
    canReviewEthics: false,
    canManageUsers: false,
    canExportCDISC: false,
    canInspectAuditTrail: true,
    isReadOnly: false
  },
  iec_member: {
    canCreateStudy: false,
    canEditStudy: false,
    canRegisterParticipant: false,
    canEditClinicalData: false,
    canLogMonitoringVisit: false,
    canManageCAPA: false,
    canLogDeviation: false,
    canCreateSafetyReport: false,
    canAssessSafety: false,
    canSubmitToAuthority: false,
    canReviewEthics: true,
    canManageUsers: false,
    canExportCDISC: false,
    canInspectAuditTrail: true,
    isReadOnly: false
  },
  pharmacovigilance_officer: {
    canCreateStudy: false,
    canEditStudy: false,
    canRegisterParticipant: false,
    canEditClinicalData: false,
    canLogMonitoringVisit: false,
    canManageCAPA: false,
    canLogDeviation: false,
    canCreateSafetyReport: true,
    canAssessSafety: true,
    canSubmitToAuthority: true,
    canReviewEthics: false,
    canManageUsers: false,
    canExportCDISC: true,
    canInspectAuditTrail: true,
    isReadOnly: false
  },
  regulator: {
    canCreateStudy: false,
    canEditStudy: false,
    canRegisterParticipant: false,
    canEditClinicalData: false,
    canLogMonitoringVisit: false,
    canManageCAPA: false,
    canLogDeviation: false,
    canCreateSafetyReport: false,
    canAssessSafety: false,
    canSubmitToAuthority: false,
    canReviewEthics: false,
    canManageUsers: false,
    canExportCDISC: true,
    canInspectAuditTrail: true,
    isReadOnly: true
  }
};

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  admin: {
    label: 'Institutional Administrator',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'System configuration, multi-centre governance, institutional analytics, user management.'
  },
  pi: {
    label: 'Principal Investigator (PI)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Protocol oversight, study performance, safety sign-offs, recruitment leadership.'
  },
  study_coordinator: {
    label: 'Study Coordinator',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Participant screening, enrolment, visit scheduling, eCRF data entry, query resolution.'
  },
  cra_monitor: {
    label: 'CRA / Monitor',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Site monitoring visits, source data verification, CAPA tracking, protocol deviations.'
  },
  iec_member: {
    label: 'Institutional Ethics Committee',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Protocol ethics approvals, continuing review, patient consent and safety oversight.'
  },
  pharmacovigilance_officer: {
    label: 'Pharmacovigilance Officer (NPvCC)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'AIIA National Pharmacovigilance Centre, ADR/SAE causality assessment, CDSCO triage.'
  },
  regulator: {
    label: 'Read-only Regulator (CDSCO/Ayush)',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Auditing authority, compliance verification, regulatory milestone inspections.'
  }
};

export function checkPermission(user: UserProfile | null, permission: keyof RolePermissions): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
}
