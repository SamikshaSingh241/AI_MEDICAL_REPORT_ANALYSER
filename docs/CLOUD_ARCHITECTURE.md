# MediSense AI - Cloud-Native Architecture & DevOps Documentation

> **Designed for Enterprise Cloud Platforms (Demandbase Cloud Engineer Assessment & Interview Reference)**

---

## 1. Executive Summary

**MediSense AI** is an AI-powered healthcare document analysis platform transformed from a traditional MERN monolithic application into an **enterprise-ready, containerized, cloud-native architecture**.

The platform is architected according to Cloud-Native Computing Foundation (CNCF) standards, utilizing **multi-stage Docker builds**, **Kubernetes orchestration**, **automated horizontal autoscaling (HPA)**, and **continuous integration/continuous deployment (CI/CD)** pipelines.

---

## 2. Cloud Architecture Diagram

```mermaid
graph TD
    User([End Users / Web Clients]) -->|HTTPS / Port 443| Ingress[Kubernetes Ingress / Cloud ALB]
    
    subgraph K8s_Cluster["Kubernetes Cluster (Namespace: medisense-ai)"]
        subgraph Web_Tier["Presentation Tier (Port 80)"]
            Ingress -->|Route '/'| FrontendSvc[frontend-service:80]
            FrontendSvc --> FrontendPod1["Frontend Pod 1 (Nginx + React)"]
            FrontendSvc --> FrontendPod2["Frontend Pod 2 (Nginx + React)"]
        end

        subgraph API_Tier["Application / API Tier (Port 5000)"]
            Ingress -->|Route '/api/*'| BackendSvc[backend-service:5000]
            BackendSvc --> BackendPod1["Backend Pod 1 (Node/Express API)"]
            BackendSvc --> BackendPod2["Backend Pod 2 (Node/Express API)"]
            BackendHPA["Horizontal Pod Autoscaler (HPA)<br/>Scales 2 to 10 pods on CPU/RAM"] -.-> API_Tier
        end

        subgraph Data_Tier["Stateful Data Tier (Port 27017)"]
            BackendPod1 & BackendPod2 -->|Internal DNS| MongoHeadless[mongodb-headless:27017]
            MongoHeadless --> MongoPod["MongoDB 7.0 StatefulSet Pod"]
            MongoPod --> PVC["PersistentVolumeClaim (10Gi Block Storage)"]
        end

        subgraph Security_Observability["Security & Observability"]
            Sec["K8s Secrets & ConfigMaps"] -.-> BackendPod1 & BackendPod2
            Probes["Liveness (/healthz)<br/>Readiness (/readyz)"] -.-> BackendPod1 & BackendPod2
        end
    end

    BackendPod1 & BackendPod2 -->|External TLS| GeminiAPI([Google Gemini 2.5 Flash API])
```

---

## 3. Key Cloud Engineering Highlights

### A. Production Multi-Stage Containerization (Docker)
- **Frontend (`Dockerfile`)**:
  - **Stage 1 (Builder)**: Node 20 Alpine compiles the Vite React TypeScript/JSX bundle with `npm ci`.
  - **Stage 2 (Runner)**: Production `nginx:1.27-alpine` web server serving static assets (~25MB total footprint vs ~600MB unoptimized).
  - **Reverse Proxy**: Nginx proxies all `/api/` traffic to the backend service internally, **eliminating CORS issues** and keeping API endpoints off the public internet.
  - **Security Headers**: Injected `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and Gzip compression.
- **Backend (`server/Dockerfile`)**:
  - Non-root execution: runs under unprivileged `node` user (UID 1000) for container hardening and compliance.
  - Process supervisor: uses `tini` as init process to correctly handle Unix operating system signals (`SIGTERM`, `SIGINT`).
  - Native health checks baked into the container.

### B. Multi-Container Orchestration (`docker-compose.yml`)
- Provides identical local simulation of cloud production environments.
- **Healthcheck Dependencies**: `backend` waits for `mongodb` to pass its database ping healthcheck before booting up (`condition: service_healthy`).
- **Network Segmentation**: Isolated bridge network (`medisense-network`) preventing unauthorized access from outside the docker host.
- **Named Volume Persistence**: Preserves MongoDB data across container teardowns and updates.

### C. Enterprise Kubernetes Architecture (`k8s/`)
| Manifest | Component | Purpose |
| :--- | :--- | :--- |
| `namespace.yaml` | `medisense-ai` | Multi-tenant cluster isolation |
| `configmap.yaml` & `secrets.yaml` | Configuration & Secrets | Separation of code and cloud credentials |
| `mongodb-statefulset.yaml` | StatefulSet & Headless Service | Predictable DNS (`mongodb-0`), persistent PVC, safe writes |
| `backend-deployment.yaml` | Deployment (2 Replicas) | Rolling updates (`maxSurge: 1`, `maxUnavailable: 0`), non-root security context |
| `frontend-deployment.yaml` | Deployment (2 Replicas) | High-availability UI presentation tier |
| `ingress.yaml` | Ingress | Path-based routing (`/api` -> backend, `/` -> frontend) + TLS |
| `hpa-pdb.yaml` | HPA & PodDisruptionBudget | Auto-scales 2-10 pods at 70% CPU; ensures minimum 1 pod during node drains |
| `kustomization.yaml` | Kustomize Bundle | Enables 1-command deployment (`kubectl apply -k k8s/`) |

### D. Observability & Graceful Cloud Lifecycle
- **Liveness Probe (`GET /healthz`)**: Verifies container process health; triggers automated pod restart if deadlocked.
- **Readiness Probe (`GET /readyz`)**: Verifies MongoDB connection state; removes pod from service load balancing if database connection drops.
- **Metrics Endpoint (`GET /api/health`)**: Reports memory RSS/heap, server uptime, and environment metrics for CloudWatch/Datadog scraping.
- **Graceful Shutdown**: Traps `SIGTERM` sent by Kubernetes during rolling deployments, closes HTTP listener to stop new connections, finishes in-flight requests, and cleanly closes MongoDB connection within a 10s grace period.

---

## 4. Quickstart Guide

### 1. Run Entire Stack with Docker Compose (Local Cloud)
```bash
# 1. Clone repository & configure environment
cp .env.example .env
# Edit .env and insert your GEMINI_API_KEY

# 2. Build and start all 3 tiers (frontend, backend, database)
docker compose up --build -d

# 3. Check health and container status
docker compose ps

# 4. Access the application:
# Frontend UI: http://localhost (or http://localhost:3000)
# Backend Health Check: http://localhost:5000/healthz
# Detailed Observability Metrics: http://localhost:5000/api/health
```

### 2. Deploy to Kubernetes (Minikube / EKS / GKE)
```bash
# Declaratively deploy entire architecture in 1 command:
kubectl apply -k k8s/

# Verify all pods, services, and HPA are running:
kubectl get pods,svc,hpa -n medisense-ai

# Check backend rollout status:
kubectl rollout status deployment/medisense-backend -n medisense-ai
```

---

## 5. Demandbase Cloud Role Interview Talking Points

### Q1: "Why did you use a multi-stage Docker build instead of a single Dockerfile?"
> *"In a production cloud environment, image size directly impacts attack surface, pull times across our Kubernetes nodes, and storage costs in Amazon ECR / GHCR. For the React frontend, building with a full Node.js environment requires ~600MB. With a multi-stage build, Stage 1 compiles the bundle, and Stage 2 copies only the optimized static files into `nginx:alpine`, reducing the production image to under 30MB with zero devDependencies."*

### Q2: "Why did you use a StatefulSet for MongoDB instead of a regular Deployment?"
> *"Databases are stateful and require predictable network identities and stable persistent storage. A Kubernetes Deployment treats pods as interchangeable and ephemeral. A StatefulSet guarantees ordered deployment (`mongodb-0`), stable DNS through a Headless Service, and dedicated VolumeClaimTemplates so data volumes are never accidentally detached or overwritten during rolling updates."*

### Q3: "How do you achieve Zero-Downtime deployments?"
> *"In `k8s/backend-deployment.yaml`, we configure a RollingUpdate strategy with `maxSurge: 1` and `maxUnavailable: 0`. Kubernetes spins up a new pod first. The new pod is only registered in the Service load balancer once its readiness probe (`/readyz`) confirms that MongoDB is connected and ready. Furthermore, our Node.js app handles `SIGTERM` signals to cleanly drain existing connections before shutting down."*

### Q4: "How is healthcare data (HIPAA) secured in this containerized setup?"
> *"1. Containers run as an unprivileged non-root user (`node` UID 1000) with `allowPrivilegeEscalation: false`.*
> *2. In-flight encryption: TLS termination at the Ingress layer and strict HTTPS.*
> *3. Network isolation: Database and backend reside on internal cluster subnets without public IPs.*
> *4. Secret segregation: API keys and database credentials are never baked into Docker images; they are injected at runtime via Kubernetes Secrets or External Secrets Operator from AWS Secrets Manager."*

### Q5: "How does the Nginx reverse proxy help in a cloud architecture?"
> *"Rather than exposing the backend API directly to the public internet or dealing with brittle cross-origin (CORS) rules between different domains, Nginx acts as an edge gateway. Web clients access `https://domain.com/` for static assets and `https://domain.com/api/*` for REST endpoints. Nginx routes traffic internally, optimizes TCP connections, handles gzip compression, and enforces security headers."*
