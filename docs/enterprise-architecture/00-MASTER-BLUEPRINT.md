# Montjeffrey.dev — Enterprise Platform Master Blueprint

**Version:** 1.0 · **Status:** Approved for execution · **Branch:** `claude/montjeffrey-enterprise-arch-swd01j`

This document set directs the total architectural overhaul of Montjeffrey.dev from an animated portfolio into a premium digital ecosystem demonstrating complex business automation, custom CRM fabrics, and high-performance data pipelines.

---

## 1. STRATEGIC POSITIONING & ROI ANALYSIS

**Thesis:** A $10,000+ engagement is never sold by a gallery of screenshots. It is sold by letting the buyer *operate* a working slice of the system they are buying. The overhaul converts every marketing surface into a functioning proof-of-capability:

| Current State (audit findings) | Target State |
|---|---|
| Contact form **simulates** success — no persistence layer exists (`app/contact/page.tsx` fakes a 1s delay) | Real Supabase-backed lead-capture pipeline with server-side validation, rate limiting, and an automated lead-scoring decision layer |
| Static case-study pages describe automation | **System Blueprint Visualizer** — live node-based data-flow map the prospect can inspect |
| Value claims are prose ("saved hours") | **Dynamic ROI Impact Calculator** — prospect enters *their* bottleneck numbers, receives *their* annual net-savings figure |
| Theme is four hard-coded hex values in `tailwind.config.ts` — no token system | **Global Alignment Toggle** — full design-token architecture demonstrated as a live state-management showcase |

**Why this commands the premium tier:** each module is the same engineering discipline (state isolation, decision layers, real-time sync, token-governed rendering) that a custom CRM or automation contract requires. The site becomes the first deliverable of every engagement — a working reference implementation the client has already used.

---

## 2. THE 4-LAYER PLATFORM BLUEPRINT

Every module in this document set conforms to the four-layer mandate. Platform-wide definitions live here; module briefs (docs 01–03) only add their deltas.

### 2.1 State Layer (platform)

**Persistence: Supabase PostgreSQL.** Three schemas, strictly isolated by Row Level Security so public-facing reads can never touch lead data (multi-tenant-grade isolation applied to a single-tenant site — this *is* the demonstration):

```sql
-- Schema: leads (write-only from the public internet)
CREATE TABLE leads.messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email         TEXT NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company       TEXT,
  project_type  TEXT,
  message       TEXT NOT NULL CHECK (char_length(message) <= 4000),
  preferred_contact TEXT,
  roi_snapshot  JSONB,            -- calculator state at submit time (doc 02)
  lead_score    SMALLINT,          -- computed server-side (decision layer)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schema: telemetry (anonymous, aggregate-only)
CREATE TABLE telemetry.component_events (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  component     TEXT NOT NULL,     -- 'visualizer' | 'roi_calculator' | 'alignment_toggle'
  event         TEXT NOT NULL,     -- 'open' | 'interact' | 'complete'
  session_hash  TEXT NOT NULL,     -- salted hash; no PII, no raw IP retained
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS posture (zero-trust default-deny):**
- `leads.messages`: `INSERT` only for `anon` role via a security-definer RPC (`submit_lead`) that enforces validation + rate limit; **no** `SELECT/UPDATE/DELETE` for `anon` or `authenticated`. Reads happen only through the service-role key on the server.
- `telemetry.component_events`: `INSERT` only, via RPC with the same posture.
- All keys: publishable (anon) key in the client, service-role key **only** in server route handlers — never bundled.

**Client reactive state:** one Zustand store per module (no global god-store), plus a platform `useAlignmentStore` (doc 03) that every module subscribes to. Server data flows through Next.js Route Handlers — components never import the Supabase service client.

### 2.2 Decision-Making Layer (platform)

- **API surface (Next.js App Router route handlers):**

| Route | Method | Responsibility |
|---|---|---|
| `/api/leads` | POST | Validate (zod) → rate-limit (per-session token bucket) → `submit_lead` RPC → lead-score computation → optional notification webhook |
| `/api/roi/report` | POST | Accept calculator state, render server-computed PDF/JSON summary, attach to lead |
| `/api/telemetry` | POST | Fire-and-forget aggregate event ingestion |

- **Lead scoring algorithm (runs server-side at submit):** `score = f(project_type weight, message length/specificity, ROI snapshot magnitude, company present)`. Stored on the row; ≥ threshold triggers a priority notification. This is the miniature of the "automated administrative routing" sold to clients.
- **Validation is duplicated by design:** zod schema on the server is the source of truth; the client mirrors it for UX only. The server never trusts client state.

### 2.3 Rendering Layer (platform) — "Albion Modernism"

- **Token system replaces hard-coded hexes.** All color/radius/blur/elevation values become CSS custom properties on `:root[data-alignment="..."]` (full spec in doc 03). Tailwind config references `var(--token)` — zero component rewrites needed after migration.
- **Aesthetic constants:** high-contrast dark base (`--surface-0: #0D0D0D` in the default alignment), glassmorphic panels (`backdrop-blur` + 1px `--stroke-glass` border + 4–6% white fill), bento-grid modularity (12-col CSS grid, cards span {3,4,6,8,12}, 24px gutter, strict — no free-floating sections).
- **Typography hierarchy:** display serif for statement headlines, `ui-sans` for body, mono strictly for data readouts (calculator outputs, node metrics).
- **Motion budget:** Framer Motion enter/exit only; continuous animation gated by the existing `use-performance-tier` hook (preserve the mobile GPU-load fix from commit `f7ced4a`).

### 2.4 Controls Layer (platform)

- Every interactive module is keyboard-operable and exposes ARIA state (the toggle is a `role="radiogroup"`, sliders are native `input[type=range]` styled, nodes are focusable buttons).
- All inputs constrained at the control level (min/max/step on sliders, maxLength on text) *and* re-validated at the decision layer.
- Interaction events emit to `/api/telemetry` through a debounced (500ms) queue — never blocking the UI thread.

---

## 3. CONVERSION-FOCUSED COPYWRITING (platform spine)

- **Hero:** "I build the systems your spreadsheets are pretending to be."
- **Sub:** "Custom CRM fabrics, automation pipelines, and operational dashboards — engineered, not assembled."
- **Section bridge into modules:** "Don't take the case studies' word for it. Operate the machinery yourself."
- **Bottom CTA:** "Bring me the bottleneck. I'll bring back the hours."

---

## 4. DEVELOPER EXECUTION ROADMAP (program-level)

| Phase | Scope | Exit criteria |
|---|---|---|
| **P0 — Foundations** | Token migration (doc 03 §State), Supabase project + schemas + RLS + `submit_lead` RPC, wire `/api/leads`, delete the simulated-success stub | Contact form persists; RLS verified default-deny; visual regression pass on token swap |
| **P1 — Global Alignment Toggle** | Doc 03 full build | Theme switches < 16ms, persisted, no FOUC |
| **P2 — ROI Impact Calculator** | Doc 02 full build | Deterministic outputs, snapshot attaches to lead |
| **P3 — Blueprint Visualizer** | Doc 01 full build | 60fps pan/zoom desktop, static-render fallback mobile |
| **P4 — Hardening** | Rate limits, telemetry aggregation dashboard, Lighthouse ≥ 95 all categories | CI green; budgets enforced |

Module briefs: [01 — System Blueprint Visualizer](./01-system-blueprint-visualizer.md) · [02 — Dynamic ROI Impact Calculator](./02-roi-impact-calculator.md) · [03 — Global Alignment Toggle](./03-global-alignment-toggle.md)
