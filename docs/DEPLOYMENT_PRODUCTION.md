# Production Deployment Guide

Step-by-step guide to deploy the Shadow AI Assessment to Azure.

## 🎯 Overview

You'll deploy **3 components**:
1. **PDF Generator Service** - Azure Function App
2. **Shadow AI Assessment API** - Azure Function App
3. **Frontend** - Azure Static Web App

## 📋 Prerequisites

- Azure CLI installed (`az --version`)
- Azure subscription
- Resource group created
- Logged in to Azure (`az login`)

## 🚀 Deployment Steps

### Step 1: Create Azure Resources

```bash
# Set variables
RG="generationai-rg"
LOCATION="newzealandnorth"
STORAGE="generationaistorage"  # Must be globally unique, lowercase, no hyphens

# Create resource group (if not exists)
az group create --name $RG --location $LOCATION

# Create storage account (required for Azure Functions)
az storage account create \
  --name $STORAGE \
  --resource-group $RG \
  --location $LOCATION \
  --sku Standard_LRS
```

### Step 2: Deploy PDF Generator Service

```bash
# Create Function App for PDF Generator
az functionapp create \
  --name generationai-pdf-generator \
  --resource-group $RG \
  --storage-account $STORAGE \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux

# Build and deploy
cd services/pdf-generator
pnpm install
pnpm build
func azure functionapp publish generationai-pdf-generator

# Configure app settings
az functionapp config appsettings set \
  --name generationai-pdf-generator \
  --resource-group $RG \
  --settings \
    NODE_ENV=production \
    WEBSITE_RUN_FROM_PACKAGE=1
```

**⚠️ Important:** Note the PDF service URL for next step:
```
https://generationai-pdf-generator.azurewebsites.net/api/generatePDF
```

**Get the Function Key:**
```bash
# Get the function key for generatePDF
az functionapp function keys list \
  --name generationai-pdf-generator \
  --resource-group $RG \
  --function-name generatePDF

# Copy the "default" key - you'll need it next
```

### Step 3: Deploy Shadow AI Assessment API

```bash
# Create Function App for Assessment
az functionapp create \
  --name generationai-shadow-ai \
  --resource-group $RG \
  --storage-account $STORAGE \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux

# Build and deploy
cd ../../tools/shadow-ai-assessment/api
pnpm install
pnpm build
func azure functionapp publish generationai-shadow-ai

# Configure app settings
az functionapp config appsettings set \
  --name generationai-shadow-ai \
  --resource-group $RG \
  --settings \
    AIRTABLE_API_KEY="<your-airtable-api-key>" \
    AIRTABLE_BASE_ID="<your-airtable-base-id>" \
    AIRTABLE_TABLE_NAME="Shadow-AI-Submissions" \
    LOGIC_APP_EMAIL_URL="<your-logic-app-url>" \
    PDF_SERVICE_URL="https://generationai-pdf-generator.azurewebsites.net/api/generatePDF" \
    PDF_SERVICE_KEY="<function-key-from-step-2>" \
    ALLOWED_ORIGIN="*" \
    NODE_ENV=production \
    WEBSITE_RUN_FROM_PACKAGE=1
```

**⚠️ Important:** Note the Assessment API URL:
```
https://generationai-shadow-ai.azurewebsites.net/api/processAssessment
```

### Step 4: Deploy Frontend (Static Web App)

```bash
# Create Static Web App
az staticwebapp create \
  --name generationai-shadow-ai-frontend \
  --resource-group $RG \
  --location $LOCATION \
  --source https://github.com/your-org/generation-ai-tools \
  --branch main \
  --app-location "tools/shadow-ai-assessment/frontend" \
  --output-location "" \
  --login-with-github
```

**Or manually via Azure Portal:**
1. Go to Static Web Apps → Create
2. Choose GitHub repo
3. Build preset: "Custom"
4. App location: `tools/shadow-ai-assessment/frontend`
5. Output location: (leave empty)

**Update Frontend API Endpoint:**

Edit `tools/shadow-ai-assessment/frontend/assets/js/form-handler.js`:
```javascript
// Change this line (around line 188):
const response = await fetch('https://generationai-shadow-ai.azurewebsites.net/api/processAssessment', {
```

Commit and push to trigger deployment.

### Step 5: Configure CORS

```bash
# Enable CORS for frontend on Assessment API
az functionapp cors add \
  --name generationai-shadow-ai \
  --resource-group $RG \
  --allowed-origins "https://generationai-shadow-ai-frontend.azurestaticapps.net"

# Also allow your custom domain if you have one
az functionapp cors add \
  --name generationai-shadow-ai \
  --resource-group $RG \
  --allowed-origins "https://shadowai.generationai.co.nz"
```

### Step 6: Test Production Deployment

```bash
# Test PDF Generator
curl https://generationai-pdf-generator.azurewebsites.net/api/generatePDF \
  -X POST \
  -H "Content-Type: application/json" \
  -H "x-functions-key: <your-function-key>" \
  -d '{"reportData": {...}}' \
  --output test-production.pdf

# Test Assessment API
curl https://generationai-shadow-ai.azurewebsites.net/api/processAssessment \
  -X POST \
  -H "Content-Type: application/json" \
  -d @test-submission.json

# Visit frontend
open https://generationai-shadow-ai-frontend.azurestaticapps.net
```

## 🔒 Security Checklist

- [ ] PDF Generator uses `authLevel: 'function'` (requires API key)
- [ ] Assessment API has CORS configured (not `*` in production)
- [ ] Airtable API key stored in App Settings (not in code)
- [ ] Email Logic App URL stored securely
- [ ] Frontend uses HTTPS
- [ ] Function keys rotated regularly

## 💰 Cost Estimates (Monthly)

| Service | Plan | Estimated Cost (NZD) |
|---------|------|---------------------|
| PDF Generator | Consumption (Premium for memory) | $75-150 |
| Assessment API | Consumption | $10-30 |
| Frontend | Static Web App (Free tier) | $0 |
| Storage Account | Standard LRS | $5 |
| **Total** | | **$90-185/month** |

**Note:** Premium plan recommended for PDF Generator due to Puppeteer memory requirements.

## 🔧 Troubleshooting

### PDF Generation Fails

**Issue:** Out of memory errors

**Solution:** Upgrade to Premium plan:
```bash
az functionapp plan create \
  --name generationai-premium-plan \
  --resource-group $RG \
  --location $LOCATION \
  --sku EP1  # Elastic Premium 1

az functionapp update \
  --name generationai-pdf-generator \
  --resource-group $RG \
  --plan generationai-premium-plan
```

### CORS Errors

**Issue:** Frontend can't call API

**Solution:** Check CORS settings and frontend URL
```bash
az functionapp cors show --name generationai-shadow-ai --resource-group $RG
```

### Email Not Sending

**Issue:** Logic App errors

**Solution:** Check Logic App runs in Azure Portal → Logic Apps → Run History

## 📊 Monitoring

### Enable Application Insights

```bash
az monitor app-insights component create \
  --app generationai-insights \
  --location $LOCATION \
  --resource-group $RG

# Link to Function Apps
APPINSIGHTS_KEY=$(az monitor app-insights component show \
  --app generationai-insights \
  --resource-group $RG \
  --query instrumentationKey -o tsv)

az functionapp config appsettings set \
  --name generationai-shadow-ai \
  --resource-group $RG \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY

az functionapp config appsettings set \
  --name generationai-pdf-generator \
  --resource-group $RG \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY
```

### View Metrics
- Azure Portal → Function App → Monitor
- Application Insights → Metrics
- Track: Requests, Response time, Failures

## 🔄 CI/CD (Optional but Recommended)

See `.github/workflows/` for GitHub Actions deployment automation.

## 📝 Environment Variables Reference

### PDF Generator
```
NODE_ENV=production
```

### Shadow AI Assessment API
```
AIRTABLE_API_KEY=<your-key>
AIRTABLE_BASE_ID=apptxnwqucezx8knv
AIRTABLE_TABLE_NAME=Shadow-AI-Submissions
LOGIC_APP_EMAIL_URL=<your-url>
PDF_SERVICE_URL=https://generationai-pdf-generator.azurewebsites.net/api/generatePDF
PDF_SERVICE_KEY=<function-key>
ALLOWED_ORIGIN=https://your-frontend.azurestaticapps.net
NODE_ENV=production
```

## 🎉 Post-Deployment

1. ✅ Test full assessment flow end-to-end
2. ✅ Verify email delivery with PDF attachment
3. ✅ Check Airtable records are being saved
4. ✅ Monitor Application Insights for errors
5. ✅ Set up alerts for failures
6. ✅ Document production URLs in team wiki

---

**Deployment Time:** ~45-60 minutes (first time)
**Subsequent Deployments:** ~10-15 minutes per service