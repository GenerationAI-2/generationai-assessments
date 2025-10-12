/**
 * Shadow AI Assessment - Form Handler
 * Handles form validation, submission, and progress tracking
 */

class AssessmentForm {
    constructor() {
        this.form = document.getElementById('assessment-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.progressBar = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.totalQuestions = 16; // 3 text + 12 radio + 1 checkbox group

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
            'org_size', 'sector', 'access', 'incidents', 'approval',
            'usage_visibility', 'detection', 'policy', 'training',
            'exposure', 'traceability', 'compliance_awareness'
        ];

        radioGroups.forEach(name => {
            const selected = this.form.querySelector(`input[name="${name}"]:checked`);
            if (selected) count++;
        });

        // Checkbox group (risk_concerns) - count if at least one checked
        const riskCheckboxes = this.form.querySelectorAll('input[name="risk_concerns"]:checked');
        if (riskCheckboxes.length > 0) count++;

        return count;
    }

    validateAllRequired() {
        // Check all required fields are filled
        const requiredFields = [
            'email', 'contact_name', 'company_name',
            'org_size', 'sector', 'access', 'incidents', 'approval',
            'usage_visibility', 'detection', 'policy', 'training',
            'exposure', 'traceability', 'compliance_awareness'
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

        // Check at least one risk concern is selected
        const riskCheckboxes = this.form.querySelectorAll('input[name="risk_concerns"]:checked');
        if (riskCheckboxes.length === 0) return false;

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
            org_size: this.getRadioValue('org_size'),
            sector: this.getRadioValue('sector'),
            access: this.getRadioValue('access'),
            incidents: this.getRadioValue('incidents'),
            approval: this.getRadioValue('approval'),
            usage_visibility: this.getRadioValue('usage_visibility'),
            detection: this.getRadioValue('detection'),
            policy: this.getRadioValue('policy'),
            training: this.getRadioValue('training'),
            exposure: this.getRadioValue('exposure'),
            traceability: this.getRadioValue('traceability'),
            compliance_awareness: this.getRadioValue('compliance_awareness'),
            risk_concerns: this.getCheckboxValues('risk_concerns')
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
            const response = await fetch('https://generationai-shadow-ai.azurewebsites.net/api/processassessment', {
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
        this.submitBtn.textContent = 'Get My Risk Report';

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