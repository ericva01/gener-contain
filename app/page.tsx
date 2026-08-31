import Link from "next/link";
import { siDocker, siGit, siGithubactions, siKubernetes, siNextdotjs, siNginx, siPostgresql, siSpringboot, type SimpleIcon } from "simple-icons";

const tools = [
  { name: "Docker", mark: "docker", color: "#2496ed" },
  { name: "Kubernetes", mark: "k8s", color: "#326ce5" },
  { name: "Git", mark: "git", color: "#f05032" },
  { name: "GitHub Actions", mark: "actions", color: "#2088ff" },
  { name: "Nginx", mark: "nginx", color: "#009639" },
  { name: "PostgreSQL", mark: "postgres", color: "#4169e1" },
  { name: "Next.js", mark: "next", color: "#111111" },
  { name: "Spring Boot", mark: "spring", color: "#6db33f" },
];

function ToolMark({ type, color }: { type: string; color: string }) {
  const icons: Record<string, SimpleIcon> = { docker: siDocker, k8s: siKubernetes, git: siGit, actions: siGithubactions, nginx: siNginx, postgres: siPostgresql, next: siNextdotjs, spring: siSpringboot };
  const icon = icons[type];
  return <svg viewBox="0 0 24 24" role="img" aria-label={`${icon.title} logo`}><path fill={`#${icon.hex || color.replace("#", "")}`} d={icon.path}/></svg>;
}

export default function Home() {
  return <main className="landing"><section className="landing-hero"><div className="wave-field" aria-hidden="true"><span/><span/><span/><span/><span/></div><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/><div className="landing-copy"><div className="landing-pill"><span/> Open-source DevOps generator</div><h1>Build less config.<br/><em>Ship more software.</em></h1><p>Turn your stack choices into production-ready Docker, CI, Nginx, and Kubernetes files—in seconds, right inside your browser.</p><div className="landing-actions"><Link href="/generator" className="landing-primary">Start building free <span>→</span></Link><Link href="/docs" className="landing-secondary"><i>▶</i> See how it works</Link></div><div className="landing-proof"><span><b>10+</b> config types</span><span><b>100%</b> browser-local</span><span><b>0</b> sign-ups</span></div></div><div className="floating-code" aria-label="Generated configuration preview"><div className="float-tab"><i/><i/><i/><span>deployment.yaml</span><b>Generated</b></div><pre><code><span>apiVersion:</span> apps/v1{`\n`}<span>kind:</span> Deployment{`\n`}<span>metadata:</span>{`\n`}  name: configcraft-app{`\n`}<span>spec:</span>{`\n`}  replicas: <strong>3</strong>{`\n`}  template:{`\n`}    spec:{`\n`}      containers:{`\n`}        - image: app:latest</code></pre><div className="float-success">✓ Production baseline ready</div></div><div className="wave-bottom" aria-hidden="true"><svg viewBox="0 0 1440 150" preserveAspectRatio="none"><path d="M0,85 C240,145 440,20 720,78 C1000,136 1190,40 1440,75 L1440,150 L0,150 Z"/></svg></div></section><section className="logo-section"><p>Built for the tools your team already uses</p><div className="logo-window"><div className="logo-track">{[...tools,...tools].map((tool,index) => <div className="tool-logo" key={`${tool.name}-${index}`}><ToolMark type={tool.mark} color={tool.color}/><span>{tool.name}</span></div>)}</div></div></section><section className="landing-features"><div className="feature-heading"><p className="eyebrow">One workflow, every environment</p><h2>From blank repo to<br/><em>deployment ready.</em></h2><p>Choose what you use. ConfigCraft takes care of the repetitive infrastructure work while keeping every generated line visible and editable.</p></div><div className="feature-steps"><article><span>01</span><div className="step-icon">⌘</div><h3>Describe your stack</h3><p>Pick your framework, runtime, database, and ports from one focused workspace.</p></article><article><span>02</span><div className="step-icon">{`</>`}</div><h3>Preview every file</h3><p>Inspect Docker, CI, proxy, Kubernetes, and publishing files as they update live.</p></article><article><span>03</span><div className="step-icon">↓</div><h3>Download and ship</h3><p>Copy one artifact or export the complete bundle—ready for your repository.</p></article></div></section><section className="landing-cta"><div className="cta-wave" aria-hidden="true"/><p className="eyebrow">Your next deployment starts here</p><h2>Stop rebuilding the same<br/>configuration by hand.</h2><p>No account. No cloud upload. Just clean infrastructure files you own.</p><Link href="/generator" className="landing-primary light">Open the generator <span>→</span></Link></section></main>;
}
