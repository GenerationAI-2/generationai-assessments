/**
 * PDF Report HTML Template
 * Generates branded HTML for PDF conversion
 */

import { ReportData } from '@generation-ai/types';

export function generatePDFHTML(data: any): string {
  // Route to correct template based on data structure

  // Shadow AI V2 has insight_1_title (unique to V2)
  if (data.insight_1_title !== undefined) {
    return generateShadowAIV2HTML(data);
  }

  // Board Governance has governance_score
  if (data.governance_score !== undefined) {
    return generateBoardGovernanceHTML(data);
  }

  // Personal AI Readiness has usage_insight (unique to Personal AI)
  if (data.usage_insight !== undefined) {
    return generatePersonalAIReadinessHTML(data);
  }

  // Business Readiness has readiness_score
  if (data.readiness_score !== undefined) {
    return generateBusinessReadinessHTML(data);
  }

  // Default to Shadow AI V1 template
  return generateShadowAIHTML(data);
}

function generateShadowAIHTML(data: ReportData): string {
  const scoreNum = parseInt(data.total_score) || 0;
  const maturityClass = getMaturityClass(data.maturity_label);
  const maturityDescription = data.maturity_blurb || getMaturityDescription(data.maturity_label);
  const scoreClass = getScoreClass(scoreNum);

  // Helper to convert risk level to CSS class
  const getRiskClass = (risk: string): string => {
    const lower = risk.toLowerCase();
    if (lower.includes('high')) return 'high';
    if (lower.includes('medium') || lower.includes('moderate')) return 'medium';
    return 'low';
  };

  // Use response_date or generate current date
  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow AI Risk Diagnostic Report - ${data.company_name}</title>
  <style>
    /* ============================================
       GENERATIONAI BRAND DESIGN SYSTEM
       Shadow AI Report Template
       ============================================ */

    :root {
      /* Brand Colours */
      --primary-blue: #2563EB;
      --dark-navy: #0F172A;
      --lime-accent: #D4FF00;
      --text-body: #6B7280;
      --text-heading: #0F172A;
      --border-light: #E5E7EB;
      --bg-light: #F9FAFB;
      --white: #FFFFFF;

      /* Risk Colours */
      --risk-high: #DC2626;
      --risk-high-bg: #FEE2E2;
      --risk-medium: #F59E0B;
      --risk-medium-bg: #FEF3C7;
      --risk-low: #10B981;
      --risk-low-bg: #D1FAE5;

      /* Spacing System - 8px Grid */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 12px;
      --space-lg: 16px;
      --space-xl: 20px;
      --space-2xl: 24px;
      --space-3xl: 32px;

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      --font-size-xs: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 2rem;
      --line-height: 1.6;
      --line-height-tight: 1.2;

      /* Design Properties */
      --radius: 8px;
      --radius-lg: 12px;
      --border-width: 1px;
    }

    /* Page setup for PDF */
    @page {
      size: A4;
      margin: 1.5cm;
    }

    /* Base Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      color: var(--text-body);
      background: var(--white);
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-md);
    }

    /* Typography */
    h1, h2, h3, h4 {
      color: var(--text-heading);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    h1 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 3px solid var(--primary-blue);
    }

    h2 {
      font-size: var(--font-size-2xl);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
    }

    h3 {
      font-size: var(--font-size-xl);
      margin-top: var(--space-md);
      margin-bottom: var(--space-sm);
    }

    h4 {
      font-size: var(--font-size-lg);
      margin-top: var(--space-sm);
      margin-bottom: var(--space-xs);
    }

    p {
      margin-bottom: var(--space-sm);
    }

    strong {
      font-weight: 600;
      color: var(--text-heading);
    }

    /* Header */
    .report-header {
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .report-header img {
      height: 50px;
      width: auto;
      margin-bottom: var(--space-md);
    }

    .report-meta {
      font-size: var(--font-size-base);
      color: var(--text-body);
      line-height: 1.8;
    }

    /* Introduction Box */
    .introduction {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
      border: 1px solid var(--border-light);
    }

    .introduction h2 {
      margin-top: 0;
      color: var(--text-heading);
    }

    /* Context Box */
    .context-box {
      background: var(--bg-light);
      padding: var(--space-md);
      border-radius: var(--radius);
      margin: var(--space-md) 0;
      border: var(--border-width) solid var(--border-light);
    }

    /* Risk Table */
    .risk-table {
      width: 100%;
      border-collapse: collapse;
      margin: var(--space-lg) 0;
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .risk-table thead {
      background: var(--dark-navy);
      color: var(--white);
    }

    .risk-table th {
      padding: var(--space-sm);
      text-align: left;
      font-weight: 700;
      font-size: var(--font-size-base);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .risk-table td {
      padding: var(--space-sm);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .risk-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Risk Badges */
    .risk-high {
      background: var(--risk-high-bg);
      color: var(--risk-high);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    .risk-medium {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    .risk-low {
      background: var(--risk-low-bg);
      color: var(--risk-low);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    /* Critical Banner */
    .critical-banner {
      background: var(--risk-high);
      color: var(--white);
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      font-weight: 600;
    }

    .critical-banner::before {
      content: "⚠️ ";
      font-size: 24px;
      vertical-align: middle;
      margin-right: var(--space-sm);
    }

    /* Score Section */
    .score-section {
      text-align: center;
      margin: var(--space-lg) 0;
      padding: var(--space-lg);
      background: var(--bg-light);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }

    .score-display {
      font-size: 32px;
      font-weight: 700;
      margin: var(--space-md) 0;
    }

    .score-high {
      color: var(--risk-high);
    }

    .score-medium {
      color: var(--risk-medium);
    }

    .score-low {
      color: var(--risk-low);
    }

    .maturity-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border-radius: 20px;
      font-weight: 600;
      margin-top: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .maturity-unmanaged {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .maturity-adhoc {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
    }

    .maturity-developing {
      background: #E0E7FF;
      color: var(--primary-blue);
    }

    .maturity-managed {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    /* Area Sections */
    .area-section {
      margin: var(--space-lg) 0;
      padding: var(--space-md);
      background: var(--white);
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .area-section h3 {
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .explanation-box {
      background: #EFF6FF;
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
    }

    /* Next Steps */
    .next-steps {
      background: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      border: 1px solid var(--border-light);
    }

    .next-steps h2 {
      margin-top: 0;
      color: var(--text-heading);
    }

    .next-steps ul {
      margin-left: var(--space-lg);
      margin-top: var(--space-sm);
    }

    .next-steps li {
      margin-bottom: var(--space-xs);
      color: var(--text-body);
    }

    /* CTA Section */
    .cta-section {
      background: var(--white);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      text-align: center;
      border: 1px solid var(--border-light);
    }

    .cta-section h2 {
      color: var(--text-heading);
      margin-top: 0;
      margin-bottom: var(--space-lg);
    }

    .cta-section h3 {
      color: var(--primary-blue);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .cta-section p {
      color: var(--text-body);
      margin-bottom: var(--space-md);
    }

    .cta-box {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius);
      margin: var(--space-md) 0;
      border: 1px solid var(--border-light);
    }

    .cta-links {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      margin-top: var(--space-md);
    }

    .cta-link {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary-blue);
      color: var(--white);
      text-decoration: none;
      border-radius: var(--radius);
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .cta-link:hover {
      background: #1D4ED8;
    }

    .cta-link--secondary {
      background: var(--white);
      color: var(--primary-blue);
      border: 2px solid var(--primary-blue);
    }

    .cta-link--secondary:hover {
      background: var(--bg-light);
    }

    /* Footer */
    .footer {
      margin-top: var(--space-2xl);
      padding-top: var(--space-lg);
      border-top: 2px solid var(--border-light);
      font-size: var(--font-size-xs);
      color: var(--text-body);
    }

    .footer h3 {
      font-size: var(--font-size-base);
      color: var(--text-heading);
      margin-bottom: var(--space-sm);
    }

    .tagline {
      margin-top: var(--space-lg);
      text-align: center;
      padding: var(--space-md);
      background: var(--bg-light);
      border-radius: var(--radius);
      font-style: italic;
      color: var(--text-body);
    }

    ul {
      margin-left: var(--space-lg);
    }

    li {
      margin-bottom: var(--space-xs);
    }

    /* Responsive */
    @media print {
      body {
        padding: 0;
      }

      /* Enhanced page break control */
      .introduction,
      .context-box,
      .area-section,
      .score-section,
      .next-steps,
      .cta-section,
      .footer {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .explanation-box {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .risk-table {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Ensure content doesn't break awkwardly */
      h2, h3, h4 {
        page-break-after: avoid;
        break-after: avoid;
      }

      p {
        orphans: 3;
        widows: 3;
      }

      /* Force page breaks before major sections if needed */
      .score-section {
        page-break-before: auto;
      }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
         alt="GenerationAI">
    <h1>Shadow AI Risk Diagnostic Summary Report</h1>
    <div class="report-meta">
      <strong>Prepared for:</strong> ${data.company_name}<br>
      <strong>Assessment Completed By:</strong> ${data.contact_name}
    </div>
  </div>

  <div class="introduction">
    <h2>Shadow AI: What's Happening Behind the Scenes</h2>
    <p>AI is already being used in your organisation, often without approval or oversight. Shadow AI isn't rebellion - it's initiative - but it carries real risks to data, security and trust.</p>

    <p><strong>Here's how your organisation measures up, based on what you've told us.</strong></p>
  </div>

  <div class="context-box">
    As a <strong>${data.sector}</strong> organisation with <strong>${data.org_size}</strong> employees, your Shadow AI risk profile has been assessed based on your current practices and organisational readiness.
  </div>

  <h2>Your Shadow AI Assessment</h2>

  <table class="risk-table">
    <thead>
      <tr>
        <th>Area</th>
        <th>Your Status</th>
        <th>Risk Level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>AI Tool Access</strong></td>
        <td>${data.access_status}</td>
        <td><span class="risk-${getRiskClass(data.access_risk)}">${data.access_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Approval Process</strong></td>
        <td>${data.approval_status}</td>
        <td><span class="risk-${getRiskClass(data.approval_risk)}">${data.approval_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Detection Capability</strong></td>
        <td>${data.detection_status}</td>
        <td><span class="risk-${getRiskClass(data.detection_risk)}">${data.detection_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Policy & Guidance</strong></td>
        <td>${data.policy_status}</td>
        <td><span class="risk-${getRiskClass(data.policy_risk)}">${data.policy_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Staff Training</strong></td>
        <td>${data.training_status}</td>
        <td><span class="risk-${getRiskClass(data.training_risk)}">${data.training_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Data Exposure Risk</strong></td>
        <td>${data.exposure_status}</td>
        <td><span class="risk-${getRiskClass(data.exposure_risk)}">${data.exposure_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Accountability (Trace)</strong></td>
        <td>${data.traceability_status}</td>
        <td><span class="risk-${getRiskClass(data.traceability_risk)}">${data.traceability_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Compliance Awareness</strong></td>
        <td>${data.compliance_status}</td>
        <td><span class="risk-${getRiskClass(data.compliance_risk)}">${data.compliance_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Previous Incidents</strong></td>
        <td>${data.incidents_status}</td>
        <td><span class="risk-${getRiskClass(data.incidents_risk)}">${data.incidents_risk}</span></td>
      </tr>
    </tbody>
  </table>

  <h2>What Each Area Means for Your Organisation</h2>

  <div class="area-section">
    <h3>AI Tool Access</h3>
    <p>Without approved AI tools, staff find their own solutions. The gap between AI demand and approved supply is where Shadow AI thrives - every team without proper tools is likely using personal ChatGPT, putting data and IP at risk invisibly.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.access_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Approval Process</h3>
    <p>Clear approval processes prevent fragmented tool selection. Without defined pathways, staff ask forgiveness not permission - Shadow AI fills the gap when governance is slow or unclear, creating uneven risk across teams.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.approval_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Usage Visibility & Detection</h3>
    <p>Shadow AI spreads invisibly. Without knowing what tools are being used or having detection capability, you're flying blind - unable to manage risk, ensure compliance, or guide safe usage until an incident forces discovery.</p>
    <div class="explanation-box">
      <strong>What you told us about visibility:</strong> ${data.usage_blurb || data.detection_blurb}
    </div>
    <div class="explanation-box">
      <strong>What you told us about detection:</strong> ${data.detection_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Policy & Training Foundation</h3>
    <p>Policy sets boundaries, training builds capability. Without both working together, staff either guess the rules or stay silent. Clear policy with proper training prevents Shadow AI from filling the gaps.</p>
    <div class="explanation-box">
      <strong>Your policy status:</strong> ${data.policy_blurb}
    </div>
    <div class="explanation-box">
      <strong>Your training approach:</strong> ${data.training_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Data Exposure & Accountability</h3>
    <p>Once data enters public AI tools, you can't get it back. Without traceability, you can't answer the critical questions: Did AI touch this data? Can we prove what happened when clients or regulators ask?</p>
    <div class="explanation-box">
      <strong>Data exposure status:</strong> ${data.exposure_blurb}
    </div>
    <div class="explanation-box">
      <strong>Traceability capability:</strong> ${data.traceability_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Compliance Awareness</h3>
    <p>AI tools processing customer or staff data trigger NZ Privacy Act obligations, even for small experiments. Ignorance isn't a defence. Unintentional breaches still bring penalties, regulatory scrutiny, and reputational damage.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.compliance_blurb}
    </div>
  </div>

  <div class="score-section">
    <h2>Your Shadow AI Risk Profile</h2>
    ${data.incident_banner ? `<div class="critical-banner">${data.incident_banner}</div>` : ''}
    <div class="score-display score-${scoreClass}">Your Shadow AI Risk Score: ${scoreNum}/100</div>
    <div style="margin-top: var(--space-lg); text-align: left;">
      <p style="margin-bottom: var(--space-sm);"><strong>Where you stand today:</strong> <span style="color: ${data.maturity_label === 'Ad Hoc' || data.maturity_label === 'Unmanaged' ? 'var(--risk-high)' : 'inherit'}; font-weight: 700;">${data.maturity_label}</span></p>
      <p style="margin-bottom: var(--space-md);"><strong>What this means:</strong> ${maturityDescription}${data.maturity_label === 'Ad Hoc' || data.maturity_label === 'Unmanaged' ? ' <span style="color: var(--risk-high); font-weight: 700;">Immediate action is recommended.</span>' : ''}</p>
    </div>
  </div>

  <div class="next-steps">
    <h2>Your Next Steps: From Shadow to Strategy</h2>

    <h3>Core Foundations</h3>
    <ul>
      <li><strong>Clear ownership</strong> - Someone must be accountable for AI strategy and risk</li>
      <li><strong>Visible guidelines</strong> - Staff need to know what's approved and what's not</li>
      <li><strong>Regular review</strong> - AI tools and risks evolve monthly, governance must keep pace</li>
      <li><strong>Staff capability</strong> - Training and support turn policy into practice</li>
    </ul>

    <p style="margin-top: var(--space-lg);">Your organisation shows '<strong>${data.maturity_label}</strong>' AI use, which is ${data.maturity_label === 'Ad Hoc' ? 'opening you up to exposure and leaking competitive potential' : data.maturity_label === 'Unmanaged' ? 'creating significant risk exposure across your entire organisation' : data.maturity_label === 'Developing' ? 'showing progress but still leaving gaps that need to be closed' : 'positioning you well for the future'}.</p>

    <div class="explanation-box" style="margin-top: var(--space-md);">
      <strong>Previous Incidents:</strong> ${data.incidents_blurb}
    </div>

    <p style="margin-top: var(--space-lg); font-weight: 600;">Here's what we recommend to help you seal the cracks and start the gains.</p>
  </div>

  <div class="cta-section">
    <h2>Ready to Take the Next Step?</h2>
    <p style="font-size: var(--font-size-base); margin-bottom: var(--space-xl);">Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

    <div class="cta-links">
      <a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA" class="cta-link">Book Your Free Consultation</a>
    </div>
  </div>

  <p style="text-align: center; margin: var(--space-lg) 0; font-weight: 600; color: var(--text-heading);">
    Culture moves first. AI adoption only succeeds when your people are ready before your tools. GenerationAI specialises in helping organisations build the foundation for safe, strategic AI adoption that drives real business value.
  </p>

  <div class="footer">
    <h3>Important Disclaimers</h3>
    <p>This assessment is based on information provided during completion and represents a point-in-time snapshot of your organisation's Shadow AI risk profile. Results depend on the accuracy and completeness of responses provided.</p>

    <p>GenerationAI cannot assess risks or activities not disclosed during the diagnostic process. This diagnostic is designed to build awareness and guide strategic thinking about AI readiness and risk management.</p>

    <p>This report does not constitute legal, compliance or technical advice. Organisations should seek appropriate professional guidance for specific legal, regulatory or technical requirements. GenerationAI helps NZ organisations build AI capability through proven frameworks, practical tools and strategic guidance.</p>

    <div class="tagline">
      We specialise in moving businesses from AI exposure to AI advantage.
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getMaturityClass(maturity: string): string {
  const lower = maturity.toLowerCase();
  if (lower.includes('unmanaged')) return 'unmanaged';
  if (lower.includes('ad hoc') || lower.includes('adhoc')) return 'adhoc';
  if (lower.includes('developing')) return 'developing';
  if (lower.includes('managed')) return 'managed';
  return 'unmanaged';
}

function getScoreClass(score: number): string {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

function getMaturityDescription(maturity: string): string {
  const lower = maturity.toLowerCase();
  if (lower.includes('unmanaged')) {
    return 'Your organisation has little to no AI governance in place. There is high risk exposure from unauthorised AI usage.';
  }
  if (lower.includes('managed')) {
    return 'Your organisation demonstrates strong AI governance practices with formal policies, training, and technical controls in place. Focus on continuous improvement and staying ahead of emerging risks.';
  }
  if (lower.includes('developing')) {
    return 'Your organisation has foundational AI governance elements but gaps remain. You have some policies and awareness, but need more comprehensive controls and processes.';
  }
  if (lower.includes('ad hoc') || lower.includes('adhoc')) {
    return 'Your organisation has minimal AI governance. AI usage is largely unmanaged and exposed, with significant gaps in policy, visibility, and controls.';
  }
  return 'Your organisation has little to no AI governance in place. There is high risk exposure from unauthorised AI usage.';
}

/**
 * Helper function to get background color based on score (0-5)
 * Traffic Light System: Green = Good, Amber = Caution, Red = Critical
 */
function getScoreBackgroundStyle(score: number): string {
  if (score === 5) return 'background: #D1FAE5; border: 2px solid #10B981;'; // Dark Green - Excellent
  if (score === 4) return 'background: #ECFDF5; border: 2px solid #6EE7B7;'; // Light Green - Good
  if (score === 3) return 'background: #FEF3C7; border: 2px solid #FCD34D;'; // Yellow/Amber - Moderate
  if (score === 2) return 'background: #FED7AA; border: 2px solid #FB923C;'; // Orange - Needs Attention
  if (score <= 1) return 'background: #FEE2E2; border: 2px solid #EF4444;'; // Red - Critical
  return 'background: #FEF3C7; border: 2px solid #FCD34D;'; // Default to moderate
}

/**
 * Business AI Readiness Assessment HTML Template
 */
function generateBusinessReadinessHTML(data: any): string {
  const scoreNum = parseInt(data.readiness_score) || 0;
  const readinessClass = getReadinessClass(data.readiness_band);

  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business AI Readiness Report - ${data.company_name}</title>
  <style>
    /* ============================================
       GENERATIONAI BRAND DESIGN SYSTEM
       Business AI Readiness Report Template
       ============================================ */

    :root {
      /* Brand Colours */
      --primary-blue: #2563EB;
      --dark-navy: #0F172A;
      --lime-accent: #D4FF00;
      --text-body: #6B7280;
      --text-heading: #0F172A;
      --border-light: #E5E7EB;
      --bg-light: #F9FAFB;
      --white: #FFFFFF;

      /* Status Colours */
      --risk-high: #DC2626;
      --risk-high-bg: #FEE2E2;
      --risk-medium: #F59E0B;
      --risk-medium-bg: #FEF3C7;
      --risk-low: #10B981;
      --risk-low-bg: #D1FAE5;
      --info-blue-bg: #EFF6FF;

      /* Spacing System - 8px Grid */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 12px;
      --space-lg: 16px;
      --space-xl: 20px;
      --space-2xl: 24px;
      --space-3xl: 32px;

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      --font-size-xs: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 2rem;
      --line-height: 1.6;
      --line-height-tight: 1.2;

      /* Design Properties */
      --radius: 8px;
      --radius-lg: 12px;
      --border-width: 1px;
    }

    @page { size: A4; margin: 1.5cm; }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      color: var(--text-body);
      background: var(--white);
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-md);
    }

    h1, h2, h3, h4 {
      color: var(--text-heading);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    h1 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 3px solid var(--primary-blue);
    }

    h2 {
      font-size: var(--font-size-2xl);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
    }

    h3 {
      font-size: var(--font-size-xl);
      margin-top: var(--space-md);
      margin-bottom: var(--space-sm);
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
    }

    h4 {
      font-size: var(--font-size-lg);
      margin-top: var(--space-sm);
      margin-bottom: var(--space-xs);
    }

    p { margin-bottom: var(--space-sm); }
    strong { font-weight: 600; color: var(--text-heading); }

    .report-header {
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .report-header img {
      height: 50px;
      width: auto;
      margin-bottom: var(--space-md);
    }

    .report-meta {
      font-size: var(--font-size-base);
      color: var(--text-body);
      line-height: 1.8;
    }

    .introduction {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
      border: 1px solid var(--border-light);
    }

    .introduction h2 {
      margin-top: 0;
      color: var(--text-heading);
      border-bottom: none;
      padding-bottom: 0;
    }

    /* Score Section */
    .score-section {
      text-align: center;
      margin: var(--space-xl) 0;
      padding: var(--space-2xl);
      background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
      border-radius: var(--radius-lg);
      border: 2px solid var(--primary-blue);
    }

    .score-section h2 {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: var(--space-md);
    }

    .score-label {
      font-size: var(--font-size-lg);
      color: var(--text-body);
      margin-bottom: var(--space-sm);
    }

    .score-display {
      font-size: 60px;
      font-weight: 700;
      margin: var(--space-md) 0;
      line-height: 1;
    }

    .score-high {
      color: var(--risk-high);
    }

    .score-medium {
      color: var(--risk-medium);
    }

    .score-low {
      color: var(--risk-low);
    }

    .maturity-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border-radius: 20px;
      font-weight: 600;
      margin-top: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .maturity-blind {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .maturity-reactive {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
    }

    .maturity-building {
      background: #E0E7FF;
      color: var(--primary-blue);
    }

    .maturity-advanced {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    /* Legacy maturity classes for other assessments */
    .maturity-unmanaged {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .maturity-adhoc {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
    }

    .maturity-developing {
      background: #E0E7FF;
      color: var(--primary-blue);
    }

    .maturity-managed {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    /* Area Sections */
    .area-section {
      margin: var(--space-lg) 0;
      padding: var(--space-md);
      background: var(--white);
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .area-section h3 {
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .explanation-box {
      background: #EFF6FF;
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
    }

    .insight-box {
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .gap-section {
      background: var(--white);
      padding: var(--space-md);
      margin: var(--space-lg) 0;
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .gap-section h3 {
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .cta-section {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      margin: var(--space-xl) 0;
      border: 2px solid var(--primary-blue);
      text-align: center;
      page-break-inside: avoid;
    }

    .cta-section h3 {
      color: var(--primary-blue);
      font-size: var(--font-size-xl);
      margin-top: 0;
      margin-bottom: var(--space-md);
      border-bottom: none;
      padding-bottom: 0;
      font-weight: 700;
    }

    .cta-section p {
      color: var(--text-heading);
      margin-bottom: var(--space-md);
      font-size: var(--font-size-base);
    }

    .cta-link {
      display: inline-block;
      padding: 14px 32px;
      background: var(--primary-blue);
      color: var(--white);
      text-decoration: none;
      border-radius: var(--radius);
      font-weight: 700;
      font-size: var(--font-size-base);
      transition: background 0.2s ease;
    }

    .cta-link:hover {
      background: #1D4ED8;
    }

    /* Footer */
    .footer {
      margin-top: var(--space-2xl);
      padding-top: var(--space-lg);
      border-top: 2px solid var(--border-light);
      font-size: var(--font-size-xs);
      color: var(--text-body);
    }

    .footer h3 {
      font-size: var(--font-size-base);
      color: var(--text-heading);
      margin-bottom: var(--space-sm);
    }

    .tagline {
      margin-top: var(--space-lg);
      text-align: center;
      padding: var(--space-md);
      background: var(--bg-light);
      border-radius: var(--radius);
      font-style: italic;
      color: var(--text-body);
    }

    @media print {
      body { padding: 0; }
      .insight-box, .gap-section, .score-box, .cta-box { page-break-inside: avoid; }
      h2, h3, h4 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <a href="https://www.generationai.co.nz" target="_blank" style="display: inline-block; margin-bottom: var(--space-md);">
      <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
           alt="GenerationAI"
           style="cursor: pointer;">
    </a>
    <h1>Business AI Readiness Diagnostic Report</h1>
    <div class="report-meta">
      <strong>Prepared for:</strong> ${data.company_name}<br>
      <strong>Assessment Completed By:</strong> ${data.contact_name}<br>
      <strong>Date:</strong> ${assessmentDate}
    </div>
  </div>

  <div class="score-section">
    <div class="score-label">Your Business AI Readiness Score</div>
    <div class="score-display" style="color: var(--primary-blue);">${scoreNum}/100</div>
    <div class="maturity-badge maturity-${readinessClass}">${data.readiness_band}</div>
  </div>

  <!-- Tension Line - Immediately after score for impact -->
  <div style="background: #EFF6FF; border: 1px solid #DBEAFE; padding: var(--space-lg); border-radius: var(--radius-lg); margin: var(--space-lg) auto; font-weight: 600; color: var(--text-heading); text-align: center; max-width: 700px;">
    ${data.tension_line || ''}
  </div>

  <!-- AI Readiness Playbook Section -->
  <div style="background: white; border: 1px solid #E5E7EB; border-radius: var(--radius-lg); padding: var(--space-xl); margin: var(--space-xl) auto; max-width: 800px;">
    <h2 style="text-align: center; margin-bottom: var(--space-md);">The AI Readiness Playbook</h2>
    <p style="text-align: center; margin-bottom: var(--space-xl); color: var(--text-body);">
      From our work with dozens of New Zealand businesses, successful AI adoption always follows this pattern:
    </p>

    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); align-items: flex-start;">
        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #0066CC; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">1</div>
        <div>
          <h3 style="color: #0066CC; margin: 0 0 var(--space-xs) 0; font-size: 1.1rem;">Leadership Readiness</h3>
          <p style="margin: 0; color: var(--text-body); font-size: 0.95rem;">Upskill your leaders first, they can't lead AI if they don't understand it. AI is not an IT project. It needs to be led from the top with clear messaging that builds trust.</p>
        </div>
      </div>

      <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); align-items: flex-start;">
        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #0066CC; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">2</div>
        <div>
          <h3 style="color: #0066CC; margin: 0 0 var(--space-xs) 0; font-size: 1.1rem;">Discovery & Transparency</h3>
          <p style="margin: 0; color: var(--text-body); font-size: 0.95rem;">Find out what's happening. Talk to your people. Uncover Shadow AI before it becomes a problem. You can't manage what you can't see.</p>
        </div>
      </div>

      <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); align-items: flex-start;">
        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #0066CC; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">3</div>
        <div>
          <h3 style="color: #0066CC; margin: 0 0 var(--space-xs) 0; font-size: 1.1rem;">Guardrails & Governance</h3>
          <p style="margin: 0; color: var(--text-body); font-size: 0.95rem;">Put basic policies in place that enable safe use. Treat AI like health and safety: practical controls, not prohibition. Define what's safe and what's not.</p>
        </div>
      </div>

      <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); align-items: flex-start;">
        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #0066CC; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">4</div>
        <div>
          <h3 style="color: #0066CC; margin: 0 0 var(--space-xs) 0; font-size: 1.1rem;">Capability Building</h3>
          <p style="margin: 0; color: var(--text-body); font-size: 0.95rem;">Identify champions. Build skills across your people so they can use AI safely and effectively.</p>
        </div>
      </div>

      <div style="display: flex; gap: var(--space-md); align-items: flex-start;">
        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: #0066CC; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">5</div>
        <div>
          <h3 style="color: #0066CC; margin: 0 0 var(--space-xs) 0; font-size: 1.1rem;">Strategy & Execution</h3>
          <p style="margin: 0; color: var(--text-body); font-size: 0.95rem;">Start with small pilots that solve real problems and deliver ROI. Build the foundation before you scale. Develop a digital strategy that aligns AI to business goals and customer value.</p>
        </div>
      </div>
    </div>
  </div>

  <h2>Your Assessment Breakdown</h2>
  <p>Here's what your responses tell us about your current AI readiness position.</p>

  <!-- Category 1: Leadership & Strategy -->
  <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid var(--primary-blue); padding: var(--space-md) var(--space-lg); margin: var(--space-2xl) 0 var(--space-lg) 0; border-radius: var(--radius);">
    <h3 style="margin: 0; color: var(--primary-blue); font-size: 1.25rem; font-weight: 700; border-bottom: none; padding-bottom: 0;">Leadership & Strategy</h3>
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q1: Leadership & Ownership</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q1_score || 0)}">
    <strong>What you told us:</strong> ${data.q1_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q1_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q2: AI in Strategic Planning</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q2_score || 0)}">
    <strong>What you told us:</strong> ${data.q2_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q2_interpretation_blurb}
  </div>

  <!-- Category 2: Culture & Capability -->
  <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid var(--primary-blue); padding: var(--space-md) var(--space-lg); margin: var(--space-2xl) 0 var(--space-lg) 0; border-radius: var(--radius);">
    <h3 style="margin: 0; color: var(--primary-blue); font-size: 1.25rem; font-weight: 700; border-bottom: none; padding-bottom: 0;">Culture & Capability</h3>
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q3: Cultural Readiness</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q3_score || 0)}">
    <strong>What you told us:</strong> ${data.q3_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q3_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q4: Staff Enablement & Training</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q4_score || 0)}">
    <strong>What you told us:</strong> ${data.q4_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q4_interpretation_blurb}
  </div>

  <!-- Category 3: Governance & Risk -->
  <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid var(--primary-blue); padding: var(--space-md) var(--space-lg); margin: var(--space-2xl) 0 var(--space-lg) 0; border-radius: var(--radius);">
    <h3 style="margin: 0; color: var(--primary-blue); font-size: 1.25rem; font-weight: 700; border-bottom: none; padding-bottom: 0;">Governance & Risk</h3>
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q5: Shadow AI Exposure</h3>
  <p style="margin-bottom: var(--space-sm);">Shadow AI means staff using unapproved AI tools (like ChatGPT, Gemini or Claude) without oversight.</p>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q5_score || 0)}">
    <strong>What you told us:</strong> ${data.q5_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q5_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q6: Governance Framework</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q6_score || 0)}">
    <strong>What you told us:</strong> ${data.q6_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q6_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q7: Legal & Compliance Confidence</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q7_score || 0)}">
    <strong>What you told us:</strong> ${data.q7_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q7_interpretation_blurb}
  </div>

  <!-- Category 4: Execution Readiness -->
  <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid var(--primary-blue); padding: var(--space-md) var(--space-lg); margin: var(--space-2xl) 0 var(--space-lg) 0; border-radius: var(--radius);">
    <h3 style="margin: 0; color: var(--primary-blue); font-size: 1.25rem; font-weight: 700; border-bottom: none; padding-bottom: 0;">Execution Readiness</h3>
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q8: Resource Allocation</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q8_score || 0)}">
    <strong>What you told us:</strong> ${data.q8_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q8_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q9: Data Protection Confidence</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q9_score || 0)}">
    <strong>What you told us:</strong> ${data.q9_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q9_interpretation_blurb}
  </div>

  <h3 style="font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-md); border-bottom: none; padding-bottom: 0;">Q10: Opportunity Understanding</h3>
  <div class="insight-box" style="${getScoreBackgroundStyle(data.q10_score || 0)}">
    <strong>What you told us:</strong> ${data.q10_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q10_interpretation_blurb}
  </div>

  ${(() => {
    // Check if there are any real gaps (not placeholder text)
    const hasGap1 = data.gap_1_title && data.gap_1_description && 
                    data.gap_1_title !== 'No significant gaps identified' &&
                    data.gap_1_title !== 'Continue current progress' &&
                    data.gap_1_title !== 'Maintain momentum';
    const hasGap2 = data.gap_2_title && data.gap_2_description &&
                    data.gap_2_title !== 'No significant gaps identified' &&
                    data.gap_2_title !== 'Continue current progress' &&
                    data.gap_2_title !== 'Maintain momentum';
    const hasGap3 = data.gap_3_title && data.gap_3_description &&
                    data.gap_3_title !== 'No significant gaps identified' &&
                    data.gap_3_title !== 'Continue current progress' &&
                    data.gap_3_title !== 'Maintain momentum';
    
    if (!hasGap1 && !hasGap2 && !hasGap3) {
      return ''; // No gaps to display
    }
    
    return `
  <h2>Your Top 3 Priority Areas</h2>
  <p>Based on your responses, these are the areas that need immediate attention.</p>

  ${hasGap1 ? `<div class="gap-section">
    <h3>${data.gap_1_title}</h3>
    <p style="color: var(--text-body); margin-bottom: var(--space-md);">${data.gap_1_description}</p>
    ${data.gap_1_recommendation ? `<p style="font-weight: 600; color: var(--primary-blue); margin-top: var(--space-sm); padding: var(--space-md); border-left: 3px solid var(--primary-blue); font-style: italic; background: #EFF6FF; border-radius: var(--radius-md);">${data.gap_1_recommendation}</p>` : ''}
  </div>` : ''}

  ${hasGap2 ? `<div class="gap-section">
    <h3>${data.gap_2_title}</h3>
    <p style="color: var(--text-body); margin-bottom: var(--space-md);">${data.gap_2_description}</p>
    ${data.gap_2_recommendation ? `<p style="font-weight: 600; color: var(--primary-blue); margin-top: var(--space-sm); padding: var(--space-md); border-left: 3px solid var(--primary-blue); font-style: italic; background: #EFF6FF; border-radius: var(--radius-md);">${data.gap_2_recommendation}</p>` : ''}
  </div>` : ''}

  ${hasGap3 ? `<div class="gap-section">
    <h3>${data.gap_3_title}</h3>
    <p style="color: var(--text-body); margin-bottom: var(--space-md);">${data.gap_3_description}</p>
    ${data.gap_3_recommendation ? `<p style="font-weight: 600; color: var(--primary-blue); margin-top: var(--space-sm); padding: var(--space-md); border-left: 3px solid var(--primary-blue); font-style: italic; background: #EFF6FF; border-radius: var(--radius-md);">${data.gap_3_recommendation}</p>` : ''}
  </div>` : ''}

  <p style="margin-top: var(--space-md);"><em>${data.gap_summary_blurb}</em></p>

  <p style="margin-top: var(--space-xl); font-weight: 600; color: var(--text-heading); text-align: center;">These recommendations map directly to the GEN5™ framework: the five essential elements every business needs to move from AI exposure to AI advantage.</p>
    `;
  })()}

  <h2>NEXT STEP: BOOK YOUR 20-MINUTE DISCOVERY CALL</h2>

  <div class="cta-section">
    <p style="font-size: var(--font-size-base); margin-bottom: var(--space-md);">We'll help you make sense of these results and show you exactly where to start.</p>
    
    <ul style="list-style: none; padding: 0; margin: var(--space-lg) 0; text-align: left;">
      <li style="padding: var(--space-xs) 0; padding-left: var(--space-xl); position: relative;">
        <span style="position: absolute; left: 0; color: var(--primary-blue); font-weight: 700;">✓</span>
        Review your results together and answer any questions
      </li>
      <li style="padding: var(--space-xs) 0; padding-left: var(--space-xl); position: relative;">
        <span style="position: absolute; left: 0; color: var(--primary-blue); font-weight: 700;">✓</span>
        Show you the roadmap that fits your business
      </li>
      <li style="padding: var(--space-xs) 0; padding-left: var(--space-xl); position: relative;">
        <span style="position: absolute; left: 0; color: var(--primary-blue); font-weight: 700;">✓</span>
        Recommend your first move (whether you work with us or not)
      </li>
    </ul>

    <p style="font-style: italic; margin-top: var(--space-lg);">You'll walk away with a clear next action, whether you work with us or not.</p>
    
    <p style="margin-top: var(--space-lg);"><a href="https://share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA7bboe8" class="cta-link">Book Your Discovery Call</a></p>
  </div>

  <!-- Knowledge Hub CTA -->
  <div style="background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border: 1px solid var(--border-light); padding: var(--space-2xl); border-radius: var(--radius-lg); margin: var(--space-xl) auto; text-align: center; max-width: 800px;">
    <h2 style="border-bottom: none; padding-bottom: 0; margin-bottom: var(--space-md); font-size: 1.75rem;">Explore Our Knowledge Hub</h2>

    <p style="color: var(--text-body); font-size: 1.125rem; margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
      Backed by decades of governance, strategy and advisory experience, GenerationAI's Knowledge Hub gives leaders the insights they need to stay ahead.
    </p>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); margin: var(--space-xl) auto; max-width: 700px;">
      <div style="text-align: center;">
        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-heading); margin-bottom: var(--space-xs); border-bottom: none; padding-bottom: 0;">AI Knowledge Videos</h3>
        <p style="font-size: 0.875rem; color: var(--text-body); margin: 0;">Real examples and expert advice</p>
      </div>

      <div style="text-align: center;">
        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-heading); margin-bottom: var(--space-xs); border-bottom: none; padding-bottom: 0;">Insight Articles</h3>
        <p style="font-size: 0.875rem; color: var(--text-body); margin: 0;">Latest research and strategies</p>
      </div>

      <div style="text-align: center;">
        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-heading); margin-bottom: var(--space-xs); border-bottom: none; padding-bottom: 0;">Free Toolkits</h3>
        <p style="font-size: 0.875rem; color: var(--text-body); margin: 0;">Downloadable guides and frameworks</p>
      </div>
    </div>

    <p style="margin-top: var(--space-lg);"><a href="https://www.generationai.co.nz/knowledge-hub" class="cta-link" style="background: var(--primary-blue); color: var(--white);">Explore Resources & Learn More →</a></p>
  </div>

  <p style="text-align: center; margin: var(--space-xl) auto; color: var(--text-body); font-size: var(--font-size-base); line-height: 1.6; max-width: 700px;">
    Most businesses that start here see measurable improvement within 90 days: tighter governance, safer experimentation, and clearer ROI.
  </p>

  <div class="footer" style="text-align: center; padding: var(--space-xl) 0; border-top: 2px solid var(--border-light); color: var(--text-body); font-size: var(--font-size-xs); line-height: 1.6;">
    <p style="margin: 0 0 var(--space-sm) 0; font-style: italic;">
      This report is confidential and prepared exclusively for <strong style="color: var(--text-heading);">${data.company_name}</strong>.
    </p>
    <p style="margin: var(--space-sm) 0; font-size: 0.8125rem;">
      This assessment does not constitute legal, compliance, or professional advice.
    </p>
    <p style="margin: var(--space-sm) 0; font-size: 0.8125rem; color: #9CA3AF;">
      © 2025 GenerationAI. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}

function getReadinessClass(band: string): string {
  const lower = (band || '').toLowerCase();
  if (lower.includes('advanced')) return 'advanced';
  if (lower.includes('building')) return 'building';
  if (lower.includes('reactive')) return 'reactive';
  if (lower.includes('blind')) return 'blind';
  return 'reactive';
}

/**
 * Board AI Governance Diagnostic HTML Template
 */
function generateBoardGovernanceHTML(data: any): string {
  const scoreNum = parseInt(data.governance_score) || 0;
  const governanceClass = getGovernanceClass(data.band_name);
  const scoreClass = getGovernanceScoreClass(scoreNum);

  // Helper to convert risk level to CSS class
  const getRiskClass = (risk: string): string => {
    const lower = (risk || '').toLowerCase();
    if (lower.includes('critical')) return 'critical';
    if (lower.includes('high')) return 'high';
    if (lower.includes('medium') || lower.includes('moderate')) return 'medium';
    return 'low';
  };

  // Use response_date or generate current date
  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Board AI Governance Diagnostic Report - ${data.company_name}</title>
  <style>
    /* ============================================
       GENERATIONAI BRAND DESIGN SYSTEM
       Board Governance Report Template
       ============================================ */

    :root {
      /* Brand Colours */
      --primary-blue: #2563EB;
      --dark-navy: #0F172A;
      --lime-accent: #D4FF00;
      --text-body: #6B7280;
      --text-heading: #0F172A;
      --border-light: #E5E7EB;
      --bg-light: #F9FAFB;
      --white: #FFFFFF;

      /* Risk Colours */
      --risk-critical: #DC2626;
      --risk-critical-bg: #FEE2E2;
      --risk-high: #DC2626;
      --risk-high-bg: #FEE2E2;
      --risk-medium: #F59E0B;
      --risk-medium-bg: #FEF3C7;
      --risk-low: #10B981;
      --risk-low-bg: #D1FAE5;

      /* Spacing System - 8px Grid */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 12px;
      --space-lg: 16px;
      --space-xl: 20px;
      --space-2xl: 24px;
      --space-3xl: 32px;

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      --font-size-xs: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 2rem;
      --line-height: 1.6;
      --line-height-tight: 1.2;

      /* Design Properties */
      --radius: 8px;
      --radius-lg: 12px;
      --border-width: 1px;
    }

    /* Page setup for PDF */
    @page {
      size: A4;
      margin: 1.5cm;
    }

    /* Base Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      color: var(--text-body);
      background: var(--white);
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-md);
    }

    /* Typography */
    h1, h2, h3, h4 {
      color: var(--text-heading);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    h1 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 3px solid var(--primary-blue);
    }

    h2 {
      font-size: var(--font-size-2xl);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
    }

    h3 {
      font-size: var(--font-size-xl);
      margin-top: var(--space-md);
      margin-bottom: var(--space-sm);
    }

    h4 {
      font-size: var(--font-size-lg);
      margin-top: var(--space-sm);
      margin-bottom: var(--space-xs);
    }

    p {
      margin-bottom: var(--space-sm);
    }

    strong {
      font-weight: 600;
      color: var(--text-heading);
    }

    /* Header */
    .report-header {
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .report-header img {
      height: 50px;
      width: auto;
      margin-bottom: var(--space-md);
    }

    .report-meta {
      font-size: var(--font-size-base);
      color: var(--text-body);
      line-height: 1.8;
    }

    /* Introduction Box */
    .introduction {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
      border: 1px solid var(--border-light);
    }

    .introduction h2 {
      margin-top: 0;
      color: var(--text-heading);
    }

    /* Context Box */
    .context-box {
      background: var(--bg-light);
      padding: var(--space-md);
      border-radius: var(--radius);
      margin: var(--space-md) 0;
      border: var(--border-width) solid var(--border-light);
    }

    /* Risk Table */
    .risk-table {
      width: 100%;
      border-collapse: collapse;
      margin: var(--space-lg) 0;
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .risk-table thead {
      background: var(--dark-navy);
      color: var(--white);
    }

    .risk-table th {
      padding: var(--space-sm);
      text-align: left;
      font-weight: 700;
      font-size: var(--font-size-base);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .risk-table td {
      padding: var(--space-sm);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .risk-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Risk Badges */
    .risk-critical {
      background: var(--risk-critical-bg);
      color: var(--risk-critical);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    .risk-high {
      background: var(--risk-high-bg);
      color: var(--risk-high);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    .risk-medium {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    .risk-low {
      background: var(--risk-low-bg);
      color: var(--risk-low);
      padding: 4px 12px;
      border-radius: var(--radius);
      font-weight: 600;
      display: inline-block;
      font-size: var(--font-size-xs);
    }

    /* Score Section */
    .score-section {
      text-align: center;
      margin: var(--space-lg) 0;
      padding: var(--space-lg);
      background: var(--bg-light);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }

    .score-display {
      font-size: 32px;
      font-weight: 700;
      margin: var(--space-md) 0;
    }

    .score-high {
      color: var(--risk-high);
    }

    .score-medium {
      color: var(--risk-medium);
    }

    .score-low {
      color: var(--risk-low);
    }

    .maturity-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border-radius: 20px;
      font-weight: 600;
      margin-top: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .maturity-weak {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .maturity-emerging {
      background: var(--risk-medium-bg);
      color: var(--risk-medium);
    }

    .maturity-developing {
      background: #E0E7FF;
      color: var(--primary-blue);
    }

    .maturity-mature {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    /* Area Sections */
    .area-section {
      margin: var(--space-lg) 0;
      padding: var(--space-md);
      background: var(--white);
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .area-section h3 {
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .explanation-box {
      background: #EFF6FF;
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
    }

    /* Next Steps */
    .next-steps {
      background: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      border: 1px solid var(--border-light);
    }

    .next-steps h2 {
      margin-top: 0;
      color: var(--text-heading);
    }

    .next-steps ul {
      margin-left: var(--space-lg);
      margin-top: var(--space-sm);
    }

    .next-steps li {
      margin-bottom: var(--space-xs);
      color: var(--text-body);
    }

    /* CTA Section */
    .cta-section {
      background: var(--white);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      text-align: center;
      border: 1px solid var(--border-light);
    }

    .cta-section h2 {
      color: var(--text-heading);
      margin-top: 0;
      margin-bottom: var(--space-lg);
    }

    .cta-section h3 {
      color: var(--primary-blue);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .cta-section p {
      color: var(--text-body);
      margin-bottom: var(--space-md);
    }

    .cta-box {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius);
      margin: var(--space-md) 0;
      border: 1px solid var(--border-light);
    }

    .cta-links {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      margin-top: var(--space-md);
    }

    .cta-link {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary-blue);
      color: var(--white);
      text-decoration: none;
      border-radius: var(--radius);
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .cta-link:hover {
      background: #1D4ED8;
    }

    .cta-link--secondary {
      background: var(--white);
      color: var(--primary-blue);
      border: 2px solid var(--primary-blue);
    }

    .cta-link--secondary:hover {
      background: var(--bg-light);
    }

    /* Footer */
    .footer {
      margin-top: var(--space-2xl);
      padding-top: var(--space-lg);
      border-top: 2px solid var(--border-light);
      font-size: var(--font-size-xs);
      color: var(--text-body);
    }

    .footer h3 {
      font-size: var(--font-size-base);
      color: var(--text-heading);
      margin-bottom: var(--space-sm);
    }

    .tagline {
      margin-top: var(--space-lg);
      text-align: center;
      padding: var(--space-md);
      background: var(--bg-light);
      border-radius: var(--radius);
      font-style: italic;
      color: var(--text-body);
    }

    ul {
      margin-left: var(--space-lg);
    }

    li {
      margin-bottom: var(--space-xs);
    }

    /* Responsive */
    @media print {
      body {
        padding: 0;
      }

      /* Enhanced page break control */
      .introduction,
      .context-box,
      .area-section,
      .score-section,
      .next-steps,
      .cta-section,
      .footer {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .explanation-box {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .risk-table {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Ensure content doesn't break awkwardly */
      h2, h3, h4 {
        page-break-after: avoid;
        break-after: avoid;
      }

      p {
        orphans: 3;
        widows: 3;
      }

      /* Force page breaks before major sections if needed */
      .score-section {
        page-break-before: auto;
      }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
         alt="GenerationAI">
    <h1>Board AI Governance Diagnostic Report</h1>
    <div class="report-meta">
      <strong>Prepared for:</strong> ${data.company_name}<br>
      <strong>Assessment Completed By:</strong> ${data.contact_name}
    </div>
  </div>

  <div class="introduction">
    <h2>Board Accountability for AI Governance</h2>
    <p>AI governance is now a board-level responsibility. Directors are accountable for demonstrating reasonable oversight of AI risks, opportunities, and strategic implications. "We didn't understand it" is not a defence when AI systems cause material harm, compliance breaches, or reputational damage.</p>

    <p>This diagnostic assesses your board's capability across 13 critical governance areas: from risk awareness and strategic integration to incident preparedness and stakeholder accountability. It reveals where your board demonstrates strong oversight and where urgent action is required.</p>

    <p>This report surfaces governance gaps and provides clear next steps to move from reactive oversight to proactive, defensible AI governance.</p>
  </div>

  <div class="context-box">
    As a <strong>${data.company_name}</strong> board completing this governance diagnostic, your AI oversight maturity has been assessed based on current practices, accountability structures, and risk management capabilities.
  </div>

  <div class="score-section">
    <h2>Your Board's Governance Maturity</h2>
    <div class="score-display score-${scoreClass}">Board Governance Score: ${scoreNum}/100</div>
    <div class="maturity-badge maturity-${governanceClass}">${data.band_name}</div>
    <p style="margin-top: var(--space-md);">${data.band_narrative}</p>
  </div>

  <h2>Board AI Governance Assessment</h2>

  <table class="risk-table">
    <thead>
      <tr>
        <th>Governance Area</th>
        <th>Status</th>
        <th>Risk Level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Board Risk Awareness</strong></td>
        <td>${data.q1_board_risk_status}</td>
        <td><span class="risk-${getRiskClass(data.q1_board_risk_risk)}">${data.q1_board_risk_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Oversight & Accountability</strong></td>
        <td>${data.q2_oversight_status}</td>
        <td><span class="risk-${getRiskClass(data.q2_oversight_risk)}">${data.q2_oversight_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Risk Appetite</strong></td>
        <td>${data.q3_risk_appetite_status}</td>
        <td><span class="risk-${getRiskClass(data.q3_risk_appetite_risk)}">${data.q3_risk_appetite_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Strategic Integration</strong></td>
        <td>${data.q4_strategic_status}</td>
        <td><span class="risk-${getRiskClass(data.q4_strategic_risk)}">${data.q4_strategic_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Policy & Controls</strong></td>
        <td>${data.q5_policy_status}</td>
        <td><span class="risk-${getRiskClass(data.q5_policy_risk)}">${data.q5_policy_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Risk Oversight</strong></td>
        <td>${data.q6_risk_reporting_status}</td>
        <td><span class="risk-${getRiskClass(data.q6_risk_reporting_risk)}">${data.q6_risk_reporting_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Stakeholder Accountability</strong></td>
        <td>${data.q7_stakeholder_status}</td>
        <td><span class="risk-${getRiskClass(data.q7_stakeholder_risk)}">${data.q7_stakeholder_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Incident Preparedness</strong></td>
        <td>${data.q8_incident_status}</td>
        <td><span class="risk-${getRiskClass(data.q8_incident_risk)}">${data.q8_incident_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Third-Party AI Risk</strong></td>
        <td>${data.q9_vendor_status}</td>
        <td><span class="risk-${getRiskClass(data.q9_vendor_risk)}">${data.q9_vendor_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Board Development</strong></td>
        <td>${data.q10_development_status}</td>
        <td><span class="risk-${getRiskClass(data.q10_development_risk)}">${data.q10_development_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Forward-Looking Governance</strong></td>
        <td>${data.q11_forward_status}</td>
        <td><span class="risk-${getRiskClass(data.q11_forward_risk)}">${data.q11_forward_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Competitive Risk Awareness</strong></td>
        <td>${data.q12_competitive_status}</td>
        <td><span class="risk-${getRiskClass(data.q12_competitive_risk)}">${data.q12_competitive_risk}</span></td>
      </tr>
      <tr>
        <td><strong>Board Decision Evidence</strong></td>
        <td>${data.q13_decision_status}</td>
        <td><span class="risk-${getRiskClass(data.q13_decision_risk)}">${data.q13_decision_risk}</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Critical Governance Areas: Detailed Findings</h2>

  <div class="area-section">
    <h3>Board Risk Awareness</h3>
    <p>Directors must be able to articulate the specific AI risks facing the organisation. Generic risk awareness isn't sufficient. Boards need to understand how AI could expose customers, staff, IP, or compliance obligations in their specific sector and operating context.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q1_board_risk_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Oversight & Accountability</h3>
    <p>Clear ownership of AI governance prevents it from falling through the cracks. Without formal accountability assigned to an executive or committee, AI risks are managed reactively rather than strategically. Boards must know who is responsible and ensure they have authority to act.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q2_oversight_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Strategic Integration</h3>
    <p>AI strategy determines competitive position. Boards that treat AI as a technology issue miss the strategic implications. AI must be integrated into business strategy discussions, with clear alignment between AI initiatives and organisational objectives.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q4_strategic_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Incident Preparedness</h3>
    <p>When AI decisions cause harm, boards face scrutiny. Can you demonstrate that the board exercised reasonable oversight? Documentation, risk reviews, and evidence of informed decision-making are critical to defending director conduct if incidents occur.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q8_incident_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Third-Party AI Risk</h3>
    <p>AI embedded in vendor systems, SaaS platforms, and service providers creates hidden risk. Boards must ensure management knows where third parties are using AI on organisational data or processes, and that contracts include appropriate safeguards and accountability.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q9_vendor_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Board Development & Investment</h3>
    <p>AI governance requires board capability. Directors can't provide effective oversight without understanding AI fundamentals, risks, and strategic implications. Board education, briefings, and capability development demonstrate commitment to informed governance.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q10_development_blurb}
    </div>
  </div>

  <div class="area-section">
    <h3>Board Decision Evidence</h3>
    <p>Active board engagement with AI decisions is evidence of oversight. When boards approve every AI proposal without challenge, it signals rubber-stamping rather than governance. Evidence of board scrutiny, conditions, or rejections demonstrates meaningful oversight.</p>
    <div class="explanation-box">
      <strong>What you told us:</strong> ${data.q13_decision_blurb}
    </div>
  </div>

  <div class="next-steps">
    <h2>Your Priority Governance Gaps</h2>
    <p>Based on your assessment, the following three areas require immediate board attention:</p>

    <h3>Gap 1</h3>
    <p>${data.gap_1}</p>

    <h3>Gap 2</h3>
    <p>${data.gap_2}</p>

    <h3>Gap 3</h3>
    <p>${data.gap_3}</p>
  </div>

  <div class="cta-section">
    <h2>Ready to Take the Next Step?</h2>
    <p style="font-size: var(--font-size-base); margin-bottom: var(--space-xl);">Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

    <div class="cta-links">
      <a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA" class="cta-link">Book Your Free Consultation</a>
    </div>
  </div>

  <p style="text-align: center; margin: var(--space-lg) 0; font-weight: 600; color: var(--text-heading);">
    Board accountability for AI is non-negotiable. GenerationAI helps NZ boards build defensible AI governance through practical frameworks, strategic guidance, and capability development that protects directors while enabling competitive advantage.
  </p>

  <div class="footer">
    <h3>Important Disclaimers</h3>
    <p>This assessment is based on information provided during completion and represents a point-in-time snapshot of your board's AI governance maturity. Results depend on the accuracy and completeness of responses provided.</p>

    <p>GenerationAI cannot assess governance practices not disclosed during the diagnostic process. This diagnostic is designed to build awareness and guide strategic thinking about AI governance and board accountability.</p>

    <p>This report does not constitute legal, compliance or technical advice. Boards should seek appropriate professional legal counsel regarding director duties, liability and regulatory requirements.</p>

    <div class="tagline">
      GenerationAI helps NZ boards and executives build AI governance capability through proven frameworks, practical tools and strategic guidance. We specialise in protecting director liability while enabling organisations to move from AI risk to AI advantage.
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getGovernanceClass(band: string): string {
  const lower = (band || '').toLowerCase();
  if (lower.includes('mature')) return 'mature';
  if (lower.includes('developing')) return 'developing';
  if (lower.includes('emerging')) return 'emerging';
  return 'weak';
}

function getGovernanceScoreClass(score: number): string {
  if (score >= 70) return 'low';
  if (score >= 40) return 'medium';
  return 'high';
}

/**
 * Personal AI Readiness Diagnostic HTML Template
 */
function generatePersonalAIReadinessHTML(data: any): string {
  const scoreNum = parseInt(data.readiness_score) || 0;
  const readinessClass = getPersonalReadinessClass(data.band_name);
  const scoreClass = getPersonalScoreClass(scoreNum);

  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal AI Readiness Diagnostic Report - ${data.company_name}</title>
  <style>
    /* ============================================
       GENERATIONAI BRAND DESIGN SYSTEM
       Personal AI Readiness Report Template
       ============================================ */

    :root {
      /* Brand Colours */
      --primary-blue: #2563EB;
      --dark-navy: #0F172A;
      --lime-accent: #D4FF00;
      --text-body: #6B7280;
      --text-heading: #0F172A;
      --border-light: #E5E7EB;
      --bg-light: #F9FAFB;
      --white: #FFFFFF;

      /* Status Colours */
      --success-green: #10B981;
      --success-green-bg: #D1FAE5;
      --warning-orange: #F59E0B;
      --warning-orange-bg: #FEF3C7;
      --info-blue-bg: #EFF6FF;

      /* Spacing System - 8px Grid */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 12px;
      --space-lg: 16px;
      --space-xl: 20px;
      --space-2xl: 24px;
      --space-3xl: 32px;

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      --font-size-xs: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 2rem;
      --line-height: 1.6;
      --line-height-tight: 1.2;

      /* Design Properties */
      --radius: 8px;
      --radius-lg: 12px;
      --border-width: 1px;
    }

    @page { size: A4; margin: 1.5cm; }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      color: var(--text-body);
      background: var(--white);
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-md);
    }

    h1, h2, h3, h4 {
      color: var(--text-heading);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    h1 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 3px solid var(--primary-blue);
    }

    h2 {
      font-size: var(--font-size-2xl);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
    }

    h3 {
      font-size: var(--font-size-xl);
      margin-top: var(--space-md);
      margin-bottom: var(--space-sm);
      color: var(--text-heading);
    }

    h4 {
      font-size: var(--font-size-lg);
      margin-top: var(--space-sm);
      margin-bottom: var(--space-xs);
    }

    p { margin-bottom: var(--space-sm); }
    strong { font-weight: 600; color: var(--text-heading); }

    .report-header {
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: var(--border-width) solid var(--border-light);
    }

    .report-header img {
      height: 50px;
      width: auto;
      margin-bottom: var(--space-md);
    }

    .report-meta {
      font-size: var(--font-size-base);
      color: var(--text-body);
      line-height: 1.8;
    }

    /* Hero Introduction - matches Shadow AI introduction box */
    .hero-intro {
      background: var(--bg-light);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-xl);
      border: 1px solid var(--border-light);
    }

    .hero-intro h2 {
      color: var(--text-heading);
      border: none;
      margin-bottom: var(--space-md);
      margin-top: 0;
      padding-bottom: 0;
    }

    .hero-intro p {
      color: var(--text-body);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      margin-bottom: var(--space-sm);
    }

    /* Score Section */
    .score-section {
      text-align: center;
      margin: var(--space-xl) 0;
      padding: var(--space-2xl);
      background: var(--bg-light);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }

    .score-section h2 {
      border-bottom: none;
      padding-bottom: 0;
      margin-top: 0;
    }

    .score-display {
      font-size: 48px;
      font-weight: 700;
      margin: var(--space-md) 0;
      color: var(--primary-blue);
    }

    .readiness-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-2xl);
      border-radius: 20px;
      font-weight: 600;
      margin-top: var(--space-md);
      font-size: var(--font-size-xl);
    }

    .readiness-leader {
      background: var(--success-green-bg);
      color: var(--success-green);
    }

    .readiness-ready {
      background: #E0E7FF;
      color: var(--primary-blue);
    }

    .readiness-curious {
      background: var(--warning-orange-bg);
      color: var(--warning-orange);
    }

    .readiness-distant {
      background: #FEE2E2;
      color: #DC2626;
    }

    /* Profile Sections - matches Shadow AI area-section */
    .profile-section {
      margin: var(--space-lg) 0;
      padding: var(--space-md);
      background: var(--white);
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .profile-section h3 {
      color: var(--text-heading);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: var(--space-xs);
      margin-bottom: var(--space-sm);
      margin-top: 0;
    }

    .what-you-told-us {
      background: #EFF6FF;
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
    }

    .what-this-means {
      background: var(--bg-light);
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
    }

    /* Highlight Box - matches Shadow AI context-box */
    .highlight-box {
      background: var(--bg-light);
      padding: var(--space-md);
      margin: var(--space-md) 0;
      border-radius: var(--radius);
      border: var(--border-width) solid var(--border-light);
    }

    /* Gap Sections - matches Shadow AI area-section */
    .gap-section {
      background: var(--white);
      padding: var(--space-md);
      margin: var(--space-md) 0;
      border: var(--border-width) solid var(--border-light);
      border-radius: var(--radius-lg);
      page-break-inside: avoid;
    }

    .gap-section h4 {
      color: var(--text-heading);
      margin-top: 0;
      margin-bottom: var(--space-sm);
    }

    .gap-section p {
      color: var(--text-body);
    }

    /* CTA Section - matches Shadow AI cta-section */
    .cta-section {
      background: var(--white);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      text-align: center;
      border: 1px solid var(--border-light);
      page-break-inside: avoid;
    }

    .cta-section h2 {
      color: var(--text-heading);
      margin-top: 0;
      margin-bottom: var(--space-lg);
    }

    .cta-section h3 {
      color: var(--primary-blue);
      margin-top: var(--space-xl);
      margin-bottom: var(--space-md);
      font-size: var(--font-size-lg);
    }

    .cta-section h4 {
      color: var(--primary-blue);
      margin-top: var(--space-md);
    }

    .cta-section p {
      color: var(--text-body);
      margin-bottom: var(--space-md);
      font-size: var(--font-size-base);
    }

    .cta-link {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary-blue);
      color: var(--white);
      text-decoration: none;
      border-radius: var(--radius);
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .cta-link:hover {
      background: #1D4ED8;
    }

    /* Footer */
    .footer {
      margin-top: var(--space-2xl);
      padding-top: var(--space-lg);
      border-top: 2px solid var(--border-light);
      font-size: var(--font-size-xs);
      color: var(--text-body);
    }

    .footer h3 {
      font-size: var(--font-size-base);
      color: var(--text-heading);
      margin-bottom: var(--space-sm);
    }

    .tagline {
      margin-top: var(--space-lg);
      text-align: center;
      padding: var(--space-md);
      background: var(--bg-light);
      border-radius: var(--radius);
      font-style: italic;
      color: var(--text-body);
    }

    ul {
      margin-left: var(--space-lg);
      margin-top: var(--space-sm);
    }

    li {
      margin-bottom: var(--space-xs);
    }

    @media print {
      body { padding: 0; }
      .hero-intro, .profile-section, .gap-section, .cta-section, .footer { page-break-inside: avoid; }
      h2, h3, h4 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
         alt="GenerationAI">
    <div class="report-meta">
      <strong>Prepared for:</strong> ${data.company_name}<br>
      <strong>Assessment Completed By:</strong> ${data.contact_name}<br>
      <strong>Date:</strong> ${assessmentDate}
    </div>
  </div>

  <div class="hero-intro">
    <h2>Your AI Advantage Starts Here</h2>
    <p><strong>The difference between leaders who thrive and those who struggle isn't access to AI, it's knowing how to use it strategically.</strong></p>

    <p>Leaders using AI effectively are freeing up a full day per week while making better decisions with richer insights.</p>

    <p>Organisations don't adopt AI successfully when leaders don't understand it themselves. Teams look up, not down. When leadership demonstrates AI capability, transformation accelerates.</p>

    <p>This diagnostic reveals where you stand and shows the gap between where you are and where your competitors likely already are.</p>
  </div>

  <div class="score-section">
    <h2>Your AI Readiness Score</h2>
    <div class="score-display">${scoreNum}/100</div>
    <div class="readiness-badge readiness-${readinessClass}">${data.band_name}</div>
    <p style="margin-top: var(--space-lg); font-size: var(--font-size-base);">${data.band_narrative}</p>
  </div>

  <h2>Your Readiness Profile</h2>

  <div class="profile-section">
    <h3>How You Currently Use AI</h3>
    <div class="what-you-told-us">
      <strong>What you told us:</strong>
      <ul style="margin: 8px 0 0 20px;">
        <li><strong>Frequency:</strong> ${data.q1_frequency}</li>
        <li><strong>Approach:</strong> ${data.q2_approach}</li>
      </ul>
    </div>
    <div class="what-this-means">
      <strong>What this means:</strong> ${data.usage_insight}
    </div>
  </div>

  <div class="profile-section">
    <h3>Your Leadership Position</h3>
    <div class="what-you-told-us">
      <strong>What you told us:</strong> ${data.leadership_insight}
    </div>
  </div>

  <div class="profile-section">
    <h3>Your Learning Readiness</h3>
    <div class="what-you-told-us">
      <strong>What you told us:</strong> ${data.learning_insight}
    </div>
  </div>

  <h2>Your Productivity Potential</h2>

  <div class="highlight-box">
    <p><strong>Time Recovery:</strong> You estimated AI could save you <strong>${data.hours_saved}</strong>. Leaders at your readiness level typically achieve this within 60-90 days of focused application.</p>

    <p style="margin-top: var(--space-md);"><strong>Starting Point:</strong> You identified "<strong>${data.top_use_case}</strong>" as your biggest pain point. This is exactly where AI excels, we recommend starting here.</p>
  </div>

  <p style="margin-top: var(--space-md); font-size: var(--font-size-base); font-style: italic;">
    <strong>The real advantage isn't just doing things faster, it's doing better things.</strong> AI enhances decision quality, expands analytical capacity, and amplifies your ability to lead at scale.
  </p>

  <h2>Your Priority Development Areas</h2>
  <p>Based on your assessment, focus on these three areas:</p>

  <div class="gap-section">
    <h4>1. ${data.gap_1.split(':')[0]}</h4>
    <p>${data.gap_1.split(':').slice(1).join(':').trim()}</p>
  </div>

  <div class="gap-section">
    <h4>2. ${data.gap_2.split(':')[0]}</h4>
    <p>${data.gap_2.split(':').slice(1).join(':').trim()}</p>
  </div>

  <div class="gap-section">
    <h4>3. ${data.gap_3.split(':')[0]}</h4>
    <p>${data.gap_3.split(':').slice(1).join(':').trim()}</p>
  </div>

  <p style="margin-top: var(--space-md); font-style: italic;">${data.gap_summary}</p>

  <div class="cta-section">
    <h2>Ready to Take the Next Step?</h2>
    <p style="font-size: var(--font-size-base); margin-bottom: var(--space-xl);">Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

    <p style="margin-top: var(--space-xl);"><a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA" class="cta-link">Book Your Free Consultation</a></p>
  </div>

  <div class="footer">
    <h3>About Generation AI</h3>
    <p>Generation AI helps NZ business leaders master AI for competitive advantage. Our programs help executives free up one day per week while enhancing strategic decision-making.</p>

    <h3 style="margin-top: var(--space-lg);">Disclaimer</h3>
    <p>This assessment reflects information provided at time of completion and represents a point-in-time snapshot of your personal AI readiness. Results depend on the accuracy and completeness of your responses.</p>

    <p>This diagnostic provides educational insights and suggested development paths. It does not constitute professional advice. Individual results from AI adoption vary based on commitment, organisational context, and implementation approach.</p>

    <div class="tagline">
      GenerationAI helps individuals and organisations move from AI exposure to AI advantage.
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getPersonalReadinessClass(band: string): string {
  const lower = (band || '').toLowerCase();
  if (lower.includes('leader')) return 'leader';
  if (lower.includes('ready')) return 'ready';
  if (lower.includes('curious')) return 'curious';
  return 'distant';
}

function getPersonalScoreClass(score: number): string {
  if (score >= 76) return 'leader';
  if (score >= 51) return 'ready';
  if (score >= 26) return 'curious';
  return 'distant';
}

/**
 * Shadow AI Assessment V2 - 3-Page PDF Template
 * Page 1: Score + Interpretation
 * Page 2: Three Insights
 * Page 3: Next Steps (Dynamic Routing)
 */
function generateShadowAIV2HTML(data: any): string {
  const scoreNum = parseInt(data.total_score) || 0;
  const maturityLabel = data.maturity_label || 'Unknown';
  const maturityDescription = data.maturity_description || '';
  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ');

  // Get maturity color
  const getMaturityColor = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('managed')) return { bg: '#D1FAE5', border: '#10B981', text: '#065F46' };
    if (lower.includes('developing')) return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
    if (lower.includes('ad hoc')) return { bg: '#FED7AA', border: '#F97316', text: '#9A3412' };
    return { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' }; // Unmanaged
  };

  const colors = getMaturityColor(maturityLabel);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow AI Discovery Report - ${data.company_name}</title>
  <style>
    :root {
      --primary-blue: #2563EB;
      --dark-navy: #0F172A;
      --lime-accent: #D4FF00;
      --text-body: #6B7280;
      --text-heading: #0F172A;
      --border-light: #E5E7EB;
      --bg-light: #F9FAFB;
      --white: #FFFFFF;
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      color: var(--text-body);
      line-height: 1.6;
      font-size: 14px;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* Header */
    .header {
      border-bottom: 2px solid var(--dark-navy);
      padding-bottom: 16px;
      margin-bottom: 32px;
    }

    .logo {
      font-size: 24px;
      font-weight: 800;
      color: var(--dark-navy);
    }

    .report-title {
      color: var(--text-body);
      font-size: 12px;
      margin-top: 4px;
    }

    /* Headings */
    h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--dark-navy);
      margin: 32px 0 16px 0;
      line-height: 1.2;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--dark-navy);
      margin: 24px 0 12px 0;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-navy);
      margin: 20px 0 8px 0;
    }

    p {
      margin: 12px 0;
      line-height: 1.7;
    }

    /* Score Display */
    .score-container {
      background: ${colors.bg};
      border: 3px solid ${colors.border};
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin: 32px 0;
    }

    .speedometer {
      margin: 0 auto 30px auto;
      max-width: 600px;
      width: 100%;
    }

    .score-number {
      font-size: 48px;
      font-weight: 800;
      color: ${colors.border};
      line-height: 1;
      margin-top: 10px;
    }

    .score-label {
      font-size: 20px;
      font-weight: 600;
      color: ${colors.text};
      margin-top: 12px;
    }

    /* Insight Cards */
    .insight-card {
      background: var(--bg-light);
      border-left: 4px solid var(--primary-blue);
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }

    .insight-number {
      display: inline-block;
      background: var(--primary-blue);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      text-align: center;
      line-height: 28px;
      font-weight: 700;
      margin-right: 8px;
    }

    .insight-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--dark-navy);
      margin-bottom: 8px;
    }

    /* CTA Boxes */
    .cta-box {
      background: white;
      border: 2px solid var(--border-light);
      border-radius: 8px;
      padding: 20px;
      margin: 16px 0;
    }

    .cta-primary {
      background: var(--lime-accent);
      border-color: var(--lime-accent);
    }

    .cta-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--dark-navy);
      margin-bottom: 8px;
    }

    .cta-price {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-blue);
      margin: 4px 0;
    }

    ul {
      margin: 12px 0 12px 20px;
    }

    li {
      margin: 6px 0;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border-light);
      font-size: 11px;
      color: var(--text-body);
      text-align: center;
    }

    .page-number {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: var(--text-body);
    }
  </style>
</head>
<body>

<!-- PAGE 1: THE BIG REVEAL -->
<div class="page">
  <div class="header">
    <div class="logo">GenerationAI</div>
    <div class="report-title">Shadow AI Discovery Assessment</div>
  </div>

  <p><strong>Prepared for:</strong> ${data.company_name}<br>
  <strong>Completed by:</strong> ${data.contact_name}<br>
  <strong>Date:</strong> ${assessmentDate}</p>

  <h1>Your Shadow AI Readiness Score</h1>

  <div class="score-container">
    ${generateSpeedometer(scoreNum, maturityLabel)}
    <div class="score-number">${scoreNum}/100</div>
    <div class="score-label">Maturity Level: ${maturityLabel}</div>
  </div>

  <h2>What This Means</h2>
  <p>${maturityDescription}</p>

  <h2>Recommended Next Steps</h2>
  <ul>
    ${data.maturity_recommendations ? data.maturity_recommendations.map((rec: string) => `<li>${rec}</li>`).join('') : ''}
  </ul>

  <div class="page-number">Page 1 of 3</div>
</div>

<!-- PAGE 2: THREE INSIGHTS -->
<div class="page">
  <div class="header">
    <div class="logo">GenerationAI</div>
    <div class="report-title">Shadow AI Discovery Assessment</div>
  </div>

  <h1>Three Things You Need to Know</h1>
  <p>Based on your responses, here are your critical gaps:</p>

  <div class="insight-card">
    <div>
      <span class="insight-number">1</span>
      <span class="insight-title">${data.insight_1_title}</span>
    </div>
    <p>${data.insight_1_content}</p>
  </div>

  <div class="insight-card">
    <div>
      <span class="insight-number">2</span>
      <span class="insight-title">${data.insight_2_title}</span>
    </div>
    <p>${data.insight_2_content}</p>
  </div>

  <div class="insight-card">
    <div>
      <span class="insight-number">3</span>
      <span class="insight-title">${data.insight_3_title}</span>
    </div>
    <p>${data.insight_3_content}</p>
  </div>

  <div class="page-number">Page 2 of 3</div>
</div>

<!-- PAGE 3: YOUR NEXT STEPS (Dynamic based on routing) -->
<div class="page">
  <div class="header">
    <div class="logo">GenerationAI</div>
    <div class="report-title">Shadow AI Discovery Assessment</div>
  </div>

  <h1>Your Path Forward</h1>

  ${generatePage3Content(data)}

  <div class="footer">
    <p><strong>GenerationAI</strong> | Auckland, New Zealand | www.generationai.co.nz</p>
    <p style="margin-top: 8px; font-size: 10px;">This assessment does not constitute legal, compliance, or technical advice.</p>
  </div>

  <div class="page-number">Page 3 of 3</div>
</div>

</body>
</html>
  `.trim();
}

/**
 * Generate Page 3 content based on routing decision
 */
function generatePage3Content(data: any): string {
  const routeType = data.route_type || 'ROUTE_3_NURTURE';

  if (routeType === 'ROUTE_1_BOARD') {
    return `
      <h2>Ready to Take the Next Step?</h2>
      <p>Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

      <div class="cta-box cta-primary" style="text-align: center; padding: 32px;">
        <a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA"
           style="display: inline-block; padding: 16px 48px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px;">
           Book Your Free Consultation
        </a>
      </div>
    `;
  }

  if (routeType === 'ROUTE_2_URGENT') {
    return `
      <h2>Ready to Take the Next Step?</h2>
      <p>Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

      <div class="cta-box cta-primary" style="text-align: center; padding: 32px;">
        <a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA"
           style="display: inline-block; padding: 16px 48px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px;">
           Book Your Free Consultation
        </a>
      </div>
    `;
  }

  // Default: ROUTE_3_NURTURE
  return `
    <h2>Ready to Take the Next Step?</h2>
    <p>Book a free 15-minute consultation to discuss your assessment results and explore how we can help you turn AI uncertainty into strategic advantage.</p>

    <div class="cta-box cta-primary" style="text-align: center; padding: 32px;">
      <a href="https://7bboe8.share-ap1.hsforms.com/214JDII1nQGu3Vfxn_-IrYA"
         style="display: inline-block; padding: 16px 48px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px;">
         Book Your Free Consultation
      </a>
    </div>
  `;
}

/**
 * Generate SVG speedometer gauge
 * Color-coded by maturity band:
 * - Red (0-25): Unmanaged
 * - Orange (26-50): Ad Hoc
 * - Yellow (51-75): Developing
 * - Green (76-100): Managed
 */
function generateSpeedometer(score: number, maturityLabel: string): string {
  // Speedometer arc goes from 180° (left) to 0° (right) = 180° total
  // Score 100 = 180° (far left), Score 0 = 0° (far right)
  const angle = 180 - (score * 1.8); // Convert score to angle

  // Calculate needle position
  const needleAngle = angle * (Math.PI / 180);
  const needleLength = 90;
  const centerX = 200;
  const centerY = 200;
  const needleX = centerX + needleLength * Math.cos(needleAngle - Math.PI);
  const needleY = centerY + needleLength * Math.sin(needleAngle - Math.PI);

  return `
    <svg class="speedometer" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer radius: 100, Inner radius: 70, Center: (200, 200) -->
      <!-- Each segment is exactly 45 degrees -->
      <!-- Color progression: Red (bad) → Orange → Yellow → Green (good) -->

      <!-- Segment 1: 180° to 135° (left side) - Green (76-100) -->
      <path d="M 100 200
               A 100 100 0 0 1 129.29 129.29
               L 149.29 149.29
               A 70 70 0 0 0 130 200 Z"
            fill="#22C55E"/>

      <!-- Segment 2: 135° to 90° (top left) - Yellow (51-75) -->
      <path d="M 129.29 129.29
               A 100 100 0 0 1 200 100
               L 200 130
               A 70 70 0 0 0 149.29 149.29 Z"
            fill="#EAB308"/>

      <!-- Segment 3: 90° to 45° (top right) - Orange (26-50) -->
      <path d="M 200 100
               A 100 100 0 0 1 270.71 129.29
               L 250.71 149.29
               A 70 70 0 0 0 200 130 Z"
            fill="#F97316"/>

      <!-- Segment 4: 45° to 0° (right side) - Red (0-25) -->
      <path d="M 270.71 129.29
               A 100 100 0 0 1 300 200
               L 270 200
               A 70 70 0 0 0 250.71 149.29 Z"
            fill="#EF4444"/>

      <!-- Score labels -->
      <text x="80" y="225" font-size="16" fill="#0F172A" font-weight="600">100</text>
      <text x="315" y="225" font-size="16" fill="#0F172A" font-weight="600">0</text>

      <!-- Needle -->
      <line x1="200" y1="200" x2="${needleX}" y2="${needleY}"
            stroke="#0F172A"
            stroke-width="5"
            stroke-linecap="round" />

      <!-- Center dot -->
      <circle cx="200" cy="200" r="12" fill="#0F172A" />
    </svg>
  `;
}