/**
 * Personal AI Readiness Diagnostic - Scoring Configuration
 * 12 questions, each scored 0-5 (Q7 is qualitative, worth 0 points)
 * Total raw score: 0-55, normalized to 0-100
 */

export interface ResponseConfig {
  score: number;
  label: string;
}

export interface QuestionConfig {
  type: string;
  key: string;
  title: string;
  responses: Record<string, ResponseConfig>;
}

export interface ReadinessBand {
  min_score: number;
  max_score: number;
  label: string;
  narrative: string;
}

export interface CapabilityNarrative {
  band: string;
  narrative: string;
}

// ===== BAND NARRATIVES =====

export const BAND_NARRATIVES: Record<string, string> = {
  "AI Distant": "You're at the starting line of AI adoption. While others are already capturing value, you haven't yet engaged meaningfully with these tools. This puts you at immediate competitive disadvantage, but also means your potential gains are the highest.",

  "AI Curious": "You've begun exploring AI but haven't found your rhythm. You understand the concepts but lack consistent application. This is the critical transition point, with focused effort, you can quickly move from observer to practitioner.",

  "AI Ready": "You're actively using AI and seeing results, but there's significant untapped potential. You have the foundation; now it's time to scale from individual productivity to strategic advantage.",

  "AI Leader": "You're ahead of the curve, using AI strategically and ready to lead others. Your focus now should be on advanced techniques, systematic deployment, and helping your organisation capture similar value."
};

export const CAPABILITY_NARRATIVES: Record<string, string> = {
  "AI Distant": "You haven't yet integrated AI into your workflows and lack confidence in guiding others. While this is a vulnerability, it's also your biggest growth opportunity. Small changes can drive big returns. Right now, you're exposed, and competitors are accelerating past.",

  "AI Curious": "You occasionally experiment with AI but haven't made it part of how you work. You grasp the importance, but lack confidence and consistency. This middle ground is where many stall, you'll either commit to growth or risk falling behind.",

  "AI Ready": "You're using AI regularly for specific tasks and beginning to gain leverage. Your awareness is strong, your habits are forming, and you're ready to shift from experimentation to systemisation. With the right support, you can become an AI leader in your organisation.",

  "AI Leader": "You've embedded AI into your workflows and operate with strategic intent. You're making better decisions, saving meaningful time, and influencing others. Your next opportunity is to scale your capability across your team and organisation."
};

// ===== TIER BLURB LIBRARIES =====

export const USAGE_INSIGHTS: Record<number, string> = {
  1: "You're not yet using AI meaningfully in your work. Whether due to uncertainty, policy, or habit, this leaves value on the table daily. Until AI becomes part of your workflow, you're missing easy wins in both time and quality.",

  2: "You've started dabbling with AI tools, but use remains infrequent and surface-level. That's normal, most leaders begin here. But without deliberate practice, AI won't move from curiosity to capability.",

  3: "You're actively exploring how AI could help, trying tools, testing prompts, but haven't yet built repeatable workflows. This is a critical stage. With structure and focus, you could rapidly move into consistent productivity gains.",

  4: "AI plays a defined role in your weekly rhythm. You use it to streamline content, summarise material, or support decisions. These are strong habits, the next step is to expand into higher-leverage workflows and team enablement.",

  5: "You've built AI into your core operating system, using templates, chaining tools, and saving hours each week. You're not just using AI, you're leveraging it. Your opportunity now is to scale this capability into your team or function."
};

export const LEADERSHIP_INSIGHTS: Record<number, string> = {
  1: "You're still early in your AI leadership journey. You're unsure how to explain it, and hesitant to guide others. That's understandable, but your role is pivotal. Until leadership understands the tools, the team won't follow. This is the moment to lead by learning.",

  2: "You grasp the potential of AI and can explain it reasonably well, but you're not yet stepping into a leadership role. That's a common gap, bridging it means moving from passive knowledge to active influence. Your team's progress will likely follow yours.",

  3: "You're already using AI and beginning to guide others. That puts you ahead of most leaders. Your next step is clarity, clearly framing AI's value for your organisation and giving others permission to engage. This is where cultural shift begins.",

  4: "You're confidently explaining AI's business value and already influencing how others engage with it. That's the hallmark of an AI-ready leader. Your opportunity now is to build internal capability and help your organisation embed this advantage at scale."
};

export const LEARNING_INSIGHTS: Record<number, string> = {
  1: "You're not currently investing time in learning about AI, and you may feel unsure where to begin. That's normal, many leaders are in the same position. But without dedicated focus, it's easy to fall further behind while others accelerate. AI capability compounds. Every week you delay learning, your competitors move further ahead. The good news? Small, structured steps can build momentum fast.",

  2: "You're showing interest in AI and open to learning, but haven't yet found the format, time, or structure that works for you. That's common. Leaders at this stage often feel the gap but don't know how to bridge it. The key is committing to one focused pathway, even a short session can build clarity and confidence. With the right guidance, your curiosity can quickly convert to capability.",

  3: "You're actively developing your understanding of AI and committed to expanding your capability. That positions you well to accelerate. The next step is applying that learning consistently, turning insights into new workflows and habits. You're past the passive stage. Now it's about systems, experimentation, and peer learning. We can help you scale what you've started.",

  4: "You're deeply engaged in AI learning and already applying what you're discovering. This puts you in the top tier of proactive leaders. Your challenge now is twofold: deepening your technical literacy, and helping your team build shared capability. We recommend connecting with other AI-ready leaders and accessing advanced learning formats that stretch and sharpen your edge."
};

// ===== TIER MAPPING TABLES =====

// Q1 + Q2 → Usage Tier (1-5)
interface UsageTierKey {
  q1: string;
  q2: string;
}

export const USAGE_TIER_MAP: Record<string, number> = {
  // Never
  "never_none": 1,
  "never_observing": 1,
  "never_basic": 2,
  "never_experimental": 2,
  "never_productive": 3,
  "never_advanced": 3,

  // Rarely (once or twice a month)
  "rarely_none": 1,
  "rarely_observing": 1,
  "rarely_basic": 2,
  "rarely_experimental": 2,
  "rarely_productive": 3,
  "rarely_advanced": 3,

  // Occasionally (once or twice)
  "occasionally_none": 2,
  "occasionally_observing": 2,
  "occasionally_basic": 2,
  "occasionally_experimental": 3,
  "occasionally_productive": 3,
  "occasionally_advanced": 4,

  // Weekly
  "weekly_none": 2,
  "weekly_observing": 2,
  "weekly_basic": 3,
  "weekly_experimental": 3,
  "weekly_productive": 4,
  "weekly_advanced": 4,

  // Daily
  "daily_none": 2,
  "daily_observing": 2,
  "daily_basic": 3,
  "daily_experimental": 4,
  "daily_productive": 4,
  "daily_advanced": 5,

  // Multiple times daily
  "multiple_none": 2,
  "multiple_observing": 2,
  "multiple_basic": 3,
  "multiple_experimental": 4,
  "multiple_productive": 4,
  "multiple_advanced": 5
};

// Q4 + Q5 → Leadership Tier (1-4)
export const LEADERSHIP_TIER_MAP: Record<string, number> = {
  // Struggle / Refer to someone else
  "struggle_not_ready": 1,
  "struggle_prefer_others": 1,
  "struggle_not_considered": 1,
  "struggle_need_upskilling": 2,
  "struggle_getting_ready": 3,
  "struggle_confident": 3,
  "struggle_already_leading": 3,

  "refer_not_ready": 1,
  "refer_prefer_others": 1,
  "refer_not_considered": 1,
  "refer_need_upskilling": 2,
  "refer_getting_ready": 3,
  "refer_confident": 3,
  "refer_already_leading": 3,

  // Need to look it up
  "lookup_not_ready": 2,
  "lookup_prefer_others": 2,
  "lookup_not_considered": 2,
  "lookup_need_upskilling": 2,
  "lookup_getting_ready": 3,
  "lookup_confident": 3,
  "lookup_already_leading": 3,

  // Simple description (no personal examples)
  "simple_not_ready": 2,
  "simple_prefer_others": 2,
  "simple_not_considered": 2,
  "simple_need_upskilling": 2,
  "simple_getting_ready": 3,
  "simple_confident": 3,
  "simple_already_leading": 3,

  // Can explain with examples
  "explain_not_ready": 2,
  "explain_prefer_others": 2,
  "explain_not_considered": 2,
  "explain_need_upskilling": 3,
  "explain_getting_ready": 3,
  "explain_confident": 3,
  "explain_already_leading": 4,

  // Confident with own examples
  "confident_not_ready": 3,
  "confident_prefer_others": 3,
  "confident_not_considered": 3,
  "confident_need_upskilling": 3,
  "confident_getting_ready": 4,
  "confident_confident": 4,
  "confident_already_leading": 4
};

// Q9 + Q10 → Learning Tier (1-4)
export const LEARNING_TIER_MAP: Record<string, number> = {
  // Not at all
  "not_at_all_not_priority": 1,
  "not_at_all_reading": 1,
  "not_at_all_lunch_learn": 1,
  "not_at_all_self_paced": 2,
  "not_at_all_coaching": 2,
  "not_at_all_workshop": 2,
  "not_at_all_already_motivated": 2,

  // Rarely
  "rarely_not_priority": 1,
  "rarely_reading": 1,
  "rarely_lunch_learn": 1,
  "rarely_self_paced": 2,
  "rarely_coaching": 2,
  "rarely_workshop": 2,
  "rarely_already_motivated": 2,

  // Only when comes up at work
  "passively_not_priority": 1,
  "passively_reading": 1,
  "passively_lunch_learn": 2,
  "passively_self_paced": 2,
  "passively_coaching": 2,
  "passively_workshop": 2,
  "passively_already_motivated": 2,

  // Read articles occasionally
  "occasionally_not_priority": 2,
  "occasionally_reading": 2,
  "occasionally_lunch_learn": 2,
  "occasionally_self_paced": 3,
  "occasionally_coaching": 3,
  "occasionally_workshop": 3,
  "occasionally_already_motivated": 3,

  // Follow newsletters/webinars
  "regularly_not_priority": 2,
  "regularly_reading": 2,
  "regularly_lunch_learn": 3,
  "regularly_self_paced": 3,
  "regularly_coaching": 3,
  "regularly_workshop": 4,
  "regularly_already_motivated": 4,

  // Take courses and apply
  "actively_not_priority": 2,
  "actively_reading": 3,
  "actively_lunch_learn": 3,
  "actively_self_paced": 4,
  "actively_coaching": 4,
  "actively_workshop": 4,
  "actively_already_motivated": 4
};

// ===== QUESTIONS =====

export const SCORING_CONFIG = {
  version: "1.0",
  max_raw_score: 55, // 11 scored questions × 5 points max (Q7 = 0 points)

  readiness_bands: [
    {
      min_score: 0,
      max_score: 25,
      label: "AI Distant",
      narrative: BAND_NARRATIVES["AI Distant"]
    },
    {
      min_score: 26,
      max_score: 50,
      label: "AI Curious",
      narrative: BAND_NARRATIVES["AI Curious"]
    },
    {
      min_score: 51,
      max_score: 75,
      label: "AI Ready",
      narrative: BAND_NARRATIVES["AI Ready"]
    },
    {
      min_score: 76,
      max_score: 100,
      label: "AI Leader",
      narrative: BAND_NARRATIVES["AI Leader"]
    }
  ] as ReadinessBand[],

  questions: {
    q1_frequency: {
      type: "single_choice",
      key: "q1_frequency",
      title: "How often do you currently use AI tools for work tasks?",
      responses: {
        "multiple": {
          score: 5,
          label: "I use AI tools multiple times a day. They're part of how I work."
        },
        "daily": {
          score: 4,
          label: "I use them daily for specific tasks."
        },
        "weekly": {
          score: 3,
          label: "I use them a few times a week when needed."
        },
        "occasionally": {
          score: 2,
          label: "I use them occasionally, maybe once or twice a month."
        },
        "rarely": {
          score: 1,
          label: "I've tried them once or twice but don't use them regularly."
        },
        "never": {
          score: 0,
          label: "I haven't used AI tools for work yet."
        }
      }
    },

    q2_approach: {
      type: "single_choice",
      key: "q2_approach",
      title: "How would you describe your current approach to using AI?",
      responses: {
        "advanced": {
          score: 5,
          label: "I use AI to automate tasks, build prompts, and integrate it into workflows."
        },
        "productive": {
          score: 4,
          label: "I regularly delegate work to AI using templates or repeatable tasks."
        },
        "experimental": {
          score: 3,
          label: "I experiment with tools to see what works."
        },
        "basic": {
          score: 2,
          label: "I mostly use it for simple Q&A or one-off tasks."
        },
        "observing": {
          score: 1,
          label: "I observe others using AI but haven't tried much myself."
        },
        "none": {
          score: 0,
          label: "I haven't engaged with AI tools at all."
        }
      }
    },

    q3_repetitive_task: {
      type: "single_choice",
      key: "q3_repetitive_task",
      title: "Last time you faced a repetitive or time-consuming task, did you think about using AI?",
      responses: {
        "used_ai": {
          score: 5,
          label: "Yes, and I used AI to help complete it faster."
        },
        "thought_unsure": {
          score: 4,
          label: "Yes, but I wasn't sure how to apply it."
        },
        "thought_traditional": {
          score: 3,
          label: "I thought about it, but did it the traditional way."
        },
        "didnt_cross_mind": {
          score: 2,
          label: "No, it didn't cross my mind."
        },
        "not_relevant": {
          score: 1,
          label: "I didn't think AI would be relevant."
        },
        "no_repetitive_tasks": {
          score: 0,
          label: "I don't usually face repetitive tasks."
        }
      }
    },

    q4_explain: {
      type: "single_choice",
      key: "q4_explain",
      title: "If someone asked you to explain how tools like ChatGPT work and how they can be used in business, could you?",
      responses: {
        "confident": {
          score: 5,
          label: "Yes, confidently and with examples from my own use."
        },
        "explain": {
          score: 4,
          label: "Yes, I can explain the concept and give examples."
        },
        "simple": {
          score: 3,
          label: "I can describe it simply but don't have personal examples."
        },
        "lookup": {
          score: 2,
          label: "I'd need to look it up first."
        },
        "struggle": {
          score: 1,
          label: "I'd struggle to explain it clearly."
        },
        "refer": {
          score: 0,
          label: "I'd refer them to someone else."
        }
      }
    },

    q5_lead: {
      type: "single_choice",
      key: "q5_lead",
      title: "How ready do you feel to lead AI adoption in your team or organisation?",
      responses: {
        "already_leading": {
          score: 5,
          label: "I'm already leading AI adoption actively."
        },
        "confident": {
          score: 4,
          label: "I feel confident and just need organisational support."
        },
        "getting_ready": {
          score: 3,
          label: "I'm getting ready but want more personal experience first."
        },
        "need_upskilling": {
          score: 2,
          label: "I'd need significant upskilling before I could lead."
        },
        "prefer_others": {
          score: 1,
          label: "I'd prefer to let others take the lead."
        },
        "not_considered": {
          score: 0,
          label: "This isn't something I've considered part of my role yet."
        }
      }
    },

    q6_time_savings: {
      type: "single_choice",
      key: "q6_time_savings",
      title: "How many hours could AI save you per week if used effectively?",
      responses: {
        "already_saving": {
          score: 5,
          label: "I'm already saving hours each week with AI."
        },
        "5_to_10": {
          score: 4,
          label: "Probably 5–10 hours."
        },
        "3_to_5": {
          score: 3,
          label: "Maybe 3–5 hours."
        },
        "1_to_2": {
          score: 2,
          label: "1–2 hours at most."
        },
        "not_sure": {
          score: 1,
          label: "Hard to say – I'm not sure what's possible yet."
        },
        "doesnt_fit": {
          score: 0,
          label: "I don't think AI fits my work."
        }
      }
    },

    q7_use_cases: {
      type: "single_choice",
      key: "q7_use_cases",
      title: "What kind of AI use cases would save you the most time?",
      responses: {
        "summarising": {
          score: 0, // Qualitative only
          label: "Summarising meetings, emails, or documents"
        },
        "drafting": {
          score: 0,
          label: "Drafting content or comms (presentations, reports)"
        },
        "research": {
          score: 0,
          label: "Research and insights"
        },
        "decision_support": {
          score: 0,
          label: "Decision support and analysis"
        },
        "data_cleanup": {
          score: 0,
          label: "Data clean-up and reporting"
        },
        "not_sure": {
          score: 0,
          label: "I'm not sure what would help most"
        }
      }
    },

    q8_stay_informed: {
      type: "single_choice",
      key: "q8_stay_informed",
      title: "How do you currently stay informed about AI developments relevant to your work?",
      responses: {
        "actively": {
          score: 5,
          label: "I take courses, test tools, and apply what I learn."
        },
        "regularly": {
          score: 4,
          label: "I follow newsletters, attend webinars, or join discussions."
        },
        "occasionally": {
          score: 3,
          label: "I read articles when I come across them."
        },
        "passively": {
          score: 2,
          label: "I only hear about AI when it comes up at work."
        },
        "rarely": {
          score: 1,
          label: "I rarely engage with AI news or trends."
        },
        "not_at_all": {
          score: 0,
          label: "I'm not paying attention to AI developments right now."
        }
      }
    },

    q9_learning_preference: {
      type: "single_choice",
      key: "q9_learning_preference",
      title: "If you were offered learning options to build your AI capability, which would you choose?",
      responses: {
        "workshop": {
          score: 5,
          label: "A half-day hands-on workshop with peers"
        },
        "self_paced": {
          score: 4,
          label: "Short self-paced online learning (1–2 hours/week)"
        },
        "coaching": {
          score: 3,
          label: "One-on-one coaching or mentoring"
        },
        "lunch_learn": {
          score: 2,
          label: "Team-based lunch-and-learn sessions"
        },
        "reading": {
          score: 1,
          label: "Reading guides, articles or case studies"
        },
        "not_ready": {
          score: 0,
          label: "I'm not ready to commit time right now"
        }
      }
    },

    q10_motivation: {
      type: "single_choice",
      key: "q10_motivation",
      title: "What would motivate you to invest more time in building your AI skills?",
      responses: {
        "already_motivated": {
          score: 5,
          label: "I'm already motivated – I just need the right program"
        },
        "team_expects": {
          score: 4,
          label: "My team expects me to set the direction"
        },
        "clear_roi": {
          score: 3,
          label: "Clear ROI for my specific role"
        },
        "competitors": {
          score: 2,
          label: "Seeing competitors or peers getting ahead"
        },
        "leadership_pressure": {
          score: 1,
          label: "Pressure or support from leadership/board"
        },
        "not_priority": {
          score: 0,
          label: "Honestly, it's not a priority for me right now"
        }
      }
    },

    q11_next_90_days: {
      type: "single_choice",
      key: "q11_next_90_days",
      title: "Where could AI help you most over the next 90 days?",
      responses: {
        "already_integrated": {
          score: 5,
          label: "It's already integrated into my plans"
        },
        "know_opportunities": {
          score: 4,
          label: "I know some opportunities, just need time to apply them"
        },
        "few_ideas": {
          score: 3,
          label: "I have a few ideas but haven't started"
        },
        "need_help": {
          score: 2,
          label: "I'd need help identifying where to apply it"
        },
        "not_relevant": {
          score: 1,
          label: "I'm not sure it's relevant to what I'm focused on"
        },
        "not_near_term": {
          score: 0,
          label: "I don't see AI helping in the near term"
        }
      }
    },

    q12_safety: {
      type: "single_choice",
      key: "q12_safety",
      title: "How confident are you that AI is being used safely and appropriately in your organisation?",
      responses: {
        "very_confident": {
          score: 5,
          label: "Very confident – we have clear policies, training, and visibility"
        },
        "mostly_confident": {
          score: 4,
          label: "Mostly confident – some guidance exists and people are mostly aware"
        },
        "somewhat_confident": {
          score: 3,
          label: "Somewhat confident – it's patchy or inconsistent across teams"
        },
        "not_confident": {
          score: 2,
          label: "Not confident – people are using AI, but I don't know how or where"
        },
        "havent_thought": {
          score: 1,
          label: "I haven't thought about it – it's probably happening under the radar"
        },
        "unsure": {
          score: 0,
          label: "I'm unsure – I have no visibility into what's going on"
        }
      }
    }
  }
};
