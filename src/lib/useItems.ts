"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser, sign } from "./supabase/client";
export type Item = { id: string; name: string; category: string; color: string | null; price: number | null; season: string | null; wears: number; image_path: string | null; url?: string };
export function useItems() {
  const [items, setItems] = useState<Item[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { (async () => { const { data } = await supabaseBrowser().from("items").select("*"); const rows = (data ?? []) as Item[]; const m = await sign(rows.map((r) => r.image_path)); setItems(rows.map((r) => ({ ...r, url: r.image_path ? m.get(r.image_path) : undefined }))); setReady(true); })(); }, []);
  return { items, ready };
}
export const NEU = ["Preto", "Branco", "Bege", "Creme", "Taupe", "Castanho", "Cinza"];
