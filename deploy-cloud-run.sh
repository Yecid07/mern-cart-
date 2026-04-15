#!/bin/bash

# Cloud Run Deployment Script for Cart API
# Usage: ./deploy-cloud-run.sh <project-id> <service-name>

set -e

PROJECT_ID=${1:-yecid-gcp-project}
SERVICE_NAME=${2:-cart-api-orders}
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Cart API to Cloud Run"
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Step 1: Authenticate with GCP
echo "1️⃣ Setting GCP project..."
gcloud config set project $PROJECT_ID

# Step 2: Build Docker image
echo "2️⃣ Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Step 3: Configure Docker authentication
echo "3️⃣ Configuring Docker authentication for GCP..."
gcloud auth configure-docker gcr.io

# Step 4: Push image to Container Registry
echo "4️⃣ Pushing image to Container Registry..."
docker push $IMAGE_NAME:latest

# Step 5: Deploy to Cloud Run
echo "5️⃣ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=$MONGODB_URI,NODE_ENV=production" \
  --cpu 1 \
  --memory 512Mi \
  --timeout 60 \
  --max-instances 100

# Step 6: Get the service URL
echo "6️⃣ Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format 'value(status.url)')

echo ""
echo "✅ Deployment completed!"
echo "📍 Service URL: $SERVICE_URL"
echo ""
echo "Test the API:"
echo "  GET  $SERVICE_URL/"
echo "  GET  $SERVICE_URL/api/v2/orders"
echo "  POST $SERVICE_URL/api/v2/mensaje"
