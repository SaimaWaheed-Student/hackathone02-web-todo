#!/bin/bash

# Script to build the frontend Docker image for Kubernetes deployment

set -e

IMAGE_NAME="${1:-todo-frontend}"
TAG="${2:-latest}"

echo "Building frontend image: $IMAGE_NAME:$TAG"

# Build the Docker image
docker build -t "$IMAGE_NAME:$TAG" ../frontend/

echo "Frontend image built successfully: $IMAGE_NAME:$TAG"