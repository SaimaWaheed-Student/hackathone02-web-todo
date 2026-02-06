#!/bin/bash

# Script to uninstall the Todo Chatbot application from Kubernetes

set -e

RELEASE_NAME="${1:-todo-chatbot}"
NAMESPACE="${2:-todo-chatbot}"

echo "Uninstalling $RELEASE_NAME from namespace $NAMESPACE..."

# Uninstall the Helm release
helm uninstall "$RELEASE_NAME" --namespace "$NAMESPACE" || true

# Delete the namespace if it exists
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo "Uninstallation completed."