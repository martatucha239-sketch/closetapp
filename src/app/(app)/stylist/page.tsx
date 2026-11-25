"use client";
import { useRef, useEffect, useState } from "react";
type M = { role: "user" | "assistant"; content: string };
const SUG = ["O que devo vestir amanhã?", "Cria cinco looks com o meu blazer", "Tenho um jantar hoje", "Que peças me faltam?"];
export default function Stylist() {
  const [m, setM] = useState<M[]>([]); const [t, setT] = useState(""); const [busy, setBusy] = useState(false); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [m]);
  async function send(text: string) {
    if (!text.trim() || busy) return; const next: M[] = [...m, { role: "user", content: text }]; setM(next); setT(""); setBusy(true);
    const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next.slice(-12) }) });
    const d = await r.json().catch(() => ({}));
    setM([...next, { role: "assistant", content: r.ok ? d.reply : r.status === 501 ? "O Stylist ainda não está ativo: falta configurar a ANTHROPIC_API_KEY no servidor." : "Algo correu mal. Tenta outra vez." }]); setBusy(false);
  }
  return <div className="flex flex-col min-h-[70vh]"><h1 className="text-3xl mb-3">Ask My Stylist</h1>
    {!m.length && <div className="flex flex-wrap gap-2">{SUG.map((s) => <button key={s} className="btn-g" onClick={() => send(s)}>{s}</button>)}</div>}
    <div className="flex-1 space-y-3 py-3">{m.map((x, i) => <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${x.role === "user" ? "ml-auto bg-choc text-cream" : "bg-card border border-line"}`}>{x.content}</div>)}{busy && <p className="text-mut text-sm">A pensar…</p>}<div ref={end} /></div>
    <form className="sticky bottom-20 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(t); }}><input className="inp" placeholder="Pergunta à tua stylist…" value={t} onChange={(e) => setT(e.target.value)} /><button className="btn" disabled={busy}>Enviar</button></form></div>;
}
