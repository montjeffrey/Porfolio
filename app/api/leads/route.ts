import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads/schema";
import { scoreLead } from "@/lib/leads/score";
import { getServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/leads/rate-limit";

export async function POST(req: Request) {
  const key = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(key)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const lead = parsed.data;
  const leadScore = scoreLead(lead);

  try {
    const { error } = await getServiceClient()
      .schema("leads")
      .from("messages")
      .insert({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        project_type: lead.projectType,
        message: lead.message,
        preferred_contact: lead.preferredContact,
        roi_snapshot: lead.roiSnapshot,
        lead_score: leadScore,
      });

    if (error) {
      console.error("leads_insert_failed");
      return NextResponse.json({ error: "storage" }, { status: 502 });
    }
  } catch {
    console.error("leads_insert_failed");
    return NextResponse.json({ error: "storage" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
