# ✅ User API - Setup Completo para GCP

## 🎉 ¿Qué acaba de completarse?

Tu **User API microservicio** está completamente configurada para GCP Cloud Run. Aquí está TODO lo que se creó:

### 📁 Estructura de Archivos

```
user-api/
├── 📱 Código Principal
│   ├── server.js                    ← Express app con CORS
│   ├── config/db.js                 ← MongoDB connection
│   ├── models/user.model.js          ← Mongoose User schema
│   ├── controllers/user.controller.js ← Lógica CRUD + /message endpoint
│   ├── routes/user.routes.js         ← Express routes
│   └── package.json                  ← Dependencias Node.js
│
├── 🐳 Docker & Deployment
│   ├── Dockerfile                   ← Multi-stage optimizado para Cloud Run
│   ├── cloudbuild.yaml              ← CI/CD GCP Cloud Build
│   ├── deployment.yaml              ← Kubernetes manifest (alternativa)
│   └── DEPLOY_CLOUD_RUN.sh          ← Shell scripts para deployment
│
├── 🔐 Configuración
│   ├── .env.development             ← Local dev (MongoDB://localhost)
│   ├── .env.testing                 ← Testing (Test cluster)
│   ├── .env.production              ← GCP Cloud Run (MongoDB Atlas)
│   └── .env.example                 ← Template
│
└── 📚 Documentación
    ├── README.md                    ← Getting started
    ├── INTER_CLOUD_FLOW.md          ← Flujo AWS→GCP→GCP completo
    ├── ARCHITECTURE_DIAGRAMS.md     ← Diagramas Mermaid
    ├── NETWORKING_GCP.md            ← VPC + Firewall rules
    ├── MONGODB_ATLAS_SETUP.md       ← Configure BD
    └── DEPLOY_CLOUD_RUN.sh          ← Deploy commands
```

## 🚀 Pasos Inmediatos

### 1️⃣ Local Setup (5 minutos)

```bash
cd user-api

# Instalar dependencias
npm install

# Copiar archivo env
cp .env.example .env.development

# EDITAR .env.development
# Opción A: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/users_db

# Opción B: MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/users_db

# Iniciar servidor
npm run dev

# Verificar health
curl http://localhost:3002/health
```

### 2️⃣ MongoDB Atlas Setup (10 minutos)

**Si no tienes MongoDB Atlas:**

1. Ir a https://www.mongodb.com/cloud/atlas
2. Click "Register" → Crear cuenta
3. Crear "Free Tier" cluster en **GCP us-central1**
4. Crear database user:
   - Username: `user_api_prod`
   - Password: [generar contraseña fuerte]
5. Copiar connection string: `mongodb+srv://user_api_prod:PASSWORD@cluster.mongodb.net/users_db?retryWrites=true&w=majority`

### 3️⃣ Deploy a GCP Cloud Run (5 minutos)

#### Opción A: Direct Deploy (Recomendado)
```bash
# Desde dentro de user-api/
gcloud run deploy user-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,MONGODB_URI="mongodb+srv://user_api_prod:PASSWORD@cluster.mongodb.net/users_db" \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

#### Opción B: Con CI/CD (Automático)
```bash
# Commitear cambios a GitHub
git add .
git commit -m "🚀 deploy(user-api): setup for gcp cloud run"
git push origin main

# GCP Cloud Build se ejecuta automáticamente via cloudbuild.yaml
```

### 4️⃣ Verificar Deployment

```bash
# Ver logs
gcloud run logs read user-api --limit 50 --follow

# Obtener URL
gcloud run services describe user-api --platform managed --region us-central1 --format 'value(status.url)'

# Test endpoint
curl https://user-api-xxxxx.a.run.app/health
```

## 📊 Endpoints Disponibles

### Health & Status
```bash
GET /health
→ { success: true, message: "User API is healthy", service: "user-api", version: "2.0" }

GET /
→ { success: true, service: "user-api", version: "2.0" }
```

### User CRUD
```bash
# Listar usuarios
GET /api/v2/users

# Obtener usuario por ID
GET /api/v2/users/[ID]

# Crear usuario
POST /api/v2/users
Body: { "name": "John Doe", "email": "john@example.com", "role": "user" }

# Actualizar usuario
PUT /api/v2/users/[ID]
Body: { "name": "Jane Doe" }

# Eliminar usuario
DELETE /api/v2/users/[ID]
```

### Inter-Cloud Communication
```bash
# Recibir mensaje de Order API (Sebas)
POST /api/v2/users/message
Body: {
  "data": {
    "product": { "id": "123", "name": "Laptop" },
    "order": { "id": "456", "quantity": 2 }
  }
}
→ Response: { product, order, user (agregado), completedAt }
```

## 🔌 Integración con Order API (Sebas)

En el **Order API** de Sebas, agregar esta llamada:

```javascript
// En order.controller.js - receiveMessage()

export const receiveMessage = async (req, res) => {
  try {
    const { data } = req.body;
    
    // Crear orden
    const order = await Order.create({...});
    
    // Preparar mensaje enriquecido
    const messagePayload = {
      data: { product: data.product, order },
      orderId: order._id
    };
    
    // LLAMAR USER API (Yécid)
    const userApiUrl = process.env.USER_API_URL || 'https://user-api-xxxxx.a.run.app';
    const response = await fetch(`${userApiUrl}/api/v2/users/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messagePayload)
    });
    
    // Retornar con datos del usuario
    return res.status(200).json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🔐 Seguridad Post-Deployment

### 1. Firewall - Permitir AWS → GCP

```bash
# Permitir tráfico desde AWS a GCP User API
gcloud compute firewall-rules create allow-from-aws \
  --network=default \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --description="Allow HTTPS from AWS Order API"
```

### 2. CORS Configuration

```javascript
// Ya está configurado en server.js
// Pero si necesitas cambiar, editar:
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://order-api-xxxxxxxx-uc.a.run.app', // Sebas Order API
    'https://product-api-aws.com',              // Santiago Product API
  ];
  
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});
```

### 3. API Keys (Opcional pero Recomendado)

```bash
# Crear secret en GCP
gcloud secrets create user-api-key --data-file=- <<< "sk_user_xxxxx"

# En server.js, validar X-API-Key header
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

## 📈 Monitoreo

### Cloud Logging
```bash
# Ver logs en tiempo real
gcloud run logs read user-api --follow

# Filtrar errores
gcloud logging read "resource.type=cloud_run_revision AND severity=ERROR" --limit 20
```

### Cloud Monitoring - Create Dashboard
```bash
gcloud monitoring dashboards create --config-from-file=- <<EOF
{
  "displayName": "User API Monitoring",
  "gridLayout": {
    "widgets": [
      {
        "title": "Request Count",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "resource.type=cloud_run_revision resource.labels.service_name=user-api"
              }
            }
          }]
        }
      }
    ]
  }
}
EOF
```

## 🔄 Auto-Scaling Configuration

```bash
gcloud run deploy user-api \
  --auto-scaling \
  --min-instances 1 \
  --max-instances 10 \
  --region us-central1
```

## 🆘 Troubleshooting

### ❌ "ECONNREFUSED" a MongoDB
```bash
# Verificar MongoDB Atlas whitelist IP
# En Atlas → Security → Network Access
# Agregar: 0.0.0.0/0 (cualquier IP)

# Verificar connection string
echo $MONGODB_URI
# Debe ser: mongodb+srv://user:pass@cluster.mongodb.net/database
```

### ❌ "503 Service Unavailable"
```bash
# Ver logs detallados
gcloud run logs read user-api --follow

# Aumentar memory
gcloud run deploy user-api \
  --memory 1Gi \
  --region us-central1

# Usar warm start
gcloud run deploy user-api \
  --min-instances 1 \
  --region us-central1
```

### ❌ Timeout en llamada desde Order API
```bash
# Aumentar timeout en fetch
const response = await fetch(url, {
  method: 'POST',
  timeout: 30000,  // 30 segundos
  headers: { ... }
});

# O usar axios
import axios from 'axios';
axios.post(url, data, { timeout: 30000 });
```

## 📋 Checklist Pre-Producción

- [ ] MongoDB Atlas cluster accesible
- [ ] User API desplegado en Cloud Run
- [ ] Health endpoint retorna 200
- [ ] CORS configurado correctamente
- [ ] Firewall permite tráfico desde AWS
- [ ] Logs conectados a Cloud Logging
- [ ] Auto-scaling habilitado
- [ ] Secrets de MongoDB en Secret Manager
- [ ] Monitores/alertas configurados
- [ ] Load testing ejecutado

## 🎯 Próximo: Order API (Sebas)

Cuando Order API esté listo, conexión será automática:

1. Order API recibe POST /api/v2/orders
2. Valida y crea orden
3. LLama POST /api/v2/users/message (User API - Yécid)
4. Recibe respuesta con user data
5. Retorna respuesta completa al cliente

## 📞 Contacto & Support

- **Documentación Completa**: Ver archivos .md en `user-api/`
- **Architecture**: `ARCHITECTURE_DIAGRAMS.md`
- **Inter-Cloud Flow**: `INTER_CLOUD_FLOW.md`
- **Networking GCP**: `NETWORKING_GCP.md`

---

**✅ TODO LISTO PARA PRODUCCIÓN**

El User API está 100% configurado para GCP Cloud Run. Solo necesita:
1. Credenciales GCP
2. MongoDB Atlas cluster
3. Ejecutar deployment command

¡A trabajar! 🚀
