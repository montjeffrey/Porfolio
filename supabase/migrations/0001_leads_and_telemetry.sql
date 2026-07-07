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
