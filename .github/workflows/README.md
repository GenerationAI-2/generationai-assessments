# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for automated deployment of all services.

## Workflows

1. **deploy-frontend.yml** - Deploys the Static Web App frontend
2. **deploy-shadow-ai-api.yml** - Deploys the Shadow AI Assessment API
3. **deploy-pdf-generator.yml** - Deploys the PDF Generator service

## Required GitHub Secrets

To enable CI/CD, you need to add the following secrets to your GitHub repository:

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN

Get this token:
```bash
az staticwebapp secrets list \
  --name generationai-shadow-ai-frontend \
  --resource-group generationai-rg \
  --query "properties.apiKey" -o tsv
```

Run the command above to get the current token value.

### 2. AZURE_FUNCTIONAPP_PUBLISH_PROFILE_SHADOW_AI

Get the publish profile:
```bash
az functionapp deployment list-publishing-profiles \
  --name generationai-shadow-ai \
  --resource-group generationai-rg \
  --xml > shadow-ai-publish-profile.xml
```

Then copy the entire XML content to GitHub Secrets.

### 3. AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PDF_GENERATOR

Get the publish profile:
```bash
az functionapp deployment list-publishing-profiles \
  --name generationai-pdf-generator \
  --resource-group generationai-rg \
  --xml > pdf-generator-publish-profile.xml
```

Then copy the entire XML content to GitHub Secrets.

## Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the name and value from above

## Deployment Triggers

- **Automatic**: Workflows trigger automatically when you push changes to the `main` branch in the relevant paths:
  - Frontend: `tools/shadow-ai-assessment/frontend/**`
  - API: `tools/shadow-ai-assessment/api/**`
  - PDF Generator: `services/pdf-generator/**`

- **Manual**: You can also trigger deployments manually:
  1. Go to **Actions** tab in GitHub
  2. Select the workflow
  3. Click **Run workflow**

## First Time Setup

After adding the secrets, you can test the workflows by:

1. Making a small change to any service (e.g., update a comment)
2. Commit and push to the `main` branch
3. Check the **Actions** tab to monitor deployment progress

Or manually trigger the workflows from the Actions tab.
