/**
 * Personal AI Readiness Diagnostic - Scoring Engine
 * Processes 12 questions and generates personalized report using tier-based blurbs
 */

import {
  SCORING_CONFIG,
  USAGE_TIER_MAP,
  LEADERSHIP_TIER_MAP,
  LEARNING_TIER_MAP,
  USAGE_INSIGHTS,
  LEADERSHIP_INSIGHTS,
  LEARNING_INSIGHTS,
  CAPABILITY_NARRATIVES
} from './scoring-config';

export interface AssessmentSubmission {
  email: string;
  contact_name: string;
  company_name: string;
  q1_frequency: string;
  q2_approach: string;
  q3_repetitive_task: string;
  q4_explain: string;
  q5_lead: string;
  q6_time_savings: string;
  q7_use_cases: string;       // Qualitative - doesn't contribute to score
  q8_stay_informed: string;
  q9_learning_preference: string;
  q10_motivation: string;
  q11_next_90_days: string;
  q12_safety: string;
}

export interface ScoringResult {
  templateName: string;
  data: {
    email: string;
    contact_name: string;
    company_name: string;
    readiness_score: string;
    band_name: string;
    band_narrative: string;
    capability_narrative: string;

    // Tier insights (personalized blurbs)
    usage_insight: string;
    leadership_insight: string;
    learning_insight: string;

    // Individual question responses for reference
    q1_frequency: string;
    q2_approach: string;
    top_use_case: string; // From Q7
    hours_saved: string;  // From Q6

    // Priority development areas (3 gaps)
    gap_1: string;
    gap_2: string;
    gap_3: string;
    gap_summary: string;

    // Next steps based on band
    next_step_cta: string;
    next_step_narrative: string;

    response_date: string;
  };
  metadata: {
    final_score: number;
    raw_score: number;
    band: string;
    usage_tier: number;
    leadership_tier: number;
    learning_tier: number;
    processing_date: string;
  };
}

export class ScoringEngine {

  static process(submission: AssessmentSubmission): ScoringResult {
    // ===== CALCULATE RAW SCORE =====
    let rawScore = 0;
    const questionKeys = [
      'q1_frequency', 'q2_approach', 'q3_repetitive_task', 'q4_explain',
      'q5_lead', 'q6_time_savings', 'q7_use_cases', 'q8_stay_informed',
      'q9_learning_preference', 'q10_motivation', 'q11_next_90_days', 'q12_safety'
    ];

    const questionScores: { key: string; score: number; label: string }[] = [];

    questionKeys.forEach(key => {
      const responseId = (submission as any)[key];
      const questionConfig = (SCORING_CONFIG.questions as any)[key];

      if (!questionConfig) {
        console.error(`Question config not found for: ${key}`);
        return;
      }

      const response = questionConfig.responses[responseId];

      if (response) {
        questionScores.push({
          key,
          score: response.score,
          label: response.label
        });
        rawScore += response.score;
      } else {
        // Unmapped response - default to 0
        questionScores.push({
          key,
          score: 0,
          label: 'No answer provided'
        });
      }
    });

    // ===== NORMALIZE SCORE TO 0-100 =====
    const finalScore = Math.round((rawScore / SCORING_CONFIG.max_raw_score) * 100);

    // ===== FIND READINESS BAND =====
    const band = SCORING_CONFIG.readiness_bands.find(b =>
      finalScore >= b.min_score && finalScore <= b.max_score
    ) || SCORING_CONFIG.readiness_bands[SCORING_CONFIG.readiness_bands.length - 1];

    // ===== CALCULATE TIER SCORES FOR NARRATIVE PERSONALIZATION =====

    // Usage Tier (Q1 + Q2)
    const q1Response = submission.q1_frequency;
    const q2Response = submission.q2_approach;
    const usageTierKey = `${q1Response}_${q2Response}`;
    const usageTier = USAGE_TIER_MAP[usageTierKey] || 1;

    // Leadership Tier (Q4 + Q5)
    const q4Response = submission.q4_explain;
    const q5Response = submission.q5_lead;
    const leadershipTierKey = `${q4Response}_${q5Response}`;
    const leadershipTier = LEADERSHIP_TIER_MAP[leadershipTierKey] || 1;

    // Learning Tier (Q8 + Q9) - NOTE: Changed from Q9 + Q10 to Q8 + Q9 to match stay_informed
    const q8Response = submission.q8_stay_informed;
    const q9Response = submission.q9_learning_preference;
    const learningTierKey = `${q8Response}_${q9Response}`;
    const learningTier = LEARNING_TIER_MAP[learningTierKey] || 1;

    // ===== GET PERSONALIZED BLURBS =====
    const usageInsight = USAGE_INSIGHTS[usageTier] || USAGE_INSIGHTS[1];
    const leadershipInsight = LEADERSHIP_INSIGHTS[leadershipTier] || LEADERSHIP_INSIGHTS[1];
    const learningInsight = LEARNING_INSIGHTS[learningTier] || LEARNING_INSIGHTS[1];

    // ===== EXTRACT QUALITATIVE DATA =====
    const q7Config = SCORING_CONFIG.questions.q7_use_cases;
    const topUseCase = (q7Config.responses as any)[submission.q7_use_cases]?.label || "Not specified";

    const q6Config = SCORING_CONFIG.questions.q6_time_savings;
    const hoursSaved = (q6Config.responses as any)[submission.q6_time_savings]?.label || "Not specified";

    const q1Config = SCORING_CONFIG.questions.q1_frequency;
    const q1FrequencyLabel = (q1Config.responses as any)[submission.q1_frequency]?.label || "";

    const q2Config = SCORING_CONFIG.questions.q2_approach;
    const q2ApproachLabel = (q2Config.responses as any)[submission.q2_approach]?.label || "";

    // ===== IDENTIFY PRIORITY GAPS (3 lowest-scoring questions, excluding Q7) =====
    const scoredQuestions = questionScores.filter(q => q.key !== 'q7_use_cases');
    const sortedByScore = [...scoredQuestions].sort((a, b) => a.score - b.score);
    const priorityGaps = sortedByScore.slice(0, 3);

    const gap1 = this.formatGap(priorityGaps[0]);
    const gap2 = this.formatGap(priorityGaps[1]);
    const gap3 = this.formatGap(priorityGaps[2]);

    const gapSummary = this.generateGapSummary(priorityGaps, band.label);

    // ===== GENERATE NEXT STEP CTA BASED ON BAND =====
    const { nextStepCta, nextStepNarrative } = this.getNextSteps(band.label, finalScore);

    // ===== BUILD REPORT DATA =====
    const reportData: any = {
      email: submission.email,
      contact_name: submission.contact_name,
      company_name: submission.company_name,
      readiness_score: String(finalScore),
      band_name: band.label,
      band_narrative: band.narrative,
      capability_narrative: CAPABILITY_NARRATIVES[band.label] || "",

      // Tier-based insights
      usage_insight: usageInsight,
      leadership_insight: leadershipInsight,
      learning_insight: learningInsight,

      // Question responses (for reference in report)
      q1_frequency: q1FrequencyLabel,
      q2_approach: q2ApproachLabel,
      top_use_case: topUseCase,
      hours_saved: hoursSaved,

      // Priority gaps
      gap_1: gap1,
      gap_2: gap2,
      gap_3: gap3,
      gap_summary: gapSummary,

      // Next steps
      next_step_cta: nextStepCta,
      next_step_narrative: nextStepNarrative,

      response_date: new Date().toLocaleDateString('en-NZ')
    };

    return {
      templateName: "Personal-AI-Readiness-Diagnostic.pdf",
      data: reportData,
      metadata: {
        final_score: finalScore,
        raw_score: rawScore,
        band: band.label,
        usage_tier: usageTier,
        leadership_tier: leadershipTier,
        learning_tier: learningTier,
        processing_date: new Date().toISOString()
      }
    };
  }

  /**
   * Format a gap into a readable string
   */
  private static formatGap(gap: { key: string; score: number; label: string } | undefined): string {
    if (!gap) {
      return "Not applicable — you're performing well in this area.";
    }

    const questionConfig = (SCORING_CONFIG.questions as any)[gap.key];
    if (!questionConfig) {
      return "Additional development area identified.";
    }

    const areaNames: Record<string, string> = {
      'q1_frequency': 'AI Tool Usage Frequency',
      'q2_approach': 'AI Application Sophistication',
      'q3_repetitive_task': 'AI Opportunity Recognition',
      'q4_explain': 'AI Literacy & Communication',
      'q5_lead': 'Leadership Readiness',
      'q6_time_savings': 'Productivity Awareness',
      'q8_stay_informed': 'Continuous Learning',
      'q9_learning_preference': 'Learning Engagement',
      'q10_motivation': 'Motivation & Priority',
      'q11_next_90_days': 'Near-Term Application',
      'q12_safety': 'AI Governance Awareness'
    };

    const areaName = areaNames[gap.key] || questionConfig.title;

    return `${areaName}: Your current level indicates room for growth. ${gap.score <= 2 ? 'This is a priority development area.' : 'Focus here to accelerate your readiness.'}`;
  }

  /**
   * Generate summary text for the gap section
   */
  private static generateGapSummary(gaps: any[], band: string): string {
    const gapCount = gaps.filter(g => g && g.score <= 2).length;

    if (band === "AI Distant") {
      return "Your priority is building foundational AI capability. Start with one area and build momentum. Small, consistent steps compound quickly.";
    } else if (band === "AI Curious") {
      return "You're exploring AI but haven't built consistent habits. Focus on the areas above to shift from curiosity to capability.";
    } else if (band === "AI Ready") {
      return "You're using AI regularly. The gaps above represent your next frontier, closing them will multiply your impact.";
    } else { // AI Leader
      return "You're operating at a high level. The areas above are opportunities to refine your edge and help others accelerate.";
    }
  }

  /**
   * Get next step CTA and narrative based on readiness band
   */
  private static getNextSteps(band: string, score: number): { nextStepCta: string; nextStepNarrative: string } {
    switch (band) {
      case "AI Distant":
        return {
          nextStepCta: "Book an Executive Briefing or join a Peer Roundtable",
          nextStepNarrative: "You're at the beginning of your AI journey. A structured introduction will help you understand what's possible and where to start. We recommend a 90-minute Executive Briefing or joining a peer roundtable to hear how other leaders are approaching AI."
        };

      case "AI Curious":
        return {
          nextStepCta: "Enrol in our AI Essentials Program",
          nextStepNarrative: "You've started exploring AI but need structure and consistency. Our AI Essentials Program is designed for leaders like you, combining practical techniques, peer learning, and guided application. You'll move from curiosity to confident use in 4-6 weeks."
        };

      case "AI Ready":
        return {
          nextStepCta: "Join our AI Mastery Workshop",
          nextStepNarrative: "You're using AI regularly and ready to scale your impact. Our AI Mastery Workshop helps leaders like you build advanced workflows, lead team adoption, and integrate AI into strategic decision-making. This is where AI becomes a competitive advantage."
        };

      case "AI Leader":
      default:
        return {
          nextStepCta: "Explore our 90-Day AI Roadmap and Team Capability Building",
          nextStepNarrative: "You're ahead of the curve. Your next opportunity is scaling your capability across your team or organisation. We'll work with you to design a 90-day AI roadmap, build internal champions, and embed AI into your operating rhythm."
        };
    }
  }
}
