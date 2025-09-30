/**
 * PDF Report HTML Template
 * Generates branded HTML for PDF conversion
 */

import { ReportData } from '@generation-ai/types';

export function generatePDFHTML(data: ReportData): string {
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

  // Determine if there's a critical incident
  const hasCriticalIncident = data.incidents_status?.toLowerCase().includes('yes') ||
                              data.incidents_status?.toLowerCase().includes('confirmed');

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
      border: 2px solid var(--border-light);
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
      border: 2px solid var(--border-light);
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
      background: var(--bg-light);
      padding: var(--space-sm);
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
      border: 2px solid var(--primary-blue);
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

    .timeline-section {
      margin: var(--space-md) 0;
      padding: var(--space-md);
      background: var(--white);
      border-radius: var(--radius);
    }

    .timeline-section h4 {
      color: var(--primary-blue);
      margin-bottom: var(--space-sm);
      font-size: var(--font-size-base);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
    }

    /* CTA Section */
    .cta-section {
      background: var(--primary-blue);
      color: var(--white);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin: var(--space-lg) 0;
      text-align: center;
    }

    .cta-section h2,
    .cta-section h3 {
      color: var(--white);
      margin-top: 0;
    }

    .cta-section p {
      color: var(--white);
      opacity: 0.95;
    }

    .cta-section strong {
      color: var(--white);
      font-weight: 700;
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

  ${hasCriticalIncident ? `
  <div class="critical-banner">
    CRITICAL: You reported a confirmed AI-related incident.<br>
    Immediate action required: investigate the root cause, assess data exposure, and implement controls.
  </div>
  ` : ''}

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

    <h3 style="margin-top: var(--space-lg);">AI Readiness Assessment & 90-Day Roadmap</h3>
    <p>Move from insights to action with a practical plan tailored to your organisation's specific situation and maturity level.</p>
    <p><a href="https://www.generationai.co.nz" style="color: var(--white); text-decoration: underline;"><strong>Book Your Session</strong></a> | <a href="https://www.generationai.co.nz" style="color: var(--white); text-decoration: underline;"><strong>Learn More</strong></a></p>

    <h3 style="margin-top: var(--space-lg);">Supporting Resources</h3>
    <p>Access our guides and tools to support your AI readiness journey.</p>
    <p><a href="https://www.generationai.co.nz/resources" style="color: var(--white); text-decoration: underline;"><strong>Explore Resources</strong></a></p>
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