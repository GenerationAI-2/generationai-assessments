/**
 * Business AI Readiness Assessment - Scoring Configuration
 * 10 questions with 6-point scale (0-5)
 * Higher scores = better readiness (opposite of Shadow AI)
 */

export interface ResponseConfig {
  score: number;
  label: string;
  playback: string;
  interpretation: string;
}

export interface QuestionConfig {
  type: string;
  responses: Record<string, ResponseConfig>;
}

export interface MaturityBand {
  min_score: number;
  max_score: number;
  label: string;
  narrative: string;
}

export interface GapDescription {
  title: string;
  description: string;
  recommendation: string;
}

export const SCORING_CONFIG = {
  version: "1.0",

  // 10 questions, each scored 0-5, total out of 50, converted to 0-100
  max_raw_score: 50,

  questions: {
    q1_ownership: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear ownership at executive level with visible leadership",
          playback: "You told us AI ownership sits clearly at executive level and is actively driving decisions.",
          interpretation: "This is best-practice leadership. Ownership is visible, strategic, and aligned to business outcomes. AI is treated as a capability, not a tech project. You're positioned to scale safely and confidently."
        },
        "opt_4": {
          score: 4,
          label: "Assigned to senior leader in IT or Operations",
          playback: "You said a senior leader owns AI, but it's not widely visible across the organisation.",
          interpretation: "You have an owner, but they're not empowered. Without budget, mandate, or visible CEO backing, ownership becomes a side project. The role needs real authority. Otherwise this is leadership theatre, not leadership action."
        },
        "opt_3": {
          score: 3,
          label: "Shared interest across leaders but no single owner",
          playback: "You told us AI has shared interest across leaders but no single person owns it.",
          interpretation: "Shared interest without ownership means endless discussion but no decisions. Everyone agrees AI matters, but nobody drives it forward. Without a single accountable owner, AI remains trapped in committee. Assign one leader with clear authority, budget, and mandate."
        },
        "opt_2": {
          score: 2,
          label: "Discussed occasionally, but not assigned",
          playback: "You said AI has been discussed by leadership, but no one owns it yet.",
          interpretation: "Leadership is aware, but paralysed. Everyone agrees someone should own it, but nobody wants the responsibility. Meanwhile, Shadow AI spreads and competitors advance. This indecision costs more than any wrong decision would."
        },
        "opt_1": {
          score: 1,
          label: "No clear ownership or intent to assign",
          playback: "You told us no one owns AI, and there's no plan to change that.",
          interpretation: "This is passive exposure. AI will still be adopted, just without guidance. Every week without ownership means deeper fragmentation. Assign an owner within days, not months."
        },
        "opt_0": {
          score: 0,
          label: "Not discussed or considered at all",
          playback: "You said you don't know whether AI ownership exists or has even been discussed.",
          interpretation: "AI is happening without any leadership oversight. No one is watching the risks, shaping the opportunities, or guiding adoption. This is an organisational blindspot, and a strategic liability."
        }
      }
    },

    q2_strategy: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Embedded in strategic plans and actively reviewed",
          playback: "You told us AI is embedded in your strategic plans and actively reviewed at leadership level.",
          interpretation: "AI is treated as a strategic capability, not a side project. This integration means AI investments align with business outcomes, not technology experiments. You're positioned to capture value systematically rather than opportunistically."
        },
        "opt_4": {
          score: 4,
          label: "Regularly discussed at board or exec level",
          playback: "You said AI is regularly discussed at board or executive level meetings.",
          interpretation: "Leadership engagement is strong, but discussion without documentation risks drift. Until AI moves from agenda item to strategic plan, execution remains informal. Document the strategy to convert conversation into coordinated action."
        },
        "opt_3": {
          score: 3,
          label: "Included in planning documents but not acted on",
          playback: "You told us AI appears in planning documents but hasn't translated to action.",
          interpretation: "This is strategic theatre, AI is mentioned to appear current, but without execution it's just words on paper. The gap between documentation and action is where competitive advantage is lost. Move from planning to pilots immediately."
        },
        "opt_2": {
          score: 2,
          label: "Mentioned informally by leaders or managers",
          playback: "You said AI is mentioned informally by leaders but isn't part of formal planning.",
          interpretation: "AI is a talking point, not a strategic priority. Informal mentions create confusion, staff don't know if it's encouraged or just discussed. Without formal inclusion in strategy, AI adoption will remain scattered and ineffective."
        },
        "opt_1": {
          score: 1,
          label: "Not included in any planning activities",
          playback: "You told us AI isn't included in any business planning activities.",
          interpretation: "Your strategy is silent on the biggest business transformation of our time. While you plan without AI, competitors are planning with it. This absence isn't neutral, it's an active decision to fall behind."
        },
        "opt_0": {
          score: 0,
          label: "Not discussed or considered",
          playback: "You said AI hasn't been discussed or considered at strategic level.",
          interpretation: "AI is completely off your radar while reshaping every industry. This isn't just oversight, it's strategic blindness. Begin with a leadership briefing on what AI means for your sector, otherwise you're planning for yesterday's market."
        }
      }
    },

    q3_culture: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Staff are encouraged, supported and confident using AI tools",
          playback: "You told us staff are actively encouraged, supported, and confident in using AI tools.",
          interpretation: "You've created psychological safety around AI experimentation. This cultural foundation is harder to build than any technical capability. Staff feel empowered to explore, fail, and improve. This is where sustainable transformation happens."
        },
        "opt_4": {
          score: 4,
          label: "Most staff are positive, with champions emerging",
          playback: "You said most staff are positive about AI, with champions starting to emerge across teams.",
          interpretation: "Momentum is building organically. Champions are your multiplier effect, they'll influence peers more effectively than any top-down mandate. Support these early adopters visibly to accelerate cultural shift across the organisation."
        },
        "opt_3": {
          score: 3,
          label: "Mixed responses, with some resistance or uncertainty",
          playback: "You told us there are mixed responses, with pockets of resistance and uncertainty.",
          interpretation: "This is typical and manageable. The split usually follows generational or role lines. Resistance often masks fear, fear of replacement, irrelevance, or failure. Address the fear directly with clear messaging about augmentation, not automation."
        },
        "opt_2": {
          score: 2,
          label: "Limited engagement or experimentation by staff",
          playback: "You said there's limited engagement, with little visible experimentation happening.",
          interpretation: "Staff are watching and waiting. This passive stance usually means either no permission, no tools, or no confidence. Without cultural momentum, even good tools and policies will fail. Start with visible, low-risk use cases that make daily work easier."
        },
        "opt_1": {
          score: 1,
          label: "Clear hesitation or pushback from staff",
          playback: "You told us there's clear hesitation or active pushback from staff regarding AI.",
          interpretation: "You're facing cultural headwinds. Pushback signals deeper issues, lack of trust, fear of job losses, or past failed initiatives. This resistance will sabotage any AI initiative unless addressed. Start with listening sessions, not technology rollouts."
        },
        "opt_0": {
          score: 0,
          label: "No visible engagement or signals at all",
          playback: "You said there's no visible engagement or cultural signals around AI adoption.",
          interpretation: "AI isn't even part of the conversation. This silence is concerning, it suggests either complete disconnection from market reality or active suppression of innovation. Before introducing tools, you need to reintroduce curiosity and possibility."
        }
      }
    },

    q4_enablement: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Role-specific training and structured enablement delivered",
          playback: "You told us staff have received role-specific training with structured enablement for their AI use.",
          interpretation: "You're building capability systematically. Role-specific training means staff learn what's relevant, not generic. This targeted approach accelerates adoption and reduces risk. The investment in structured enablement will compound as staff become multipliers of capability."
        },
        "opt_4": {
          score: 4,
          label: "Formal sessions or resources provided to most teams",
          playback: "You said formal training sessions or resources have been provided to most teams.",
          interpretation: "You've made a solid start, but coverage gaps remain. \"Most teams\" means some teams are operating without guidance, often those who need it most. Complete the rollout before unguided teams create risks or fall behind."
        },
        "opt_3": {
          score: 3,
          label: "Basic guidance shared across the business",
          playback: "You told us basic guidance has been shared with staff across the organisation.",
          interpretation: "You've communicated the minimum, but basics won't build capability. Staff know the rules but not the potential. Without deeper enablement, AI use remains superficial, copying text rather than transforming workflows. Investment in proper training pays back quickly."
        },
        "opt_2": {
          score: 2,
          label: "Informal tips or peer support only",
          playback: "You said staff rely on informal tips or peer-to-peer support for AI guidance.",
          interpretation: "This creates dangerous inconsistency. One person's \"best practice\" becomes another's risk exposure. Peer learning has value, but without formal structure, myths spread faster than facts. Establish official guidance before bad habits become embedded."
        },
        "opt_1": {
          score: 1,
          label: "Told not to use AI, without alternatives",
          playback: "You told us staff have been instructed not to use AI, with no alternatives provided.",
          interpretation: "Prohibition without provision drives behaviour underground. Staff who need productivity tools will find them anyway, just without your knowledge or control. This approach guarantees Shadow AI. Provide safe alternatives or accept hidden risk."
        },
        "opt_0": {
          score: 0,
          label: "No guidance, training or enablement at all",
          playback: "You said no guidance or training has been provided to staff about AI use.",
          interpretation: "Staff are improvising in a vacuum. Without any enablement, they're learning from YouTube and ChatGPT itself. This isn't just capability gap, it's active risk creation. Every untrained user is a potential incident. Start with one-page guidance and team walkthroughs, simple beats nothing."
        }
      }
    },

    q5_shadow_ai: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "No unauthorised use, strong controls in place",
          playback: "You told us your staff are not using unapproved AI tools, and you have controls in place to ensure that.",
          interpretation: "You've established clear expectations, approved tools, and strong oversight. Shadow AI isn't just low, it's actively prevented. This reflects mature policy, communication, and trust."
        },
        "opt_4": {
          score: 4,
          label: "Minimal use in isolated cases only",
          playback: "You said unauthorised AI use is rare and limited to isolated cases.",
          interpretation: "You've achieved reasonable control, but vigilance is needed. Those \"isolated cases\" often multiply without active monitoring. Formalise your controls before exceptions become patterns."
        },
        "opt_3": {
          score: 3,
          label: "Some teams using personal accounts",
          playback: "You told us some teams are using personal AI tools or free accounts to get their work done.",
          interpretation: "This is where most organisations sit, and where risk accumulates fast. Company data is entering personal tools with no audit trail. Without intervention, this spreads from \"some teams\" to \"most teams\" within months."
        },
        "opt_2": {
          score: 2,
          label: "Widespread informal use across teams",
          playback: "You said there's widespread informal use of AI tools through free or personal accounts.",
          interpretation: "Shadow AI is active across your business. This likely includes client data in ChatGPT, IP in Claude, and no system-level tracking. You're one screenshot or accidental disclosure away from crisis."
        },
        "opt_1": {
          score: 1,
          label: "Extensive Shadow AI, no controls in place",
          playback: "You told us staff are actively using AI tools, but you have no formal tracking, tooling, or policy.",
          interpretation: "This is crisis-level exposure. Shadow AI is shaping work at scale, and leadership has no visibility. Act within days, not weeks, to assess risk and reassert control."
        },
        "opt_0": {
          score: 0,
          label: "Don't know what's being used",
          playback: "You said you don't know whether staff are using AI tools, or to what extent.",
          interpretation: "You can't protect what you can't see. Shadow AI is definitely active, and data is likely exposed. Start with a discovery exercise to understand your true exposure before incidents occur."
        }
      }
    },

    q6_governance: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear AI policy and guardrails in place",
          playback: "You told us you have clear governance in place, with AI policies, approved tools, and team guidance already active.",
          interpretation: "You've built mature, enabling governance. Policies are clear, tools are approved, and staff have confidence to explore safely. This protects trust, reduces exposure, and positions you to scale capability."
        },
        "opt_4": {
          score: 4,
          label: "Working draft shared and being refined",
          playback: "You said governance is in place, but still informal or in draft form.",
          interpretation: "You're building the plane while flying it. Draft policies are better than nothing, but staff are making their own calls in the meantime. One team might paste client data into free tools, while another refuses to use AI at all. Finish what you've started, consistency requires completion."
        },
        "opt_3": {
          score: 3,
          label: "Basic rules or principles communicated",
          playback: "You told us basic rules or principles have been communicated to staff.",
          interpretation: "Basic guidance is a start, but without formal policy, interpretation varies widely. Some staff think AI is banned, others think it's encouraged, most aren't sure. This confusion guarantees inconsistent behaviour and hidden risk. Document formal guardrails immediately, even a one-page policy beats informal guidance."
        },
        "opt_2": {
          score: 2,
          label: "Informal expectations only",
          playback: "You said there are informal expectations but no formal governance in place.",
          interpretation: "This is the worst position: permission without protection. Teams assume it's safe to use AI but have no guidance on what's acceptable. Informal expectations shift between teams and managers. You're one client complaint away from discovering what's been shared, and by whom. Start by defining what's in bounds."
        },
        "opt_1": {
          score: 1,
          label: "Told not to use AI, no guidance or support",
          playback: "You told us staff have been told not to use AI, with no guidance or approved alternatives.",
          interpretation: "Prohibition without provision drives behaviour underground. Staff who need productivity tools will find them anyway, just without your knowledge or control. This approach guarantees Shadow AI. The first incident will be your wake up call. Provide safe alternatives or accept hidden risk."
        },
        "opt_0": {
          score: 0,
          label: "No guardrails or discussion at all",
          playback: "You said there's been no discussion of AI governance or guardrails at all.",
          interpretation: "AI governance isn't on the radar. Without visibility, policy, or ownership, you have no ability to detect, contain, or respond to incidents. The first incident (an AI hallucination in a client report, sensitive data exposure, or compliance inquiry) will force this conversation. Begin with discovery and leadership alignment."
        }
      }
    },

    q7_compliance: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully confident, legal obligations mapped and controls in place",
          playback: "You told us you're fully confident, with legal obligations mapped and controls actively enforced.",
          interpretation: "You've done the work others avoid. Mapping obligations to controls means compliance by design, not luck. This positions you to respond confidently to regulators, auditors, or clients. Maintain this through regular reviews as AI regulations evolve rapidly."
        },
        "opt_4": {
          score: 4,
          label: "Mostly confident, risks understood and mitigated",
          playback: "You said you're mostly confident, with key risks identified and mitigation in place.",
          interpretation: "You understand the landscape but haven't mapped every detail. \"Mostly confident\" often means known unknowns remain. The gap between mostly and fully confident is where incidents hide. Close those gaps before they close on you."
        },
        "opt_3": {
          score: 3,
          label: "Somewhat confident, partial understanding and oversight",
          playback: "You told us you're somewhat confident, with partial understanding of obligations.",
          interpretation: "This uncertainty is common but dangerous. \"Somewhat confident\" in legal compliance is like being \"somewhat pregnant\", you either comply or you don't. Partial understanding leads to partial protection. Get legal clarity before an incident forces it."
        },
        "opt_2": {
          score: 2,
          label: "Not confident, limited awareness or checks",
          playback: "You said you're not confident, with limited awareness of legal obligations.",
          interpretation: "You know enough to be worried, but not enough to be safe. This honesty is valuable, it's better than false confidence. But worry without action is just anxiety. Map your obligations urgently; ignorance isn't a legal defence."
        },
        "opt_1": {
          score: 1,
          label: "Know we're likely exposed",
          playback: "You told us you know your AI use likely violates legal obligations.",
          interpretation: "You're knowingly operating outside compliance. This isn't just risk, it's liability accumulating daily. Every day of known non-compliance increases penalty severity if discovered. Remediation is cheaper than prosecution. Act immediately."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered legal or privacy risks at all",
          playback: "You said you haven't considered legal or privacy obligations related to AI use.",
          interpretation: "The law applies whether you consider it or not. Privacy Acts, and data protection laws don't require your awareness to impose penalties. You're operating blind in a minefield. Start with basic legal review, ignorance multiplies penalties."
        }
      }
    },

    q8_resources: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully resourced with budget, team, and executive time committed",
          playback: "You told us you've fully resourced AI adoption with budget, team, and executive commitment in place.",
          interpretation: "You're backing intent with investment. This is where strategy becomes reality. With resources allocated, your focus shifts to execution quality and ROI measurement. The risk now is spreading resources too thin, maintain focus on priority use cases."
        },
        "opt_4": {
          score: 4,
          label: "Budget approved, team being assembled",
          playback: "You said budget is approved and you're building the team to deliver AI initiatives.",
          interpretation: "You've crossed the commitment threshold. Budget approval signals leadership buy-in, but team assembly is where momentum builds or stalls. Move quickly, the gap between approval and action is where many initiatives lose steam."
        },
        "opt_3": {
          score: 3,
          label: "Resources identified, approval in progress",
          playback: "You told us resources have been identified but you're still securing formal approval.",
          interpretation: "You're in the danger zone between intent and action. While approval processes grind on, competitors are already executing. Consider starting with smaller investments that don't need sign-off, build momentum while bureaucracy catches up."
        },
        "opt_2": {
          score: 2,
          label: "Considering investment, no formal commitment",
          playback: "You said you're considering investment but haven't made formal commitments yet.",
          interpretation: "This is exploration without commitment. AI requires more than curiosity, it needs dedicated resources. Without budget or team allocation, you're essentially window shopping while others are building. Set a decision deadline or risk permanent delay."
        },
        "opt_1": {
          score: 1,
          label: "No resources allocated or planned",
          playback: "You told us no resources have been allocated and none are planned for AI adoption.",
          interpretation: "You're treating AI as optional while competitors treat it as essential. No resources means no progress. This isn't just about falling behind, it's about becoming irrelevant. Even small pilot budgets would signal more readiness than zero investment."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered resourcing yet",
          playback: "You said you haven't yet considered what resources AI adoption would require.",
          interpretation: "This suggests AI isn't even on the strategic radar. While you haven't considered resourcing, your competitors are already seeing returns. Start by understanding resource requirements, you can't make informed decisions without knowing the investment needed."
        }
      }
    },

    q9_data_protection: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully confident, technical controls prevent it",
          playback: "You said you're fully confident that strong technical controls are in place to prevent data exposure through AI tools.",
          interpretation: "This reflects a mature security posture. Approved tools, usage monitoring, and clear controls are working together to protect sensitive data. You're treating AI as a data processor, and managing the risks accordingly."
        },
        "opt_4": {
          score: 4,
          label: "Confident, strong policies and monitoring",
          playback: "You told us you're confident data is protected through a combination of policies, training, and monitoring.",
          interpretation: "You've built solid protection, but policy without enforcement can drift. Stay proactive. Periodic audits and tighter controls on new tools will help maintain this confidence over time."
        },
        "opt_3": {
          score: 3,
          label: "Reasonably confident, relying on staff judgment",
          playback: "You said you're somewhat confident, relying on staff judgement rather than formal controls.",
          interpretation: "This creates inconsistency. Some staff may be cautious; others may paste sensitive info into free tools without thinking. Relying on individual judgment is not a sustainable defence. Formalise your guidance before an incident forces the issue."
        },
        "opt_2": {
          score: 2,
          label: "Not confident, some exposure likely",
          playback: "You told us you're not confident, and that some sensitive data has likely been exposed.",
          interpretation: "Sensitive documents, client details, or IP may already be in free tools with no oversight or audit trail. This level of exposure presents reputational, legal, and operational risk. You'll need to act quickly to contain and correct."
        },
        "opt_1": {
          score: 1,
          label: "Exposure has occurred",
          playback: "You said you know sensitive data has been entered into AI tools without approval.",
          interpretation: "The breach has already happened. If left unaddressed, this erodes trust with staff, clients, and partners. Begin with a formal review of what's been shared, by whom, and what controls are missing. Visibility is the first step toward recovery."
        },
        "opt_0": {
          score: 0,
          label: "No idea what's being shared or with which tools",
          playback: "You said you don't know whether any sensitive data has been shared, or with which tools.",
          interpretation: "This is high-risk invisibility. If no one's tracking usage, you can't rule out exposure, and you'll be unprepared if clients, regulators, or internal stakeholders ask hard questions. You need immediate discovery and data policy alignment."
        }
      }
    },

    q10_opportunity: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear ROI opportunities mapped across multiple areas",
          playback: "You told us your organisation has clearly identified where AI will deliver value, with mapped use cases and ROI projections across teams.",
          interpretation: "You know exactly where AI drives value, now it's about execution. You're ready to shift from exploration to scaled implementation. The challenge now is delivery, not direction."
        },
        "opt_4": {
          score: 4,
          label: "Specific use cases identified with estimated benefits",
          playback: "You said you've identified specific AI use cases and can estimate the potential benefits.",
          interpretation: "You've done the thinking. Now it's about prioritising, resourcing, and testing. Organisations at this stage often benefit from structured roadmap support to accelerate traction."
        },
        "opt_3": {
          score: 3,
          label: "General sense of where AI could help",
          playback: "You told us you have a general sense of where AI might help, but no specific initiatives yet.",
          interpretation: "You see the potential, but it's still abstract. Most businesses in this zone are missing 70 to 80% of the actual opportunity. A focused opportunity scan typically reveals far more upside than initially expected."
        },
        "opt_2": {
          score: 2,
          label: "Vague understanding of potential value",
          playback: "You said there's a vague awareness that AI could help, but no clarity on where or how.",
          interpretation: "This is a signal that AI is viewed as a trend, not a tool. Teams may feel uncertain or stuck. Strategic clarity, even in one function, can unlock momentum and build confidence."
        },
        "opt_1": {
          score: 1,
          label: "Haven't explored opportunities yet",
          playback: "You told us your organisation hasn't yet explored where AI could add value.",
          interpretation: "The opportunity is passing you by. Every month of inaction increases the gap between where you are and where leaders are heading. Start by identifying one area where time, cost, or accuracy could be improved."
        },
        "opt_0": {
          score: 0,
          label: "Don't see how AI applies to our business",
          playback: "You said you don't see how AI is relevant to your business.",
          interpretation: "This is the biggest risk of all, missed opportunity. While others reduce admin, improve customer service, or speed up delivery, you're sitting out the shift. Most organisations that say this revise their view once they see real examples."
        }
      }
    }
  } as Record<string, QuestionConfig>,

  bands: [
    {
      min_score: 0,
      max_score: 25,
      label: "Blind",
      narrative: "You have zero visibility on AI — you're either missing opportunities or exposed to risks you can't see."
    },
    {
      min_score: 26,
      max_score: 50,
      label: "Reactive",
      narrative: "AI is likely happening in the shadows while you have no plan. You can't manage what you can't see."
    },
    {
      min_score: 51,
      max_score: 75,
      label: "Building",
      narrative: "You've got awareness, but execution is fragile without a clear roadmap and consistent governance."
    },
    {
      min_score: 76,
      max_score: 100,
      label: "Ready",
      narrative: "You've got strong foundations. The question now is execution speed and sustaining momentum."
    }
  ] as MaturityBand[],

  gap_descriptions: {
    q1_ownership: {
      title: "No executive ownership of AI",
      description: "Without clear leadership accountability, AI adoption will remain fragmented and ineffective.",
      recommendation: "Strengthen accountability: assign a clear AI owner at leadership level to drive strategy and governance."
    },
    q2_strategy: {
      title: "AI absent from strategy",
      description: "Strategic planning that ignores AI means missing the biggest transformation opportunity of our time.",
      recommendation: "Bring AI into strategic planning. Make leadership responsible for aligning it with business priorities (accountability and transparency working together)."
    },
    q3_culture: {
      title: "Cultural resistance or uncertainty",
      description: "Without cultural buy-in, even the best tools and policies will fail to deliver value.",
      recommendation: "Build trust: start conversations about what AI means for your team, address concerns openly, and involve people in shaping safe use."
    },
    q4_enablement: {
      title: "No staff training or enablement",
      description: "Untrained staff create risk through well-intentioned mistakes and missed opportunities.",
      recommendation: "Build capability: upskill your people so they can use approved tools safely and effectively."
    },
    q5_shadow_ai: {
      title: "Shadow AI exposure",
      description: "Unmanaged AI use means data exposure, compliance risk, and loss of control.",
      recommendation: "You can't govern what you can't see. Start with transparency: run a quick Shadow AI discovery and open the conversation with your team."
    },
    q6_governance: {
      title: "No governance framework",
      description: "Without clear policies and guardrails, you can't manage risk or scale safely.",
      recommendation: "Set the foundations for trust: create basic guardrails and policies that make safe, ethical use easy."
    },
    q7_compliance: {
      title: "Legal compliance uncertainty",
      description: "Operating without clarity on legal obligations creates liability that compounds daily.",
      recommendation: "Strengthen accountability: get legal and leadership aligned on compliance obligations and document your approach."
    },
    q8_resources: {
      title: "No resources allocated",
      description: "Good intentions without budget and people means AI remains stuck in the talking phase.",
      recommendation: "Show accountability and intent: allocate time, budget, and people to manage AI adoption deliberately."
    },
    q9_data_protection: {
      title: "Data exposure risk",
      description: "Without controls, sensitive data is likely being shared with AI tools invisibly.",
      recommendation: "Protect trust: implement basic controls to prevent sensitive data from being shared with AI tools invisibly."
    },
    q10_opportunity: {
      title: "Opportunities not identified",
      description: "You can't capture value you haven't identified. Start by mapping where AI could help.",
      recommendation: "Start with transparency: map where AI could add value across operations, customer experience, and decision making."
    }
  } as Record<string, GapDescription>,

  gap_summaries: {
    "Blind": "These gaps represent critical blind spots. Start with Leadership Mastery and Shadow AI discovery.",
    "Reactive": "These gaps prevent coordinated progress. Focus on establishing basic Governance & Trust to enable safe experimentation.",
    "Building": "These gaps limit your ability to scale. Address them systematically to strengthen Execution & Evolution.",
    "Ready": "These represent optimization opportunities. Focus here to maximize ROI and competitive advantage."
  } as Record<string, string>,

  next_steps: {
    low_readiness: {
      cta: "Schedule your AI Readiness Assessment and 90-Day Roadmap session",
      narrative: "We'll map your current state, identify quick wins, and build a practical plan to move from risk to readiness."
    },
    high_readiness: {
      cta: "Let's discuss your Digital & AI Strategy",
      narrative: "You have foundations in place - now it's time to build competitive advantage at scale."
    }
  }
};
