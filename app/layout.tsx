import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./site.css";
import "./landing.css";
import "./features.css";

export const metadata: Metadata = {
  title: "ConfigCraft - Production DevOps configuration generator",
  description: "Generate production-ready DevOps configuration locally in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full"><header className="site-header"><div className="site-nav"><Link href="/" className="brand" aria-label="ConfigCraft home"><span className="brand-mark">CC</span><span><strong>ConfigCraft</strong><small>Production configs, minus the busywork.</small></span></Link><nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/generator">Generator</Link><Link href="/docs">Docs</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><a href="https://github.com/" target="_blank" rel="noreferrer" className="nav-cta">GitHub <span aria-hidden="true">↗</span></a></nav></div></header>{children}<footer className="site-footer"><div className="footer-main"><div><Link href="/" className="footer-brand"><span className="brand-mark">CC</span><span>ConfigCraft</span></Link><p>Production-ready infrastructure files, generated privately in your browser.</p></div><div className="footer-nav"><div><strong>Product</strong><Link href="/generator">Generator</Link><Link href="/docs">Documentation</Link></div><div><strong>Company</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link></div><div><strong>Project</strong><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noreferrer">Apache 2.0 ↗</a></div></div></div><div className="footer-bottom"><span>Built by <b>Eric Lvis</b> and <b>PES Expo</b>.</span><span>© 2026 ConfigCraft. Open source, always.</span></div></footer></body></html>;
}
