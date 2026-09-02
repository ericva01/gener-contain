import type { GeneratedFile, GeneratorConfig } from "@/types/generator";

export function generateDockerfile(config: GeneratorConfig): GeneratedFile {
  if (config.framework === "nextjs") return { path: "Dockerfile", language: "dockerfile", content: `# Requires output: "standalone" in next.config.ts
ARG NODE_VERSION=${config.nodeVersion}
FROM node:\${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:\${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:\${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=${config.applicationPort}
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE ${config.applicationPort}
CMD ["node", "server.js"]
` };

  if (config.framework === "react") return { path: "Dockerfile", language: "dockerfile", content: `ARG NODE_VERSION=${config.nodeVersion}
FROM node:\${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'server { listen ${config.applicationPort}; server_name _; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE ${config.applicationPort}
CMD ["nginx", "-g", "daemon off;"]
` };

  const build = config.buildTool === "gradle"
    ? { image: `gradle:8-jdk${config.javaVersion}-alpine`, copy: "COPY gradlew settings.gradle* build.gradle* ./\nCOPY gradle ./gradle\nRUN ./gradlew dependencies --no-daemon || true\nCOPY . .", command: "RUN ./gradlew bootJar --no-daemon", jar: "build/libs/*.jar" }
    : { image: `maven:3.9-eclipse-temurin-${config.javaVersion}-alpine`, copy: "COPY mvnw pom.xml ./\nCOPY .mvn ./.mvn\nRUN ./mvnw dependency:go-offline -B\nCOPY . .", command: "RUN ./mvnw package -DskipTests -B", jar: "target/*.jar" };
  return { path: "Dockerfile", language: "dockerfile", content: `FROM ${build.image} AS builder
WORKDIR /workspace
${build.copy}
${build.command}
RUN JAR_FILE=$(find ${build.jar} -type f ! -name '*-plain.jar' | head -n 1) && cp "$JAR_FILE" /workspace/application.jar

FROM eclipse-temurin:${config.javaVersion}-jre-alpine AS runner
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=builder --chown=spring:spring /workspace/application.jar application.jar
USER spring:spring
EXPOSE ${config.applicationPort}
ENTRYPOINT ["java", "-jar", "/app/application.jar"]
` };
}

export function generateDockerIgnore(): GeneratedFile {
  return { path: ".dockerignore", language: "text", content: `.git
.github
.next
node_modules
out
target
build
.gradle
.idea
.vscode
*.log
.env
.env.*
!.env.example
` };
}
