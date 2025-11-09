import fetch from 'node-fetch';

interface AssessmentSubmission {
  assessmentType: 'business' | 'personal';
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  score: number;
  band: string;
  gaps: Array<{id: string, title: string, score: number}>;
  marketingOptIn: boolean;
}

export async function upsertContact(data: AssessmentSubmission): Promise<void> {
  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  if (!HUBSPOT_API_KEY) {
    throw new Error('HUBSPOT_API_KEY not configured in environment variables');
  }

  // Build base properties (shared across all assessments)
  const baseProperties = {
    firstname: data.firstName,
    lastname: data.lastName,
    company: data.company,
    marketing_opt_in: data.marketingOptIn,
    latest_assessment_type: data.assessmentType,
    latest_assessment_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  // Build assessment-specific properties (namespaced by type)
  const assessmentProperties = {
    [`${data.assessmentType}_readiness_score`]: data.score,
    [`${data.assessmentType}_readiness_band`]: data.band,
    [`${data.assessmentType}_readiness_date`]: new Date().toISOString().split('T')[0],
    [`${data.assessmentType}_readiness_gaps`]: JSON.stringify(data.gaps)
  };

  // Batch upsert payload (creates if new, updates if exists)
  const payload = {
    inputs: [
      {
        idProperty: 'email',
        id: data.email,
        properties: {
          ...baseProperties,
          ...assessmentProperties
        }
      }
    ]
  };

  const url = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('HubSpot API Error Response:', errorBody);
    throw new Error(`HubSpot upsert failed: ${response.status} - ${errorBody}`);
  }

  const result = await response.json();
  console.log('HubSpot upsert successful:', {
    contactId: result.results?.[0]?.id,
    email: data.email,
    assessmentType: data.assessmentType
  });
}
