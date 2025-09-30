# Quick Start Guide - Monorepo Setup

## ✅ Migration Complete!

Your project has been successfully restructured as a monorepo. Here's everything you need to know to get started.

## 🏗️ What Changed?

### Before
```
Shadow AI Assessment/
├── api/                    # Everything in one Azure Function
│   ├── processAssessment/
│   ├── testPDF/
│   └── shared/            # PDF generation, scoring, email
└── frontend/
```

### After
```
generation-ai-tools/       # Monorepo
├── tools/shadow-ai-assessment/
│   ├── api/              # Assessment logic only
│   └── frontend/
├── services/pdf-generator/ # Separate service
├── shared/
│   ├── types/            # @generation-ai/types
│   └── utils/            # @generation-ai/utils
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build All Packages
```bash
pnpm build
```

### 3. Run Services Locally

**Terminal 1 - PDF Generator Service (Port 7072):**
```bash
cd services/pdf-generator
pnpm start
```

**Terminal 2 - Assessment API (Port 7071):**
```bash
cd tools/shadow-ai-assessment/api
pnpm start
```

### 4. Test PDF Service
```bash
# Test PDF generation
curl http://localhost:7072/api/testPDF --output test.pdf

# Open the PDF
open test.pdf  # macOS
# or
xdg-open test.pdf  # Linux
```

### 5. Test Full Flow
Create a test submission file (`test-submission.json`):
```json
{
  "email": "test@example.com",
  "contact_name": "Test User",
  "company_name": "Test Company",
  "org_size": "IwNGTfgstrR5",
  "sector": "Dt50cUdkTt05",
  "access": "5yHSaK0w5Cnh",
  "incidents": "yBmhWjsKq98K",
  "approval": "CL5RWrwBaIO1",
  "usage_visibility": "0MioVOcLjwqk",
  "detection": "y9exKrGGiXlu",
  "policy": "qZb3RtYzGmvw",
  "training": "F1Agc0r7fg3m",
  "risk_concerns": ["edxiDFVkVomW"],
  "exposure": "Z7aEY1IJMnnP",
  "traceability": "qI36qW6J22Fh",
  "compliance_awareness": "NGq4zhF6eLsm"
}
```

Then:
```bash
curl -X POST http://localhost:7071/api/processAssessment \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

## 📦 Workspace Commands

### Build Specific Packages
```bash
# Build shared types (run this first if types change)
pnpm --filter @generation-ai/types build

# Build PDF service
pnpm --filter pdf-generator build

# Build assessment API
pnpm --filter shadow-ai-assessment-api build
```

### Clean Build Artifacts
```bash
pnpm -r clean
```

## 🔧 Environment Setup

### For Local Development

Create `tools/shadow-ai-assessment/api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AIRTABLE_API_KEY": "your_key",
    "AIRTABLE_BASE_ID": "your_base",
    "LOGIC_APP_EMAIL_URL": "your_url",
    "PDF_SERVICE_URL": "http://localhost:7072/api/generatePDF",
    "NODE_ENV": "development",
    "ALLOWED_ORIGIN": "*"
  }
}
```

Create `services/pdf-generator/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development"
  }
}
```

## 🎯 Key Architecture Points

### 1. PDF Service is Separate
- **Shadow AI Assessment API** calls PDF service via HTTP
- **PDF Service** runs on different port (7072)
- In production, they're separate Azure Function Apps

### 2. Shared Types Keep Everything in Sync
```typescript
// In shadow-ai-assessment-api
import { AssessmentSubmission, PDFGenerationRequest } from '@generation-ai/types';

// In pdf-generator
import { ReportData, PDFGenerationResponse } from '@generation-ai/types';
```

### 3. Assessment API Flow
```
User → Frontend → Assessment API → PDF Service → Email
                        ↓
                    Airtable
```

## 🚢 Deployment Overview

### Two Azure Function Apps Required

1. **PDF Generator Service**
   - Name: `generationai-pdf-generator` (example)
   - Requires: Consumption or Premium plan (for Puppeteer memory)
   - Endpoint: `/api/generatePDF`

2. **Shadow AI Assessment API**
   - Name: `generationai-shadow-ai` (example)
   - Environment Variables: Must include `PDF_SERVICE_URL` and `PDF_SERVICE_KEY`
   - Endpoint: `/api/processAssessment`

### Quick Deploy
```bash
# 1. Deploy PDF service first
cd services/pdf-generator
pnpm build
func azure functionapp publish <pdf-generator-app-name>

# 2. Deploy Assessment API
cd tools/shadow-ai-assessment/api
pnpm build
func azure functionapp publish <shadow-ai-assessment-app-name>

# 3. Update environment variables (see MONOREPO_MIGRATION.md)
```

## 🆘 Troubleshooting

### "Cannot find module '@generation-ai/types'"
```bash
# Rebuild shared packages first
pnpm --filter @generation-ai/types build
pnpm --filter @generation-ai/utils build

# Then rebuild your service
pnpm --filter shadow-ai-assessment-api build
```

### "PDF Service not responding"
```bash
# Make sure PDF service is running on port 7072
lsof -ti:7072

# Check environment variable
cd tools/shadow-ai-assessment/api
cat local.settings.json | grep PDF_SERVICE_URL
```

### "Puppeteer fails to install"
```bash
# For local development, use full Puppeteer
cd services/pdf-generator
NODE_ENV=development pnpm install
```

## 📚 Next Steps

1. Read [MONOREPO_MIGRATION.md](./MONOREPO_MIGRATION.md) for complete architecture details
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for Azure deployment guide
3. Set up CI/CD pipeline (Week 3 of migration plan)

## 💡 Tips

- Use `pnpm build` at root to build everything
- Changes to `shared/types` or `shared/utils` require rebuilding all dependent packages
- Keep both services running in development (ports 7071 and 7072)
- The old `api/` and `frontend/` directories can be deleted after verifying everything works

---

**Happy coding!** 🎉