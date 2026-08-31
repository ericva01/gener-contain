import { generateCompose, generateEnv } from "./docker/compose";
import { generateDockerfile, generateDockerIgnore } from "./docker/dockerfile";
import { generateGitHubActions } from "./github-actions/ci";
import { generateKubernetes } from "./kubernetes/kubernetes";
import { generateNginx } from "./nginx/nginx";
import { generatePublishScript } from "./shell/publish";
import type { GeneratedFile, GeneratorConfig } from "@/types/generator";

export function generateFiles(config: GeneratorConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  if (config.includeDockerfile) files.push(generateDockerfile(config));
  if (config.includeDockerIgnore) files.push(generateDockerIgnore());
  if (config.includeDockerCompose) files.push(generateCompose(config));
  if (config.includeEnvExample) files.push(generateEnv(config));
  if (config.includeNginx) files.push(generateNginx(config));
  if (config.includeGitHubActions) files.push(generateGitHubActions(config));
  if (config.includePublishScript) files.push(generatePublishScript(config));
  if (config.includeKubernetes) files.push(...generateKubernetes(config));
  return files.sort((a, b) => a.path.localeCompare(b.path));
}
