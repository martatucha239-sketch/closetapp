"use client";
import { useItems } from "@/lib/useItems";
export default function Insights() {
  const { items: a, ready } = useItems(); if (!ready) return <p className="text-mut">A carregar…</p>; if (!a.length) return <p className="text-mut text-center mt-16">Adiciona peças ao closet para ver estatísticas.</p>;
  const used = a.filter((i) => i.wears > 0).length, never = a.filter((i) => !i.wears), cats = [...new Set(a.map((i) => i.category))].map((c) => [c, a.filter((i) => i.category === c).length] as const), mx = Math.max(...cats.map((c) => c[1]));
  const cpw = a.filter((i) => i.price).sort((x, y) => y.price! / (y.wears || 0.5) - x.price! / (x.wears || 0.5));
  return <div className="space-y-4"><h1 className="text-3xl">Insights</h1>
    <div className="grid grid-cols-3 gap-2 text-center">{[[a.length, "peças"], [Math.round((used / a.length) * 100) + "%", "em uso"], [never.length, "nunca usadas"]].map(([n, l]) => <div key={l} className="card"><div className="font-serif text-2xl">{n}</div><span className="text-xs text-mut">{l}</span></div>)}</div>
    <div><h2 className="text-xl mb-2">Por categoria</h2>{cats.map(([c, n]) => <div key={c} className="flex items-center gap-2 text-sm mb-1"><span className="w-24">{c}</span><div className="h-2 rounded bg-pink" style={{ width: `${(n / mx) * 60}%` }} /><span className="text-mut">{n}</span></div>)}</div>
    {!!never.length && <div><h2 className="text-xl mb-1">Peças esquecidas</h2><p className="text-sm text-mut mb-2">Experimenta combiná-las no Outfits, ou considera vender ou doar.</p><div className="flex gap-2 overflow-x-auto">{never.map((i) => <div key={i.id} className="w-16 shrink-0 text-center"><div className="aspect-square rounded-lg bg-line bg-cover bg-center" style={i.url ? { backgroundImage: `url(${i.url})` } : undefined} /><span className="text-[11px] text-mut block truncate">{i.name}</span></div>)}</div></div>}
    <div><h2 className="text-xl mb-2">Cost per wear</h2>{cpw.map((i) => <div key={i.id} className="flex justify-between text-sm py-1 border-b border-line"><span>{i.name}</span><span className="text-mut">{i.wears ? (i.price! / i.wears).toFixed(2) + " €/uso" : `nunca usada (${i.price} €)`}</span></div>)}{!cpw.length && <p className="text-sm text-mut">Indica o preço das peças para calcular.</p>}</div></div>;
}
