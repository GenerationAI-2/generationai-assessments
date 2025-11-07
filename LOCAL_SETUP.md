# Local Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Azure Functions Core Tools**: v4.x
  ```bash
  npm install -g azure-functions-core-tools@4 --unsafe-perm true
  ```

## Quick Start

### 1. Install Dependencies

From the project root:

```bash
pnpm install
```

This will install all dependencies for all workspaces (shared packages, APIs, and services).

### 2. Build Shared Packages

Build the shared TypeScript packages first:

```bash
pnpm build
```

Or build specific shared packages:

```bash
# Build only shared types
cd shared/types && pnpm build

# Build only shared utils
cd shared/utils && pnpm build
```

### 3. Configure Local Settings

The `local.settings.json` files have been created for you. Update them if needed:

**Business Readiness API** (`tools/business-readiness-assessment/api/local.settings.json`):
- `AIRTABLE_API_KEY`: Your Airtable API key (optional - currently disabled)
- `LOGIC_APP_EMAIL_URL`: Your Logic App email endpoint (optional for local dev)
- `NOTIFICATION_EMAIL`: Email to receive submission notifications (optional)

**PDF Generator** (`services/pdf-generator/local.settings.json`):
- No additional configuration needed for local development

### 4. Start the Services

You need to run **two** Azure Functions services simultaneously:

#### Terminal 1: Start PDF Generator Service

```bash
pnpm dev:pdf
```

This starts the PDF generation service on `http://localhost:7072`

**Wait for it to show:**
```
Functions:
  generatePDF: [POST] http://localhost:7072/api/generatePDF
  testPDF: [GET] http://localhost:7072/api/testPDF
```

#### Terminal 2: Start Business Readiness API

```bash
pnpm dev:business-readiness
```

This starts the assessment API on `http://localhost:7071`

**Wait for it to show:**
```
Functions:
  processAssessment: [POST] http://localhost:7071/api/processAssessment
```

### 5. Serve the Frontend

#### Terminal 3: Serve Frontend (Static Files)

You can use any static file server. Here are a few options:

**Option A: Using Python (if installed):**
```bash
cd tools/business-readiness-assessment/frontend
python3 -m http.server 3000
```

**Option B: Using Node.js http-server:**
```bash
# Install globally if you don't have it
npm install -g http-server

cd tools/business-readiness-assessment/frontend
http-server -p 3000 --cors
```

**Option C: Using VS Code Live Server:**
- Install the "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

Frontend will be available at: `http://localhost:3000`

## Testing the Setup

### 1. Test PDF Generator

Open your browser or use curl:

```bash
curl http://localhost:7072/api/testPDF
```

You should see a "PDF test endpoint" response.

### 2. Test the Full Flow

1. Open `http://localhost:3000` in your browser
2. Add UTM parameters to test tracking:
   ```
   http://localhost:3000/?utm_source=local&utm_medium=test&utm_campaign=dev
   ```
3. Fill out the form with test data
4. Submit and verify:
   - You're redirected to `/results.html?id=[UUID]`
   - Results page loads successfully
   - UTM parameters are preserved
   - Check Terminal 2 for PDF generation logs
   - If email is configured, check inbox

### 3. Test with Different Scores

Use the test scenarios from `TESTING_VALIDATION.md`:

**Low Score (35%):**
- Select mostly lowest options (opt_0, opt_1, opt_2)
- Expected: "Exposed" phase, first tension line

**Medium Score (55%):**
- Select mostly middle options (opt_2, opt_3, opt_4)
- Expected: "Ready to Execute" phase, second tension line

**High Score (85%):**
- Select mostly highest options (opt_4, opt_5)
- Expected: "Ready to Execute" phase, "Ready" maturity band

## Project Structure

```
generationai-assessments-4/
├── shared/                                    # Shared packages
│   ├── types/                                 # TypeScript type definitions
│   └── utils/                                 # Shared utilities
├── tools/
│   └── business-readiness-assessment/
│       ├── api/                               # Azure Functions API
│       │   ├── processAssessment/             # Main assessment handler
│       │   ├── shared/                        # Shared API logic
│       │   └── local.settings.json            # ✅ Created
│       └── frontend/                          # Static web app
│           ├── index.html                     # Assessment form
│           ├── results.html                   # ✅ New results page
│           ├── success.html                   # Legacy success page
│           └── assets/
│               ├── css/brand.css
│               └── js/
│                   ├── form-handler.js        # ✅ Updated
│                   ├── results-handler.js     # ✅ New
│                   └── sanitize.js            # ✅ New
└── services/
    └── pdf-generator/                         # PDF generation service
        ├── generatePDF/                       # PDF generation function
        ├── shared/                            # PDF templates
        └── local.settings.json                # ✅ Created
```

## Common Issues & Troubleshooting

### Issue: "Cannot find module '@generation-ai/types'"

**Solution:** Build the shared packages first:
```bash
cd shared/types && pnpm build
cd ../utils && pnpm build
```

### Issue: PDF generation fails with "connection refused"

**Solution:** Make sure the PDF generator is running on port 7072:
```bash
# In Terminal 1
pnpm dev:pdf
```

Wait for it to fully start before testing the assessment.

### Issue: CORS errors in browser

**Solution 1:** Check that both Azure Functions have CORS enabled in `local.settings.json`:
```json
"Host": {
  "CORS": "*",
  "CORSCredentials": false
}
```

**Solution 2:** If using http-server for frontend, add `--cors` flag:
```bash
http-server -p 3000 --cors
```

### Issue: "Port already in use"

**Solution:** Kill the process using the port:

```bash
# For port 7071 (Business Readiness API)
lsof -ti:7071 | xargs kill -9

# For port 7072 (PDF Generator)
lsof -ti:7072 | xargs kill -9

# For port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Issue: Changes not reflected

**Solution:** TypeScript needs to be recompiled:

```bash
# Stop the service (Ctrl+C)
# Rebuild
pnpm build

# Or use watch mode for auto-rebuild
pnpm --filter business-readiness-assessment-api watch
```

### Issue: Results page shows "Unable to Load Results"

**Solution:** This means sessionStorage doesn't have the data. Check:

1. Did you submit the form from `localhost:3000`? (not a file:// URL)
2. Are you in the same browser/tab? (sessionStorage doesn't persist across browsers)
3. Check browser console for JavaScript errors
4. Verify the form submission succeeded in the Network tab

### Issue: Email not sending

**Expected:** In development mode, emails are optional. Check Terminal 2 for logs:

```
Email send failed: [error details]
Continuing without email (development mode)
```

PDFs are saved locally in development mode:
```
📄 PDF saved locally: /path/to/pdfs/Business-Readiness-Report-[company]-[timestamp].pdf
```

## Development Workflow

### Making Backend Changes

1. Edit TypeScript files in `api/` or `services/`
2. Save the file (TypeScript will auto-compile if using watch mode)
3. Azure Functions will auto-reload
4. Test in browser

### Making Frontend Changes

1. Edit HTML/CSS/JS files in `frontend/`
2. Save the file
3. Refresh browser (or auto-reloads with Live Server)
4. Test changes

### Making Shared Package Changes

1. Edit files in `shared/types/` or `shared/utils/`
2. Rebuild the package:
   ```bash
   cd shared/types && pnpm build
   ```
3. Restart dependent services

## Development URLs

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Business Readiness API | 7071 | http://localhost:7071/api/processAssessment |
| PDF Generator | 7072 | http://localhost:7072/api/generatePDF |

## Next Steps

1. ✅ Complete this setup
2. 📝 Follow `TESTING_VALIDATION.md` for comprehensive testing
3. 🔍 Review `IMPLEMENTATION_SUMMARY.md` for architecture details
4. 🚀 Deploy to staging once local testing is complete

## Useful Commands

```bash
# Install all dependencies
pnpm install

# Build everything
pnpm build

# Build specific service
pnpm build:business-readiness
pnpm build:pdf

# Start development servers
pnpm dev:business-readiness    # Port 7071
pnpm dev:pdf                    # Port 7072

# Clean build artifacts
pnpm clean

# Clean specific service
cd tools/business-readiness-assessment/api && pnpm clean
```

## Environment Variables Reference

### Business Readiness API

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `AIRTABLE_API_KEY` | No | - | Airtable API key (currently disabled) |
| `AIRTABLE_BASE_ID` | No | - | Airtable base ID (currently disabled) |
| `LOGIC_APP_EMAIL_URL` | No* | - | Logic App email endpoint |
| `PDF_SERVICE_URL` | Yes | `http://localhost:7072/api/generatePDF` | PDF generator URL |
| `PDF_SERVICE_KEY` | No | - | PDF service auth key (optional for local) |
| `NOTIFICATION_EMAIL` | No | - | Email for submission notifications |

*Not required for local development (emails are optional)

### PDF Generator

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |

## Support

If you encounter issues not covered here:

1. Check the Azure Functions logs in your terminal
2. Check browser console for JavaScript errors
3. Review `IMPLEMENTATION_SUMMARY.md` for architecture details
4. Check `TESTING_VALIDATION.md` for expected behavior

