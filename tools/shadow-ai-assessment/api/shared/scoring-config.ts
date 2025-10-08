/**
 * Shadow AI Assessment - Scoring Configuration
 * Ported from n8n JavaScript implementation
 */

export interface ResponseConfig {
  score?: number;
  risk?: string;
  status?: string;
  label?: string;
  blurb?: string;
}

export interface QuestionConfig {
  type: string;
  max_score?: number;
  responses: Record<string, ResponseConfig>;
}

export interface MaturityBand {
  min_score: number;
  max_score: number;
  label: string;
  description: string;
  recommendations: string[];
}

export const SCORING_CONFIG = {
  version: "1.1",

  field_mappings: {
    "852c00f6-f9bf-4335-a764-fa90c480887a": "email",
    "e990f26f-12e3-418b-a669-bd99a2737afe": "contact_name",
    "4471695a-bf0c-47ec-a82e-b1ffc44c90f5": "company_name",
    "1ba7b5d3-42f3-494b-b011-645bd055a89e": "org_size",
    "fd2f995e-497a-4736-9048-7eb9bb520e92": "sector",
    "13b0950b-054a-4096-8955-f4630778489e": "incidents",
    "35fc7e83-0471-41f4-bd45-fbdf2e785be2": "approval",
    "035e124b-2323-4fba-bcbd-8893e2658c91": "access",
    "47ed6de7-a7c0-4f6c-bf0b-3eec7026adf9": "usage_visibility",
    "549e2daf-3610-4071-a809-94015cde06ee": "detection",
    "5bbdd193-d0ad-445e-b356-10ecbe99de76": "policy",
    "955e31ad-7cf1-4244-883e-8befbc11c8f6": "training",
    "4c8201cf-e0a9-4c80-ae79-f070d8e7062a": "risk_concerns",
    "74b9a8b3-4c52-4efc-a9d2-3ca94fa837f2": "traceability",
    "7aa24f6b-9d63-4e12-9cb3-c0fbd5515429": "exposure",
    "cc7516f2-f0ef-479d-95a2-adb1fde1665e": "compliance_awareness"
  },

  questions: {
    incidents: {
      type: "single_choice",
      responses: {
        "f6MAOmbnYwZA": { score: 15, risk: "High", status: "Confirmed incident", blurb: "You've experienced a confirmed AI-related incident. That's a clear sign of real exposure — whether from authorised or unauthorised use. This makes it critical to strengthen oversight, clarify staff guidance, and ensure risks aren't being repeated elsewhere." },
        "nlXtCa0Cbe2H": { score: 10, risk: "Medium", status: "Quality issues", blurb: "You've had an issue with poor or incorrect AI output. Even minor problems like this can create reputational, compliance, or decision-making risks — especially without clear rules or review steps to catch issues early." },
        "D5cD2MaUUZTw": { score: 8, risk: "Medium", status: "Suspected issues", blurb: "You suspect there may have been an AI-related issue, but nothing was confirmed. That uncertainty signals low visibility — which is itself a risk. If something did go wrong, it might still be unknown today." },
        "yBmhWjsKq98K": { score: 3, risk: "Low", status: "No known issues", blurb: "You've reported no known issues from AI tool usage. That's a positive signal, but it doesn't guarantee AI is being used safely. In many organisations, Shadow AI happens beneath the surface, where problems often go unnoticed until something breaks." },
        "bbHTkyfrm1rP": { score: 10, risk: "High", status: "No visibility", blurb: "You're not sure whether any AI-related issues have occurred — which often means no one's watching closely enough to know. This lack of visibility is a critical gap — it makes early warning, response, or accountability almost impossible." }
      }
    },
    approval: {
      type: "single_choice",
      responses: {
        "CL5RWrwBaIO1": { score: 0, risk: "Low", status: "Approved process", blurb: "You've got a formal process for approving AI tools, a strong foundation for responsible AI governance. To keep it effective, make sure it's reviewed regularly and clearly communicated to staff." },
        "HICmNi6IMeFC": { score: 5, risk: "Medium", status: "Informal control", blurb: "You have some oversight, but it's based on informal processes. These are easy to bypass and often not well understood by staff, which increases the risk of inconsistent or risky tool use." },
        "g8v2G5i3DUcU": { score: 8, risk: "Medium", status: "Partial control", blurb: "Some AI tools have been approved, but there's no formal process in place. That means approvals are likely happening ad hoc, which makes risk harder to monitor, manage, or explain." },
        "drjkJbTVux8F": { score: 12, risk: "High", status: "No approval", blurb: "There's no approval process in place, staff are choosing their own AI tools. That's how Shadow AI spreads: through good intentions, not bad actors. Without clear guardrails, risk is invisible and unmanaged." },
        "omPRzqb2ZKKY": { score: 10, risk: "High", status: "Prohibited", blurb: "AI tools aren't permitted, but without providing safe, approved alternatives, this drives usage underground. Shadow AI tends to flourish in environments with strict bans and no clear options." }
      }
    },
    access: {
      type: "single_choice",
      responses: {
        "5yHSaK0w5Cnh": { score: 0, risk: "Low", status: "Access provided", blurb: "Approved AI tools are widely available across your organization, this provides a strong foundation. This also reduces reliance on personal tools and lowers shadow AI risk. However, without clear training or oversight, staff may still expose data unknowingly or apply AI in inconsistent ways." },
        "zyFjAE0PxdNu": { score: 5, risk: "Medium", status: "Partial access", blurb: "Some teams have access to approved tools, while others don't. This creates inconsistency across the organisation and increases the chance that unsupported teams turn to free or personal AI tools to get their work done." },
        "AoFsqSlopBlf": { score: 10, risk: "Medium", status: "No access yet", blurb: "You're actively considering AI tool access, but nothing is available yet. This delay increases the risk that staff begin using personal AI tools — often invisibly — to stay productive in the meantime." },
        "qGW56XhvmLeB": { score: 15, risk: "High", status: "No access provided", blurb: "No approved AI tools are currently available to staff. In most organisations, this doesn't stop AI use — it simply pushes it underground. Staff are likely already using free tools like ChatGPT without visibility or guardrails." },
        "6Kgk6Zftt9U3": { score: 10, risk: "Medium", status: "Unknown access status", blurb: "It's unclear whether staff have access to approved AI tools. In most cases, lack of clarity means there's little visibility or control — and a high chance that AI is being used unofficially in pockets across the business." }
      }
    },
    usage_visibility: {
      type: "single_choice",
      responses: {
        "0MioVOcLjwqk": { score: 0, risk: "Low", status: "Fully controlled", blurb: "You believe only approved tools are being used, that's rare and excellent. Just be sure to keep validating that assumption through monitoring or regular check-ins, as shadow use can emerge quickly." },
        "D2e4kw6zKhWX": { score: 5, risk: "Medium", status: "Minor shadow usage", blurb: "Most AI use follows approved pathways, but some personal or unauthorised use is still occurring. That suggests you've got general control, but gaps are starting to appear that could spread if left unmanaged." },
        "qWV61821h2Ac": { score: 10, risk: "High", status: "Mixed usage", blurb: "AI use is split across approved and unauthorised tools, with no consistent approach. That fragmentation makes governance difficult, and increases the chance of inconsistent decisions, uncontrolled data sharing, or uneven risk exposure across teams." },
        "Ks3oRzHdcHXs": { score: 15, risk: "High", status: "High shadow usage", blurb: "Shadow AI is now the norm, most staff are using personal tools that aren't approved or monitored. That's high exposure: you can't manage what you don't control." },
        "YdgXQdLWH8IP": { score: 2, risk: "Low", status: "No AI claimed", blurb: "You've indicated no AI tools are being used, if true, this is a low-risk position. But it's worth double-checking: in most organisations, AI use starts in the shadows before it becomes visible." },
        "Ld4i5rovL65S": { score: 12, risk: "High", status: "Unknown usage", blurb: "You're not sure what AI tools are being used across the business, that's one of the highest risk signals. Without visibility, there's no way to manage exposure, ensure compliance, or respond if something goes wrong." }
      }
    },
    detection: {
      type: "single_choice",
      responses: {
        "y9exKrGGiXlu": { score: 0, risk: "Low", status: "Monitored", blurb: "You've got monitoring systems in place, that puts you ahead of most organisations. Proactive detection gives you visibility and the ability to respond quickly if AI is used inappropriately. Maintain and regularly test these controls." },
        "YXnW8RE37lCO": { score: 5, risk: "Medium", status: "Audit-revealed", blurb: "You'd likely detect issues through periodic audit. That's a helpful safety net, but it's reactive. By the time you spot the issue, damage may already have occurred. Consider building more real-time visibility into AI use." },
        "9EeZ1hOx4TkC": { score: 10, risk: "High", status: "Trust-based", blurb: "Right now, you rely on staff honesty rather than systems to flag AI use. That's a major visibility gap, and it increases the risk of unintentional exposure, especially when tools are used without approval or oversight." },
        "Y7eLbzj6yG49": { score: 15, risk: "High", status: "No detection", blurb: "There's no way to detect if AI tools are being used with company data. That's full exposure, you can't protect what you can't see. This is a critical gap that should be addressed before AI use expands further." },
        "KX1XLSAmhxXa": { score: 12, risk: "High", status: "Detection unknown", blurb: "Detection of AI tool use hasn't yet been considered, which usually means the risk is unmanaged. Without some form of oversight, it's hard to know whether data is being handled safely, or at all." }
      }
    },
    policy: {
      type: "single_choice",
      responses: {
        "qZb3RtYzGmvw": { score: 0, risk: "Low", status: "Active policy", blurb: "You've got a written AI usage policy that's actively managed, this is best practice. Keep reviewing and reinforcing it as tools evolve, so it stays relevant and trusted by staff." },
        "5pYTQ75byOTx": { score: 5, risk: "Medium", status: "Passive policy", blurb: "You have a written AI policy, but it's not reviewed regularly. That's a solid foundation, but if it gets outdated or forgotten, staff may stop following it. A stale policy can give a false sense of security." },
        "NaXmJcCZkNqH": { score: 8, risk: "Medium", status: "Verbal-only", blurb: "You rely on informal guidance rather than a documented policy. That helps in the short term, but informal rules are often applied inconsistently, especially as teams grow or change. Staff need clarity on what's okay and what's not." },
        "1OMIe2wwXO6S": { score: 10, risk: "High", status: "Documented ban", blurb: "AI use is formally prohibited, and clearly documented. But a ban on its own doesn't prevent use. Without safe alternatives or clear comms, staff may still turn to personal tools to solve real problems." },
        "l3dzosDgAJxi": { score: 12, risk: "High", status: "Undocumented ban", blurb: "AI use is banned, but the ban hasn't been documented. Without a written policy, it's hard to enforce, and staff may not even be aware of the rules. This creates confusion and unmanaged risk." },
        "Stzy9S9bVKUm": { score: 15, risk: "High", status: "No policy", blurb: "There's currently no AI usage policy in place. That means staff are left to interpret what's okay, or avoid AI altogether out of fear. Either way, risk is unmanaged, and opportunities will be missed." }
      }
    },
    training: {
      type: "single_choice",
      responses: {
        "F1Agc0r7fg3m": { score: 0, risk: "Low", status: "Trained & aware", blurb: "Staff have received comprehensive training on how to use AI tools safely, that's a strong safeguard. Awareness is your first line of defence. Keep this training updated as tools and risks evolve." },
        "4HZUY6CyMDr2": { score: 5, risk: "Medium", status: "Light guidance", blurb: "Staff have been given basic guidance, a good starting point. But with AI use expanding quickly, more structured training may be needed to avoid accidental risks or inconsistent decisions." },
        "s49jpucnq1Qq": { score: 8, risk: "Medium", status: "Passive awareness", blurb: "The policy has been shared, but no training has been delivered. That creates a gap, people may agree in theory but still act unsafely in practice. Training turns policy into behaviour." },
        "I4OlXjV1IUwC": { score: 10, risk: "High", status: "Prohibition message", blurb: "Staff have been told not to use AI tools, but \"don't use it\" isn't a training strategy. In most cases, it just pushes usage underground. If there's no safe alternative, risk increases, not decreases." },
        "OUqpBRnylGdB": { score: 15, risk: "High", status: "No awareness", blurb: "Staff haven't received any training or guidance which means they may be using AI tools with no understanding of the risks involved. This is one of the most preventable forms of exposure." }
      }
    },
    risk_concerns: {
      type: "multi_select",
      max_score: 15,
      responses: {
        "edxiDFVkVomW": { score: 0, label: "Privacy breaches" },
        "CekmRu1ox0Wr": { score: 0, label: "Customer data exposure" },
        "NPzLCcwxm9zX": { score: 0, label: "IP leakage" },
        "ga4phu9diMz8": { score: 0, label: "Incorrect output" },
        "zQEqrFHag95i": { score: 0, label: "Cyber security" },
        "xwBNrUc4WI1j": { score: 0, label: "Competitive disadvantage" },
        "vns8kmtwoQPS": { score: 0, label: "Reputation risk" },
        "Bi5uDunURNLn": { score: 10, label: "Not sure" }
      }
    },
    traceability: {
      type: "single_choice",
      responses: {
        "qI36qW6J22Fh": { score: 0, risk: "Low", status: "Fully transparent", blurb: "You can confidently answer which AI tools have processed customer data, a strong position that builds real trust. This level of traceability is rare, and highly valuable in regulated or trust-sensitive industries." },
        "FR7d9Ts1FCns": { score: 5, risk: "Medium", status: "Partially visible", blurb: "You have visibility over approved tools, but that doesn't cover everything. If unauthorised AI use is happening, your current systems won't capture it. That creates a potential gap in your customer disclosures." },
        "FOoqfPV9EsRz": { score: 8, risk: "Medium", status: "Some traceability", blurb: "You have some visibility into which AI tools are being used with customer data, but not full traceability. That makes it hard to give reliable answers if customers or regulators ask for specifics." },
        "h9adjv57ICuL": { score: 12, risk: "High", status: "No accountability", blurb: "You can't confirm which AI tools have processed customer data. That's a serious accountability gap, and a direct risk to customer trust, especially if data has been shared without consent or oversight." },
        "YCoEAaP9s2KZ": { score: 15, risk: "High", status: "Unaware", blurb: "You haven't considered whether AI tools are processing customer data, that's a critical blind spot. Customers, auditors, or regulators will ask. Without traceability, you may not be able to respond when it matters most." }
      }
    },
    exposure: {
      type: "single_choice",
      responses: {
        "Z7aEY1IJMnnP": { score: 0, risk: "Low", status: "Prevented", blurb: "You've implemented technical controls to block unauthorised AI use — that's a strong safeguard. Just ensure staff are also trained on why those controls exist, so safe habits continue even outside the system." },
        "Cvvq4VXmJr1a": { score: 5, risk: "Medium", status: "Rules exist", blurb: "You rely on policy to prevent staff from entering data into unauthorised tools. That's helpful, but if staff aren't trained on the risks, they may still share sensitive data unintentionally, especially under pressure or with good intentions." },
        "x2YDDMq02qAv": { score: 8, risk: "Medium", status: "Uncertain", blurb: "You're not sure whether data has been entered into public AI tools, that uncertainty is a risk in itself. It often means policies aren't reinforced through training or visible systems, making exposure harder to detect." },
        "0xr20T7ogJds": { score: 12, risk: "High", status: "Likely exposure", blurb: "You believe staff have likely shared data with unauthorised AI tools. This is a known exposure. Addressing it requires both clear guidance and active support, not just policy reminders, but practical training and safe alternatives." },
        "TnZONozLaWQK": { score: 15, risk: "High", status: "Confirmed exposure", blurb: "You've confirmed sensitive data was entered into unauthorised AI tools. This is a critical risk signal. Immediate next steps include assessing the scope, communicating safe usage expectations, and delivering targeted staff training to prevent recurrence." },
        "wlc1nqZ7edIU": { score: 12, risk: "High", status: "Unknown exposure", blurb: "You're not sure whether data has been shared with AI tools, which often means staff are acting without guidance or oversight. Without clear training and monitoring, exposure may already be occurring invisibly." }
      }
    },
    compliance_awareness: {
      type: "single_choice",
      responses: {
        "NGq4zhF6eLsm": { score: 0, risk: "Low", status: "Confident", blurb: "You're fully aware of your obligations and compliant with relevant privacy requirements, that's a strong position. Proactive compliance protects your organisation, your customers, and your long-term reputation." },
        "O6verJRPDrVI": { score: 5, risk: "Medium", status: "Mostly aware", blurb: "You understand the general compliance landscape, that's a good foundation. Now's the time to formalise your approach to ensure nothing is missed, especially as AI tools evolve." },
        "Bw94dH38HsYy": { score: 8, risk: "Medium", status: "Basic awareness", blurb: "You've got some awareness of your legal obligations, but not full clarity. This uncertainty leaves you exposed, especially if staff are using AI tools in ways you can't monitor or trace." },
        "Kg2riTAQY9Jq": { score: 12, risk: "High", status: "Low awareness", blurb: "You're not fully aware of your legal responsibilities which means risk is going unmanaged. It's critical to map out your obligations now, before a misstep triggers regulatory or reputational consequences." },
        "tP6F6fo3oPgW": { score: 15, risk: "High", status: "Unaware", blurb: "You weren't aware there are legal obligations when using AI tools with customer or staff data. Unfortunately, the law still applies, and ignorance isn't a defence. This is the first gap to close." }
      }
    },
    org_size: {
      type: "single_choice",
      responses: {
        "buEnbBsnqxHG": { score: 0, label: "1–10" },
        "IwNGTfgstrR5": { score: 0, label: "11–50" },
        "ELi7nGNdnb0W": { score: 0, label: "51–200" },
        "AMOp7oJAFREj": { score: 0, label: "201–500" },
        "hgjY75zvtwNf": { score: 0, label: "500+" }
      }
    },
    sector: {
      type: "dropdown",
      responses: {
        "Dt50cUdkTt05": { score: 0, label: "Professional Services" },
        "GsmM7QJUkTfb": { score: 0, label: "Financial Services" },
        "OLKA6z05ogDM": { score: 0, label: "Healthcare" },
        "kRQrBSAYe0lI": { score: 0, label: "Technology" },
        "ONs3p888DHEX": { score: 0, label: "Retail" },
        "pA7PRRRdwx4W": { score: 0, label: "Manufacturing" },
        "0DltiMQi9Zrh": { score: 0, label: "Agriculture" },
        "23QVdYXEys7M": { score: 0, label: "Construction" },
        "dkkqAATx7sGN": { score: 0, label: "Government" },
        "mK9pLxRt2Yq7": { score: 0, label: "Media / Communications" },
        "xAYyxFqGCMnN": { score: 0, label: "Other" }
      }
    }
  } as Record<string, QuestionConfig>,

  bands: [
    {
      min_score: 0,
      max_score: 25,
      label: "Managed",
      description: "You have strong foundations in place, tools, policies, and visibility are largely under control. This is rare and valuable. Focus now on optimising what's working, reviewing usage patterns, and staying ahead of evolving risks.",
      recommendations: [
        "Review AI usage across teams",
        "Formalise optimisation & scale plan",
        "Keep pace with evolving tools and risks",
        "Share best practices org-wide"
      ]
    },
    {
      min_score: 26,
      max_score: 50,
      label: "Developing",
      description: "You've made clear progress, and some core practices are in place. But gaps still exist in access, guidance, or staff capability. Your next step is to formalise what's working, and close the visibility and training gaps before scale increases risk.",
      recommendations: [
        "Confirm access policy and ownership",
        "Deliver light training or usage guidance",
        "Prepare to formalise governance",
        "Implement monitoring for unauthorised tools"
      ]
    },
    {
      min_score: 51,
      max_score: 75,
      label: "Ad Hoc",
      description: "Your organisation has minimal AI governance. AI usage is largely unmanaged and exposed, with significant gaps in policy, visibility, and controls.",
      recommendations: [
        "Run internal discovery (usage & exposure)",
        "Publish basic AI usage policy",
        "Provide safe access to core tools",
        "Appoint AI governance owner"
      ]
    },
    {
      min_score: 76,
      max_score: 100,
      label: "Unmanaged",
      description: "Shadow AI is active, invisible, and unmanaged, and the risks are immediate. Staff are likely using AI tools without any guardrails. Start now: issue a company-wide message, provide safe alternatives, and assign someone to lead AI oversight.",
      recommendations: [
        "Send all-staff AI usage communication today",
        "Block public tools temporarily this week",
        "Appoint senior AI oversight",
        "Provide safe alternatives immediately"
      ]
    }
  ] as MaturityBand[],

  escalation_rules: {
    unknown_threshold: 2,
    unknown_response_ids: ["6Kgk6Zftt9U3", "bbHTkyfrm1rP", "Ld4i5rovL65S", "KX1XLSAmhxXa", "YCoEAaP9s2KZ", "wlc1nqZ7edIU", "Bi5uDunURNLn"]
  },

  defaults: {
    unmapped_score: 10,
    status: "Not assessed",
    risk: "Unknown",
    blurb: "No answer provided — lack of visibility increases risk."
  }
};