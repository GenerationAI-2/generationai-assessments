# GenerationAI Assessment Tools

Production monorepo for AI assessment and diagnostic tools. Built with TypeScript, Azure Functions, and Azure Static Web Apps.

## 🚀 Assessment Tools

| Tool | Type | Status | Production URL |
|------|------|--------|----------------|
| **Shadow AI Risk Assessment** | Full Stack | ✅ Deployed | [proud-moss-0374e9300.1.azurestaticapps.net](https://proud-moss-0374e9300.1.azurestaticapps.net) |
| **Business AI Readiness** | Full Stack | ✅ Deployed | [lively-bay-0fbbe1300.2.azurestaticapps.net](https://lively-bay-0fbbe1300.2.azurestaticapps.net) |
| **Board Governance Assessment** | Full Stack | ✅ Deployed | [thankful-grass-030658000.2.azurestaticapps.net](https://thankful-grass-030658000.2.azurestaticapps.net) |
| **Personal AI Readiness** | Full Stack | ✅ Deployed | [gentle-smoke-098f1d000.2.azurestaticapps.net](https://gentle-smoke-098f1d000.2.azurestaticapps.net) |
| **ROI Calculator** | Frontend Only | ✅ Deployed | [orange-wave-0ba8d4200.1.azurestaticapps.net](https://orange-wave-0ba8d4200.1.azurestaticapps.net) |

## 📁 Project Structure

```
shadow-ai-assessment-1/
├── tools/                              # Assessment tools
│   ├── shadow-ai-assessment/           # Unauthorised AI risk tool
│   │   ├── api/                        # Azure Function (scoring + orchestration)
│   │   └── frontend/                   # Static Web App
│   ├── business-readiness-assessment/  # AI adoption readiness
│   │   ├── api/                        # Azure Function
│   │   └── frontend/                   # Static Web App
│   ├── board-governance-assessment/    # Board-level AI governance
│   │   ├── api/                        # Azure Function
│   │   └── frontend/                   # Static Web App
│   ├── personal-ai-readiness/          # Individual AI skill assessment
│   │   ├── api/                        # Azure Function
│   │   └── frontend/                   # Static Web App
│   └── roi-calculator/                 # AI ROI calculator (frontend only)
│       └── frontend/                   # Client-side calculations
│
├── services/                           # Shared services
│   └── pdf-generator/                  # PDF generation service (used by all tools)
│
├── shared/                             # Shared packages
│   ├── types/                          # @generation-ai/types
│   └── utils/                          # @generation-ai/utils
│
├── .github/workflows/                  # CI/CD automation
│   ├── deploy-shadow-ai-api.yml
│   ├── deploy-business-readiness-api.yml
│   ├── deploy-board-governance-api.yml
│   ├── deploy-personal-ai-readiness-api.yml
│   ├── deploy-roi-calculator-frontend.yml
│   └── deploy-pdf-generator.yml
│
└── docs/                               # Documentation
    ├── FAST_TRACK_GUIDE.md             # Idea → Deployed in 1-2 hours
    ├── PROJECT_STATUS.md               # Current deployment status
    ├── DEVELOPER_ONBOARDING.md         # New developer setup
    ├── DEPLOYMENT_PRODUCTION.md        # Azure deployment guide
    ├── DEPLOYMENT_CHECKLIST.md         # Pre-deployment checklist
    ├── INFRASTRUCTURE.md               # Architecture overview
    └── ADDING_NEW_ASSESSMENT.md        # Adding new tools
```

## 🏗️ Architecture

### Two Patterns

**1. Full Stack Assessment (Shadow AI, Business Readiness, Board Governance, Personal AI)**
```
Frontend (Static Web App)
    ↓ HTTPS POST
Assessment API (Azure Function)
    ├→ Scoring Engine
    ├→ Airtable (data storage)
    ├→ PDF Generator Service
    └→ Email (Logic App)
```

**2. Frontend-Only Tool (ROI Calculator)**
```
Frontend (Static Web App)
    ├→ Client-side calculations
    └→ Instant results (no backend)
```

### Shared Services
- **PDF Generator**: Reused by all full-stack tools (Puppeteer-based)
- **Airtable**: Unified data storage (separate table per tool)
- **Email Logic App**: Shared email delivery service

## 🚀 Quick Start

### For New Developers
See [DEVELOPER_ONBOARDING.md](DEVELOPER_ONBOARDING.md) for complete setup guide.

### Build Everything
```bash
pnpm install
pnpm build
```

### Run Locally
```bash
# Start PDF service (required for full-stack tools)
cd services/pdf-generator && pnpm start  # Port 7072

# Start any assessment API
cd tools/shadow-ai-assessment/api && pnpm start  # Port 7071

# Serve frontend
cd tools/shadow-ai-assessment/frontend && python3 -m http.server 8080
```

## 📊 Adding a New Tool

See [FAST_TRACK_GUIDE.md](FAST_TRACK_GUIDE.md) for step-by-step instructions.

**Quick summary:**

**Frontend-Only Tool** (~30 minutes):
1. Create `tools/new-tool/frontend/` with HTML/CSS/JS
2. Add GitHub Actions workflow for deployment
3. Deploy to Azure Static Web App

**Full-Stack Assessment** (~2 hours):
1. Copy template from `tools/shadow-ai-assessment/`
2. Customize scoring logic and questions
3. Create Airtable table
4. Deploy API to Azure Function App
5. Deploy frontend to Static Web App

## 💰 Azure Costs

Estimated monthly costs (NZD):

| Service | Qty | Cost Each | Total |
|---------|-----|-----------|-------|
| PDF Generator (Premium EP1) | 1 | $75-150 | $75-150 |
| Assessment APIs (Consumption) | 4 | $10-30 | $40-120 |
| Static Web Apps (Free tier) | 5 | $0 | $0 |
| Storage Account | 1 | $5 | $5 |
| **Total** | | | **$120-275/month** |

**Note**: Adding new frontend-only tools (like ROI Calculator) = $0 additional cost

## 🔑 Key Features

- ✅ **Monorepo architecture** - All tools in one repo
- ✅ **Shared PDF service** - Reused across all assessments
- ✅ **TypeScript** - Full type safety via shared packages
- ✅ **Independent deployment** - Each tool deploys separately
- ✅ **Auto-deployment** - GitHub Actions CI/CD
- ✅ **Scalable** - Easy to add new tools
- ✅ **Two patterns** - Full-stack or frontend-only

## 📦 Package Manager

This project uses **pnpm** for efficient monorepo management.

```bash
# Install pnpm globally
npm install -g pnpm

# Workspace commands
pnpm build                                    # Build all
pnpm --filter shadow-ai-assessment-api build  # Build specific
pnpm -r clean                                 # Clean all
```

## 🧪 Testing

```bash
# Test PDF service
curl http://localhost:7072/api/testPDF --output test.pdf

# Test assessment submission
curl -X POST http://localhost:7071/api/processAssessment \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [FAST_TRACK_GUIDE.md](FAST_TRACK_GUIDE.md) | Idea → Deployed in 1-2 hours |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current deployment status & URLs |
| [DEVELOPER_ONBOARDING.md](DEVELOPER_ONBOARDING.md) | New developer setup guide |
| [docs/DEPLOYMENT_PRODUCTION.md](docs/DEPLOYMENT_PRODUCTION.md) | Azure deployment guide |
| [docs/INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md) | Architecture & data flow |
| [docs/ADDING_NEW_ASSESSMENT.md](docs/ADDING_NEW_ASSESSMENT.md) | Adding new tools |

## 🔧 Environment Variables

### Required for Full-Stack Tools
```bash
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=apptxnwqucezx8knv
AIRTABLE_TABLE_NAME=Tool-Specific-Name
LOGIC_APP_EMAIL_URL=your_url
PDF_SERVICE_URL=https://generationai-pdf.azurewebsites.net/api/generatePDF
PDF_SERVICE_KEY=your_key
```

### Required for Frontend-Only Tools
None - all calculations are client-side.

## 📈 Current Status

**Active Tools**: 5 (4 full-stack, 1 frontend-only)
**Last Deployment**: See [PROJECT_STATUS.md](PROJECT_STATUS.md)
**Uptime**: Monitored via Azure Application Insights

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes
3. Test locally
4. Push - GitHub Actions auto-deploys on merge to `main`

## 📞 Support

- **Documentation**: See `docs/` folder
- **Issues**: Check Application Insights in Azure Portal
- **Team**: dev@generationai.co.nz

---

**Built with** ❤️ **by GenerationAI**
**Last Updated**: October 2025
