"use client";
import { useState } from "react";
import { useItems } from "@/lib/useItems"; import { shrink } from "@/lib/supabase/client";
export default function TryOn() {
  const { items } = useItems(); const [person, setPerson] = useState(""); const [sel, setSel] = useState<string[]>([]); const [msg, setMsg] = useState(""); const [out, setOut] = useState(""); const [busy, setBusy] = useState(false);
  async function pick(f?: File) { if (!f) return; const b = await shrink(f); const r = new FileReader(); r.onload = () => setPerson(r.result as string); r.readAsDataURL(b); }
  async function go() {
    if (!person || !sel.length) return setMsg("Carrega uma foto de corpo inteiro e escolhe pelo menos uma peça."); setBusy(true); setMsg(""); setOut("");
    const r = await fetch("/api/tryon", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ person: person.split(",")[1], garments: items.filter((i) => sel.includes(i.id)).map((i) => i.url) }) });
    if (r.status === 501) setMsg("Demonstração: nenhum serviço de try-on está configurado no servidor, por isso não é gerado nenhum resultado."); else if (!r.ok) setMsg("O serviço de try-on falhou."); else setOut((await r.json()).imageUrl); setBusy(false);
  }
  return <div className="space-y-3"><h1 className="text-3xl">Virtual Try-On</h1><p className="text-xs text-mut">A fotografia só é enviada ao serviço de try-on quando carregas em Experimentar.</p>
    <input className="inp" type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />{person && <img src={person} alt="" className="w-40 rounded-xl" />}
    <div className="grid grid-cols-4 gap-2">{items.filter((i) => i.url).map((i) => <button key={i.id} onClick={() => setSel(sel.includes(i.id) ? sel.filter((x) => x !== i.id) : [...sel, i.id])} className={`aspect-square rounded-lg bg-cover bg-center border-2 ${sel.includes(i.id) ? "border-pink" : "border-transparent"}`} style={{ backgroundImage: `url(${i.url})` }} />)}</div>
    <button className="btn w-full" onClick={go} disabled={busy}>Experimentar</button>{msg && <p className="text-sm text-mut">{msg}</p>}{out && <img src={out} alt="Resultado" className="w-full rounded-xl" />}</div>;
}
