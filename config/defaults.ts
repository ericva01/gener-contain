import type { GeneratorConfig, ProjectFramework } from "@/types/generator";

export const defaultConfig: GeneratorConfig = {
  schemaVersion: 1,
  projectName: "my-app",
  framework: "nextjs",
  nodeVersion: "22",
  javaVersion: "21",
  buildTool: "gradle",
  database: "none",
  applicationPort: 3000,
  databasePort: 5432,
  includeDockerfile: true,
  includeDockerIgnore: true,
  includeDockerCompose: false,
  includeEnvExample: true,
  includeNginx: false,
  includeGitHubActions: false,
  includePublishScript: false,
  publishMode: "git-docker",
  includeKubernetes: false,
  includeKubernetesConfigMap: false,
  includeKubernetesSecret: false,
};

export const frameworkDefaults: Record<ProjectFramework, Partial<GeneratorConfig>> = {
  nextjs: { framework: "nextjs", nodeVersion: "22", applicationPort: 3000 },
  "spring-boot": { framework: "spring-boot", javaVersion: "21", buildTool: "gradle", applicationPort: 8080 },
};

export function switchFramework(config: GeneratorConfig, framework: ProjectFramework): GeneratorConfig {
  return { ...config, ...frameworkDefaults[framework] };
}
