# 🏗️ Architecture - Render Monolito + GCP MongoDB

## Arquitectura Final

```
┌─────────────────────────────────────────────────────────┐
│  https://cart-api-production.onrender.com/              │
│                                                         │
│  MERN Stack (React + Express + Node + MongoDB)         │
│  ├─ Frontend (React)                                   │
│  ├─ /api/v2/products   (Product API)                   │
│  ├─ /api/v2/orders     (Order API)                     │
│  └─ /api/v2/users      (User API) ✅ FUNCIONA         │
│                                                         │
│  Hosting: Render.com (Node.js Backend)                │
├─────────────────────────────────────────────────────────┤
│  Database: MongoDB Atlas                                │
│  Location: GCP us-central1                              │
│  Managed by: MongoDB Inc.                               │
│  Features: Automatic backups, scaling, security        │
└─────────────────────────────────────────────────────────┘
```

## Stack

| Component | Version | Donde | Propósito |
|-----------|---------|-------|----------|
| Node.js | ~18.x | Render | Backend runtime |
| Express | 4.x | Render | Web framework |
| React | Latest | Render | Frontend |
| MongoDB | (Cloud) | GCP Atlas | Database |
| Render.com | - | Cloud | Hosting |
| MongoDB Atlas | - | GCP | Managed database |

## Endpoints

### Products API
```http
GET    /api/v2/products           → List all products
POST   /api/v2/products           → Create product
PUT    /api/v2/products/:id       → Update product
DELETE /api/v2/products/:id       → Delete product
```

### Orders API
```http
GET    /api/v2/orders             → List all orders
POST   /api/v2/orders             → Create order
PUT    /api/v2/orders/:id         → Update order
DELETE /api/v2/orders/:id         → Delete order
```

### Users API
```http
GET    /api/v2/users              → List all users ✅
POST   /api/v2/users              → Create user ✅
PUT    /api/v2/users/:id          → Update user ✅
DELETE /api/v2/users/:id          → Delete user ✅
```

## Database in GCP

### MongoDB Atlas (Managed Database)

**Ventajas:**
- ✅ Managed por MongoDB Inc. (no administrar servidor)
- ✅ Backups automáticos
- ✅ Escalado automático
- ✅ Seguridad (SSL/TLS, IP whitelist)
- ✅ Integración con GCP (ubicación us-central1)
- ✅ Free tier disponible (512MB)

**Ubicación GCP:**
```
Region: Google Cloud (GCP)
Zone: us-central1
Availability: 3-node replica set
Backup: Daily automated backups (30 days retention)
```

### Alternativa: Cloud SQL (Si prefieres)

Si quieres usar **Cloud SQL** en lugar de Atlas:
- Google Cloud SQL for MongoDB (en beta)
- Mayor integración con GCP
- Pero más complejo de configurar
- Similar pricing

**Recomendación: MongoDB Atlas** (más simple, probado)

## Configuration Steps

### 1. MongoDB Atlas Setup

**Crear cuenta y cluster:**

1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta (gratis)
3. Crear "Free Tier" cluster:
   - Cloud Provider: **Google Cloud (GCP)**
   - Region: **us-central1**
   - Cluster Tier: M0 (free, 512MB)

4. Crear database user:
   - Username: `mern_user`
   - Password: [generar fuerte]

5. Configurar Network Access:
   - Click "Add IP Address"
   - Add Current IP (Render)
   - O permitir 0.0.0.0/0 (cualquier IP - para Render)

6. Obtener Connection String:
   - Click "Connect"
   - Copy "Connection string for your application"
   - Formato: `mongodb+srv://mern_user:PASSWORD@cluster-xyz.mongodb.net/cart_db?retryWrites=true&w=majority`

### 2. Render Configuration

**En Render Dashboard → Environment:**

```
MONGODB_URI=mongodb+srv://mern_user:PASSWORD@cluster-xyz.mongodb.net/cart_db?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

**Verificar en Render logs que conecta:**
```
✅ MongoDB Connected successfully
```

### 3. Verificar Conexión

```bash
# Desde tu máquina local
curl https://cart-api-production.onrender.com/api/v2/products

# Debería responder datos desde MongoDB en GCP
```

## Data Model

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user|admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String (URL),
  stock: Number,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: String (pending|shipped|delivered),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment Flow

```
┌─ Local Development ─┐
│ npm run dev        │
│ localhost:5000     │
│ MongoDB Local      │
└──────┬─────────────┘
       │ git push origin main
       ↓
┌─ GitHub (main branch) ─┐
│ Versionado automático  │
│ (GitMoji + SemVer)     │
└──────┬────────────────┘
       │ Webhook
       ↓
┌─ Render.com ────────────────┐
│ Auto-deploy on push         │
│ Build from Dockerfile       │
│ Set env vars  from dashboard│
│ npm start                   │
└──────┬─────────────────────┘
       │ HTTPS Connection
       ↓
┌─ MongoDB Atlas (GCP) ───────┐
│ Automatic scaling           │
│ Encrypted at rest           │
│ Daily backups (30-day)      │
└─────────────────────────────┘
```

## Monitoring

### Render Logs
```bash
# Ver logs en vivo
https://dashboard.render.com/ → Logs
```

### MongoDB Atlas Metrics
```
https://cloud.mongodb.com/ → Performance Advisor
- Queries per second
- CPU usage
- Memory usage
- Disk I/O
```

## Backup Strategy

### Automated Backups (Render)
- Render no hace backups a nivel app
- Confiar en MongoDB Atlas

### MongoDB Atlas Backups
- ✅ Daily automated backups (30 días)
- ✅ Point-in-time recovery (últimas 72 horas)
- ✅ Manual snapshots (Premium tiers)

**Para producción:**
```
- Enable continuous backups
- Exportar weekly a Cloud Storage
- Test recovery monthly
```

## Scaling Plan

### Fase 1: MVP (Actual)
- Render: Free tier (~$0/mes)
- MongoDB: Free tier (~$0/mes)
- Capacidad: ~1K usuarios/mes

### Fase 2: Growing
- Render: Static Site + Web Service (~$12/mes)
- MongoDB: M2 tier (~$57/mes)
- Capacidad: ~100K usuarios/mes

### Fase 3: Production
- Render: Pro plan (~$28/mes)
- MongoDB: M5 tier (~$133/mes)
- Capacidad: ~1M+ usuarios/mes

## Seguridad

### MongoDB Atlas Security

1. **Network Access**
   - ✅ IP whitelist configurado
   - ✅ Render IP autorizada
   - ✅ Cualquier otro bloqueado

2. **Authentication**
   - ✅ Username/password (mern_user)
   - ✅ Role-based access control

3. **Encryption**
   - ✅ In-transit: TLS 1.2+
   - ✅ At-rest: Encrypted (Premium tiers)

4. **Backups**
   - ✅ Automatic daily
   - ✅ Encrypted
   - ✅ Access controlled

### Render Security
- ✅ HTTPS automático
- ✅ Environment variables secretas
- ✅ SSH access a containers (Pro tiers)

## Troubleshooting

### MongoDB Connection Failed
```javascript
// Error: connect ECONNREFUSED
// Solución: 
// 1. Verificar IP whitelist en Atlas
// 2. Verificar MONGODB_URI en env vars
// 3. Verificar credenciales (username:password)
```

### Slow Queries
```javascript
// MongoDB Atlas Dashboard → Performance
// - Ver query patterns
// - Crear indexes si necesario
// - Escalar si es necesario
```

### Out of Memory
```javascript
// Si MongoDB excede 512MB tier:
// 1. Upgrade a M2 tier
// 2. Limpiar datos antiguos
// 3. Agregar indexes
```

## Next Steps

1. ✅ Crear cluster MongoDB Atlas en GCP
2. ✅ Obtener connection string
3. ✅ Actualizar vars en Render
4. ✅ Verificar conexión
5. ⏳ Copiar datos locales a cloud (opcional)
6. ⏳ Configurar monitoring/alertas
7. ⏳ Documentar en README

## Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GCP Docs**: https://cloud.google.com/docs
- **MERN Guide**: https://www.mongodb.com/languages/mern-stack-guide

---

**Status**: ✅ Ready for production with GCP MongoDB
