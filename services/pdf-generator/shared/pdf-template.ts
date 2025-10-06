/**
 * PDF Report HTML Template
 * Generates branded HTML for PDF conversion
 */

import { ReportData } from '@generation-ai/types';

export function generatePDFHTML(data: any): string {
  // Route to correct template based on data structure
  // Board Governance has governance_score
  if (data.governance_score !== undefined) {
    return generateBoardGovernanceHTML(data);
  }

  // Business Readiness has readiness_score
  if (data.readiness_score !== undefined) {
    return generateBusinessReadinessHTML(data);
  }

  // Default to Shadow AI template
  return generateShadowAIHTML(data);
}

function generateShadowAIHTML(data: ReportData): string {
  const scoreNum = parseInt(data.total_score) || 0;
  const maturityClass = getMaturityClass(data.maturity_label);
  const maturityDescription = getMaturityDescription(data.maturity_label);
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
    <h2>Understanding What's Already Happening</h2>
    <p>AI is already active in your organisation, whether you've approved it or not. Staff are experimenting with tools like ChatGPT, Claude, and others to solve real problems faster. This hidden, unsanctioned use is known as Shadow AI.</p>

    <p>This isn't rebellion, it's initiative. But when AI is used without leadership visibility, four serious risks emerge: sensitive data exposure, quality and accuracy issues, cybersecurity vulnerabilities, and a breakdown of trust between teams and leadership.</p>

    <p>This diagnostic surfaces your hidden risks and shows clear steps to move from exposure to control.</p>
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
    <div class="explanation-box">
      <strong>Previous Incidents:</strong> ${data.incidents_blurb}
    </div>
    <div class="score-display score-${scoreClass}">Your Shadow AI Risk Score: ${scoreNum}/100</div>
  </div>

  <div class="next-steps">
    <h2>Your Next Steps: From Shadow to Strategy</h2>
    <p>Regardless of your current maturity level, strong AI governance rests on four foundations:</p>

    <h3>Core Foundations:</h3>
    <ul>
      <li><strong>Clear ownership</strong> - Someone must be accountable for AI strategy and risk</li>
      <li><strong>Visible guidelines</strong> - Staff need to know what's approved and what's not</li>
      <li><strong>Regular review</strong> - AI tools and risks evolve monthly, governance must keep pace</li>
      <li><strong>Staff capability</strong> - Training and support turn policy into practice</li>
    </ul>

    <p style="margin-top: var(--space-lg);"><strong>Where you stand today:</strong> ${data.maturity_label}</p>
    <p><strong>What this means:</strong> ${maturityDescription}</p>
  </div>

  <div class="cta-section">
    <h2>Ready to Take Action?</h2>
    <p>Whether you're starting from scratch or optimising what's working, we can help.</p>

    <div class="cta-box">
      <h3>AI Readiness Assessment & 90-Day Roadmap</h3>
      <p>Move from insights to action with a practical plan tailored to your organisation's specific situation and maturity level.</p>
      <div class="cta-links">
        <a href="https://www.generationai.co.nz" class="cta-link">Book Your Session</a>
        <a href="https://www.generationai.co.nz" class="cta-link cta-link--secondary">Learn More</a>
      </div>
    </div>

    <div class="cta-box">
      <h3>Supporting Resources</h3>
      <p>Access our guides and tools to support your AI readiness journey.</p>
      <div class="cta-links">
        <a href="https://www.generationai.co.nz/resources" class="cta-link">Explore Resources</a>
      </div>
    </div>
  </div>

  <p style="text-align: center; margin: var(--space-lg) 0; font-weight: 600; color: var(--text-heading);">
    Culture moves first. AI adoption only succeeds when your people are ready before your tools. GenerationAI specialises in helping organisations build the foundation for safe, strategic AI adoption that drives real business value.
  </p>

  <div class="footer">
    <h3>Important Disclaimers</h3>
    <p>This assessment is based on information provided during completion and represents a point-in-time snapshot of your organisation's Shadow AI risk profile. Results depend on the accuracy and completeness of responses provided.</p>

    <p>GenerationAI cannot assess risks or activities not disclosed during the diagnostic process. This diagnostic is designed to build awareness and guide strategic thinking about AI readiness and risk management.</p>

    <p>This report does not constitute legal, compliance, or technical advice. Organisations should seek appropriate professional guidance for specific legal, regulatory, or technical requirements.</p>

    <div class="tagline">
      GenerationAI helps NZ organisations build AI capability through proven frameworks, practical tools, and strategic guidance. We specialise in moving businesses from AI exposure to AI advantage.
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
    return 'Your organisation has little to no AI governance in place. There is high risk exposure from unauthorised AI usage. Urgent action is required to establish basic controls and awareness.';
  }
  if (lower.includes('managed')) {
    return 'Your organisation demonstrates strong AI governance practices with formal policies, training, and technical controls in place. Focus on continuous improvement and staying ahead of emerging risks.';
  }
  if (lower.includes('developing')) {
    return 'Your organisation has foundational AI governance elements but gaps remain. You have some policies and awareness, but need more comprehensive controls and processes.';
  }
  if (lower.includes('ad hoc') || lower.includes('adhoc')) {
    return 'Your organisation has minimal AI governance. AI usage is largely unmanaged, with significant gaps in policy, visibility, and controls. Immediate action is recommended.';
  }
  return 'Your organisation has little to no AI governance in place. There is high risk exposure from unauthorised AI usage. Urgent action is required to establish basic controls and awareness.';
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
      margin: var(--space-lg) 0;
      padding: var(--space-lg);
      background: var(--bg-light);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }

    .score-section h2 {
      border-bottom: none;
      padding-bottom: 0;
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

    .maturity-ready {
      background: var(--risk-low-bg);
      color: var(--risk-low);
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
      background: #EFF6FF;
      padding: var(--space-md);
      margin: var(--space-sm) 0;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
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
    <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
         alt="GenerationAI">
    <h1>Business AI Readiness Diagnostic Report</h1>
    <div class="report-meta">
      <strong>Prepared for:</strong> ${data.company_name}<br>
      <strong>Assessment Completed By:</strong> ${data.contact_name}<br>
      <strong>Date:</strong> ${assessmentDate}
    </div>
  </div>

  <div class="introduction">
    <h2>Understanding Your AI Readiness Position</h2>
    <p>AI is reshaping business faster than any technology in history. Is your organisation ready? This diagnostic reveals where your business stands across five critical dimensions. It's not about the tools, it's about whether your leadership, governance, and capability are ready to turn AI from risk into advantage.</p>

    <p>This report surfaces your readiness gaps and shows clear steps to move from uncertainty to strategic advantage.</p>
  </div>

  <div class="score-section">
    <h2>Your Business AI Readiness Profile</h2>
    <div class="score-display score-medium">Your Business AI Readiness Score: ${scoreNum}/100</div>
    <div class="maturity-badge maturity-${readinessClass}">${data.readiness_band}</div>
    <p style="margin-top: var(--space-md);">${data.readiness_band_narrative}</p>
  </div>

  <h2>Shadow AI Exposure</h2>
  <p>Shadow AI means staff using free or personal AI accounts (like ChatGPT or Claude) without approval or oversight.</p>
  <div class="insight-box">
    <strong>What you told us:</strong> ${data.q5_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q5_interpretation_blurb}
  </div>

  <h2>Leadership & Ownership</h2>
  <div class="insight-box">
    <strong>What you told us:</strong> ${data.q1_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q1_interpretation_blurb}
  </div>

  <h2>Governance & Risk Management</h2>
  <p>Many organisations discover their AI governance gaps the hard way, through incidents, not intention.</p>
  <div class="insight-box">
    <strong>What you told us:</strong> ${data.q6_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q6_interpretation_blurb}
  </div>

  <h2>Data & IP Protection</h2>
  <div class="insight-box">
    <strong>What you told us:</strong> ${data.q9_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q9_interpretation_blurb}
  </div>

  <h2>Opportunity Understanding</h2>
  <div class="insight-box">
    <strong>What you told us:</strong> ${data.q10_answer_playback}
  </div>
  <div class="insight-box">
    <strong>What this means:</strong> ${data.q10_interpretation_blurb}
  </div>

  <h2>Your Priority Gaps</h2>
  <p>The following areas require focused attention:</p>

  <div class="gap-section">
    <h3>${data.gap_1_title}</h3>
    <p>${data.gap_1_description}</p>
  </div>

  <div class="gap-section">
    <h3>${data.gap_2_title}</h3>
    <p>${data.gap_2_description}</p>
  </div>

  <div class="gap-section">
    <h3>${data.gap_3_title}</h3>
    <p>${data.gap_3_description}</p>
  </div>

  <p style="margin-top: var(--space-md);"><em>${data.gap_summary_blurb}</em></p>

  <h2>Next Step Recommendation</h2>

  <div class="cta-section">
    <h3>${data.next_step_cta}</h3>
    <p>${data.next_step_narrative}</p>
    <p style="margin-top: var(--space-lg);"><a href="https://www.generationai.co.nz" class="cta-link">Book Your Session</a></p>
  </div>

  <p style="text-align: center; margin: var(--space-lg) 0; font-weight: 600; color: var(--text-heading);">
    Culture moves first. AI adoption only succeeds when your people are ready before your tools. GenerationAI specialises in helping organisations build the foundation for safe, strategic AI adoption that drives real business value.
  </p>

  <div class="footer">
    <h3>Important Disclaimers</h3>
    <p>This assessment is based on information provided during completion and represents a point-in-time snapshot of your organisation's Business AI Readiness profile. Results depend on the accuracy and completeness of responses provided.</p>

    <p>GenerationAI cannot assess risks or activities not disclosed during the diagnostic process. This diagnostic is designed to build awareness and guide strategic thinking about AI readiness and risk management.</p>

    <p>This report does not constitute legal, compliance, or technical advice. Organisations should seek appropriate professional guidance for specific legal, regulatory, or technical requirements.</p>

    <div class="tagline">
      GenerationAI helps NZ organisations build AI capability through proven frameworks, practical tools, and strategic guidance. We specialise in moving businesses from AI exposure to AI advantage.
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getReadinessClass(band: string): string {
  const lower = (band || '').toLowerCase();
  if (lower.includes('ready')) return 'ready';
  if (lower.includes('developing')) return 'developing';
  if (lower.includes('ad hoc') || lower.includes('adhoc')) return 'adhoc';
  return 'unmanaged';
}

/**
 * Board AI Governance Diagnostic HTML Template
 */
function generateBoardGovernanceHTML(data: any): string {
  const scoreNum = parseInt(data.governance_score) || 0;
  const governanceClass = getGovernanceClass(data.band_name);

  const assessmentDate = data.response_date || new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Helper to get risk badge styling
  const getRiskBadge = (risk: string): string => {
    const riskLower = (risk || '').toLowerCase();
    if (riskLower.includes('critical')) {
      return `<span class="risk-badge risk-badge--critical">${risk}</span>`;
    } else if (riskLower.includes('high')) {
      return `<span class="risk-badge risk-badge--high">${risk}</span>`;
    } else if (riskLower.includes('medium')) {
      return `<span class="risk-badge risk-badge--medium">${risk}</span>`;
    } else {
      return `<span class="risk-badge risk-badge--low">${risk}</span>`;
    }
  };

  // Helper to get status badge
  const getStatusBadge = (status: string): string => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('strong') || statusLower.includes('good')) {
      return `<span class="status-badge status-badge--good">${status}</span>`;
    } else if (statusLower.includes('developing')) {
      return `<span class="status-badge status-badge--developing">${status}</span>`;
    } else if (statusLower.includes('weak') || statusLower.includes('poor')) {
      return `<span class="status-badge status-badge--weak">${status}</span>`;
    } else {
      return `<span class="status-badge status-badge--absent">${status}</span>`;
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Board Governance Report - ${data.company_name}</title>
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
      margin: 15mm 20mm;
    }

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
    }

    /* Typography */
    h1, h2, h3, h4 {
      color: var(--text-heading);
      line-height: var(--line-height-tight);
      font-weight: 700;
      margin-bottom: var(--space-lg);
    }

    h1 { font-size: var(--font-size-3xl); }
    h2 { font-size: var(--font-size-2xl); margin-top: var(--space-3xl); }
    h3 { font-size: var(--font-size-xl); margin-top: var(--space-2xl); }
    h4 { font-size: var(--font-size-lg); margin-top: var(--space-xl); }

    p {
      margin-bottom: var(--space-lg);
    }

    strong {
      color: var(--text-heading);
      font-weight: 600;
    }

    /* Cover Page */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      page-break-after: always;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: var(--white);
      padding: var(--space-3xl);
    }

    .cover__accent {
      width: 80px;
      height: 8px;
      background: var(--lime-accent);
      margin: 0 auto var(--space-3xl);
      border-radius: 4px;
    }

    .cover h1 {
      color: var(--white);
      font-size: 3rem;
      margin-bottom: var(--space-xl);
    }

    .cover__company {
      font-size: var(--font-size-2xl);
      color: var(--lime-accent);
      margin-bottom: var(--space-3xl);
      font-weight: 600;
    }

    .cover__score {
      background: rgba(212, 255, 0, 0.1);
      border: 2px solid var(--lime-accent);
      border-radius: var(--radius-lg);
      padding: var(--space-3xl);
      margin: var(--space-3xl) 0;
      min-width: 300px;
    }

    .cover__score-label {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: var(--space-sm);
    }

    .cover__score-value {
      font-size: 4rem;
      font-weight: 800;
      color: var(--lime-accent);
      line-height: 1;
    }

    .cover__score-band {
      font-size: var(--font-size-xl);
      color: var(--white);
      margin-top: var(--space-lg);
      font-weight: 600;
    }

    .cover__date {
      color: rgba(255, 255, 255, 0.6);
      margin-top: var(--space-3xl);
    }

    /* Score Summary Box */
    .score-summary {
      background: linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%);
      border: 2px solid var(--primary-blue);
      border-radius: var(--radius-lg);
      padding: var(--space-2xl);
      margin: var(--space-2xl) 0;
    }

    .score-summary__title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--text-heading);
      margin-bottom: var(--space-lg);
    }

    .score-summary__content {
      color: var(--text-body);
      line-height: 1.8;
    }

    /* Governance Bands */
    .governance-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: var(--font-size-xs);
    }

    .governance-badge--mature {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    .governance-badge--developing {
      background: var(--risk-medium-bg);
      color: #D97706;
    }

    .governance-badge--emerging {
      background: #FEE2E2;
      color: #DC2626;
    }

    .governance-badge--weak {
      background: #FEE2E2;
      color: #991B1B;
    }

    /* Status & Risk Badges */
    .status-badge,
    .risk-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge--good {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    .status-badge--developing {
      background: var(--risk-medium-bg);
      color: #D97706;
    }

    .status-badge--weak {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .status-badge--absent {
      background: #F3F4F6;
      color: #6B7280;
    }

    .risk-badge--low {
      background: var(--risk-low-bg);
      color: var(--risk-low);
    }

    .risk-badge--medium {
      background: var(--risk-medium-bg);
      color: #D97706;
    }

    .risk-badge--high {
      background: var(--risk-high-bg);
      color: var(--risk-high);
    }

    .risk-badge--critical {
      background: #FEE2E2;
      color: #991B1B;
    }

    /* Summary Table */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin: var(--space-2xl) 0;
      font-size: var(--font-size-xs);
    }

    .summary-table th {
      background: var(--dark-navy);
      color: var(--white);
      text-align: left;
      padding: var(--space-md);
      font-weight: 600;
      border: 1px solid var(--border-light);
    }

    .summary-table td {
      padding: var(--space-md);
      border: 1px solid var(--border-light);
    }

    .summary-table tr:nth-child(even) {
      background: var(--bg-light);
    }

    /* Finding Box */
    .finding {
      background: var(--bg-light);
      border-left: 4px solid var(--primary-blue);
      padding: var(--space-xl);
      margin: var(--space-xl) 0;
      page-break-inside: avoid;
    }

    .finding__title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--text-heading);
      margin-bottom: var(--space-md);
    }

    .finding__meta {
      font-size: var(--font-size-xs);
      color: var(--text-body);
      font-style: italic;
      margin-bottom: var(--space-lg);
    }

    .finding__answer {
      background: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius);
      margin: var(--space-md) 0;
      border: 1px solid var(--border-light);
    }

    .finding__interpretation {
      margin-top: var(--space-md);
      color: var(--text-body);
    }

    /* Gap Box */
    .gap {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: var(--space-xl);
      margin: var(--space-lg) 0;
      page-break-inside: avoid;
    }

    .gap strong {
      color: #D97706;
    }

    /* CTA Box */
    .cta {
      background: var(--dark-navy);
      color: var(--white);
      padding: var(--space-3xl);
      border-radius: var(--radius-lg);
      margin: var(--space-3xl) 0;
      text-align: center;
    }

    .cta h3 {
      color: var(--lime-accent);
      margin-bottom: var(--space-lg);
    }

    .cta p {
      color: rgba(255, 255, 255, 0.9);
    }

    .cta__list {
      list-style: none;
      margin: var(--space-xl) 0;
      text-align: left;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta__list li {
      padding: var(--space-sm) 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .cta__list li:before {
      content: "✓ ";
      color: var(--lime-accent);
      font-weight: bold;
      margin-right: var(--space-sm);
    }

    /* Disclaimer */
    .disclaimer {
      background: var(--bg-light);
      padding: var(--space-xl);
      border-radius: var(--radius);
      margin-top: var(--space-3xl);
      font-size: var(--font-size-xs);
      color: var(--text-body);
      page-break-inside: avoid;
    }

    .disclaimer h4 {
      font-size: var(--font-size-base);
      margin-bottom: var(--space-md);
    }

    /* Utilities */
    .page-break {
      page-break-after: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    .text-center {
      text-align: center;
    }

    .mt-xl {
      margin-top: var(--space-xl);
    }

    .mb-xl {
      margin-bottom: var(--space-xl);
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <div class="cover__accent"></div>
    <h1>AI Board Governance<br>Diagnostic Report</h1>
    <div class="cover__company">${data.company_name}</div>

    <div class="cover__score">
      <div class="cover__score-label">Governance Score</div>
      <div class="cover__score-value">${scoreNum}<span style="font-size: 2rem; opacity: 0.7;">/100</span></div>
      <div class="cover__score-band">${data.band_name}</div>
    </div>

    <div class="cover__date">Assessment Date: ${assessmentDate}</div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <h2>Executive Summary</h2>

  <div class="score-summary">
    <div class="score-summary__title">
      Directors are personally accountable for AI governance
    </div>
    <div class="score-summary__content">
      <strong>"We didn't understand it" is not a defence.</strong> This diagnostic assesses your board's ability to demonstrate reasonable AI oversight across 13 critical governance areas.
    </div>
  </div>

  <p><strong>Your Board's Governance Maturity: </strong><span class="governance-badge governance-badge--${governanceClass}">${data.band_name}</span></p>

  <p>${data.band_narrative}</p>

  <!-- SUMMARY TABLE -->
  <h2>Governance Overview</h2>

  <table class="summary-table">
    <thead>
      <tr>
        <th style="width: 40%;">Governance Area</th>
        <th style="width: 30%;">Status</th>
        <th style="width: 30%;">Risk Level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Board Risk Awareness</strong></td>
        <td>${getStatusBadge(data.q1_board_risk_status)}</td>
        <td>${getRiskBadge(data.q1_board_risk_risk)}</td>
      </tr>
      <tr>
        <td><strong>Oversight & Accountability</strong></td>
        <td>${getStatusBadge(data.q2_oversight_status)}</td>
        <td>${getRiskBadge(data.q2_oversight_risk)}</td>
      </tr>
      <tr>
        <td><strong>Risk Appetite</strong></td>
        <td>${getStatusBadge(data.q3_risk_appetite_status)}</td>
        <td>${getRiskBadge(data.q3_risk_appetite_risk)}</td>
      </tr>
      <tr>
        <td><strong>Strategic Integration</strong></td>
        <td>${getStatusBadge(data.q4_strategic_status)}</td>
        <td>${getRiskBadge(data.q4_strategic_risk)}</td>
      </tr>
      <tr>
        <td><strong>Policy & Controls</strong></td>
        <td>${getStatusBadge(data.q5_policy_status)}</td>
        <td>${getRiskBadge(data.q5_policy_risk)}</td>
      </tr>
      <tr>
        <td><strong>Risk Oversight</strong></td>
        <td>${getStatusBadge(data.q6_risk_reporting_status)}</td>
        <td>${getRiskBadge(data.q6_risk_reporting_risk)}</td>
      </tr>
      <tr>
        <td><strong>Stakeholder Accountability</strong></td>
        <td>${getStatusBadge(data.q7_stakeholder_status)}</td>
        <td>${getRiskBadge(data.q7_stakeholder_risk)}</td>
      </tr>
      <tr>
        <td><strong>Incident Preparedness</strong></td>
        <td>${getStatusBadge(data.q8_incident_status)}</td>
        <td>${getRiskBadge(data.q8_incident_risk)}</td>
      </tr>
      <tr>
        <td><strong>Third-Party AI Risk</strong></td>
        <td>${getStatusBadge(data.q9_vendor_status)}</td>
        <td>${getRiskBadge(data.q9_vendor_risk)}</td>
      </tr>
      <tr>
        <td><strong>Board Development</strong></td>
        <td>${getStatusBadge(data.q10_development_status)}</td>
        <td>${getRiskBadge(data.q10_development_risk)}</td>
      </tr>
      <tr>
        <td><strong>Forward-Looking Governance</strong></td>
        <td>${getStatusBadge(data.q11_forward_status)}</td>
        <td>${getRiskBadge(data.q11_forward_risk)}</td>
      </tr>
      <tr>
        <td><strong>Competitive Risk Awareness</strong></td>
        <td>${getStatusBadge(data.q12_competitive_status)}</td>
        <td>${getRiskBadge(data.q12_competitive_risk)}</td>
      </tr>
      <tr>
        <td><strong>Board Decision Evidence</strong></td>
        <td>${getStatusBadge(data.q13_decision_status)}</td>
        <td>${getRiskBadge(data.q13_decision_risk)}</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- DETAILED FINDINGS -->
  <h2>Detailed Findings</h2>

  <p>The following areas represent critical governance questions where board-level oversight is essential.</p>

  <!-- Q1: Board Risk Awareness -->
  <div class="finding">
    <div class="finding__title">Board Risk Awareness</div>
    <div class="finding__meta">Can your board clearly explain the top 3 AI risks specific to your business?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q1_board_risk_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q1_board_risk_blurb}
    </div>
  </div>

  <!-- Q2: Oversight & Accountability -->
  <div class="finding">
    <div class="finding__title">Oversight & Accountability</div>
    <div class="finding__meta">Who has formal responsibility for AI governance in your organisation?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q2_oversight_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q2_oversight_blurb}
    </div>
  </div>

  <!-- Q4: Strategic Integration -->
  <div class="finding">
    <div class="finding__title">Strategic Integration</div>
    <div class="finding__meta">How is AI considered in your organisation's strategy?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q4_strategic_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q4_strategic_blurb}
    </div>
  </div>

  <!-- Q8: Incident Preparedness -->
  <div class="finding">
    <div class="finding__title">Incident Preparedness</div>
    <div class="finding__meta">If an AI decision caused material harm, could the board demonstrate it exercised reasonable oversight?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q8_incident_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q8_incident_blurb}
    </div>
  </div>

  <div class="page-break"></div>

  <!-- Q9: Third-Party AI Risk -->
  <div class="finding">
    <div class="finding__title">Third-Party/Vendor AI Risk</div>
    <div class="finding__meta">Does your board know which third parties use AI on your data or processes?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q9_vendor_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q9_vendor_blurb}
    </div>
  </div>

  <!-- Q10: Board Development -->
  <div class="finding">
    <div class="finding__title">Board Development & Investment</div>
    <div class="finding__meta">What steps has the board taken to build its AI governance capability?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q10_development_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q10_development_blurb}
    </div>
  </div>

  <!-- Q13: Board Decision Evidence -->
  <div class="finding">
    <div class="finding__title">Board Decision Evidence</div>
    <div class="finding__meta">When did the board last reject, modify, or set conditions on an AI initiative?</div>
    <div class="finding__answer">
      <strong>Your Response:</strong><br>
      ${data.q13_decision_answer}
    </div>
    <div class="finding__interpretation">
      <strong>What this means:</strong><br>
      ${data.q13_decision_blurb}
    </div>
  </div>

  <!-- PRIORITY GAPS -->
  <h2>Your Priority Governance Gaps</h2>

  <p>Based on your responses, the following three areas require immediate board attention:</p>

  <div class="gap">
    <strong>Gap 1:</strong> ${data.gap_1}
  </div>

  <div class="gap">
    <strong>Gap 2:</strong> ${data.gap_2}
  </div>

  <div class="gap">
    <strong>Gap 3:</strong> ${data.gap_3}
  </div>

  <!-- NEXT STEPS -->
  <div class="cta">
    <h3>Next Steps</h3>
    <p><strong>Talk to us about strengthening your board's AI governance.</strong></p>

    <ul class="cta__list">
      <li>Clarify accountability for AI oversight</li>
      <li>Build board-level capability and awareness</li>
      <li>Develop practical governance frameworks that reduce director liability and build stakeholder trust</li>
    </ul>

    <p style="margin-top: var(--space-2xl);">
      <strong>Contact:</strong> GenerationAI<br>
      Email: info@generationai.co.nz<br>
      Web: www.generationai.co.nz
    </p>
  </div>

  <!-- DISCLAIMER -->
  <div class="disclaimer">
    <h4>Important Notice</h4>
    <p>
      This assessment reflects information provided at the time of completion and represents a point-in-time snapshot
      of your board's AI governance maturity. Results depend on the accuracy and completeness of responses provided.
    </p>
    <p>
      This diagnostic provides governance insights and is not legal advice. Boards should seek appropriate legal
      counsel regarding director duties and liability. Generation AI cannot assess governance practices not disclosed
      during the diagnostic process.
    </p>
    <p style="margin-top: var(--space-lg);">
      <strong>About GenerationAI:</strong> Generation AI helps NZ boards and executives build AI governance capability
      through practical frameworks and strategic guidance. We focus on protecting director liability while enabling
      competitive advantage.
    </p>
    <p style="margin-top: var(--space-lg); text-align: center; color: var(--text-body);">
      © ${new Date().getFullYear()} GenerationAI Ltd. All rights reserved.
    </p>
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