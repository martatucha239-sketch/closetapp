import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
// Fase 1: gerador por regras sobre o inventário do utilizador (portado do MVP HTML).
// Fase 2: enviar o inventário ao modelo para gerar explicações e alternativas.
const NEU = ["Preto", "Branco", "Bege", "Creme", "Taupe", "Castanho", "Cinza"];
export async function POST(req: Request) {
  const { sb, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { formality = 0, palette = "destaque", season } = await req.json();
  const { data: items } = await sb.from("items").select("*");
  const ok = (i: any) => Math.abs((i.formality ?? 0) - formality) <= 1 && (!season || i.season === "Todas" || i.season === season);
  const by = (c: string) => (items ?? []).filter((i: any) => i.category === c && ok(i));
  const pick = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
  const looks: any[] = [];
  for (let k = 0; k < 20 && looks.length < 3; k++) {
    const top = pick(by("Tops")), bot = pick([...by("Saias"), ...by("Calças")]), sh = pick(by("Sapatos"));
    if (!top || !bot || !sh) continue;
    const p = [top, bot, sh], extra = pick(by("Malas")); if (extra) p.push(extra);
    const nn = p.filter((i) => !NEU.includes(i.color)).length;
    if ((palette === "neutra" && nn) || (palette === "destaque" && nn > 1)) continue;
    looks.push({ items: p });
  }
  return NextResponse.json({ looks });
}
