/**
 * AI Board Governance Diagnostic - Scoring Configuration
 * 13 questions, each scored 0-5 (higher = better governance)
 * Total raw score: 0-65, normalized to 0-100
 */

export interface ResponseConfig {
  score: number;
  label: string;
  playback: string;
  interpretation: string;
}

export interface QuestionConfig {
  type: string;
  key: string;
  title: string;
  responses: Record<string, ResponseConfig>;
}

export interface MaturityBand {
  min_score: number;
  max_score: number;
  label: string;
  narrative: string;
}

export const SCORING_CONFIG = {
  version: "1.0",
  max_raw_score: 65, // 13 questions × 5 points max

  questions: {
    q1_board_risk: {
      type: "single_choice",
      key: "q1_board_risk",
      title: "Board Risk Awareness",
      responses: {
        "opt_5": {
          score: 5,
          label: "Yes, clearly and consistently",
          playback: "You told us your board can clearly and consistently explain the top AI risks specific to your business.",
          interpretation: "Directors demonstrate strong understanding of AI risk, a foundation for credible oversight and accountability."
        },
        "opt_4": {
          score: 4,
          label: "Yes, with some variation",
          playback: "You told us some directors can explain the risks, though consistency varies.",
          interpretation: "Inconsistent awareness leaves blind spots. Regulators and shareholders expect the whole board to demonstrate understanding."
        },
        "opt_3": {
          score: 3,
          label: "Partially",
          playback: "You told us only some directors can explain AI risks.",
          interpretation: "Fragmented awareness weakens the board's ability to govern AI effectively."
        },
        "opt_2": {
          score: 2,
          label: "Vague understanding",
          playback: "You told us the risks discussed are vague or general.",
          interpretation: "Generic awareness won't meet fiduciary duty; boards must identify risks specific to their business."
        },
        "opt_1": {
          score: 1,
          label: "Generic, not specific",
          playback: "You told us the risks identified are generic, not tailored.",
          interpretation: "Box-ticking awareness signals immaturity in governance and oversight."
        },
        "opt_0": {
          score: 0,
          label: "Haven't discussed",
          playback: "You told us the board hasn't discussed AI risks.",
          interpretation: "No discussion means no oversight. This is a critical governance gap."
        }
      }
    },

    q2_oversight: {
      type: "single_choice",
      key: "q2_oversight",
      title: "Oversight & Accountability",
      responses: {
        "opt_5": {
          score: 5,
          label: "Board committee with clear charter",
          playback: "You told us AI governance responsibility sits with a formal board committee.",
          interpretation: "Clear ownership at board level demonstrates maturity and accountability."
        },
        "opt_4": {
          score: 4,
          label: "Assigned executive with reporting",
          playback: "You told us an executive reports regularly on AI governance.",
          interpretation: "Accountability is defined, but responsibility rests outside the board. This is good practice but needs formal oversight."
        },
        "opt_3": {
          score: 3,
          label: "Senior leader assigned, limited visibility",
          playback: "You told us a senior leader manages AI governance with limited board visibility.",
          interpretation: "Oversight is present but indirect, leaving gaps in accountability."
        },
        "opt_2": {
          score: 2,
          label: "Responsibility unclear",
          playback: "You told us AI governance responsibility is unclear and only occasionally discussed.",
          interpretation: "Lack of clarity fragments accountability, directors remain liable regardless."
        },
        "opt_1": {
          score: 1,
          label: "No one formally responsible",
          playback: "You told us no one is formally responsible for AI governance.",
          interpretation: "Without ownership, oversight cannot be demonstrated. This is a governance failure."
        },
        "opt_0": {
          score: 0,
          label: "Never been discussed",
          playback: "You told us AI governance has never been discussed.",
          interpretation: "Absence of discussion signals unmanaged risk and exposes directors to liability."
        }
      }
    },

    q3_risk_appetite: {
      type: "single_choice",
      key: "q3_risk_appetite",
      title: "Risk Appetite",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear appetite statement",
          playback: "You told us your board has a clear, documented statement setting boundaries for AI use.",
          interpretation: "Setting explicit boundaries demonstrates proactive governance."
        },
        "opt_4": {
          score: 4,
          label: "Formal boundaries in development",
          playback: "You told us boundaries for AI use are being developed.",
          interpretation: "Work is underway, but boards are accountable even before formal approval."
        },
        "opt_3": {
          score: 3,
          label: "Informal boundaries agreed",
          playback: "You told us some informal principles have been agreed.",
          interpretation: "Informal approaches are fragile and don't stand up to scrutiny."
        },
        "opt_2": {
          score: 2,
          label: "Initial discussions only",
          playback: "You told us AI risk appetite has been discussed but not defined.",
          interpretation: "Without boundaries, management decisions may exceed the board's risk tolerance."
        },
        "opt_1": {
          score: 1,
          label: "Not yet discussed",
          playback: "You told us the board hasn't yet discussed AI risk appetite.",
          interpretation: "Silence on risk appetite leaves AI usage unmanaged and exposes directors."
        },
        "opt_0": {
          score: 0,
          label: "Don't know",
          playback: "You told us you don't know if an AI risk appetite exists.",
          interpretation: "Ignorance itself is a red flag, liability cannot be outsourced."
        }
      }
    },

    q4_strategic: {
      type: "single_choice",
      key: "q4_strategic",
      title: "Strategic Integration",
      responses: {
        "opt_5": {
          score: 5,
          label: "Embedded in business strategy",
          playback: "You told us AI is embedded in your organisation's business strategy.",
          interpretation: "Treating AI as strategic demonstrates maturity and foresight."
        },
        "opt_4": {
          score: 4,
          label: "Regular strategic discussions",
          playback: "You told us AI is regularly discussed at board level in strategy reviews.",
          interpretation: "Good practice, but needs to be consistently documented and acted upon."
        },
        "opt_3": {
          score: 3,
          label: "Emerging topic",
          playback: "You told us AI is emerging in strategy discussions.",
          interpretation: "Early progress, but competitive disadvantage looms without deeper integration."
        },
        "opt_2": {
          score: 2,
          label: "Treated as IT/operational",
          playback: "You told us AI is treated only as an operational/IT matter.",
          interpretation: "Oversight is too narrow, AI's impact on competitiveness is being missed."
        },
        "opt_1": {
          score: 1,
          label: "Behind competitors",
          playback: "You told us your board knows it's behind competitors on AI.",
          interpretation: "Acknowledging lag is better than denial, but urgent catch-up is required."
        },
        "opt_0": {
          score: 0,
          label: "Not considered",
          playback: "You told us AI has not been considered in strategy.",
          interpretation: "Absence of AI strategy is a direct threat to competitiveness and fiduciary responsibility."
        }
      }
    },

    q5_policy: {
      type: "single_choice",
      key: "q5_policy",
      title: "Policy & Controls",
      responses: {
        "opt_5": {
          score: 5,
          label: "Comprehensive policies, reviewed regularly",
          playback: "You told us your board oversees comprehensive AI policies, reviewed regularly.",
          interpretation: "Formalised oversight reduces risk and signals maturity."
        },
        "opt_4": {
          score: 4,
          label: "Formal policies, periodic review",
          playback: "You told us formal policies exist with periodic review.",
          interpretation: "Good foundation, but boards must ensure reviews keep pace with rapid AI change."
        },
        "opt_3": {
          score: 3,
          label: "Basic/draft policy",
          playback: "You told us only a basic or draft AI policy exists.",
          interpretation: "Draft policies leave governance exposure if not implemented."
        },
        "opt_2": {
          score: 2,
          label: "Informal guidelines",
          playback: "You told us AI governance relies on verbal guidelines.",
          interpretation: "Informality signals weak governance, policies must be documented."
        },
        "opt_1": {
          score: 1,
          label: "Under development",
          playback: "You told us AI policies are still under development.",
          interpretation: "Delay in policy finalisation exposes boards if incidents occur."
        },
        "opt_0": {
          score: 0,
          label: "No policy",
          playback: "You told us no AI policies or controls exist.",
          interpretation: "No framework means unmanaged exposure and clear liability."
        }
      }
    },

    q6_risk_reporting: {
      type: "single_choice",
      key: "q6_risk_reporting",
      title: "Risk Oversight",
      responses: {
        "opt_5": {
          score: 5,
          label: "Reported at least quarterly",
          playback: "You told us AI-related risks are tracked and reported quarterly or more.",
          interpretation: "Regular reporting provides the board with visibility to govern effectively."
        },
        "opt_4": {
          score: 4,
          label: "Regular but less frequent",
          playback: "You told us AI risks are reported regularly, but less than quarterly.",
          interpretation: "Oversight exists, but timeliness may lag behind the pace of AI change."
        },
        "opt_3": {
          score: 3,
          label: "Raised occasionally",
          playback: "You told us AI risks are raised occasionally in discussions.",
          interpretation: "Irregular reporting weakens the board's ability to govern proactively."
        },
        "opt_2": {
          score: 2,
          label: "Only when issues occur",
          playback: "You told us AI risks are only raised when incidents occur.",
          interpretation: "Reactive oversight fails to demonstrate reasonable governance."
        },
        "opt_1": {
          score: 1,
          label: "Should be reported but isn't",
          playback: "You told us AI risks should be reported but aren't.",
          interpretation: "Governance structures exist on paper but fail in practice."
        },
        "opt_0": {
          score: 0,
          label: "Never discussed",
          playback: "You told us AI risks are never reported to the board.",
          interpretation: "No reporting means no oversight. Directors are fully exposed."
        }
      }
    },

    q7_stakeholder: {
      type: "single_choice",
      key: "q7_stakeholder",
      title: "Stakeholder Accountability",
      responses: {
        "opt_5": {
          score: 5,
          label: "Very confident",
          playback: "You told us your board would be very confident explaining AI governance to regulators, customers, or shareholders.",
          interpretation: "Clear frameworks and evidence strengthen trust and protect director credibility."
        },
        "opt_4": {
          score: 4,
          label: "Confident",
          playback: "You told us your board is confident, with good documentation.",
          interpretation: "Strong position, but credibility depends on consistent evidence."
        },
        "opt_3": {
          score: 3,
          label: "Somewhat confident",
          playback: "You told us your board would provide partial answers only.",
          interpretation: "Partial confidence is risky, stakeholders expect full accountability."
        },
        "opt_2": {
          score: 2,
          label: "Limited confidence",
          playback: "You told us your board would struggle to answer fully.",
          interpretation: "Weak responses undermine stakeholder trust and invite scrutiny."
        },
        "opt_1": {
          score: 1,
          label: "Not confident",
          playback: "You told us your board could not answer adequately.",
          interpretation: "Inability to respond is a serious governance exposure."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered",
          playback: "You told us your board hasn't considered this scenario.",
          interpretation: "Ignoring accountability questions leaves directors highly vulnerable."
        }
      }
    },

    q8_incident: {
      type: "single_choice",
      key: "q8_incident",
      title: "Incident Preparedness",
      responses: {
        "opt_5": {
          score: 5,
          label: "Comprehensive documentation",
          playback: "You told us your board has comprehensive documentation of AI oversight.",
          interpretation: "Strong preparedness demonstrates fiduciary responsibility if challenged."
        },
        "opt_4": {
          score: 4,
          label: "Good oversight records",
          playback: "You told us your board maintains good but not complete oversight records.",
          interpretation: "Adequate evidence exists, but gaps may weaken the board's defence."
        },
        "opt_3": {
          score: 3,
          label: "Partial documentation",
          playback: "You told us your board has partial documentation.",
          interpretation: "Incomplete records create uncertainty in demonstrating oversight."
        },
        "opt_2": {
          score: 2,
          label: "Limited records",
          playback: "You told us your board has limited documentation of AI oversight.",
          interpretation: "Weak record-keeping undermines the board's ability to prove accountability."
        },
        "opt_1": {
          score: 1,
          label: "No evidence",
          playback: "You told us your board has no evidence of AI oversight.",
          interpretation: "Absence of documentation equates to absence of governance."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered",
          playback: "You told us your board hasn't considered AI-related incident oversight.",
          interpretation: "Failing to consider incidents signals high liability exposure."
        }
      }
    },

    q9_vendor: {
      type: "single_choice",
      key: "q9_vendor",
      title: "Third-Party/Vendor AI Risk",
      responses: {
        "opt_5": {
          score: 5,
          label: "Full visibility and assessment",
          playback: "You told us your board has full visibility of third-party AI use, with risk assessments.",
          interpretation: "Mature oversight ensures external risk is actively managed."
        },
        "opt_4": {
          score: 4,
          label: "Good visibility of major vendors",
          playback: "You told us your board has visibility of AI use by major vendors.",
          interpretation: "Oversight is good but gaps may remain with smaller vendors."
        },
        "opt_3": {
          score: 3,
          label: "Partial awareness",
          playback: "You told us your board has partial awareness of third-party AI use.",
          interpretation: "Incomplete visibility weakens vendor risk management."
        },
        "opt_2": {
          score: 2,
          label: "Limited visibility",
          playback: "You told us your board has limited visibility of vendor AI use.",
          interpretation: "Weak oversight exposes your organisation to third-party risk."
        },
        "opt_1": {
          score: 1,
          label: "Not tracked",
          playback: "You told us your board doesn't track third-party AI use.",
          interpretation: "Ignorance of vendor practices is a major governance blind spot."
        },
        "opt_0": {
          score: 0,
          label: "Don't know",
          playback: "You told us your board doesn't know if vendors use AI.",
          interpretation: "Lack of knowledge signals unmanaged exposure."
        }
      }
    },

    q10_development: {
      type: "single_choice",
      key: "q10_development",
      title: "Board Development & Investment",
      responses: {
        "opt_5": {
          score: 5,
          label: "Formal training with budget",
          playback: "You told us your board has formal AI governance training with allocated budget.",
          interpretation: "Investing in board capability demonstrates governance maturity."
        },
        "opt_4": {
          score: 4,
          label: "Regular education sessions",
          playback: "You told us your board runs regular education sessions on AI governance.",
          interpretation: "Ongoing education strengthens oversight and decision-making."
        },
        "opt_3": {
          score: 3,
          label: "Informal learning opportunities",
          playback: "You told us your board engages in informal learning.",
          interpretation: "Informal learning is helpful but insufficient for fiduciary duty."
        },
        "opt_2": {
          score: 2,
          label: "Occasional management updates",
          playback: "You told us your board relies on occasional management updates.",
          interpretation: "Reactive education leaves boards underprepared."
        },
        "opt_1": {
          score: 1,
          label: "Reactive only",
          playback: "You told us your board only learns about AI when issues arise.",
          interpretation: "This creates lagging governance responses."
        },
        "opt_0": {
          score: 0,
          label: "No deliberate effort",
          playback: "You told us your board has made no effort to build AI governance capability.",
          interpretation: "No investment signals immaturity and liability risk."
        }
      }
    },

    q11_forward: {
      type: "single_choice",
      key: "q11_forward",
      title: "Forward-Looking Governance",
      responses: {
        "opt_5": {
          score: 5,
          label: "Regular scenario planning",
          playback: "You told us your board engages in regular scenario planning or horizon scanning.",
          interpretation: "Forward-looking oversight strengthens resilience and competitiveness."
        },
        "opt_4": {
          score: 4,
          label: "Periodic strategic reviews",
          playback: "You told us AI futures are included in periodic strategy reviews.",
          interpretation: "Good practice, but may lack sufficient depth or frequency."
        },
        "opt_3": {
          score: 3,
          label: "Sometimes discussed informally",
          playback: "You told us AI futures are discussed informally.",
          interpretation: "Informal discussions won't meet governance standards."
        },
        "opt_2": {
          score: 2,
          label: "Rarely mentioned",
          playback: "You told us AI futures are rarely mentioned.",
          interpretation: "Rare discussions show the board is not scanning for emerging risks."
        },
        "opt_1": {
          score: 1,
          label: "No discussions",
          playback: "You told us AI futures are not discussed at board level.",
          interpretation: "Ignoring future AI impacts weakens strategic oversight."
        },
        "opt_0": {
          score: 0,
          label: "Not considered necessary",
          playback: "You told us the board doesn't consider AI futures necessary.",
          interpretation: "Dismissing AI futures signals complacency and poor governance."
        }
      }
    },

    q12_competitive: {
      type: "single_choice",
      key: "q12_competitive",
      title: "Competitive Risk Awareness",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully assessed with mitigation",
          playback: "You told us your board has fully assessed AI competitive disruption, with mitigation strategies.",
          interpretation: "Proactive assessment positions the organisation to stay competitive."
        },
        "opt_4": {
          score: 4,
          label: "Risk understood and monitored",
          playback: "You told us your board understands competitive risk and monitors it.",
          interpretation: "Solid practice, but ongoing vigilance is required."
        },
        "opt_3": {
          score: 3,
          label: "General awareness",
          playback: "You told us your board has general awareness of AI competitive threats.",
          interpretation: "General awareness may not be enough to inform strategy."
        },
        "opt_2": {
          score: 2,
          label: "Limited understanding",
          playback: "You told us your board has limited understanding of AI competitive risk.",
          interpretation: "Weak awareness leaves the organisation exposed to disruption."
        },
        "opt_1": {
          score: 1,
          label: "Vulnerable, no assessment",
          playback: "You told us your board knows it's vulnerable but hasn't assessed risk.",
          interpretation: "Acknowledging vulnerability without action is a liability."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered",
          playback: "You told us your board hasn't considered AI competitive risk.",
          interpretation: "Ignorance of competitive risk is a governance failure."
        }
      }
    },

    q13_decision: {
      type: "single_choice",
      key: "q13_decision",
      title: "Board Decision Evidence",
      responses: {
        "opt_5": {
          score: 5,
          label: "Within last 3 months",
          playback: "You told us your board has rejected, modified, or set conditions on an AI initiative in the last 3 months.",
          interpretation: "Active challenge and documentation demonstrates strong governance."
        },
        "opt_4": {
          score: 4,
          label: "Within last 6 months",
          playback: "You told us your board last exercised oversight within the last 6 months.",
          interpretation: "Regular evidence of governance is good practice."
        },
        "opt_3": {
          score: 3,
          label: "Within last year",
          playback: "You told us your board last exercised oversight within the last year.",
          interpretation: "Oversight exists but may not meet expectations for regular governance."
        },
        "opt_2": {
          score: 2,
          label: "Over a year ago",
          playback: "You told us your board hasn't exercised oversight in more than a year.",
          interpretation: "Long gaps weaken the evidence base for governance."
        },
        "opt_1": {
          score: 1,
          label: "Never, all approved",
          playback: "You told us your board has never modified an AI initiative — all were approved.",
          interpretation: "Rubber-stamping suggests weak challenge and oversight."
        },
        "opt_0": {
          score: 0,
          label: "Never, no initiatives",
          playback: "You told us your board has never been presented with an AI initiative.",
          interpretation: "Absence of decisions means no evidence of governance."
        }
      }
    }
  } as Record<string, QuestionConfig>,

  bands: [
    {
      min_score: 76,
      max_score: 100,
      label: "Mature Governance",
      narrative: "Your board demonstrates strong AI oversight with clear accountability, documented policies, and regular scenario planning. You're well placed to meet regulatory expectations and maintain stakeholder trust. The focus now is on staying vigilant as AI evolves, refreshing training, and ensuring governance frameworks remain agile."
    },
    {
      min_score: 51,
      max_score: 75,
      label: "Developing Governance",
      narrative: "Your board has taken meaningful steps toward AI governance, with policies and oversight emerging, but gaps remain. While directors are building capability, evidence of oversight is inconsistent. To move forward, formalise reporting, strengthen decision records, and prepare for regulatory scrutiny. Momentum exists — now deepen the foundations."
    },
    {
      min_score: 26,
      max_score: 50,
      label: "Emerging Governance",
      narrative: "Your board has some awareness of AI risks but governance is fragmented and mostly informal. Risk appetite is unclear, oversight is sporadic, and vendor exposure isn't fully tracked. Directors are vulnerable if challenged on their fiduciary duties. Urgent work is needed to build basic policies, accountability, and training."
    },
    {
      min_score: 0,
      max_score: 25,
      label: "Weak Governance",
      narrative: "Your board has little or no AI governance in place. Directors face personal liability if an AI-related incident occurs, as there is no evidence of oversight or boundaries. This is a critical risk position. Immediate action is required to establish ownership, policy frameworks, and board-level visibility."
    }
  ] as MaturityBand[],

  // Status and risk level mapping based on score
  statusRiskMap: {
    5: { status: "Strong", risk: "Low" },
    4: { status: "Good", risk: "Low" },
    3: { status: "Developing", risk: "Medium" },
    2: { status: "Weak", risk: "Medium" },
    1: { status: "Poor", risk: "High" },
    0: { status: "Absent", risk: "Critical" }
  } as Record<number, { status: string; risk: string }>
};
