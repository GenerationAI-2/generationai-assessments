# GenerationAI Tools - Monorepo

Production-ready monorepo for AI risk assessment tools, built with TypeScript and Azure Functions.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start services locally
# Terminal 1: PDF Generator (port 7072)
cd services/pdf-generator && func start --port 7072

# Terminal 2: Shadow AI Assessment API (port 7071)
cd tools/shadow-ai-assessment/api && func start

# Terminal 3: Frontend (port 8080)
cd tools/shadow-ai-assessment/frontend && python3 -m http.server 8080
```

Visit: **http://localhost:8080**

## 📁 Project Structure

```
generation-ai-tools/
├── tools/                          # Assessment tools
│   ├── shadow-ai-assessment/
│   │   ├── api/                    # Azure Function API
│   │   └── frontend/               # Static HTML/JS
│   └── business-readiness-assessment/
│       ├── api/                    # Azure Function API
│       └── frontend/               # Static HTML/JS
│
├── services/                       # Shared services
│   └── pdf-generator/              # PDF generation service (reused by all tools)
│
├── shared/                         # Shared packages
│   ├── types/                      # @generation-ai/types
│   └── utils/                      # @generation-ai/utils
│
├── .github/workflows/              # CI/CD automation
│   ├── deploy-shadow-ai-api.yml
│   ├── deploy-business-readiness-api.yml
│   ├── deploy-pdf-generator.yml
│   └── ...
│
└── docs/                           # Documentation
    ├── DEPLOYMENT_PRODUCTION.md    # Production deployment guide
    ├── DEPLOYMENT_CHECKLIST.md     # Pre-deployment checklist
    ├── INFRASTRUCTURE.md            # Architecture diagrams
    └── ADDING_NEW_ASSESSMENT.md    # How to add new tools
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[READY_FOR_DEPLOYMENT.md](READY_FOR_DEPLOYMENT.md)** | 👈 **START HERE** - Deployment overview |
| [QUICK_START.md](QUICK_START.md) | Local development guide |
| [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) | Monorepo migration details |
| [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md) | Complete architecture guide |
| [docs/DEPLOYMENT_PRODUCTION.md](docs/DEPLOYMENT_PRODUCTION.md) | Step-by-step Azure deployment |
| [docs/ADDING_NEW_ASSESSMENT.md](docs/ADDING_NEW_ASSESSMENT.md) | Adding new assessment tools |

## 🏗️ Architecture

### Components

1. **Frontend** (Static Web App)
   - HTML/CSS/JavaScript
   - Assessment forms
   - User interface

2. **Assessment API** (Azure Function)
   - Processes submissions
   - Scoring engine
   - Orchestrates PDF generation and email

3. **PDF Generator Service** (Azure Function)
   - Shared across all tools
   - Puppeteer-based PDF generation
   - Scales independently

4. **Shared Packages**
   - `@generation-ai/types` - TypeScript interfaces
   - `@generation-ai/utils` - Common utilities

### Data Flow

```
User → Frontend → Assessment API → PDF Service
                        ↓
                    Airtable
                        ↓
                    Email (Logic App)
```

## 🔧 Development

### Prerequisites

- Node.js 20+
- pnpm 8+
- Azure Functions Core Tools v4
- Azure CLI (for deployment)

### Local Development

```bash
# Install pnpm globally
npm install -g pnpm

# Install all dependencies
pnpm install

# Build shared packages first
pnpm --filter @generation-ai/types build
pnpm --filter @generation-ai/utils build

# Build services
pnpm --filter pdf-generator build
pnpm --filter shadow-ai-assessment-api build

# Or build everything
pnpm build
```

### Environment Variables

Create `local.settings.json` in each API:

**tools/shadow-ai-assessment/api/local.settings.json:**
```json
{
  "Values": {
    "AIRTABLE_API_KEY": "your_key",
    "AIRTABLE_BASE_ID": "your_base",
    "AIRTABLE_TABLE_NAME": "Shadow-AI-Submissions",
    "LOGIC_APP_EMAIL_URL": "your_url",
    "PDF_SERVICE_URL": "http://localhost:7072/api/generatePDF"
  }
}
```

## 📦 Available Commands

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter shadow-ai-assessment-api build
pnpm --filter business-readiness-assessment-api build
pnpm --filter pdf-generator build

# Run development servers
pnpm dev:shadow-ai           # Start Shadow AI Assessment API
pnpm dev:business-readiness  # Start Business Readiness Assessment API
pnpm dev:pdf                 # Start PDF Generator service

# Clean build artifacts
pnpm -r clean
```

## 🚢 Deployment

See **[READY_FOR_DEPLOYMENT.md](READY_FOR_DEPLOYMENT.md)** for complete deployment guide.

### Quick Deploy

```bash
# 1. Deploy PDF Generator (shared service)
cd services/pdf-generator
pnpm build
func azure functionapp publish generationai-pdf-generator

# 2. Deploy Shadow AI Assessment
cd tools/shadow-ai-assessment/api
pnpm build
func azure functionapp publish generationai-shadow-ai
# Frontend deploys automatically via GitHub Actions

# 3. Deploy Business Readiness Assessment
cd tools/business-readiness-assessment/api
pnpm build
func azure functionapp publish generationai-business-readiness
# Frontend deploys automatically via GitHub Actions
```

## 🆕 Adding New Assessment Tools

To add a new tool (e.g., Compliance Checker):

```bash
# 1. Copy template
cp -r tools/shadow-ai-assessment tools/compliance-checker

# 2. Update configuration
# - Change AIRTABLE_TABLE_NAME
# - Customize questions
# - Update scoring logic

# 3. Deploy
# - New Azure Function App for API
# - New Static Web App for frontend
# - Reuse PDF Generator Service
```

See [docs/ADDING_NEW_ASSESSMENT.md](docs/ADDING_NEW_ASSESSMENT.md) for complete guide.

## 💰 Azure Costs

Estimated monthly costs (NZD):

| Service | Cost |
|---------|------|
| PDF Generator (Premium EP1) | $75-150 |
| Shadow AI API (Consumption) | $10-30 |
| Business Readiness API (Consumption) | $10-30 |
| Frontends (2x Static Web App Free) | $0 |
| Storage | $5 |
| Airtable (Pro Plan) | ~$27 |
| **Total** | **$127-242/month** |

**Scaling:** Each additional assessment tool adds ~$10-30/month (Consumption plan API only)

## 🔑 Key Features

- ✅ **Monorepo structure** - All tools in one repo
- ✅ **Shared PDF service** - Reused across all assessment tools
- ✅ **TypeScript** - Full type safety
- ✅ **pnpm workspaces** - Efficient dependency management
- ✅ **Independent deployment** - Each tool deploys separately
- ✅ **Scalable** - Easy to add new assessment tools

## 📊 Current Tools

1. **Shadow AI Assessment** - AI risk assessment tool
   - Frontend: `tools/shadow-ai-assessment/frontend/`
   - API: `tools/shadow-ai-assessment/api/`
   - Production URL: https://generationai-shadow-ai-frontend.azurestaticapps.net
   - Status: ✅ Production ready

2. **Business Readiness Assessment** - Business AI readiness evaluation tool
   - Frontend: `tools/business-readiness-assessment/frontend/`
   - API: `tools/business-readiness-assessment/api/`
   - Production URL: https://lively-bay-0fbbe1300.2.azurestaticapps.net
   - Status: ✅ Production ready

## 🤝 Contributing

When adding new assessment tools:
1. Follow the template in `tools/shadow-ai-assessment/`
2. Use shared types from `@generation-ai/types`
3. Reuse PDF Generator Service
4. Create separate Airtable table per tool

## 📞 Support

- **Documentation:** See `docs/` folder
- **Issues:** Check Application Insights in Azure Portal
- **Team:** dev@generationai.co.nz

---

**Built with** ❤️ **by GenerationAI**
**Last Updated:** October 2025