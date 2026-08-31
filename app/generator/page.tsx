import type { Metadata } from "next";
import ConfigCraft from "@/components/generator/config-craft";

export const metadata: Metadata = {
  title: "Generator | ConfigCraft",
  description: "Generate production-ready Docker, CI, Nginx, and Kubernetes configuration in your browser.",
};

export default function GeneratorPage() {
  return <main className="generator-page"><section className="generator-page-hero"><p className="eyebrow">ConfigCraft workspace</p><h1>Build the files.<br/><em>Own every line.</em></h1><p>Select a starting point, tune it to your stack, and download production-minded infrastructure files—all without your configuration leaving the browser.</p></section><ConfigCraft /></main>;
}
