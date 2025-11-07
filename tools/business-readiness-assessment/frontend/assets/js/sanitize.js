/**
 * Simple XSS sanitization utilities
 * Escapes HTML special characters to prevent XSS attacks
 */

function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeText(str) {
    if (!str) return '';
    return String(str).trim();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sanitizeHTML, sanitizeText };
}

