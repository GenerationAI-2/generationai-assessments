/**
 * AI Board Governance Diagnostic - Scoring Engine
 * Processes 13 governance questions and generates detailed report data
 */

import { SCORING_CONFIG } from './scoring-config';

export interface AssessmentSubmission {
  email: string;
  contact_name: string;
  company_name: string;
  q1_board_risk: string;
  q2_oversight: string;
  q3_risk_appetite: string;
  q4_strategic: string;
  q5_policy: string;
  q6_risk_reporting: string;
  q7_stakeholder: string;
  q8_incident: string;
  q9_vendor: string;
  q10_development: string;
  q11_forward: string;
  q12_competitive: string;
  q13_decision: string;
}

export interface QuestionScore {
  key: string;
  score: number;
  status: string;
  risk: string;
  answer: string; // The label/playback
  blurb: string;  // The interpretation
}

export interface ScoringResult {
  templateName: string;
  data: {
    email: string;
    contact_name: string;
    company_name: string;
    governance_score: string;
    band_name: string;
    band_narrative: string;

    // All 13 questions - status, risk, answer, blurb
    q1_status: string;
    q1_risk: string;
    q1_answer: string;
    q1_blurb: string;

    q2_status: string;
    q2_risk: string;
    q2_answer: string;
    q2_blurb: string;

    q3_status: string;
    q3_risk: string;
    q3_answer: string;
    q3_blurb: string;

    q4_status: string;
    q4_risk: string;
    q4_answer: string;
    q4_blurb: string;

    q5_status: string;
    q5_risk: string;
    q5_answer: string;
    q5_blurb: string;

    q6_status: string;
    q6_risk: string;
    q6_answer: string;
    q6_blurb: string;

    q7_status: string;
    q7_risk: string;
    q7_answer: string;
    q7_blurb: string;

    q8_status: string;
    q8_risk: string;
    q8_answer: string;
    q8_blurb: string;

    q9_status: string;
    q9_risk: string;
    q9_answer: string;
    q9_blurb: string;

    q10_status: string;
    q10_risk: string;
    q10_answer: string;
    q10_blurb: string;

    q11_status: string;
    q11_risk: string;
    q11_answer: string;
    q11_blurb: string;

    q12_status: string;
    q12_risk: string;
    q12_answer: string;
    q12_blurb: string;

    q13_status: string;
    q13_risk: string;
    q13_answer: string;
    q13_blurb: string;

    // Priority gaps (3 lowest-scoring questions)
    gap_1: string;
    gap_2: string;
    gap_3: string;

    response_date: string;
  };
  metadata: {
    final_score: number;
    band: string;
    question_scores: QuestionScore[];
    processing_date: string;
  };
}

export class ScoringEngine {

  static process(submission: AssessmentSubmission): ScoringResult {
    const questionScores: QuestionScore[] = [];
    let rawScore = 0;

    // Process all 13 questions
    const questionKeys = [
      'q1_board_risk', 'q2_oversight', 'q3_risk_appetite', 'q4_strategic',
      'q5_policy', 'q6_risk_reporting', 'q7_stakeholder', 'q8_incident',
      'q9_vendor', 'q10_development', 'q11_forward', 'q12_competitive',
      'q13_decision'
    ];

    questionKeys.forEach(key => {
      const responseId = (submission as any)[key];
      const questionConfig = SCORING_CONFIG.questions[key];

      if (!questionConfig) {
        console.error(`Question config not found for: ${key}`);
        return;
      }

      const response = questionConfig.responses[responseId];

      if (response) {
        const score = response.score;
        const statusRisk = SCORING_CONFIG.statusRiskMap[score];

        questionScores.push({
          key,
          score,
          status: statusRisk.status,
          risk: statusRisk.risk,
          answer: response.playback,
          blurb: response.interpretation
        });

        rawScore += score;
      } else {
        // Unmapped response - default to 0
        questionScores.push({
          key,
          score: 0,
          status: 'Absent',
          risk: 'Critical',
          answer: 'No answer provided',
          blurb: 'No answer provided — lack of visibility increases risk.'
        });
      }
    });

    // Normalize score to 0-100
    const finalScore = Math.round((rawScore / SCORING_CONFIG.max_raw_score) * 100);

    // Find maturity band
    const band = SCORING_CONFIG.bands.find(b =>
      finalScore >= b.min_score && finalScore <= b.max_score
    ) || SCORING_CONFIG.bands[SCORING_CONFIG.bands.length - 1];

    // Identify priority gaps (3 lowest-scoring questions)
    const sortedByScore = [...questionScores].sort((a, b) => a.score - b.score);
    const priorityGaps = sortedByScore.slice(0, 3);

    // Build report data
    const reportData: any = {
      email: submission.email,
      contact_name: submission.contact_name,
      company_name: submission.company_name,
      governance_score: String(finalScore),
      band_name: band.label,
      band_narrative: band.narrative,
      response_date: new Date().toLocaleDateString('en-NZ')
    };

    // Populate all question data
    questionScores.forEach(q => {
      const prefix = q.key;
      reportData[`${prefix}_status`] = q.status;
      reportData[`${prefix}_risk`] = q.risk;
      reportData[`${prefix}_answer`] = q.answer;
      reportData[`${prefix}_blurb`] = q.blurb;
    });

    // Populate priority gaps with full interpretation text
    priorityGaps.forEach((gap, index) => {
      const questionConfig = SCORING_CONFIG.questions[gap.key];
      const gapText = `${questionConfig.title}: ${gap.blurb}`;
      reportData[`gap_${index + 1}`] = gapText;
    });

    // Fill remaining gaps if less than 3
    for (let i = priorityGaps.length; i < 3; i++) {
      reportData[`gap_${i + 1}`] = "Not applicable — sufficient governance in this area.";
    }

    return {
      templateName: "Board-Governance-Diagnostic.pdf",
      data: reportData,
      metadata: {
        final_score: finalScore,
        band: band.label,
        question_scores: questionScores,
        processing_date: new Date().toISOString()
      }
    };
  }
}
