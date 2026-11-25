import "server-only";
// Camada de abstração: trocar de modelo/serviço sem tocar nas rotas.
export type ItemAnalysis = { name: string; category: string; color: string; secondary_colors: string[]; pattern: string; material?: string; style: string[]; season: string; formality: number; occasions: string[] };
export interface StylistAI { analyzeImage(b64: string, mediaType: string): Promise<ItemAnalysis>; }
export interface TryOnProvider { tryOn(person: string, garments: string[]): Promise<{ imageUrl: string }>; }

async function claude(content: unknown[], system: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("AI_NOT_CONFIGURED");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: [{ role: "user", content }] }),
  });
  if (!r.ok) throw new Error("AI_ERROR_" + r.status);
  const d = await r.json();
  return d.content.map((c: any) => c.text ?? "").join("");
}
export const stylistAI: StylistAI = {
  async analyzeImage(b64, mediaType) {
    const txt = await claude([{ type: "image", source: { type: "base64", media_type: mediaType, data: b64 } }, { type: "text", text: "Analisa esta peça." }],
      'Responde APENAS com JSON: {"name","category"(Tops|Casacos|Vestidos|Saias|Calças|Sapatos|Malas|Acessórios),"color","secondary_colors":[],"pattern","material","style":[],"season"(Primavera|Verão|Outono|Inverno|Todas),"formality"(0-2),"occasions":[]}. Sem markdown.');
    return JSON.parse(txt.replace(/```json|```/g, "").trim());
  },
};
export function tryOnProvider(): TryOnProvider | null {
  const url = process.env.TRYON_PROVIDER_URL, key = process.env.TRYON_PROVIDER_KEY;
  if (!url || !key) return null;
  return { async tryOn(person, garments) { // adaptar ao contrato do provider escolhido
    const r = await fetch(url, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ person, garments }) });
    if (!r.ok) throw new Error("TRYON_ERROR_" + r.status); return r.json(); } };
}

export async function stylistChat(system: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY; if (!key) throw new Error("AI_NOT_CONFIGURED");
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages }) });
  if (!r.ok) throw new Error("AI_ERROR_" + r.status);
  return (await r.json()).content.map((c: any) => c.text ?? "").join("");
}
