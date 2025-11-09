# Business Readiness Assessment - Technical Documentation

## Overview

The Business Readiness Assessment is a web-based tool that evaluates an organization's AI readiness across 10 key dimensions. It provides a scored assessment (0-100), maturity band classification, personalized feedback, and identifies priority gaps for improvement.

## Architecture

### System Components

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend  │────────>│  Azure Function  │────────>│  PDF Generator  │
│  (Static)   │         │      (API)       │         │     Service     │
└─────────────┘         └──────────────────┘         └─────────────────┘
                                 │
                                 ├──────────>┌─────────────────┐
                                 │           │  Logic App      │
                                 │           │  (Email)        │
                                 │           └─────────────────┘
                                 │
                                 └──────────>┌─────────────────┐
                                             │  HubSpot CRM    │
                                             │  (Contact Sync) │
                                             └─────────────────┘
```

### Technology Stack

**Frontend:**
- Static HTML/CSS/JavaScript
- No frameworks or build process
- Native browser APIs (fetch, sessionStorage)

**Backend:**
- Azure Functions (Node.js/TypeScript)
- Serverless architecture
- Azure Logic Apps for email delivery

**Integrations:**
- PDF microservice for report generation
- Azure Logic App webhook for email
- HubSpot CRM API for contact management

## File Structure

```
business-readiness-assessment/
├── api/
│   ├── processAssessment/          # Main API endpoint
│   │   ├── index.ts               # Request orchestrator
│   │   └── function.json          # Azure Function configuration
│   └── shared/                     # Shared business logic
│       ├── scoring-engine.ts      # Core assessment scoring
│       ├── scoring-config.ts      # Questions & answer mappings
│       ├── email.ts               # Email delivery
│       └── hubspot.ts             # HubSpot CRM integration
├── frontend/
│   ├── index.html                 # Assessment form
│   ├── results.html               # Results display page
│   ├── success.html               # Email confirmation page
│   └── assets/
│       ├── js/
│       │   ├── form-handler.js    # Form validation & submission
│       │   ├── results-handler.js # Results rendering
│       │   └── sanitize.js        # XSS protection
│       └── css/                   # Styling
└── [Documentation files]
```

## Core Components

### 1. Frontend Form (index.html + form-handler.js)

**Purpose:** Collects user input and submits assessment

**Key Features:**
- 3 contact fields (email, name, company)
- 10 assessment questions with 6-option radio buttons (opt_0 to opt_5)
- Progress tracking (shows X of 13 questions answered)
- Marketing opt-in checkbox
- UTM parameter capture for analytics

**Validation:**
- Email format validation
- All questions required before submission
- Contact information required

**Submission Flow:**
```
User Input → Validation → API POST → Store UUID in sessionStorage → Redirect to results page
```

### 2. API Endpoint (processAssessment/index.ts)

**Purpose:** Orchestrates assessment processing

**Request Handler Flow:**
```typescript
1. Validate HTTP method (POST only)
2. Parse and validate request body
3. Generate unique submission ID (UUID)
4. Call scoring engine with responses
5. Sync contact to HubSpot CRM
6. Generate PDF report (with retry logic)
7. Send email notification via Logic App
8. Return scoring results to frontend
```

**Error Handling:**
- Graceful degradation (continues if PDF/email fails)
- Exponential backoff retry for PDF generation (3 attempts)
- Detailed error logging

**Response Format:**
```typescript
{
  submissionId: string,
  score: number,              // 0-100
  rawScore: number,           // 0-50
  band: string,               // Maturity band name
  bandNarrative: string,      // Band description
  tensionLine: string,        // Contextualized messaging
  gaps: Array<{              // Top 3 priority areas
    id: string,
    title: string,
    score: number,
    description: string,
    recommendation: string
  }>,
  gapSummary: string,
  nextStepCta: string,
  questionsFeedback: Array<{  // Detailed per-question feedback
    id: string,
    title: string,
    score: number,
    interpretation: string,
    playback: string
  }>
}
```

### 3. Scoring Engine (shared/scoring-engine.ts)

**Purpose:** Core business logic for assessment scoring

#### Scoring Algorithm

```typescript
// Raw score calculation
rawScore = Σ(Q1...Q10 responses, each 0-5 points) = 0-50

// Percentage conversion
finalScore = (rawScore / 50) × 100 = 0-100%

// Maturity band lookup
band = {
  0-25:   "Unmanaged",
  26-50:  "Ad Hoc",
  51-75:  "Developing",
  76-100: "Ready"
}
```

#### Gap Identification Logic

```typescript
// Only identifies actual gaps (score < 5)
gaps = questions
  .filter(q => q.score < 5)      // Exclude perfect scores
  .sort((a, b) => a.score - b.score)  // Lowest first
  .slice(0, 3)                   // Top 3 priorities

// Each gap includes:
// - title, description, recommendation
// - Sourced from scoring-config.ts
```

#### Tension Line (3-Tier System)

The tension line provides contextualized messaging based on score bands:

```typescript
if (score ≤ 40) {
  tensionLine = "You're adopting AI faster than you can govern it..."
  // Message: Board-level risk, compliance exposure
}
else if (score ≤ 70) {
  tensionLine = "You've got awareness, but without a clear roadmap..."
  // Message: Pilot purgatory, disconnected initiatives
}
else {
  tensionLine = "You're well positioned, but maintaining momentum..."
  // Message: Maintain edge, avoid complacency
}
```

#### Questions Feedback

The engine provides detailed feedback on 5 key questions:
1. AI Strategy Alignment (Q1)
2. Risk & Compliance (Q6)
3. Change Management (Q8)
4. Training & Enablement (Q9)
5. Ethical AI Foundations (Q10)

Each includes:
- Score (0-5)
- Playback text (user's selected response)
- Interpretation (contextual feedback)

### 4. Scoring Configuration (shared/scoring-config.ts)

**Purpose:** Centralized data for questions, answers, and feedback

**Structure:**
```typescript
export const scoringConfig = {
  questions: [
    {
      id: "q1",
      title: "Question title",
      options: [
        {
          id: "opt_0",
          score: 0,
          label: "Option label",
          playback: "Your answer: ...",
          interpretation: "Feedback text"
        },
        // ... opt_1 through opt_5
      ]
    },
    // ... q2 through q10
  ],
  maturityBands: [
    { min: 0, max: 25, name: "Unmanaged", narrative: "..." },
    { min: 26, max: 50, name: "Ad Hoc", narrative: "..." },
    { min: 51, max: 75, name: "Developing", narrative: "..." },
    { min: 76, max: 100, name: "Ready", narrative: "..." }
  ],
  gapDescriptions: {
    q1: { title: "...", description: "...", recommendation: "..." },
    // ... q2 through q10
  },
  gapSummariesByBand: {
    "Unmanaged": "...",
    "Ad Hoc": "...",
    "Developing": "...",
    "Ready": "..."
  },
  nextStepCtas: {
    "Unmanaged": "...",
    "Ad Hoc": "...",
    "Developing": "...",
    "Ready": "..."
  }
}
```

### 5. HubSpot Integration (shared/hubspot.ts)

**Purpose:** Syncs contact and assessment data to HubSpot CRM

**Integration:** HubSpot CRM API (v3 batch upsert endpoint)

**Functionality:**
- Creates new contacts or updates existing ones based on email address
- Stores assessment scores, maturity bands, and priority gaps
- Supports multiple assessment types (business/personal) with namespaced properties
- Tracks latest assessment type and date across all assessments

**Contact Properties Synced:**
```typescript
// Base properties (shared across all assessments)
- firstname
- lastname
- company
- marketing_opt_in
- latest_assessment_type
- latest_assessment_date

// Assessment-specific properties (namespaced)
- {type}_readiness_score        // e.g., business_readiness_score
- {type}_readiness_band         // e.g., business_readiness_band
- {type}_readiness_date         // e.g., business_readiness_date
- {type}_readiness_gaps         // e.g., business_readiness_gaps (JSON)
```

**Error Handling:**
- Non-blocking: API continues if HubSpot sync fails
- Detailed error logging for debugging
- User experience not affected by CRM failures

**API Endpoint:**
- `POST https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert`
- Bearer token authentication via `HUBSPOT_API_KEY` environment variable

### 6. Email Delivery (shared/email.ts)

**Purpose:** Sends assessment results via email

**Integration:** Azure Logic App webhook

**Email Types:**
1. **User Email:** Results summary with PDF attachment
2. **Team Notification:** Internal notification with submission details

**Template Format:**
- HTML email with inline styles
- Includes score, band, gaps summary
- PDF attachment (if generated successfully)
- CTA to view full results online

### 7. Results Display (results.html + results-handler.js)

**Purpose:** Renders assessment results

**Data Flow:**
```
URL param (submissionId) → sessionStorage lookup → Render results
```

**Sections Rendered:**
1. **Score Visualization:** 0-100 percentage with color coding
2. **Maturity Badge:** Visual badge with band name
3. **Band Narrative:** Personalized description of current state
4. **Tension Line:** Contextualized challenge messaging
5. **AI Readiness Playbook:** 4 pillars with score-specific content
6. **Questions Feedback:** Detailed feedback on 5 key questions (color-coded)
7. **Priority Gaps:** Top 3 gaps (conditionally hidden if none)
8. **AI Maturity Map:** Visual roadmap diagram
9. **CTA:** Link to book discovery call

**Conditional Logic:**
- Entire gaps section hidden when score is perfect (50/50)
- Playbook content varies based on score (≤50 vs >50)
- Color coding for question scores (red/yellow/green)

## Data Flow

### Complete User Journey

```
1. User visits index.html
   ↓
2. Fills out 10 questions + contact info
   ↓
3. form-handler.js validates and submits to API
   ↓
4. API processes submission:
   - Generates UUID
   - Scores assessment
   - Syncs to HubSpot CRM
   - Creates PDF report
   - Sends emails
   ↓
5. API returns results JSON
   ↓
6. Frontend stores in sessionStorage
   ↓
7. Redirects to results.html?id={UUID}
   ↓
8. results-handler.js loads data and renders
   ↓
9. User views personalized results
   ↓
10. User receives email with PDF
```

## Security & Privacy

### Security Measures

1. **Input Sanitization:** sanitize.js prevents XSS attacks
2. **CORS Headers:** Configured for specific origins
3. **Email Validation:** Frontend and backend validation
4. **No PII in URLs:** Uses sessionStorage instead of query params
5. **HTTPS Only:** All API calls over secure connection

### Privacy Considerations

- Assessment data stored in sessionStorage (browser only)
- Contact data synced to HubSpot CRM with user consent
- No cookies used
- Email addresses collected with consent
- Marketing opt-in is optional
- No third-party analytics (except UTM tracking)

## Error Handling

### Frontend

```javascript
// Form validation
if (!isValidEmail(email)) {
  alert("Please enter a valid email address");
  return;
}

// API error handling
try {
  const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(data) });
  if (!response.ok) throw new Error('Submission failed');
  // Handle success
} catch (error) {
  alert('Error submitting assessment. Please try again.');
}
```

### Backend

```typescript
// Graceful degradation
try {
  const pdfUrl = await generatePDF(result, contactInfo);
} catch (error) {
  console.error('PDF generation failed:', error);
  // Continue without PDF - don't block user experience
}

// Retry logic for PDF generation
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    return await generatePDFAttempt();
  } catch (error) {
    if (attempt === 3) throw error;
    await wait(1000 * Math.pow(2, attempt)); // Exponential backoff
  }
}
```

## Configuration

### Environment Variables

Required in `local.settings.json` (and Azure App Settings):

```json
{
  "Values": {
    "HUBSPOT_API_KEY": "pat-na1-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "LOGIC_APP_EMAIL_URL": "https://prod-XX.eastus.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke",
    "PDF_SERVICE_URL": "https://your-pdf-service.azurewebsites.net/api/generatePDF",
    "PDF_SERVICE_KEY": "your-pdf-service-key",
    "NOTIFICATION_EMAIL": "team@generationai.com.au"
  }
}
```

### Frontend Configuration

```javascript
// form-handler.js
const API_URL = 'https://your-function-app.azurewebsites.net/api/processAssessment';
const RESULTS_URL = '/tools/business-readiness-assessment/frontend/results.html';
```

## Dependencies

### Backend (api/package.json)

```json
{
  "dependencies": {
    "@azure/functions": "^4.x",
    "node-fetch": "^2.x",
    "@generation-ai/types": "workspace:*",
    "@generation-ai/utils": "workspace:*"
  }
}
```

### Frontend

No external dependencies - vanilla JavaScript only.

## Known Issues & Limitations

### Limitations

- PDF generation requires external microservice
- Email delivery depends on Azure Logic App availability
- HubSpot sync is non-blocking (user still gets results if sync fails)
- sessionStorage clears when browser closes

## Recent Changes (January 2025)

### Bug Fixes

1. **Gap Calculation Fix** (scoring-engine.ts:58-63)
   - Now only shows actual gaps (score < 5)
   - Previously showed placeholders for perfect scores
   - Entire gaps section hidden when no gaps exist

2. **Tension Line Logic Fix** (scoring-engine.ts:82-92)
   - Changed from 2-tier to 3-tier system (≤40, ≤70, >70)
   - More appropriate messaging for mid-range scores
   - Better aligned with maturity bands

### New Features

3. **HubSpot CRM Integration** (shared/hubspot.ts, processAssessment/index.ts)
   - Replaced Airtable with HubSpot CRM for contact management
   - Automatic contact creation/update on assessment submission
   - Stores assessment scores, maturity bands, and priority gaps
   - Non-blocking integration (doesn't affect user experience if it fails)
   - Supports multiple assessment types with namespaced properties

4. **AI Readiness Playbook Section** (results.html)
   - Four pillars: Transparency, Accountability, Capability, Trust
   - Score-specific messaging (≤50 vs >50)
   - Enhances results page with actionable framework

5. **Terminology Update**
   - "AI Roadmap" → "AI Maturity Map"
   - Better reflects assessment purpose

### Removed Features

6. **Deprecated Integrations Removed**
   - Removed Airtable integration (airtable.ts)
   - Removed CSV logger (csv-logger.ts)
   - Cleaned up unused dependencies from package.json

## Testing

### Manual Testing Checklist

- [ ] Submit assessment with all fields filled
- [ ] Verify score calculation accuracy
- [ ] Check maturity band assignment
- [ ] Confirm gap identification (should show ≤3 actual gaps)
- [ ] Test tension line message for different score ranges
- [ ] **Verify HubSpot contact creation/update**
- [ ] **Check HubSpot properties are populated correctly**
- [ ] Verify email delivery (user + team)
- [ ] Check PDF attachment in email
- [ ] Test results page rendering
- [ ] Verify conditional gaps section (hidden when perfect)
- [ ] Test with missing fields (should show validation)
- [ ] Test with invalid email format
- [ ] Verify UTM parameter capture

### Test Scenarios

**Scenario 1: Perfect Score (50/50)**
- All opt_5 selected
- Score: 100%
- Band: "Ready"
- Gaps: None (section should be hidden)
- Tension Line: "You're well positioned..."

**Scenario 2: Low Score (≤20/50)**
- Mostly opt_0/opt_1 selected
- Score: ≤40%
- Band: "Unmanaged" or "Ad Hoc"
- Gaps: 3 lowest scoring questions
- Tension Line: "You're adopting AI faster than you can govern it..."

**Scenario 3: Mid Score (25-35/50)**
- Mix of responses
- Score: 50-70%
- Band: "Ad Hoc" or "Developing"
- Gaps: Up to 3 questions with score < 5
- Tension Line: "You've got awareness, but without a clear roadmap..."

## Deployment

### Frontend Deployment

Static files can be hosted on any web server:
- Azure Static Web Apps
- Azure Blob Storage (static website)
- Netlify / Vercel
- Traditional web hosting

### Backend Deployment

Deploy to Azure Functions:

```bash
cd api
func azure functionapp publish <your-function-app-name>
```

Ensure environment variables are configured in Azure App Settings.

## Monitoring & Analytics

### Current Tracking

- UTM parameters captured on form submission
- Stored with assessment data for attribution
- Email delivery status logged
- HubSpot contact sync status logged
- Assessment data persisted in HubSpot CRM

### Recommended Additions

- Application Insights for API monitoring
- Custom events for user journey tracking
- Error rate monitoring
- PDF generation success rate
- Email delivery success rate
- HubSpot sync success rate monitoring

## Maintenance

### Regular Tasks

1. **Review Question/Answer Content** (scoring-config.ts)
   - Update interpretations based on user feedback
   - Refresh recommendations with latest best practices

2. **Monitor Email Deliverability**
   - Check Logic App run history
   - Verify emails not marked as spam

3. **Check PDF Generation Success Rate**
   - Monitor for failures
   - Investigate timeout issues

4. **Monitor HubSpot Integration**
   - Review sync logs for failures
   - Verify contact properties are updating correctly
   - Check for API rate limits or quota issues

5. **Update Maturity Band Narratives**
   - Keep messaging current with market trends
   - Align with latest AI governance frameworks

### Future Enhancements

- Add backend analytics dashboard (using HubSpot data)
- Implement A/B testing for messaging
- Create admin portal for viewing submissions via HubSpot
- Add multi-language support
- Implement progress save/resume functionality
- Add HubSpot workflow automations based on assessment scores
- Integrate with HubSpot deals/pipelines for follow-up tracking

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Maintained By:** Generation AI Engineering Team
