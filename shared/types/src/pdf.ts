/**
 * Shared types for PDF generation service
 */

import { ReportData } from './assessment';

export interface PDFGenerationRequest {
  reportData: ReportData | any; // Allow any report data structure (Shadow AI or Business Readiness)
}

export interface PDFGenerationResponse {
  success: boolean;
  pdfBase64?: string;
  error?: string;
  sizeKB?: number;
}