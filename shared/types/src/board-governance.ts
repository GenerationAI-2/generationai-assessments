/**
 * Board Governance Assessment Types
 * Types for AI Board Governance Diagnostic submissions and reports
 */

/**
 * Board Governance Assessment Submission
 * Data submitted from the board governance diagnostic form
 */
export interface BoardGovernanceSubmission {
  // Contact Information
  email: string;
  contact_name: string;
  company_name: string;

  // Governance Assessment Questions (13 total)
  q1_board_risk: string;        // Board Risk Awareness
  q2_oversight: string;          // Oversight & Accountability
  q3_risk_appetite: string;      // Risk Appetite
  q4_strategic: string;          // Strategic Integration
  q5_policy: string;             // Policy & Controls
  q6_risk_reporting: string;     // Risk Oversight
  q7_stakeholder: string;        // Stakeholder Accountability
  q8_incident: string;           // Incident Preparedness
  q9_vendor: string;             // Third-Party/Vendor AI Risk
  q10_development: string;       // Board Development & Investment
  q11_forward: string;           // Forward-Looking Governance
  q12_competitive: string;       // Competitive Risk Awareness
  q13_decision: string;          // Board Decision Evidence
}

/**
 * Board Governance Report Data
 * Complete data structure for PDF report generation
 */
export interface BoardGovernanceReportData {
  // Basic Info
  email: string;
  contact_name: string;
  company_name: string;
  response_date: string;

  // Overall Score & Band
  governance_score: string;      // 0-100
  band_name: string;             // Weak/Emerging/Developing/Mature Governance
  band_narrative: string;        // Full band description

  // Question 1: Board Risk Awareness
  q1_board_risk_status: string;
  q1_board_risk_risk: string;
  q1_board_risk_answer: string;
  q1_board_risk_blurb: string;

  // Question 2: Oversight & Accountability
  q2_oversight_status: string;
  q2_oversight_risk: string;
  q2_oversight_answer: string;
  q2_oversight_blurb: string;

  // Question 3: Risk Appetite
  q3_risk_appetite_status: string;
  q3_risk_appetite_risk: string;
  q3_risk_appetite_answer: string;
  q3_risk_appetite_blurb: string;

  // Question 4: Strategic Integration
  q4_strategic_status: string;
  q4_strategic_risk: string;
  q4_strategic_answer: string;
  q4_strategic_blurb: string;

  // Question 5: Policy & Controls
  q5_policy_status: string;
  q5_policy_risk: string;
  q5_policy_answer: string;
  q5_policy_blurb: string;

  // Question 6: Risk Oversight
  q6_risk_reporting_status: string;
  q6_risk_reporting_risk: string;
  q6_risk_reporting_answer: string;
  q6_risk_reporting_blurb: string;

  // Question 7: Stakeholder Accountability
  q7_stakeholder_status: string;
  q7_stakeholder_risk: string;
  q7_stakeholder_answer: string;
  q7_stakeholder_blurb: string;

  // Question 8: Incident Preparedness
  q8_incident_status: string;
  q8_incident_risk: string;
  q8_incident_answer: string;
  q8_incident_blurb: string;

  // Question 9: Third-Party/Vendor AI Risk
  q9_vendor_status: string;
  q9_vendor_risk: string;
  q9_vendor_answer: string;
  q9_vendor_blurb: string;

  // Question 10: Board Development & Investment
  q10_development_status: string;
  q10_development_risk: string;
  q10_development_answer: string;
  q10_development_blurb: string;

  // Question 11: Forward-Looking Governance
  q11_forward_status: string;
  q11_forward_risk: string;
  q11_forward_answer: string;
  q11_forward_blurb: string;

  // Question 12: Competitive Risk Awareness
  q12_competitive_status: string;
  q12_competitive_risk: string;
  q12_competitive_answer: string;
  q12_competitive_blurb: string;

  // Question 13: Board Decision Evidence
  q13_decision_status: string;
  q13_decision_risk: string;
  q13_decision_answer: string;
  q13_decision_blurb: string;

  // Priority Gaps (3 lowest-scoring areas)
  gap_1: string;
  gap_2: string;
  gap_3: string;
}

/**
 * Board Governance Scoring Result
 * Output from the scoring engine
 */
export interface BoardGovernanceScoringResult {
  templateName: string;
  data: BoardGovernanceReportData;
  metadata: {
    final_score: number;
    band: string;
    question_scores: BoardGovernanceQuestionScore[];
    processing_date: string;
  };
}

/**
 * Individual Question Score
 * Score and metadata for a single governance question
 */
export interface BoardGovernanceQuestionScore {
  key: string;
  score: number;
  status: string;    // Strong, Good, Developing, Weak, Poor, Absent
  risk: string;      // Low, Medium, High, Critical
  answer: string;    // Playback text
  blurb: string;     // Interpretation text
}

/**
 * Maturity Bands
 */
export type GovernanceBand =
  | 'Weak Governance'
  | 'Emerging Governance'
  | 'Developing Governance'
  | 'Mature Governance';

/**
 * Status Levels
 */
export type GovernanceStatus =
  | 'Strong'
  | 'Good'
  | 'Developing'
  | 'Weak'
  | 'Poor'
  | 'Absent';

/**
 * Risk Levels
 */
export type GovernanceRisk =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';
