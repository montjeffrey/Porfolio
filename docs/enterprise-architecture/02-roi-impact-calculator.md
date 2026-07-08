# Module 02 — Dynamic ROI Impact Calculator

Slider-driven analytical tool: prospect enters their operational bottlenecks, receives a concrete annual net-savings figure — which then travels with their contact submission as a structured `roi_snapshot`.

---

## 1. STRATEGIC POSITIONING & ROI ANALYSIS

The calculator converts the hardest sales problem — "what is this worth to *me*?" — into a self-service answer computed from the prospect's own numbers. Because the snapshot is attached to the lead row, every inbound message arrives pre-qualified with the prospect's self-declared savings potential, which directly feeds the lead-scoring decision layer (master doc §2.2). This is the single highest-leverage conversion asset on the site.

---

## 2. THE 4-LAYER APPLICATION BLUEPRINT

### State

**Input model (client, Zustand `useRoiStore`) — every field constrained at declaration:**

```json
{
  "$schema": "./roi-inputs.schema.json",
  "inputs": {
    "technicians":        { "type": "integer", "min": 1,   "max": 200,  "step": 1,    "default": 6 },
    "jobsPerTechPerDay":  { "type": "integer", "min": 1,   "max": 30,   "step": 1,    "default": 5 },
    "adminMinutesPerJob": { "type": "integer", "min": 2,   "max": 60,   "step": 1,    "default": 12 },
    "doubleEntryRate":    { "type": "number",  "min": 0,   "max": 1,    "step": 0.05, "default": 0.35 },
    "errorReworkRate":    { "type": "number",  "min": 0,   "max": 0.5,  "step": 0.01, "default": 0.06 },
    "loadedHourlyCost":   { "type": "number",  "min": 15,  "max": 150,  "step": 1,    "default": 42 },
    "workingDaysPerYear": { "type": "integer", "min": 200, "max": 260,  "step": 5,    "default": 250 }
  },
  "assumptions": {
    "automationCaptureRate": 0.80,
    "reworkMinutesMultiplier": 2.5,
    "implementationCost": { "type": "derived", "note": "engagement tier midpoint, shown transparently" }
  }
}
```

**Output model — the `roi_snapshot` persisted onto `leads.messages.roi_snapshot` (JSONB):**

```json
{
  "version": 1,
  "inputs": { "technicians": 6, "jobsPerTechPerDay": 5, "...": "..." },
  "outputs": {
    "adminHoursPerYear": 1500.0,
    "recoverableHoursPerYear": 1200.0,
    "grossAnnualSavings": 50400.0,
    "netAnnualSavings": 38400.0,
    "paybackMonths": 2.9
  },
  "computedAt": "server",
  "presetPipeline": "field-service-crm"
}
```

### Decision-Making

**Deterministic savings model (pure function, shared module `lib/roi/model.ts`, imported by both client preview and server verifier):**

```
adminHoursYr   = technicians × jobsPerTechPerDay × adminMinutesPerJob / 60 × workingDaysPerYear
doubleEntryHrs = adminHoursYr × doubleEntryRate
reworkHrs      = technicians × jobsPerTechPerDay × workingDaysPerYear
                 × errorReworkRate × (adminMinutesPerJob × reworkMinutesMultiplier) / 60
recoverableHrs = (doubleEntryHrs + reworkHrs) × automationCaptureRate
grossSavings   = recoverableHrs × loadedHourlyCost
netSavings     = grossSavings − implementationCost (amortized year 1)
paybackMonths  = implementationCost / (grossSavings / 12)
```

- **Client** runs the model on every slider change for instant preview (pure function, no I/O).
- **Server** (`POST /api/roi/report`) re-runs the *same* function from raw inputs and stores only server-computed outputs — client-submitted output values are discarded. One model, two call sites, zero drift, zero trust in client math.
- **Preset seeding:** `?pipeline=<graph-id>` (arriving from the Visualizer, doc 01) maps to an input preset table; unknown ids fall back to defaults silently.
- **Honesty guardrails:** if `netSavings < 0`, render the truthful state ("At this scale, automation may not pay for itself yet — here's the threshold") instead of clamping. This builds more trust than an always-green number.

### Rendering

- Bento composition (span 8 inputs / span 4 outputs on desktop; stacked mobile). Inputs panel is glass; output panel is the single highest-contrast surface on the page — the number is the hero.
- Output typography: netAnnualSavings in mono at display scale with animated count-up (Framer Motion spring, 400ms, disabled under reduced-motion); secondary metrics (hours reclaimed, payback months) as stat rows beneath.
- Each slider row: label + live value chip + range input; value chips in mono. A collapsible "Show the math" disclosure renders the formula with the user's numbers substituted — transparency as a premium signal.
- All surfaces/token-driven; re-skins under the Alignment Toggle.

### Controls

- Sliders: native `input[type=range]` (styled), full keyboard support inherited; `aria-valuetext` renders human units ("12 minutes per job").
- Debounce: model runs at slider-move rate (pure fn, cheap); telemetry `interact` event debounced 500ms; snapshot persisted only on explicit "Send me this analysis" CTA — never silently.
- CTA routes to `/contact` with the snapshot held in store; submit posts it inside the lead payload. No cookie, no fingerprinting — state dies with the tab unless the user sends it.
- Numeric hard limits enforced at control (min/max/step) and re-validated by zod on the server (reject, not clamp, out-of-range → 422).

---

## 3. CONVERSION-FOCUSED COPYWRITING

- **Eyebrow:** "ROI MODELING"
- **Headline:** "Your bottleneck, priced."
- **Sub:** "Move the sliders to match your operation. The math is shown, the assumptions are yours to change."
- **Output label:** "Projected net savings, year one"
- **CTA:** "Send me this analysis" → confirmation: "Your numbers travel with your message — I'll reply to *your* operation, not a template."

---

## 4. DEVELOPER EXECUTION ROADMAP

1. Implement `lib/roi/model.ts` (pure, unit-tested: default case, zero case, negative-net case, max-bounds case).
2. Author `roi-inputs.schema.json` + zod mirror (`lib/roi/schema.ts`) — single source for min/max/step consumed by both the slider components and the server validator.
3. Build `useRoiStore` (inputs, derived outputs via the model, preset loader).
4. Build `<RoiSliderRow>`, `<RoiOutputPanel>`, `<ShowTheMath>` components; token styling; reduced-motion path.
5. Implement `POST /api/roi/report` (zod validate → recompute → return canonical snapshot).
6. Wire snapshot handoff into contact form payload and `leads.messages.roi_snapshot`; extend lead-score function to weight snapshot magnitude.
7. Wire `?pipeline=` preset ingestion from the Visualizer.
8. Telemetry events + axe-core pass + unit tests green in CI.
