import { createBrowserClient } from "@supabase/ssr";
let c: ReturnType<typeof createBrowserClient> | null = null;
export const supabaseBrowser = () => (c ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!));
export async function sign(paths: (string | null | undefined)[]) {
  const p = [...new Set(paths.filter(Boolean) as string[])]; const m = new Map<string, string>();
  if (!p.length) return m;
  const { data } = await supabaseBrowser().storage.from("closet").createSignedUrls(p, 3600);
  (data ?? []).forEach((x: any) => m.set(x.path, x.signedUrl)); return m;
}
export function shrink(f: File): Promise<Blob> { return new Promise((res) => { const im = new Image(); im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = im.width * k; c.height = im.height * k; c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height); c.toBlob((b) => res(b!), "image/jpeg", 0.8); }; im.src = URL.createObjectURL(f); }); }
