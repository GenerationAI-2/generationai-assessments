/**
 * Email Delivery via Azure Logic App
 * Sends assessment reports to users
 */

import fetch from 'node-fetch';

export interface EmailOptions {
  to: string;
  subject: string;
  pdfBase64?: string; // base64 encoded PDF for attachment
  recipientName: string;
  companyName: string;
  score: number;
  maturityBand: string;
}

export async function sendAssessmentEmail(options: EmailOptions): Promise<void> {
  const logicAppUrl = process.env.LOGIC_APP_EMAIL_URL;

  if (!logicAppUrl) {
    throw new Error('LOGIC_APP_EMAIL_URL not configured');
  }

  try {
    const htmlBody = generateEmailHTML(options);

    // Format attachment for Logic App
    const attachmentName = `Shadow-AI-Report-${options.companyName.replace(/\s+/g, '-')}.pdf`;

    const payload: any = {
      to: options.to,
      subject: options.subject,
      htmlBody: htmlBody,
      recipientName: options.recipientName,
      companyName: options.companyName,
      score: options.score,
      maturityBand: options.maturityBand,
      // Always include attachments array (even if empty) to prevent Logic App errors
      // The Logic App expects this field and will fail if it's undefined
      attachments: options.pdfBase64 ? [{
        Name: attachmentName,
        ContentBytes: {
          "$content-type": "application/octet-stream",
          "$content": options.pdfBase64
        }
      }] : []
    };

    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logic App returned ${response.status}: ${errorText}`);
    }

    console.log(`Email sent successfully to ${options.to} via Logic App`);
  } catch (error: any) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function generateEmailHTML(options: EmailOptions): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #6B7280;
      margin: 0;
      padding: 0;
      background-color: #F9FAFB;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #FFFFFF;
      padding: 32px;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo {
      height: 50px;
      margin-bottom: 16px;
    }
    h1 {
      color: #0F172A;
      font-size: 24px;
      margin: 0;
    }
    .score-box {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border: 2px solid #2563EB;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .score-number {
      font-size: 48px;
      font-weight: 800;
      color: #2563EB;
      margin: 8px 0;
    }
    .maturity {
      color: #0F172A;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
    }
    .cta-button {
      display: inline-block;
      background: #D4FF00;
      color: #0F172A;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 24px 0;
    }
    .content {
      margin: 24px 0;
      font-size: 15px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #E5E7EB;
      font-size: 12px;
      color: #9CA3AF;
      text-align: center;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg"
           alt="GenerationAI" class="logo">
      <h1>Your Shadow AI Risk Report</h1>
    </div>

    <div class="content">
      <p>Hi ${options.recipientName},</p>
      <p>Your Shadow AI assessment for <strong>${options.companyName}</strong> is complete. The full report is attached to this email.</p>
    </div>

    <div class="score-box">
      <div style="color: #6B7280; font-size: 14px; margin-bottom: 4px;">Risk Score</div>
      <div class="score-number">${options.score}/100</div>
      <div class="maturity">Maturity Level: ${options.maturityBand}</div>
    </div>

    <div class="content">
      <p>Your report includes:</p>
      <p style="margin-left: 20px; line-height: 1.8;">
        ✓ Assessment across 9 risk areas<br>
        ✓ Personalised recommendations<br>
        ✓ 30-90 day action plan
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://www.generationai.co.nz" class="cta-button">Book a Strategy Session</a>
    </div>

    <div class="content" style="font-size: 14px; color: #6B7280;">
      <p>Ready to move from insights to action? We help NZ organisations build safe, strategic AI capability.</p>
    </div>

    <div class="footer">
      <p>
        <strong>GenerationAI</strong> | Auckland, New Zealand<br>
        <a href="https://www.generationai.co.nz">www.generationai.co.nz</a>
      </p>
      <p style="margin-top: 12px; font-size: 11px;">
        This assessment does not constitute legal, compliance, or technical advice.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}