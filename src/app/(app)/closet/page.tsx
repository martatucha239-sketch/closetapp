"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser, sign, shrink } from "@/lib/supabase/client";
const CATS = ["Tops", "Casacos", "Vestidos", "Saias", "Calças", "Sapatos", "Malas", "Acessórios"];
const COLORS = ["Preto", "Branco", "Bege", "Creme", "Taupe", "Castanho", "Cinza", "Azul", "Verde", "Amarelo", "Laranja", "Vermelho", "Rosa", "Roxo", "Dourado"];
type Item = { id: string; name: string; category: string; color: string | null; brand: string | null; price: number | null; season: string | null; formality: number | null; image_path: string | null; favorite: boolean; wears: number; url?: string };
const blobB64 = (b: Blob) => new Promise<string>((r) => { const f = new FileReader(); f.onload = () => r((f.result as string).split(",")[1]); f.readAsDataURL(b); });
export default function Closet() {
  const sb = supabaseBrowser();
  const [items, setItems] = useState<Item[]>([]); const [cat, setCat] = useState(""); const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Partial<Item> | null>(null); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data } = await sb.from("items").select("*").order("created_at", { ascending: false }); const rows = (data ?? []) as Item[];
    const m = await sign(rows.map((r) => r.image_path)); setItems(rows.map((r) => ({ ...r, url: r.image_path ? m.get(r.image_path) : undefined })));
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  async function analyze() {
    if (!file) return setMsg("Escolhe primeiro uma fotografia."); setBusy(true); setMsg("A analisar…");
    const r = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ image: await blobB64(await shrink(file)), mediaType: "image/jpeg" }) });
    if (r.status === 501) setMsg("Análise por IA não configurada (falta ANTHROPIC_API_KEY). Preenche à mão.");
    else if (!r.ok) setMsg("Não foi possível analisar. Preenche à mão.");
    else { const a = await r.json(); setEdit((e) => ({ ...e, name: a.name, category: CATS.includes(a.category) ? a.category : e?.category, color: a.color, season: a.season, formality: a.formality })); setMsg("Sugestão da IA preenchida. Confirma os campos."); }
    setBusy(false);
  }
  async function save() {
    if (!edit?.name) return setMsg("Indica o nome."); setBusy(true);
    const { data: { user } } = await sb.auth.getUser(); let image_path = edit.image_path ?? null;
    if (file) { const p = `${user!.id}/${crypto.randomUUID()}.jpg`; const { error } = await sb.storage.from("closet").upload(p, await shrink(file), { contentType: "image/jpeg" }); if (error) { setMsg(error.message); setBusy(false); return; } if (image_path) await sb.storage.from("closet").remove([image_path]); image_path = p; }
    const row = { name: edit.name, category: edit.category ?? "Tops", color: edit.color ?? null, brand: edit.brand ?? null, price: edit.price ?? null, season: edit.season ?? "Todas", formality: edit.formality ?? 0, image_path };
    const { error } = edit.id ? await sb.from("items").update(row).eq("id", edit.id) : await sb.from("items").insert(row);
    setBusy(false); if (error) return setMsg(error.message); setEdit(null); setFile(null); setMsg(""); load();
  }
  async function del(i: Item) { if (!confirm("Apagar esta peça?")) return; if (i.image_path) await sb.storage.from("closet").remove([i.image_path]); await sb.from("items").delete().eq("id", i.id); load(); }
  async function fav(i: Item) { await sb.from("items").update({ favorite: !i.favorite }).eq("id", i.id); load(); }
  async function wore(i: Item) { await sb.from("items").update({ wears: i.wears + 1 }).eq("id", i.id); load(); }
  const shown = items.filter((i) => (!cat || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase()));
  return <div>
    <div className="flex gap-2 mb-3"><input className="inp" placeholder="Pesquisar" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn whitespace-nowrap" onClick={() => { setEdit({ category: "Tops", color: "Preto", season: "Todas", formality: 0 }); setFile(null); setMsg(""); }}>+ Peça</button></div>
    <div className="flex gap-2 overflow-x-auto pb-3">{["", ...CATS].map((c) => <button key={c} onClick={() => setCat(c)} className={`btn-g whitespace-nowrap ${cat === c ? "!bg-choc !text-cream" : ""}`}>{c || "Tudo"}</button>)}</div>
    {!shown.length && <p className="text-mut text-center mt-16">{items.length ? "Sem resultados." : "O teu closet está vazio. Adiciona a primeira peça."}</p>}
    <div className="grid grid-cols-2 gap-3">{shown.map((i) => <div key={i.id} className="card">
      <div className="aspect-[3/4] rounded-xl bg-line bg-cover bg-center mb-2 relative" style={i.url ? { backgroundImage: `url(${i.url})` } : undefined}><button className="absolute top-2 right-2 text-xl" onClick={() => fav(i)}>{i.favorite ? "♥" : "♡"}</button></div>
      <b className="text-sm block truncate">{i.name}</b><span className="text-xs text-mut">{i.category} · {i.color} · {i.wears}x</span>
      <div className="flex gap-1 mt-2"><button className="btn-g !px-2 !py-1 text-xs" onClick={() => wore(i)}>Usei</button><button className="btn-g !px-2 !py-1 text-xs" onClick={() => { setEdit(i); setFile(null); setMsg(""); }}>Editar</button><button className="btn-g !px-2 !py-1 text-xs" onClick={() => del(i)}>✕</button></div></div>)}</div>
    {edit && <div className="fixed inset-0 bg-ink/40 z-10 flex items-end" onClick={() => setEdit(null)}><div className="bg-cream w-full max-w-2xl mx-auto rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto space-y-2" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2xl">{edit.id ? "Editar peça" : "Nova peça"}</h2>
      <input className="inp" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="btn-g w-full" onClick={analyze} disabled={busy}>Analisar com IA</button>
      <input className="inp" placeholder="Nome" value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2"><select className="inp" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="inp" value={edit.color ?? ""} onChange={(e) => setEdit({ ...edit, color: e.target.value })}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select>
        <input className="inp" placeholder="Marca" value={edit.brand ?? ""} onChange={(e) => setEdit({ ...edit, brand: e.target.value })} />
        <input className="inp" type="number" placeholder="Preço €" value={edit.price ?? ""} onChange={(e) => setEdit({ ...edit, price: e.target.value ? +e.target.value : null })} />
        <select className="inp" value={edit.season ?? "Todas"} onChange={(e) => setEdit({ ...edit, season: e.target.value })}>{["Todas", "Primavera", "Verão", "Outono", "Inverno"].map((c) => <option key={c}>{c}</option>)}</select>
        <select className="inp" value={edit.formality ?? 0} onChange={(e) => setEdit({ ...edit, formality: +e.target.value })}><option value={0}>Casual</option><option value={1}>Smart</option><option value={2}>Formal</option></select></div>
      {msg && <p className="text-sm text-mut">{msg}</p>}
      <div className="flex gap-2"><button className="btn flex-1" onClick={save} disabled={busy}>Guardar</button><button className="btn-g" onClick={() => setEdit(null)}>Cancelar</button></div></div></div>}
  </div>;
}
