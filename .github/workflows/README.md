# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for automated deployment of all services.

## Workflows

1. **deploy-frontend.yml** - Deploys the Shadow AI Static Web App frontend
2. **deploy-shadow-ai-api.yml** - Deploys the Shadow AI Assessment API
3. **deploy-business-readiness-frontend.yml** - Deploys the Business Readiness Static Web App frontend
4. **deploy-business-readiness-api.yml** - Deploys the Business Readiness Assessment API
5. **deploy-pdf-generator.yml** - Deploys the PDF Generator service (shared)

## Required GitHub Secrets

To enable CI/CD, you need to add the following secrets to your GitHub repository:

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN

Get this token for Shadow AI frontend:
```bash
az staticwebapp secrets list \
  --name generationai-shadow-ai-frontend \
  --resource-group generationai-rg \
  --query "properties.apiKey" -o tsv
```

### 2. AZURE_STATIC_WEB_APPS_API_TOKEN_BUSINESS_READINESS

Get this token for Business Readiness frontend:
```bash
az staticwebapp secrets list \
  --name generationai-business-readiness-frontend \
  --resource-group generationai-rg \
  --query "properties.apiKey" -o tsv
```

### 3. Azure Service Principal Secrets (for API deployments)

The API deployments use Azure CLI with service principal authentication. Add these secrets:
- `AZURE_CLIENT_ID` - Service principal application ID
- `AZURE_CLIENT_SECRET` - Service principal password
- `AZURE_TENANT_ID` - Azure AD tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID

### 4. AZURE_FUNCTIONAPP_PUBLISH_PROFILE_SHADOW_AI (Alternative method)

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
  - Shadow AI Frontend: `tools/shadow-ai-assessment/frontend/**`
  - Shadow AI API: `tools/shadow-ai-assessment/api/**`
  - Business Readiness Frontend: `tools/business-readiness-assessment/frontend/**`
  - Business Readiness API: `tools/business-readiness-assessment/api/**`
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
