/**
 * Business AI Readiness Assessment - Main Azure Function Handler
 * Processes assessment submissions and orchestrates all services
 */

import type { HttpRequest } from "@azure/functions";
import { randomUUID } from "crypto";
import { PDFGenerationRequest, PDFGenerationResponse } from "@generation-ai/types";
import { getCorsHeaders } from "@generation-ai/utils";
import { ScoringEngine, AssessmentSubmission } from "../shared/scoring-engine";
import { sendAssessmentEmail } from "../shared/email";
import { upsertContact } from "../shared/hubspot";
import fetch from "node-fetch";

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry exhausted');
}

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

    // 2. Generate unique submission ID
    const submissionId = randomUUID();
    context.log(`Generated submission ID: ${submissionId}`);

    // 3. Run scoring engine
    const scoringResult = ScoringEngine.process(submission);
    context.log(`Score calculated: ${scoringResult.data.readiness_score} (${scoringResult.data.readiness_band})`);

    // 4. Sync to HubSpot
    try {
      // Build gaps array from individual gap properties
      const gaps = [];
      if (scoringResult.data.gap_1_title && scoringResult.data.gap_1_title !== "No significant gaps identified") {
        gaps.push({
          id: 'gap_1',
          title: scoringResult.data.gap_1_title,
          score: 0 // Score not available in flat structure
        });
      }
      if (scoringResult.data.gap_2_title && scoringResult.data.gap_2_title !== "Continue current progress") {
        gaps.push({
          id: 'gap_2',
          title: scoringResult.data.gap_2_title,
          score: 0
        });
      }
      if (scoringResult.data.gap_3_title && scoringResult.data.gap_3_title !== "Maintain momentum") {
        gaps.push({
          id: 'gap_3',
          title: scoringResult.data.gap_3_title,
          score: 0
        });
      }

      await upsertContact({
        assessmentType: 'business',
        email: submission.email,
        firstName: submission.contact_name.split(' ')[0] || submission.contact_name,
        lastName: submission.contact_name.split(' ').slice(1).join(' ') || '',
        company: submission.company_name,
        score: scoringResult.metadata.final_score,
        band: scoringResult.data.readiness_band,
        gaps: gaps,
        marketingOptIn: (submission as any).opt_in_marketing || false
      });
      context.log('Contact synced to HubSpot successfully');
    } catch (hubspotError) {
      // Log error but don't block user experience
      context.log.error('HubSpot sync failed (non-blocking):', hubspotError);
      // User still gets their results even if HubSpot fails
    }

    // 5. Generate PDF report via PDF Generator Service with retry
    let pdfBase64: string | undefined;
    let pdfGenerationFailed = false;
    try {
      const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'http://localhost:7072/api/generatePDF';
      const pdfServiceKey = process.env.PDF_SERVICE_KEY;

      context.log(`Calling PDF service with retry: ${pdfServiceUrl}`);

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

      // Use retry with exponential backoff
      const pdfResult = await retryWithBackoff(async () => {
        const response = await fetch(pdfServiceUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(pdfRequest)
        });

        if (!response.ok) {
          throw new Error(`PDF service returned ${response.status}: ${await response.text()}`);
        }

        const result = await response.json() as PDFGenerationResponse;

        if (!result.success || !result.pdfBase64) {
          throw new Error(result.error || 'PDF generation failed');
        }

        return result;
      }, 3, 1000);

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
      context.log.error('PDF generation failed after retries:', pdfError);
      pdfGenerationFailed = true;
      // Continue even if PDF fails - send email without attachment
      // Results page will still be shown to user
    }

    // 6. Send email with or without PDF attachment
    let emailSent = false;
    try {
      const emailSubject = `Your Business AI Readiness Report - ${scoringResult.metadata.final_score}/100`;
      
      await sendAssessmentEmail({
        to: submission.email,
        subject: emailSubject,
        pdfBase64: pdfGenerationFailed ? undefined : pdfBase64, // Only attach if generation succeeded
        recipientName: submission.contact_name,
        companyName: submission.company_name,
        score: scoringResult.metadata.final_score,
        maturityBand: scoringResult.data.readiness_band
      });
      
      if (pdfGenerationFailed) {
        context.log(`Email sent to ${submission.email} without PDF (generation failed - will retry separately)`);
      } else {
        context.log(`Email sent to ${submission.email} with PDF attachment`);
      }
      emailSent = true;
    } catch (emailError: any) {
      context.log.error('Email send failed:', emailError);
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

    // 8. Return success response with full data
    context.res = {
      status: 200,
      headers: getCorsHeaders(),
      body: {
        success: true,
        submission_id: submissionId,
        data: scoringResult.data,
        pdf_generated: !pdfGenerationFailed,
        message: pdfGenerationFailed 
          ? "Assessment processed successfully. Your results are ready and email sent. PDF generation in progress."
          : "Assessment processed successfully. Check your email for the full report."
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