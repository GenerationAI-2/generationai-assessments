# Developer Onboarding Guide

Welcome! This guide will get you from zero to productive in **15 minutes**.

## ⏱️ Quick Start (5 minutes)

### Step 1: Clone Repository (1 min)

```bash
git clone https://github.com/GenerationAI-2/generationai-assessments.git
cd generationai-assessments
```

### Step 2: Install Dependencies (3 min)

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies (for all tools)
pnpm install

# Build shared packages and all services
pnpm build
```

### Step 3: Verify Setup (1 min)

```bash
# Check that builds succeeded
ls shared/types/dist    # Should show compiled types
ls shared/utils/dist    # Should show compiled utils

# Verify pnpm workspaces
pnpm list --depth 0
```

✅ **You're ready to develop!**

---

## 📁 Understanding the Project Structure

```
generationai-assessments/
│
├── tools/                      # All assessment tools
│   ├── shadow-ai-assessment/   # Example full-stack tool
│   │   ├── api/               # Backend scoring & orchestration
│   │   └── frontend/          # User-facing assessment form
│   │
│   └── roi-calculator/         # Example frontend-only tool
│       └── frontend/          # Client-side calculations
│
├── services/                   # Shared backend services
│   └── pdf-generator/         # PDF generation (used by all tools)
│
├── shared/                     # Shared code packages
│   ├── types/                 # TypeScript interfaces (@generation-ai/types)
│   └── utils/                 # Common utilities (@generation-ai/utils)
│
├── .github/workflows/          # Auto-deployment configs
└── docs/                       # Documentation
```

### Architecture Patterns

**Full-Stack Tool** (Shadow AI, Business Readiness, etc.):
```
Frontend → API → Scoring → PDF Service → Email
                    ↓
                 Airtable
```

**Frontend-Only Tool** (ROI Calculator):
```
Frontend → Client-side JS → Instant Results
```

---

## 🚀 Running Tools Locally

### Option 1: Run Frontend-Only Tool (30 seconds)

```bash
# Example: ROI Calculator
cd tools/roi-calculator/frontend
python3 -m http.server 8080

# Visit: http://localhost:8080
```

### Option 2: Run Full-Stack Tool (2 minutes)

**Terminal 1 - PDF Service** (required for all full-stack tools):
```bash
cd services/pdf-generator
pnpm start  # Runs on port 7072
```

**Terminal 2 - Assessment API**:
```bash
cd tools/shadow-ai-assessment/api
pnpm start  # Runs on port 7071
```

**Terminal 3 - Frontend**:
```bash
cd tools/shadow-ai-assessment/frontend
python3 -m http.server 8080

# Visit: http://localhost:8080
```

---

## 🔧 Common Development Tasks

### Build a Specific Tool

```bash
# Build Shadow AI API
pnpm --filter shadow-ai-assessment-api build

# Build PDF Generator
pnpm --filter pdf-generator build

# Build all assessment APIs
pnpm build
```

### Clean Build Artifacts

```bash
# Clean everything
pnpm -r clean

# Clean specific tool
cd tools/shadow-ai-assessment/api
pnpm clean
```

### Test PDF Generation

```bash
# Start PDF service
cd services/pdf-generator
pnpm start

# In another terminal, generate test PDF
curl http://localhost:7072/api/testPDF --output test.pdf
open test.pdf  # macOS
```

---

## 🧪 Testing Your Changes

### Frontend Changes

1. Edit HTML/CSS/JS in `tools/{tool-name}/frontend/`
2. Refresh browser (no build needed)
3. Test on mobile viewport (Chrome DevTools)

### API Changes

1. Edit TypeScript in `tools/{tool-name}/api/`
2. Build: `pnpm build`
3. Restart: `pnpm start`
4. Test with curl or Postman

### Shared Package Changes

```bash
# 1. Edit code in shared/types/ or shared/utils/
# 2. Build the package
cd shared/types  # or shared/utils
pnpm build

# 3. Rebuild dependent tools
cd ../../tools/shadow-ai-assessment/api
pnpm build
```

---

## 📦 Understanding pnpm Workspaces

This project uses **pnpm workspaces** to manage multiple packages.

### Key Commands

```bash
# Run command in ALL packages
pnpm -r <command>

# Run command in SPECIFIC package
pnpm --filter <package-name> <command>

# Examples:
pnpm --filter shadow-ai-assessment-api build
pnpm --filter pdf-generator start
pnpm -r clean  # Clean all packages
```

### Workspace Dependencies

Packages can depend on each other using `workspace:*`:

```json
{
  "dependencies": {
    "@generation-ai/types": "workspace:*"
  }
}
```

This ensures you always use the local version during development.

---

## 🔑 Environment Variables

### For Local Development

Each API needs a `local.settings.json` file:

**Example: `tools/shadow-ai-assessment/api/local.settings.json`**
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AIRTABLE_API_KEY": "your_key_here",
    "AIRTABLE_BASE_ID": "apptxnwqucezx8knv",
    "AIRTABLE_TABLE_NAME": "Shadow-AI-Submissions",
    "LOGIC_APP_EMAIL_URL": "your_logic_app_url",
    "PDF_SERVICE_URL": "http://localhost:7072/api/generatePDF",
    "ALLOWED_ORIGIN": "*"
  }
}
```

**⚠️ Important**: Never commit `local.settings.json` - it's in `.gitignore`

### Getting Credentials

Ask team lead for:
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `LOGIC_APP_EMAIL_URL`

Or check Azure Key Vault (production) / 1Password (team shared).

---

## 🎯 Your First Task: Make a Small Change

**Goal**: Update the ROI Calculator's default salary value

### Steps:

1. **Find the file**:
   ```bash
   code tools/roi-calculator/frontend/index.html
   ```

2. **Make the change** (line ~73):
   ```html
   <!-- Change from $70,000 to $75,000 -->
   <option value="75000" selected>$75,000</option>
   ```

3. **Test locally**:
   ```bash
   cd tools/roi-calculator/frontend
   python3 -m http.server 8080
   ```
   Visit http://localhost:8080 and verify the default changed.

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update ROI Calculator default salary to $75,000"
   git push origin main
   ```

5. **Watch deployment**:
   - Go to GitHub → Actions tab
   - See "Deploy ROI Calculator Frontend" workflow run
   - Deployment completes in ~2 minutes

✅ **Congratulations! You just deployed to production!**

---

## 🧭 Navigation Guide

### Where to Find Things

| Task | Location |
|------|----------|
| Add new assessment tool | Copy `tools/shadow-ai-assessment/` |
| Edit frontend | `tools/{tool}/frontend/index.html` |
| Edit scoring logic | `tools/{tool}/api/shared/scoring-config.ts` |
| Edit PDF template | `services/pdf-generator/shared/pdf-template.ts` |
| Shared TypeScript types | `shared/types/src/` |
| Deployment workflows | `.github/workflows/` |
| Documentation | `docs/` |

### Key Files

- `package.json` (root) - Workspace configuration
- `pnpm-workspace.yaml` - Defines workspace packages
- `tsconfig.json` - TypeScript configuration
- `PROJECT_STATUS.md` - Current deployment status
- `FAST_TRACK_GUIDE.md` - Adding new tools

---

## 🛠️ Development Tools

### Recommended VSCode Extensions

```json
{
  "recommendations": [
    "ms-azuretools.vscode-azurefunctions",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Useful Commands

```bash
# Find all TypeScript errors
pnpm -r exec -- tsc --noEmit

# Format all code
pnpm -r exec -- prettier --write "src/**/*.ts"

# Check package dependencies
pnpm list --depth 1

# Update all dependencies
pnpm update -r
```

---

## 🐛 Troubleshooting

### "Cannot find module '@generation-ai/types'"

```bash
# Solution: Build shared packages first
cd shared/types
pnpm build
cd ../utils
pnpm build
```

### "Port 7071 already in use"

```bash
# Solution: Kill existing process
lsof -ti:7071 | xargs kill -9

# Or use different port
func start --port 7073
```

### "Puppeteer fails to install"

```bash
# Solution: Use development version
cd services/pdf-generator
NODE_ENV=development pnpm install
```

### "CORS error when testing frontend"

```bash
# Solution: Update local.settings.json
"ALLOWED_ORIGIN": "*"  # For local dev only
```

### Build fails with type errors

```bash
# Solution: Clean and rebuild everything
pnpm -r clean
pnpm install
pnpm build
```

---

## 📚 Learning Resources

### Essential Reading (30 min)

1. **[README.md](README.md)** - Project overview (5 min)
2. **[FAST_TRACK_GUIDE.md](FAST_TRACK_GUIDE.md)** - Adding new tools (15 min)
3. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current deployments (5 min)
4. **[docs/INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md)** - Architecture (5 min)

### Recommended Order

1. **Day 1**: Read docs, run existing tool locally
2. **Day 2**: Make small frontend change and deploy
3. **Day 3**: Modify scoring logic in existing tool
4. **Week 2**: Create new frontend-only tool
5. **Week 3**: Create new full-stack assessment

---

## 🤝 Team Workflow

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Make changes
# ... edit files ...

# 3. Commit with descriptive message
git add .
git commit -m "Add ROI calculator slider for cost ranges"

# 4. Push to GitHub
git push origin feature/my-new-feature

# 5. Create Pull Request (optional for solo work)
# Or merge directly to main for auto-deploy
git checkout main
git merge feature/my-new-feature
git push origin main
```

### Deployment Process

- **Automatic**: Push to `main` branch triggers GitHub Actions
- **No manual steps**: Azure deployment is fully automated
- **Watch progress**: GitHub → Actions tab
- **Rollback**: Revert commit and push

---

## ✅ Onboarding Checklist

- [ ] Clone repository
- [ ] Install pnpm and dependencies
- [ ] Build all packages successfully
- [ ] Run frontend-only tool locally
- [ ] Run full-stack tool locally (3 terminals)
- [ ] Generate test PDF
- [ ] Make a small change and test
- [ ] Commit and push to GitHub
- [ ] Watch GitHub Actions deployment
- [ ] Read FAST_TRACK_GUIDE.md
- [ ] Review PROJECT_STATUS.md
- [ ] Understand project structure
- [ ] Ask questions in team chat!

---

## 📞 Getting Help

**Stuck?** Here's how to get unblocked:

1. **Check docs first**: README.md, FAST_TRACK_GUIDE.md, this file
2. **Search codebase**: Look at existing tools for examples
3. **Check PROJECT_STATUS.md**: See if it's a known issue
4. **Ask the team**: dev@generationai.co.nz

**Common issues have solutions in the Troubleshooting section above!**

---

**Welcome to the team!** 🎉

You're now ready to build and deploy AI assessment tools at GenerationAI.

**Next step**: Read [FAST_TRACK_GUIDE.md](FAST_TRACK_GUIDE.md) to learn how to add new tools.
