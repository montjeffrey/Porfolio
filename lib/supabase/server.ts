import { createClient } from "@supabase/supabase-js";

export function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server env vars missing");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
