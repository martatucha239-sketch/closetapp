import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { stylistChat } from "@/lib/ai/provider";
const Body = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) })).min(1).max(20) });
export async function POST(req: Request) {
  const { sb, user } = await requireUser(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = Body.safeParse(await req.json()); if (!p.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const { data } = await sb.from("items").select("name,category,color,season,formality").limit(200);
  const inv = (data ?? []).map((i: any) => `- ${i.name} (${i.category}, ${i.color}, ${i.season}, formalidade ${i.formality})`).join("\n") || "(guarda-roupa vazio)";
  const system = `És a personal stylist da Sofia’s Closet. Responde em português de Portugal, de forma calorosa e concisa. Usa SEMPRE as peças do inventário abaixo, citando-as pelo nome; só sugere compras se pedirem ou se faltar mesmo algo essencial. Não inventes peças que não estão na lista.\n\nINVENTÁRIO:\n${inv}`;
  try { return NextResponse.json({ reply: await stylistChat(system, p.data.messages) }); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: e.message === "AI_NOT_CONFIGURED" ? 501 : 502 }); }
}
