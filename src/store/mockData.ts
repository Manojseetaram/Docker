export type ContainerStatus = "running" | "stopped" | "paused" | "exited";

export interface Container {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  cpu: string;
  memory: string;
  ports: string;
  uptime: string;
  created: string;
  command: string;
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  created: string;
  inUse: boolean;
}

export interface LogEntry {
  time: string;
  level: "info" | "warn" | "error" | "success";
  container: string;
  message: string;
}

export const INITIAL_CONTAINERS: Container[] = [
  { id: "a1b2c3d4e5f6", name: "nginx-prod",   image: "nginx:latest",    status: "running", cpu: "2.1%",  memory: "45 MB",  ports: "80:80, 443:443", uptime: "2d 4h",  created: "2024-01-20", command: "nginx -g daemon off" },
  { id: "e5f6g7h8i9j0", name: "postgres-dev",  image: "postgres:16",     status: "running", cpu: "5.4%",  memory: "256 MB", ports: "5432:5432",       uptime: "1d 2h",  created: "2024-01-21", command: "postgres" },
  { id: "i9j0k1l2m3n4", name: "redis-dev",     image: "redis:7-alpine",  status: "running", cpu: "0.3%",  memory: "8 MB",   ports: "6379:6379",       uptime: "3d 8h",  created: "2024-01-18", command: "redis-server" },
  { id: "m3n4o5p6q7r8", name: "api-server",    image: "myapp:v2.1",      status: "running", cpu: "12.2%", memory: "180 MB", ports: "3000:3000",       uptime: "5h 20m", created: "2024-01-22", command: "node server.js" },
  { id: "q7r8s9t0u1v2", name: "debug-app",     image: "ubuntu:22.04",    status: "paused",  cpu: "0.0%",  memory: "12 MB",  ports: "—",               uptime: "10m",    created: "2024-01-22", command: "/bin/bash" },
  { id: "u1v2w3x4y5z6", name: "old-worker",    image: "myapp:v1.9",      status: "stopped", cpu: "0.0%",  memory: "0 MB",   ports: "—",               uptime: "Exited", created: "2024-01-15", command: "python worker.py" },
  { id: "y5z6a7b8c9d0", name: "test-nginx",    image: "nginx:1.24",      status: "exited",  cpu: "0.0%",  memory: "0 MB",   ports: "—",               uptime: "Exited", created: "2024-01-10", command: "nginx" },
  { id: "c9d0e1f2g3h4", name: "broken-svc",    image: "node:20-alpine",  status: "exited",  cpu: "0.0%",  memory: "0 MB",   ports: "—",               uptime: "Error",  created: "2024-01-19", command: "node app.js" },
];

export const INITIAL_IMAGES: DockerImage[] = [
  { id: "ab12cd34ef56", repository: "nginx",    tag: "latest",    size: "142 MB", created: "3 days ago",  inUse: true  },
  { id: "gh78ij90kl12", repository: "nginx",    tag: "1.24",      size: "138 MB", created: "2 weeks ago", inUse: false },
  { id: "mn34op56qr78", repository: "postgres", tag: "16",        size: "412 MB", created: "1 week ago",  inUse: true  },
  { id: "st90uv12wx34", repository: "redis",    tag: "7-alpine",  size: "28 MB",  created: "5 days ago",  inUse: true  },
  { id: "yz56ab78cd90", repository: "ubuntu",   tag: "22.04",     size: "77 MB",  created: "1 month ago", inUse: true  },
  { id: "ef12gh34ij56", repository: "node",     tag: "20-alpine", size: "175 MB", created: "4 days ago",  inUse: false },
  { id: "kl78mn90op12", repository: "myapp",    tag: "v2.1",      size: "89 MB",  created: "12h ago",     inUse: true  },
  { id: "qr34st56uv78", repository: "myapp",    tag: "v1.9",      size: "85 MB",  created: "1 week ago",  inUse: false },
  { id: "wx90yz12ab34", repository: "python",   tag: "3.12-slim", size: "124 MB", created: "3 weeks ago", inUse: false },
  { id: "cd56ef78gh90", repository: "alpine",   tag: "3.19",      size: "7 MB",   created: "2 months ago",inUse: false },
  { id: "ij12kl34mn56", repository: "golang",   tag: "1.22",      size: "842 MB", created: "1 week ago",  inUse: false },
  { id: "op78qr90st12", repository: "rust",     tag: "1.76",      size: "1.2 GB", created: "5 days ago",  inUse: false },
];

export const INITIAL_LOGS: LogEntry[] = [
  { time: "09:01:02", level: "info",    container: "nginx-prod",   message: '172.17.0.1 - "GET /health HTTP/1.1" 200 2ms' },
  { time: "09:01:05", level: "success", container: "api-server",   message: "Server started on port 3000 — ready" },
  { time: "09:01:10", level: "warn",    container: "redis-dev",    message: "Memory usage reached 78% of limit" },
  { time: "09:01:22", level: "info",    container: "nginx-prod",   message: '172.17.0.4 - "POST /api/data HTTP/1.1" 201 12ms' },
  { time: "09:02:00", level: "success", container: "postgres-dev", message: "Database connection established — 12 clients" },
  { time: "09:03:14", level: "error",   container: "broken-svc",   message: "TypeError: Cannot read property 'id' of undefined" },
  { time: "09:03:15", level: "info",    container: "api-server",   message: "GET /api/users 200 — 14ms" },
  { time: "09:04:02", level: "warn",    container: "nginx-prod",   message: "Upstream response time 1.23s for /api/slow" },
  { time: "09:05:30", level: "success", container: "redis-dev",    message: "PING PONG — health check OK" },
  { time: "09:06:11", level: "error",   container: "broken-svc",   message: "Container exited with code 1" },
  { time: "09:07:00", level: "info",    container: "postgres-dev", message: "Checkpoint starting: immediate" },
  { time: "09:08:45", level: "success", container: "api-server",   message: "POST /api/auth 201 — user authenticated" },
];

export const AVAILABLE_IMAGES_FOR_RUN = [
  "nginx:latest", "nginx:1.24", "postgres:16", "postgres:15",
  "redis:7-alpine", "redis:latest", "ubuntu:22.04", "ubuntu:20.04",
  "node:20-alpine", "node:18-alpine", "python:3.12-slim",
  "alpine:3.19", "golang:1.22", "rust:1.76", "myapp:v2.1"
];