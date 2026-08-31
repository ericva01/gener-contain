import type { GeneratedFile, GeneratorConfig } from "@/types/generator";

export function generatePublishScript(config: GeneratorConfig): GeneratedFile {
  const usesDocker = config.publishMode !== "git";
  const usesGit = config.publishMode !== "docker";
  const dockerSetup = usesDocker ? `command -v docker >/dev/null 2>&1 || { echo "Docker is required." >&2; exit 1; }

DOCKERHUB_USERNAME="\${DOCKERHUB_USERNAME:?Set DOCKERHUB_USERNAME first}"
IMAGE_NAME="\${IMAGE_NAME:-${config.projectName}}"
TAG="\${1:-latest}"
IMAGE="\${DOCKERHUB_USERNAME}/\${IMAGE_NAME}:\${TAG}"

if [[ -n "\${DOCKERHUB_TOKEN:-}" ]]; then
  printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USERNAME" --password-stdin
fi

echo "Building $IMAGE"
docker build --tag "$IMAGE" .
docker push "$IMAGE"
` : "";
  const gitSetup = usesGit ? `command -v git >/dev/null 2>&1 || { echo "Git is required." >&2; exit 1; }

BRANCH="\${GIT_BRANCH:-\$(git branch --show-current)}"
git add --all
if ! git diff --cached --quiet; then
  git commit -m "\${GIT_COMMIT_MESSAGE:-chore: auto publish ${config.projectName}}"
fi

[[ -n "$BRANCH" ]] || { echo "Cannot push from a detached HEAD." >&2; exit 1; }
git push --set-upstream origin "$BRANCH"
` : "";
  const result = usesDocker && usesGit ? "Pushed Docker image and Git branch." : usesDocker ? "Pushed Docker image." : "Pushed Git branch.";
  return {
    path: "scripts/publish.sh",
    language: "shell",
    content: `#!/usr/bin/env bash
set -Eeuo pipefail

# Auto-publish mode: ${config.publishMode}
${dockerSetup}${gitSetup}
echo "${result}"
`,
  };
}
