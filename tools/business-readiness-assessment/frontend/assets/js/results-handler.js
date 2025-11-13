/**
 * Business Readiness Assessment - Results Page Handler
 * Loads results from sessionStorage and renders dynamic content
 */

class ResultsHandler {
    constructor() {
        this.submissionId = null;
        this.data = null;
        this.utmParams = {};

        this.init();
    }

    init() {
        // Extract submission ID from URL
        this.submissionId = this.getSubmissionIdFromURL();

        if (!this.submissionId) {
            this.showError();
            return;
        }

        // Load data from sessionStorage
        this.data = this.loadDataFromStorage();

        if (!this.data) {
            this.showError();
            return;
        }

        // Load UTM parameters
        this.loadUTMParams();

        // Render all sections
        this.renderResults();

        // Track page view (placeholder for analytics)
        this.trackEvent('report_viewed', {
            submission_id: this.submissionId,
            score: this.data.readiness_score,
            band: this.data.readiness_band
        });
    }

    getSubmissionIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    loadDataFromStorage() {
        try {
            const storageKey = `assessment_result_${this.submissionId}`;
            const storedData = sessionStorage.getItem(storageKey);
            
            if (!storedData) {
                console.error('No data found in sessionStorage for:', storageKey);
                return null;
            }

            return JSON.parse(storedData);
        } catch (error) {
            console.error('Error loading data from storage:', error);
            return null;
        }
    }

    loadUTMParams() {
        try {
            const storedParams = sessionStorage.getItem('utm_params');
            if (storedParams) {
                this.utmParams = JSON.parse(storedParams);
            }
        } catch (error) {
            console.error('Error loading UTM params:', error);
        }
    }

    renderResults() {
        // Hide loading, show content
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('results-content').classList.remove('hidden');
        document.getElementById('report-header').style.display = 'block';

        // Render each section
        this.renderReportHeader();
        this.renderScoreSection();
        this.renderTensionLine();
        this.renderDetailedFeedback();
        this.renderPriorityGaps();
        this.renderScheduler();
        this.renderUserEmail();
    }

    renderReportHeader() {
        // Populate report header with company and contact info
        const companyName = sanitizeText(this.data.company_name || 'Your Organisation');
        document.getElementById('header-company-name').textContent = companyName;
        document.getElementById('header-contact-name').textContent = sanitizeText(this.data.contact_name || '');

        // Format date
        const date = this.data.response_date || new Date().toLocaleDateString('en-NZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        document.getElementById('header-date').textContent = date;

        // Also populate footer company name
        document.getElementById('footer-company-name').textContent = companyName;
    }

    renderScoreSection() {
        const score = parseInt(this.data.readiness_score) || 0;

        // Score number
        document.getElementById('score-display').textContent = score + '/100';

        // Maturity badge
        const badgeEl = document.getElementById('maturity-badge');
        const bandClass = this.getMaturityClass(this.data.readiness_band);
        badgeEl.className = `maturity-badge ${bandClass}`;
        badgeEl.textContent = sanitizeText(this.data.readiness_band);
    }

    getMaturityClass(band) {
        const bandLower = String(band).toLowerCase();
        if (bandLower.includes('blind')) return 'maturity-blind';
        if (bandLower.includes('reactive')) return 'maturity-reactive';
        if (bandLower.includes('building')) return 'maturity-building';
        if (bandLower.includes('advanced')) return 'maturity-advanced';
        return 'maturity-reactive';
    }

    renderTensionLine() {
        const tensionEl = document.getElementById('tension-line');
        tensionEl.textContent = sanitizeText(this.data.tension_line);
    }

    renderDetailedFeedback() {
        const container = document.getElementById('detailed-feedback');
        
        // Debug: Log the scores to see what we're getting
        console.log('Question scores:', {
            q1: this.data.q1_score,
            q5: this.data.q5_score,
            q6: this.data.q6_score,
            q9: this.data.q9_score,
            q10: this.data.q10_score
        });
        
        // Show all 5 questions in the same order as PDF
        const feedbackItems = [
            {
                title: 'Shadow AI Exposure',
                intro: 'Shadow AI means staff using unapproved AI tools (like ChatGPT, Gemini or Claude) without oversight.',
                playback: this.data.q5_answer_playback,
                interpretation: this.data.q5_interpretation_blurb,
                score: this.data.q5_score || 0
            },
            {
                title: 'Leadership & Ownership',
                intro: null,
                playback: this.data.q1_answer_playback,
                interpretation: this.data.q1_interpretation_blurb,
                score: this.data.q1_score || 0
            },
            {
                title: 'Governance & Risk Management',
                intro: 'Many organisations discover their AI governance gaps the hard way, through incidents, not intention.',
                playback: this.data.q6_answer_playback,
                interpretation: this.data.q6_interpretation_blurb,
                score: this.data.q6_score || 0
            },
            {
                title: 'Data & IP Protection',
                intro: null,
                playback: this.data.q9_answer_playback,
                interpretation: this.data.q9_interpretation_blurb,
                score: this.data.q9_score || 0
            },
            {
                title: 'Opportunity Understanding',
                intro: null,
                playback: this.data.q10_answer_playback,
                interpretation: this.data.q10_interpretation_blurb,
                score: this.data.q10_score || 0
            }
        ];

        let html = '';
        feedbackItems.forEach(item => {
            const scoreClass = this.getScoreColorClass(item.score);
            html += `
                <div class="feedback-item">
                    <h3>${sanitizeHTML(item.title)}</h3>
                    ${item.intro ? `<p class="text-muted mb-md">${sanitizeHTML(item.intro)}</p>` : ''}
                    <div class="answer-playback ${scoreClass}">
                        <strong>What you told us:</strong> ${sanitizeHTML(item.playback)}
                    </div>
                    <div class="interpretation">
                        <strong>What this means:</strong> ${sanitizeHTML(item.interpretation)}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getScoreColorClass(score) {
        // Debug: Log each score as it's processed
        console.log('Processing score:', score, 'type:', typeof score);
        
        // Convert to number if it's a string
        const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
        
        // Return CSS class based on score (0-5)
        if (numScore === 5) return 'score-excellent';  // Green
        if (numScore === 4) return 'score-good';       // Light blue
        if (numScore === 3) return 'score-moderate';   // Very light blue
        if (numScore === 2) return 'score-needs-attention'; // Amber
        if (numScore <= 1) return 'score-critical';    // Red
        return 'score-moderate'; // Default
    }

    renderPriorityGaps() {
        const container = document.getElementById('priority-gaps');
        
        const gaps = [
            { 
                title: this.data.gap_1_title, 
                description: this.data.gap_1_description,
                recommendation: this.data.gap_1_recommendation
            },
            { 
                title: this.data.gap_2_title, 
                description: this.data.gap_2_description,
                recommendation: this.data.gap_2_recommendation
            },
            { 
                title: this.data.gap_3_title, 
                description: this.data.gap_3_description,
                recommendation: this.data.gap_3_recommendation
            }
        ];

        // Filter out placeholder/empty gaps
        const actualGaps = gaps.filter(gap => 
            gap.title && 
            gap.title !== 'No significant gaps identified' &&
            gap.title !== 'Continue current progress' &&
            gap.title !== 'Maintain momentum' &&
            gap.description
        );

        // If no actual gaps, hide the entire section
        const gapsSection = container.closest('.section');
        if (actualGaps.length === 0) {
            if (gapsSection) {
                gapsSection.style.display = 'none';
            }
            return;
        }

        // Show section if it was hidden
        if (gapsSection) {
            gapsSection.style.display = '';
        }

        let html = '';
        actualGaps.forEach((gap, index) => {
            html += `
                <div class="gap-item">
                    <h3>${index + 1}. ${sanitizeHTML(gap.title)}</h3>
                    <p class="gap-description">${sanitizeHTML(gap.description)}</p>
                    ${gap.recommendation ? `<p class="gap-recommendation">${sanitizeHTML(gap.recommendation)}</p>` : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Gap summary
        const summaryEl = document.getElementById('gap-summary');
        if (this.data.gap_summary_blurb) {
            summaryEl.textContent = sanitizeText(this.data.gap_summary_blurb);
        }
        
        // Add bridging sentence connecting gaps to GEN5 framework
        const bridgingSentence = document.getElementById('gaps-bridging-sentence');
        if (bridgingSentence && actualGaps.length > 0) {
            bridgingSentence.textContent = "These recommendations map directly to the GEN5™ framework: the five essential elements every business needs to move from AI exposure to AI advantage.";
        }
    }

    renderScheduler() {
        // Setup CTA button click tracking
        const ctaLink = document.getElementById('cta-link');
        if (ctaLink) {
            ctaLink.addEventListener('click', () => {
                this.trackEvent('cta_clicked', {
                    submission_id: this.submissionId,
                    cta_url: ctaLink.href
                });
            });
        }

        this.trackEvent('cta_loaded', {
            submission_id: this.submissionId
        });
    }

    renderUserEmail() {
        const emailEl = document.getElementById('user-email');
        if (this.data.email) {
            emailEl.textContent = sanitizeText(this.data.email);
        }
    }

    showError() {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
    }

    trackEvent(eventName, data = {}) {
        // Placeholder for analytics integration
        // Replace with actual analytics service (GA4, Mixpanel, etc.)
        console.log(`[Analytics Event] ${eventName}`, data);

        // Example for Google Analytics 4:
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, data);
        // }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ResultsHandler();
});

