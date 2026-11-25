"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
type E = { look_id: string | null; worn: boolean };
export default function Cal() {
  const sb = supabaseBrowser(); const [looks, setLooks] = useState<{ id: string; occasion: string }[]>([]); const [ent, setEnt] = useState<Record<string, E>>({});
  const days = Array.from({ length: 14 }, (_, k) => { const d = new Date(); d.setDate(d.getDate() + k - 6); return d; });
  const key = (d: Date) => d.toLocaleDateString("sv-SE");
  const load = useCallback(async () => { const l = await sb.from("looks").select("id,occasion").order("created_at", { ascending: false }); setLooks(l.data ?? []); const e = await sb.from("calendar_entries").select("day,look_id,worn"); setEnt(Object.fromEntries((e.data ?? []).map((x: any) => [x.day, x]))); }, [sb]);
  useEffect(() => { load(); }, [load]);
  async function assign(day: string, id: string) { const { data: { user } } = await sb.auth.getUser(); await sb.from("calendar_entries").upsert({ user_id: user!.id, day, look_id: id || null, worn: false }, { onConflict: "user_id,day" }); load(); }
  async function wore(day: string) {
    const e = ent[day]; if (!e?.look_id || e.worn) return; const { data: li } = await sb.from("look_items").select("item_id").eq("look_id", e.look_id);
    const { data: its } = await sb.from("items").select("id,wears").in("id", (li ?? []).map((x: any) => x.item_id)); for (const i of its ?? []) await sb.from("items").update({ wears: i.wears + 1 }).eq("id", i.id);
    await sb.from("calendar_entries").update({ worn: true }).eq("day", day); load();
  }
  return <div className="space-y-2"><h1 className="text-3xl">Calendar</h1>{!looks.length && <p className="text-sm text-mut">Guarda primeiro looks em Outfits para os poderes planear.</p>}
    {days.map((d) => { const k = key(d), e = ent[k]; return <div key={k} className="card flex items-center gap-2"><span className="w-20 text-sm font-medium">{d.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" })}</span>
      <select className="inp !py-1.5 text-sm" value={e?.look_id ?? ""} onChange={(ev) => assign(k, ev.target.value)}><option value="">—</option>{looks.map((l, i) => <option key={l.id} value={l.id}>{l.occasion} #{looks.length - i}</option>)}</select>
      {e?.look_id && (e.worn ? <span className="text-xs text-mut">✓</span> : <button className="btn-g !px-3 !py-1 text-xs" onClick={() => wore(k)}>Vesti</button>)}</div>; })}</div>;
}
