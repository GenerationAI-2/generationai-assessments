/**
 * PDF Generation Engine using Puppeteer
 * Extracted from the monolithic pdf-service
 */

import { ReportData } from '@generation-ai/types';
import { generatePDFHTML } from './pdf-template';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function generatePDFBuffer(reportData: ReportData): Promise<Buffer> {
  try {
    console.log('📄 Generating PDF with Puppeteer...');
    const html = generatePDFHTML(reportData);

    // Configure browser for local vs serverless environment
    let browser;
    if (isDevelopment) {
      // Use full puppeteer for local development
      const puppeteerFull = await import('puppeteer');
      browser = await puppeteerFull.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } else {
      // Use puppeteer-core with chromium for serverless
      const puppeteerCore = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');
      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
      });
    }

    const page = await browser.newPage();

    // Set content and wait for any dynamic elements
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '20mm',
        bottom: '15mm',
        left: '20mm',
      },
    });

    await browser.close();

    console.log(`✅ PDF generated successfully (${Math.round(pdfBuffer.length / 1024)}KB)`);
    return Buffer.from(pdfBuffer);

  } catch (error: any) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}