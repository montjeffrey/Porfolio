import { NextResponse } from "next/server";
import { computeRoi } from "@/lib/roi/model";
import { roiInputsSchema } from "@/lib/roi/schema";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = roiInputsSchema.safeParse(
    typeof body === "object" && body !== null ? (body as Record<string, unknown>).inputs : undefined
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const inputs = parsed.data;
  const outputs = computeRoi(inputs);

  return NextResponse.json(
    { version: 1, inputs, outputs, computedAt: "server" },
    { status: 200 }
  );
}
