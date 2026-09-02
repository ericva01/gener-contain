export type ProjectFramework = "nextjs" | "react" | "spring-boot";
export type DatabaseType = "none" | "postgres";
export type BuildTool = "gradle" | "maven";
export type PublishMode = "git" | "docker" | "git-docker";

export interface GeneratorConfig {
  schemaVersion: 1;
  projectName: string;
  framework: ProjectFramework;
  nodeVersion: string;
  javaVersion: string;
  buildTool: BuildTool;
  database: DatabaseType;
  applicationPort: number;
  databasePort: number;
  includeDockerfile: boolean;
  includeDockerIgnore: boolean;
  includeDockerCompose: boolean;
  includeEnvExample: boolean;
  includeNginx: boolean;
  includeGitHubActions: boolean;
  includePublishScript: boolean;
  publishMode: PublishMode;
  includeKubernetes: boolean;
  includeKubernetesConfigMap: boolean;
  includeKubernetesSecret: boolean;
}

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
}
