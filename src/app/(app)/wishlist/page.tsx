"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useItems, NEU } from "@/lib/useItems";
const LISTS = ["Must Have", "Next Purchases", "Dream Pieces", "On Sale", "Investment Pieces"];
const CATS = ["Tops", "Casacos", "Vestidos", "Saias", "Calças", "Sapatos", "Malas", "Acessórios"];
const COLORS = ["Preto", "Branco", "Bege", "Creme", "Taupe", "Castanho", "Cinza", "Azul", "Verde", "Amarelo", "Laranja", "Vermelho", "Rosa", "Roxo", "Dourado"];
type W = { id: string; name: string; brand: string | null; price: number | null; category: string | null; color: string | null; link: string | null; list: string | null; note: string | null };
export default function Wish() {
  const sb = supabaseBrowser(); const { items } = useItems(); const [w, setW] = useState<W[]>([]); const [f, setF] = useState<Partial<W> | null>(null); const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const { data } = await sb.from("wishlist").select("*").order("created_at", { ascending: false }); setW((data ?? []) as W[]); }, [sb]);
  useEffect(() => { load(); }, [load]);
  const evalW = (x: W) => { const sim = items.filter((i) => i.category === x.category && i.color === x.color).length; const base = items.filter((i) => i.category !== x.category && NEU.includes(i.color ?? "")).length;
    return sim ? `Já tens ${sim} peça(s) semelhante(s): provável compra impulsiva.` : NEU.includes(x.color ?? "") ? `Cor neutra, combina com ~${base} peças do teu closet: compra estratégica.` : "Cor de destaque: combina com menos peças, confirma se encaixa no teu estilo."; };
  async function save() { if (!f?.name) return setMsg("Indica o nome."); const { error } = await sb.from("wishlist").insert({ name: f.name, brand: f.brand ?? null, price: f.price ?? null, category: f.category ?? "Tops", color: f.color ?? "Preto", link: f.link ?? null, list: f.list ?? "Next Purchases", note: f.note ?? null }); if (error) return setMsg(error.message); setF(null); setMsg(""); load(); }
  return <div className="space-y-3"><div className="flex justify-between items-center"><h1 className="text-3xl">Wishlist</h1><button className="btn" onClick={() => { setF({ list: "Next Purchases", category: "Tops", color: "Preto" }); setMsg(""); }}>+ Adicionar</button></div>
    {!w.length && <p className="text-mut text-center mt-10">Lista vazia.</p>}
    {LISTS.map((l) => { const x = w.filter((i) => i.list === l); return x.length ? <div key={l} className="space-y-2"><h2 className="text-xl pt-2">{l}</h2>{x.map((i) => <div key={i.id} className="card"><b>{i.name}</b> <span className="text-sm text-mut">{i.brand} {i.price ? `· ${i.price} €` : ""}</span><p className="text-sm text-mut mt-1">{evalW(i)}</p>{i.note && <p className="text-sm">{i.note}</p>}
      <div className="flex gap-3 mt-2 text-sm">{i.link && /^https?:\/\//.test(i.link) && <a className="underline" href={i.link} target="_blank" rel="noopener noreferrer">Ver produto</a>}<button className="text-mut" onClick={async () => { await sb.from("wishlist").delete().eq("id", i.id); load(); }}>Remover</button></div></div>)}</div> : null; })}
    {f && <div className="fixed inset-0 bg-ink/40 z-10 flex items-end" onClick={() => setF(null)}><div className="bg-cream w-full max-w-2xl mx-auto rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto space-y-2" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2xl">Nova peça desejada</h2><input className="inp" placeholder="Nome" onChange={(e) => setF({ ...f, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2"><input className="inp" placeholder="Marca" onChange={(e) => setF({ ...f, brand: e.target.value })} /><input className="inp" type="number" placeholder="Preço €" onChange={(e) => setF({ ...f, price: +e.target.value })} />
        <select className="inp" onChange={(e) => setF({ ...f, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select><select className="inp" onChange={(e) => setF({ ...f, color: e.target.value })}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select></div>
      <select className="inp" value={f.list || ""} onChange={(e) => setF({ ...f, list: e.target.value })}>{LISTS.map((c) => <option key={c}>{c}</option>)}</select>
      <input className="inp" placeholder="Link do produto" onChange={(e) => setF({ ...f, link: e.target.value })} /><input className="inp" placeholder="Notas" onChange={(e) => setF({ ...f, note: e.target.value })} />
      {msg && <p className="text-sm text-mut">{msg}</p>}<div className="flex gap-2"><button className="btn flex-1" onClick={save}>Guardar</button><button className="btn-g" onClick={() => setF(null)}>Cancelar</button></div></div></div>}</div>;
}
