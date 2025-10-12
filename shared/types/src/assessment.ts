/**
 * Shared types for Shadow AI Assessment
 */

export interface AssessmentSubmission {
  email: string;
  contact_name: string;
  company_name: string;
  opt_in_marketing?: boolean;
  org_size: string;
  sector: string;
  access: string;
  incidents: string;
  approval: string;
  usage_visibility: string;
  detection: string;
  policy: string;
  training: string;
  risk_concerns: string[];
  exposure: string;
  traceability: string;
  compliance_awareness: string;
}

export interface ReportData {
  email: string;
  contact_name: string;
  company_name: string;
  total_score: string;
  maturity_label: string;
  maturity_blurb: string;
  org_size: string;
  sector: string;
  access_status: string;
  access_risk: string;
  access_blurb: string;
  approval_status: string;
  approval_risk: string;
  approval_blurb: string;
  detection_status: string;
  detection_risk: string;
  detection_blurb: string;
  policy_status: string;
  policy_risk: string;
  policy_blurb: string;
  training_status: string;
  training_risk: string;
  training_blurb: string;
  exposure_status: string;
  exposure_risk: string;
  exposure_blurb: string;
  traceability_status: string;
  traceability_risk: string;
  traceability_blurb: string;
  compliance_status: string;
  compliance_risk: string;
  compliance_blurb: string;
  incidents_status: string;
  incidents_risk: string;
  incidents_blurb: string;
  usage_blurb: string;
  incident_banner: string;
  step_1: string;
  step_2: string;
  step_3: string;
  step_4: string;
  response_date: string;
}

export interface ScoringResult {
  templateName: string;
  data: ReportData;
  metadata: {
    score: number;
    band: string;
    flags: string[];
    processing_date: string;
  };
}

export interface AirtableRecord {
  email: string;
  contact_name: string;
  company_name: string;
  org_size: string;
  sector: string;
  score: number;
  maturity_band: string;
  pdf_url: string;
  submitted_at: string;
  access: string;
  incidents: string;
  approval: string;
  usage_visibility: string;
  detection: string;
  policy: string;
  training: string;
  risk_concerns: string;
  exposure: string;
  traceability: string;
  compliance_awareness: string;
}