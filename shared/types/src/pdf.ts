/**
 * Shared types for PDF generation service
 */

import { ReportData } from './assessment';

export interface PDFGenerationRequest {
  reportData: ReportData;
}

export interface PDFGenerationResponse {
  success: boolean;
  pdfBase64?: string;
  error?: string;
  sizeKB?: number;
}