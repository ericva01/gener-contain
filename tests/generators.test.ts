import { describe, expect, it } from "vitest";
import { defaultConfig } from "@/config/defaults";
import { generateCompose, generateEnv } from "@/generators/docker/compose";
import { generateDockerfile } from "@/generators/docker/dockerfile";
import { generateFiles } from "@/generators/generate-files";
import { generateKubernetes } from "@/generators/kubernetes/kubernetes";
import { generatePublishScript } from "@/generators/shell/publish";

describe("generators", () => {
  it("creates a standalone non-root Next.js image", () => { const text = generateDockerfile(defaultConfig).content; expect(text).toContain("AS deps"); expect(text).toContain('USER nextjs'); expect(text).toContain('output: "standalone"'); });
  it("creates a Vite React image served by Nginx", () => { const text = generateDockerfile({ ...defaultConfig, framework: "react", applicationPort: 8080 }).content; expect(text).toContain("/app/dist"); expect(text).toContain("try_files $uri"); expect(text).toContain("listen 8080"); });
  it.each(["gradle", "maven"] as const)("creates a wrapper-based %s Spring image", (buildTool) => { const text = generateDockerfile({ ...defaultConfig, framework: "spring-boot", buildTool }).content; expect(text).toContain(buildTool === "gradle" ? "./gradlew" : "./mvnw"); expect(text).toContain("jre-alpine"); expect(text).toContain("USER spring:spring"); });
  it("conditionally adds PostgreSQL to Compose", () => { expect(generateCompose(defaultConfig).content).not.toContain("image: postgres"); const text = generateCompose({ ...defaultConfig, database: "postgres" }).content; expect(text).toContain("image: postgres:17-alpine"); expect(text).toContain("condition: service_healthy"); expect(text).toContain("@postgres:5432"); });
  it("routes Compose traffic through Nginx when selected", () => { const text = generateCompose({ ...defaultConfig, includeNginx: true, includeDockerCompose: true }).content; expect(text).toContain("image: nginx:1.29-alpine"); expect(text).toContain("./nginx/default.conf"); expect(text).toContain('expose:\n      - "3000"'); });
  it("generates safe environment examples", () => { const text = generateEnv({ ...defaultConfig, database: "postgres" }).content; expect(text).toContain("POSTGRES_PASSWORD=change-me"); expect(text).toContain("Never commit real secrets"); });
  it("generates Kubernetes probes, storage, and placeholders", () => { const files = generateKubernetes({ ...defaultConfig, database: "postgres", includeKubernetes: true }); const text = files.map((file) => file.content).join("\n"); expect(text).toContain("readinessProbe"); expect(text).toContain("PersistentVolumeClaim"); expect(text).toContain("REPLACE_ME"); expect(text).not.toContain("kind: Secret\nmetadata:\n  name: secret"); });
  it("generates a Docker Hub and Git publishing script", () => { const file = generatePublishScript(defaultConfig); expect(file.path).toBe("scripts/publish.sh"); expect(file.content).toContain("docker push"); expect(file.content).toContain("git push --set-upstream origin"); expect(file.content).toContain("DOCKERHUB_TOKEN"); });
  it("supports independent Git and Docker auto-push modes", () => {
    const git = generatePublishScript({ ...defaultConfig, publishMode: "git" }).content;
    const docker = generatePublishScript({ ...defaultConfig, publishMode: "docker" }).content;
    expect(git).toContain("git push --set-upstream origin"); expect(git).not.toContain("docker push");
    expect(docker).toContain("docker push"); expect(docker).not.toContain("git push --set-upstream origin");
  });
  it("only generates selected output and stays deterministic", () => { const config = { ...defaultConfig, includeDockerfile: false, includeDockerIgnore: false, includeEnvExample: false, includeGitHubActions: true }; const first = generateFiles(config); expect(first.map((file) => file.path)).toEqual([".github/workflows/ci.yml"]); expect(generateFiles(config)).toEqual(first); });
});
