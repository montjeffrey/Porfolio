# Module 01 — System Link / Blueprint Visualizer

Node-based data-flow map that renders a real enterprise automation (technician workflow → CRM → admin dashboard) as an inspectable, animated system diagram.

---

## 1. STRATEGIC POSITIONING & ROI ANALYSIS

Buyers of $10k+ automation contracts are operations leaders who think in flows, not features. A static architecture PNG says "I can draw"; an interactive visualizer with live-pulsing edges, inspectable nodes, and real throughput annotations says "I can build the thing you are imagining right now." It also doubles as a reusable engagement artifact: every future client project ships with its own visualizer instance, making this component directly billable.

---

## 2. THE 4-LAYER APPLICATION BLUEPRINT

### State

Graph definitions are static, versioned JSON — no runtime fetch required (the "real-time" pulse is simulated deterministically client-side; a Supabase Realtime channel can replace the simulator for live client deployments without schema change).

```json
{
  "$schema": "./blueprint-graph.schema.json",
  "id": "field-service-crm",
  "title": "Field Service Automation Fabric",
  "nodes": [
    {
      "id": "tech-mobile",
      "kind": "source",
      "label": "Technician Mobile Intake",
      "metrics": { "throughput": "~40 jobs/day", "latency": "instant" },
      "detail": "Structured job-completion capture replacing paper tickets.",
      "position": { "col": 1, "row": 2 }
    },
    {
      "id": "ingest-api",
      "kind": "process",
      "label": "Ingestion API",
      "metrics": { "validation": "schema-enforced", "dedupe": "idempotency keys" },
      "position": { "col": 2, "row": 2 }
    },
    {
      "id": "crm-core",
      "kind": "store",
      "label": "CRM Fabric (Postgres)",
      "metrics": { "sync": "real-time", "isolation": "row-level security" },
      "position": { "col": 3, "row": 2 }
    },
    {
      "id": "routing-engine",
      "kind": "decision",
      "label": "Routing & Escalation Engine",
      "position": { "col": 4, "row": 1 }
    },
    {
      "id": "admin-dash",
      "kind": "sink",
      "label": "Admin Tracking Dashboard",
      "metrics": { "refresh": "live", "double_entry_eliminated": "100%" },
      "position": { "col": 4, "row": 3 }
    }
  ],
  "edges": [
    { "from": "tech-mobile", "to": "ingest-api", "label": "job payload", "pulse": "steady" },
    { "from": "ingest-api", "to": "crm-core", "label": "validated write", "pulse": "steady" },
    { "from": "crm-core", "to": "routing-engine", "label": "change feed", "pulse": "burst" },
    { "from": "crm-core", "to": "admin-dash", "label": "realtime sync", "pulse": "steady" },
    { "from": "routing-engine", "to": "admin-dash", "label": "escalations", "pulse": "rare" }
  ]
}
```

**JSON Schema (`blueprint-graph.schema.json`) hard constraints:** `nodes[].id` unique; `edges[].from/to` must reference existing node ids (validated at build time by a CI script, not at runtime); `kind ∈ {source, process, store, decision, sink}`; `position.col ∈ 1..6`, `row ∈ 1..4`.

**Reactive state (Zustand `useVisualizerStore`):**
`{ selectedNodeId: string | null, viewport: {x, y, zoom}, isSimulating: boolean, reducedMotion: boolean }`

### Decision-Making

- **Layout algorithm:** deterministic grid placement from `position` (no force simulation — force layouts jitter and read as unserious). Edge paths are cubic béziers computed from node anchor points; label placed at t=0.5.
- **Pulse simulator:** a single rAF loop advances dot positions along edge paths; `pulse` kind maps to emission interval (`steady`=1.2s, `burst`=3 dots every 4s, `rare`=8s). The loop is owned by the store, not by components — one clock, N subscribers.
- **Performance gate:** `use-performance-tier` low tier ⇒ simulator disabled, edges render with static dash animation via CSS only; mobile gets pinch-zoom disabled and a fit-to-width static render.
- **Node inspection:** selecting a node computes its upstream/downstream closure (BFS over edges) and dims everything outside it — the "blast radius" view that operations buyers instantly understand.

### Rendering

- Full-bleed bento cell (span 12) on the home page; standalone `/systems` route for deep exploration.
- SVG canvas (not Three.js — crisp at any zoom, printable, accessible). Glass panel inspector docks right on desktop, bottom-sheet on mobile.
- Node visual grammar: `kind` → icon + accent token (`source`=--accent-info, `decision`=--accent-primary, `store`=--accent-data, `sink`=--accent-success). All colors are alignment tokens (doc 03) — the visualizer re-skins instantly on toggle.
- Grid dots background (existing `dot-background.tsx` reused) at 40% opacity beneath the canvas.

### Controls

- **Pointer:** drag = pan, wheel/pinch = zoom (clamped 0.5–2.0), click node = inspect, click canvas = deselect, Esc = deselect.
- **Keyboard:** Tab cycles nodes in reading order, Enter inspects, arrow keys pan.
- **Inspector actions:** "View the case study" (deep-link to the matching project page) and "Model your version →" (routes to the ROI calculator with `?pipeline=field-service-crm`, pre-seeding its inputs — the two modules form a conversion funnel).
- Telemetry: `open`, `node_inspect`, `handoff_to_roi` events (aggregate-only, per platform posture).

---

## 3. CONVERSION-FOCUSED COPYWRITING

- **Section eyebrow:** "LIVE SYSTEM MAP"
- **Headline:** "This is what your operation looks like when nothing is typed twice."
- **Inspector CTA:** "Model your version →"
- **Empty/idle hint:** "Select any node. Everything is inspectable — that's the point."

---

## 4. DEVELOPER EXECUTION ROADMAP

1. Author `blueprint-graph.schema.json` + the `field-service-crm` graph; add CI validation script (`npm run validate:graphs`).
2. Build `useVisualizerStore` (viewport, selection, one rAF clock with subscriber registry).
3. Implement `<BlueprintCanvas>` (SVG, grid layout mapper, bézier edge generator) as a client component; render container is a server component.
4. Implement `<NodeGlyph>` and `<EdgePath>` with token-driven styling; verify re-skin under all alignments.
5. Add pulse simulator with performance-tier gate; verify 60fps desktop / static mobile.
6. Build inspector panel (closure BFS, dim/highlight pass, CTA deep-links).
7. Wire keyboard controls + ARIA; axe-core pass.
8. Embed on home (bento span-12) + `/systems` route; attach telemetry events.
