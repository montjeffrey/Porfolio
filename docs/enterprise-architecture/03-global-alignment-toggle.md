# Module 03 — Global Alignment Toggle

An advanced state-management showcase: one control that re-themes the entire application — visually *and* contextually — in real time. It is also the platform prerequisite: it forces the design-token migration every other module depends on.

---

## 1. STRATEGIC POSITIONING & ROI ANALYSIS

Enterprise buyers evaluating a custom platform quietly ask: "can this person build systems where a single decision propagates everywhere, instantly, without breakage?" The Alignment Toggle answers it theatrically — flip one control and every surface, accent, chart color, and even the copy register changes in under a frame. It is white-label theming, multi-brand tenancy, and centralized state governance demonstrated in one gesture. It is also the cheapest module to build and unblocks docs 01–02, hence Phase 1.

---

## 2. THE 4-LAYER APPLICATION BLUEPRINT

### State

**Alignment definitions — static, schema-validated JSON (`lib/alignment/alignments.json`):**

```json
{
  "$schema": "./alignment.schema.json",
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

**Contextual copy registry (`lib/alignment/voice.ts`):** keyed strings with per-voice variants — `voice.hero.headline.operator | .boardroom | .studio`. Components request copy through `useVoice(key)`; missing variant falls back to `operator`. This is the "contextual" half of the toggle: the theme changes what the site *says*, not just how it looks.

**Reactive state (`useAlignmentStore`, Zustand + `persist` to `localStorage['mj.alignment']`):**
`{ alignment: 'ember' | 'meridian' | 'atelier', setAlignment(id), hydrated: boolean }`

**Schema constraints:** every alignment MUST define the identical token key set (CI script diffs key sets — a missing token in any alignment fails the build). Contrast pairs (`--text-primary` on `--surface-0/1`) must pass WCAG AA ≥ 4.5:1, checked by the same CI script.

### Decision-Making

- **Application mechanism:** `setAlignment(id)` writes `data-alignment="<id>"` on `<html>`. All tokens live in `globals.css` under `:root[data-alignment="ember"] { ... }` blocks generated at build time from `alignments.json` (small codegen script — JSON stays the single source of truth). No component re-renders are required for color changes; only voice-consuming components re-render.
- **FOUC elimination:** a 3-line inline script in `app/layout.tsx` `<head>` reads `localStorage` and stamps `data-alignment` before first paint (same pattern as classic dark-mode bootstrapping). Store hydrates after mount and reconciles.
- **Transition choreography:** on switch, a `::view-transition`-based cross-fade (View Transitions API, feature-detected; fallback = 200ms CSS transition on `background-color`/`color`). Continuous canvases (Three.js beam, visualizer) read tokens via `getComputedStyle` once per switch through a store subscription — not per frame.
- **Governance rule (enforced in review):** components may consume only tokens and voice keys. Any raw hex or hard-coded string in a themed surface is a lint error (`eslint` rule: no hex literals in `components/**`).

### Rendering

- **The control:** a glass segmented radiogroup, fixed in the navbar — three labeled segments with a live 8px swatch dot of each alignment's `--accent-primary`. Active segment gets a sliding indicator (Framer Motion `layoutId`).
- Everything else on the site *is* the rendering layer of this module — that's the demonstration. A small caption under the toggle on first visit: pulses once, then never again (dismissal persisted).
- `tailwind.config.ts` migrates: `primary: "var(--accent-primary)"` etc. Existing class names (`bg-primary`, `text-secondary`) keep working — the migration is config-level, not a component sweep.

### Controls

- Radiogroup semantics: `role="radiogroup"` + `role="radio"` segments, arrow-key navigation, `aria-checked`, visible focus ring in `--accent-primary`.
- Switch is instant on activation (no confirm) and idempotent; rapid cycling is safe because application is a single attribute write.
- `prefers-reduced-motion` ⇒ transition choreography skipped, attribute still swaps.
- Telemetry: single `alignment_set` event with the chosen id (aggregate-only).

---

## 3. CONVERSION-FOCUSED COPYWRITING

- **First-visit caption:** "One control. Every pixel and every sentence realigns. This is what centralized state looks like."
- **Voice samples (hero headline key):**
  - *operator (Ember):* "I build the systems your spreadsheets are pretending to be."
  - *boardroom (Meridian):* "Operational software that returns hours to the P&L."
  - *studio (Atelier):* "Precision-built platforms, finished like products."

---

## 4. DEVELOPER EXECUTION ROADMAP

1. Author `alignments.json` + `alignment.schema.json`; write codegen (`npm run build:tokens` → CSS blocks) and CI validator (key-set parity + AA contrast).
2. Migrate `tailwind.config.ts` and `globals.css` to token references; visual-regression check that Ember is pixel-identical to the current theme (zero-risk migration gate).
3. Implement `useAlignmentStore` + inline pre-paint bootstrap script; verify no FOUC on hard reload of every route.
4. Build the navbar segmented control with full radiogroup semantics.
5. Implement voice registry + `useVoice`; migrate hero/CTA/section copy to keys.
6. Add View Transitions cross-fade with feature-detect fallback; wire canvas token re-read subscription.
7. Add the no-raw-hex lint rule; sweep violations.
8. Ship as Phase 1; docs 01–02 build on the resulting token system.
