# Business AI Readiness Assessment - Local Development

## Quick Start

From the **project root** directory:

```bash
# Option 1: Automated startup (macOS/Linux)
./dev-start.sh
```

OR

```bash
# Option 2: Manual startup (3 terminals)

# Terminal 1: PDF Generator
pnpm dev:pdf

# Terminal 2: Business Readiness API  
pnpm dev:business-readiness

# Terminal 3: Frontend Server
cd tools/business-readiness-assessment/frontend
python3 -m http.server 3000
```

## Access URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:7071/api/processAssessment
- **PDF Service**: http://localhost:7072/api/generatePDF

## Test the New Features

1. Open http://localhost:3000/?utm_source=test&utm_medium=local
2. Fill in test data and submit
3. Verify redirect to `/results.html?id=[UUID]`
4. Check new features:
   - ✅ Journey signposting
   - ✅ Tension line (changes based on score)
   - ✅ 5-step roadmap visual
   - ✅ HubSpot scheduler integration
   - ✅ UTM parameters preserved

## Test Scenarios

### Low Score (~35%)
- Select lowest options (opt_0, opt_1, opt_2)
- **Expected**: "Exposed" phase + first tension line

### Medium Score (~55%)
- Select middle options (opt_2, opt_3, opt_4)
- **Expected**: "Ready to Execute" phase + second tension line

### High Score (~85%)
- Select highest options (opt_4, opt_5)
- **Expected**: "Ready" maturity band + second tension line

## Troubleshooting

### Port Already in Use

```bash
# Kill processes on specific ports
lsof -ti:7071 | xargs kill -9  # API
lsof -ti:7072 | xargs kill -9  # PDF
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Results Page Shows Error

Check:
1. Did you submit from localhost:3000? (not file://)
2. Are you in the same browser session?
3. Check browser console for errors

### PDF Generation Fails

Make sure PDF service is running:
```bash
curl http://localhost:7072/api/generatePDF
```

## Full Documentation

- **Complete Setup Guide**: See `/LOCAL_SETUP.md` in project root
- **Testing Guide**: See `TESTING_VALIDATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## Development Workflow

1. Make changes to code
2. TypeScript auto-compiles (if using `dev` commands)
3. Azure Functions auto-reload
4. Refresh browser to test

## Configuration

Local settings are in:
- `api/local.settings.json` - API configuration
- `../../services/pdf-generator/local.settings.json` - PDF service config

No additional configuration needed for local development!

