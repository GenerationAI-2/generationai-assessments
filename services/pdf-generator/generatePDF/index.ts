/**
 * PDF Generator Service - Main HTTP Endpoint
 * Generates PDFs from report data via HTTP POST
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { PDFGenerationRequest, PDFGenerationResponse } from "@generation-ai/types";
import { generatePDFBuffer } from "../shared/pdf-engine";

export async function generatePDFHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('PDF Generator Service - Processing request');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: getCorsHeaders()
    };
  }

  try {
    // Parse request body
    const requestData = await request.json() as PDFGenerationRequest;

    if (!requestData || !requestData.reportData) {
      return {
        status: 400,
        headers: getCorsHeaders(),
        jsonBody: {
          success: false,
          error: "Invalid request: reportData is required"
        } as PDFGenerationResponse
      };
    }

    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(requestData.reportData);
    const pdfBase64 = pdfBuffer.toString('base64');
    const sizeKB = Math.round(pdfBuffer.length / 1024);

    context.log(`PDF generated successfully: ${sizeKB}KB`);

    // Return PDF as base64 (for email attachment) or as binary
    const responseFormat = request.query.get('format') || 'base64';

    if (responseFormat === 'binary') {
      // Return PDF as downloadable binary
      return {
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
      return {
        status: 200,
        headers: getCorsHeaders(),
        jsonBody: {
          success: true,
          pdfBase64: pdfBase64,
          sizeKB: sizeKB
        } as PDFGenerationResponse
      };
    }

  } catch (error: any) {
    context.error('PDF generation failed:', error);
    return {
      status: 500,
      headers: getCorsHeaders(),
      jsonBody: {
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

app.http('generatePDF', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'function', // Requires API key for security
  handler: generatePDFHandler
});