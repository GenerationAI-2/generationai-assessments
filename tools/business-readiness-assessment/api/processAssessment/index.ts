/**
 * Business AI Readiness Assessment - Main Azure Function Handler
 * Processes assessment submissions and orchestrates all services
 */

import type { HttpRequest } from "@azure/functions";
import { PDFGenerationRequest, PDFGenerationResponse } from "@generation-ai/types";
import { getCorsHeaders } from "@generation-ai/utils";
import { ScoringEngine, AssessmentSubmission } from "../shared/scoring-engine";
// import { saveToAirtable, checkDuplicateSubmission } from "../shared/airtable"; // Disabled
import { sendAssessmentEmail } from "../shared/email";
import fetch from "node-fetch";

export async function processAssessment(
  context: any,
  req: HttpRequest
): Promise<void> {
  context.log('Processing Business AI Readiness assessment submission');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: getCorsHeaders()
    };
    return;
  }

  try {
    // 1. Validate request
    const submission = (req.body || (req as any).rawBody) as AssessmentSubmission;

    if (!submission || !submission.email) {
      context.res = {
        status: 400,
        headers: getCorsHeaders(),
        body: { error: "Invalid submission data. Email is required." }
      };
      return;
    }

    context.log(`Processing assessment for: ${submission.email}`);

    // 2. Check for duplicate submissions - DISABLED (requires Airtable)
    // const isDuplicate = await checkDuplicateSubmission(submission.email, 24);
    // if (isDuplicate) {
    //   context.log(`Duplicate submission detected for ${submission.email}`);
    //   // Still allow but log it
    // }

    // 3. Run scoring engine
    const scoringResult = ScoringEngine.process(submission);
    context.log(`Score calculated: ${scoringResult.data.readiness_score} (${scoringResult.data.readiness_band})`);

    // 4. Generate PDF report via PDF Generator Service
    let pdfBase64: string | undefined;
    try {
      const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'http://localhost:7072/api/generatePDF';
      const pdfServiceKey = process.env.PDF_SERVICE_KEY;

      context.log(`Calling PDF service: ${pdfServiceUrl}`);

      const pdfRequest: PDFGenerationRequest = {
        reportData: scoringResult.data
      };

      const headers: any = {
        'Content-Type': 'application/json'
      };

      // Add function key if provided (for production)
      if (pdfServiceKey) {
        headers['x-functions-key'] = pdfServiceKey;
      }

      const response = await fetch(pdfServiceUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(pdfRequest)
      });

      if (!response.ok) {
        throw new Error(`PDF service returned ${response.status}: ${await response.text()}`);
      }

      const pdfResult = await response.json() as PDFGenerationResponse;

      if (!pdfResult.success || !pdfResult.pdfBase64) {
        throw new Error(pdfResult.error || 'PDF generation failed');
      }

      pdfBase64 = pdfResult.pdfBase64;
      context.log(`PDF generated successfully (${pdfResult.sizeKB}KB)`);

      // Save PDF locally for testing (development only)
      if (process.env.NODE_ENV === 'development' && pdfBase64) {
        const fs = require('fs');
        const path = require('path');
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        const filename = `Business-Readiness-Report-${submission.company_name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '..', '..', 'pdfs', filename);

        // Create pdfs directory if it doesn't exist
        const pdfDir = path.join(__dirname, '..', '..', 'pdfs');
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }

        fs.writeFileSync(filepath, pdfBuffer);
        context.log(`📄 PDF saved locally: ${filepath}`);
      }
    } catch (pdfError: any) {
      context.log('PDF generation failed:', pdfError);
      // Continue even if PDF fails - send email without attachment
      // Or fail the request - depends on your requirements
      // throw pdfError; // Uncomment to make PDF generation mandatory
    }

    // 5. Save to Airtable - DISABLED due to EventTarget compatibility issue in Azure Functions
    // TODO: Re-enable once Airtable SDK is updated or use direct REST API calls
    // try {
    //   await saveToAirtable({
    //     email: submission.email,
    //     contact_name: submission.contact_name,
    //     company_name: submission.company_name,
    //     readiness_score: scoringResult.metadata.final_score,
    //     readiness_band: scoringResult.data.readiness_band,
    //     pdf_url: pdfBase64 ? 'Generated' : 'Failed',
    //     submitted_at: new Date().toISOString(),
    //     q1_ownership: submission.q1_ownership,
    //     q2_strategy: submission.q2_strategy,
    //     q3_culture: submission.q3_culture,
    //     q4_enablement: submission.q4_enablement,
    //     q5_shadow_ai: submission.q5_shadow_ai,
    //     q6_governance: submission.q6_governance,
    //     q7_compliance: submission.q7_compliance,
    //     q8_resources: submission.q8_resources,
    //     q9_data_protection: submission.q9_data_protection,
    //     q10_opportunity: submission.q10_opportunity
    //   });
    //   context.log('Saved to Airtable');
    // } catch (airtableError: any) {
    //   context.log('Airtable save failed:', airtableError);
    //   // Continue even if Airtable fails - don't block user from getting report
    // }

    // 6. Send email with PDF attachment
    let emailSent = false;
    try {
      await sendAssessmentEmail({
        to: submission.email,
        subject: `Your Business AI Readiness Report - ${submission.company_name}`,
        pdfBase64: pdfBase64, // PDF as base64 for attachment
        recipientName: submission.contact_name,
        companyName: submission.company_name,
        score: scoringResult.metadata.final_score,
        maturityBand: scoringResult.data.readiness_band
      });
      context.log(`Email sent to ${submission.email} with PDF attachment`);
      emailSent = true;
    } catch (emailError: any) {
      context.log('Email send failed:', emailError);
      // In development, don't fail if email isn't configured - PDF is still generated locally
      if (process.env.NODE_ENV !== 'development') {
        throw emailError;
      }
      context.log('Continuing without email (development mode)');
    }

    // 7. Send notification to GenerationAI team (optional)
    try {
      const notificationEmail = process.env.NOTIFICATION_EMAIL;
      if (notificationEmail) {
        await sendAssessmentEmail({
          to: notificationEmail,
          subject: `New Readiness Assessment: ${submission.company_name} - Score: ${scoringResult.metadata.final_score}`,
          pdfBase64: pdfBase64,
          recipientName: 'Team',
          companyName: submission.company_name,
          score: scoringResult.metadata.final_score,
          maturityBand: scoringResult.data.readiness_band
        });
        context.log('Team notification sent');
      }
    } catch (notifyError) {
      context.log('Team notification failed:', notifyError);
      // Don't fail the request if team notification fails
    }

    // 8. Return success response
    context.res = {
      status: 200,
      headers: getCorsHeaders(),
      body: {
        success: true,
        readiness_score: scoringResult.metadata.final_score,
        readiness_band: scoringResult.data.readiness_band,
        message: "Assessment processed successfully. Check your email for the full report."
      }
    };

  } catch (error: any) {
    context.log.error('Assessment processing error:', error);

    context.res = {
      status: 500,
      headers: getCorsHeaders(),
      body: {
        success: false,
        error: "Failed to process assessment. Please try again or contact team@generationai.co.nz",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    };
  }
}

// Export as default for function.json compatibility
export default processAssessment;