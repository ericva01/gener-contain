# ConfigCraft

ConfigCraft is an open-source, browser-only generator for production-ready DevOps configuration. Select a Next.js or Spring Boot stack, database, and deployment features; preview every result and download files individually or as a ZIP. Configuration and generated content never leave your device.

> Screenshot placeholder: add the main generator view to `docs/configcraft.png`.

## Features

- Versioned, strongly typed configuration with runtime validation, presets, JSON import/export, and local persistence
- Next.js and Spring Boot (Gradle or Maven) production Docker images
- PostgreSQL-aware Compose, safe environment examples, Nginx, CI, and Kubernetes resources
- Per-file preview, copy, download, and path-safe ZIP download
- Responsive accessible UI with no account, backend, telemetry, or external service

## Supported generators

| Area | Output |
| --- | --- |
| Containers | `Dockerfile`, `.dockerignore`, `docker-compose.yml` |
| Environment | `.env.example` |
| Proxy and CI | `nginx/default.conf`, `.github/workflows/ci.yml` |
| Kubernetes | Namespace, app Deployment/Service, ConfigMap, Secret template, optional PostgreSQL/PVC |

Next.js containers require `output: "standalone"` in `next.config.ts`. Spring Boot builds use the checked-in Gradle or Maven wrapper.

## Development and build

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Run all checks with:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The production build is a static export in `out/`.

## Deployment

**Vercel:** import the repository and keep the detected Next.js settings. No environment variables or server functions are required.

**Cloudflare Pages:** use build command `npm run build` and output directory `out`. Choose a current Node.js compatibility version. No Workers runtime is needed.

## Add a generator

1. Add a serializable option to `types/generator.ts`, its default, and Zod validation.
2. Add a pure function under `generators/<feature>/` accepting `GeneratorConfig` and returning `GeneratedFile`.
3. Register it in `generators/generate-files.ts`, expose the UI option, and add tests.
4. Validate interpolated values, never emit real secrets, and use archive-safe relative paths.

## Security limitations

ConfigCraft provides secure baselines, not a substitute for a platform security review. Generated secrets are placeholders; use a secret manager and never commit real values. Review TLS, digest pinning, policies, probes, resources, and availability for your environment. See [SECURITY.md](SECURITY.md).

## Contributing and roadmap

Read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). The roadmap includes more runtimes and databases, parser validation, template snapshots, private shareable configurations, and community generator packs. Licensed under Apache-2.0.
