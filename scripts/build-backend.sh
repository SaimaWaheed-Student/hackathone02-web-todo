#!/bin/bash

# Script to build the backend Docker image for Kubernetes deployment

set -e

IMAGE_NAME="${1:-todo-backend}"
TAG="${2:-latest}"

echo "Building backend image: $IMAGE_NAME:$TAG"

# Build the Docker image
docker build -t "$IMAGE_NAME:$TAG" ../backend/

echo "Backend image built successfully: $IMAGE_NAME:$TAG"