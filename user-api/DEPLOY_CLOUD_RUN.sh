# GCP User API - Cloud Run Deployment Guide
# Guía para desplegar User API en GCP Cloud Run

gcloud config set project YOUR_PROJECT_ID

# 1. Crear el servicio en Cloud Run
gcloud run deploy user-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/users_db" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 100 \
  --min-instances 1

# 2. Obtener la URL del servicio
gcloud run services describe user-api --platform managed --region us-central1 --format 'value(status.url)'

# 3. Configurar IAM para permitir acceso desde AWS
gcloud run services add-iam-policy-binding user-api \
  --platform managed \
  --region us-central1 \
  --member='serviceAccount:order-api@your-gcp-project.iam.gserviceaccount.com' \
  --role='roles/run.invoker'

# 4. Ver logs
gcloud run services logs read user-api --region us-central1 --limit 50

# 5. Actualizar servicio
gcloud run deploy user-api \
  --image gcr.io/YOUR_PROJECT_ID/user-api:latest \
  --region us-central1

# 6. Eliminar servicio
gcloud run services delete user-api --region us-central1
