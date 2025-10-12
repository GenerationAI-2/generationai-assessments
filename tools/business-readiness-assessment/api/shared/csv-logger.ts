/**
 * CSV Logger for Azure Blob Storage
 * Appends assessment submissions to CSV files in blob storage
 */

import { BlobServiceClient } from '@azure/storage-blob';

const CONTAINER_NAME = 'assessment-submissions';

interface CSVSubmission {
  timestamp: string;
  email: string;
  contact_name: string;
  company_name: string;
  opt_in_marketing: boolean;
  score: number;
  maturity_band: string;
  [key: string]: any; // For assessment-specific fields
}

/**
 * Append submission data to CSV file in blob storage
 */
export async function logSubmissionToCSV(
  assessmentType: string,
  submission: CSVSubmission
): Promise<void> {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      console.warn('AZURE_STORAGE_CONNECTION_STRING not configured - skipping CSV logging');
      return;
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Create container if it doesn't exist
    await containerClient.createIfNotExists({
      access: 'blob'
    });

    // Generate filename: assessment-type-YYYY-MM.csv
    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const blobName = `${assessmentType}-${monthYear}.csv`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Check if blob exists to determine if we need headers
    let csvContent = '';
    let needsHeader = false;

    try {
      const downloadResponse = await blockBlobClient.download();
      const existingContent = await streamToString(downloadResponse.readableStreamBody!);
      csvContent = existingContent;
      needsHeader = false;
    } catch (error) {
      // Blob doesn't exist, need to add header
      needsHeader = true;
    }

    // Convert submission to CSV row
    const row = submissionToCSVRow(submission);

    if (needsHeader) {
      const headers = Object.keys(submission).join(',');
      csvContent = headers + '\n' + row + '\n';
    } else {
      csvContent += row + '\n';
    }

    // Upload updated CSV
    await blockBlobClient.upload(csvContent, Buffer.byteLength(csvContent), {
      blobHTTPHeaders: { blobContentType: 'text/csv' }
    });

    console.log(`✅ CSV logged: ${blobName}`);
  } catch (error: any) {
    console.error('CSV logging error:', error);
    // Don't throw - logging failure shouldn't break the assessment
  }
}

/**
 * Convert submission object to CSV row
 */
function submissionToCSVRow(submission: CSVSubmission): string {
  return Object.values(submission)
    .map(value => {
      // Handle arrays, objects, and special characters
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value)}"`;
      }
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
    .join(',');
}

/**
 * Helper to convert stream to string
 */
async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    readableStream.on('error', reject);
  });
}
