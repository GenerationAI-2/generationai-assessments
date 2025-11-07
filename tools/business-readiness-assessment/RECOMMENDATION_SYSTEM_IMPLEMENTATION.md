# Recommendation System Implementation
## Turning Gaps Into Actionable Insights

**Date:** January 2025  
**Status:** ✅ COMPLETED

---

## 🎯 Problem Statement

The assessment was identifying gaps but not providing actionable recommendations:

**Before:**
> "Your top 3 priority areas are: Shadow AI exposure, No executive ownership, AI absent from strategy."

**Issue:** This is diagnostic, not prescriptive. It tells users what's wrong but not what to do about it.

**Result:** The report felt like a scolding, not a strategy session starter.

---

## 💡 Solution: Micro-Recommendations with Pillar Attribution

We added a **prescriptive recommendation** to each gap that:
1. Explicitly names which playbook pillar it addresses (Transparency, Accountability, Capability, Trust)
2. Provides a clear, actionable next step
3. Uses directive language ("Start with...", "Strengthen...", "Build...")
4. Bridges the gap between problem and solution

**After:**
> **1. Shadow AI exposure**
> 
> *Problem:* Unmanaged AI use means data exposure, compliance risk, and loss of control.
> 
> *Recommendation:* You can't govern what you can't see. Start with **transparency** — run a quick Shadow AI discovery and open the conversation with your team.

---

## 📋 Implementation Details

### 1. Data Model Updates

**File:** `scoring-config.ts`

Updated the `GapDescription` interface to include recommendations:

```typescript
export interface GapDescription {
  title: string;
  description: string;
  recommendation: string;  // NEW
}
```

Added recommendations for all 10 gaps, each explicitly referencing one of the 4 pillars.

---

### 2. Scoring Engine Updates

**File:** `scoring-engine.ts`

Updated the `ScoringResult` interface and `identifyTopGaps` method:

```typescript
// Interface now includes recommendations
gap_1_recommendation: string;
gap_2_recommendation: string;
gap_3_recommendation: string;

// Method now returns recommendations
private static identifyTopGaps(questionScores: Record<string, number>): 
  Array<{title: string, description: string, recommendation: string}>
```

---

### 3. Frontend Rendering

**File:** `results-handler.js`

Updated `renderPriorityGaps()` to include recommendations:

```javascript
const gaps = [
  { 
    title: this.data.gap_1_title, 
    description: this.data.gap_1_description,
    recommendation: this.data.gap_1_recommendation  // NEW
  },
  // ... similar for gap 2 and 3
];

// Render with recommendation
html += `
  <div class="gap-item">
    <h3>${index + 1}. ${sanitizeHTML(gap.title)}</h3>
    <p class="gap-description">${sanitizeHTML(gap.description)}</p>
    ${gap.recommendation ? 
      `<p class="gap-recommendation">${sanitizeHTML(gap.recommendation)}</p>` 
      : ''}
  </div>
`;
```

---

### 4. Styling

**File:** `results.html`

Added CSS to visually distinguish recommendations from problems:

```css
.gap-description {
  color: var(--text-body);
  margin-bottom: var(--space-md);
}

.gap-recommendation {
  font-weight: 600;
  color: var(--primary-blue);
  margin-top: var(--space-sm);
  padding: var(--space-md);
  padding-left: var(--space-md);
  border-left: 3px solid var(--primary-blue);
  font-style: italic;
  background: #EFF6FF;
  border-radius: var(--radius-md);
}
```

**Visual Design:**
- Gray text = problem (description)
- Blue box with left border = solution (recommendation)
- Italic styling emphasizes advisory tone

---

### 5. PDF Template Updates

**File:** `pdf-template.ts`

Mirrored the frontend recommendations in the PDF output with inline styles for consistent rendering.

---

### 6. Bridging Sentence

Added a closing statement that connects the recommendations back to the playbook:

> "These recommendations reflect the foundations of the AI Readiness Playbook — transparency, accountability, capability, and trust. Your discovery call focuses on how to apply them in your organisation."

**Purpose:**
- Reinforces the 4-pillar framework
- Positions the discovery call as the implementation step
- Creates a narrative bridge from gaps → playbook → call

---

## 📝 Complete Recommendation Copy

| Gap | Recommendation |
|-----|----------------|
| **No executive ownership** | Strengthen **accountability** — assign a clear AI owner at leadership level to drive strategy and governance. |
| **AI absent from strategy** | Bring AI into strategic planning. Make leadership responsible for aligning it with business priorities — **accountability** and **transparency** working together. |
| **Cultural resistance** | Build **trust** — start conversations about what AI means for your team, address concerns openly, and involve people in shaping safe use. |
| **No staff training** | Build **capability** — upskill your people so they can use approved tools safely and effectively. |
| **Shadow AI exposure** | You can't govern what you can't see. Start with **transparency** — run a quick Shadow AI discovery and open the conversation with your team. |
| **No governance framework** | Set the foundations for **trust** — create basic guardrails and policies that make safe, ethical use easy. |
| **Legal compliance uncertainty** | Strengthen **accountability** — get legal and leadership aligned on compliance obligations and document your approach. |
| **No resources allocated** | Show **accountability** and intent — allocate time, budget, and people to manage AI adoption deliberately. |
| **Data exposure risk** | Protect **trust** — implement basic controls to prevent sensitive data from being shared with AI tools invisibly. |
| **Opportunities not identified** | Start with **transparency** — map where AI could add value across operations, customer experience, and decision making. |

---

## 🎨 Visual Hierarchy

```
Gap Title (H3, dark text)
  ↓
Problem Description (gray, regular weight)
  ↓
Recommendation (blue box, bold, italic)
  ↓
[Next gap repeats...]
  ↓
Summary Blurb (italic, context for maturity band)
  ↓
Bridging Sentence (bold, centered, ties to playbook)
```

---

## ✅ Impact

### **User Experience**
- **Before:** "You have problems." (Feels like a scolding)
- **After:** "Here's what to do about them." (Feels like consulting advice)

### **Conversion**
- Recommendations naturally lead to the discovery call CTA
- Each recommendation is deliberately high-level to create "how do I do that?" curiosity
- Bridging sentence explicitly positions the call as the implementation step

### **Brand Positioning**
- Demonstrates expertise and advisory mindset
- Ties tactical recommendations to strategic framework (4 pillars)
- Shows thought leadership, not just data reporting

---

## 📊 Example Output

**Low Score (35/100):**

### Your Top 3 Priority Areas

**1. Shadow AI exposure**

Unmanaged AI use means data exposure, compliance risk, and loss of control.

> You can't govern what you can't see. Start with **transparency** — run a quick Shadow AI discovery and open the conversation with your team.

**2. No executive ownership of AI**

Without clear leadership accountability, AI adoption will remain fragmented and ineffective.

> Strengthen **accountability** — assign a clear AI owner at leadership level to drive strategy and governance.

**3. No staff training or enablement**

Untrained staff create risk through well-intentioned mistakes and missed opportunities.

> Build **capability** — upskill your people so they can use approved tools safely and effectively.

---

*These gaps represent immediate risks that compound daily. Start with Shadow AI discovery and basic governance.*

**These recommendations reflect the foundations of the AI Readiness Playbook — transparency, accountability, capability, and trust. Your discovery call focuses on how to apply them in your organisation.**

---

## 🔧 Technical Notes

- **Zero logic changes:** All recommendations are static lookup text
- **Backward compatible:** Old assessments without recommendations will render gracefully (empty string)
- **Maintainable:** All copy lives in `scoring-config.ts` for easy iteration
- **Consistent:** Same recommendations appear in web report and PDF

---

## 🚀 Next Steps

1. **Monitor user engagement:** Track which recommendations resonate most
2. **A/B test copy:** Try different pillar attributions or action verbs
3. **Add conditional logic:** Consider score-based recommendation variants
4. **Expand to other assessments:** Roll out similar pattern to Shadow AI, Personal Readiness, Board Governance

---

## 📁 Files Modified

1. `tools/business-readiness-assessment/api/shared/scoring-config.ts` - Added recommendations to all gaps
2. `tools/business-readiness-assessment/api/shared/scoring-engine.ts` - Updated interface and method to pass recommendations
3. `tools/business-readiness-assessment/frontend/results.html` - Added CSS styling and bridging sentence element
4. `tools/business-readiness-assessment/frontend/assets/js/results-handler.js` - Updated rendering logic
5. `services/pdf-generator/shared/pdf-template.ts` - Added recommendations to PDF output

---

**Status:** Ready for deployment

**Definition of Done:** ✅
- [x] Recommendations added to all 10 gaps
- [x] Each recommendation explicitly references a playbook pillar
- [x] Recommendations render on web results page
- [x] Recommendations render in PDF report
- [x] Styling distinguishes recommendations from problems
- [x] Bridging sentence connects recommendations to playbook
- [x] Services compile without errors
- [x] No breaking changes to existing assessments

