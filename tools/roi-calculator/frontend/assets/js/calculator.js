/**
 * ROI Calculator
 * Client-side calculation logic for AI ROI assessment
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roi-form');
    const calculatorSection = document.getElementById('calculator-section');
    const resultsSection = document.getElementById('results-section');
    const calculateAgainBtn = document.getElementById('calculate-again-btn');

    // Slider value display updates
    const timePercentSlider = document.getElementById('time_percent');
    const timePercentValue = document.getElementById('time_percent_value');
    const savingsPercentSlider = document.getElementById('savings_percent');
    const savingsPercentValue = document.getElementById('savings_percent_value');

    // Update slider displays
    timePercentSlider.addEventListener('input', function() {
        timePercentValue.textContent = this.value;
    });

    savingsPercentSlider.addEventListener('input', function() {
        savingsPercentValue.textContent = this.value;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateROI();
    });

    // Calculate Again button
    calculateAgainBtn.addEventListener('click', function() {
        resultsSection.style.display = 'none';
        calculatorSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function calculateROI() {
        // Get form values
        const people = parseInt(document.getElementById('people').value);
        const timePercent = parseInt(document.getElementById('time_percent').value);
        const salary = parseInt(document.getElementById('salary').value);
        const savingsPercent = parseInt(document.getElementById('savings_percent').value);
        const aiMonthly = parseInt(document.getElementById('ai_monthly').value);

        // Validate inputs
        if (!people || !salary || !aiMonthly) {
            alert('Please fill in all required fields');
            return;
        }

        // Calculations (matching the spec exactly)
        const annualManualCost = people * (timePercent / 100) * salary;
        const annualSavings = annualManualCost * (savingsPercent / 100);
        const annualAiCost = aiMonthly * 12;
        const netBenefit = annualSavings - annualAiCost;
        const paybackMonths = annualAiCost / (annualSavings / 12);
        const roiMultiple = netBenefit / annualAiCost;

        // Display results
        displayResults({
            annualManualCost,
            annualSavings,
            annualAiCost,
            netBenefit,
            paybackMonths,
            roiMultiple
        });

        // Hide form, show results
        calculatorSection.style.display = 'none';
        resultsSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function displayResults(results) {
        // Format currency values
        document.getElementById('result_annual_manual_cost').textContent = formatCurrency(results.annualManualCost);
        document.getElementById('result_annual_ai_cost').textContent = formatCurrency(results.annualAiCost);
        document.getElementById('result_annual_savings').textContent = formatCurrency(results.annualSavings);
        document.getElementById('result_net_benefit').textContent = formatCurrency(results.netBenefit);

        // Format ROI Multiple (with logic)
        document.getElementById('result_roi_multiple').textContent = formatROIMultiple(results.roiMultiple);

        // Format Payback Period (with logic)
        document.getElementById('result_payback').textContent = formatPayback(results.paybackMonths, results.netBenefit);
    }

    function formatCurrency(value) {
        // Round to nearest dollar
        const rounded = Math.round(value);

        // Format with commas and dollar sign
        return '$' + rounded.toLocaleString('en-NZ');
    }

    function formatROIMultiple(roiMultiple) {
        // Logic from spec:
        // IF @roi_multiple > 10 → Show "10×+"
        // ELSE IF @roi_multiple < 0 → Show "No ROI"
        // ELSE → Show "[round(@roi_multiple,1)]×"

        if (roiMultiple > 10) {
            return '10×+';
        } else if (roiMultiple < 0) {
            return 'No ROI';
        } else {
            return roiMultiple.toFixed(1) + '×';
        }
    }

    function formatPayback(paybackMonths, netBenefit) {
        // Logic from spec:
        // IF @net_benefit < 0 → Show "No positive ROI with current inputs"
        // ELSE IF @payback_months <= 3 → Show "[round(@payback_months)] months - Excellent ROI!"
        // ELSE IF @payback_months <= 12 → Show "[round(@payback_months)] months - Strong ROI"
        // ELSE IF @payback_months <= 36 → Show "[round(@payback_months)] months"
        // ELSE → Show "3+ years"

        if (netBenefit < 0) {
            return 'No positive ROI with current inputs';
        } else if (paybackMonths <= 3) {
            return Math.round(paybackMonths) + ' months - Excellent ROI!';
        } else if (paybackMonths <= 12) {
            return Math.round(paybackMonths) + ' months - Strong ROI';
        } else if (paybackMonths <= 36) {
            return Math.round(paybackMonths) + ' months';
        } else {
            return '3+ years';
        }
    }
});
