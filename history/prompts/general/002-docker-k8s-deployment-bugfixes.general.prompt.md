---
id: 002
title: Docker K8s Deployment Bugfixes
stage: general
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: none
branch: 003-professional-ui-ux
user: saima waheed
command: implement deployment plan
labels: ["docker", "kubernetes", "deployment", "bugfix", "minikube"]
links:
  spec: null
  ticket: null
  adr: null
  pr: https://github.com/SaimaWaheed-Student/hackathone02-web-todo/pull/2
files:
  - docker-compose.yml
  - frontend/Dockerfile
  - backend/app/main.py
  - specs/todo-chatbot-k8s-deployment/helm/todo-chatbot/values-staging.yaml
  - .env.example
tests:
  - Docker Compose build verified (both images built successfully)
---

## Prompt

Implement the following plan:

# Deployment Plan: Docker + Kubernetes (Minikube) - Dev & Staging

## Context
Frontend (Next.js) aur Backend (FastAPI + PostgreSQL) ko Docker Compose aur Kubernetes (Minikube) pe deploy aur test karna hai. Existing Docker/Helm configs mein 5 critical bugs hain jo pehle fix karne honge.

Phase 0: Bug Fixes (5 critical deployment bugs)
Phase 1: Docker Compose Deployment & Test
Phase 2: Minikube Dev Deployment & Test
Phase 3: Minikube Staging Deployment & Test

## Response snapshot

Implemented all 5 Phase 0 bug fixes:
1. **docker-compose.yml backend healthcheck**: Changed `curl -f` to `wget --quiet --tries=1 --spider` (curl not available in python:3.11-slim)
2. **docker-compose.yml frontend healthcheck**: Changed `/healthz` to `/` (Next.js has no /healthz route)
3. **frontend/Dockerfile**: Added `ARG NEXT_PUBLIC_API_URL` before `ENV` to make it build-time overridable; updated docker-compose.yml to use `build.args` instead of runtime `environment`
4. **backend/app/main.py CORS**: Added `http://localhost:7860`, `7861`, `7862`, `7863` to allow_origins for Docker Compose and K8s port-forward
5. **values-staging.yaml**: Changed `pullPolicy: Always` to `IfNotPresent`, `LoadBalancer` to `NodePort`, port `80` to `7860`, disabled ingress/TLS for Minikube

Docker images built successfully (both frontend and backend). Committed all changes and created PR #2.

## Outcome

- Impact: 5 critical deployment bugs fixed, Docker images build successfully
- Tests: Docker build passed for both frontend and backend images
- Files: 4 core files modified + supporting deployment files
- Next prompts: Run Docker Compose deployment test, Minikube dev/staging deployment
- Reflection: Build-time vs runtime env vars in Next.js is a common gotcha; healthcheck tool availability in slim images needs checking

## Evaluation notes (flywheel)

- Failure modes observed: Docker daemon not running initially (needed to start Docker Desktop)
- Graders run and results (PASS/FAIL): Docker build PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Run `docker compose up -d` and verify all 3 containers become healthy
