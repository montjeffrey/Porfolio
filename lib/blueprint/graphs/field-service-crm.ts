import type { BlueprintGraph } from "../types";

export const fieldServiceCrm: BlueprintGraph = {
  id: "field-service-crm",
  title: "Field Service Automation Fabric",
  nodes: [
    {
      id: "tech-mobile",
      kind: "source",
      label: "Technician Mobile Intake",
      metrics: { throughput: "~40 jobs/day", latency: "instant" },
      detail: "Structured job-completion capture replacing paper tickets.",
      position: { col: 1, row: 2 },
    },
    {
      id: "ingest-api",
      kind: "process",
      label: "Ingestion API",
      metrics: { validation: "schema-enforced", dedupe: "idempotency keys" },
      position: { col: 2, row: 2 },
    },
    {
      id: "crm-core",
      kind: "store",
      label: "CRM Fabric (Postgres)",
      metrics: { sync: "real-time", isolation: "row-level security" },
      position: { col: 3, row: 2 },
    },
    {
      id: "routing-engine",
      kind: "decision",
      label: "Routing & Escalation Engine",
      position: { col: 4, row: 1 },
    },
    {
      id: "admin-dash",
      kind: "sink",
      label: "Admin Tracking Dashboard",
      metrics: { refresh: "live", double_entry_eliminated: "100%" },
      position: { col: 4, row: 3 },
    },
  ],
  edges: [
    { from: "tech-mobile", to: "ingest-api", label: "job payload", pulse: "steady" },
    { from: "ingest-api", to: "crm-core", label: "validated write", pulse: "steady" },
    { from: "crm-core", to: "routing-engine", label: "change feed", pulse: "burst" },
    { from: "crm-core", to: "admin-dash", label: "realtime sync", pulse: "steady" },
    { from: "routing-engine", to: "admin-dash", label: "escalations", pulse: "rare" },
  ],
};
