import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { tryOnProvider } from "@/lib/ai/provider";
export async function POST(req: Request) {
  const { user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const prov = tryOnProvider();
  if (!prov) return NextResponse.json({ error: "TRYON_NOT_CONFIGURED", demo: true }, { status: 501 });
  const { person, garments } = await req.json();
  return NextResponse.json(await prov.tryOn(person, garments));
}
