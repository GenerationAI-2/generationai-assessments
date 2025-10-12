/**
 * Personal AI Readiness Assessment - Form Handler
 * Handles form validation, submission, and progress tracking
 */

class AssessmentForm {
    constructor() {
        this.form = document.getElementById('assessment-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.progressBar = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.totalQuestions = 15; // 3 text + 12 readiness radio questions

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

        // Radio button groups (12 readiness questions)
        const radioGroups = [
            'q1_frequency', 'q2_approach', 'q3_repetitive_task', 'q4_explain',
            'q5_lead', 'q6_time_savings', 'q7_use_cases', 'q8_stay_informed',
            'q9_learning_preference', 'q10_motivation', 'q11_next_90_days', 'q12_safety'
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
            'q1_frequency', 'q2_approach', 'q3_repetitive_task', 'q4_explain',
            'q5_lead', 'q6_time_savings', 'q7_use_cases', 'q8_stay_informed',
            'q9_learning_preference', 'q10_motivation', 'q11_next_90_days', 'q12_safety'
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
            opt_in_marketing: this.form.elements['opt_in_marketing']?.checked || false,
            q1_frequency: this.getRadioValue('q1_frequency'),
            q2_approach: this.getRadioValue('q2_approach'),
            q3_repetitive_task: this.getRadioValue('q3_repetitive_task'),
            q4_explain: this.getRadioValue('q4_explain'),
            q5_lead: this.getRadioValue('q5_lead'),
            q6_time_savings: this.getRadioValue('q6_time_savings'),
            q7_use_cases: this.getRadioValue('q7_use_cases'),
            q8_stay_informed: this.getRadioValue('q8_stay_informed'),
            q9_learning_preference: this.getRadioValue('q9_learning_preference'),
            q10_motivation: this.getRadioValue('q10_motivation'),
            q11_next_90_days: this.getRadioValue('q11_next_90_days'),
            q12_safety: this.getRadioValue('q12_safety')
        };

        return formData;
    }

    getRadioValue(name) {
        const selected = this.form.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
    }

    getCheckboxValues(name) {
        const checked = this.form.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checked).map(cb => cb.value);
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
            // For local development: http://localhost:7071/api/processassessment
            // For production: https://generationai-personal-ai-readiness.azurewebsites.net/api/processassessment
            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:7071/api/processassessment'
                : 'https://generationai-personal-ai-readiness.azurewebsites.net/api/processassessment';

            const response = await fetch(apiUrl, {
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
            window.location.href = '/success.html?score=' + (result.readiness_score || '');

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
        this.submitBtn.textContent = 'Get My Governance Report';

        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.classList.remove('loading--visible');
        }
    }

    showSubmissionError() {
        const alertHtml = `
            <div class="alert alert--error" id="submission-error">
                <strong>Submission Failed</strong>
                <p>We couldn't process your assessment. Please try again or contact team@generationai.co.nz</p>
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