import { z } from "zod";
import type { GeneratorConfig } from "@/types/generator";

const projectName = z.string().trim().min(1, "Enter a project name.").max(63, "Use 63 characters or fewer.")
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Use lowercase letters, numbers, and hyphens; start and end with a letter or number.");
const version = z.string().regex(/^\d+(?:\.\d+){0,2}$/, "Enter a numeric version such as 22 or 21.0.2.");
const port = z.number().int("Use a whole number.").min(1, "Port must be at least 1.").max(65535, "Port cannot exceed 65535.");

export const generatorConfigSchema = z.object({
  schemaVersion: z.literal(1), projectName, framework: z.enum(["nextjs", "spring-boot"]),
  nodeVersion: version, javaVersion: version, buildTool: z.enum(["gradle", "maven"]),
  database: z.enum(["none", "postgres"]), applicationPort: port, databasePort: port,
  includeDockerfile: z.boolean(), includeDockerIgnore: z.boolean(), includeDockerCompose: z.boolean(),
  includeEnvExample: z.boolean(), includeNginx: z.boolean(), includeGitHubActions: z.boolean(),
  includePublishScript: z.boolean(), publishMode: z.enum(["git", "docker", "git-docker"]),
  includeKubernetes: z.boolean(), includeKubernetesConfigMap: z.boolean(), includeKubernetesSecret: z.boolean(),
}).superRefine((value, ctx) => {
  if (value.applicationPort === value.databasePort && value.database === "postgres") {
    ctx.addIssue({ code: "custom", path: ["databasePort"], message: "Database and application ports must differ." });
  }
  if (value.includeDockerCompose && !value.includeDockerfile) {
    ctx.addIssue({ code: "custom", path: ["includeDockerfile"], message: "Docker Compose requires a Dockerfile." });
  }
  if (value.includePublishScript && value.publishMode !== "git" && !value.includeDockerfile) {
    ctx.addIssue({ code: "custom", path: ["includeDockerfile"], message: "The publish script requires a Dockerfile." });
  }
});

export type ValidationErrors = Partial<Record<keyof GeneratorConfig, string>>;
export function validateConfig(config: GeneratorConfig) {
  const result = generatorConfigSchema.safeParse(config);
  const errors: ValidationErrors = {};
  if (!result.success) for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof GeneratorConfig;
    errors[key] ??= issue.message;
  }
  return { success: result.success, errors, data: result.success ? result.data : undefined };
}
