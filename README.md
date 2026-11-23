# MediSense AI - Cloud-Native Medical Report Analyzer

[![Cloud-Native](https://img.shields.io/badge/Architecture-Cloud--Native-blue.svg)](docs/CLOUD_ARCHITECTURE.md)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Builds-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Production%20Manifests-326CE5?logo=kubernetes&logoColor=white)](k8s/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/cloud-ci-cd.yml)

MediSense AI is a full-stack, cloud-native medical intelligence application designed to analyze complex medical reports, blood tests, and prescriptions using Google Gemini AI, containerized for enterprise scalability on **Docker** and **Kubernetes**.

> 💡 **Applying for Cloud / DevOps Roles?** Read the detailed **[Cloud Architecture & Interview Guide](docs/CLOUD_ARCHITECTURE.md)** covering Kubernetes, container security, zero-downtime deployments, and cloud observability.

---

## 🌟 Key Features
- 📄 **Smart Medical Document Extraction:** Drag-and-drop PDFs and lab reports with in-memory parsing.
- 🧠 **Gemini AI Medical Intelligence:** Powered by Google Gemini 2.5 Flash with structured medical JSON formatting.
- 🐳 **Cloud-Native Containerization:** Production multi-stage Dockerfiles with non-root security compliance and Alpine runtime.
- ☸️ **Enterprise Kubernetes Orchestration:** Zero-downtime rolling updates, StatefulSet database management, HPA auto-scaling (2-10 pods), and Ingress routing.
- 🔄 **Nginx Edge Reverse Proxy:** Built-in edge gateway eliminating CORS issues and serving optimized, compressed assets.
- 📊 **Cloud Observability:** Liveness (`/healthz`), Readiness (`/readyz`), and runtime telemetry (`/api/health`).

---

## 🏗️ System Architecture

```
[ Clients / Web Browsers ]
            │ (Port 80 / 443)
            ▼
┌────────────────────────────────────────────────────────┐
│               Nginx Edge Reverse Proxy                 │
│   ├── Static Assets (React SPA) -> /                   │
│   └── API Gateway               -> /api/*              │
└───────────────────────────┬────────────────────────────┘
                            │ (Internal Network)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Node.js / Express API Service              │
│   ├── Probes: /healthz (Liveness), /readyz (Readiness) │
│   └── Gemini 2.5 Flash AI Processing Engine            │
└───────────────────────────┬────────────────────────────┘
                            │ (Internal DNS)
                            ▼
┌────────────────────────────────────────────────────────┐
│          MongoDB 7.0 Stateful Database Service         │
│   └── Persistent Storage Volume (Data Persistence)     │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Cloud with Docker Compose)

The fastest way to run the entire distributed platform locally:

### 1. Configure Environment
```bash
# Copy sample environment configuration
cp .env.example .env
```
Edit `.env` and set your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Launch the Application Stack
```bash
docker compose up --build -d
```

### 3. Verify System Health
```bash
docker compose ps
```
- **Web Interface:** [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
- **API Health Check:** [http://localhost:5000/healthz](http://localhost:5000/healthz)
- **Observability Metrics:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ☸️ Kubernetes Deployment

Deploy the entire stack to any CNCF-compliant Kubernetes cluster (Minikube, EKS, GKE, AKS) using Kustomize:

```bash
# 1. Deploy all manifests (Namespace, Secrets, Deployments, StatefulSet, HPA, Ingress)
kubectl apply -k k8s/

# 2. Check rollout status
kubectl rollout status deployment/medisense-backend -n medisense-ai
kubectl rollout status deployment/medisense-frontend -n medisense-ai

# 3. View all cluster resources
kubectl get all -n medisense-ai
```

---

## 🛠️ Tech Stack & DevOps Tooling

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS v4, Recharts, Framer Motion |
| **Edge Web Server** | Nginx 1.27 Alpine (Reverse Proxy, Gzip, Security Headers) |
| **Backend API** | Node.js 20, Express, Multer, Mongoose |
| **Database** | MongoDB 7.0 (StatefulSet with Persistent Volume Claim) |
| **AI Engine** | Google Gemini 2.5 Flash API (`@google/genai`) |
| **Containerization** | Docker (Multi-stage builds, Alpine, `tini` signal handling) |
| **Local Orchestration** | Docker Compose v2 (Health checks, Bridge network, Named volumes) |
| **Cloud Orchestration** | Kubernetes (Deployments, StatefulSets, Services, Ingress, HPA, PDB) |
| **CI/CD Automation** | GitHub Actions (Linting, Trivy security scanning, Docker buildx) |

---

## 📂 Repository Structure

```
├── .github/workflows/
│   └── cloud-ci-cd.yml          # Automated CI/CD pipeline (Trivy, Docker Buildx, K8s lint)
├── docs/
│   └── CLOUD_ARCHITECTURE.md    # In-depth Cloud Architecture & Demandbase Interview Guide
├── k8s/                         # Kubernetes manifests
│   ├── namespace.yaml           # medisense-ai namespace
│   ├── configmap.yaml           # Application runtime configurations
│   ├── secrets.yaml             # Encrypted secrets template
│   ├── mongodb-statefulset.yaml # Database StatefulSet with PVC and Headless Service
│   ├── backend-deployment.yaml  # API Deployment (2 replicas, rolling update, probes)
│   ├── frontend-deployment.yaml # Nginx UI Deployment (2 replicas)
│   ├── ingress.yaml             # Ingress with path-based routing & TLS
│   ├── hpa-pdb.yaml             # Horizontal Pod Autoscaler & Pod Disruption Budget
│   └── kustomization.yaml       # Kustomize root manifest
├── server/                      # Express Backend
│   ├── Dockerfile               # Multi-stage hardened Node.js Alpine container
│   ├── .dockerignore
│   ├── server.js                # Server with /healthz, /readyz, & graceful shutdown
│   └── package.json
├── src/                         # React Frontend SPA
├── Dockerfile                   # Frontend multi-stage Dockerfile (Node build -> Nginx)
├── nginx.conf                   # Custom Nginx reverse proxy configuration
├── docker-compose.yml           # Multi-tier local orchestration
├── .env.example                 # Standardized environment template
└── README.md
```

---

## 📄 License
ISC License
