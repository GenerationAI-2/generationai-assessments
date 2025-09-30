/**
 * Shadow AI Assessment - Scoring Engine
 * Ported from n8n JavaScript implementation
 */

import { SCORING_CONFIG } from './scoring-config';

export interface AssessmentSubmission {
  email: string;
  contact_name: string;
  company_name: string;
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

export interface ScoringResult {
  templateName: string;
  data: {
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
  };
  metadata: {
    score: number;
    band: string;
    flags: string[];
    processing_date: string;
  };
}

export class ScoringEngine {

  static process(submission: AssessmentSubmission): ScoringResult {
    const results = {
      score: 0,
      unknownCount: 0,
      templateData: {} as any,
      flags: [] as string[],
      responses: {} as any,
      responseIds: {} as any,
      email: submission.email
    };

    this.processAnswers(submission, results);
    return this.finalizeResults(results);
  }

  private static processAnswers(submission: AssessmentSubmission, results: any): void {
    const scoringKeys = new Set([
      'incidents', 'approval', 'access', 'usage_visibility', 'detection',
      'policy', 'training', 'risk_concerns', 'traceability', 'exposure', 'compliance_awareness'
    ]);

    // Process contact fields
    results.templateData.email = submission.email || "Not provided";
    results.templateData.contact_name = submission.contact_name || "Not provided";
    results.templateData.company_name = submission.company_name || "Not provided";

    // Process org_size and sector
    this.processSingleChoice('org_size', submission.org_size, results, scoringKeys);
    this.processSingleChoice('sector', submission.sector, results, scoringKeys);

    // Process all assessment questions
    this.processSingleChoice('access', submission.access, results, scoringKeys);
    this.processSingleChoice('incidents', submission.incidents, results, scoringKeys);
    this.processSingleChoice('approval', submission.approval, results, scoringKeys);
    this.processSingleChoice('usage_visibility', submission.usage_visibility, results, scoringKeys);
    this.processSingleChoice('detection', submission.detection, results, scoringKeys);
    this.processSingleChoice('policy', submission.policy, results, scoringKeys);
    this.processSingleChoice('training', submission.training, results, scoringKeys);
    this.processSingleChoice('exposure', submission.exposure, results, scoringKeys);
    this.processSingleChoice('traceability', submission.traceability, results, scoringKeys);
    this.processSingleChoice('compliance_awareness', submission.compliance_awareness, results, scoringKeys);

    // Process multi-select risk_concerns
    this.processMultiSelect('risk_concerns', submission.risk_concerns, results);
  }

  private static processSingleChoice(questionKey: string, responseId: string, results: any, scoringKeys: Set<string>): void {
    const questionConfig = SCORING_CONFIG.questions[questionKey];
    if (!questionConfig) return;

    const resp = questionConfig.responses[responseId];

    if (resp) {
      // Add to score if it's a scoring question
      if (scoringKeys.has(questionKey)) {
        results.score += (resp.score || 0);
      }

      // Check if it's an "unknown" response
      if (SCORING_CONFIG.escalation_rules.unknown_response_ids.includes(responseId)) {
        results.unknownCount++;
      }

      // Store based on question type
      if (questionKey === 'org_size' || questionKey === 'sector') {
        results.templateData[questionKey] = resp.label || "Not specified";
      } else {
        results.templateData[`${questionKey}_status`] = resp.status || SCORING_CONFIG.defaults.status;
        results.templateData[`${questionKey}_risk`] = resp.risk || SCORING_CONFIG.defaults.risk;
        results.templateData[`${questionKey}_blurb`] = resp.blurb || SCORING_CONFIG.defaults.blurb;
      }

      results.responseIds[questionKey] = responseId;
    } else {
      // Unmapped response
      if (scoringKeys.has(questionKey)) {
        results.score += SCORING_CONFIG.defaults.unmapped_score;
      }

      if (questionKey === 'org_size' || questionKey === 'sector') {
        results.templateData[questionKey] = "Not specified";
      } else {
        results.templateData[`${questionKey}_status`] = SCORING_CONFIG.defaults.status;
        results.templateData[`${questionKey}_risk`] = SCORING_CONFIG.defaults.risk;
        results.templateData[`${questionKey}_blurb`] = SCORING_CONFIG.defaults.blurb;
      }

      results.flags.push(`Unmapped: ${questionKey}="${responseId}"`);
    }
  }

  private static processMultiSelect(questionKey: string, responseIds: string[], results: any): void {
    const questionConfig = SCORING_CONFIG.questions[questionKey];
    if (!questionConfig || questionConfig.type !== 'multi_select') return;

    let multiScore = 0;
    responseIds.forEach(id => {
      const resp = questionConfig.responses[id];
      if (resp) {
        multiScore += (resp.score || 0);

        if (SCORING_CONFIG.escalation_rules.unknown_response_ids.includes(id)) {
          results.unknownCount++;
        }
      }
    });

    results.score += Math.min(multiScore, questionConfig.max_score || 15);
    results.responseIds[questionKey] = responseIds;
  }

  private static finalizeResults(results: any): ScoringResult {
    // Cap score at 100
    results.score = Math.min(results.score, 100);

    // Find maturity band
    let band = SCORING_CONFIG.bands.find(b =>
      results.score >= b.min_score && results.score <= b.max_score
    );

    if (!band) {
      band = SCORING_CONFIG.bands[SCORING_CONFIG.bands.length - 1];
    }

    // Escalate band for unknowns
    if (results.unknownCount >= SCORING_CONFIG.escalation_rules.unknown_threshold) {
      const idx = SCORING_CONFIG.bands.indexOf(band);
      if (idx < SCORING_CONFIG.bands.length - 1) {
        const old = band.label;
        band = SCORING_CONFIG.bands[idx + 1];
        results.flags.push(`Band escalated from ${old} due to ${results.unknownCount} unknown responses`);
      }
    }

    // Check for incident red-flag
    const incidentId = results.responseIds.incidents;
    let incidentBanner = "";
    let recs = [...band.recommendations];

    if (incidentId === 'f6MAOmbnYwZA') {
      incidentBanner = "CRITICAL: You reported a confirmed AI-related incident. Immediate action required: investigate the root cause, assess data exposure, and implement controls.";
      const incidentSteps = [
        "Investigate and document what happened",
        "Review data handling and staff guidance",
        "Consider external audit if regulated data was involved"
      ];
      recs = [...incidentSteps, ...recs];
      results.flags.push("Incident: confirmed (red-flag banner applied)");
    }

    const td = results.templateData;

    return {
      templateName: "Shadow-AI-Assessment.docx",
      data: {
        email: results.email || "Not provided",
        contact_name: td.contact_name || "Not provided",
        company_name: td.company_name || "Not provided",
        total_score: String(results.score),
        maturity_label: band.label,
        maturity_blurb: band.description,
        org_size: td.org_size || "Not specified",
        sector: td.sector || "Not specified",
        access_status: td.access_status || SCORING_CONFIG.defaults.status,
        access_risk: td.access_risk || SCORING_CONFIG.defaults.risk,
        access_blurb: td.access_blurb || SCORING_CONFIG.defaults.blurb,
        approval_status: td.approval_status || SCORING_CONFIG.defaults.status,
        approval_risk: td.approval_risk || SCORING_CONFIG.defaults.risk,
        approval_blurb: td.approval_blurb || SCORING_CONFIG.defaults.blurb,
        detection_status: td.detection_status || SCORING_CONFIG.defaults.status,
        detection_risk: td.detection_risk || SCORING_CONFIG.defaults.risk,
        detection_blurb: td.detection_blurb || SCORING_CONFIG.defaults.blurb,
        policy_status: td.policy_status || SCORING_CONFIG.defaults.status,
        policy_risk: td.policy_risk || SCORING_CONFIG.defaults.risk,
        policy_blurb: td.policy_blurb || SCORING_CONFIG.defaults.blurb,
        training_status: td.training_status || SCORING_CONFIG.defaults.status,
        training_risk: td.training_risk || SCORING_CONFIG.defaults.risk,
        training_blurb: td.training_blurb || SCORING_CONFIG.defaults.blurb,
        exposure_status: td.exposure_status || SCORING_CONFIG.defaults.status,
        exposure_risk: td.exposure_risk || SCORING_CONFIG.defaults.risk,
        exposure_blurb: td.exposure_blurb || SCORING_CONFIG.defaults.blurb,
        traceability_status: td.traceability_status || SCORING_CONFIG.defaults.status,
        traceability_risk: td.traceability_risk || SCORING_CONFIG.defaults.risk,
        traceability_blurb: td.traceability_blurb || SCORING_CONFIG.defaults.blurb,
        compliance_status: td.compliance_awareness_status || SCORING_CONFIG.defaults.status,
        compliance_risk: td.compliance_awareness_risk || SCORING_CONFIG.defaults.risk,
        compliance_blurb: td.compliance_awareness_blurb || SCORING_CONFIG.defaults.blurb,
        incidents_status: td.incidents_status || SCORING_CONFIG.defaults.status,
        incidents_risk: td.incidents_risk || SCORING_CONFIG.defaults.risk,
        incidents_blurb: td.incidents_blurb || SCORING_CONFIG.defaults.blurb,
        usage_blurb: td.usage_visibility_blurb || SCORING_CONFIG.defaults.blurb,
        incident_banner: incidentBanner,
        step_1: recs[0] || "Review current approach",
        step_2: recs[1] || "Assess capabilities",
        step_3: recs[2] || "Implement improvements",
        step_4: recs[3] || "Monitor progress",
        response_date: new Date().toLocaleDateString('en-NZ')
      },
      metadata: {
        score: results.score,
        band: band.label,
        flags: results.flags,
        processing_date: new Date().toISOString()
      }
    };
  }
}