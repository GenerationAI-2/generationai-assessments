# Logic App Email Setup Guide

**📧 Configure Email Delivery for Business AI Readiness Assessment**

This guide helps you set up Azure Logic App to send assessment PDFs via email.

---

## 🎯 What This Does

The Logic App receives HTTP requests from the Business API and sends emails with PDF attachments.

**Flow:** Business API → Logic App → Email Service → Recipient

---

## 🚀 Quick Setup (Azure Portal)

### Step 1: Create Logic App

1. Go to **Azure Portal** → **Create a resource**
2. Search for **Logic App**
3. Click **Create**
4. **Basics:**
   - Subscription: Your subscription
   - Resource Group: `generationai-rg` (same as other services)
   - Name: `generationai-email-logic-app`
   - Region: Same as your other resources (e.g., Australia East)
   - Plan type: **Consumption** (pay-per-use)
5. Click **Review + Create** → **Create**

### Step 2: Configure Workflow

1. Once created, open the Logic App
2. Click **Logic app designer** in the left menu
3. Select **Blank Logic App** template

### Step 3: Add HTTP Trigger

1. Search for **"Request"**
2. Select **"When a HTTP request is received"**
3. Click **Use sample payload to generate schema**
4. Paste this JSON schema:

```json
{
  "to": "recipient@example.com",
  "subject": "Your Business AI Readiness Report - 50/100",
  "body": "Thank you for completing the Business AI Readiness Assessment.\n\nYour results are attached as a PDF.\n\nYour score: 50/100\nMaturity band: Ad Hoc\n\nNext steps:\nBook your 20-minute discovery call: https://meetings-ap1.hubspot.com/caleb-lucas1\n\nBest regards,\nGenerationAI Team",
  "pdfBase64": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...",
  "pdfFilename": "Business-AI-Readiness-Report.pdf"
}
```

5. Click **Done**
6. **Save** the Logic App
7. Copy the **HTTP POST URL** (you'll need this for deployment)

### Step 4: Add Email Action

#### Option A: Office 365 Outlook (Recommended for Business)

1. Click **+ New step**
2. Search for **"Office 365 Outlook"**
3. Select **"Send an email (V2)"**
4. Click **Sign in** and authenticate with your Office 365 account
5. Configure the email:

**To:**
```
@{triggerBody()?['to']}
```

**Subject:**
```
@{triggerBody()?['subject']}
```

**Body:**
```
@{triggerBody()?['body']}
```

**Attachments:**
- Click **Add new parameter** → Select **Attachments**
- Click **Switch to input entire array**
- Paste this expression:

```json
[
  {
    "Name": "@{triggerBody()?['pdfFilename']}",
    "ContentBytes": "@{triggerBody()?['pdfBase64']}"
  }
]
```

6. **Save** the Logic App

---

#### Option B: Gmail (Alternative)

1. Click **+ New step**
2. Search for **"Gmail"**
3. Select **"Send email (V2)"**
4. Click **Sign in** and authenticate with your Gmail account
5. Configure the email:

**To:**
```
@{triggerBody()?['to']}
```

**Subject:**
```
@{triggerBody()?['subject']}
```

**Body:**
```
@{triggerBody()?['body']}
```

**Attachments:**
- Click **Add new parameter** → **Attachments**
- For **Attachments Name**: `@{triggerBody()?['pdfFilename']}`
- For **Attachments Content**: `@{base64ToBinary(triggerBody()?['pdfBase64'])}`

6. **Save** the Logic App

---

#### Option C: SendGrid (Scalable Alternative)

If you prefer SendGrid:

1. Click **+ New step**
2. Search for **"SendGrid"**
3. Select **"Send email (V4)"**
4. Enter your **SendGrid API Key**
5. Configure:

**From:** `noreply@generationai.co.nz`  
**To:** `@{triggerBody()?['to']}`  
**Subject:** `@{triggerBody()?['subject']}`  
**Email body:** `@{triggerBody()?['body']}`

**Attachments:**
```json
[
  {
    "filename": "@{triggerBody()?['pdfFilename']}",
    "content": "@{triggerBody()?['pdfBase64']}",
    "type": "application/pdf"
  }
]
```

6. **Save** the Logic App

---

## 📋 Step 5: Get the HTTP URL

1. Go back to the **"When a HTTP request is received"** trigger
2. Copy the **HTTP POST URL**
3. Save it - you'll use this as `LOGIC_APP_EMAIL_URL` during deployment

**Example URL:**
```
https://prod-12.australiaeast.logic.azure.com:443/workflows/abc123.../triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xyz789...
```

---

## 🧪 Test the Logic App

### Test with cURL

```bash
export LOGIC_APP_URL="<paste-your-url-here>"

curl -X POST "$LOGIC_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email from Logic App",
    "body": "This is a test email to verify Logic App is working.\n\nIf you receive this, the setup is correct!",
    "pdfBase64": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggNDQ+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKFRlc3QgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY2IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIyNiAwMDAwMCBuIAowMDAwMDAwMjk2IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMzg5CiUlRU9G",
    "pdfFilename": "test-report.pdf"
  }'
```

**✅ Expected Result:** You should receive an email with a PDF attachment within 1-2 minutes.

---

## 🔍 Troubleshooting

### Check Run History

1. Go to Logic App in Azure Portal
2. Click **Overview** → **Runs history**
3. Click on the latest run
4. Review each step:
   - ✅ Green = Success
   - ❌ Red = Failed

### Common Issues

#### Issue: "Authorization failed"
**Solution:** Re-authenticate your email connector:
1. Go to Logic App Designer
2. Click on the email action
3. Click **Change connection**
4. Sign in again

#### Issue: "Schema validation failed"
**Solution:** Verify the JSON schema matches the example above exactly.

#### Issue: Email not received
**Checklist:**
- [ ] Check spam/junk folder
- [ ] Verify email address in test is correct
- [ ] Check Logic App run history for errors
- [ ] Verify email service (Office 365/Gmail) is working

#### Issue: PDF is blank or corrupt
**Solution:** The `pdfBase64` must be valid base64-encoded PDF data. Use the test string above to verify Logic App is working, then test with actual PDF data from the API.

---

## 🔐 Security Best Practices

1. **Restrict HTTP Trigger Access:**
   - The URL contains a signature (`sig=`) that acts as authentication
   - Don't share the URL publicly
   - Rotate the signature periodically

2. **Use Managed Identity (Advanced):**
   - For production, consider using Azure Key Vault
   - Store Logic App URL in Key Vault
   - Reference from Function App settings

3. **Monitor Usage:**
   - Set up alerts for failed runs
   - Track run count for cost management

---

## 💰 Cost Estimate

**Logic App Consumption Plan Pricing:**
- First 4,000 executions/month: **Free**
- Additional executions: ~$0.000025 per execution

**For 500 assessments/month:**
- Cost: **~$0** (within free tier)

**For 10,000 assessments/month:**
- Cost: **~$0.15** (6,000 × $0.000025)

**Very cost-effective! 🎉**

---

## 📊 Monitoring

### Set Up Alerts

```bash
# Create action group for email notifications
az monitor action-group create \
  --name "email-alerts" \
  --resource-group generationai-rg \
  --short-name "EmailAlert" \
  --email-receiver "admin@generationai.co.nz" email-admin

# Create alert for failed runs
az monitor metrics alert create \
  --name "logic-app-failures" \
  --resource-group generationai-rg \
  --scopes "/subscriptions/<sub-id>/resourceGroups/generationai-rg/providers/Microsoft.Logic/workflows/generationai-email-logic-app" \
  --condition "count RunsFailed > 5 where TimeGrain = PT5M" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action email-alerts
```

### View Metrics

In Azure Portal:
- **Logic App** → **Metrics**
- Track: Runs Started, Runs Succeeded, Runs Failed
- Set time range: Last 24 hours / 7 days

---

## ✅ Verification Checklist

Before proceeding with deployment:

- [ ] Logic App created successfully
- [ ] HTTP trigger configured with correct schema
- [ ] Email action (Office 365/Gmail/SendGrid) authenticated
- [ ] Email attachments configured correctly
- [ ] Test email sent and received successfully
- [ ] PDF attachment opens correctly
- [ ] Logic App URL copied and saved securely
- [ ] Run history shows green (successful) test run

---

## 📝 Next Steps

Once your Logic App is working:

1. **Copy the HTTP POST URL**
2. **Save it as `LOGIC_APP_EMAIL_URL`** for deployment
3. **Proceed to** [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md) **Step 3**

---

**Need help?** Check the [Troubleshooting](#troubleshooting) section or Azure Logic Apps documentation.

