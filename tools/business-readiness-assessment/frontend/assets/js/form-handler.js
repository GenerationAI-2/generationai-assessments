/**
 * Business Readiness Assessment - Form Handler
 * Handles form validation, submission, and progress tracking
 */

class AssessmentForm {
    constructor() {
        this.form = document.getElementById('assessment-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.progressBar = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.totalQuestions = 13; // 3 text + 10 radio questions

        this.init();
    }

    init() {
        // Track form changes for progress
        this.form.addEventListener('change', () => this.updateProgress());

        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Initial progress check
        this.updateProgress();
    }

    updateProgress() {
        const answeredQuestions = this.countAnsweredQuestions();
        const percentage = (answeredQuestions / this.totalQuestions) * 100;

        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${answeredQuestions} of ${this.totalQuestions} questions completed`;

        // Enable submit button when all required questions are answered
        const allRequired = this.validateAllRequired();
        this.submitBtn.disabled = !allRequired;
    }

    countAnsweredQuestions() {
        let count = 0;

        // Text inputs
        const textInputs = ['email', 'contact_name', 'company_name'];
        textInputs.forEach(name => {
            const input = this.form.elements[name];
            if (input && input.value.trim()) count++;
        });

        // Radio button groups
        const radioGroups = [
            'q1_ownership', 'q2_strategy', 'q3_culture', 'q4_enablement',
            'q5_shadow_ai', 'q6_governance', 'q7_compliance', 'q8_resources',
            'q9_data_protection', 'q10_opportunity'
        ];

        radioGroups.forEach(name => {
            const selected = this.form.querySelector(`input[name="${name}"]:checked`);
            if (selected) count++;
        });

        return count;
    }

    validateAllRequired() {
        // Check all required fields are filled
        const requiredFields = [
            'email', 'contact_name', 'company_name',
            'q1_ownership', 'q2_strategy', 'q3_culture', 'q4_enablement',
            'q5_shadow_ai', 'q6_governance', 'q7_compliance', 'q8_resources',
            'q9_data_protection', 'q10_opportunity'
        ];

        for (const fieldName of requiredFields) {
            const field = this.form.elements[fieldName];
            if (!field) continue;

            if (field.type === 'radio') {
                const checked = this.form.querySelector(`input[name="${fieldName}"]:checked`);
                if (!checked) return false;
            } else {
                if (!field.value.trim()) return false;
            }
        }

        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(fieldName, message) {
        const field = this.form.elements[fieldName];
        if (!field) return;

        field.classList.add('form__input--error');

        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('form__error--visible');
        }
    }

    clearError(fieldName) {
        const field = this.form.elements[fieldName];
        if (!field) return;

        field.classList.remove('form__input--error');

        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl) {
            errorEl.classList.remove('form__error--visible');
        }
    }

    clearAllErrors() {
        const errorEls = this.form.querySelectorAll('.form__error--visible');
        errorEls.forEach(el => el.classList.remove('form__error--visible'));

        const errorInputs = this.form.querySelectorAll('.form__input--error');
        errorInputs.forEach(el => el.classList.remove('form__input--error'));
    }

    collectFormData() {
        const formData = {
            email: this.form.elements['email'].value.trim(),
            contact_name: this.form.elements['contact_name'].value.trim(),
            company_name: this.form.elements['company_name'].value.trim(),
            q1_ownership: this.getRadioValue('q1_ownership'),
            q2_strategy: this.getRadioValue('q2_strategy'),
            q3_culture: this.getRadioValue('q3_culture'),
            q4_enablement: this.getRadioValue('q4_enablement'),
            q5_shadow_ai: this.getRadioValue('q5_shadow_ai'),
            q6_governance: this.getRadioValue('q6_governance'),
            q7_compliance: this.getRadioValue('q7_compliance'),
            q8_resources: this.getRadioValue('q8_resources'),
            q9_data_protection: this.getRadioValue('q9_data_protection'),
            q10_opportunity: this.getRadioValue('q10_opportunity')
        };

        return formData;
    }

    getRadioValue(name) {
        const selected = this.form.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.clearAllErrors();

        // Validate email
        const email = this.form.elements['email'].value.trim();
        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            return;
        }

        // Collect form data
        const formData = this.collectFormData();

        // Show loading state
        this.showLoading();

        try {
            // Call Azure Function API
            const response = await fetch('https://generationai-business-readiness.azurewebsites.net/api/processAssessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            const result = await response.json();

            // Redirect to success page
            window.location.href = '/success.html?score=' + (result.score || '');

        } catch (error) {
            console.error('Submission error:', error);
            this.hideLoading();
            this.showSubmissionError();
        }
    }

    showLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Processing...';

        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.classList.add('loading--visible');
        }

        // Scroll to top to show loading
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    hideLoading() {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Get My Readiness Report';

        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.classList.remove('loading--visible');
        }
    }

    showSubmissionError() {
        const alertHtml = `
            <div class="alert alert--error" id="submission-error">
                <strong>Submission Failed</strong>
                <p>We couldn't process your assessment. Please try again or contact support@generationai.co.nz</p>
            </div>
        `;

        const container = document.querySelector('.container');
        container.insertAdjacentHTML('afterbegin', alertHtml);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            const errorEl = document.getElementById('submission-error');
            if (errorEl) errorEl.remove();
        }, 10000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AssessmentForm();
});
