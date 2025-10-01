# Business Readiness Assessment - Frontend

Static HTML/CSS/JavaScript frontend for the Business Readiness Assessment tool.

## Local Development

```bash
cd tools/business-readiness-assessment/frontend
python3 -m http.server 8081
```

Visit: http://localhost:8081

## Configuration

Update the API endpoint in your JavaScript file to point to:
- Local: `http://localhost:7073/api/processAssessment`
- Production: Your deployed Azure Function URL

## Deployment

Automatically deploys to Azure Static Web Apps via GitHub Actions when changes are pushed to main branch.

Production URL: https://lively-bay-0fbbe1300.2.azurestaticapps.net

## Customization

- Update questions in `index.html`
- Modify branding and styling as needed
- Ensure form fields match your Airtable schema
