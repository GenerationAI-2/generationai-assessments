# Adding a New Assessment Tool

This guide shows you how to add a new assessment tool to the monorepo (e.g., Compliance Checker, Risk Calculator).

## 🚀 Quick Start

### 1. Copy the Shadow AI Template

```bash
# From monorepo root
cp -r tools/shadow-ai-assessment tools/compliance-checker
cd tools/compliance-checker
```

### 2. Update Package Names

**File:** `api/package.json`
```json
{
  "name": "compliance-checker-api",  // Change this
  "description": "Azure Functions API for Compliance Checker"
}
```

**File:** `frontend/index.html`
- Update title and branding
- Update form questions

### 3. Configure Airtable Table

**File:** `api/local.settings.json`
```json
{
  "Values": {
    "AIRTABLE_TABLE_NAME": "Compliance-Checker",  // NEW TABLE NAME
    "AIRTABLE_BASE_ID": "apptxnwqucezx8knv",     // Same base
    "LOGIC_APP_EMAIL_URL": "...",                 // Same endpoint
    "PDF_SERVICE_URL": "http://localhost:7072/api/generatePDF"
  }
}
```

### 4. Create Airtable Table

Go to Airtable base `apptxnwqucezx8knv`:

1. Create new table: **"Compliance-Checker"**
2. Add fields based on your questions:
   ```
   - Email (Single line text)
   - Contact Name (Single line text)
   - Company (Single line text)
   - Score (Number)
   - Maturity Band (Single select)
   - Submitted (Date)
   - [Your custom fields...]
   ```

### 5. Customize Assessment Logic

**File:** `api/shared/scoring-config.ts`
- Define your questions and scoring rules
- Update maturity bands if different

**File:** `api/shared/scoring-engine.ts`
- Adjust scoring algorithm if needed
- Modify field mappings

**File:** `api/shared/airtable.ts`
- Update `SubmissionRecord` interface with your fields
- Update field mappings in `saveToAirtable()`

### 6. Customize PDF Template

**Option A:** Use shared PDF service with custom data
```typescript
// In processAssessment/index.ts
const pdfRequest: PDFGenerationRequest = {
  reportData: {
    company_name: submission.company_name,
    total_score: scoringResult.metadata.score.toString(),
    // Add your custom fields
    regulation_type: submission.regulation_type,
    data_residency: submission.data_residency,
    // ...
  }
};
```

**Option B:** Create tool-specific PDF template
- Copy `services/pdf-generator/shared/pdf-template.ts`
- Customize for your assessment type
- Deploy as separate function if very different

### 7. Update Email Template

**File:** `api/shared/email.ts`

Update `generateEmailHTML()` to match your branding:
```typescript
function generateEmailHTML(options: EmailOptions): string {
  return `
    <h1>Your Compliance Assessment Results</h1>
    <p>Dear ${options.recipientName},</p>
    <p>Your compliance score: ${options.score}</p>
    // Customize as needed
  `;
}
```

### 8. Build and Test Locally

```bash
# Build the new tool
cd tools/compliance-checker/api
pnpm install
pnpm build

# Start on different port for testing
func start --port 7073
```

### 9. Deploy to Azure

```bash
# Create new Azure Function App
az functionapp create \
  --name generationai-compliance-checker \
  --resource-group your-rg \
  --consumption-plan-location newzealandnorth \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4

# Deploy
cd tools/compliance-checker/api
pnpm build
func azure functionapp publish generationai-compliance-checker

# Configure environment variables
az functionapp config appsettings set \
  --name generationai-compliance-checker \
  --settings \
    AIRTABLE_TABLE_NAME="Compliance-Checker" \
    AIRTABLE_API_KEY="$AIRTABLE_API_KEY" \
    AIRTABLE_BASE_ID="apptxnwqucezx8knv" \
    LOGIC_APP_EMAIL_URL="$LOGIC_APP_EMAIL_URL" \
    PDF_SERVICE_URL="https://generationai-pdf.azurewebsites.net/api/generatePDF" \
    PDF_SERVICE_KEY="$PDF_SERVICE_KEY"
```

## 📋 Checklist for New Assessment

- [ ] Copy template from `tools/shadow-ai-assessment`
- [ ] Update package.json name
- [ ] Create Airtable table with custom fields
- [ ] Update `AIRTABLE_TABLE_NAME` in settings
- [ ] Customize scoring logic in `scoring-config.ts`
- [ ] Update field mappings in `airtable.ts`
- [ ] Customize email template in `email.ts`
- [ ] Update frontend questions
- [ ] Test locally
- [ ] Create Azure Function App
- [ ] Deploy and configure environment variables
- [ ] Test in production

## 🎯 What Gets Shared (No Changes Needed)

- ✅ PDF Generator Service (`services/pdf-generator`)
- ✅ Shared Types (`@generation-ai/types`)
- ✅ Shared Utils (`@generation-ai/utils`)
- ✅ Email Logic App endpoint
- ✅ Airtable base (just add new table)

## 🔧 What Gets Customized (Per Tool)

- 📝 Assessment questions (frontend)
- 📝 Scoring configuration
- 📝 Airtable field mappings
- 📝 Email template HTML
- 📝 PDF report data (if needed)

## 💡 Tips

1. **Keep the Same Structure:** Don't rename folders like `processAssessment/` - Azure Functions expects these
2. **Reuse Types:** Import from `@generation-ai/types` instead of duplicating
3. **Test Locally First:** Always test with local settings before deploying
4. **One Table Per Tool:** Easier to manage and query
5. **Same Email Endpoint:** Unless you need different branding/logic

## 🆘 Common Issues

**Q: Can I use a different Airtable base?**
A: Yes, just change `AIRTABLE_BASE_ID` - but keeping one base is simpler

**Q: Do I need a separate PDF service?**
A: No, all tools share the same PDF generator service

**Q: How do I test without deploying?**
A: Run locally on different port (e.g., 7073, 7074) and update frontend API endpoint

**Q: Can tools share scoring logic?**
A: Yes! Move common scoring to `shared/utils` and import it

---

**Estimated time to add new assessment:** 2-4 hours