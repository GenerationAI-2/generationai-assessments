# Business AI Readiness Assessment - Testing & Validation Guide

## Test Scenarios

Test with three score scenarios to validate logic, layout, and copy alignment:

### Scenario 1: Score 35% (Low - Exposed Phase)
**Expected Behavior:**
- **Tension Line**: "You're adopting AI faster than you can govern it — and that's a board-level risk."
- **Phase Label**: "Exposed"
- **Maturity Band**: Likely "Unmanaged" or "Ad Hoc"
- **Priority Gaps**: Should identify 3 lowest-scoring areas

**Test Answers** (select mostly opt_0, opt_1, opt_2):
- Q1-Q10: Choose lowest scoring options (0-2 points each)
- Expected raw score: ~10-20/50 → 20-40/100

### Scenario 2: Score 55% (Medium - Ready to Execute Phase)
**Expected Behavior:**
- **Tension Line**: "You've got awareness, but without a clear roadmap, you'll stay stuck in pilot purgatory while competitors move ahead."
- **Phase Label**: "Ready to Execute"
- **Maturity Band**: Likely "Developing"
- **Priority Gaps**: Should identify 3 areas needing attention

**Test Answers** (mix of opt_2, opt_3, opt_4):
- Q1-Q10: Choose middle scoring options (2-4 points each)
- Expected raw score: ~25-30/50 → 50-60/100

### Scenario 3: Score 85% (High - Ready to Execute Phase)
**Expected Behavior:**
- **Tension Line**: "You've got awareness, but without a clear roadmap, you'll stay stuck in pilot purgatory while competitors move ahead."
- **Phase Label**: "Ready to Execute"
- **Maturity Band**: Likely "Ready"
- **Priority Gaps**: Should show areas for optimization

**Test Answers** (select mostly opt_4, opt_5):
- Q1-Q10: Choose highest scoring options (4-5 points each)
- Expected raw score: ~40-45/50 → 80-90/100

## Testing Checklist

### Backend Validation
- [ ] UUID is generated for each submission
- [ ] Full `scoringResult.data` is returned in API response
- [ ] Email subject format is: "Your Business AI Readiness Report — [Score]/100"
- [ ] Tension line is correctly calculated based on score threshold (≤40 vs >40)
- [ ] Phase label is correctly set ("Exposed" vs "Ready to Execute")
- [ ] PDF retry mechanism works (test by temporarily breaking PDF service)
- [ ] Email is sent without PDF if generation fails
- [ ] All user input is properly sanitized in email/PDF

### Frontend Validation
- [ ] UTM parameters are captured from URL on form load
- [ ] UTM parameters are stored in sessionStorage
- [ ] UTM parameters are included in form submission
- [ ] Form redirects to `/results.html?id=[UUID]` (not `/success.html`)
- [ ] Full results data is stored in sessionStorage with key `assessment_result_[UUID]`
- [ ] No PII appears in URL (only UUID)

### Results Page Validation
- [ ] Loading state shows initially
- [ ] Data is successfully loaded from sessionStorage
- [ ] Journey signposting displays: "You are here: Assess → Inform → Act"
- [ ] Score displays correctly (e.g., "35/100")
- [ ] Maturity badge shows correct class and text
- [ ] Tension line displays correct message based on score
- [ ] Roadmap visual shows all 5 steps correctly
- [ ] Detailed feedback shows 5 key questions (Q1, Q5, Q6, Q9, Q10)
- [ ] Priority gaps show top 3 areas (non-empty)
- [ ] HubSpot scheduler link includes prefill params (name, email, company)
- [ ] HubSpot scheduler link includes UTM parameters
- [ ] User email is displayed at bottom
- [ ] Error state shows if data not found
- [ ] All user-entered text is sanitized (no XSS vulnerability)

### PDF Validation
- [ ] PDF is generated successfully
- [ ] PDF sections appear in new order:
  1. Header
  2. Score section with tension line
  3. Roadmap (numbered list)
  4. Assessment breakdown (detailed feedback)
  5. Priority gaps
  6. CTA section with new copy
  7. Footer
- [ ] Tension line appears in PDF
- [ ] Roadmap shows 5 steps as numbered list
- [ ] CTA heading: "Next Step: Book Your 20-Minute Discovery Call"
- [ ] CTA bullets:
  - "Review your results together and answer any questions"
  - "Show you the roadmap that fits your business"
  - "Recommend your first move (whether you work with us or not)"
- [ ] CTA promise: "You'll walk away with a clear next action — whether you work with us or not."
- [ ] All user-entered text is sanitized in PDF

### Email Validation
- [ ] Email subject: "Your Business AI Readiness Report — 35/100" (example)
- [ ] Email is sent to correct address
- [ ] PDF is attached (if generation succeeded)
- [ ] If PDF failed, email indicates report is being generated
- [ ] Email body includes score and band information
- [ ] Team notification email is sent (if configured)

### Security Validation
- [ ] No PII in URL parameters (only UUID)
- [ ] User input is sanitized in results page (use textContent, not innerHTML)
- [ ] User input is sanitized in PDF
- [ ] CSP headers allow HubSpot embed
- [ ] X-Frame-Options updated to SAMEORIGIN (for HubSpot iframe)
- [ ] sessionStorage is used (not localStorage) for temporary data

### Analytics Validation (Console Logs)
- [ ] `report_viewed` event logged on results page load
- [ ] `cta_clicked` event logged when booking link clicked
- [ ] `booking_loaded` event logged when scheduler initialized
- [ ] All events include submission_id

### Mobile Responsiveness
- [ ] Results page renders correctly on mobile (320px width)
- [ ] Score display is readable on mobile
- [ ] Roadmap steps stack properly on mobile
- [ ] Scheduler embed/link works on mobile
- [ ] PDF renders correctly when viewed on mobile

### Backward Compatibility
- [ ] `/success.html` still exists and works (for old links/bookmarks)
- [ ] Old submission flow still works (if not updated)

## Manual Test Steps

### Test 1: Low Score (35%)
1. Open form: `http://localhost:3000/?utm_source=test&utm_medium=manual&utm_campaign=qa`
2. Fill in contact info:
   - Email: test+low@example.com
   - Name: Low Score Tester
   - Company: Test Company Low
3. Select lowest options for all 10 questions (opt_0, opt_1, opt_2)
4. Submit form
5. **Validate:**
   - Redirects to `/results.html?id=[UUID]`
   - Results page loads with score ~35/100
   - Tension line: "You're adopting AI faster than you can govern it..."
   - Maturity badge shows appropriate band
   - All sections render correctly
   - Scheduler link includes UTM params
   - Check email for PDF with correct subject
   - Review PDF content order and formatting

### Test 2: Medium Score (55%)
1. Open form: `http://localhost:3000/?utm_source=test&utm_medium=manual&utm_campaign=qa`
2. Fill in contact info:
   - Email: test+medium@example.com
   - Name: Medium Score Tester
   - Company: Test Company Medium
3. Select middle options for all 10 questions (opt_2, opt_3, opt_4)
4. Submit form
5. **Validate:**
   - Redirects to `/results.html?id=[UUID]`
   - Results page loads with score ~55/100
   - Tension line: "You've got awareness, but without a clear roadmap..."
   - Maturity badge shows appropriate band
   - All sections render correctly
   - Check email for PDF

### Test 3: High Score (85%)
1. Open form: `http://localhost:3000/?utm_source=test&utm_medium=manual&utm_campaign=qa`
2. Fill in contact info:
   - Email: test+high@example.com
   - Name: High Score Tester
   - Company: Test Company High
3. Select highest options for all 10 questions (opt_4, opt_5)
4. Submit form
5. **Validate:**
   - Redirects to `/results.html?id=[UUID]`
   - Results page loads with score ~85/100
   - Tension line: "You've got awareness, but without a clear roadmap..."
   - Maturity badge shows "Ready" or similar
   - All sections render correctly
   - Check email for PDF

### Test 4: PDF Generation Failure
1. Temporarily stop/break PDF service
2. Submit assessment
3. **Validate:**
   - Results page still loads correctly
   - Email is sent without PDF attachment
   - Email mentions PDF is being generated
   - API response includes `pdf_generated: false`

### Test 5: XSS Prevention
1. Submit assessment with malicious input:
   - Name: `<script>alert('xss')</script>`
   - Company: `<img src=x onerror=alert(1)>`
2. **Validate:**
   - Results page renders text safely (no alert)
   - PDF renders text safely (no script execution)
   - Email renders text safely

### Test 6: Missing Data Handling
1. Open results URL with invalid ID: `/results.html?id=invalid-uuid`
2. **Validate:**
   - Error state is shown
   - Message suggests taking assessment again
   - Link to email is shown

## Deployment Checklist

Before deploying to production:
- [ ] Update API URL in form-handler.js (already has conditional logic)
- [ ] Set `PDF_SERVICE_URL` environment variable
- [ ] Set `PDF_SERVICE_KEY` environment variable
- [ ] Set `NOTIFICATION_EMAIL` environment variable (optional)
- [ ] Verify HubSpot scheduler URL is correct
- [ ] Test all three scenarios in staging environment
- [ ] Verify email delivery in production (test with real email)
- [ ] Monitor PDF generation success rate
- [ ] Check analytics events are firing (once integrated)

## Known Limitations

1. **Scheduler Embed**: Currently using link fallback. If HubSpot provides iframe embed code, update `results-handler.js` line ~260.
2. **Analytics**: Using console.log placeholders. Replace with actual analytics service (GA4, Mixpanel, etc.).
3. **PDF Retry**: Retries up to 3 times with exponential backoff. If all fail, user still gets results page and email without PDF.
4. **sessionStorage**: Data persists only within same browser session. If user closes browser and returns via email link, they won't see results page (but they have PDF).

## Success Criteria

✅ All three test scenarios pass validation
✅ Results page renders correctly for all score ranges
✅ Tension line changes appropriately at score 40 threshold
✅ PDF matches results page content and order
✅ Email subject includes score
✅ UTM parameters flow through entire journey
✅ No XSS vulnerabilities
✅ Graceful degradation when PDF fails
✅ Mobile responsive
✅ HubSpot scheduler integration works

## Notes for Future Enhancements

1. Consider server-side storage for results (e.g., Azure Table Storage) to enable sharing links
2. Add actual analytics integration (GA4 recommended)
3. Implement HubSpot iframe embed for scheduler (if supported)
4. Consider A/B testing different tension line copy
5. Add option to download PDF from results page
6. Implement results page caching/regeneration if sessionStorage is cleared

