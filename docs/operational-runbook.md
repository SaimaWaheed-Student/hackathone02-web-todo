# Todo Chatbot Kubernetes Operational Runbook

## Daily Operations

### Monitoring Application Health

```bash
# Check all resources
kubectl get all -n todo-chatbot

# Check resource utilization
kubectl top pods -n todo-chatbot

# Check application logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-chatbot --tail=20
kubectl logs -l app.kubernetes.io/component=backend -n todo-chatbot --tail=20
kubectl logs -l app.kubernetes.io/component=database -n todo-chatbot --tail=20
```

### Scaling Applications

```bash
# Scale frontend deployment
kubectl scale deployment/todo-chatbot-frontend -n todo-chatbot --replicas=3

# Scale backend deployment
kubectl scale deployment/todo-chatbot-backend -n todo-chatbot --replicas=2
```

### Restarting Components

```bash
# Restart all pods in a deployment
kubectl rollout restart deployment/todo-chatbot-frontend -n todo-chatbot
kubectl rollout restart deployment/todo-chatbot-backend -n todo-chatbot

# Wait for rollout to complete
kubectl rollout status deployment/todo-chatbot-frontend -n todo-chatbot
```

## Backup and Recovery

### Database Backup

```bash
# Get into the database pod
kubectl exec -it $(kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=database -o jsonpath='{.items[0].metadata.name}') -n todo-chatbot -- /bin/bash

# Inside the pod, create a backup
pg_dump -h localhost -U todo_user -d todo_db > /tmp/backup.sql
exit

# Copy backup file from pod to local machine
kubectl cp todo-chatbot/$(kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=database -o jsonpath='{.items[0].metadata.name}'):/tmp/backup.sql ./backup.sql
```

### Restoring Database

```bash
# Copy backup file to pod
kubectl cp ./backup.sql todo-chatbot/$(kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=database -o jsonpath='{.items[0].metadata.name}'):/tmp/backup.sql

# Get into the database pod and restore
kubectl exec -it $(kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=database -o jsonpath='{.items[0].metadata.name}') -n todo-chatbot -- /bin/bash
psql -h localhost -U todo_user -d todo_db < /tmp/backup.sql
exit
```

## Monitoring and Alerting

### Key Metrics to Monitor

- **CPU/Memory Usage**: `kubectl top pods -n todo-chatbot`
- **Pod Status**: `kubectl get pods -n todo-chatbot`
- **Application Logs**: `kubectl logs -n todo-chatbot`
- **Resource Quotas**: `kubectl describe quota -n todo-chatbot`

### Alert Conditions

- Pod restarts exceeding 5 times in 1 hour
- CPU usage consistently above 80%
- Memory usage consistently above 90%
- Database connection failures
- Application response times above 3 seconds

## Common Troubleshooting Scenarios

### Scenario 1: Application Not Responding

**Symptoms**:
- Users cannot access the application
- Frontend or backend services returning errors

**Steps to Diagnose**:
```bash
# Check pod status
kubectl get pods -n todo-chatbot

# Check service status
kubectl get svc -n todo-chatbot

# Check if pods are in CrashLoopBackOff
kubectl describe pods -n todo-chatbot

# Check application logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-chatbot
kubectl logs -l app.kubernetes.io/component=backend -n todo-chatbot
```

**Resolution**:
- If pods are crashing, check logs for errors
- If resource limits are too low, increase CPU/memory requests
- If environment variables are incorrect, update ConfigMaps/Secrets and restart deployments

### Scenario 2: Database Connection Issues

**Symptoms**:
- Backend logs showing database connection errors
- Application features related to data not working

**Steps to Diagnose**:
```bash
# Check database pod status
kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=database

# Check database logs
kubectl logs -l app.kubernetes.io/component=database -n todo-chatbot

# Test connectivity from backend pod
kubectl exec -it $(kubectl get pods -n todo-chatbot -l app.kubernetes.io/component=backend -o jsonpath='{.items[0].metadata.name}') -n todo-chatbot -- /bin/bash
# Inside the pod, test database connectivity
psql -h todo-chatbot-postgresql -U todo_user -d todo_db -c "\dt"
```

**Resolution**:
- Ensure database pod is running
- Verify database credentials in secrets
- Check network policies if they restrict communication

### Scenario 3: High Resource Usage

**Symptoms**:
- Application slow to respond
- Pods being killed due to resource limits

**Steps to Diagnose**:
```bash
# Check resource usage
kubectl top pods -n todo-chatbot

# Check resource limits and requests
kubectl describe pods -n todo-chatbot

# Check if pods are being OOMKilled
kubectl describe pod <pod-name> -n todo-chatbot
```

**Resolution**:
- Increase resource limits in values file and upgrade Helm release
- Optimize application code for better resource usage
- Implement horizontal pod autoscaling

## Maintenance Procedures

### Updating Application Versions

```bash
# Update image tags in values file
helm upgrade todo-chatbot ./todo-chatbot --namespace todo-chatbot --set frontend.image.tag=new-version --set backend.image.tag=new-version

# Or update values file and use it
helm upgrade todo-chatbot ./todo-chatbot --namespace todo-chatbot --values values-new.yaml
```

### Security Updates

```bash
# Scan images for vulnerabilities (requires trivy or similar tool)
trivy image todo-frontend:latest
trivy image todo-backend:latest

# Update base images in Dockerfiles and rebuild
# Then upgrade Helm release with new image tags
```

### Cleaning Up

```bash
# Remove old pods that are no longer part of deployment
kubectl delete pods --field-selector=status.phase!=Running -n todo-chatbot

# Clean up old configmaps/secrets if needed
kubectl delete configmap,secret --selector=app.kubernetes.io/instance=todo-chatbot -n todo-chatbot
```

## Emergency Procedures

### Complete Application Recovery

If the entire application needs to be restored:

1. **Backup Current State**:
   ```bash
   kubectl get all,configmap,secret,pvc -n todo-chatbot -o yaml > backup.yaml
   ```

2. **Uninstall Application**:
   ```bash
   helm uninstall todo-chatbot -n todo-chatbot
   ```

3. **Reinstall Application**:
   ```bash
   helm install todo-chatbot ./todo-chatbot --namespace todo-chatbot --values values-dev.yaml
   ```

4. **Restore Data** (if needed):
   - Restore database from backup as described in the backup section

### Database Disaster Recovery

If the database is corrupted:

1. **Stop all applications**:
   ```bash
   kubectl scale deployment/todo-chatbot-backend -n todo-chatbot --replicas=0
   kubectl scale deployment/todo-chatbot-frontend -n todo-chatbot --replicas=0
   ```

2. **Delete and recreate database**:
   ```bash
   kubectl delete pvc -l app.kubernetes.io/component=database -n todo-chatbot
   kubectl delete statefulset/todo-chatbot-postgresql -n todo-chatbot
   # Recreate from backup
   ```

3. **Resume applications**:
   ```bash
   kubectl scale deployment/todo-chatbot-backend -n todo-chatbot --replicas=1
   kubectl scale deployment/todo-chatbot-frontend -n todo-chatbot --replicas=1
   ```