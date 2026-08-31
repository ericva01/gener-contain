import { defaultConfig } from "./defaults";
import type { GeneratorConfig } from "@/types/generator";

export interface Preset { id: string; name: string; description: string; config: GeneratorConfig }
const preset = (overrides: Partial<GeneratorConfig>): GeneratorConfig => ({ ...defaultConfig, ...overrides });
export const presets: Preset[] = [
  { id: "next-docker", name: "Next.js + Docker", description: "Standalone Node.js container", config: preset({ projectName: "next-app", includeDockerfile: true }) },
  { id: "next-postgres", name: "Next.js + PostgreSQL", description: "Docker Compose development stack", config: preset({ projectName: "next-postgres", database: "postgres", includeDockerCompose: true }) },
  { id: "spring-postgres", name: "Spring Boot + PostgreSQL", description: "Gradle and Docker Compose", config: preset({ projectName: "spring-api", framework: "spring-boot", applicationPort: 8080, database: "postgres", includeDockerCompose: true }) },
  { id: "next-nginx", name: "Next.js production + Nginx", description: "Containerized reverse proxy", config: preset({ projectName: "next-production", includeDockerCompose: true, includeNginx: true }) },
  { id: "spring-k8s", name: "Spring Boot Kubernetes", description: "PostgreSQL with Kubernetes resources", config: preset({ projectName: "spring-service", framework: "spring-boot", applicationPort: 8080, database: "postgres", includeKubernetes: true, includeKubernetesConfigMap: true, includeKubernetesSecret: true }) },
];
