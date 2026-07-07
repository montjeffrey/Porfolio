# Execution Task Manifest — Small-Model-Ready Work Orders

Each task below is atomic, self-contained, and written to be executed by a junior engineer or small coding model **without reading the other blueprint docs**. Every task states: files touched, exact steps, and a mechanically verifiable done-check. Execute in ID order unless `Depends on` says otherwise. Never start a task whose dependency is unmerged.

**Ground rules for the executor (read once, apply to every task):**
- Work only in the files listed. Do not refactor neighboring code.
- Match existing code style (TypeScript, functional React components, Tailwind classes).
- After every task run `npm run build` — it must exit 0 before the task is done.
- Commit each task separately with message `[T<ID>] <task title>`.

---

## PHASE 0 — Foundations

### T01 — Install runtime dependencies
- **Files:** `package.json`, `package-lock.json`
- **Steps:** Run `npm install zustand zod @supabase/supabase-js` and `npm install -D vitest`.
- **Done when:** all three appear in `package.json` dependencies (vitest in devDependencies) and `npm run build` passes.

### T02 — Add test script and vitest config
- **Depends on:** T01
- **Files:** `package.json`, `vitest.config.ts` (new)
- **Steps:**
  1. Add `"test": "vitest run"` to `scripts` in `package.json`.
  2. Create `vitest.config.ts` containing a default export of `defineConfig({ test: { include: ["lib/**/*.test.ts"] } })` imported from `vitest/config`.
- **Done when:** `npm test` exits 0 reporting "no test files found" is acceptable at this stage OR passes trivially.

### T03 — Create alignment token definitions JSON
- **Files:** `lib/alignment/alignments.json` (new)
- **Steps:** Create the file with exactly this content (verbatim — do not invent values):
```json
{
  "default": "ember",
  "alignments": {
    "ember": {
      "label": "Ember",
      "voice": "operator",
      "tokens": {
        "--surface-0": "#0D0D0D", "--surface-1": "#1A1A1A",
        "--glass-fill": "rgba(255,255,255,0.05)", "--stroke-glass": "rgba(255,255,255,0.10)",
        "--text-primary": "#F0EDE4", "--text-muted": "rgba(240,237,228,0.62)",
        "--accent-primary": "#E77D22", "--accent-info": "#5AA9E6",
        "--accent-data": "#B08BEA", "--accent-success": "#4CC38A",
        "--radius-panel": "16px", "--blur-glass": "14px"
      }
    },
    "meridian": {
      "label": "Meridian",
      "voice": "boardroom",
      "tokens": {
        "--surface-0": "#0A0E14", "--surface-1": "#111826",
        "--glass-fill": "rgba(148,180,255,0.06)", "--stroke-glass": "rgba(148,180,255,0.14)",
        "--text-primary": "#E8EDF7", "--text-muted": "rgba(232,237,247,0.60)",
        "--accent-primary": "#4C8DFF", "--accent-info": "#39C6D8",
        "--accent-data": "#8FA5FF", "--accent-success": "#3EC98F",
        "--radius-panel": "12px", "--blur-glass": "18px"
      }
    },
    "atelier": {
      "label": "Atelier",
      "voice": "studio",
      "tokens": {
        "--surface-0": "#101010", "--surface-1": "#181614",
        "--glass-fill": "rgba(240,237,228,0.05)", "--stroke-glass": "rgba(240,237,228,0.12)",
        "--text-primary": "#F5F1E8", "--text-muted": "rgba(245,241,232,0.58)",
        "--accent-primary": "#D9A441", "--accent-info": "#7FB6A4",
        "--accent-data": "#C58BC9", "--accent-success": "#8CBF6E",
        "--radius-panel": "20px", "--blur-glass": "12px"
      }
    }
  }
}
```
- **Done when:** file parses with `node -e "JSON.parse(require('fs').readFileSync('lib/alignment/alignments.json','utf8'))"`.

### T04 — Emit token CSS blocks into globals.css
- **Depends on:** T03
- **Files:** `app/globals.css`
- **Steps:**
  1. At the TOP of `app/globals.css` (before any existing rules), add one CSS block per alignment: `:root[data-alignment="ember"] { <every token as a CSS custom property> }`, same for `meridian` and `atelier`, values copied exactly from `lib/alignment/alignments.json`.
  2. Add a fallback block `:root { ... }` duplicating the **ember** tokens (covers missing attribute).
- **Done when:** `npm run build` passes and the four blocks exist in the file.

### T05 — Migrate Tailwind config to token references
- **Depends on:** T04
- **Files:** `tailwind.config.ts`
- **Steps:** In `theme.extend.colors`, replace:
  - `primary: "#E77D22"` → `primary: "var(--accent-primary)"`
  - `secondary: "#F0EDE4"` → `secondary: "var(--text-primary)"`
  - `"bg-dark": "#0D0D0D"` → `"bg-dark": "var(--surface-0)"`
  - `"bg-elevated": "#1A1A1A"` → `"bg-elevated": "var(--surface-1)"`
  Keep everything else untouched.
- **Done when:** `npm run build` passes; `npm run dev` renders the home page visually identical to before (ember values equal the old constants — this is expected to be pixel-identical).

### T06 — Pre-paint alignment bootstrap script
- **Depends on:** T04
- **Files:** `app/layout.tsx`
- **Steps:** Inside the `<html>` element's `<head>` (add a `<head>` if the layout doesn't render one explicitly), insert:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `try{document.documentElement.dataset.alignment=localStorage.getItem("mj.alignment")||"ember"}catch(e){document.documentElement.dataset.alignment="ember"}`,
  }}
/>
```
  Also add `data-alignment="ember"` as a default attribute on the `<html>` tag itself, and `suppressHydrationWarning` on `<html>`.
- **Done when:** hard-reloading any page shows no color flash and `document.documentElement.dataset.alignment` is set before first paint.

### T07 — Alignment Zustand store
- **Depends on:** T01, T03
- **Files:** `lib/alignment/store.ts` (new)
- **Steps:** Create a Zustand store exporting `useAlignmentStore` with exactly this shape:
```ts
type AlignmentId = "ember" | "meridian" | "atelier";
interface AlignmentState {
  alignment: AlignmentId;
  setAlignment: (id: AlignmentId) => void;
}
```
  `setAlignment` must (1) set state, (2) write `document.documentElement.dataset.alignment = id`, (3) `localStorage.setItem("mj.alignment", id)` inside try/catch. Initial value: read `localStorage.getItem("mj.alignment")` guarded by `typeof window !== "undefined"`, fall back to `"ember"`, validate it is one of the three ids.
- **Done when:** `npm run build` passes and the store compiles with the exact exported names `useAlignmentStore` and type `AlignmentId`.

### T08 — Supabase SQL migration file (documentation artifact)
- **Files:** `supabase/migrations/0001_leads_and_telemetry.sql` (new)
- **Steps:** Create the file with this exact content:
```sql
create schema if not exists leads;
create schema if not exists telemetry;

create table leads.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company text,
  project_type text,
  message text not null check (char_length(message) <= 4000),
  preferred_contact text,
  roi_snapshot jsonb,
  lead_score smallint,
  created_at timestamptz not null default now()
);

create table telemetry.component_events (
  id bigint generated always as identity primary key,
  component text not null,
  event text not null,
  session_hash text not null,
  created_at timestamptz not null default now()
);

alter table leads.messages enable row level security;
alter table telemetry.component_events enable row level security;
-- No policies are created: default-deny. All access goes through
-- the service-role key in server route handlers only.
```
- **Done when:** file exists verbatim. (Applying it to a live Supabase project is a separate human/ops step, not part of this task.)

### T09 — Server-side Supabase client helper
- **Depends on:** T01
- **Files:** `lib/supabase/server.ts` (new), `ENV_TEMPLATE.md`
- **Steps:**
  1. Create `lib/supabase/server.ts` exporting `getServiceClient()` which returns `createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })` from `@supabase/supabase-js`. Throw a plain `Error("Supabase server env vars missing")` if either env var is undefined.
  2. Append `SUPABASE_URL=` and `SUPABASE_SERVICE_ROLE_KEY=` lines to `ENV_TEMPLATE.md` with a one-line comment that these are server-only and must never get a `NEXT_PUBLIC_` prefix.
- **Done when:** `npm run build` passes.

### T10 — Lead payload zod schema
- **Depends on:** T01
- **Files:** `lib/leads/schema.ts` (new)
- **Steps:** Export `leadSchema` (zod object) and `LeadInput` (inferred type):
  - `name`: string, min 2, max 120, trimmed
  - `email`: string, `.email()`, max 254
  - `company`: string max 200, optional
  - `projectType`: enum `["Web Development","Cloud Solutions","Data Analytics","Consulting","Other"]`, optional
  - `message`: string, min 10, max 4000, trimmed
  - `preferredContact`: enum `["Email","Phone","LinkedIn"]`, default `"Email"`
  - `roiSnapshot`: `z.unknown().optional()`
- **Done when:** `npm run build` passes; file exports exactly `leadSchema` and `LeadInput`.

### T11 — Lead scoring function + tests
- **Depends on:** T02, T10
- **Files:** `lib/leads/score.ts` (new), `lib/leads/score.test.ts` (new)
- **Steps:**
  1. Export `scoreLead(input: LeadInput): number` returning 0–100, computed as: base 20; +20 if `company` non-empty; +20 if `message.length >= 200`; +10 if `message.length >= 80` (not cumulative with the previous — use whichever one bracket matches); +20 if `projectType` is `"Cloud Solutions"` or `"Consulting"`; +20 if `roiSnapshot` is an object containing `outputs.netAnnualSavings > 10000`. Clamp to 100.
  2. Tests: minimal lead scores 20; fully-loaded lead scores 100; lead with 100-char message and company scores 50.
- **Done when:** `npm test` passes.

### T12 — POST /api/leads route handler
- **Depends on:** T09, T10, T11
- **Files:** `app/api/leads/route.ts` (new)
- **Steps:** Implement `export async function POST(req: Request)`:
  1. Parse JSON body; on parse failure return 400 `{ error: "invalid_json" }`.
  2. `leadSchema.safeParse` — on failure return 422 `{ error: "validation", issues: <zod issues> }`.
  3. Compute `lead_score` via `scoreLead`.
  4. Insert into `leads.messages` using `getServiceClient().schema("leads").from("messages").insert({...})` mapping camelCase fields to the snake_case columns (`project_type`, `preferred_contact`, `roi_snapshot`, `lead_score`).
  5. On Supabase error return 502 `{ error: "storage" }`; on success return 201 `{ ok: true }`.
  6. Do NOT log the message body or email; log only the error code on failure.
- **Done when:** `npm run build` passes and `curl -X POST localhost:3000/api/leads -d '{}' -H 'content-type: application/json'` returns 422.

### T13 — Wire contact form to real API
- **Depends on:** T12
- **Files:** `app/contact/page.tsx`
- **Steps:**
  1. In `handleSubmit`, delete the simulated delay (`await new Promise(...)`) and the hard-coded success.
  2. Replace with `fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(formData) })`.
  3. `setSubmitStatus("success")` only when `res.status === 201`; otherwise `"error"`. Wrap in try/catch → `"error"`.
  4. Keep all existing UI, state names, and reset behavior unchanged.
- **Done when:** `npm run build` passes; submitting with an invalid email shows the error state; no `setTimeout`/fake delay remains in the file.

---

## PHASE 1 — Global Alignment Toggle

### T14 — Voice copy registry
- **Files:** `lib/alignment/voice.ts` (new)
- **Steps:** Export `type Voice = "operator" | "boardroom" | "studio"`, a `VOICE_COPY` record keyed by copy id, and `getCopy(key: string, voice: Voice): string` (falls back to `operator`, then to the key itself). Seed with exactly these keys:
  - `hero.headline`: operator "I build the systems your spreadsheets are pretending to be." / boardroom "Operational software that returns hours to the P&L." / studio "Precision-built platforms, finished like products."
  - `hero.sub`: operator "Custom CRM fabrics, automation pipelines, and operational dashboards — engineered, not assembled." / boardroom "Purpose-built systems that eliminate double entry and reclaim payroll hours." / studio "Software with the fit and finish of a shipped product — because it is one."
  - `cta.bottom`: operator "Bring me the bottleneck. I'll bring back the hours." / boardroom "Book a systems consultation." / studio "Let's build the version you actually wanted."
- **Done when:** `npm run build` passes; `getCopy("hero.headline","boardroom")` returns the boardroom string.

### T15 — useVoice hook
- **Depends on:** T07, T14
- **Files:** `lib/alignment/use-voice.ts` (new)
- **Steps:** Export `useVoice(key: string): string` — a client hook that reads `alignment` from `useAlignmentStore`, maps alignment→voice (`ember→operator`, `meridian→boardroom`, `atelier→studio`), returns `getCopy(key, voice)`.
- **Done when:** `npm run build` passes.

### T16 — AlignmentToggle component
- **Depends on:** T07
- **Files:** `components/AlignmentToggle.tsx` (new)
- **Steps:** Client component rendering a segmented control:
  - Container: `role="radiogroup"`, `aria-label="Site alignment"`, glass styling (`bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md rounded-full p-1 flex gap-1`).
  - Three buttons (Ember, Meridian, Atelier): `role="radio"`, `aria-checked` from store, each showing an 8px round swatch (`--accent-primary` value of THAT alignment hard-coded in a local constant map — the only allowed hex literals, commented as swatch preview values) plus the label text on `sm:` and up, swatch only on mobile.
  - Active segment: Framer Motion `motion.span` with `layoutId="alignment-pill"` as the sliding background.
  - Keyboard: ArrowLeft/ArrowRight move selection and call `setAlignment`.
- **Done when:** `npm run build` passes; clicking segments changes `document.documentElement.dataset.alignment`.

### T17 — Mount toggle in navbar
- **Depends on:** T16
- **Files:** `components/Navbar.tsx`
- **Steps:** Import and render `<AlignmentToggle />` inside the navbar's right-side control cluster (next to existing nav links; before any mobile menu button). Do not restructure the navbar otherwise.
- **Done when:** toggle is visible on desktop and mobile widths and page still builds.

### T18 — Migrate hero + bottom CTA copy to voice keys
- **Depends on:** T15
- **Files:** `components/Hero.tsx`, `components/BottomCTA.tsx`
- **Steps:** Replace the hard-coded headline/sub strings in `Hero.tsx` with `useVoice("hero.headline")` / `useVoice("hero.sub")`, and the CTA headline in `BottomCTA.tsx` with `useVoice("cta.bottom")`. Components are already client components; if not, add `"use client"`.
- **Done when:** switching alignment changes the visible hero headline text without reload.

### T19 — Theme transition polish
- **Depends on:** T16
- **Files:** `app/globals.css`
- **Steps:** Add a rule `html[data-alignment] body, html[data-alignment] body * { transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease; }` wrapped in `@media (prefers-reduced-motion: no-preference) { ... }`. Exempt elements with class `.no-theme-transition` via a follow-up rule setting `transition: none`.
- **Done when:** switching alignment cross-fades colors; with OS reduced-motion enabled, switch is instant.

### T20 — Token parity CI check script
- **Depends on:** T03
- **Files:** `scripts/validate-alignments.mjs` (new), `package.json`
- **Steps:**
  1. Node script: load `lib/alignment/alignments.json`; collect token key sets per alignment; if any two differ, print the diff and `process.exit(1)`; else print `alignments OK` and exit 0.
  2. Add `"validate:alignments": "node scripts/validate-alignments.mjs"` to scripts.
- **Done when:** `npm run validate:alignments` exits 0; deleting one token from meridian makes it exit 1 (test locally, then restore).

---

## PHASE 2 — ROI Impact Calculator

### T21 — ROI model constants and types
- **Files:** `lib/roi/types.ts` (new)
- **Steps:** Export:
```ts
export interface RoiInputs {
  technicians: number; jobsPerTechPerDay: number; adminMinutesPerJob: number;
  doubleEntryRate: number; errorReworkRate: number; loadedHourlyCost: number;
  workingDaysPerYear: number;
}
export interface RoiOutputs {
  adminHoursPerYear: number; recoverableHoursPerYear: number;
  grossAnnualSavings: number; netAnnualSavings: number; paybackMonths: number;
}
export const ROI_DEFAULTS: RoiInputs = { technicians: 6, jobsPerTechPerDay: 5, adminMinutesPerJob: 12, doubleEntryRate: 0.35, errorReworkRate: 0.06, loadedHourlyCost: 42, workingDaysPerYear: 250 };
export const ROI_BOUNDS = {
  technicians: { min: 1, max: 200, step: 1 },
  jobsPerTechPerDay: { min: 1, max: 30, step: 1 },
  adminMinutesPerJob: { min: 2, max: 60, step: 1 },
  doubleEntryRate: { min: 0, max: 1, step: 0.05 },
  errorReworkRate: { min: 0, max: 0.5, step: 0.01 },
  loadedHourlyCost: { min: 15, max: 150, step: 1 },
  workingDaysPerYear: { min: 200, max: 260, step: 5 },
} as const;
export const AUTOMATION_CAPTURE_RATE = 0.8;
export const REWORK_MINUTES_MULTIPLIER = 2.5;
export const IMPLEMENTATION_COST = 12000;
```
- **Done when:** `npm run build` passes with these exact exported names.

### T22 — Pure ROI model + tests
- **Depends on:** T02, T21
- **Files:** `lib/roi/model.ts` (new), `lib/roi/model.test.ts` (new)
- **Steps:**
  1. Export `computeRoi(inputs: RoiInputs): RoiOutputs`, implementing exactly:
```
adminHoursPerYear   = technicians * jobsPerTechPerDay * adminMinutesPerJob / 60 * workingDaysPerYear
doubleEntryHours    = adminHoursPerYear * doubleEntryRate
reworkHours         = technicians * jobsPerTechPerDay * workingDaysPerYear * errorReworkRate * (adminMinutesPerJob * REWORK_MINUTES_MULTIPLIER) / 60
recoverableHours    = (doubleEntryHours + reworkHours) * AUTOMATION_CAPTURE_RATE
grossAnnualSavings  = recoverableHours * loadedHourlyCost
netAnnualSavings    = grossAnnualSavings - IMPLEMENTATION_COST
paybackMonths       = grossAnnualSavings <= 0 ? Infinity : IMPLEMENTATION_COST / (grossAnnualSavings / 12)
```
  Round every output to 1 decimal except paybackMonths (1 decimal, or `Infinity` passthrough). No I/O, no Date, no randomness.
  2. Tests: (a) `ROI_DEFAULTS` produces `adminHoursPerYear === 1500` and `netAnnualSavings > 0`; (b) minimum bounds for every input produces `netAnnualSavings < 0`; (c) `grossAnnualSavings` of all-zero-rates inputs (doubleEntryRate 0, errorReworkRate 0) equals 0 and `paybackMonths === Infinity`.
- **Done when:** `npm test` passes.

### T23 — ROI zod schema (server validator)
- **Depends on:** T21
- **Files:** `lib/roi/schema.ts` (new)
- **Steps:** Export `roiInputsSchema` — a zod object with one `z.number()` per `RoiInputs` field, each `.min()`/`.max()` from `ROI_BOUNDS` (import and reference the constants; do not retype numbers). Integers (`technicians`, `jobsPerTechPerDay`, `adminMinutesPerJob`, `workingDaysPerYear`) additionally `.int()`.
- **Done when:** `npm run build` passes; parsing `{...ROI_DEFAULTS, technicians: 0}` fails, parsing `ROI_DEFAULTS` succeeds.

### T24 — ROI Zustand store
- **Depends on:** T07, T22
- **Files:** `lib/roi/store.ts` (new)
- **Steps:** Export `useRoiStore` with state `{ inputs: RoiInputs; outputs: RoiOutputs; setInput: (key: keyof RoiInputs, value: number) => void; reset: () => void }`. `setInput` clamps value to `ROI_BOUNDS[key]` min/max, updates `inputs`, and recomputes `outputs = computeRoi(inputs)` in the same set call. Initialize with `ROI_DEFAULTS` and its computed outputs.
- **Done when:** `npm run build` passes.

### T25 — RoiSliderRow component
- **Depends on:** T24
- **Files:** `components/roi/RoiSliderRow.tsx` (new)
- **Steps:** Client component with props `{ inputKey: keyof RoiInputs; label: string; unit: string; format?: (v: number) => string }`. Renders: label (left), live value chip in `font-mono` (right), and a native `<input type="range">` bound to the store, with `min/max/step` from `ROI_BOUNDS[inputKey]` and `aria-valuetext` = formatted value + unit. Style track/thumb with accent tokens (`accent-[var(--accent-primary)]` on the input is sufficient).
- **Done when:** `npm run build` passes.

### T26 — RoiOutputPanel component
- **Depends on:** T24
- **Files:** `components/roi/RoiOutputPanel.tsx` (new)
- **Steps:** Client component rendering:
  - Hero figure: `netAnnualSavings` formatted as USD (`Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})`), `font-mono`, large (`text-5xl md:text-6xl`), colored `var(--accent-success)` when ≥ 0 and `var(--accent-primary)` when < 0.
  - Label above it: "Projected net savings, year one".
  - When `netAnnualSavings < 0`, render instead of the standard sublabel: "At this scale, automation may not pay for itself yet — move the sliders to find your threshold." Do NOT clamp the number.
  - Three stat rows: "Hours reclaimed / yr" = `recoverableHoursPerYear`; "Gross savings" = USD `grossAnnualSavings`; "Payback" = `paybackMonths` + " mo" (render "—" when `Infinity`).
- **Done when:** `npm run build` passes.

### T27 — ShowTheMath disclosure
- **Depends on:** T24
- **Files:** `components/roi/ShowTheMath.tsx` (new)
- **Steps:** Client component: a `<details>` element titled "Show the math" containing a `<pre class="font-mono text-sm">` block that prints the five model formulas with the CURRENT store input values substituted in (e.g. `admin hours = 6 tech × 5 jobs × 12 min / 60 × 250 days = 1500.0 h`). Values come from the store; recompute the displayed lines on every render.
- **Done when:** `npm run build` passes; numbers in the pre block change when sliders move.

### T28 — RoiCalculator section assembly
- **Depends on:** T25, T26, T27
- **Files:** `components/roi/RoiCalculator.tsx` (new), `app/page.tsx`
- **Steps:**
  1. Compose: section with eyebrow "ROI MODELING", headline "Your bottleneck, priced.", sub "Move the sliders to match your operation. The math is shown, the assumptions are yours to change."
  2. Grid: `grid md:grid-cols-12 gap-6` — inputs panel `md:col-span-8` (glass panel: `bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md rounded-2xl p-6`) containing seven `RoiSliderRow`s (labels: "Technicians", "Jobs per tech / day", "Admin minutes per job", "Double-entry rate", "Error / rework rate", "Loaded hourly cost", "Working days / year"; unit strings to match); output panel `md:col-span-4` (`bg-[var(--surface-1)] rounded-2xl p-6`) containing `RoiOutputPanel` + `ShowTheMath`.
  3. Mount `<RoiCalculator />` in `app/page.tsx` between the featured-projects section and the brand-statement section.
- **Done when:** section renders on home page, sliders update the hero figure live, `npm run build` passes.

### T29 — POST /api/roi/report route
- **Depends on:** T09, T22, T23
- **Files:** `app/api/roi/report/route.ts` (new)
- **Steps:** `POST`: parse JSON (400 on failure) → `roiInputsSchema.safeParse` on `body.inputs` (422 on failure) → recompute outputs server-side with `computeRoi` → return 200 `{ version: 1, inputs, outputs, computedAt: "server" }`. Ignore any `outputs` field the client sent. No database write in this task.
- **Done when:** `npm run build` passes; posting `{ "inputs": <ROI_DEFAULTS values> }` returns the canonical snapshot; posting `technicians: 999` returns 422.

### T30 — Attach ROI snapshot to contact submissions
- **Depends on:** T13, T24, T29
- **Files:** `components/roi/RoiCalculator.tsx`, `app/contact/page.tsx`, `lib/roi/store.ts`
- **Steps:**
  1. Add `snapshotArmed: boolean` + `armSnapshot()` to `useRoiStore`.
  2. Add a CTA button "Send me this analysis" at the bottom of the output panel: calls `armSnapshot()` then navigates to `/contact` via `next/link` router push.
  3. In the contact form submit, if `useRoiStore.getState().snapshotArmed`, POST current `inputs` to `/api/roi/report`, take the returned snapshot, include it as `roiSnapshot` in the `/api/leads` payload, then disarm.
- **Done when:** a lead submitted after clicking the CTA carries `roi_snapshot` in the inserted row; a lead submitted without it carries null.

---

## PHASE 3 — System Blueprint Visualizer

### T31 — Graph types and field-service graph data
- **Files:** `lib/blueprint/types.ts` (new), `lib/blueprint/graphs/field-service-crm.ts` (new)
- **Steps:**
  1. `types.ts`: export `NodeKind = "source" | "process" | "store" | "decision" | "sink"`, `PulseKind = "steady" | "burst" | "rare"`, and interfaces `BlueprintNode { id: string; kind: NodeKind; label: string; detail?: string; metrics?: Record<string,string>; position: { col: number; row: number } }`, `BlueprintEdge { from: string; to: string; label: string; pulse: PulseKind }`, `BlueprintGraph { id: string; title: string; nodes: BlueprintNode[]; edges: BlueprintEdge[] }`.
  2. `field-service-crm.ts`: export the graph exactly as specified in `01-system-blueprint-visualizer.md` §State (5 nodes: tech-mobile, ingest-api, crm-core, routing-engine, admin-dash; 5 edges as listed there).
- **Done when:** `npm run build` passes.

### T32 — Graph validation script + tests
- **Depends on:** T02, T31
- **Files:** `lib/blueprint/validate.ts` (new), `lib/blueprint/validate.test.ts` (new)
- **Steps:**
  1. Export `validateGraph(g: BlueprintGraph): string[]` returning an array of human-readable problems (empty = valid). Checks: node ids unique; every edge `from`/`to` exists in nodes; `position.col` in 1–6 and `row` in 1–4; no edge where `from === to`.
  2. Tests: the field-service graph validates clean; a graph with a dangling edge returns exactly one problem mentioning the bad id.
- **Done when:** `npm test` passes.

### T33 — Layout geometry helpers + tests
- **Depends on:** T02, T31
- **Files:** `lib/blueprint/layout.ts` (new), `lib/blueprint/layout.test.ts` (new)
- **Steps:**
  1. Constants: `CELL_W = 220`, `CELL_H = 140`, `NODE_W = 176`, `NODE_H = 88`.
  2. Export `nodeRect(n: BlueprintNode): { x, y, w, h }` — top-left at `((col-1)*CELL_W + (CELL_W-NODE_W)/2, (row-1)*CELL_H + (CELL_H-NODE_H)/2)`.
  3. Export `edgePath(from: BlueprintNode, to: BlueprintNode): string` — an SVG cubic bézier `M ... C ...` from the right-center of `from`'s rect to the left-center of `to`'s rect, control points offset horizontally by `CELL_W * 0.4`.
  4. Export `canvasSize(g: BlueprintGraph): { w, h }` = `(maxCol * CELL_W, maxRow * CELL_H)`.
  5. Tests: nodeRect of col1/row1 equals `(22, 26, 176, 88)`; edgePath output starts with `M 198` for a col1/row1 node.
- **Done when:** `npm test` passes.

### T34 — NodeGlyph component
- **Depends on:** T31, T33
- **Files:** `components/blueprint/NodeGlyph.tsx` (new)
- **Steps:** Client component, props `{ node: BlueprintNode; selected: boolean; dimmed: boolean; onSelect: (id: string) => void }`. Render an SVG `<g>` at `nodeRect` position: `<rect>` (rx 12, fill `var(--surface-1)`, stroke = kind accent), kind accent map: source→`--accent-info`, process→`--text-muted`, store→`--accent-data`, decision→`--accent-primary`, sink→`--accent-success`. Label as `<text>` (font-mono, 12px, fill `var(--text-primary)`). `dimmed` → group opacity 0.25; `selected` → stroke-width 2.5 else 1.25. The `<g>` gets `role="button"`, `tabIndex={0}`, `aria-label={node.label}`, click and Enter both call `onSelect(node.id)`.
- **Done when:** `npm run build` passes.

### T35 — Closure (blast-radius) helper + tests
- **Depends on:** T02, T31
- **Files:** `lib/blueprint/closure.ts` (new), `lib/blueprint/closure.test.ts` (new)
- **Steps:** Export `connectedClosure(g: BlueprintGraph, nodeId: string): Set<string>` — BFS both upstream and downstream over edges from `nodeId`, returning all reachable node ids including `nodeId`. Test on the field-service graph: closure of `crm-core` contains all 5 ids; closure of `tech-mobile` contains all 5 (it feeds everything); a two-island synthetic graph returns only the island.
- **Done when:** `npm test` passes.

### T36 — BlueprintCanvas assembly (static, no pulses)
- **Depends on:** T32, T33, T34, T35
- **Files:** `components/blueprint/BlueprintCanvas.tsx` (new)
- **Steps:** Client component, prop `{ graph: BlueprintGraph }`. Local state: `selectedId: string | null`. Render an `<svg>` sized by `canvasSize`, inside a container div with `overflow-x-auto`; draw all edges (`<path>` stroke `var(--stroke-glass)`, stroke-width 1.5, fill none) with `<text>` labels at path midpoint (use `getPointAtLength` via a ref, or place at the arithmetic midpoint of the two anchors — arithmetic midpoint is acceptable), then all `NodeGlyph`s. Selection: clicking a node sets `selectedId`; nodes outside `connectedClosure(graph, selectedId)` get `dimmed`; clicking svg background or pressing Escape clears selection.
- **Done when:** `npm run build` passes; nodes select/dim correctly in the browser.

### T37 — Node inspector panel
- **Depends on:** T36
- **Files:** `components/blueprint/NodeInspector.tsx` (new), `components/blueprint/BlueprintCanvas.tsx`
- **Steps:**
  1. `NodeInspector`: props `{ node: BlueprintNode | null; onClose: () => void }`. When node non-null render a glass panel (absolute right on `md:`, fixed bottom sheet on mobile): node label (headline), `detail` paragraph, `metrics` as mono key/value rows, and a link-button "Model your version →" href `/#roi` (anchor to the calculator section — add `id="roi"` to the RoiCalculator section if absent). Close button with `aria-label="Close inspector"`.
  2. Mount inside `BlueprintCanvas`'s container, driven by `selectedId`.
- **Done when:** `npm run build` passes; selecting a node opens the panel, Escape/close clears it.

### T38 — Pulse animation (CSS-only)
- **Depends on:** T36
- **Files:** `components/blueprint/BlueprintCanvas.tsx`, `app/globals.css`
- **Steps:** Use pure CSS instead of a rAF simulator (simpler, gated automatically):
  1. In `globals.css` add `@keyframes bp-dash { to { stroke-dashoffset: -24; } }` and class `.bp-edge-animated { stroke-dasharray: 4 8; animation: bp-dash 1.2s linear infinite; }` plus variants `.bp-edge-burst { animation-duration: 0.6s; }` and `.bp-edge-rare { animation-duration: 3s; }`, all wrapped in `@media (prefers-reduced-motion: no-preference)`.
  2. Apply classes on edge paths by `pulse` kind. Additionally, only apply animated classes when the existing `use-performance-tier` hook (in `hooks/use-performance-tier.ts` — read it first to learn its exact API) reports a tier above its lowest value; on the lowest tier render static edges.
- **Done when:** edges animate on desktop; OS reduced-motion shows static edges; `npm run build` passes.

### T39 — Mount visualizer on home page
- **Depends on:** T37, T38
- **Files:** `components/blueprint/BlueprintSection.tsx` (new), `app/page.tsx`
- **Steps:** Section wrapper with eyebrow "LIVE SYSTEM MAP", headline "This is what your operation looks like when nothing is typed twice.", hint line "Select any node. Everything is inspectable — that's the point.", containing `<BlueprintCanvas graph={fieldServiceCrm} />` in a full-width glass panel. Mount in `app/page.tsx` directly above the RoiCalculator section.
- **Done when:** home page shows map → calculator → brand statement in that order; `npm run build` passes.

---

## PHASE 4 — Hardening

### T40 — In-memory rate limit for /api/leads
- **Depends on:** T12
- **Files:** `lib/leads/rate-limit.ts` (new), `app/api/leads/route.ts`
- **Steps:**
  1. Export `checkRateLimit(key: string): boolean` backed by a module-level `Map<string, number[]>` of timestamps; allow max 5 requests per key per 10 minutes (`Date.now()` based, prune old entries on each call).
  2. In the route, key on `req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"`; when over limit return 429 `{ error: "rate_limited" }` before validation. Do not persist or log the raw address anywhere.
- **Done when:** 6 rapid curl POSTs → the 6th returns 429; `npm run build` passes.

### T41 — Telemetry endpoint + client helper
- **Depends on:** T09
- **Files:** `app/api/telemetry/route.ts` (new), `lib/telemetry.ts` (new)
- **Steps:**
  1. Route `POST`: zod-validate `{ component: enum["visualizer","roi_calculator","alignment_toggle"], event: enum["open","interact","complete"], sessionHash: string max 64 }`; insert into `telemetry.component_events`; always return 204 (even on storage error — telemetry must never surface failures). 422 only on validation failure.
  2. `lib/telemetry.ts`: export `track(component, event)` — client-safe; lazily creates a per-tab random `sessionHash` (`crypto.randomUUID()` stored in `sessionStorage`), debounces identical events 500ms, sends `navigator.sendBeacon("/api/telemetry", ...)` with fetch fallback, and swallows all errors.
- **Done when:** `npm run build` passes; `track` calls produce rows when Supabase env is configured, and never throw when it is not.

### T42 — Wire telemetry into the three modules
- **Depends on:** T41, T16, T28, T39
- **Files:** `components/AlignmentToggle.tsx`, `components/roi/RoiCalculator.tsx`, `components/blueprint/BlueprintCanvas.tsx`
- **Steps:** Add `track("alignment_toggle","interact")` on segment change; `track("roi_calculator","interact")` on any slider change (already debounced by lib); `track("roi_calculator","complete")` when the snapshot CTA is clicked; `track("visualizer","open")` once on first mount (useEffect, empty deps); `track("visualizer","interact")` on node select.
- **Done when:** events fire (visible in network tab) and `npm run build` passes.

### T43 — README refresh
- **Depends on:** T39
- **Files:** `README.md`
- **Steps:** Update: (1) project structure section to include `lib/alignment`, `lib/roi`, `lib/blueprint`, `components/roi`, `components/blueprint`, `app/api/*`, `supabase/migrations`; (2) features section to describe the three modules in one paragraph each; (3) Supabase setup section to point at `supabase/migrations/0001_leads_and_telemetry.sql` and list the two server env vars from `ENV_TEMPLATE.md`; (4) remove the outdated `messages` table SQL block. Keep tone and formatting of the existing README.
- **Done when:** README contains no references to files that don't exist and documents all env vars actually read by the code.

---

## PHASE 5 — Parallax Experience System

Design rationale lives in `05-parallax-experience.md`. Executor rules for this phase, in addition to the global ground rules: animate ONLY `transform` and `opacity` (never blur, filter, width, height, top, or left); use Framer Motion's `useScroll`/`useTransform`/`MotionValue` APIs — do NOT add any new npm dependency; every color must be a `var(--token)` reference, no hex literals.

### T44 — Parallax constants module
- **Files:** `lib/parallax/constants.ts` (new)
- **Steps:** Create the file with exactly:
```ts
export const DEPTH = {
  far: -0.12,
  mid: -0.28,
  near: -0.45,
  lift: 0.10,
} as const;
export type DepthName = keyof typeof DEPTH;
export const MOBILE_DISTANCE_SCALE = 0.4;
export const HERO_RECEDE = {
  scale: [1, 1.18] as [number, number],
  opacity: [1, 0] as [number, number],
  contentY: [0, -120] as [number, number],
};
export const SPLASH_REVEAL_MS = 1800;
```
- **Done when:** `npm run build` passes with these exact exported names.

### T45 — Capability gate hook
- **Depends on:** T44
- **Files:** `lib/parallax/use-parallax-enabled.ts` (new)
- **Steps:** Export `type ParallaxMode = "full" | "reduced" | "off"` and `useParallaxEnabled(): ParallaxMode`:
  1. Import `useReducedMotion` from `framer-motion` and `usePerformanceTier` from `@/hooks/use-performance-tier`.
  2. If `useReducedMotion()` returns true → `"off"`.
  3. Else map tier: `"high"` or `"flagship"` → `"full"`; `"medium"` → `"reduced"`; `"low"` → `"off"`.
  4. Both hooks must be called unconditionally (React rules of hooks) — do the branching after both calls.
- **Done when:** `npm run build` passes.

### T46 — ScrollScene, ParallaxLayer, ProgressReveal primitives
- **Depends on:** T44, T45
- **Files:** `lib/parallax/scroll-scene.tsx` (new)
- **Steps:** One client-component file (`"use client"`) exporting three components and nothing else:
  1. `SceneContext = createContext<{ progress: MotionValue<number>; mode: ParallaxMode } | null>(null)` (not exported).
  2. `ScrollScene({ children, className })`: renders `<div ref={ref} className={cn("relative", className)}>`; calls `useScroll({ target: ref, offset: ["start end", "end start"] })`; calls `useParallaxEnabled()`; provides `{ progress: scrollYProgress, mode }` via context.
  3. `ParallaxLayer({ depth, scaleRange, opacityRange, className, children })` where `depth: DepthName`: reads context (render children in a plain div if context is null or `mode === "off"`). Compute `travel = DEPTH[depth] * 300 * (mode === "reduced" ? MOBILE_DISTANCE_SCALE : 1)`; `y = useTransform(progress, [0, 1], [-travel, travel])`; optional `scale`/`opacity` from `useTransform(progress, [0, 1], range)` when the range props are given. Render `<motion.div style={{ y, scale, opacity, willChange: "transform" }} className={className}>`. All `useTransform` calls must be unconditional — pass identity ranges `[1, 1]` when a range prop is absent.
  4. `ProgressReveal({ start, end, yFrom = 24, className, children })` with `0 <= start < end <= 1`: reads context; `opacity = useTransform(progress, [start, end], [0, 1])`, `y = useTransform(progress, [start, end], [yFrom, 0])`, clamped (default clamping is fine). When `mode === "off"` render children plainly.
- **Done when:** `npm run build` passes; importing `{ ScrollScene, ParallaxLayer, ProgressReveal }` from `@/lib/parallax/scroll-scene` compiles.

### T47 — Scroll progress hairline
- **Depends on:** T45
- **Files:** `components/ScrollProgressBar.tsx` (new), `app/layout.tsx`
- **Steps:**
  1. Client component: `const { scrollYProgress } = useScroll()` (no target = whole page); `scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })`; render `<motion.div aria-hidden className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left" style={{ scaleX, backgroundColor: "var(--accent-primary)" }} />`. If `useParallaxEnabled() === "off"`, render null.
  2. Mount `<ScrollProgressBar />` in `app/layout.tsx` immediately inside `<body>`, before the navbar.
- **Done when:** a thin accent bar tracks scroll on every page; `npm run build` passes.

### T48 — Act I: hero recede
- **Depends on:** T44, T45
- **Files:** `components/Hero.tsx`
- **Steps:** Modify only the outer return of the `Hero` component (do NOT touch `BeamBackground`, `MobileBeam`, or any Three.js code):
  1. Add a `heroRef` on the root `<div>` and `const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })`.
  2. Wrap the existing background block (`{showHeavyBeam ? ... : ...}`) in `<motion.div className="absolute inset-0" style={{ scale: bgScale, opacity: bgOpacity, willChange: "transform" }}>` where `bgScale = useTransform(scrollYProgress, [0, 1], HERO_RECEDE.scale)` and `bgOpacity = useTransform(scrollYProgress, [0, 1], HERO_RECEDE.opacity)`.
  3. Add `style={{ y: contentY }}` to the existing content wrapper (`<div className="relative z-10 ...">` → make it `motion.div`) where `contentY = useTransform(scrollYProgress, [0, 1], HERO_RECEDE.contentY)`.
  4. Gate: when `useParallaxEnabled() !== "full"`, pass static values (`scale: 1, opacity: 1, y: 0`) — compute the transforms unconditionally, choose in the `style` prop.
- **Done when:** scrolling down from the top makes the beam grow slightly and fade while the headline lifts away; scrolling back reverses it; with OS reduced-motion on, nothing moves; `npm run build` passes.

### T49 — Hero splash rework + scroll cue
- **Depends on:** T44
- **Files:** `components/Hero.tsx`, `components/ui/scroll-cue.tsx` (new)
- **Steps:**
  1. In `Hero.tsx`, change the splash `setTimeout` from `5000` to `SPLASH_REVEAL_MS` (import from `@/lib/parallax/constants`).
  2. New `ScrollCue` client component: a `<button>` fixed at bottom-center of the hero (`absolute bottom-8 left-1/2 -translate-x-1/2 z-10`), containing a chevron-down icon from `lucide-react` inside a `motion.span` animating `y: [0, 8, 0]` over 1.6s repeat Infinity (skip the animation when `useReducedMotion()`); `aria-label="Descend into the work"`; onClick: `document.getElementById("act-2")?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" })`.
  3. Render `<ScrollCue />` in the hero (desktop and mobile), and add `id="act-2"` to the first section after the hero in `app/page.tsx` (the skills bento section).
- **Done when:** content appears at ~1.8s, the chevron pulses, clicking it scrolls to the skills section; `npm run build` passes.

### T50 — Act III: ParallaxDotField (Featured Projects)
- **Depends on:** T46
- **Files:** `components/ui/parallax-dot-field.tsx` (new), `components/FeaturedProjects.tsx`
- **Steps:**
  1. New `ParallaxDotField` component (no props): renders three absolutely-positioned planes inside `<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-bg-elevated">`, each inset by `-15%` (`className="absolute -inset-[15%]"`) so parallax travel never exposes edges:
     - `<ParallaxLayer depth="far">` — coarse dots: `bg-[radial-gradient(var(--text-primary)_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.04]`
     - `<ParallaxLayer depth="mid">` — fine dots: `bg-[radial-gradient(var(--text-primary)_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]` with the same radial mask as the current `DotBackground`
     - `<ParallaxLayer depth="near" opacityRange={[0.06, 0.14]}>` — accent wash: `bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_65%)]`
  2. In `FeaturedProjects.tsx`: wrap the section content in `<ScrollScene>` (it becomes the section root), replace `<DotBackground />` with `<ParallaxDotField />`. Keep `components/ui/dot-background.tsx` untouched (still used elsewhere or by future pages).
- **Done when:** the three planes visibly separate while scrolling through Featured Projects (coarse dots slowest); no horizontal scrollbar appears at any scroll position; `npm run build` passes.

### T51 — Act II: skills bento scroll choreography
- **Depends on:** T46
- **Files:** `components/SkillsBentoGrid.tsx`
- **Steps:** Read the file first to learn its card structure, then:
  1. Wrap the section root in `<ScrollScene>`.
  2. Wrap the existing `<EvervaultBackground className="rounded-none" radius={450} />` in `<ParallaxLayer depth="mid" className="absolute -inset-[15%]">` (keep the Evervault component itself unmodified).
  3. Wrap each skill card in `<ProgressReveal start={s} end={s + 0.25}>` where `s = 0.15 + index * 0.06` (scroll-scrubbed stagger). If the cards currently use time-based Framer `whileInView` animations, remove those in favor of the reveal wrapper.
- **Done when:** cards rise in sequence as the section scrolls into view and sink back when scrolling up; scramble field drifts slower than the cards; `npm run build` passes.

### T52 — Act IV: pinned brand statement
- **Depends on:** T46
- **Files:** `components/BrandStatement.tsx`
- **Steps:** Read the file first. Then restructure:
  1. Section root becomes `<ScrollScene className="relative h-[200vh]">` (`full` mode only — see step 4).
  2. Inside it, a sticky frame: `<div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">` containing the existing `EvervaultBackground` (wrapped in `<ParallaxLayer depth="far" className="absolute -inset-[15%]">`) and the statement.
  3. Replace the statement copy with five word-groups, each in `<ProgressReveal>` with windows `[0.10,0.25]`, `[0.25,0.40]`, `[0.40,0.55]`, `[0.55,0.70]`, `[0.70,0.85]` and `yFrom={16}`. Groups (exact text): "Most sites describe the work." / "This one is the work." / "Every plane you just scrolled through" / "is running the same discipline" / "I bring to your systems." Render as stacked lines, `font-serif`, sizes matching the section's current headline scale; revealed groups at full `--text-primary`, unrevealed naturally at opacity 0.
  4. Gate: when `useParallaxEnabled() !== "full"`, render the section at normal height (`h-auto min-h-[60vh]`, no sticky) with all five lines visible and a single `whileInView` fade on the block.
- **Done when:** in `full` mode the section pins for two viewport-heights while lines reveal with scroll and un-reveal when reversing; keyboard Page-Down passes through without trapping; in `reduced`/`off` modes the section is normal-flow; `npm run build` passes.

### T53 — Act V: footer/CTA arrival
- **Depends on:** T46
- **Files:** `components/BottomCTA.tsx`, `components/Footer.tsx`
- **Steps:** Read both files first.
  1. `BottomCTA.tsx`: wrap root in `<ScrollScene>`; wrap CTA content in `<ParallaxLayer depth="lift">`; add an overline above the existing headline: `<p className="font-mono text-sm tracking-widest uppercase" style={{ color: "var(--accent-primary)" }}>You just experienced the demo.</p>`.
  2. `Footer.tsx`: wrap the existing `EvervaultBackground` in `<ParallaxLayer depth="far" className="absolute -inset-[15%]">` inside a `<ScrollScene>` on the footer root.
- **Done when:** the CTA drifts up slightly faster than scroll on arrival, the overline renders, footer scramble parallaxes; `npm run build` passes.

### T54 — About page: spotlight scene
- **Depends on:** T46
- **Files:** `components/AboutIntro.tsx`
- **Steps:** Wrap the component root in `<ScrollScene>` and the existing `<SpotlightBackground />` in `<ParallaxLayer depth="far" className="absolute -inset-[15%] -z-10">`. Do not modify `spotlight-background.tsx` itself (its cursor-follow and mobile-static branches stay exactly as they are).
- **Done when:** the ambient spotlight field drifts subtly on scroll on the About page; mobile still gets the static gradient; `npm run build` passes.

### T55 — Parallax completion telemetry
- **Depends on:** T41, T53
- **Files:** `components/BottomCTA.tsx`
- **Steps:** In `BottomCTA`, add a `useEffect` with an `IntersectionObserver` (threshold 0.5) on the section root that calls `track("visualizer", "complete")` once, then disconnects. Guard with a `useRef<boolean>` so it can never fire twice per mount.
- **Done when:** one telemetry beacon fires when the visitor reaches the bottom CTA; `npm run build` passes.

### T56 — Degradation matrix QA pass
- **Depends on:** T47–T54
- **Files:** none (verification task; fixes go in the files named by the failing check's originating task)
- **Steps:** Verify each cell of this matrix in the browser and fix regressions in place:
  1. Desktop + motion allowed → all five acts choreograph; DevTools Performance shows no layout thrash during scroll (no purple "Layout" bursts while scrubbing).
  2. Desktop + OS reduced-motion → zero movement anywhere: no hairline, no recede, no pin (Act IV normal-flow), no chevron pulse; content all visible.
  3. Mobile emulation (medium tier: set DevTools to a mid device or temporarily force the hook) → travel distances visibly shorter; Act IV normal-flow; no horizontal overflow at 360px width.
  4. `npm run build` and `npm test` both pass.
  5. Grep check: `grep -rn "blur\|filter" components/ui/parallax-dot-field.tsx lib/parallax/` returns nothing (compositor-only rule held).
- **Done when:** all five checks pass with evidence noted in the task's commit message.

---

## Dependency graph (execution lanes)

Lanes can be executed in parallel by separate workers after T01–T02 land:

- **Lane A (theme):** T03 → T04 → T05 → T06 → T07 → T16 → T17 → T19; T14 → T15 → T18; T20
- **Lane B (leads):** T08; T09 → T10 → T11 → T12 → T13 → T40
- **Lane C (ROI):** T21 → T22 → T23 → T24 → T25/T26/T27 → T28 → T29 → T30 (T30 also needs Lane B's T13)
- **Lane D (visualizer):** T31 → T32/T33/T35 → T34 → T36 → T37/T38 → T39 (T37's CTA needs T28 mounted)
- **Lane E (hardening):** T41 → T42; T43 last.
- **Lane F (parallax):** T44 → T45 → T46 → {T47, T48, T49, T50, T51, T52, T53, T54} → T55 (needs Lane E's T41) → T56 last. Requires Lane A's T03–T05 (color tokens) only; independent of Lanes B–D.
