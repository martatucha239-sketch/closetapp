"use client";
import { useItems } from "@/lib/useItems";
const HEX: Record<string, string> = { Creme: "#f1e8d4", Castanho: "#4a3328", Azul: "#2f4a6d", Bege: "#d9c7a8", Taupe: "#8b7b6b", Preto: "#1c1917", Branco: "#fafaf9", Cinza: "#b5b2ad", Rosa: "#f0b6c4", Verde: "#4d8a52" };
const S = [
  { n: "Old Money", c: ["Creme", "Castanho", "Azul"], k: "Blazer, mocassins, malha fina, calças de alfaiate", need: ["Casacos", "Sapatos", "Calças"] },
  { n: "Quiet Luxury", c: ["Bege", "Taupe", "Creme"], k: "Malha merino, trench, mala estruturada, tons neutros", need: ["Casacos", "Malas", "Tops"] },
  { n: "Parisian Chic", c: ["Preto", "Branco", "Azul"], k: "Blazer, jeans retos, camisa branca, sapatos rasos", need: ["Casacos", "Calças", "Tops"] },
  { n: "Scandinavian", c: ["Cinza", "Branco", "Bege"], k: "Linhas limpas, camadas, sneakers brancos", need: ["Tops", "Sapatos", "Calças"] },
  { n: "Romantic Feminine", c: ["Rosa", "Creme", "Bege"], k: "Vestidos midi, saias fluidas, tecidos suaves", need: ["Vestidos", "Saias", "Sapatos"] },
  { n: "Coastal Grandmother", c: ["Branco", "Azul", "Bege"], k: "Linho, camisas largas, malhas pelos ombros", need: ["Tops", "Calças", "Sapatos"] }];
export default function Studio() {
  const { items, ready } = useItems();
  return <div className="space-y-3"><h1 className="text-3xl">Style Studio</h1>{!ready && <p className="text-mut">A carregar…</p>}
    {S.map((s) => { const own = items.filter((i) => i.color && s.c.includes(i.color)); const miss = s.need.filter((c) => !items.some((i) => i.category === c));
      return <div key={s.n} className="card space-y-2"><h2 className="text-xl">{s.n}</h2><div className="flex gap-2">{s.c.map((c) => <span key={c} className="w-8 h-8 rounded-full border border-line" style={{ background: HEX[c] }} />)}</div>
        <p className="text-sm">{s.k}</p><p className="text-sm text-mut">{own.length} peça(s) tuas nas cores deste estilo. {miss.length ? `Em falta: ${miss.join(", ")}.` : "Tens as categorias-chave."}</p>
        {!!own.length && <div className="flex gap-2 overflow-x-auto">{own.slice(0, 8).map((i) => <div key={i.id} className="w-14 h-14 shrink-0 rounded-lg bg-line bg-cover bg-center" style={i.url ? { backgroundImage: `url(${i.url})` } : undefined} title={i.name} />)}</div>}</div>; })}</div>;
}
