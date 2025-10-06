# Infrastructure Overview

Complete architecture documentation for GenerationAI Assessment Tools.

## 🏗️ Two Architecture Patterns

We use two distinct patterns depending on the tool's requirements:

### Pattern 1: Full-Stack Assessment (4 tools)
**Tools**: Shadow AI, Business Readiness, Board Governance, Personal AI Readiness

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│            https://<tool>.generationai.co.nz (pending)          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Azure Static Web App (Frontend)                │
│                 tools/<tool>/frontend/                          │
│  • HTML/CSS/JavaScript                                          │
│  • Form validation                                              │
│  • Progress tracking                                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS POST
                            │ /api/processAssessment
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Function App (Assessment API)                │
│                  tools/<tool>/api/                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ processAssessment/                                       │  │
│  │ ├─ Validate submission                                   │  │
│  │ ├─ Run scoring engine                                    │  │
│  │ ├─ Call PDF service ─────────────────┐                   │  │
│  │ ├─ Save to Airtable ─────────────────│──────┐            │  │
│  │ └─ Send email via Logic App ─────────│──────│──┐         │  │
│  └──────────────────────────────────────│──────│──│─────────┘  │
└──────────────────────────────────────────│──────│──│─────────────┘
                                           │      │  │
┌─────────────────────────────────────────┐│      │  │
│  PDF Generator Service (SHARED)         ││      │  │
│  services/pdf-generator/                ││      │  │
│  ┌────────────────────────────────────┐ ││      │  │
│  │ generatePDF/                       │ ││      │  │
│  │ ├─ Receive report data             │◄─┘      │  │
│  │ ├─ Generate HTML template          │         │  │
│  │ ├─ Puppeteer → PDF                 │         │  │
│  │ └─ Return base64 PDF               │         │  │
│  └────────────────────────────────────┘         │  │
└──────────────────────────────────────────────────┘  │
                                                      │  │
                             ┌────────────────────────┘  │
                             │                           │
                             ▼                           ▼
              ┌──────────────────────┐     ┌──────────────────────┐
              │  Airtable Base       │     │  Azure Logic App     │
              │  apptxnwqucezx8knv   │     │  Email Service       │
              │  ┌────────────────┐  │     │  ┌────────────────┐  │
              │  │ Tool-Specific  │  │     │  │ HTTP Trigger   │  │
              │  │ Table          │  │     │  │ Format Email   │  │
              │  │ (4 tables)     │  │     │  │ Attach PDF     │  │
              │  └────────────────┘  │     │  │ Send Email     │  │
              └──────────────────────┘     │  └────────────────┘  │
                                           └──────────────────────┘
                                                      │
                                                      ▼
                                           ┌──────────────────────┐
                                           │   User's Email       │
                                           │   📧 PDF Report      │
                                           └──────────────────────┘
```

### Pattern 2: Frontend-Only Tool (1 tool)
**Tools**: ROI Calculator

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│              https://roi.generationai.co.nz (pending)           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│           Azure Static Web App (Frontend Only)                  │
│               tools/roi-calculator/frontend/                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ HTML Form                                                │  │
│  │ ├─ Input fields                                          │  │
│  │ ├─ Client-side JavaScript                               │  │
│  │ ├─ Calculate results instantly                          │  │
│  │ └─ Display results on same page                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  • No backend calls                                             │
│  • No data collection                                           │
│  • Instant results                                              │
│  • Zero additional cost                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Deployed Tools Overview

| Tool | Pattern | Frontend URL | API URL |
|------|---------|-------------|---------|
| Shadow AI | Full-Stack | proud-moss-0374e9300.1.azurestaticapps.net | generationai-shadow-ai.azurewebsites.net |
| Business Readiness | Full-Stack | lively-bay-0fbbe1300.2.azurestaticapps.net | generationai-business-readiness.azurewebsites.net |
| Board Governance | Full-Stack | thankful-grass-030658000.2.azurestaticapps.net | board-governance-api.azurewebsites.net |
| Personal AI Readiness | Full-Stack | gentle-smoke-098f1d000.2.azurestaticapps.net | personal-ai-readiness-api.azurewebsites.net |
| ROI Calculator | Frontend-Only | orange-wave-0ba8d4200.1.azurestaticapps.net | N/A |

---

## 🔑 Key Components

### 1. Frontend (Azure Static Web Apps)

**Technology**: HTML, CSS, JavaScript
**Cost**: Free tier
**Count**: 5 (one per tool)

**Full-Stack Frontend**:
- Assessment form with multiple questions
- Form validation
- Progress tracking
- Calls backend API on submit

**Frontend-Only**:
- Assessment form
- Client-side calculation logic
- Results display
- No backend interaction

**Deployment**: Auto via GitHub Actions on push to `main`

---

### 2. Assessment APIs (Azure Function Apps - Consumption)

**Technology**: Node.js 20, TypeScript
**Cost**: ~$10-30/month per tool
**Count**: 4 (Shadow AI, Business Readiness, Board Governance, Personal AI)

**Functions**:
- `processAssessment` - Main HTTP endpoint
  - Validates submission data
  - Runs scoring algorithm
  - Calls PDF Generator Service
  - Saves to Airtable
  - Triggers email via Logic App

**Shared Code**:
- `@generation-ai/types` - TypeScript interfaces
- `@generation-ai/utils` - Common utilities (CORS, validation)

**Environment Variables**:
```
AIRTABLE_API_KEY
AIRTABLE_BASE_ID
AIRTABLE_TABLE_NAME (unique per tool)
LOGIC_APP_EMAIL_URL
PDF_SERVICE_URL
PDF_SERVICE_KEY
ALLOWED_ORIGIN
```

---

### 3. PDF Generator Service (Azure Function App - Premium EP1)

**Technology**: Node.js 20, TypeScript, Puppeteer
**Cost**: ~$75-150/month
**Plan**: Premium EP1 (required for Puppeteer memory needs)
**Shared By**: All 4 full-stack tools

**Functions**:
- `generatePDF` - Creates PDF from report data
- `testPDF` - Test endpoint (public)

**Why Separate?**:
- ✅ PDF generation is CPU/memory intensive
- ✅ Scales independently from assessment APIs
- ✅ Shared across all tools (cost efficiency)
- ✅ Can be upgraded without touching assessment logic

**Key Dependencies**:
- `puppeteer` (dev) / `puppeteer-core` + `@sparticuz/chromium` (prod)

---

### 4. Airtable (Data Storage)

**Base ID**: `apptxnwqucezx8knv`
**Tables**: 4 (one per full-stack tool)

**Tables**:
1. `Shadow-AI-Submissions`
2. `Business-Readiness-Submissions`
3. `Board-Governance-Submissions`
4. `Personal-AI-Readiness-Submissions`

**Common Fields**:
- Email
- Contact Name
- Company
- Score
- Maturity Band
- Submitted (date)
- Tool-specific question responses

**Why Airtable?**:
- Easy data review and analysis
- No database management overhead
- Built-in filtering and views
- API is simple and reliable

---

### 5. Email Service (Azure Logic App)

**Technology**: Azure Logic App HTTP trigger
**Shared By**: All 4 full-stack tools
**Cost**: Included in consumption billing (~$0.001/email)

**Flow**:
1. Receive HTTP POST with email data + PDF
2. Format HTML email
3. Attach PDF
4. Send via SendGrid/Office 365
5. Return success/failure

**Payload**:
```json
{
  "to": "user@example.com",
  "recipientName": "John Smith",
  "companyName": "Example Corp",
  "score": "75",
  "maturityBand": "Active",
  "pdfBase64": "<base64-encoded-pdf>",
  "toolName": "Shadow AI Assessment"
}
```

---

## 🔄 Data Flow

### Full-Stack Tool Flow

```
1. User fills form → Frontend
2. Frontend POST → Assessment API
3. API validates + scores
4. API → PDF Service (generate report)
5. PDF Service → returns PDF (base64)
6. API → Airtable (save submission)
7. API → Logic App (send email with PDF)
8. Logic App → User's email
9. API → Frontend (success response)
10. Frontend → shows success page
```

### Frontend-Only Tool Flow

```
1. User fills form → Frontend
2. JavaScript calculates results client-side
3. Frontend displays results
4. No data saved
5. No email sent
```

---

## 💰 Cost Breakdown

| Component | Type | Monthly Cost (NZD) | Notes |
|-----------|------|-------------------|-------|
| PDF Generator | Premium EP1 | $75-150 | Required for Puppeteer |
| Shadow AI API | Consumption | $10-30 | Scales with usage |
| Business Readiness API | Consumption | $10-30 | Scales with usage |
| Board Governance API | Consumption | $10-30 | Scales with usage |
| Personal AI API | Consumption | $10-30 | Scales with usage |
| Static Web Apps (5) | Free | $0 | Free tier |
| Storage Account | Standard | $5 | For function apps |
| Airtable | Pro Plan | ~$27 | External service |
| **Total** | | **$147-302** | Based on moderate usage |

**Cost Per New Tool**:
- Frontend-Only: $0 (uses free Static Web App)
- Full-Stack: $10-30/month (new Function App only, shares PDF service)

---

## 🔐 Security

### CORS Configuration
Each API has `ALLOWED_ORIGIN` set to its frontend URL

### Function Keys
- PDF Service: Requires function key for `generatePDF`
- Assessment APIs: Anonymous (frontend calls only)

### Secrets Management
- Stored in Azure Function App settings
- Not in source code
- `local.settings.json` in `.gitignore`

### Data Privacy
- Airtable data encrypted in transit and at rest
- No PII stored in frontend
- Emails sent via secure Logic App

---

## 📈 Scalability

### Current Capacity
- **Static Web Apps**: Effectively unlimited (CDN)
- **Function Apps (Consumption)**: Auto-scales to 200 instances
- **PDF Generator (Premium)**: Manual scale 1-20 instances
- **Airtable**: 50,000 records/base (Pro plan)

### Bottlenecks
1. **PDF Generation**: Most resource-intensive
   - **Solution**: Premium plan, can scale up to 20 instances
2. **Email Sending**: Logic App throttling
   - **Solution**: Can upgrade to higher tier if needed
3. **Airtable**: API rate limits (5 req/sec)
   - **Solution**: Batching, caching, or migrate to SQL if exceeded

### Monitoring
- **Application Insights**: Enabled on all Function Apps
- **Metrics Tracked**:
  - Request count
  - Response time
  - Error rates
  - PDF generation time
  - Email delivery success rate

---

## 🚀 Deployment Architecture

### GitHub Actions Workflows

**Frontend Deployments** (5 workflows):
- `deploy-shadow-ai-frontend.yml`
- `deploy-business-readiness-frontend.yml`
- `deploy-board-governance-frontend.yml`
- `deploy-personal-ai-readiness-frontend.yml`
- `deploy-roi-calculator-frontend.yml`

**API Deployments** (4 workflows):
- `deploy-shadow-ai-api.yml`
- `deploy-business-readiness-api.yml`
- `deploy-board-governance-api.yml`
- `deploy-personal-ai-readiness-api.yml`

**Shared Service** (1 workflow):
- `deploy-pdf-generator.yml`

### Deployment Triggers
- **Push to `main` branch** in specific paths
- **Example**: `tools/shadow-ai-assessment/frontend/**` triggers Shadow AI frontend deployment

### Deployment Process
1. GitHub Actions detects change
2. Builds project (if needed)
3. Deploys to Azure
4. Runs post-deployment validation
5. Updates deployment status

**Average Deployment Time**:
- Frontend: ~2 minutes
- API: ~3-4 minutes

---

## 🛠️ Development Environment

### Local Development Ports
- PDF Generator: `7072`
- Shadow AI API: `7071`
- Business Readiness API: `7073`
- Board Governance API: `7074`
- Personal AI Readiness API: `7075`
- Any Frontend: `8080` (or any static server)

### Required Tools
- Node.js 20+
- pnpm 8+
- Azure Functions Core Tools v4
- Azure CLI (for deployment)

### Local Testing
```bash
# Start PDF service (required for full-stack)
cd services/pdf-generator && pnpm start

# Start any assessment API
cd tools/shadow-ai-assessment/api && pnpm start

# Serve frontend
cd tools/shadow-ai-assessment/frontend && python3 -m http.server 8080
```

---

## 📋 Adding New Tools

### Frontend-Only Tool (~30 min)
1. Create `tools/new-tool/frontend/`
2. Add HTML/CSS/JS
3. Create GitHub Actions workflow
4. Deploy to new Static Web App

**Cost**: $0

### Full-Stack Tool (~2 hours)
1. Copy `tools/shadow-ai-assessment/`
2. Update scoring logic
3. Create Airtable table
4. Deploy API to new Function App
5. Deploy frontend to new Static Web App
6. Configure environment variables

**Cost**: +$10-30/month
**Reuses**: PDF Generator, Email Logic App, Airtable base

See [FAST_TRACK_GUIDE.md](../FAST_TRACK_GUIDE.md) for detailed instructions.

---

## 🔍 Monitoring & Alerts

### Application Insights Queries

**Failed Requests**:
```kusto
requests
| where success == false
| summarize count() by name, resultCode
```

**PDF Generation Time**:
```kusto
dependencies
| where name contains "generatePDF"
| summarize avg(duration), max(duration), percentile(duration, 95)
```

**Email Delivery Success**:
```kusto
dependencies
| where name contains "Logic App"
| summarize successRate = 100.0 * countif(success == true) / count()
```

### Recommended Alerts
- Response time > 5 seconds
- Error rate > 5%
- PDF generation failures
- Email delivery failures
- Function app availability < 99%

---

## 📞 Support & Troubleshooting

**For deployment issues**: Check GitHub Actions logs
**For runtime issues**: Check Application Insights in Azure Portal
**For email issues**: Test Logic App endpoint directly
**For PDF issues**: Check Premium EP1 plan is active

---

**Architecture Version**: 2.0
**Last Updated**: October 2025
**Maintained By**: GenerationAI Development Team
