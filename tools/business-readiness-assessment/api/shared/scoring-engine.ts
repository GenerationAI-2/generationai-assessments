/**
 * Business AI Readiness Assessment - Scoring Engine
 * Different from Shadow AI: Higher score = better readiness
 * 10 questions × 0-5 points = 0-50 raw → converted to 0-100
 */

import { SCORING_CONFIG } from './scoring-config';

export interface AssessmentSubmission {
  email: string;
  contact_name: string;
  company_name: string;
  opt_in_marketing?: boolean;
  q1_ownership: string;
  q2_strategy: string;
  q3_culture: string;
  q4_enablement: string;
  q5_shadow_ai: string;
  q6_governance: string;
  q7_compliance: string;
  q8_resources: string;
  q9_data_protection: string;
  q10_opportunity: string;
}

export interface ScoringResult {
  templateName: string;
  data: {
    // Contact info
    email: string;
    contact_name: string;
    company_name: string;

    // Score and band
    readiness_score: string;  // 0-100
    readiness_band: string;   // Blind/Reactive/Building/Advanced
    readiness_band_narrative: string;

    // New: Tension line and phase
    tension_line: string;
    phase_label: string;

    // Key question playbacks and interpretations (for PDF report)
    q1_answer_playback: string;
    q1_interpretation_blurb: string;
    q1_score: number;

    q5_answer_playback: string;
    q5_interpretation_blurb: string;
    q5_score: number;

    q6_answer_playback: string;
    q6_interpretation_blurb: string;
    q6_score: number;

    q9_answer_playback: string;
    q9_interpretation_blurb: string;
    q9_score: number;

    q10_answer_playback: string;
    q10_interpretation_blurb: string;
    q10_score: number;

    // Top 3 priority gaps
    gap_1_title: string;
    gap_1_description: string;
    gap_1_recommendation: string;
    gap_2_title: string;
    gap_2_description: string;
    gap_2_recommendation: string;
    gap_3_title: string;
    gap_3_description: string;
    gap_3_recommendation: string;
    gap_summary_blurb: string;

    // Next step recommendation
    next_step_cta: string;
    next_step_narrative: string;

    // Date
    response_date: string;
  };
  metadata: {
    raw_score: number;      // 0-50
    final_score: number;    // 0-100
    band: string;
    question_scores: Record<string, number>;
    flags: string[];
    processing_date: string;
  };
}

export class ScoringEngine {

  static process(submission: AssessmentSubmission): ScoringResult {
    const results = {
      rawScore: 0,
      questionScores: {} as Record<string, number>,
      templateData: {} as any,
      flags: [] as string[],
      responseData: {} as any,
      email: submission.email
    };

    this.processAnswers(submission, results);
    return this.finalizeResults(results, submission);
  }

  private static processAnswers(submission: AssessmentSubmission, results: any): void {
    // Contact fields
    results.templateData.email = submission.email || "Not provided";
    results.templateData.contact_name = submission.contact_name || "Not provided";
    results.templateData.company_name = submission.company_name || "Not provided";

    // Process all 10 assessment questions
    const questions = [
      'q1_ownership', 'q2_strategy', 'q3_culture', 'q4_enablement', 'q5_shadow_ai',
      'q6_governance', 'q7_compliance', 'q8_resources', 'q9_data_protection', 'q10_opportunity'
    ];

    questions.forEach(questionKey => {
      const responseId = (submission as any)[questionKey];
      const questionConfig = SCORING_CONFIG.questions[questionKey];

      if (!questionConfig) {
        results.flags.push(`Question config missing: ${questionKey}`);
        return;
      }

      const response = questionConfig.responses[responseId];

      if (response) {
        // Add score
        results.rawScore += response.score;
        results.questionScores[questionKey] = response.score;

        // Store playback and interpretation
        results.responseData[questionKey] = {
          score: response.score,
          label: response.label,
          playback: response.playback,
          interpretation: response.interpretation
        };
      } else {
        // Unmapped response - score 0
        results.flags.push(`Unmapped response: ${questionKey}="${responseId}"`);
        results.questionScores[questionKey] = 0;
        results.responseData[questionKey] = {
          score: 0,
          label: "Unknown",
          playback: "No response provided",
          interpretation: "This question was not answered properly."
        };
      }
    });
  }

  private static finalizeResults(results: any, submission: AssessmentSubmission): ScoringResult {
    // Convert raw score (0-50) to percentage (0-100)
    const finalScore = Math.round((results.rawScore / SCORING_CONFIG.max_raw_score) * 100);

    // Find maturity band
    let band = SCORING_CONFIG.bands.find(b =>
      finalScore >= b.min_score && finalScore <= b.max_score
    );

    if (!band) {
      band = SCORING_CONFIG.bands[0]; // Default to Unmanaged
      results.flags.push(`No band matched for score ${finalScore}, defaulting to ${band.label}`);
    }

    // Identify top 3 gaps (lowest scoring questions)
    const gaps = this.identifyTopGaps(results.questionScores);

    // Determine next step based on readiness level
    const nextStep = finalScore <= 50
      ? SCORING_CONFIG.next_steps.low_readiness
      : SCORING_CONFIG.next_steps.high_readiness;

    // Calculate tension line and phase label based on score with 4 tiers matching maturity bands
    let tensionLine: string;
    if (finalScore <= 25) {
      tensionLine = "You have zero visibility on AI — you're either missing opportunities or exposed to risks you can't see.";
    } else if (finalScore <= 50) {
      tensionLine = "AI is likely happening in the shadows while you have no plan. You can't manage what you can't see.";
    } else if (finalScore <= 75) {
      tensionLine = "You've got awareness, but execution is fragile without a clear roadmap and consistent governance.";
    } else {
      tensionLine = "You've got strong foundations. The question now is execution speed and sustaining momentum.";
    }

    const phaseLabel = finalScore <= 25 ? "Blind" : finalScore <= 50 ? "Reactive" : finalScore <= 75 ? "Building" : "Advanced";

    const td = results.templateData;
    const rd = results.responseData;

    return {
      templateName: "Business-Readiness-Assessment.docx",
      data: {
        email: td.email,
        contact_name: td.contact_name,
        company_name: td.company_name,

        readiness_score: String(finalScore),
        readiness_band: band.label,
        readiness_band_narrative: band.narrative,

        tension_line: tensionLine,
        phase_label: phaseLabel,

        // Key questions for report (Q1, Q5, Q6, Q9, Q10)
        q1_answer_playback: rd.q1_ownership?.playback || "Not answered",
        q1_interpretation_blurb: rd.q1_ownership?.interpretation || "",
        q1_score: rd.q1_ownership?.score || 0,

        q5_answer_playback: rd.q5_shadow_ai?.playback || "Not answered",
        q5_interpretation_blurb: rd.q5_shadow_ai?.interpretation || "",
        q5_score: rd.q5_shadow_ai?.score || 0,

        q6_answer_playback: rd.q6_governance?.playback || "Not answered",
        q6_interpretation_blurb: rd.q6_governance?.interpretation || "",
        q6_score: rd.q6_governance?.score || 0,

        q9_answer_playback: rd.q9_data_protection?.playback || "Not answered",
        q9_interpretation_blurb: rd.q9_data_protection?.interpretation || "",
        q9_score: rd.q9_data_protection?.score || 0,

        q10_answer_playback: rd.q10_opportunity?.playback || "Not answered",
        q10_interpretation_blurb: rd.q10_opportunity?.interpretation || "",
        q10_score: rd.q10_opportunity?.score || 0,

        // Top 3 gaps
        gap_1_title: gaps[0]?.title || "No significant gaps identified",
        gap_1_description: gaps[0]?.description || "",
        gap_1_recommendation: gaps[0]?.recommendation || "",
        gap_2_title: gaps[1]?.title || "Continue current progress",
        gap_2_description: gaps[1]?.description || "",
        gap_2_recommendation: gaps[1]?.recommendation || "",
        gap_3_title: gaps[2]?.title || "Maintain momentum",
        gap_3_description: gaps[2]?.description || "",
        gap_3_recommendation: gaps[2]?.recommendation || "",
        gap_summary_blurb: SCORING_CONFIG.gap_summaries[band.label] || "",

        // Next steps
        next_step_cta: nextStep.cta,
        next_step_narrative: nextStep.narrative,

        response_date: new Date().toLocaleDateString('en-NZ', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      },
      metadata: {
        raw_score: results.rawScore,
        final_score: finalScore,
        band: band.label,
        question_scores: results.questionScores,
        flags: results.flags,
        processing_date: new Date().toISOString()
      }
    };
  }

  private static identifyTopGaps(questionScores: Record<string, number>): Array<{title: string, description: string, recommendation: string}> {
    // Only include questions with imperfect scores (< 5)
    const imperfectScores = Object.entries(questionScores)
      .filter(([, score]) => score < 5)
      .sort(([, a], [, b]) => a - b);

    // Take top 3 lowest scores as priority gaps (or fewer if < 3 imperfect scores)
    const topGaps = imperfectScores.slice(0, 3).map(([questionKey, score]) => {
      const gapInfo = SCORING_CONFIG.gap_descriptions[questionKey];
      return {
        title: gapInfo?.title || `Low score: ${questionKey}`,
        description: gapInfo?.description || "",
        recommendation: gapInfo?.recommendation || "",
        score: score
      };
    });

    return topGaps;
  }
}
