# GCP User API - MongoDB Atlas Setup

# 1. Crear MongoDB Atlas Cluster
# Ir a: https://www.mongodb.com/cloud/atlas/register

# 2. Crear base de datos 'users_db'

# 3. Crear usuario de base de datos
# Username: user_api_prod
# Password: [generar contraseña fuerte]

# 4. Whitelist IP Address
# En Atlas → Security → Network Access
# CIDR Block: 0.0.0.0/0 (para cualquier IP)
# O específica: [Tu IP de GCP]

# 5. Obtener Connection String
# En Atlas → Clusters → Connect → Connect your application
# Formato: mongodb+srv://username:password@cluster-xyz.mongodb.net/users_db?retryWrites=true&w=majority

# 6. Crear GCP Secret para almacenar MongoDB URI
gcloud secrets create mongodb-uri --data-file=- <<< "mongodb+srv://user_api_prod:PASSWORD@cluster-xyz.mongodb.net/users_db?retryWrites=true&w=majority"

# 7. Dar acceso al servicio de Cloud Run
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:user-api@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 8. Actualizar Cloud Run para usar el secret
gcloud run deploy user-api \
  --set-env-vars MONGODB_URI="${MONGODB_URI}" \
  --region us-central1
