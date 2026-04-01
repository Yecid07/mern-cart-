# 🏗️ Architecture Overview - User API para GCP

## Estructura del Proyecto

```
user-api/
├── server.js                 # Express app principal
├── package.json              # Dependencias Node.js
├── Dockerfile                # Multi-stage build para Cloud Run
├── cloudbuild.yaml           # CI/CD GCP Cloud Build
├── deployment.yaml           # Kubernetes manifest (alternativa)
├─ config/
│  └── db.js                  # MongoDB connection
├── models/
│  └── user.model.js          # Mongoose User schema
├── controllers/
│  └── user.controller.js     # Lógica de negocio
├── routes/
│  └── user.routes.js         # Express routes
├─ env files/
│  ├── .env.development       # Local development
│  ├── .env.testing           # Testing
│  ├── .env.production        # GCP Cloud Run
│  └── .env.example           # Template
├── README.md                 # Getting started
├── DEPLOY_CLOUD_RUN.sh       # Deployment commands
├── MONGODB_ATLAS_SETUP.md    # BD setup
├── NETWORKING_GCP.md         # Firewall & VPC
└── INTER_CLOUD_FLOW.md       # Message flow
```

## Endpoints

### Health & Status
```http
GET /health
→ { success: true, message: "User API is healthy" }

GET /
→ { success: true, service: "user-api", version: "2.0" }
```

### User CRUD
```http
GET    /api/v2/users              # Listar usuarios
GET    /api/v2/users/:id          # Obtener usuario
POST   /api/v2/users              # Crear usuario
PUT    /api/v2/users/:id          # Actualizar usuario
DELETE /api/v2/users/:id          # Eliminar usuario
```

### Inter-Cloud Communication
```http
POST   /api/v2/users/message      # Recibir datos de Order API
```

## Stack Tecnológico

| Component | Version | Propósito |
|-----------|---------|-----------|
| Node.js | 20 LTS | Runtime |
| Express | 4.x | Web framework |
| Mongoose | 8.x | MongoDB ODM |
| DotEnv | 16.x | Env variables |
| Docker | - | Containerización |
| GCP Cloud Run | - | Hosting |
| MongoDB Atlas | - | Database |

## Desarrollo Local

### Requisitos
- Node.js >= 20.0.0
- npm o yarn
- MongoDB running locally OR MongoDB Atlas conexión

### Setup
```bash
# 1. Instalar dependencias
npm install

# 2. Copiar env file
cp .env.example .env.development

# 3. Editar .env.development con MONGODB_URI
# MONGODB_URI=mongodb://localhost:27017/users_db
# O MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/users_db

# 4. Iniciar en modo desarrollo
npm run dev
```

### Testing de Endpoints
```bash
# Obtener todos los usuarios
curl http://localhost:3002/api/v2/users

# Crear usuario
curl -X POST http://localhost:3002/api/v2/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"user"}'

# Actualizar usuario
curl -X PUT http://localhost:3002/api/v2/users/[ID] \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'

# Eliminar usuario
curl -X DELETE http://localhost:3002/api/v2/users/[ID]

# Test message endpoint
curl -X POST http://localhost:3002/api/v2/users/message \
  -H "Content-Type: application/json" \
  -d '{"data":{"product":{"name":"Laptop","price":999},"quantity":2}}'
```

## Deployment a GCP Cloud Run

### Opción 1: Desde código fuente (Recomendado)
```bash
cd user-api
gcloud run deploy user-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,MONGODB_URI="[MongoDB Atlas URI]"
```

### Opción 2: Desde imagen Docker
```bash
# Build image
docker build -t gcr.io/PROJECT_ID/user-api:latest .

# Push a Container Registry
docker push gcr.io/PROJECT_ID/user-api:latest

# Deploy
gcloud run deploy user-api \
  --image gcr.io/PROJECT_ID/user-api:latest \
  --region us-central1
```

### Opción 3: Usando Cloud Build (CI/CD)
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions _MONGODB_URI="[MongoDB URI]"
```

## Monitoreo & Logs

### Cloud Logging
```bash
# Ver logs en tiempo real
gcloud run logs read user-api --limit 50 --follow

# Filtrar por nivel de error
gcloud logging read "resource.type=cloud_run_revision AND severity=ERROR" \
  --limit 10
```

### Cloud Trace / APM
```bash
# Ver performance
gcloud trace list
```

### Prometheus Metrics (Opcional)
```javascript
// Agregar a server.js
import promClient from 'prom-client';

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

## Performance Optimization

### 1. Connection Pooling
```javascript
// server.js
import mongoose from 'mongoose';

const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
};

await mongoose.connect(uri, options);
```

### 2. Caching (Redis Opcional)
```javascript
import Redis from 'redis';
const redis = Redis.createClient();

export const getUsers = async (req, res) => {
  const cached = await redis.get('users:list');
  if (cached) return res.json(JSON.parse(cached));
  
  const users = await User.find({});
  await redis.setEx('users:list', 300, JSON.stringify(users));
  res.json(users);
};
```

### 3. Response Compression
```javascript
import compression from 'compression';
app.use(compression());
```

## Seguridad

### Headers de Seguridad
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
});

app.use('/api/', limiter);
```

### Validación de Input
```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/v2/users', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['user', 'admin']),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  // Continuar...
});
```

## Troubleshooting

### Problema: "ECONNREFUSED" a MongoDB
**Solución:** 
- Verificar MongoDB Atlas IP whitelist
- Verificar MONGODB_URI es correcta
- Verificar firewall permite conexión

### Problema: "503 Service Unavailable" en Cold Start
**Solución:**
- Usar Cloud Run `--min-instances 1` para warm start
- Optimizar Dockerfile (multi-stage build)
- Agregar health checks

### Problema: Timeout en inter-cloud calls
**Solución:**
- Aumentar timeout en fetch/axios: `timeout: 30000`
- Agregar retry logic
- Verificar firewall rules GCP

## CI/CD Pipeline

```mermaid
graph LR
  A[Código] -->|Git Push| B[GitHub Actions]
  B -->|Build| C[Docker Image]
  C -->|Push| D[Container Registry]
  D -->|Deploy| E[Cloud Run]
  E -->|Health Check| F{Status OK?}
  F -->|Yes| G[Tráfico]
  F -->|No| H[Rollback]
```

## Próximos Pasos

1. ✅ Completar setup local
2. ✅ Crear MongoDB Atlas cluster
3. ✅ Desplegar a Cloud Run
4. ✅ Configurar firewall GCP (permitir AWS)
5. ✅ Integrar con Order API (Sebas)
6. ✅ Testing end-to-end del flujo
7. ✅ Monitoreo y alerting
8. ✅ Rollout a producción
