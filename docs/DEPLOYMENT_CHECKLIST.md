# 🚀 Deployment Checklist - Shadow AI Assessment

Use this checklist when deploying to production.

## ✅ Pre-Deployment

### Code & Dependencies
- [ ] All packages build successfully (`pnpm build`)
- [ ] No TypeScript errors
- [ ] Local testing complete (frontend → API → PDF → email)
- [ ] Environment variables documented
- [ ] Secrets removed from code (use App Settings)

### Azure Prerequisites
- [ ] Azure subscription active
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Resource group created
- [ ] Storage account created (for Function Apps)

### External Services
- [ ] Airtable base and table created
- [ ] Airtable API key obtained
- [ ] Azure Logic App email workflow configured and tested
- [ ] Logic App HTTP URL obtained

## 📦 Deployment Steps

### 1. Deploy PDF Generator Service
- [ ] Create Function App: `generationai-pdf-generator`
- [ ] Runtime: Node 20, Functions v4
- [ ] Build: `cd services/pdf-generator && pnpm build`
- [ ] Deploy: `func azure functionapp publish generationai-pdf-generator`
- [ ] Configure App Settings (NODE_ENV=production)
- [ ] Test endpoint: `/api/generatePDF`
- [ ] Note function key for next step
- [ ] Verify memory/performance (may need Premium plan)

**URLs to Save:**
```
PDF Service URL: https://generationai-pdf-generator.azurewebsites.net/api/generatePDF
Function Key: ___________________________
```

### 2. Deploy Shadow AI Assessment API
- [ ] Create Function App: `generationai-shadow-ai`
- [ ] Runtime: Node 20, Functions v4
- [ ] Build: `cd tools/shadow-ai-assessment/api && pnpm build`
- [ ] Deploy: `func azure functionapp publish generationai-shadow-ai`
- [ ] Configure App Settings:
  - [ ] AIRTABLE_API_KEY
  - [ ] AIRTABLE_BASE_ID
  - [ ] AIRTABLE_TABLE_NAME=Shadow-AI-Submissions
  - [ ] LOGIC_APP_EMAIL_URL
  - [ ] PDF_SERVICE_URL (from step 1)
  - [ ] PDF_SERVICE_KEY (from step 1)
  - [ ] ALLOWED_ORIGIN (frontend URL)
  - [ ] NODE_ENV=production
- [ ] Test endpoint: `/api/processAssessment`
- [ ] Configure CORS for frontend domain

**URLs to Save:**
```
Assessment API URL: https://generationai-shadow-ai.azurewebsites.net/api/processAssessment
```

### 3. Deploy Frontend (Static Web App)
- [ ] Create Static Web App: `generationai-shadow-ai-frontend`
- [ ] Connect to GitHub repository
- [ ] Configure build:
  - App location: `tools/shadow-ai-assessment/frontend`
  - Output location: (empty)
- [ ] Update API endpoint in `form-handler.js` (line ~188)
- [ ] Push to trigger deployment
- [ ] Test complete flow

**URLs to Save:**
```
Frontend URL: https://generationai-shadow-ai-frontend.azurestaticapps.net
```

### 4. Configure CORS
- [ ] Add frontend URL to Assessment API CORS settings
- [ ] Add custom domain if applicable
- [ ] Test cross-origin requests work

### 5. Set Up Monitoring
- [ ] Create Application Insights instance
- [ ] Link to PDF Generator Function App
- [ ] Link to Assessment API Function App
- [ ] Configure alerts for failures
- [ ] Test alerts work

## 🧪 Post-Deployment Testing

### End-to-End Test
- [ ] Visit frontend URL
- [ ] Fill out complete assessment form
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check email received with PDF attachment
- [ ] Verify PDF opens and displays correctly
- [ ] Check Airtable record created
- [ ] Review Application Insights for errors

### Performance Test
- [ ] Submit 5 assessments in quick succession
- [ ] Verify all complete successfully
- [ ] Check PDF generation times (should be < 10 seconds)
- [ ] Monitor Function App metrics

### Error Handling Test
- [ ] Submit invalid data (should reject gracefully)
- [ ] Test with missing email (should show error)
- [ ] Test CORS (from different domain)

## 🔒 Security Review

- [ ] PDF Generator uses function-level auth
- [ ] No API keys in frontend code
- [ ] CORS limited to specific domains (not `*`)
- [ ] HTTPS enforced on all endpoints
- [ ] Airtable API key stored in App Settings only
- [ ] Logic App URL includes signature parameter

## 💰 Cost Review

- [ ] Review Azure cost estimates
- [ ] Set up budget alerts
- [ ] Consider Premium plan for PDF Generator if needed
- [ ] Document monthly cost expectations

## 📊 Monitoring Setup

- [ ] Application Insights enabled
- [ ] Alerts configured for:
  - [ ] Function failures (> 5 per hour)
  - [ ] Email send failures
  - [ ] PDF generation failures
  - [ ] High response times (> 30 seconds)
- [ ] Dashboard created for key metrics

## 📝 Documentation

- [ ] Production URLs documented in team wiki
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created
- [ ] Escalation contacts listed

## 🎯 Go-Live

- [ ] Soft launch (share with test users)
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Full launch (share publicly)
- [ ] Monitor for 48 hours

## 📞 Support Contacts

| Issue | Contact | Email |
|-------|---------|-------|
| Airtable | Support | support@airtable.com |
| Azure Functions | Azure Support | Portal |
| SendGrid/Email | Provider Support | - |
| Code Issues | Dev Team | dev@generationai.co.nz |

## 🔄 Rollback Plan

If issues occur:

1. **Frontend Issues:**
   - Revert GitHub commit
   - Static Web App auto-deploys previous version

2. **API Issues:**
   ```bash
   # Redeploy previous version
   func azure functionapp publish generationai-shadow-ai --slot staging
   # Test staging slot
   # Swap slots if successful
   ```

3. **Critical Issues:**
   - Stop Function App via Azure Portal
   - Fix issue locally
   - Test thoroughly
   - Redeploy

## ✅ Sign-Off

- [ ] Technical lead approved
- [ ] Testing complete
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Team trained
- [ ] **READY FOR PRODUCTION** 🎉

---

**Deployed by:** _________________
**Date:** _________________
**Version:** _________________
**Notes:** _________________________________