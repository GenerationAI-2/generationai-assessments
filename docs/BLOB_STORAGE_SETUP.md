# Azure Blob Storage Setup for CSV Logging

This document explains how to configure Azure Blob Storage to log assessment submissions as CSV files.

## Overview

All assessment submissions are automatically logged to Azure Blob Storage in CSV format. Each assessment creates monthly CSV files that can be downloaded and opened in Excel for analysis.

## Azure Portal Setup

### 1. Create Storage Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Storage Accounts**
3. Click **+ Create**
4. Configure:
   - **Name**: `generationaidata` (or your preferred name)
   - **Region**: Same as your Function Apps
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage) is sufficient
5. Click **Review + Create** → **Create**

### 2. Get Connection String

1. Go to your new Storage Account
2. Navigate to **Security + networking** → **Access keys**
3. Copy the **Connection string** from key1 or key2
4. Save this securely - you'll need it for environment variables

### 3. Container Creation

The container `assessment-submissions` will be created automatically by the code. No manual setup needed!

## Environment Variable Configuration

Add this environment variable to each Azure Function App:

```
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string-from-step-2>
```

### How to Add to Azure Function Apps:

1. Go to your Function App in Azure Portal
2. Navigate to **Settings** → **Environment variables**
3. Click **+ Add**
4. Name: `AZURE_STORAGE_CONNECTION_STRING`
5. Value: Paste your connection string
6. Click **Apply** → **Confirm**

Repeat for all 4 assessment Function Apps:
- `generationai-shadow-ai`
- `generationai-business-readiness`
- `generationai-board-governance`
- `generationai-personal-ai-readiness`

## CSV File Format

### File Naming Convention

Files are created monthly and named as:
```
{assessment-type}-{YYYY-MM}.csv
```

Examples:
- `shadow-ai-2025-10.csv`
- `board-governance-2025-10.csv`
- `business-readiness-2025-10.csv`
- `personal-ai-readiness-2025-10.csv`

### CSV Columns

Each CSV includes:

**Common Fields:**
- `timestamp` - ISO 8601 timestamp
- `email` - User email address
- `contact_name` - User's name
- `company_name` - Company/organization name
- `opt_in_marketing` - true/false for marketing consent
- `score` - Assessment score
- `maturity_band` - Maturity level/band

**Assessment-Specific Fields:**
- Shadow AI: org_size, sector, access, incidents, approval, etc.
- Board Governance: q1_board_risk through q13_decision
- Business Readiness: q1_ownership through q10_opportunity
- Personal AI Readiness: q1_frequency through q12_safety

## Downloading CSV Files

### From Azure Portal:

1. Go to your Storage Account
2. Navigate to **Data storage** → **Containers**
3. Click on `assessment-submissions`
4. Download any CSV file by clicking the **...** menu → **Download**

### Using Azure Storage Explorer:

1. Download [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
2. Connect using your connection string
3. Navigate to your storage account → **Blob Containers** → `assessment-submissions`
4. Download files or view/edit directly

## Data Privacy & Security

- Connection string should be stored securely in Azure Key Vault (recommended)
- Container access is set to `blob` level (authenticated access only)
- CSV files contain PII - ensure proper data handling compliance
- Consider setting up automated backups or data retention policies

## Troubleshooting

### CSV Logging Fails

If you see "CSV logging failed" in logs:

1. **Check connection string**: Verify it's correctly configured in environment variables
2. **Check storage account**: Ensure it exists and is accessible
3. **Check permissions**: Storage account must allow Function App to write

The assessment will still complete successfully even if CSV logging fails - it's designed to be non-blocking.

### Container Not Created

The container is created automatically with this code:
```typescript
await containerClient.createIfNotExists({ access: 'blob' });
```

If it doesn't exist after first submission, check Function App has proper permissions to the storage account.

## Cost Estimation

Azure Blob Storage is very cost-effective:

- **Storage**: ~$0.02 per GB per month
- **Operations**: Minimal cost for read/write operations
- **Expected cost**: <$5/month for typical assessment volumes

## Future Enhancements

Potential improvements:
- Automated export to Excel with formatting
- Weekly/monthly email summaries
- Power BI integration
- Automatic archival after 12 months
- Data anonymization for long-term storage
