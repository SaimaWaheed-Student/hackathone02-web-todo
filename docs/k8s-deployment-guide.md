# Todo Chatbot Kubernetes Deployment Guide

## Prerequisites

- Minikube v1.25+
- Helm v3.x
- kubectl v1.25+
- Docker (latest stable)

## Installation Steps

### 1. Start Minikube with Adequate Resources

```bash
minikube start --memory=4096mb --cpus=2
```

### 2. Enable Required Minikube Addons

```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

### 3. Set Docker Context to Minikube

```bash
eval $(minikube docker-env)
```

### 4. Build Docker Images

```bash
# From the project root directory
cd scripts/
./build-frontend.sh todo-frontend dev-latest
./build-backend.sh todo-backend dev-latest
```

### 5. Create Namespace

```bash
kubectl create namespace todo-chatbot --dry-run=client -o yaml | kubectl apply -f -
```

### 6. Deploy Using Helm

```bash
# From the project root directory
cd specs/todo-chatbot-k8s-deployment/helm/

# Deploy with development values
helm install todo-chatbot ./todo-chatbot --namespace todo-chatbot --values ./todo-chatbot/values-dev.yaml

# Or deploy with staging values
# helm install todo-chatbot ./todo-chatbot --namespace todo-chatbot --values ./todo-chatbot/values-staging.yaml
```

### 7. Verify Deployment

```bash
# Check all resources
kubectl get all -n todo-chatbot

# Check status of deployments
kubectl rollout status deployment/todo-chatbot-frontend -n todo-chatbot
kubectl rollout status deployment/todo-chatbot-backend -n todo-chatbot
kubectl rollout status statefulset/todo-chatbot-postgresql -n todo-chatbot

# Check logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-chatbot
kubectl logs -l app.kubernetes.io/component=backend -n todo-chatbot
kubectl logs -l app.kubernetes.io/component=database -n todo-chatbot
```

### 8. Access the Application

```bash
# Get the external URL
minikube service todo-chatbot-frontend-external -n todo-chatbot --url
```

## Configuration Customization

You can customize the deployment by modifying the values files:

- `values.yaml`: Default values for all environments
- `values-dev.yaml`: Development-specific configurations
- `values-staging.yaml`: Staging-specific configurations

### Common Customizations

- Change image tags: Update `frontend.image.tag` and `backend.image.tag`
- Adjust resource limits: Modify `frontend.resources` and `backend.resources`
- Update environment variables: Modify `frontend.env` and `backend.env`
- Configure ingress: Update the `ingress` section

## Upgrading the Deployment

```bash
# Update the Helm release with new values
helm upgrade todo-chatbot ./todo-chatbot --namespace todo-chatbot --values ./todo-chatbot/values-dev.yaml

# Or upgrade with specific values
helm upgrade todo-chatbot ./todo-chatbot --namespace todo-chatbot --set frontend.replicaCount=2
```

## Rolling Back Changes

```bash
# List previous revisions
helm history todo-chatbot --namespace todo-chatbot

# Rollback to a specific revision (e.g., revision 1)
helm rollback todo-chatbot 1 --namespace todo-chatbot
```

## Uninstalling

```bash
# Use the uninstall script
./scripts/uninstall.sh todo-chatbot todo-chatbot

# Or manually uninstall
# helm uninstall todo-chatbot --namespace todo-chatbot
# kubectl delete namespace todo-chatbot
```

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure you've run `eval $(minikube docker-env)` before building images
2. **Database connection errors**: Check that the database StatefulSet is ready before deploying the backend
3. **Service unavailable**: Verify that all deployments are in "Running" status

### Useful Commands

```bash
# Check pod status
kubectl get pods -n todo-chatbot

# Describe a specific pod for detailed information
kubectl describe pod <pod-name> -n todo-chatbot

# Follow logs in real-time
kubectl logs -f <pod-name> -n todo-chatbot

# Execute commands inside a pod
kubectl exec -it <pod-name> -n todo-chatbot -- /bin/sh

# Check resource usage
kubectl top pods -n todo-chatbot
```

## Health Checks

The applications include health check endpoints:
- Frontend: TCP socket check on port 7860
- Backend: HTTP GET request to `/health` endpoint
- Database: PostgreSQL readiness probe using `pg_isready`

These are configured in the Helm templates and will automatically restart unhealthy pods.