import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase/server";

const telemetrySchema = z.object({
  component: z.enum(["visualizer", "roi_calculator", "alignment_toggle"]),
  event: z.enum(["open", "interact", "complete"]),
  sessionHash: z.string().max(64),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = telemetrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { component, event, sessionHash } = parsed.data;

  try {
    await getServiceClient()
      .schema("telemetry")
      .from("component_events")
      .insert({
        component,
        event,
        session_hash: sessionHash,
      });
  } catch {
    // Telemetry must never surface failures to the caller.
  }

  return new NextResponse(null, { status: 204 });
}
