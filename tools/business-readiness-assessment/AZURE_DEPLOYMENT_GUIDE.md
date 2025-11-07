# Business AI Readiness Assessment - Azure Deployment Guide

**🎯 Goal: First-Shot Success Deployment**

This guide deploys the Business AI Readiness Assessment to Azure with zero errors.

---

## 📦 What You're Deploying

**3 Azure Components:**
1. **PDF Generator Service** (Azure Function) - Port 7073 locally
2. **Business Readiness API** (Azure Function) - Port 7072 locally  
3. **Frontend** (Azure Static Web App) - Port 3000 locally

**New Features to Verify:**
- ✅ Results page with HubSpot scheduler
- ✅ 3-tier tension lines (≤40 / 41-70 / 71-100)
- ✅ AI Readiness Playbook section
- ✅ Micro-recommendations for priority gaps
- ✅ Score-based color coding (traffic light system)
- ✅ Conditional gaps rendering (hides if perfect score)
- ✅ PDF generation with retry/backoff
- ✅ Success footer message

---

## 🎬 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Azure CLI** installed: `az --version` shows version 2.50+
- [ ] **Azure Subscription** with Owner/Contributor access
- [ ] **Node.js 20.x**: `node --version` shows v20.x
- [ ] **pnpm installed**: `pnpm --version` shows 8.x+
- [ ] **Azure Functions Core Tools**: `func --version` shows 4.x
- [ ] **Logged into Azure**: Run `az login` and verify correct subscription
- [ ] **Git repository** pushed to GitHub (for Static Web App CI/CD)

**Verify your subscription:**
```bash
az account show --output table
```

---

## 🏗️ Step 1: Create Azure Resources

### 1.1 Set Variables

```bash
# IMPORTANT: Customize these for your deployment
export RG="generationai-rg"                    # Your resource group
export LOCATION="australiaeast"                # Or your preferred region
export STORAGE="genaistore$(date +%s)"         # Unique storage name (lowercase, no hyphens)
export PDF_APP="generationai-pdf-gen"          # PDF Generator Function App name
export BRA_API="generationai-bra-api"          # Business Readiness API name
export FRONTEND="generationai-bra-frontend"    # Static Web App name

# Verify variables
echo "Resource Group: $RG"
echo "Location: $LOCATION"
echo "Storage Account: $STORAGE"
echo "PDF Service: $PDF_APP"
echo "BRA API: $BRA_API"
echo "Frontend: $FRONTEND"
```

### 1.2 Create Resource Group

```bash
az group create --name $RG --location $LOCATION
```

### 1.3 Create Storage Account

```bash
az storage account create \
  --name $STORAGE \
  --resource-group $RG \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2
```

**✅ Expected Output:** `"provisioningState": "Succeeded"`

---

## 📄 Step 2: Deploy PDF Generator Service

### 2.1 Create Function App

```bash
# Create consumption-based Function App
az functionapp create \
  --name $PDF_APP \
  --resource-group $RG \
  --storage-account $STORAGE \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux \
  --disable-app-insights false
```

**⚠️ Important:** If PDF generation times out later, you may need Premium (EP1) plan for more memory.

### 2.2 Configure App Settings

```bash
az functionapp config appsettings set \
  --name $PDF_APP \
  --resource-group $RG \
  --settings \
    NODE_ENV=production \
    WEBSITE_RUN_FROM_PACKAGE=1 \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### 2.3 Build & Deploy

```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/services/pdf-generator

# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Verify dist/ folder exists and has content
ls -la dist/

# Deploy to Azure
func azure functionapp publish $PDF_APP --typescript
```

**✅ Expected Output:** 
```
Functions in generationai-pdf-gen:
    generatePDF - [httpTrigger]
        Invoke url: https://generationai-pdf-gen.azurewebsites.net/api/generatePDF
```

### 2.4 Get Function Key

```bash
# Get the default function key for generatePDF
az functionapp function keys list \
  --name $PDF_APP \
  --resource-group $RG \
  --function-name generatePDF \
  --query "default" -o tsv

# Save this key! You'll need it in Step 3
export PDF_KEY=$(az functionapp function keys list \
  --name $PDF_APP \
  --resource-group $RG \
  --function-name generatePDF \
  --query "default" -o tsv)

echo "PDF Service Key: $PDF_KEY"
```

### 2.5 Test PDF Service

```bash
# Test that the PDF service is responding
curl -X POST "https://$PDF_APP.azurewebsites.net/api/generatePDF" \
  -H "Content-Type: application/json" \
  -H "x-functions-key: $PDF_KEY" \
  -d '{
    "reportType": "business-readiness",
    "reportData": {
      "contact_name": "Test User",
      "company_name": "Test Co",
      "email": "test@example.com",
      "readiness_score": "50",
      "readiness_band": "Ad Hoc",
      "readiness_band_narrative": "Test narrative"
    }
  }' --output test-pdf.pdf

# Verify PDF was created
ls -lh test-pdf.pdf
```

**✅ Expected:** A valid PDF file (~50-100KB)

---

## 🔧 Step 3: Deploy Business Readiness API

### 3.1 Create Function App

```bash
az functionapp create \
  --name $BRA_API \
  --resource-group $RG \
  --storage-account $STORAGE \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux \
  --disable-app-insights false
```

### 3.2 Configure Email Service (Logic App)

**Option A: Using Azure Logic App (Recommended)**

1. Go to Azure Portal → Create Logic App
2. Select "Consumption" plan
3. Add trigger: "When an HTTP request is received"
4. Add action: "Send an email (V2)" - Office 365 or Gmail
5. Configure email template with dynamic content:
   - **To**: `@{triggerBody()?['to']}`
   - **Subject**: `@{triggerBody()?['subject']}`
   - **Body**: `@{triggerBody()?['body']}`
   - **Attachments**: Name: `report.pdf`, Content: `@{base64ToBinary(triggerBody()?['pdfBase64'])}`
6. Save and copy the HTTP POST URL

```bash
# Save the Logic App URL
export LOGIC_APP_URL="<paste-your-logic-app-url-here>"
```

**Option B: Using SendGrid (Alternative)**

```bash
# If using SendGrid instead
export SENDGRID_API_KEY="<your-sendgrid-api-key>"
export SENDGRID_FROM_EMAIL="noreply@generationai.co.nz"
```

### 3.3 Configure App Settings

```bash
az functionapp config appsettings set \
  --name $BRA_API \
  --resource-group $RG \
  --settings \
    NODE_ENV=production \
    WEBSITE_RUN_FROM_PACKAGE=1 \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    PDF_SERVICE_URL="https://$PDF_APP.azurewebsites.net/api/generatePDF" \
    PDF_SERVICE_KEY="$PDF_KEY" \
    LOGIC_APP_EMAIL_URL="$LOGIC_APP_URL" \
    AIRTABLE_ENABLED=false \
    ALLOWED_ORIGIN="*"

# If using Airtable (optional):
# az functionapp config appsettings set \
#   --name $BRA_API \
#   --resource-group $RG \
#   --settings \
#     AIRTABLE_ENABLED=true \
#     AIRTABLE_API_KEY="<your-key>" \
#     AIRTABLE_BASE_ID="<your-base-id>" \
#     AIRTABLE_TABLE_NAME="Business-Readiness-Assessment"
```

### 3.4 Prepare & Deploy

```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/tools/business-readiness-assessment/api

# Run the prepare script (handles pnpm workspace dependencies)
bash prepare-deploy.sh

# Deploy to Azure
func azure functionapp publish $BRA_API --typescript
```

**✅ Expected Output:**
```
Functions in generationai-bra-api:
    processAssessment - [httpTrigger]
        Invoke url: https://generationai-bra-api.azurewebsites.net/api/processAssessment
```

### 3.5 Test Business API

```bash
# Test the assessment API
curl -X POST "https://$BRA_API.azurewebsites.net/api/processAssessment" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "contact_name": "Test User",
    "company_name": "Test Company",
    "opt_in_marketing": false,
    "q1_ownership": "no_one",
    "q2_strategy": "not_discussed",
    "q3_culture": "unaware",
    "q4_enablement": "no_training",
    "q5_shadow_ai": "yes_likely",
    "q6_governance": "none",
    "q7_compliance": "unsure",
    "q8_resources": "none",
    "q9_data_protection": "no_controls",
    "q10_opportunity": "unclear"
  }' | jq .

# ✅ Expected: JSON response with submissionId and full data object
```

---

## 🌐 Step 4: Deploy Frontend (Static Web App)

### 4.1 Update Frontend API Endpoint

**Important:** Edit the frontend to point to your production API.

```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/tools/business-readiness-assessment/frontend/assets/js

# Update form-handler.js
```

Edit `form-handler.js` line ~175:
```javascript
// Change from:
const apiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:7072/api/processAssessment'
  : '/api/processAssessment';

// To:
const apiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:7072/api/processAssessment'
  : 'https://generationai-bra-api.azurewebsites.net/api/processAssessment';
```

**Commit and push changes:**
```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4
git add tools/business-readiness-assessment/frontend/assets/js/form-handler.js
git commit -m "Configure production API endpoint"
git push origin main
```

### 4.2 Create Static Web App via Azure Portal

**Manual Setup (Recommended for First Deployment):**

1. Go to **Azure Portal** → **Static Web Apps** → **Create**
2. **Basics:**
   - Subscription: Your subscription
   - Resource Group: `generationai-rg`
   - Name: `generationai-bra-frontend`
   - Plan: Free (or Standard if you need custom domains)
   - Region: Select closest to your users
3. **Deployment:**
   - Source: GitHub
   - Sign in to GitHub
   - Organization: Your GitHub org
   - Repository: `generationai-assessments-4`
   - Branch: `main`
4. **Build Details:**
   - Build Presets: `Custom`
   - App location: `/tools/business-readiness-assessment/frontend`
   - Api location: (leave blank)
   - Output location: (leave blank - we're deploying static HTML)
5. Click **Review + Create** → **Create**

**✅ Wait 2-3 minutes for initial deployment**

### 4.3 Get Frontend URL

```bash
az staticwebapp show \
  --name $FRONTEND \
  --resource-group $RG \
  --query "defaultHostname" -o tsv

# Save this URL
export FRONTEND_URL=$(az staticwebapp show \
  --name $FRONTEND \
  --resource-group $RG \
  --query "defaultHostname" -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"
```

---

## 🔒 Step 5: Configure CORS & Security

### 5.1 Update API CORS

```bash
# Add frontend domain to Business API CORS
az functionapp cors add \
  --name $BRA_API \
  --resource-group $RG \
  --allowed-origins "https://$FRONTEND_URL"

# If you have a custom domain, add it too:
# az functionapp cors add \
#   --name $BRA_API \
#   --resource-group $RG \
#   --allowed-origins "https://businessreadiness.generationai.co.nz"

# Remove wildcard CORS for security
az functionapp cors remove \
  --name $BRA_API \
  --resource-group $RG \
  --allowed-origins "*"
```

### 5.2 Update App Settings with Frontend URL

```bash
az functionapp config appsettings set \
  --name $BRA_API \
  --resource-group $RG \
  --settings ALLOWED_ORIGIN="https://$FRONTEND_URL"
```

### 5.3 Verify Static Web App Config

The `staticwebapp.config.json` already includes:
- ✅ Content Security Policy for HubSpot scheduler
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ Cache control for assets
- ✅ SPA routing fallback

---

## ✅ Step 6: End-to-End Testing

### 6.1 Test Full Flow

1. **Visit Frontend:**
   ```bash
   open "https://$FRONTEND_URL"
   ```

2. **Fill Out Assessment:**
   - Complete all 10 questions
   - Use a real email you can check
   - Submit the form

3. **Verify Results Page:**
   - [ ] Redirected to `/results.html?id=<UUID>`
   - [ ] Score displays correctly
   - [ ] Tension line matches score (check 3-tier logic)
   - [ ] AI Readiness Playbook section appears
   - [ ] Maturity Map shows all 4 steps (Assess → Learn → Grow → Transform)
   - [ ] Answer playback boxes have correct colors (traffic light system)
   - [ ] Priority gaps section shows (or hides if perfect score)
   - [ ] Micro-recommendations appear in blue boxes
   - [ ] HubSpot scheduler loads and is functional
   - [ ] Success footer message displays
   - [ ] No console errors (F12 to check)

4. **Verify Email:**
   - [ ] Email received within 2 minutes
   - [ ] Subject: "Your Business AI Readiness Report - [Score]/100"
   - [ ] PDF attached and opens correctly
   - [ ] PDF content matches results page
   - [ ] CTA link works: https://meetings-ap1.hubspot.com/caleb-lucas1

### 6.2 Test Edge Cases

**Test 1: Low Score (≤40)**
- Answer all questions with worst options
- Verify tension line: "You're adopting AI faster than you can govern it..."
- Verify playbook line: "You'll likely focus on Transparency and Accountability first."

**Test 2: Mid Score (41-70)**
- Mix of mid-range answers
- Verify tension line: "You've got awareness, but without a clear roadmap..."

**Test 3: High Score (71-100)**
- Mostly good answers
- Verify tension line: "You're well positioned..."
- Verify playbook line: "You'll likely focus on Capability and Trust next."

**Test 4: Perfect Score (100/100)**
- All best options
- **Priority gaps section should be hidden entirely**

### 6.3 Test HubSpot Scheduler

- [ ] Scheduler iframe loads
- [ ] Can select a time slot
- [ ] Form prefills name/email from assessment (if implemented)
- [ ] Fallback link works if embed fails

---

## 📊 Step 7: Monitoring & Observability

### 7.1 Enable Application Insights

```bash
# Create App Insights instance
az monitor app-insights component create \
  --app generationai-insights \
  --location $LOCATION \
  --resource-group $RG \
  --application-type web

# Get instrumentation key
INSIGHTS_KEY=$(az monitor app-insights component show \
  --app generationai-insights \
  --resource-group $RG \
  --query instrumentationKey -o tsv)

# Link to PDF Generator
az functionapp config appsettings set \
  --name $PDF_APP \
  --resource-group $RG \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY

# Link to Business API
az functionapp config appsettings set \
  --name $BRA_API \
  --resource-group $RG \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY
```

### 7.2 Set Up Alerts

Create alerts for:
- [ ] Function execution failures > 5 in 5 minutes
- [ ] Average response time > 30 seconds
- [ ] PDF generation failures

```bash
# Example: Alert on function failures
az monitor metrics alert create \
  --name "BRA-API-Failures" \
  --resource-group $RG \
  --scopes "/subscriptions/<subscription-id>/resourceGroups/$RG/providers/Microsoft.Web/sites/$BRA_API" \
  --condition "count Http5xx >= 5" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action-group <your-action-group>
```

### 7.3 View Logs

```bash
# Stream logs from Business API
az webapp log tail --name $BRA_API --resource-group $RG

# Stream logs from PDF Generator
az webapp log tail --name $PDF_APP --resource-group $RG
```

---

## 🔐 Step 8: Security Hardening (Post-Deployment)

### 8.1 Rotate Function Keys

```bash
# Regenerate PDF service key (do this periodically)
az functionapp function keys set \
  --name $PDF_APP \
  --resource-group $RG \
  --function-name generatePDF \
  --key-name default \
  --key-value "$(openssl rand -base64 32)"

# Update Business API with new key
az functionapp config appsettings set \
  --name $BRA_API \
  --resource-group $RG \
  --settings PDF_SERVICE_KEY="<new-key>"
```

### 8.2 Use Azure Key Vault (Optional but Recommended)

```bash
# Create Key Vault
az keyvault create \
  --name generationai-vault \
  --resource-group $RG \
  --location $LOCATION

# Store secrets
az keyvault secret set \
  --vault-name generationai-vault \
  --name "PdfServiceKey" \
  --value "$PDF_KEY"

az keyvault secret set \
  --vault-name generationai-vault \
  --name "LogicAppUrl" \
  --value "$LOGIC_APP_URL"

# Grant Function App access
BRA_IDENTITY=$(az functionapp identity assign \
  --name $BRA_API \
  --resource-group $RG \
  --query principalId -o tsv)

az keyvault set-policy \
  --name generationai-vault \
  --object-id $BRA_IDENTITY \
  --secret-permissions get list

# Reference secrets in app settings
az functionapp config appsettings set \
  --name $BRA_API \
  --resource-group $RG \
  --settings \
    PDF_SERVICE_KEY="@Microsoft.KeyVault(SecretUri=https://generationai-vault.vault.azure.net/secrets/PdfServiceKey/)" \
    LOGIC_APP_EMAIL_URL="@Microsoft.KeyVault(SecretUri=https://generationai-vault.vault.azure.net/secrets/LogicAppUrl/)"
```

---

## 💰 Cost Estimates (NZD/Month)

| Service | Plan | Usage Estimate | Cost |
|---------|------|----------------|------|
| **PDF Generator** | Consumption | ~500 executions/month | $5-15 |
| **Business API** | Consumption | ~500 executions/month | $5-10 |
| **Static Web App** | Free | <100GB bandwidth | $0 |
| **Storage Account** | Standard LRS | <1GB | $1-2 |
| **Application Insights** | Pay-as-you-go | <5GB/month | $0-5 |
| **Logic App** | Consumption | ~500 runs/month | $2-5 |
| **Total** | | | **~$13-37/month** |

**Notes:**
- Costs scale with usage
- If PDF generation needs Premium plan (EP1): +$220/month
- Custom domain on Static Web App (Standard): +$15/month

---

## 🚨 Troubleshooting

### Issue: PDF Generation Timeout

**Symptom:** API returns 200 but PDF fails  
**Solution:** Check PDF Generator logs:
```bash
az webapp log tail --name $PDF_APP --resource-group $RG
```

If memory errors, upgrade to Premium plan:
```bash
az functionapp plan create \
  --name generationai-premium \
  --resource-group $RG \
  --location $LOCATION \
  --sku EP1

az functionapp update \
  --name $PDF_APP \
  --resource-group $RG \
  --plan generationai-premium
```

### Issue: CORS Errors

**Symptom:** Frontend shows "Failed to fetch" in console  
**Solution:**
```bash
# Check current CORS settings
az functionapp cors show --name $BRA_API --resource-group $RG

# Verify frontend URL is in the list
# If not, add it:
az functionapp cors add \
  --name $BRA_API \
  --resource-group $RG \
  --allowed-origins "https://<your-frontend>.azurestaticapps.net"
```

### Issue: Email Not Sending

**Symptom:** Assessment completes but no email  
**Solution:** Check Logic App run history in Azure Portal:
1. Go to Logic Apps → Your Logic App → Runs history
2. Check latest run status
3. If failed, review error details
4. Verify email connector is authenticated

### Issue: Results Page Shows "No Data"

**Symptom:** Results page loads but shows errors  
**Solution:**
1. Check browser console for errors (F12)
2. Verify `sessionStorage` has `assessment_result_<id>` key
3. Check API response includes full `data` object
4. Clear browser cache and retry

### Issue: HubSpot Scheduler Not Loading

**Symptom:** Blank space where scheduler should be  
**Solution:**
1. Check CSP headers in `staticwebapp.config.json` include HubSpot domains
2. Verify HubSpot embed URL in `results.html` is correct
3. Check browser console for CSP violations
4. Test fallback link: https://meetings-ap1.hubspot.com/caleb-lucas1

---

## 📝 Environment Variables Reference

### PDF Generator Function App
```
NODE_ENV=production
WEBSITE_RUN_FROM_PACKAGE=1
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
```

### Business Readiness API Function App
```
NODE_ENV=production
WEBSITE_RUN_FROM_PACKAGE=1
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
PDF_SERVICE_URL=https://generationai-pdf-gen.azurewebsites.net/api/generatePDF
PDF_SERVICE_KEY=<function-key>
LOGIC_APP_EMAIL_URL=<your-logic-app-url>
ALLOWED_ORIGIN=https://<frontend>.azurestaticapps.net
AIRTABLE_ENABLED=false
APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
```

Optional (if using Airtable):
```
AIRTABLE_ENABLED=true
AIRTABLE_API_KEY=<your-key>
AIRTABLE_BASE_ID=<your-base-id>
AIRTABLE_TABLE_NAME=Business-Readiness-Assessment
```

---

## 🎉 Post-Deployment Checklist

- [ ] Frontend loads at production URL
- [ ] Can complete full assessment flow
- [ ] Results page displays correctly with all sections
- [ ] HubSpot scheduler is functional
- [ ] Email delivered with PDF attachment
- [ ] PDF content matches results page
- [ ] No console errors in browser
- [ ] CORS configured (no wildcard in production)
- [ ] Application Insights collecting data
- [ ] Alerts configured for failures
- [ ] Function keys documented securely
- [ ] Team notified of production URLs
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate valid

---

## 📚 Production URLs (Save These)

After deployment, document these URLs:

```
Frontend: https://<your-frontend>.azurestaticapps.net
Business API: https://generationai-bra-api.azurewebsites.net/api/processAssessment
PDF Generator: https://generationai-pdf-gen.azurewebsites.net/api/generatePDF
HubSpot Scheduler: https://meetings-ap1.hubspot.com/caleb-lucas1
Application Insights: https://portal.azure.com/#@<tenant>/resource/subscriptions/<sub>/resourceGroups/generationai-rg/providers/microsoft.insights/components/generationai-insights
```

---

**Estimated Deployment Time:** 45-60 minutes (first time)  
**Subsequent Updates:** 10-15 minutes per service

**🚀 You're done! The Business AI Readiness Assessment is now live in Azure.**

