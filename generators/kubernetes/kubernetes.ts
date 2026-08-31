import type { GeneratedFile, GeneratorConfig } from "@/types/generator";

const file = (path: string, content: string): GeneratedFile => ({ path, language: "yaml", content: `${content.trim()}\n` });
export function generateKubernetes(config: GeneratorConfig): GeneratedFile[] {
  const name = config.projectName;
  const hasDb = config.database === "postgres";
  const envFrom = hasDb ? `
          envFrom:
            - configMapRef: { name: ${name}-config }
            - secretRef: { name: ${name}-secrets }` : "";
  const files = [
    file("k8s/namespace.yml", `apiVersion: v1
kind: Namespace
metadata:
  name: ${name}`),
    file("k8s/deployment.yml", `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  namespace: ${name}
spec:
  replicas: 2
  selector:
    matchLabels: { app.kubernetes.io/name: ${name} }
  template:
    metadata:
      labels: { app.kubernetes.io/name: ${name} }
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: app
          image: ghcr.io/your-org/${name}:latest
          imagePullPolicy: IfNotPresent
          ports:
            - { name: http, containerPort: ${config.applicationPort} }${envFrom}
          readinessProbe:
            httpGet: { path: /, port: http }
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /, port: http }
            initialDelaySeconds: 30
            periodSeconds: 20
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { cpu: 500m, memory: 512Mi }
          securityContext:
            allowPrivilegeEscalation: false
            capabilities: { drop: [ALL] }
            readOnlyRootFilesystem: true`),
    file("k8s/service.yml", `apiVersion: v1
kind: Service
metadata:
  name: ${name}
  namespace: ${name}
spec:
  selector: { app.kubernetes.io/name: ${name} }
  ports:
    - { name: http, port: 80, targetPort: http }
  type: ClusterIP`),
  ];
  if (config.includeKubernetesConfigMap || hasDb) files.push(file("k8s/configmap.yml", `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${name}-config
  namespace: ${name}
data:
  APP_PORT: "${config.applicationPort}"${hasDb ? config.framework === "nextjs" ? `
  DATABASE_HOST: postgres
  POSTGRES_DB: app_db
  POSTGRES_USER: postgres` : `
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/app_db
  SPRING_DATASOURCE_USERNAME: postgres` : ""}`));
  if (config.includeKubernetesSecret || hasDb) files.push(file("k8s/secret.yml", `# Template only. Replace the placeholder using your secret manager; do not commit real values.
apiVersion: v1
kind: Secret
metadata:
  name: ${name}-secrets
  namespace: ${name}
type: Opaque
stringData:
  ${config.framework === "nextjs" ? "DATABASE_URL" : "SPRING_DATASOURCE_PASSWORD"}: REPLACE_ME${hasDb ? "\n  POSTGRES_PASSWORD: REPLACE_ME" : ""}`));
  if (hasDb) files.push(
    file("k8s/postgres.yml", `apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: ${name}
spec:
  replicas: 1
  selector:
    matchLabels: { app.kubernetes.io/name: postgres }
  template:
    metadata:
      labels: { app.kubernetes.io/name: postgres }
    spec:
      securityContext: { runAsNonRoot: true, fsGroup: 999 }
      containers:
        - name: postgres
          image: postgres:17-alpine
          ports:
            - { name: postgres, containerPort: 5432 }
          env:
            - { name: POSTGRES_DB, value: app_db }
            - { name: POSTGRES_USER, value: postgres }
            - name: POSTGRES_PASSWORD
              valueFrom: { secretKeyRef: { name: ${name}-secrets, key: POSTGRES_PASSWORD } }
          readinessProbe:
            exec: { command: [pg_isready, -U, postgres, -d, app_db] }
            initialDelaySeconds: 5
          livenessProbe:
            exec: { command: [pg_isready, -U, postgres, -d, app_db] }
            initialDelaySeconds: 20
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { cpu: 500m, memory: 512Mi }
          securityContext:
            allowPrivilegeEscalation: false
            capabilities: { drop: [ALL] }
          volumeMounts:
            - { name: data, mountPath: /var/lib/postgresql/data }
      volumes:
        - name: data
          persistentVolumeClaim: { claimName: postgres-data }
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: ${name}
spec:
  selector: { app.kubernetes.io/name: postgres }
  ports:
    - { name: postgres, port: 5432, targetPort: postgres }
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
  namespace: ${name}
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests: { storage: 5Gi }`));
  return files;
}
