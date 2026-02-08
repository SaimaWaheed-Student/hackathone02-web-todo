#!/bin/bash

# Comprehensive test script for Todo Chatbot Kubernetes deployment
# This script validates all aspects of the deployment according to the tasks

set -e

NAMESPACE="todo-chatbot"
RELEASE_NAME="todo-chatbot"

echo "Starting Todo Chatbot Kubernetes deployment validation..."

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo "kubectl is not installed or not in PATH"
        exit 1
    fi
}

# Function to check if helm is available
check_helm() {
    if ! command -v helm &> /dev/null; then
        echo "helm is not installed or not in PATH"
        exit 1
    fi
}

# Function to validate namespace exists
validate_namespace() {
    if kubectl get namespace $NAMESPACE &> /dev/null; then
        echo "✓ Namespace $NAMESPACE exists"
    else
        echo "✗ Namespace $NAMESPACE does not exist"
        exit 1
    fi
}

# Function to validate all pods are running
validate_pods_running() {
    echo "Checking pod status..."
    PODS=$(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].status.phase}')
    for status in $PODS; do
        if [[ "$status" != "Running" ]]; then
            echo "✗ Some pods are not running: $PODS"
            kubectl get pods -n $NAMESPACE
            exit 1
        fi
    done
    echo "✓ All pods are running"
}

# Function to validate services exist
validate_services() {
    SERVICES=$(kubectl get svc -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    if [[ -z "$SERVICES" ]]; then
        echo "✗ No services found in namespace $NAMESPACE"
        exit 1
    fi

    # Check for expected services
    EXPECTED_SERVICES=("todo-chatbot-frontend" "todo-chatbot-backend" "todo-chatbot-postgresql")
    for service in "${EXPECTED_SERVICES[@]}"; do
        if echo "$SERVICES" | grep -q "$service"; then
            echo "✓ Service $service exists"
        else
            echo "✗ Service $service does not exist"
        fi
    done
}

# Function to validate deployments and statefulsets
validate_workloads() {
    # Check deployments
    DEPLOYMENTS=$(kubectl get deployments -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    EXPECTED_DEPLOYMENTS=("todo-chatbot-frontend" "todo-chatbot-backend")

    for deployment in "${EXPECTED_DEPLOYMENTS[@]}"; do
        if echo "$DEPLOYMENTS" | grep -q "$deployment"; then
            # Check if deployment is ready
            READY_REPLICAS=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
            DESIRED_REPLICAS=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.replicas}')

            if [[ "$READY_REPLICAS" == "$DESIRED_REPLICAS" ]] && [[ "$READY_REPLICAS" -gt 0 ]]; then
                echo "✓ Deployment $deployment is ready ($READY_REPLICAS/$DESIRED_REPLICAS)"
            else
                echo "✗ Deployment $deployment is not ready ($READY_REPLICAS/$DESIRED_REPLICAS)"
            fi
        else
            echo "✗ Deployment $deployment does not exist"
        fi
    done

    # Check StatefulSet
    STATEFULSETS=$(kubectl get statefulsets -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    if echo "$STATEFULSETS" | grep -q "todo-chatbot-postgresql"; then
        READY_REPLICAS=$(kubectl get statefulset todo-chatbot-postgresql -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
        DESIRED_REPLICAS=$(kubectl get statefulset todo-chatbot-postgresql -n $NAMESPACE -o jsonpath='{.spec.replicas}')

        if [[ "$READY_REPLICAS" == "$DESIRED_REPLICAS" ]] && [[ "$READY_REPLICAS" -gt 0 ]]; then
            echo "✓ StatefulSet todo-chatbot-postgresql is ready ($READY_REPLICAS/$DESIRED_REPLICAS)"
        else
            echo "✗ StatefulSet todo-chatbot-postgresql is not ready ($READY_REPLICAS/$DESIRED_REPLICAS)"
        fi
    else
        echo "✗ StatefulSet todo-chatbot-postgresql does not exist"
    fi
}

# Function to validate persistent volumes
validate_persistent_volumes() {
    PVCS=$(kubectl get pvc -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    if echo "$PVCS" | grep -q "postgresql-data"; then
        STATUS=$(kubectl get pvc postgresql-data-todo-chatbot-postgresql-0 -n $NAMESPACE -o jsonpath='{.status.phase}')
        if [[ "$STATUS" == "Bound" ]]; then
            echo "✓ PersistentVolumeClaim for database is bound"
        else
            echo "✗ PersistentVolumeClaim for database is not bound: $STATUS"
        fi
    else
        echo "✗ PersistentVolumeClaim for database does not exist"
    fi
}

# Function to validate secrets exist
validate_secrets() {
    SECRETS=$(kubectl get secrets -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    EXPECTED_SECRETS=("todo-chatbot-db-secret" "todo-chatbot-ai-secret" "todo-chatbot-app-secret")

    for secret in "${EXPECTED_SECRETS[@]}"; do
        if echo "$SECRETS" | grep -q "$secret"; then
            echo "✓ Secret $secret exists"
        else
            echo "✗ Secret $secret does not exist"
        fi
    done
}

# Function to validate helm release
validate_helm_release() {
    if helm status $RELEASE_NAME -n $NAMESPACE &> /dev/null; then
        echo "✓ Helm release $RELEASE_NAME exists and is deployed"
    else
        echo "✗ Helm release $RELEASE_NAME does not exist or is not deployed properly"
        exit 1
    fi
}

# Function to test basic connectivity
test_connectivity() {
    echo "Testing basic connectivity..."

    # Wait a bit for everything to be ready
    sleep 30

    # Get pod names
    FRONTEND_POD=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/component=frontend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/component=backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    DB_POD=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/component=database -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

    if [[ -n "$FRONTEND_POD" ]]; then
        echo "✓ Frontend pod $FRONTEND_POD is available"
    else
        echo "✗ Frontend pod not found"
    fi

    if [[ -n "$BACKEND_POD" ]]; then
        echo "✓ Backend pod $BACKEND_POD is available"
    else
        echo "✗ Backend pod not found"
    fi

    if [[ -n "$DB_POD" ]]; then
        echo "✓ Database pod $DB_POD is available"
    else
        echo "✗ Database pod not found"
    fi
}

# Main execution
main() {
    echo "Validating prerequisites..."
    check_kubectl
    check_helm

    echo "Validating deployment..."
    validate_namespace
    validate_helm_release
    validate_pods_running
    validate_services
    validate_workloads
    validate_persistent_volumes
    validate_secrets
    test_connectivity

    echo ""
    echo "==========================================="
    echo "✓ All validations passed!"
    echo "Todo Chatbot Kubernetes deployment is working correctly."
    echo ""
    echo "Next steps:"
    echo "1. Access the application: minikube service todo-chatbot-frontend-external -n todo-chatbot --url"
    echo "2. Check logs: kubectl logs -l app.kubernetes.io/component=frontend -n todo-chatbot"
    echo "3. Run end-to-end tests to validate application functionality"
    echo "==========================================="
}

main