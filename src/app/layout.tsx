import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "Sofia’s Closet", manifest: "/manifest.webmanifest", icons: { apple: "/icons/apple-touch-icon.png" }, appleWebApp: { capable: true, title: "Sofia’s Closet", statusBarStyle: "default" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f7f3ec" };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="pt" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
