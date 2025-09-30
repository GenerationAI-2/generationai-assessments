/**
 * PDF Generator Service - Main HTTP Endpoint
 * Generates PDFs from report data via HTTP POST
 */

import type { HttpRequest } from "@azure/functions";
import { PDFGenerationRequest, PDFGenerationResponse } from "@generation-ai/types";
import { generatePDFBuffer } from "../shared/pdf-engine";

export async function generatePDFHandler(
  context: any,
  req: HttpRequest
): Promise<void> {
  context.log('PDF Generator Service - Processing request');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: getCorsHeaders()
    };
    return;
  }

  try {
    // Parse request body
    const requestData = (req.body || (req as any).rawBody) as PDFGenerationRequest;

    if (!requestData || !requestData.reportData) {
      context.res = {
        status: 400,
        headers: getCorsHeaders(),
        body: {
          success: false,
          error: "Invalid request: reportData is required"
        } as PDFGenerationResponse
      };
      return;
    }

    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(requestData.reportData);
    const pdfBase64 = pdfBuffer.toString('base64');
    const sizeKB = Math.round(pdfBuffer.length / 1024);

    context.log(`PDF generated successfully: ${sizeKB}KB`);

    // Return PDF as base64 (for email attachment) or as binary
    const responseFormat = (req.query && (req.query as any).format) || 'base64';

    if (responseFormat === 'binary') {
      // Return PDF as downloadable binary
      context.res = {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="report-${Date.now()}.pdf"`,
          'Content-Length': pdfBuffer.length.toString()
        },
        body: pdfBuffer
      };
    } else {
      // Return PDF as base64 JSON response (default)
      context.res = {
        status: 200,
        headers: getCorsHeaders(),
        body: {
          success: true,
          pdfBase64: pdfBase64,
          sizeKB: sizeKB
        } as PDFGenerationResponse
      };
    }

  } catch (error: any) {
    context.log('PDF generation failed:', error);
    context.res = {
      status: 500,
      headers: getCorsHeaders(),
      body: {
        success: false,
        error: error.message || "Failed to generate PDF"
      } as PDFGenerationResponse
    };
  }
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-functions-key',
    'Content-Type': 'application/json'
  };
}

// Export as default for function.json compatibility
export default generatePDFHandler;