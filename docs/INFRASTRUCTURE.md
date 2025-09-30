# Infrastructure Overview

## 🏗️ Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    https://shadowai.generationai.co.nz          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Azure Static Web App                           │
│         tools/shadow-ai-assessment/frontend/                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • HTML/CSS/JavaScript                                    │  │
│  │ • Form validation                                        │  │
│  │ • Progress tracking                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS POST
                            │ /api/processAssessment
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│           Azure Function App: Shadow AI Assessment API          │
│         tools/shadow-ai-assessment/api/                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ processAssessment/                                       │  │
│  │ ├─ Validate submission                                   │  │
│  │ ├─ Run scoring engine ──────┐                            │  │
│  │ ├─ Call PDF service         │                            │  │
│  │ ├─ Save to Airtable         │                            │  │
│  │ └─ Send email               │                            │  │
│  │                             │                            │  │
│  │ shared/                     │                            │  │
│  │ ├─ scoring-engine.ts ◄──────┘                            │  │
│  │ ├─ airtable.ts ──────────────────────┐                   │  │
│  │ └─ email.ts ─────────────────────┐   │                   │  │
│  └──────────────────────────────────│───│───────────────────┘  │
└────────────┬──────────────────────┬─│───│───────────────────────┘
             │ HTTP POST (PDF)      │ │   │
             │                      │ │   │
             ▼                      │ │   │
┌─────────────────────────────────┐ │ │   │
│  Azure Function App:            │ │ │   │
│  PDF Generator Service          │ │ │   │
│  services/pdf-generator/        │ │ │   │
│  ┌──────────────────────────┐   │ │ │   │
│  │ generatePDF/             │   │ │ │   │
│  │ ├─ Receive report data   │   │ │ │   │
│  │ ├─ Generate HTML         │   │ │ │   │
│  │ ├─ Puppeteer → PDF       │   │ │ │   │
│  │ └─ Return base64 PDF     │   │ │ │   │
│  │                          │   │ │ │   │
│  │ shared/                  │   │ │ │   │
│  │ ├─ pdf-engine.ts         │   │ │ │   │
│  │ └─ pdf-template.ts       │   │ │ │   │
│  └──────────────────────────┘   │ │ │   │
└─────────────────────────────────┘ │ │   │
                                    │ │   │
                                    ▼ │   │
                        ┌──────────────────────┐
                        │  Airtable Base       │
                        │  apptxnwqucezx8knv   │
                        │  ┌────────────────┐  │
                        │  │ Shadow-AI-     │  │
                        │  │ Submissions    │  │
                        │  │ (Table)        │  │
                        │  └────────────────┘  │
                        └──────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────┐
                        │  Azure Logic App     │
                        │  Email Workflow      │
                        │  ┌────────────────┐  │
                        │  │ HTTP Trigger   │  │
                        │  │ Format Email   │  │
                        │  │ Attach PDF     │  │
                        │  │ Send via       │  │
                        │  │ SendGrid/O365  │  │
                        │  └────────────────┘  │
                        └──────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────┐
                        │   User's Email       │
                        │   📧 PDF Report      │
                        └──────────────────────┘
```

## 🔑 Key Components

### 1. Frontend (Static Web App)
- **Technology:** HTML, CSS, JavaScript
- **Hosting:** Azure Static Web Apps
- **Purpose:** User interface for assessment
- **URL:** `https://<app-name>.azurestaticapps.net`

### 2. Shadow AI Assessment API (Function App)
- **Runtime:** Node.js 20
- **Hosting:** Azure Functions (Consumption or Premium)
- **Purpose:**
  - Process assessment submissions
  - Orchestrate PDF generation
  - Save to Airtable
  - Trigger email delivery
- **Endpoints:**
  - `POST /api/processAssessment` - Main handler

### 3. PDF Generator Service (Function App)
- **Runtime:** Node.js 20
- **Hosting:** Azure Functions Premium (for memory)
- **Purpose:** Generate PDF reports using Puppeteer
- **Endpoints:**
  - `POST /api/generatePDF` - Generate PDF (requires function key)
- **Why Separate:** CPU/memory intensive, reusable across tools

### 4. Airtable
- **Purpose:** Store assessment submissions
- **Structure:**
  - One base for all tools
  - One table per assessment type
  - Example: `Shadow-AI-Submissions`, `Compliance-Checker`

### 5. Azure Logic App
- **Purpose:** Send emails with PDF attachments
- **Trigger:** HTTP request from Assessment API
- **Actions:** Format email, attach PDF, send via SendGrid/Office 365

## 🔄 Request Flow

### Successful Submission

```
1. User fills form
   ↓
2. Frontend validates
   ↓
3. POST to Assessment API
   ↓
4. Assessment API:
   - Validates data ✓
   - Calculates score ✓
   - Calls PDF service ✓
   ↓
5. PDF Service:
   - Generates HTML ✓
   - Puppeteer → PDF ✓
   - Returns base64 PDF ✓
   ↓
6. Assessment API:
   - Saves to Airtable ✓
   - Calls Logic App ✓
   ↓
7. Logic App:
   - Formats email ✓
   - Attaches PDF ✓
   - Sends via SendGrid ✓
   ↓
8. User receives:
   - Success message in browser ✓
   - Email with PDF report ✓
```

## 🌐 Environment Variables

### Per Tool Configuration
Each assessment tool has its own `local.settings.json` (local) or App Settings (Azure):

```json
{
  "AIRTABLE_TABLE_NAME": "Shadow-AI-Submissions",  // ← Different per tool
  "AIRTABLE_BASE_ID": "apptxnwqucezx8knv",        // ← Same for all
  "AIRTABLE_API_KEY": "pat...",                    // ← Same for all
  "LOGIC_APP_EMAIL_URL": "https://...",            // ← Same for all
  "PDF_SERVICE_URL": "https://...",                // ← Same for all
  "PDF_SERVICE_KEY": "...",                        // ← Same for all
}
```

## 💰 Cost Breakdown (per month, NZD)

| Component | Service | Plan | Est. Cost |
|-----------|---------|------|-----------|
| Frontend | Static Web App | Free tier | $0 |
| Assessment API | Function App | Consumption | $10-30 |
| PDF Generator | Function App | Premium EP1 | $75-150* |
| Storage | Storage Account | Standard LRS | $5 |
| Airtable | Pro Plan | Per workspace | $20 USD |
| SendGrid/O365 | Email | Existing/Free tier | $0-10 |
| **Total** | | | **$110-215** |

*Premium required for Puppeteer memory requirements

## 📊 Scaling Strategy

### Current (1 Assessment Tool)
- 1 Frontend
- 1 Assessment API
- 1 PDF Generator (shared)

### With 5 Assessment Tools
- 5 Frontends (Static Web Apps - free)
- 5 Assessment APIs (Consumption plan)
- 1 PDF Generator (shared, scale with Premium)
- 1 Airtable base, 5 tables

**Cost for 5 tools:** ~$200-300/month

### With 10-20 Tools
- Consider Azure API Management for routing
- Scale PDF Generator to EP2 or add instances
- Consider dedicated SendGrid plan

## 🔒 Security

- ✅ HTTPS everywhere
- ✅ Function-level auth on PDF service
- ✅ CORS configured per frontend
- ✅ API keys stored in App Settings (not code)
- ✅ Airtable API key secured
- ✅ No secrets in frontend code

## 📈 Monitoring

- Application Insights on all Function Apps
- Track:
  - Request volume
  - Response times
  - Error rates
  - PDF generation time
  - Email delivery success

## 🔄 Adding New Assessment Tool

1. Copy `tools/shadow-ai-assessment/`
2. Update table name in config
3. Create table in Airtable
4. Deploy new Function App
5. Deploy new Static Web App

**No changes needed to:**
- PDF Generator Service
- Email Logic App
- Airtable base

---

**Last Updated:** October 2025