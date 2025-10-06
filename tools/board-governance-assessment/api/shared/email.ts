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
    const attachmentName = `Board-Governance-Report-${options.companyName.replace(/\s+/g, '-')}.pdf`;

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
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F9FAFB;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-weight: 700;">Your Board AI Governance Report</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 32px; color: #6B7280; font-size: 15px; line-height: 1.6;">
              <p style="margin: 24px 0;">Hi ${options.recipientName},</p>
              <p style="margin: 24px 0;">Your board AI governance diagnostic for <strong style="color: #0F172A;">${options.companyName}</strong> is complete. The full report is attached to this email.</p>
              <p style="margin: 24px 0;"><strong style="color: #0F172A;">Directors are personally accountable for AI governance.</strong> This report reveals whether your board can demonstrate reasonable AI oversight.</p>
            </td>
          </tr>

          <!-- Score Box -->
          <tr>
            <td style="padding: 0 32px;">
              <table role="presentation" width="100%" cellpadding="24" cellspacing="0" style="background-color: #DBEAFE; border: 2px solid #2563EB; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="color: #6B7280; font-size: 14px; margin-bottom: 4px;">Governance Score</div>
                    <div style="font-size: 48px; font-weight: 800; color: #2563EB; margin: 8px 0;">${options.score}/100</div>
                    <div style="color: #0F172A; font-size: 16px; font-weight: 600; margin-top: 8px;">Governance Maturity: ${options.maturityBand}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Report Includes -->
          <tr>
            <td style="padding: 0 32px; color: #6B7280; font-size: 15px; line-height: 1.6;">
              <p style="margin: 24px 0;">Your report includes:</p>
              <p style="margin: 24px 0 24px 20px; line-height: 1.8;">
                ✓ Board governance score across 13 critical areas<br>
                ✓ Your top 3 governance gaps requiring board attention<br>
                ✓ Regulatory exposure indicators<br>
                ✓ Prioritised board-level actions
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 32px;">
              <a href="https://www.generationai.co.nz"
                 style="display: inline-block; background-color: #D4FF00; color: #0F172A; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px;">Book a Governance Session</a>
            </td>
          </tr>

          <!-- Bottom Content -->
          <tr>
            <td style="padding: 0 32px; color: #6B7280; font-size: 14px; line-height: 1.6;">
              <p style="margin: 24px 0;">We help NZ boards strengthen AI governance, reduce director liability, and build stakeholder trust through practical frameworks and strategic guidance.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 32px 32px 32px 32px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
              <p style="margin: 0 0 12px 0;">
                <strong style="color: #9CA3AF;">GenerationAI</strong> | Auckland, New Zealand<br>
                <a href="https://www.generationai.co.nz" style="color: #2563EB; text-decoration: none;">www.generationai.co.nz</a>
              </p>
              <p style="margin: 12px 0 0 0; font-size: 11px;">
                This diagnostic provides governance insights and is not legal advice. Boards should seek appropriate legal counsel regarding director duties and liability.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}