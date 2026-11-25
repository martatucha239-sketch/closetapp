"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [mode, setMode] = useState<"in" | "up">("in"); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(""); const sb = supabaseBrowser();
    if (mode === "in") { const { error } = await sb.auth.signInWithPassword({ email, password: pw }); if (error) setMsg("Email ou palavra-passe incorretos."); else location.href = "/closet"; }
    else { const { data, error } = await sb.auth.signUp({ email, password: pw }); if (error) setMsg(error.message); else if (!data.session) setMsg("Conta criada. Confirma o teu email para entrar."); else location.href = "/closet"; }
    setBusy(false);
  }
  return <main className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto">
    <div className="text-center mb-8"><div className="font-serif text-6xl text-pink">SC</div><p className="text-xs tracking-[.3em] uppercase text-mut mt-1">Sofia’s Closet</p></div>
    <form onSubmit={submit} className="space-y-3">
      <input className="inp" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="inp" type="password" placeholder="Palavra-passe (mín. 6)" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} required />
      {msg && <p className="text-sm text-mut">{msg}</p>}
      <button className="btn w-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</button>
    </form>
    <button className="text-sm text-mut mt-4" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>{mode === "in" ? "Ainda não tens conta? Regista-te" : "Já tens conta? Entrar"}</button>
  </main>;
}
