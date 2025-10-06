# Fast Track Guide: Idea → Deployed Assessment

From concept to production in **30 minutes** (frontend-only) or **2 hours** (full-stack).

## 🎯 Choose Your Pattern

### Pattern 1: Frontend-Only Tool (30 min)
**Best for**: Calculators, diagnostic tools with instant results, no email delivery needed

**Examples**: ROI Calculator

**Pros**:
- ✅ Zero backend costs
- ✅ Instant results
- ✅ No email/PDF infrastructure needed
- ✅ Fastest to deploy

**Cons**:
- ❌ No email delivery
- ❌ No data collection
- ❌ No PDF reports

### Pattern 2: Full-Stack Assessment (2 hours)
**Best for**: Lead generation tools, comprehensive assessments with email reports

**Examples**: Shadow AI Assessment, Business Readiness, Board Governance, Personal AI Readiness

**Pros**:
- ✅ Email delivery with PDF reports
- ✅ Lead capture (Airtable)
- ✅ Professional branded PDFs
- ✅ Backend scoring logic

**Cons**:
- ❌ Requires backend deployment
- ❌ Additional Azure costs (~$10-30/month per tool)

---

## 🚀 Pattern 1: Frontend-Only Tool

### ⏱️ Time: 30 minutes

### Step 1: Create Project Structure (5 min)

```bash
# From repo root
mkdir -p tools/my-new-tool/frontend/assets/{css,js}

cd tools/my-new-tool/frontend
```

### Step 2: Build Your HTML (10 min)

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Assessment | GenerationAI</title>
    <link rel="stylesheet" href="/assets/css/brand.css">
</head>
<body>
    <nav class="nav">
        <div class="container">
            <div class="nav__container">
                <a href="https://www.generationai.co.nz" class="nav__logo">
                    <img src="https://static.wixstatic.com/shapes/b0568f_2942ee61a69b4761b4b39eaca7086c80.svg" alt="GenerationAI">
                </a>
            </div>
        </div>
    </nav>

    <!-- Your form here -->
    <section class="section">
        <div class="container" style="max-width: 800px;">
            <h1>My Assessment Tool</h1>
            <form id="assessment-form">
                <!-- Add your questions -->
            </form>
        </div>
    </section>

    <!-- Results section (hidden by default) -->
    <section class="section section--light" id="results" style="display: none;">
        <div class="container" style="max-width: 800px;">
            <h2>Your Results</h2>
            <div id="results-display"></div>
        </div>
    </section>

    <script src="/assets/js/calculator.js"></script>
</body>
</html>
```

### Step 3: Add CSS (2 min)

**Copy from existing tool**:
```bash
cp ../roi-calculator/frontend/assets/css/brand.css assets/css/
```

### Step 4: Add JavaScript Logic (10 min)

Create `assets/js/calculator.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessment-form');
    const resultsSection = document.getElementById('results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Your calculation logic here
        const result = calculateResult();

        // Display results
        displayResults(result);

        // Show results, hide form
        form.style.display = 'none';
        resultsSection.style.display = 'block';
    });

    function calculateResult() {
        // Your logic here
        return { score: 85 };
    }

    function displayResults(result) {
        document.getElementById('results-display').innerHTML = `
            <div class="result-card">
                <h3>Your Score: ${result.score}</h3>
            </div>
        `;
    }
});
```

### Step 5: Add Azure Config (1 min)

Create `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/assets/*",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*"]
  }
}
```

### Step 6: Create GitHub Workflow (2 min)

Create `.github/workflows/deploy-my-new-tool-frontend.yml`:

```yaml
name: Deploy My New Tool Frontend

on:
  push:
    branches:
      - main
    paths:
      - 'tools/my-new-tool/frontend/**'
      - '.github/workflows/deploy-my-new-tool-frontend.yml'

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MY_TOOL }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/tools/my-new-tool/frontend"
          output_location: "."
```

### Step 7: Deploy to Azure (10 min)

```bash
# 1. Create Azure Static Web App (if not exists)
az staticwebapp create \
  --name generationai-my-new-tool \
  --resource-group rg-assessments-prod-nzn \
  --source https://github.com/GenerationAI-2/shadow-ai-assessment \
  --location eastasia \
  --branch main \
  --app-location "/tools/my-new-tool/frontend" \
  --output-location "." \
  --sku Free

# 2. Get deployment token
az staticwebapp secrets list \
  --name generationai-my-new-tool \
  --resource-group rg-assessments-prod-nzn \
  --query "properties.apiKey" --output tsv

# 3. Add to GitHub Secrets
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_MY_TOOL --body "<token>"

# 4. Commit and push
git add .
git commit -m "Add My New Tool"
git push origin main
```

**Done!** Your tool deploys automatically in ~2 minutes.

---

## 🏗️ Pattern 2: Full-Stack Assessment

### ⏱️ Time: 2 hours

### Prerequisites
- Airtable account with base ID `apptxnwqucezx8knv`
- Azure subscription
- Access to shared PDF Generator Service

### Step 1: Copy Template (5 min)

```bash
# Copy Shadow AI Assessment as template
cp -r tools/shadow-ai-assessment tools/my-new-assessment
cd tools/my-new-assessment
```

### Step 2: Update Package Names (5 min)

**File: `api/package.json`**
```json
{
  "name": "my-new-assessment-api",
  "description": "Azure Functions API for My New Assessment",
  "scripts": {
    "build": "tsc",
    "start": "func start",
    "dev": "tsc --watch"
  }
}
```

### Step 3: Create Airtable Table (10 min)

1. Go to [Airtable base](https://airtable.com/apptxnwqucezx8knv)
2. Create new table: **"My-New-Assessment"**
3. Add fields:
   ```
   - Email (Single line text)
   - Contact Name (Single line text)
   - Company (Single line text)
   - Score (Number)
   - Maturity Band (Single select: At Risk, Aware, Active, Advanced)
   - Submitted (Date)
   - [Your custom question fields...]
   ```

### Step 4: Configure Scoring Logic (30 min)

**File: `api/shared/scoring-config.ts`**

Define your questions and scoring:

```typescript
export const questionWeights = {
  question1: 10,
  question2: 15,
  question3: 20,
  // ... your questions
};

export const answerScores = {
  question1: {
    'optionA': 0,
    'optionB': 5,
    'optionC': 10
  },
  // ... your scoring
};

export function calculateMaturityBand(score: number): string {
  if (score < 25) return 'At Risk';
  if (score < 50) return 'Aware';
  if (score < 75) return 'Active';
  return 'Advanced';
}
```

**File: `api/shared/scoring-engine.ts`**

Update field mappings to match your Airtable:

```typescript
interface SubmissionRecord {
  Email: string;
  'Contact Name': string;
  Company: string;
  Score: number;
  'Maturity Band': string;
  Submitted: string;
  // Add your custom fields
  'Question 1': string;
  'Question 2': string;
}
```

### Step 5: Customize Frontend (20 min)

**File: `frontend/index.html`**

Update:
- Title and branding
- Questions to match your assessment
- Form field names to match scoring config

### Step 6: Update Environment Config (5 min)

**File: `api/local.settings.json`** (for local testing)

```json
{
  "Values": {
    "AIRTABLE_API_KEY": "your_key",
    "AIRTABLE_BASE_ID": "apptxnwqucezx8knv",
    "AIRTABLE_TABLE_NAME": "My-New-Assessment",
    "LOGIC_APP_EMAIL_URL": "your_logic_app_url",
    "PDF_SERVICE_URL": "http://localhost:7072/api/generatePDF",
    "ALLOWED_ORIGIN": "*"
  }
}
```

### Step 7: Test Locally (10 min)

```bash
# Terminal 1: Start PDF service
cd services/pdf-generator
pnpm start  # Port 7072

# Terminal 2: Build and start API
cd tools/my-new-assessment/api
pnpm install
pnpm build
pnpm start  # Port 7071

# Terminal 3: Serve frontend
cd tools/my-new-assessment/frontend
python3 -m http.server 8080
```

Visit http://localhost:8080 and test!

### Step 8: Deploy API to Azure (15 min)

```bash
# 1. Create Azure Function App
az functionapp create \
  --name generationai-my-new-assessment \
  --resource-group rg-assessments-prod-nzn \
  --consumption-plan-location newzealandnorth \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --storage-account <storage-account>

# 2. Build and deploy
cd tools/my-new-assessment/api
pnpm build
func azure functionapp publish generationai-my-new-assessment

# 3. Configure environment variables
az functionapp config appsettings set \
  --name generationai-my-new-assessment \
  --resource-group rg-assessments-prod-nzn \
  --settings \
    AIRTABLE_TABLE_NAME="My-New-Assessment" \
    AIRTABLE_API_KEY="$AIRTABLE_API_KEY" \
    AIRTABLE_BASE_ID="apptxnwqucezx8knv" \
    LOGIC_APP_EMAIL_URL="$LOGIC_APP_EMAIL_URL" \
    PDF_SERVICE_URL="https://generationai-pdf.azurewebsites.net/api/generatePDF" \
    PDF_SERVICE_KEY="$PDF_SERVICE_KEY" \
    ALLOWED_ORIGIN="https://your-frontend.azurestaticapps.net"
```

### Step 9: Deploy Frontend (10 min)

```bash
# 1. Create Static Web App
az staticwebapp create \
  --name generationai-my-new-assessment-frontend \
  --resource-group rg-assessments-prod-nzn \
  --source https://github.com/GenerationAI-2/shadow-ai-assessment \
  --location eastasia \
  --branch main \
  --app-location "/tools/my-new-assessment/frontend" \
  --output-location "." \
  --sku Free

# 2. Get deployment token
az staticwebapp secrets list \
  --name generationai-my-new-assessment-frontend \
  --resource-group rg-assessments-prod-nzn \
  --query "properties.apiKey" --output tsv

# 3. Add to GitHub Secrets
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_MY_NEW_ASSESSMENT --body "<token>"
```

### Step 10: Create GitHub Workflows (5 min)

**Frontend workflow**: `.github/workflows/deploy-my-new-assessment-frontend.yml`
**API workflow**: `.github/workflows/deploy-my-new-assessment-api.yml`

(Copy from existing tools and update paths/names)

### Step 11: Push and Deploy (5 min)

```bash
git add .
git commit -m "Add My New Assessment tool"
git push origin main
```

Watch GitHub Actions for deployment status!

---

## ✅ Post-Deployment Checklist

### For Both Patterns
- [ ] Test on mobile and desktop
- [ ] Verify forms submit correctly
- [ ] Check results display properly
- [ ] Test with edge cases
- [ ] Update PROJECT_STATUS.md with URLs
- [ ] Add to main README.md tool table

### For Full-Stack Only
- [ ] Verify email delivery works
- [ ] Check PDF generation and formatting
- [ ] Confirm Airtable data is saving
- [ ] Test with real email address
- [ ] Enable Application Insights monitoring
- [ ] Configure CORS if needed

---

## 🆘 Common Issues

### Frontend-Only
**Issue**: Assets not loading
**Fix**: Check `staticwebapp.config.json` routes and paths

**Issue**: Form submission errors
**Fix**: Check JavaScript console for errors

### Full-Stack
**Issue**: PDF generation fails
**Fix**: Verify PDF_SERVICE_URL and PDF_SERVICE_KEY in function app settings

**Issue**: Email not sending
**Fix**: Test LOGIC_APP_EMAIL_URL directly with curl

**Issue**: Airtable save fails
**Fix**: Verify table name matches exactly (case-sensitive)

**Issue**: CORS errors
**Fix**: Update ALLOWED_ORIGIN in function app settings

---

## 📊 Time Breakdown

### Frontend-Only (30 min)
1. Create structure: 5 min
2. Build HTML: 10 min
3. Add CSS: 2 min
4. JavaScript logic: 10 min
5. Deploy: 3 min

### Full-Stack (2 hours)
1. Copy template: 5 min
2. Update packages: 5 min
3. Create Airtable table: 10 min
4. Configure scoring: 30 min
5. Customize frontend: 20 min
6. Environment config: 5 min
7. Test locally: 10 min
8. Deploy API: 15 min
9. Deploy frontend: 10 min
10. Create workflows: 5 min
11. Push and verify: 5 min

---

## 💡 Pro Tips

1. **Start Frontend-Only**: Build quick prototype, add backend later if needed
2. **Copy, Don't Create**: Use existing tools as templates
3. **Test Locally First**: Always verify before deploying
4. **Use Shared Services**: Don't duplicate PDF/Email logic
5. **Follow Naming Conventions**: Consistent naming = easier management
6. **Document As You Go**: Update PROJECT_STATUS.md immediately

---

**Questions?** Check [DEVELOPER_ONBOARDING.md](DEVELOPER_ONBOARDING.md) or existing tool implementations.
