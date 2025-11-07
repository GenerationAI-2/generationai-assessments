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

        // Render each section
        this.renderScoreSection();
        this.renderTensionLine();
        this.renderPlaybook();
        this.renderDetailedFeedback();
        this.renderPriorityGaps();
        this.renderScheduler();
        this.renderUserEmail();
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

        // Maturity narrative
        const narrativeEl = document.getElementById('maturity-narrative');
        narrativeEl.textContent = sanitizeText(this.data.readiness_band_narrative);
    }

    getMaturityClass(band) {
        const bandLower = String(band).toLowerCase();
        if (bandLower.includes('unmanaged')) return 'maturity-unmanaged';
        if (bandLower.includes('ad hoc') || bandLower.includes('adhoc')) return 'maturity-adhoc';
        if (bandLower.includes('developing')) return 'maturity-developing';
        if (bandLower.includes('ready')) return 'maturity-ready';
        return 'maturity-adhoc';
    }

    renderTensionLine() {
        const tensionEl = document.getElementById('tension-line');
        tensionEl.textContent = sanitizeText(this.data.tension_line);
    }

    renderPlaybook() {
        const score = parseInt(this.data.readiness_score) || 0;
        const playbookDynamicLine = score <= 50
            ? "You'll likely focus on Transparency and Accountability first. "
            : "You'll likely focus on Capability and Trust next. ";
        
        const dynamicLineEl = document.getElementById('playbook-dynamic-line');
        if (dynamicLineEl) {
            dynamicLineEl.textContent = playbookDynamicLine;
        }
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
        
        // Key questions to display (based on scoring engine)
        const feedbackItems = [
            {
                title: 'Leadership & Ownership',
                playback: this.data.q1_answer_playback,
                interpretation: this.data.q1_interpretation_blurb,
                score: this.data.q1_score || 0
            },
            {
                title: 'Shadow AI Exposure',
                playback: this.data.q5_answer_playback,
                interpretation: this.data.q5_interpretation_blurb,
                score: this.data.q5_score || 0
            },
            {
                title: 'Governance & Risk Management',
                playback: this.data.q6_answer_playback,
                interpretation: this.data.q6_interpretation_blurb,
                score: this.data.q6_score || 0
            },
            {
                title: 'Data & IP Protection',
                playback: this.data.q9_answer_playback,
                interpretation: this.data.q9_interpretation_blurb,
                score: this.data.q9_score || 0
            },
            {
                title: 'Opportunity Mapping',
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
        
        // Add bridging sentence connecting gaps to playbook
        const bridgingSentence = document.getElementById('gaps-bridging-sentence');
        if (bridgingSentence && actualGaps.length > 0) {
            bridgingSentence.textContent = "These recommendations reflect the foundations of the AI Readiness Playbook (transparency, accountability, capability, and trust). Your discovery call focuses on how to apply them in your organisation.";
        }
    }

    renderScheduler() {
        // Build HubSpot scheduler URL with prefill and UTM params
        const baseUrl = 'https://meetings-ap1.hubspot.com/caleb-lucas1';
        const params = new URLSearchParams();

        // Prefill contact information
        if (this.data.contact_name) {
            params.append('firstName', this.data.contact_name.split(' ')[0] || '');
            params.append('lastName', this.data.contact_name.split(' ').slice(1).join(' ') || '');
        }
        if (this.data.email) {
            params.append('email', this.data.email);
        }
        if (this.data.company_name) {
            params.append('company', this.data.company_name);
        }

        // Add UTM parameters
        Object.entries(this.utmParams).forEach(([key, value]) => {
            params.append(key, value);
        });

        const schedulerUrl = `${baseUrl}?${params.toString()}`;

        // Update the HubSpot embed iframe with prefilled data
        const embedContainer = document.querySelector('.meetings-iframe-container');
        if (embedContainer) {
            embedContainer.setAttribute('data-src', `${baseUrl}?embed=true&${params.toString()}`);
        }

        // Update fallback link
        const linkEl = document.getElementById('scheduler-link');
        if (linkEl) {
            linkEl.href = schedulerUrl;
            
            // Add click tracking
            linkEl.addEventListener('click', () => {
                this.trackEvent('cta_clicked', {
                    submission_id: this.submissionId,
                    scheduler_url: schedulerUrl
                });
            });
        }

        this.trackEvent('booking_loaded', {
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

