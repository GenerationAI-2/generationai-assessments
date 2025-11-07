# 🚀 Start Here - Quick Setup

## You need to install `pnpm` first!

Since `pnpm` isn't installed on your system yet, run one of these commands:

### Option 1: Using npm (Recommended)
```bash
npm install -g pnpm
```

### Option 2: Using the install script
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Option 3: Using Homebrew (macOS)
```bash
brew install pnpm
```

## After installing pnpm:

### Quick Start (Automated)
```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4

# First time only: Install dependencies and build
./FIRST_TIME_SETUP.sh

# Then start all services
./dev-start.sh
```

### Manual Start (If automated doesn't work)

**Terminal 1: PDF Generator**
```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4
pnpm dev:pdf
```

**Terminal 2: Business Readiness API**
```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4
pnpm dev:business-readiness
```

**Terminal 3: Frontend Server**
```bash
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/tools/business-readiness-assessment/frontend
python3 -m http.server 3000
```

## Access Your App

Once running, open: **http://localhost:3000**

## Test It

1. Open http://localhost:3000/?utm_source=test
2. Fill out the form
3. Submit and check:
   - ✅ Redirects to /results.html?id=[UUID]
   - ✅ Results page shows new design
   - ✅ Tension line appears
   - ✅ Roadmap visual works
   - ✅ HubSpot scheduler link included

## Need Help?

- **Full Setup Guide**: See `LOCAL_SETUP.md`
- **Testing Guide**: See `tools/business-readiness-assessment/TESTING_VALIDATION.md`
- **Troubleshooting**: See `LOCAL_SETUP.md` section "Common Issues"

---

**Current Status**: pnpm needs to be installed before proceeding.

