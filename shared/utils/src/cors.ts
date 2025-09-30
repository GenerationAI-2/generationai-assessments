/**
 * CORS utilities for Azure Functions
 */

export function getCorsHeaders(origin?: string) {
  return {
    'Access-Control-Allow-Origin': origin || process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}