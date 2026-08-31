import type { GeneratedFile, GeneratorConfig } from "@/types/generator";
export function generateNginx(config: GeneratorConfig): GeneratedFile {
  return { path: "nginx/default.conf", language: "nginx", content: `# Configure TLS at your load balancer or add a separate HTTPS server block.
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}
upstream application {
  server app:${config.applicationPort};
}
server {
  listen 80;
  server_name _;
  location / {
    proxy_pass http://application;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_connect_timeout 10s;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;
  }
}
` };
}
