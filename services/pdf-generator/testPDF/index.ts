/**
 * Test PDF Generation Endpoint
 * Generates a sample PDF for testing
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ReportData } from "@generation-ai/types";
import { generatePDFBuffer } from "../shared/pdf-engine";

export async function testPDF(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Testing PDF generation');

  try {
    // Create sample report data
    const sampleData: ReportData = {
      email: "test@example.com",
      contact_name: "Test User",
      company_name: "Test Company Ltd",
      total_score: "72",
      maturity_label: "Reactive",
      maturity_blurb: "Your organization shows awareness of Shadow AI risks but lacks formal controls.",
      org_size: "50-200 employees",
      sector: "Technology",
      access_status: "Awareness Only",
      access_risk: "High",
      access_blurb: "Staff can access AI tools without approval.",
      approval_status: "No Process",
      approval_risk: "High",
      approval_blurb: "No formal approval process exists.",
      detection_status: "Limited",
      detection_risk: "Medium",
      detection_blurb: "Some monitoring in place but gaps remain.",
      policy_status: "In Development",
      policy_risk: "Medium",
      policy_blurb: "Policies are being drafted.",
      training_status: "Ad-hoc",
      training_risk: "Medium",
      training_blurb: "Training occurs informally.",
      exposure_status: "Some Controls",
      exposure_risk: "Medium",
      exposure_blurb: "Basic data protection measures exist.",
      traceability_status: "Manual",
      traceability_risk: "Medium",
      traceability_blurb: "Tracking is done manually.",
      compliance_status: "Aware",
      compliance_risk: "Medium",
      compliance_blurb: "Team is aware of requirements.",
      incidents_status: "None Reported",
      incidents_risk: "Low",
      incidents_blurb: "No incidents have been reported.",
      usage_blurb: "Usage is tracked informally.",
      incident_banner: "",
      step_1: "Establish formal approval process",
      step_2: "Implement monitoring tools",
      step_3: "Develop comprehensive policies",
      step_4: "Roll out training program",
      response_date: new Date().toLocaleDateString('en-NZ')
    };

    // Generate PDF
    context.log('Generating test PDF...');
    const pdfBuffer = await generatePDFBuffer(sampleData);

    context.log(`PDF generated successfully (${Math.round(pdfBuffer.length / 1024)}KB)`);

    // Return PDF as downloadable file
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Shadow-AI-Report-Test.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      },
      body: pdfBuffer
    };

  } catch (error: any) {
    context.error('PDF test error:', error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        success: false,
        error: "Failed to generate test PDF",
        details: error.message
      }
    };
  }
}

app.http('testPDF', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: testPDF
});