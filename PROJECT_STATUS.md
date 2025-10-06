# Project Status & Deployment Tracker

**Last Updated**: October 7, 2025

## 🚀 Live Assessment Tools

### 1. Shadow AI Risk Assessment
**Type**: Full Stack (Frontend + API)
**Status**: ✅ Production
**Deployment Date**: October 3, 2025

| Component | URL | Resource Name |
|-----------|-----|---------------|
| Frontend | https://proud-moss-0374e9300.1.azurestaticapps.net | generationai-shadow-ai-frontend |
| API | https://generationai-shadow-ai.azurewebsites.net/api/processAssessment | generationai-shadow-ai |
| PDF Service | (Shared) | generationai-pdf-generator |

**Airtable Table**: `Shadow-AI-Submissions`
**Last Deployment**: Auto via GitHub Actions
**Monitoring**: Application Insights enabled

---

### 2. Business AI Readiness Assessment
**Type**: Full Stack (Frontend + API)
**Status**: ✅ Production
**Deployment Date**: October 3, 2025

| Component | URL | Resource Name |
|-----------|-----|---------------|
| Frontend | https://lively-bay-0fbbe1300.2.azurestaticapps.net | generationai-business-readiness-frontend |
| API | https://generationai-business-readiness.azurewebsites.net/api/processAssessment | generationai-business-readiness |
| PDF Service | (Shared) | generationai-pdf-generator |

**Airtable Table**: `Business-Readiness-Submissions`
**Last Deployment**: Auto via GitHub Actions
**Monitoring**: Application Insights enabled

---

### 3. Board Governance Assessment
**Type**: Full Stack (Frontend + API)
**Status**: ✅ Production
**Deployment Date**: October 7, 2025

| Component | URL | Resource Name |
|-----------|-----|---------------|
| Frontend | https://thankful-grass-030658000.2.azurestaticapps.net | board-governance-frontend |
| API | https://board-governance-api.azurewebsites.net/api/processAssessment | board-governance-api |
| PDF Service | (Shared) | generationai-pdf-generator |

**Airtable Table**: `Board-Governance-Submissions`
**Last Deployment**: Auto via GitHub Actions
**Monitoring**: Application Insights enabled

---

### 4. Personal AI Readiness
**Type**: Full Stack (Frontend + API)
**Status**: ✅ Production
**Deployment Date**: October 7, 2025

| Component | URL | Resource Name |
|-----------|-----|---------------|
| Frontend | https://gentle-smoke-098f1d000.2.azurestaticapps.net | generationai-personal-ai-readiness |
| API | https://personal-ai-readiness-api.azurewebsites.net/api/processAssessment | personal-ai-readiness-api |
| PDF Service | (Shared) | generationai-pdf-generator |

**Airtable Table**: `Personal-AI-Readiness-Submissions`
**Last Deployment**: Auto via GitHub Actions
**Monitoring**: Application Insights enabled

---

### 5. ROI Calculator
**Type**: Frontend Only
**Status**: ✅ Production
**Deployment Date**: October 7, 2025

| Component | URL | Resource Name |
|-----------|-----|---------------|
| Frontend | https://wonderful-sky-09d539b10.2.azurestaticapps.net | generationai-roi-calculator |

**Features**:
- Client-side calculations only
- No backend required
- No data collection
- Instant results

**Last Deployment**: Auto via GitHub Actions
**Monitoring**: Static Web App analytics

---

## 🛠️ Shared Services

### PDF Generator Service
**Status**: ✅ Production
**URL**: https://generationai-pdf-generator.azurewebsites.net/api/generatePDF
**Resource Name**: generationai-pdf-generator
**Plan**: Premium EP1 (required for Puppeteer memory)
**Last Deployment**: October 6, 2025

**Used By**:
- Shadow AI Assessment
- Business Readiness Assessment
- Board Governance Assessment
- Personal AI Readiness

**Test Endpoint**: https://generationai-pdf-generator.azurewebsites.net/api/testPDF

---

## 📊 Infrastructure Summary

| Resource Type | Count | Total Cost (NZD/month) |
|---------------|-------|------------------------|
| Azure Function Apps (Consumption) | 4 | $40-120 |
| Azure Function App (Premium EP1) | 1 | $75-150 |
| Azure Static Web Apps (Free) | 5 | $0 |
| Storage Accounts | 1 | $5 |
| **Total** | **11** | **$120-275** |

---

## 🔑 Environment Variables (Production)

### All Full-Stack Tools Require:
```
AIRTABLE_API_KEY=<stored in Azure Key Vault>
AIRTABLE_BASE_ID=apptxnwqucezx8knv
AIRTABLE_TABLE_NAME=<Tool-Specific-Name>
LOGIC_APP_EMAIL_URL=<shared Logic App endpoint>
PDF_SERVICE_URL=https://generationai-pdf-generator.azurewebsites.net/api/generatePDF
PDF_SERVICE_KEY=<PDF service function key>
ALLOWED_ORIGIN=<frontend Static Web App URL>
```

### PDF Generator Requires:
```
NODE_ENV=production
```

---

## 📈 Deployment History

| Date | Tool | Action | Result |
|------|------|--------|--------|
| 2025-10-07 | ROI Calculator | Initial deployment | ✅ Success |
| 2025-10-07 | Personal AI Readiness | Initial deployment | ✅ Success |
| 2025-10-07 | Board Governance | Initial deployment | ✅ Success |
| 2025-10-06 | PDF Generator | Updated templates | ✅ Success |
| 2025-10-03 | Business Readiness | Initial deployment | ✅ Success |
| 2025-10-03 | Shadow AI | Initial deployment | ✅ Success |
| 2025-10-03 | PDF Generator | Initial deployment | ✅ Success |

---

## 🔗 Custom Domains (Pending)

Custom domains to be configured with Craig (IT):

| Tool | Desired Domain | Status |
|------|----------------|--------|
| Shadow AI | shadowai.generationai.co.nz | ⏳ Pending DNS |
| Business Readiness | readiness.generationai.co.nz | ⏳ Pending DNS |
| Board Governance | governance.generationai.co.nz | ⏳ Pending DNS |
| Personal AI Readiness | personal.generationai.co.nz | ⏳ Pending DNS |
| ROI Calculator | roi.generationai.co.nz | ⏳ Pending DNS |

**Next Step**: Request CNAME records from Craig for GoDaddy DNS

---

## 🧪 Testing Status

| Tool | Local Testing | Production Testing | Load Testing |
|------|---------------|-------------------|--------------|
| Shadow AI | ✅ Passed | ✅ Passed | ⏳ Pending |
| Business Readiness | ✅ Passed | ✅ Passed | ⏳ Pending |
| Board Governance | ✅ Passed | ✅ Passed | ⏳ Pending |
| Personal AI Readiness | ✅ Passed | ✅ Passed | ⏳ Pending |
| ROI Calculator | ✅ Passed | ✅ Passed | N/A (client-side) |
| PDF Generator | ✅ Passed | ✅ Passed | ⏳ Pending |

---

## 📋 Known Issues

### Active Issues
None currently.

### Resolved Issues
1. **2025-10-07**: ROI Calculator deployment failed initially due to missing GitHub secret
   - **Resolution**: Added `AZURE_STATIC_WEB_APPS_API_TOKEN_ROI_CALCULATOR` secret

2. **2025-10-06**: PDF Generator cold start delays
   - **Resolution**: Upgraded to Premium EP1 plan

---

## 🎯 Upcoming Work

### Q4 2025
- [ ] Add custom domains for all tools
- [ ] Implement analytics tracking
- [ ] Add A/B testing for conversion optimization
- [ ] Create additional assessment tools (planned: 5-10 more)

### Future Enhancements
- [ ] Multi-language support
- [ ] Enhanced PDF templates
- [ ] Integration with CRM system
- [ ] Advanced analytics dashboard

---

## 🔍 Monitoring & Alerts

### Application Insights
- **Resource Group**: rg-assessments-prod-nzn
- **Workspace**: generationai-insights

### Alert Rules
- API response time > 5s
- Error rate > 5%
- PDF generation failures
- Function app availability < 99%

### Dashboards
- **URL**: [Azure Portal Dashboard](https://portal.azure.com/)
- **Metrics Tracked**:
  - Request count per tool
  - Average response time
  - Error rates
  - PDF generation success rate

---

## 📞 Support Contacts

**For Deployment Issues**:
- Primary: dev@generationai.co.nz
- Secondary: Check GitHub Actions logs

**For DNS/Domain Issues**:
- IT Contact: Craig Corfield (craig.corfield@corit.tech)

**For Azure Resource Issues**:
- Azure Portal: https://portal.azure.com
- Subscription: GenerationAI Production

---

## 🔄 Update Instructions

When deploying a new tool or making changes:

1. Update this file with new information
2. Update README.md tool table
3. Update docs/INFRASTRUCTURE.md if architecture changes
4. Commit changes with descriptive message
5. Push to trigger auto-deployment

---

**Status Page**: All systems operational ✅
**Next Review**: October 14, 2025
