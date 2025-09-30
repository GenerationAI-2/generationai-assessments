# Monorepo Migration Complete

## 🎉 Migration Status: SUCCESSFUL

Your Shadow AI Assessment project has been successfully migrated to a monorepo architecture with the following structure:

## 📁 New Structure

```
generation-ai-tools/ (Monorepo Root)
├── tools/
│   └── shadow-ai-assessment/
│       ├── api/                    # Azure Function for assessment processing
│       │   ├── processAssessment/  # Main assessment endpoint
│       │   └── shared/             # Assessment-specific logic
│       │       ├── scoring-engine.ts
│       │       ├── scoring-config.ts
│       │       ├── airtable.ts
│       │       └── email.ts
│       └── frontend/               # Static website
│           ├── index.html
│           ├── success.html
│           └── assets/
├── services/
│   └── pdf-generator/              # Standalone PDF generation service
│       ├── generatePDF/            # HTTP endpoint for PDF generation
│       ├── testPDF/                # Test endpoint
│       └── shared/
│           ├── pdf-engine.ts       # Puppeteer logic
│           └── pdf-template.ts     # HTML template
├── shared/
│   ├── types/                      # @generation-ai/types
│   │   └── src/
│   │       ├── assessment.ts       # Assessment types
│   │       ├── pdf.ts              # PDF service types
│   │       └── index.ts
│   └── utils/                      # @generation-ai/utils
│       └── src/
│           ├── cors.ts             # CORS utilities
│           ├── validation.ts       # Validation helpers
│           └── index.ts
├── infrastructure/
│   ├── terraform/                  # Infrastructure as Code (TODO)
│   └── deploy-scripts/             # Deployment scripts (TODO)
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml            # Workspace definition
└── tsconfig.json                  # Root TypeScript config
```

## 🔑 Key Changes

### 1. **Separated PDF Generation Service**
- **Before**: PDF generation was embedded in the assessment API
- **After**: Separate Azure Function App at `services/pdf-generator/`
- **Why**: Independent scaling, reusability across tools

### 2. **Shared Type Definitions**
- Package: `@generation-ai/types`
- Location: `shared/types/`
- Contains: All TypeScript interfaces used across services
- Benefits: Type safety, single source of truth

### 3. **Shared Utilities**
- Package: `@generation-ai/utils`
- Location: `shared/utils/`
- Contains: CORS helpers, validation functions
- Benefits: Code reuse, consistency

### 4. **Assessment API Updates**
- Now calls PDF service via HTTP instead of generating PDFs directly
- Uses shared types for type safety
- No longer depends on Puppeteer directly

## 🚀 Development Commands

### Build Everything
```bash
pnpm build
```

### Build Specific Services
```bash
# Shadow AI Assessment API
pnpm --filter shadow-ai-assessment-api build

# PDF Generator Service
pnpm --filter pdf-generator build

# Shared Types
pnpm --filter @generation-ai/types build

# Shared Utils
pnpm --filter @generation-ai/utils build
```

### Run Development Servers

#### Shadow AI Assessment API (Port 7071)
```bash
cd tools/shadow-ai-assessment/api
pnpm start
```

#### PDF Generator Service (Port 7072)
```bash
cd services/pdf-generator
func start --port 7072
```

## 🔧 Environment Variables

### Shadow AI Assessment API
```bash
# Required
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base
LOGIC_APP_EMAIL_URL=your_url
PDF_SERVICE_URL=http://localhost:7072/api/generatePDF  # Local dev
PDF_SERVICE_KEY=your_function_key                       # Production only

# Optional
ALLOWED_ORIGIN=*
NOTIFICATION_EMAIL=team@generationai.co.nz
NODE_ENV=development
```

### PDF Generator Service
```bash
# Optional
NODE_ENV=development  # Uses full Puppeteer instead of chromium
```

## 📦 Package Dependencies

### Workspace Dependencies (using `workspace:*`)
- `shadow-ai-assessment-api` → `@generation-ai/types`, `@generation-ai/utils`
- `pdf-generator` → `@generation-ai/types`

### External Dependencies
- **Shadow AI Assessment API**: `@azure/functions`, `airtable`, `node-fetch`
- **PDF Generator**: `@azure/functions`, `puppeteer`, `puppeteer-core`, `@sparticuz/chromium`

## 🎯 Architecture Benefits

### For Development
✅ Shared types prevent breaking changes
✅ Clone once, work on any tool
✅ Consistent patterns across services
✅ Fast iteration with `pnpm` workspaces

### For Deployment
✅ Each service deploys independently
✅ Zero risk of breaking other services
✅ Fast deployments (only changed service rebuilds)
✅ Easy rollback per service

### For Scaling
✅ PDF service scales separately (CPU-intensive)
✅ Assessment API scales independently
✅ Can move services to different regions
✅ Clear cost allocation per service

## 🚢 Deployment Strategy

### Azure Function Apps Required
1. **shadow-ai-assessment** - Assessment processing API
2. **pdf-generator** - PDF generation service

### Deployment Flow
```bash
# Deploy PDF Generator first (dependency)
cd services/pdf-generator
pnpm build
func azure functionapp publish <pdf-generator-app-name>

# Then deploy Assessment API
cd tools/shadow-ai-assessment/api
pnpm build
func azure functionapp publish <shadow-ai-assessment-app-name>
```

### Environment Variables Setup
```bash
# Set PDF service URL in Assessment API
az functionapp config appsettings set \
  --name <shadow-ai-assessment-app-name> \
  --resource-group <resource-group> \
  --settings PDF_SERVICE_URL="https://<pdf-generator-app>.azurewebsites.net/api/generatePDF"

# Get PDF service function key
az functionapp function keys list \
  --name <pdf-generator-app-name> \
  --resource-group <resource-group> \
  --function-name generatePDF

# Set in Assessment API
az functionapp config appsettings set \
  --name <shadow-ai-assessment-app-name> \
  --resource-group <resource-group> \
  --settings PDF_SERVICE_KEY="<function-key>"
```

## 🧪 Testing

### Test PDF Generation
```bash
# Local (port 7072)
curl http://localhost:7072/api/testPDF --output test.pdf

# Production
curl https://<pdf-generator-app>.azurewebsites.net/api/testPDF --output test.pdf
```

### Test Assessment API
```bash
# Local
curl -X POST http://localhost:7071/api/processAssessment \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

## 📈 Next Steps

### Week 2: Infrastructure as Code
- [ ] Create Terraform configurations in `infrastructure/terraform/`
- [ ] Define Azure Function Apps
- [ ] Set up Application Insights
- [ ] Configure environment variables

### Week 3: CI/CD Pipeline
- [ ] Create GitHub Actions workflow
- [ ] Add change detection (deploy only changed services)
- [ ] Set up staging/production environments
- [ ] Add automated testing

### Week 4+: Add New Tools
To add a new tool (e.g., Compliance Checker):

1. Copy structure:
```bash
cp -r tools/shadow-ai-assessment tools/compliance-checker
```

2. Update package.json with new name

3. Customize assessment logic

4. Reuse shared packages and PDF service

5. Deploy to new Azure Function App

## 🎓 Learning Resources

### pnpm Workspaces
- [Official Docs](https://pnpm.io/workspaces)
- Use `workspace:*` for internal dependencies
- Run commands with `--filter` to target specific packages

### TypeScript Project References
- [Official Docs](https://www.typescriptlang.org/docs/handbook/project-references.html)
- Enables incremental builds
- Maintains type checking across packages

## 🤝 Contributing

### Adding New Shared Utilities
1. Add to `shared/utils/src/`
2. Export from `shared/utils/src/index.ts`
3. Run `pnpm --filter @generation-ai/utils build`

### Adding New Types
1. Add to `shared/types/src/`
2. Export from `shared/types/src/index.ts`
3. Run `pnpm --filter @generation-ai/types build`

### Modifying PDF Template
1. Edit `services/pdf-generator/shared/pdf-template.ts`
2. Test with `curl http://localhost:7072/api/testPDF --output test.pdf`
3. Build and deploy PDF service

## 📞 Support

For questions or issues with this monorepo structure:
1. Check this documentation
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
3. Contact the development team

---

**Migration completed**: [Current Date]
**Migrated by**: Claude Code Assistant
**Architecture**: Monorepo with pnpm workspaces + separate Azure Function Apps