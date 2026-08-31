import type { GeneratedFile, GeneratorConfig } from "@/types/generator";

export function generateCompose(config: GeneratorConfig): GeneratedFile {
  const postgres = config.database === "postgres";
  const appEnv = postgres ? (config.framework === "nextjs"
    ? `      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}`
    : `      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/\${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: \${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: \${POSTGRES_PASSWORD}`) : `      NODE_ENV: production`;
  return { path: "docker-compose.yml", language: "yaml", content: `services:
  app:
    build:
      context: .
    restart: unless-stopped
${config.includeNginx ? `    expose:
      - "${config.applicationPort}"` : `    ports:
      - "\${APP_PORT:-${config.applicationPort}}:${config.applicationPort}"`}
    environment:
${appEnv}
${postgres ? `    depends_on:
      postgres:
        condition: service_healthy
` : ""}    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:${config.applicationPort}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [app-network]
${config.includeNginx ? `
  nginx:
    image: nginx:1.29-alpine
    restart: unless-stopped
    depends_on:
      app:
        condition: service_healthy
    ports:
      - "\${NGINX_PORT:-80}:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [app-network]
` : ""}${postgres ? `
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    ports:
      - "\${POSTGRES_PORT:-${config.databasePort}}:5432"
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [app-network]
` : ""}
networks:
  app-network:
    driver: bridge
${postgres ? `
volumes:
  postgres-data:
` : ""}` };
}

export function generateEnv(config: GeneratorConfig): GeneratedFile {
  const lines = ["# Example values only. Never commit real secrets.", `APP_PORT=${config.applicationPort}`];
  if (config.includeNginx) lines.push("NGINX_PORT=80");
  if (config.database === "postgres") lines.push(`POSTGRES_PORT=${config.databasePort}`, "POSTGRES_DB=app_db", "POSTGRES_USER=postgres", "POSTGRES_PASSWORD=change-me");
  return { path: ".env.example", language: "dotenv", content: `${lines.join("\n")}\n` };
}
