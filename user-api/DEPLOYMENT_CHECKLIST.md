# GCP User API Deployment Checklist

## Pre-Deployment

- [ ] Node.js >= 20.0.0 instalado
- [ ] gcloud CLI instalado y configurado
- [ ] Acceso a GCP project
- [ ] MongoDB Atlas cuenta activa
- [ ] Docker instalado (para test local)

## Local Development

- [ ] npm install ejecutado
- [ ] .env.development configurado
- [ ] MongoDB local O MongoDB Atlas conexión verificada
- [ ] npm run dev ejecutado sin errores
- [ ] POST /api/v2/users y GET /api/v2/users funcionan
- [ ] /health endpoint responde 200

## MongoDB Setup

- [ ] MongoDB Atlas cluster creado
- [ ] Database user creado (user_api_prod)
- [ ] Connection string obtenida
- [ ] IP whitelist configurado (0.0.0.0/0 o específica)
- [ ] Prueba de conexión exitosa

## GCP Configuration

- [ ] GCP project seleccionado: `gcloud config set project YOUR_PROJECT_ID`
- [ ] Permisos:
  - [ ] Cloud Run Developer
  - [ ] Service Account User
  - [ ] Container Registry Service Agent

## Docker Build & Push

- [ ] Dockerfile de multi-stage verificado
- [ ] Docker build exitoso localmente: `docker build -t user-api:latest .`
- [ ] Container test local: `docker run -p 3002:8080 user-api:latest`

```bash
# Build & test local
docker build -t user-api:test .
docker run -p 3002:8080 \
  -e MONGODB_URI="your-mongodb-uri" \
  user-api:test
```

## GCP Container Registry

- [ ] Enable Container Registry API
- [ ] Configure Docker auth: `gcloud auth configure-docker`
- [ ] Tag image: `docker tag user-api:latest gcr.io/PROJECT_ID/user-api:latest`
- [ ] Push image: `docker push gcr.io/PROJECT_ID/user-api:latest`

```bash
# Verify push
gcloud container images list --repository=gcr.io/PROJECT_ID
```

## Cloud Run Deployment

- [ ] Cloud Run API habilitado
- [ ] Service account creado (o usar default)
- [ ] Deploy inicial:

```bash
gcloud run deploy user-api \
  --image gcr.io/PROJECT_ID/user-api:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,MONGODB_URI="your-mongodb-uri" \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60
```

- [ ] Obtener service URL: `gcloud run services describe user-api --platform managed --region us-central1 --format 'value(status.url)'`
- [ ] Test health: `curl https://user-api-xxxxx.a.run.app/health`

## Networking & Security

- [ ] Firewall rules permitir AWS: `gcloud compute firewall-rules create allow-from-aws --allow=tcp:443 --source-ranges=0.0.0.0/0`
- [ ] CORS configurado en server.js para Order API
- [ ] SSL/TLS certificado válido (automático en Cloud Run)
- [ ] API keys configurados (si aplica)

## Secrets & Credentials

- [ ] MongoDB URI en Secret Manager: `gcloud secrets create mongodb-uri --data-file=-`
- [ ] Grant permissions: `gcloud secrets add-iam-policy-binding mongodb-uri --member="serviceAccount:user-api@PROJECT_ID.iam.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"`

## Auto-Scaling

- [ ] Min instances: 1 (warm start)
- [ ] Max instances: 10 (limit costs)
- [ ] CPU utilization threshold: 70%
- [ ] Memory utilization threshold: 80%

```bash
gcloud run deploy user-api \
  --min-instances 1 \
  --max-instances 10 \
  --region us-central1
```

## Monitoring

- [ ] Cloud Logging habilitado
- [ ] Log streams verificados
- [ ] Cloud Monitoring dashboard creado
- [ ] Error alerts configuradas (threshold: > 5 errors/min)
- [ ] Uptime checks configurados

```bash
# Ver logs real-time
gcloud run logs read user-api --follow --limit 50
```

## CI/CD Pipeline

- [ ] cloudbuild.yaml en repo
- [ ] GitHub webhook configurado
- [ ] Cloud Build triggers habilitados
- [ ] Test automatizado pre-deployment

```bash
# Trigger manual
gcloud builds submit --config=cloudbuild.yaml
```

## Inter-Cloud Integration

- [ ] Order API URL conocida (Sebas)
- [ ] CORS headers configurados
- [ ] Test de llamada desde Order API:

```bash
curl -X POST https://user-api-xxxxx.a.run.app/api/v2/users/message \
  -H "Content-Type: application/json" \
  -d '{"data":{"product":{"name":"Test"},"order":{"id":"123"}}}'
```

## Performance Testing

- [ ] Load test basic: `ab -n 1000 -c 10 https://user-api-xxxxx.a.run.app/health`
- [ ] Response time < 500ms
- [ ] Latency acceptable para inter-cloud calls
- [ ] Memory usage < 300Mi (under load)

## Backup & Recovery

- [ ] MongoDB Atlas backups habilitados
- [ ] Point-in-time recovery configurado (30 días)
- [ ] Test restore en database alternativa
- [ ] Data export a Cloud Storage (si aplica)

```bash
# Backup manual
mongodump --uri "your-mongodb-uri"
```

## Documentation

- [ ] README.md actualizado
- [ ] Deployment steps documentados
- [ ] Troubleshooting guide available
- [ ] Team notificado del nuevo endpoint
- [ ] API documentation (OpenAPI/Swagger) generada

## Post-Deployment

- [ ] Smoke tests exitosos
- [ ] Health checks verdes
- [ ] No errores en logs
- [ ] Response times aceptables
- [ ] Database connectivity confirmada
- [ ] Inter-cloud communication working
- [ ] Team notificado de go-live

## Rollback Plan

- [ ] Previous version image available
- [ ] Rollback command ready: `gcloud run deploy user-api --image gcr.io/PROJECT_ID/user-api:previous`
- [ ] Data migration rollback plan (si aplica)
- [ ] Communication plan para incident

## Maintenance

- [ ] Monthly security updates scheduled
- [ ] Database optimization plan
- [ ] Log retention policy (30 días default)
- [ ] Cost monitoring configured
- [ ] Performance baseline established

---

**Deployed by**: Yécid
**Date**: [YYYY-MM-DD]
**Status**: ☐ Ready / ☑ Deployed / ☐ Rolled Back
