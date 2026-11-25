"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser, sign } from "@/lib/supabase/client";
type It = { id: string; name: string; image_path: string | null; url?: string };
const Row = ({ items }: { items: It[] }) => <div className="flex gap-2 overflow-x-auto">{items.map((i) => <div key={i.id} className="w-20 shrink-0 text-center"><div className="aspect-square rounded-xl bg-line bg-cover bg-center" style={i.url ? { backgroundImage: `url(${i.url})` } : undefined} /><span className="text-[11px] text-mut block truncate">{i.name}</span></div>)}</div>;
export default function Outfits() {
  const sb = supabaseBrowser(); const [formality, setF] = useState(0); const [palette, setP] = useState("destaque"); const [gen, setGen] = useState<It[][]>([]); const [saved, setSaved] = useState<{ id: string; occasion: string; items: It[] }[]>([]); const [msg, setMsg] = useState("");
  async function loadSaved() {
    const { data } = await sb.from("looks").select("id,occasion,look_items(items(id,name,image_path))").order("created_at", { ascending: false }); const rows = (data ?? []) as any[];
    const m = await sign(rows.flatMap((l) => l.look_items.map((x: any) => x.items?.image_path)));
    setSaved(rows.map((l) => ({ id: l.id, occasion: l.occasion, items: l.look_items.map((x: any) => x.items).filter(Boolean).map((i: any) => ({ ...i, url: m.get(i.image_path) })) })));
  }
  useEffect(() => { loadSaved(); }, []);
  async function generate() {
    setMsg("A criar…"); const r = await fetch("/api/outfits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formality, palette }) });
    const { looks } = await r.json(); const m = await sign(looks.flatMap((l: any) => l.items.map((i: any) => i.image_path)));
    setGen(looks.map((l: any) => l.items.map((i: any) => ({ ...i, url: m.get(i.image_path) })))); setMsg(looks.length ? "" : "Faltam peças para esta combinação (precisas de top, calça/saia e sapatos).");
  }
  async function save(l: It[]) {
    const { data } = await sb.from("looks").insert({ occasion: ["Casual", "Smart", "Formal"][formality] }).select("id").single();
    if (data) await sb.from("look_items").insert(l.map((i) => ({ look_id: data.id, item_id: i.id }))); loadSaved();
  }
  return <div className="space-y-3">
    <p className="text-xs text-mut">Looks criados com as peças que já tens, por regras de formalidade e cor. Para sugestões em conversa, usa o Stylist.</p>
    <div className="grid grid-cols-2 gap-2"><select className="inp" value={formality} onChange={(e) => setF(+e.target.value)}><option value={0}>Casual</option><option value={1}>Smart</option><option value={2}>Formal</option></select>
      <select className="inp" value={palette} onChange={(e) => setP(e.target.value)}><option value="destaque">Base neutra + 1 cor</option><option value="livre">Colorido</option><option value="neutra">Só neutros</option></select></div>
    <button className="btn w-full" onClick={generate}>Criar looks</button>{msg && <p className="text-sm text-mut">{msg}</p>}
    {gen.map((l, k) => <div key={k} className="card space-y-2"><Row items={l} /><div className="flex gap-2"><button className="btn !py-1.5" onClick={() => save(l)}>Guardar</button><button className="btn-g" onClick={generate}>Outra combinação</button></div></div>)}
    <h2 className="text-2xl pt-4">Guardados</h2>{!saved.length && <p className="text-mut text-sm">Ainda sem looks.</p>}
    {saved.map((l) => <div key={l.id} className="card space-y-2"><b className="text-sm">{l.occasion}</b><Row items={l.items} /><button className="btn-g !py-1 text-xs" onClick={async () => { await sb.from("looks").delete().eq("id", l.id); loadSaved(); }}>Apagar</button></div>)}
  </div>;
}
