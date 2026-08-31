import type { GeneratedFile, GeneratorConfig } from "@/types/generator";
export function generateGitHubActions(config: GeneratorConfig): GeneratedFile {
  const steps = config.framework === "nextjs" ? `      - uses: actions/setup-node@v7
        with:
          node-version: ${config.nodeVersion}
          cache: npm
      - run: npm ci
      - run: npm run lint --if-present
      - name: Test when available
        run: npm run test --if-present
      - run: npm run build` : `      - uses: actions/setup-java@v5
        with:
          distribution: temurin
          java-version: '${config.javaVersion}'
          cache: ${config.buildTool}
      - run: chmod +x ${config.buildTool === "gradle" ? "gradlew" : "mvnw"}
      - run: ${config.buildTool === "gradle" ? "./gradlew check build --no-daemon" : "./mvnw verify -B"}`;
  return { path: ".github/workflows/ci.yml", language: "yaml", content: `name: CI
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
${steps}
` };
}
