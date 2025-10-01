# Business Readiness Assessment API

Azure Functions API for the Business Readiness Assessment tool.

## Setup

1. Copy the template settings file:
   ```bash
   cp local.settings.json.template local.settings.json
   ```

2. Update `local.settings.json` with your actual values:
   - `AIRTABLE_API_KEY` - Your Airtable API key
   - `AIRTABLE_BASE_ID` - Your Airtable base ID (default: apptxnwqucezx8knv)
   - `AIRTABLE_TABLE_NAME` - Table name: `Business-Readiness-Assessment`
   - `LOGIC_APP_EMAIL_URL` - Your Azure Logic App email endpoint
   - `PDF_SERVICE_URL` - PDF Generator service URL (local: http://localhost:7072/api/generatePDF)

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Build:
   ```bash
   pnpm build
   ```

5. Run locally:
   ```bash
   func start --port 7073
   ```

## Airtable Setup

Create a new table in Airtable named `Business-Readiness-Assessment` with appropriate fields for your business readiness questions.

## Deployment

```bash
pnpm build
func azure functionapp publish generationai-business-readiness
```
