/**
 * Airtable Integration
 * Stores assessment submissions for tracking and analytics
 */

import Airtable from 'airtable';
import { AssessmentSubmission } from './scoring-engine';

// Initialize Airtable
const getBase = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials not configured');
  }

  return new Airtable({ apiKey }).base(baseId);
};

export interface SubmissionRecord {
  email: string;
  contact_name: string;
  company_name: string;
  org_size: string;
  sector: string;
  score: number;
  maturity_band: string;
  pdf_url?: string;
  submitted_at: string;

  // All assessment responses for reference
  access: string;
  incidents: string;
  approval: string;
  usage_visibility: string;
  detection: string;
  policy: string;
  training: string;
  risk_concerns: string;
  exposure: string;
  traceability: string;
  compliance_awareness: string;
}

export async function saveToAirtable(record: SubmissionRecord): Promise<any> {
  try {
    const base = getBase();
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

    const result = await base(tableName).create([
      {
        fields: {
          'Email': record.email,
          'Contact Name': record.contact_name,
          'Company': record.company_name,
          'Organisation Size': record.org_size,
          'Sector': record.sector,
          'Score': record.score,
          'Maturity Band': record.maturity_band,
          'PDF URL': record.pdf_url || '',
          'Submitted': record.submitted_at,

          // Store all responses for deeper analysis
          'Access': record.access,
          'Incidents': record.incidents,
          'Approval': record.approval,
          'Usage Visibility': record.usage_visibility,
          'Detection': record.detection,
          'Policy': record.policy,
          'Training': record.training,
          'Risk Concerns': record.risk_concerns,
          'Exposure': record.exposure,
          'Traceability': record.traceability,
          'Compliance': record.compliance_awareness
        }
      }
    ]);

    return result[0];
  } catch (error: any) {
    console.error('Airtable save error:', error);
    throw new Error(`Failed to save to Airtable: ${error.message}`);
  }
}

export async function checkDuplicateSubmission(email: string, hoursWindow: number = 24): Promise<boolean> {
  try {
    const base = getBase();
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursWindow);

    const records = await base(tableName)
      .select({
        filterByFormula: `AND({Email} = '${email}', IS_AFTER({Submitted}, '${cutoffTime.toISOString()}'))`,
        maxRecords: 1
      })
      .firstPage();

    return records.length > 0;
  } catch (error: any) {
    console.error('Duplicate check error:', error);
    // Don't fail the submission if duplicate check fails
    return false;
  }
}