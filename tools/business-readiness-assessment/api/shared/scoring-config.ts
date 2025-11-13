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
          label: "Assigned to a senior leader, but not yet visible across the business",
          playback: "You said a senior leader owns AI, but it's not yet visible across the organisation.",
          interpretation: "You have an owner, but they lack visibility or authority to drive change across the business. This needs stronger leadership backing and clear mandate to be effective."
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
          interpretation: "Leadership is aware but paralysed. Everyone agrees someone should own it, but nobody wants the responsibility. Meanwhile, opportunities are missed and competitors advance. This indecision costs more than any wrong decision would."
        },
        "opt_1": {
          score: 1,
          label: "No clear ownership or intent to assign",
          playback: "You told us no one owns AI, and there's no plan to change that.",
          interpretation: "AI has no leadership oversight. Every week without ownership means deeper fragmentation and missed opportunities. Assign an owner within days, not months."
        },
        "opt_0": {
          score: 0,
          label: "Not discussed or considered at all",
          playback: "You said you don't know whether AI ownership exists or has even been discussed.",
          interpretation: "AI is happening without any leadership oversight. No one is watching the risks, shaping the opportunities, or guiding adoption. This is an organisational blind spot, and a strategic liability."
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
          label: "Regularly discussed at leadership level",
          playback: "You said AI is regularly discussed at leadership level meetings.",
          interpretation: "Leadership engagement is strong, but discussion without documentation risks drift. Until AI moves from agenda item to strategic plan, execution remains informal. Document the strategy to convert conversation into coordinated action."
        },
        "opt_3": {
          score: 3,
          label: "Included in planning documents but not acted on",
          playback: "You told us AI appears in planning documents but hasn't translated to action.",
          interpretation: "This is strategic theatre. AI is mentioned to appear current, but without execution it's just words on paper. The gap between documentation and action is where competitive advantage is lost. Move from planning to pilots immediately."
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
          interpretation: "This is typical and manageable. The split usually follows generational or role lines. Resistance often masks fear, fear of replacement, irrelevance, or failure. Address the fear directly with clear messaging about augmentation, not replacement."
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
          interpretation: "Staff are either unaware or haven't been engaged in the conversation. This usually signals a leadership communication gap, not genuine indifference. Start with transparent conversations about what AI means for your team before imposing policies."
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
          interpretation: "Guidance without training means staff know the rules but not the tools. This creates hesitation and low adoption. People won't use tools they don't understand. Follow guidance with hands-on enablement."
        },
        "opt_2": {
          score: 2,
          label: "Informal tips or peer support only",
          playback: "You said staff have been told they can use AI, but no training or resources have been provided.",
          interpretation: "Permission without enablement leads to inconsistent results and hidden risk. This is how data breaches happen, through good intentions and poor knowledge. Provide training immediately."
        },
        "opt_1": {
          score: 1,
          label: "Told not to use AI, without alternatives",
          playback: "You told us staff are expected to figure it out themselves, with no formal support.",
          interpretation: "This is wishful thinking at scale. A few tech-savvy staff will thrive; most will flounder or opt out. Capability gaps will widen, and organisational value will concentrate in the hands of a few. Enablement is not optional for strategic adoption."
        },
        "opt_0": {
          score: 0,
          label: "No guidance, training or enablement at all",
          playback: "You said no training, guidance, or resources have been provided to staff at all.",
          interpretation: "Staff are in the dark. Any AI usage is happening by accident, with maximum risk and minimal value. Without guidance, staff either avoid AI entirely or experiment unsafely. Begin with basic education and approved tools."
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
          playback: "You said only minimal Shadow AI use is happening, in isolated cases.",
          interpretation: "You have strong awareness and controls. Isolated cases are normal, perfect compliance is unrealistic. The key is rapid detection and correction. Monitor these cases to prevent spread."
        },
        "opt_3": {
          score: 3,
          label: "Some teams using personal accounts",
          playback: "You told us some teams are using personal accounts.",
          interpretation: "You're in the danger zone. What starts as a few teams quickly becomes department-wide adoption. Shadow AI spreads through peer influence. Act now to establish approved alternatives."
        },
        "opt_2": {
          score: 2,
          label: "Widespread use across teams (free accounts, no oversight)",
          playback: "You said there's widespread use across teams with free accounts and no oversight.",
          interpretation: "This is crisis-level exposure. Shadow AI is happening at scale, and you have no visibility or control. Act within days to assess risk, establish guardrails, and provide approved alternatives."
        },
        "opt_1": {
          score: 1,
          label: "Extensive Shadow AI, no controls in place",
          playback: "You said you likely have extensive unauthorised (Shadow AI) use, with no visibility or controls.",
          interpretation: "This is maximum-risk blindness. You suspect widespread use but have no way to verify, contain, or guide it. Data exposure is highly likely. Begin immediate discovery and establish basic guardrails within days."
        },
        "opt_0": {
          score: 0,
          label: "Don't know what's being used",
          playback: "You said you don't know what's being used.",
          interpretation: "You can't protect what you can't see. If AI is being used, you're exposed to data and compliance risks. If it's not, you're missing productivity gains. Either way, you need visibility. Start with a discovery exercise."
        }
      }
    },

    q6_governance: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear AI policy and guardrails in place",
          playback: "You told us you have clear AI governance policies and guardrails in place.",
          interpretation: "Strong governance means you can scale safely. Clear rules, approved tools, and consistent application create boundaries that enable innovation rather than block it. This is enterprise readiness."
        },
        "opt_4": {
          score: 4,
          label: "Working draft shared and being refined",
          playback: "You said governance policies exist but are still being refined.",
          interpretation: "You've made a solid start. Policy without consistent application is just guidance. Staff will follow the path of least resistance. Make approved tools easier to use than Shadow AI alternatives."
        },
        "opt_3": {
          score: 3,
          label: "Basic rules or principles communicated",
          playback: "You told us basic rules or principles have been communicated to staff.",
          interpretation: "Basic guidance is better than nothing, but without detail, staff will interpret differently. What's acceptable? What's forbidden? Create clear examples and practical guidelines so people know what good looks like."
        },
        "opt_2": {
          score: 2,
          label: "Informal expectations only",
          playback: "You said there are informal expectations but no formal governance in place.",
          interpretation: "Informal expectations shift between managers and teams. What's acceptable in one team is forbidden in another. This creates confusion and inconsistent risk. Document clear guidelines and communicate them broadly."
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
          interpretation: "AI governance isn't on the radar. Without visibility, policy, or ownership, you have no ability to detect, contain, or respond to incidents. Begin with discovery and leadership alignment before the first incident forces the conversation."
        }
      }
    },

    q7_compliance: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully confident, legal obligations mapped and controls in place",
          playback: "You told us you're fully confident, with legal obligations mapped and controls in place.",
          interpretation: "You've done the work others avoid. Mapping obligations to controls means compliance by design, not luck. This positions you to respond confidently to regulators, auditors, or clients about how you protect their data."
        },
        "opt_4": {
          score: 4,
          label: "Mostly confident, risks understood and mitigated",
          playback: "You said you're mostly confident, with key risks identified and mitigation in place.",
          interpretation: "You understand the landscape but haven't mapped every detail. \"Mostly confident\" often means known unknowns remain. The gap between mostly and fully confident is where data breaches and privacy violations hide. Close those gaps before they close on you."
        },
        "opt_3": {
          score: 3,
          label: "Somewhat confident, partial understanding and oversight",
          playback: "You told us you're somewhat confident, with partial understanding of obligations.",
          interpretation: "\"Somewhat confident\" in data protection is like being \"somewhat pregnant\". You either protect client data or you don't. Partial understanding leads to partial protection, which isn't protection at all. Map your obligations urgently."
        },
        "opt_2": {
          score: 2,
          label: "Not confident, limited awareness or checks",
          playback: "You said you're not confident, with limited awareness of legal obligations.",
          interpretation: "You know enough to be worried, but not enough to be safe. This honesty is refreshing but dangerous. Privacy Act obligations, confidentiality agreements, and professional duties don't disappear because you're using AI tools. Map your obligations urgently."
        },
        "opt_1": {
          score: 1,
          label: "Know we're likely exposed",
          playback: "You told us you know compliance obligations aren't being met.",
          interpretation: "Operating knowingly out of compliance is the highest-risk position. Every day increases liability for data breaches, privacy violations, or IP exposure. This needs immediate attention and legal review."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered legal or privacy risks at all",
          playback: "You said you have no idea whether legal obligations are being met.",
          interpretation: "Total blindness to compliance creates compounding liability. Privacy and data protection obligations apply whether you're using AI or not. Operating without any awareness of what data is being shared or with which tools is gambling with client trust and your professional reputation."
        }
      }
    },

    q8_resources: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Fully resourced with budget, team, and leadership time committed",
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
          interpretation: "Resources exist but aren't committed. This suggests AI hasn't crossed the threshold from \"interesting\" to \"strategic priority.\" Until budget and people are allocated, AI will remain secondary to everything else. Make the call."
        },
        "opt_2": {
          score: 2,
          label: "Considering investment, no formal commitment",
          playback: "You said you're considering investment but haven't made formal commitments yet.",
          interpretation: "Good intentions without resources means AI stays in the talking phase. Meanwhile, competitors are investing. If AI matters strategically, resource it. If not, stop pretending it does."
        },
        "opt_1": {
          score: 1,
          label: "No resources allocated or planned",
          playback: "You told us there's no discussion of resource allocation for AI.",
          interpretation: "No resources means no execution. AI won't happen by accident. If you want strategic AI capability, fund it. Without resources, you're watching from the sidelines while others build advantage."
        },
        "opt_0": {
          score: 0,
          label: "Haven't considered resourcing yet",
          playback: "You said there's no discussion of resourcing yet.",
          interpretation: "AI hasn't even made it onto the resource discussion agenda. This suggests it's not seen as a strategic priority. Until leadership commits time and budget, AI will remain an idea, not a capability."
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
          interpretation: "This creates inconsistency. Some staff may be cautious; others may paste sensitive info into free tools without thinking. Relying on individual judgement is not a sustainable defence. Formalise your guidance before an incident forces the issue."
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
          interpretation: "You have zero visibility into data exposure. This is the highest-risk state, confirmed breaches are bad, but unknown breaches are worse. Start with discovery immediately."
        }
      }
    },

    q10_opportunity: {
      type: "single_choice",
      responses: {
        "opt_5": {
          score: 5,
          label: "Clear ROI opportunities mapped across multiple areas",
          playback: "You told us specific opportunities are mapped and prioritised, with business cases ready.",
          interpretation: "You've done the strategic work. Now focus on execution discipline: start with one pilot, prove value in a low-risk environment, share learnings, and build confidence before scaling. Most businesses fail by running before they walk."
        },
        "opt_4": {
          score: 4,
          label: "Specific use cases identified with estimated benefits",
          playback: "You said several clear opportunities have been identified and are being explored.",
          interpretation: "You know where AI can help. Resist the temptation to explore everything. Pick one high-value use case, run a contained pilot, prove it works, then expand. Build the foundations before you scale."
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
          playback: "You told us no one has looked at where or how AI could benefit the organisation.",
          interpretation: "You're operating blind to opportunity while competitors map theirs. A simple opportunity scan, 2-4 hours with key stakeholders, will reveal 10-15 use cases. Start there."
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
      label: "Advanced",
      narrative: "You've got strong foundations. The question now is execution speed and sustaining momentum."
    }
  ] as MaturityBand[],

  gap_descriptions: {
    q1_ownership: {
      title: "No leadership ownership of AI",
      description: "Without clear leadership accountability, AI adoption will remain fragmented and ineffective.",
      recommendation: "Strengthen accountability: assign a clear AI owner at leadership level to drive strategy and governance. This is the foundation of Leadership Mastery."
    },
    q2_strategy: {
      title: "AI absent from strategy",
      description: "Strategic planning that ignores AI means missing the biggest transformation opportunity of our time.",
      recommendation: "Bring AI into strategic planning. Make leadership responsible for aligning it with business priorities (accountability and transparency working together). This builds your Strategy & Direction."
    },
    q3_culture: {
      title: "Cultural resistance or uncertainty",
      description: "Without cultural buy-in, even the best tools and policies will fail to deliver value.",
      recommendation: "Build trust: start conversations about what AI means for your team, address concerns openly, and involve people in shaping safe use. This is core to People & Capability development."
    },
    q4_enablement: {
      title: "No staff training or enablement",
      description: "Untrained staff create risk through well-intentioned mistakes and missed opportunities.",
      recommendation: "Build capability: upskill your people so they can use approved tools safely and effectively. This strengthens People & Capability across your organisation."
    },
    q5_shadow_ai: {
      title: "Shadow AI exposure",
      description: "Unmanaged AI use means data exposure, compliance risk, and loss of control.",
      recommendation: "You can't govern what you can't see. Start with transparency: run a quick Shadow AI discovery and open the conversation with your team. This builds the foundation for Governance & Trust."
    },
    q6_governance: {
      title: "No governance framework",
      description: "Without clear policies and guardrails, you can't manage risk or scale safely.",
      recommendation: "Set the foundation for trust: create basic guardrails and policies that make safe, ethical use easy. This establishes Governance & Trust."
    },
    q7_compliance: {
      title: "Legal compliance uncertainty",
      description: "Operating without clarity on legal obligations creates liability that compounds daily.",
      recommendation: "Strengthen accountability: get legal and leadership aligned on compliance obligations and document your approach. This is essential for Governance & Trust."
    },
    q8_resources: {
      title: "No resources allocated",
      description: "Without budget, people, or leadership time, AI remains an aspiration, not a capability.",
      recommendation: "Commit resources: allocate budget and leadership time to AI initiatives. Strategic priorities require strategic investment. This enables Execution & Evolution."
    },
    q9_data_protection: {
      title: "Data exposure risk",
      description: "Without controls, sensitive data is likely being shared with AI tools invisibly.",
      recommendation: "Secure your foundation: document how data flows through AI tools and establish clear data protection protocols. This is essential for Governance & Trust."
    },
    q10_opportunity: {
      title: "Opportunities not identified",
      description: "You can't capture value you haven't identified. Start by mapping where AI could help.",
      recommendation: "Map your opportunities: identify 3-5 high-ROI use cases where AI solves real problems for your business. This shapes your Strategy & Direction."
    }
  } as Record<string, GapDescription>,

  gap_summaries: {
    "Blind": "These gaps represent critical blind spots. Start with Leadership Mastery and Shadow AI discovery.",
    "Reactive": "These gaps prevent coordinated progress. Focus on establishing basic Governance & Trust to enable safe experimentation.",
    "Building": "These gaps limit your ability to scale. Address them systematically to strengthen Execution & Evolution.",
    "Advanced": "These represent optimization opportunities. Focus here to maximize ROI and competitive advantage."
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
