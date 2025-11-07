# Business AI Readiness Assessment - Deployment Checklist

**⚡ Quick Reference for Azure Deployment**

Use this alongside the full [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md)

---

## ✅ Pre-Deployment (Do These First)

- [ ] Run `az login` and verify correct subscription
- [ ] Have Logic App email URL ready (or SendGrid API key)
- [ ] Ensure GitHub repo is pushed and accessible
- [ ] Run local tests: `bash restart-services.sh` and test at http://localhost:3000
- [ ] Verify all services build: `pnpm install && pnpm build` in each service

---

## 🎯 Deployment Order (IMPORTANT)

**Deploy in this order to avoid dependency issues:**

### 1️⃣ PDF Generator First
```bash
export RG="generationai-rg"
export STORAGE="genaistore$(date +%s)"
export PDF_APP="generationai-pdf-gen"

# Create resources
az group create --name $RG --location australiaeast
az storage account create --name $STORAGE --resource-group $RG --location australiaeast --sku Standard_LRS

# Create & deploy PDF service
az functionapp create --name $PDF_APP --resource-group $RG --storage-account $STORAGE --consumption-plan-location australiaeast --runtime node --runtime-version 20 --functions-version 4 --os-type Linux

cd services/pdf-generator && pnpm install && pnpm build && func azure functionapp publish $PDF_APP

# Get function key
export PDF_KEY=$(az functionapp function keys list --name $PDF_APP --resource-group $RG --function-name generatePDF --query "default" -o tsv)
```

**✅ Test:** `curl -X POST "https://$PDF_APP.azurewebsites.net/api/generatePDF" -H "x-functions-key: $PDF_KEY" --output test.pdf`

---

### 2️⃣ Business API Second
```bash
export BRA_API="generationai-bra-api"
export LOGIC_APP_URL="<your-logic-app-url>"

# Create & configure
az functionapp create --name $BRA_API --resource-group $RG --storage-account $STORAGE --consumption-plan-location australiaeast --runtime node --runtime-version 20 --functions-version 4 --os-type Linux

az functionapp config appsettings set --name $BRA_API --resource-group $RG --settings \
  NODE_ENV=production \
  PDF_SERVICE_URL="https://$PDF_APP.azurewebsites.net/api/generatePDF" \
  PDF_SERVICE_KEY="$PDF_KEY" \
  LOGIC_APP_EMAIL_URL="$LOGIC_APP_URL" \
  AIRTABLE_ENABLED=false \
  ALLOWED_ORIGIN="*"

# Deploy
cd tools/business-readiness-assessment/api && bash prepare-deploy.sh && func azure functionapp publish $BRA_API
```

**✅ Test:** `curl -X POST "https://$BRA_API.azurewebsites.net/api/processAssessment" -H "Content-Type: application/json" -d @test-data.json`

---

### 3️⃣ Frontend Third
```bash
export FRONTEND="generationai-bra-frontend"

# Update frontend API endpoint in form-handler.js
# Change line ~175 to point to: https://$BRA_API.azurewebsites.net/api/processAssessment

# Commit and push
git add tools/business-readiness-assessment/frontend/assets/js/form-handler.js
git commit -m "Configure production API endpoint"
git push origin main

# Create Static Web App via Azure Portal:
# - Source: GitHub
# - App location: /tools/business-readiness-assessment/frontend
# - Output location: (blank)
```

**✅ Test:** Visit `https://$FRONTEND.azurestaticapps.net` and complete an assessment

---

### 4️⃣ Configure CORS Last
```bash
export FRONTEND_URL=$(az staticwebapp show --name $FRONTEND --resource-group $RG --query "defaultHostname" -o tsv)

# Add frontend to CORS
az functionapp cors add --name $BRA_API --resource-group $RG --allowed-origins "https://$FRONTEND_URL"

# Remove wildcard
az functionapp cors remove --name $BRA_API --resource-group $RG --allowed-origins "*"

# Update app settings
az functionapp config appsettings set --name $BRA_API --resource-group $RG --settings ALLOWED_ORIGIN="https://$FRONTEND_URL"
```

---

## 🧪 Testing Checklist

### Automated Tests
```bash
# Test PDF service
curl -X POST "https://$PDF_APP.azurewebsites.net/api/generatePDF" \
  -H "x-functions-key: $PDF_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reportType":"business-readiness","reportData":{"contact_name":"Test"}}' \
  --output test.pdf

# Test Business API
curl -X POST "https://$BRA_API.azurewebsites.net/api/processAssessment" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "contact_name":"Test",
    "company_name":"Test Co",
    "q1_ownership":"no_one",
    "q2_strategy":"not_discussed",
    "q3_culture":"unaware",
    "q4_enablement":"no_training",
    "q5_shadow_ai":"yes_likely",
    "q6_governance":"none",
    "q7_compliance":"unsure",
    "q8_resources":"none",
    "q9_data_protection":"no_controls",
    "q10_opportunity":"unclear"
  }' | jq .
```

### Manual Tests (Do All 4)

**Test 1: Low Score (Score ≤40)**
- [ ] Tension line: "You're adopting AI faster than you can govern it, and that's a board-level risk."
- [ ] Playbook line: "You'll likely focus on Transparency and Accountability first."
- [ ] 3 priority gaps shown
- [ ] Blue recommendation boxes appear
- [ ] Answer boxes mostly red/orange

**Test 2: Mid Score (Score 41-70)**
- [ ] Tension line: "You've got awareness, but without a clear roadmap, you'll stay stuck in pilot purgatory..."
- [ ] Mixed color answer boxes
- [ ] Priority gaps section visible

**Test 3: High Score (Score 71-100)**
- [ ] Tension line: "You're well positioned, but maintaining momentum requires continuous investment..."
- [ ] Playbook line: "You'll likely focus on Capability and Trust next."
- [ ] Mostly green answer boxes

**Test 4: Perfect Score (100/100)**
- [ ] **Priority gaps section is completely hidden**
- [ ] All answer boxes are dark green
- [ ] Journey signpost shows "You are here: **Assess** → Learn → Grow → Transform"

### Universal Checks (All Scores)
- [ ] Results page loads at `/results.html?id=<UUID>`
- [ ] Score displays correctly as `X/100`
- [ ] HubSpot scheduler loads and is interactive
- [ ] Fallback link works: https://meetings-ap1.hubspot.com/caleb-lucas1
- [ ] Success footer: "Most businesses that start here see measurable improvement..."
- [ ] CTA heading is capitalized: "NEXT STEP: BOOK YOUR 20-MINUTE DISCOVERY CALL"
- [ ] No em dashes anywhere (only colons in recommendations)
- [ ] No console errors (F12)
- [ ] Email received with PDF attachment
- [ ] PDF content matches results page

---

## 🚨 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| **PDF times out** | Upgrade to Premium (EP1) plan: `az functionapp plan create --sku EP1` |
| **CORS error** | Add frontend URL: `az functionapp cors add --name $BRA_API --allowed-origins "https://..."` |
| **No email** | Check Logic App run history in Azure Portal |
| **Gaps show for 100/100** | Redeploy API: `cd api && bash prepare-deploy.sh && func azure functionapp publish $BRA_API` |
| **HubSpot not loading** | Check CSP in `staticwebapp.config.json` includes HubSpot domains |
| **Old code running** | Clear Function App cache: `az functionapp restart --name $BRA_API --resource-group $RG` |

---

## 📋 Environment Variables Quick Copy

### PDF Generator
```bash
NODE_ENV=production
WEBSITE_RUN_FROM_PACKAGE=1
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Business API
```bash
NODE_ENV=production
WEBSITE_RUN_FROM_PACKAGE=1
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
PDF_SERVICE_URL=https://<pdf-app>.azurewebsites.net/api/generatePDF
PDF_SERVICE_KEY=<function-key>
LOGIC_APP_EMAIL_URL=<logic-app-url>
ALLOWED_ORIGIN=https://<frontend>.azurestaticapps.net
AIRTABLE_ENABLED=false
```

---

## 📝 Post-Deployment Documentation

**Save these URLs in your team wiki:**

```
📱 Frontend: https://<frontend>.azurestaticapps.net
🔧 Business API: https://<bra-api>.azurewebsites.net/api/processAssessment
📄 PDF Generator: https://<pdf-app>.azurewebsites.net/api/generatePDF
📅 HubSpot Scheduler: https://meetings-ap1.hubspot.com/caleb-lucas1
📊 Application Insights: (Azure Portal link)
```

---

## ⏱️ Time Estimates

- **First-time deployment:** 45-60 minutes
- **Update API only:** 5-10 minutes
- **Update frontend only:** 2-5 minutes (auto-deploy via GitHub)
- **Full redeploy:** 20-30 minutes

---

## 🎯 Success Criteria

**You're done when:**

✅ All 4 test scenarios pass (low/mid/high/perfect scores)  
✅ Email with PDF arrives within 2 minutes  
✅ HubSpot scheduler is functional  
✅ No console errors in browser  
✅ CORS configured (no wildcard)  
✅ Application Insights collecting data  
✅ Team has production URLs documented  

---

**For full details, see [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md)**

