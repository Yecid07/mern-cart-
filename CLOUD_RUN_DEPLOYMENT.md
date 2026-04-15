# Cloud Run Deployment Guide

## Prerequisites

Before deploying to Cloud Run, you need:

1. **GCP Account & Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use existing)
   - Note your `PROJECT_ID`

2. **gcloud CLI installed**
   ```bash
   # Install gcloud CLI
   # https://cloud.google.com/sdk/docs/install
   
   # Verify installation
   gcloud --version
   ```

3. **Docker installed**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)

4. **MongoDB URI**
   - From MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/cart_production...`

---

## Step-by-Step Deployment

### Step 1: Authenticate with GCP

```bash
gcloud auth login
gcloud config set project YOUR-PROJECT-ID
```

Replace `YOUR-PROJECT-ID` with your actual GCP project ID.

### Step 2: Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  containerregistry.googleapis.com
```

### Step 3: Build Docker Image Locally

```bash
docker build -t cart-api-orders:latest .
```

### Step 4: Tag Image for Container Registry

```bash
docker tag cart-api-orders:latest gcr.io/YOUR-PROJECT-ID/cart-api-orders:latest
```

### Step 5: Configure Docker Authentication

```bash
gcloud auth configure-docker gcr.io
```

### Step 6: Push Image to Container Registry

```bash
docker push gcr.io/YOUR-PROJECT-ID/cart-api-orders:latest
```

### Step 7: Deploy to Cloud Run

```bash
gcloud run deploy cart-api-orders \
  --image gcr.io/YOUR-PROJECT-ID/cart-api-orders:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=YOUR-MONGODB-URI,NODE_ENV=production" \
  --cpu 1 \
  --memory 512Mi \
  --timeout 60 \
  --max-instances 100
```

**Important**: Replace:
- `YOUR-PROJECT-ID` with your GCP project ID
- `YOUR-MONGODB-URI` with your MongoDB Atlas connection string

### Step 8: Verify Deployment

```bash
# Get the service URL
gcloud run services describe cart-api-orders \
  --region us-central1 \
  --format 'value(status.url)'

# Test the API
curl https://cart-api-orders-XXXXX.run.app/
```

---

## Using the Deploy Script (Alternative)

```bash
# Make script executable
chmod +x deploy-cloud-run.sh

# Deploy with your project ID
./deploy-cloud-run.sh your-project-id cart-api-orders
```

The script will prompt you for MongoDB URI if not already set.

---

## Configuration

### Environment Variables

Set these in Cloud Run:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port (auto-set to 8080 by Cloud Run) | `8080` |

### Updating Environment Variables

```bash
gcloud run deploy cart-api-orders \
  --region us-central1 \
  --update-env-vars MONGODB_URI=your-new-uri
```

---

## Testing the API

Once deployed, test these endpoints:

```bash
# Root endpoint
curl https://cart-api-orders-XXXXX.run.app/

# Get all orders
curl https://cart-api-orders-XXXXX.run.app/api/v2/orders

# Get orders (v1 compatibility)
curl https://cart-api-orders-XXXXX.run.app/api/orders

# Test mensaje endpoint
curl -X POST https://cart-api-orders-XXXXX.run.app/api/v2/mensaje \
  -H "Content-Type: application/json" \
  -d '{
    "entidadA": {"id": "user1", "name": "Santiago User"},
    "entidadB": {"id": "product1", "name": "Sebas Product"}
  }'
```

---

## Troubleshooting

### Build fails with "image not found"
```bash
# Ensure Docker image built successfully
docker build -t cart-api-orders:latest .
```

### Authentication errors
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

### MongoDB connection fails
- Verify MONGODB_URI is correct in Cloud Run environment variables
- Check MongoDB Atlas whitelist includes all IPs (or 0.0.0.0/0)
- Test connection string locally

### Scaling issues
```bash
# View Cloud Run logs
gcloud run services describe cart-api-orders --region us-central1

# View detailed logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=cart-api-orders" --limit 50
```

---

## Next Steps

1. ✅ Verify /api/v2/mensaje endpoint works
2. ✅ Configure inter-cloud communication with Sebas (update their Cloud Run URL in your code)
3. ✅ Set up monitoring/observability
4. ✅ Test full message flow Santiago → Yécid → Sebas → response

---

## Useful Links

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Container Registry](https://cloud.google.com/container-registry)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference/run/deploy)
