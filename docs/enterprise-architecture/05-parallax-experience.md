# Module 05 — The Parallax Experience System

Transforms the existing background effects — the dot-beam hero, the Evervault scramble fields, the cursor spotlight, and the static dot grid — into one scroll-choreographed depth system. Same visual identity, elevated from "animated backgrounds" to "the page itself is the experience." The homepage becomes a sequence of *acts*: each scroll region has foreground, midground, and background planes moving at different rates, with the hero receding cinematically as the visitor descends into the work.

---

## 1. STRATEGIC POSITIONING & ROI ANALYSIS

Static sections with looping backgrounds read as a template. Scroll-choreographed depth reads as engineering — the visitor *feels* state management, render discipline, and performance budgeting before reading a single word. For a personal brand selling premium systems work, the scroll experience is the first proof artifact: if the page performs a complex, 60fps, multi-plane choreography without jank on their phone, the claim "I build high-performance systems" is demonstrated, not asserted.

**Constraint carried forward (non-negotiable):** commit `f7ced4a` established that mobile Safari reloads the tab when GPU/CPU budgets are exceeded. Every directive below is compositor-only (`transform`, `opacity`) — **no scroll-linked blur, no scroll-linked filter, no layout-affecting properties, ever.** The parallax system must make the site feel heavier while actually being lighter.

**Zero new dependencies.** Framer Motion 11 (already installed) provides `useScroll`, `useTransform`, `useSpring`, and `useReducedMotion`. No GSAP, no Lenis, no scroll hijacking — native scroll position remains the single source of truth (this is also the accessibility-correct choice).

---

## 2. THE 4-LAYER APPLICATION BLUEPRINT

### State

- **Scroll state is not stored** — it is read live from Framer Motion's `useScroll({ target: sceneRef })`, which returns a `MotionValue` (`scrollYProgress`, 0→1 across the scene's viewport transit). MotionValues bypass React re-renders entirely; zero state churn per frame.
- **Depth grammar — single constants module (`lib/parallax/constants.ts`):**

```ts
export const DEPTH = {
  far:  -0.12,  // slowest — large ambient fields
  mid:  -0.28,  // texture planes (dots, scramble)
  near: -0.45,  // accent shapes closest to camera
  lift:  0.10,  // foreground content counter-drift (moves slightly faster than scroll)
} as const;
export const MOBILE_DISTANCE_SCALE = 0.4;  // mobile gets 40% of desktop travel
export const HERO_RECEDE = { scale: [1, 1.18], opacity: [1, 0], contentY: [0, -120] } as const;
```

- **Capability gate (`useParallaxEnabled()`):** returns `"full" | "reduced" | "off"` from two inputs — `useReducedMotion()` (off wins everything) and `usePerformanceTier()` (`high`/`flagship` → full, `medium` → reduced travel, `low` → off). One hook, consumed by every scene; no component makes its own judgment.

### Decision-Making

- **The act model.** The homepage is five acts, each a `ScrollScene`:

| Act | Section | Choreography |
|---|---|---|
| I | Hero | **The Recede** — as the visitor scrolls past, the beam canvas scales up 1→1.18 and fades to 0 (falling *into* the dots) while headline content lifts away faster (`contentY` 0→−120). The existing render loops are untouched — the transform is applied to a wrapper, so the GPU cost is one composited layer, not a Three.js change. |
| II | Skills bento (Evervault) | Scramble field drifts at `mid` behind cards; cards enter with scroll-linked rise + stagger (not time-based — scrub position controls them, so scrolling back replays in reverse). |
| III | Featured projects (dot grid) | Static `DotBackground` becomes a two-plane `ParallaxDotField`: coarse dots at `far`, fine dots at `mid`, plus a slow accent gradient at `near`. First true multi-plane moment. |
| IV | Brand statement (Evervault) | **The Pin** — section is `position: sticky` for 2 viewport-heights; the statement reveals word-group by word-group as scroll progress advances (opacity 0.15→1 per group). The one deliberate "stop and read" beat. |
| V | Bottom CTA / Footer (Evervault) | Scramble field parallaxes upward into view; CTA content lifts at `lift`. Closing symmetry with Act I. |

- **Scroll-linked, not time-linked, everywhere feasible:** scrubbing controls the choreography, so the visitor owns the pacing — reversing scroll reverses the show. Existing *time* loops (beam wave, scramble tick, spotlight drift) continue as ambient life underneath the scroll-driven planes; the two systems layer, they don't compete.
- **Hero splash rework:** the current hard 5-second content delay becomes a 1.8s reveal followed by a scroll cue (animated chevron, `lift`-plane). A five-figure experience never makes the buyer wait five seconds to see the headline.
- **Degradation ladder:** `full` → everything above; `reduced` → travel distances × 0.4, no sticky pin (Act IV renders as a normal section with a single fade); `off` → all MotionValues pinned to their rest values, page is fully static. The ladder is enforced inside the primitives, so section code never branches.

### Rendering

- **Primitives (`lib/parallax/scroll-scene.tsx`):**
  - `ScrollScene` — relative container owning the `useScroll` target ref; provides `scrollYProgress` via context.
  - `ParallaxLayer` — consumes context; props `{ depth: keyof typeof DEPTH; scaleRange?; opacityRange? }`; renders a `motion.div` with `willChange: "transform"` and `translate3d` only.
  - `ProgressReveal` — maps a `[start, end]` slice of scene progress to child opacity/y; used for word-group and card reveals.
- **Scroll progress hairline:** fixed 2px bar at the very top of the viewport, width driven by page `scrollYProgress`, color `var(--accent-primary)` — quiet, premium, and it re-skins under the Alignment Toggle like everything else (all colors in this module are tokens; no raw hex).
- **Visual continuity:** the existing effects are *kept as the texture of each plane* — dots, scramble glyphs, spotlight glow. Nothing is replaced; everything is placed in depth. That is the "same idea, leveled up" contract.

### Controls

- Native scroll is the only input — wheel, touch, keyboard (PageDown/space/arrows), and screen-reader navigation all keep working because nothing intercepts scroll.
- The scroll cue chevron is a real button: activating it smooth-scrolls to Act II (`scrollIntoView({ behavior: "smooth" })`, instant under reduced motion).
- Sticky pin (Act IV) must never trap keyboard scrolling — it is pure CSS `sticky`, no JS scroll lock, and it is disabled entirely below `full`.
- Telemetry: one `visualizer`-style aggregate event `("parallax","complete")` when the visitor reaches Act V (IntersectionObserver, fires once per session).

---

## 3. CONVERSION-FOCUSED COPYWRITING

- **Scroll cue label (visually hidden for AT, tooltip on hover):** "Descend into the work"
- **Act IV pinned statement (word-group reveal order):** "Most sites describe the work. / This one is the work. / Every plane you just scrolled through / is running the same discipline / I bring to your systems."
- **Act V CTA overline:** "You just experienced the demo."

---

## 4. DEVELOPER EXECUTION ROADMAP

Executable work orders live in `04-EXECUTION-TASKS.md`, Phase 5 (T44–T56): primitives first (constants, gate, ScrollScene/ParallaxLayer/ProgressReveal), then the hairline, then acts in order I→V, closing with the degradation-matrix QA pass. Lane F in the dependency graph; independent of Lanes B–D, requires Lane A's token migration (T03–T05) for color tokens only.
