import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { stylistAI } from "@/lib/ai/provider";
const Body = z.object({ image: z.string().max(7_000_000), mediaType: z.enum(["image/jpeg", "image/png", "image/webp"]) });
export async function POST(req: Request) {
  const { user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = Body.safeParse(await req.json());
  if (!p.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  try { return NextResponse.json(await stylistAI.analyzeImage(p.data.image, p.data.mediaType)); }
  catch (e: any) { const nc = e.message === "AI_NOT_CONFIGURED"; return NextResponse.json({ error: e.message }, { status: nc ? 501 : 502 }); }
}
