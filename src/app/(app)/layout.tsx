"use client";
import Link from "next/link"; import { usePathname } from "next/navigation"; import { supabaseBrowser } from "@/lib/supabase/client";
const TABS = [["/closet", "Closet"], ["/outfits", "Outfits"], ["/stylist", "Stylist"], ["/mais", "Mais"]];
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const p = usePathname(); const main = TABS.slice(0, 3).map((t) => t[0]);
  const active = (h: string) => (h === "/mais" ? !main.includes(p) : p === h);
  return <div className="max-w-2xl mx-auto min-h-screen pt-[env(safe-area-inset-top)]">
    <header className="flex items-center justify-between px-5 py-4"><span className="font-serif text-3xl text-pink">SC</span>
      <button className="text-xs text-mut" onClick={async () => { await supabaseBrowser().auth.signOut(); location.href = "/login"; }}>Sair</button></header>
    <div className="px-5 pb-28">{children}</div>
    <nav className="fixed bottom-0 inset-x-0 bg-card border-t border-line flex pb-[env(safe-area-inset-bottom)]">
      {TABS.map(([h, l]) => <Link key={h} href={h} className={`flex-1 text-center py-3 text-sm ${active(h) ? "text-ink font-medium" : "text-mut"}`}>{l}</Link>)}
    </nav></div>;
}
