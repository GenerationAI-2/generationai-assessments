# ROI Calculator Test Scenarios

## Test Scenario 1 – Small Business
**Inputs:**
- People: 2
- Time %: 50%
- Salary: $60,000
- Savings %: 20%
- AI Monthly Cost: $500

**Expected Results:**
- Current Annual Cost: $60,000 (2 × 0.5 × $60,000)
- Annual AI Cost: $6,000 ($500 × 12)
- Annual Savings: $12,000 ($60,000 × 0.2)
- Net Benefit Year 1: $6,000 ($12,000 - $6,000)
- Payback: 6 months ($6,000 / ($12,000/12))
- ROI Multiple: 1.0× ($6,000 / $6,000)

## Test Scenario 2 – Mid-Market
**Inputs:**
- People: 10
- Time %: 30%
- Salary: $80,000
- Savings %: 25%
- AI Monthly Cost: $2,000

**Expected Results:**
- Current Annual Cost: $240,000 (10 × 0.3 × $80,000)
- Annual AI Cost: $24,000 ($2,000 × 12)
- Annual Savings: $60,000 ($240,000 × 0.25)
- Net Benefit Year 1: $36,000 ($60,000 - $24,000)
- Payback: 5 months ($24,000 / ($60,000/12))
- ROI Multiple: 1.5× ($36,000 / $24,000)

## Test Scenario 3 – No ROI Case
**Inputs:**
- People: 1
- Time %: 10%
- Salary: $50,000
- Savings %: 10%
- AI Monthly Cost: $2,000

**Expected Results:**
- Current Annual Cost: $5,000 (1 × 0.1 × $50,000)
- Annual AI Cost: $24,000 ($2,000 × 12)
- Annual Savings: $500 ($5,000 × 0.1)
- Net Benefit Year 1: -$23,500 ($500 - $24,000)
- Payback: "No positive ROI with current inputs"
- ROI Multiple: "No ROI"

## Display Logic Tests

### ROI Multiple Display
- If > 10 → "10×+"
- If < 0 → "No ROI"
- Else → "[value]×" (1 decimal place)

### Payback Display
- If net_benefit < 0 → "No positive ROI with current inputs"
- If ≤ 3 months → "[X] months - Excellent ROI!"
- If ≤ 12 months → "[X] months - Strong ROI"
- If ≤ 36 months → "[X] months"
- If > 36 months → "3+ years"

## Currency Formatting
All dollar values should:
- Be rounded to nearest dollar
- Display with comma separators
- Include $ prefix
- Example: $123,456 not $123456.00
