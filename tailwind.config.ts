import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: {
  colors: { cream: "#f7f3ec", card: "#fffdf9", line: "#e6dccd", mut: "#8b7b6b", ink: "#2b211b", choc: "#4a3328", pink: "#f4a9c0" },
  fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] } } }, plugins: [] } satisfies Config;
