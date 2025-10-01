/**
 * Airtable Integration - Business Readiness Assessment
 * Stores assessment submissions for tracking and analytics
 */

// Polyfill for abort-controller EventTarget issue in Azure Functions
// The abort-controller package tries to call EventTarget() without 'new'
// This wraps it to allow both constructor styles
// @ts-ignore
const OriginalEventTarget = global.EventTarget;
if (OriginalEventTarget) {
  // @ts-ignore
  global.EventTarget = function EventTarget(...args: any[]) {
    // If called without 'new', create instance with 'new'
    if (!new.target) {
      // @ts-ignore
      return new OriginalEventTarget(...args);
    }
    // If called with 'new', use original constructor
    // @ts-ignore
    return Reflect.construct(OriginalEventTarget, args, new.target);
  } as any;
  // @ts-ignore
  Object.setPrototypeOf(global.EventTarget, OriginalEventTarget);
  // @ts-ignore
  Object.setPrototypeOf(global.EventTarget.prototype, OriginalEventTarget.prototype);
}

import Airtable from 'airtable';
import { AssessmentSubmission } from './scoring-engine';

// Initialize Airtable
const getBase = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId || apiKey === 'your_airtable_key') {
    return null;
  }

  return new Airtable({ apiKey }).base(baseId);
};

export interface SubmissionRecord {
  email: string;
  contact_name: string;
  company_name: string;
  readiness_score: number;
  readiness_band: string;
  pdf_url?: string;
  submitted_at: string;

  // All 10 assessment question responses for analysis
  q1_ownership: string;
  q2_strategy: string;
  q3_culture: string;
  q4_enablement: string;
  q5_shadow_ai: string;
  q6_governance: string;
  q7_compliance: string;
  q8_resources: string;
  q9_data_protection: string;
  q10_opportunity: string;
}

export async function saveToAirtable(record: SubmissionRecord): Promise<any> {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured - skipping save');
      return null;
    }
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Business-Readiness-Assessment';

    const result = await base(tableName).create([
      {
        fields: {
          'Email': record.email,
          'Contact Name': record.contact_name,
          'Company': record.company_name,
          'Readiness Score': record.readiness_score,
          'Readiness Band': record.readiness_band,
          'PDF URL': record.pdf_url || '',
          'Submitted': record.submitted_at,

          // Store all 10 question responses for analysis
          'Q1 Ownership': record.q1_ownership,
          'Q2 Strategy': record.q2_strategy,
          'Q3 Culture': record.q3_culture,
          'Q4 Enablement': record.q4_enablement,
          'Q5 Shadow AI': record.q5_shadow_ai,
          'Q6 Governance': record.q6_governance,
          'Q7 Compliance': record.q7_compliance,
          'Q8 Resources': record.q8_resources,
          'Q9 Data Protection': record.q9_data_protection,
          'Q10 Opportunity': record.q10_opportunity
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
    if (!base) {
      console.warn('Airtable not configured - skipping duplicate check');
      return false;
    }
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Business-Readiness-Assessment';

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
