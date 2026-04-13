# 🚀 MERN Commerce - Final Architecture

## Overview

**Arquitectura simplificada y productiva:**

```
Frontend + Backend: Render.com (MERN Stack)
        ↓ HTTPS Connection
Database: MongoDB Atlas (GCP us-central1)
```

**URL en Producción:**
- **App**: https://cart-api-production.onrender.com
- **API Products**: https://cart-api-production.onrender.com/api/v2/products
- **API Orders**: https://cart-api-production.onrender.com/api/v2/orders  
- **API Users**: https://cart-api-production.onrender.com/api/v2/users ✅

---

## Features Completados ✅

- ✅ Rutas actualizadas a `/api/v2` (versionado)
- ✅ Product, Order, User APIs funcionando
- ✅ GitMoji + Semantic Release (versionado automático)
- ✅ MongoDB en GCP (managed, backups, scaling)
- ✅ Hosting en Render (HTTPS, auto-deploy, free tier)
- ✅ Documentación completa

---

## 📁 Project Structure

```
project/
├── backend/                     # Node.js/Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── user.routes.js
│   ├── server.js               # Express app
│   └── package.json
│
├── frontend/                    # React frontend
│   └── ...
│
├── .github/
│   └── workflows/
│       └── release.yml          # Auto-versioning
│
├── .commitlintrc.json           # GitMoji validation
├── release.config.js            # Semantic Release config
└── README.md                    # Este archivo
```

---

## Quick Start

### Local Development

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables
cp backend/.env.example backend/.env
# Editar backend/.env con:
# MONGODB_URI=mongodb://localhost:27017/cart_db
# NODE_ENV=development
# PORT=5000

# 3. Iniciar MongoDB local
mongod

# 4. Iniciar backend
npm run dev

# 5. Iniciar frontend (en otra terminal)
cd frontend
npm start
```

### Deployments

**En Render:**
- Auto-deploy en cada `git push origin main`
- Variables en Render Dashboard → Environment

**MongoDB:**
- Seguir [GCP_MONGODB_ATLAS_SETUP.md](./GCP_MONGODB_ATLAS_SETUP.md)
- Connection string en Render env var

---

## API Endpoints

### Products
```http
GET    /api/v2/products
POST   /api/v2/products
PUT    /api/v2/products/:id
DELETE /api/v2/products/:id
```

### Orders
```http
GET    /api/v2/orders
POST   /api/v2/orders
PUT    /api/v2/orders/:id
DELETE /api/v2/orders/:id
```

### Users (✅ Already working)
```http
GET    /api/v2/users
POST   /api/v2/users
PUT    /api/v2/users/:id
DELETE /api/v2/users/:id
```

---

## Versionado & Release

**Formato de commits (GitMoji):**
```
🚀 feat(scope): add new feature
🐛 fix(scope): fix bug
📚 docs(scope): update documentation
♻️ refactor(scope): refactor code
✅ test(scope): add tests
🎨 style(scope): style updates
```

**Semantic Release automático:**
```
Commit: 🚀 feat: add user endpoint
   → Version: 1.0.0 → 1.1.0 (MINOR bump)
   → Tag: v1.1.0
   → Release en GitHub
   → Deploy en Render
```

---

## Database (MongoDB Atlas on GCP)

**Ubicación:** GCP us-central1
**Plan:** M0 (Free - 512MB) → M2 ($57/mo) si crece

**Características:**
- ✅ Automatic backups (30 días)
- ✅ Point-in-time recovery (72 horas)
- ✅ Encryption (in-transit + at-rest)
- ✅ High availability (3-node replica set)

**Setup:** Ver [GCP_MONGODB_ATLAS_SETUP.md](./GCP_MONGODB_ATLAS_SETUP.md)

---

## Hosting (Render.com)

**Ventajas:**
- ✅ Auto-deploy en push
- ✅ HTTPS automático
- ✅ Environment variables seguras
- ✅ Free tier disponible + paid tiers económicos

**Deploy automático:**
1. `git push origin main`
2. GitHub webhook
3. Render builds & deploys
4. App live en 2-3 min

---

## Monitoring & Logs

### Render Logs
```
Dashboard → Services → cart-api → Logs
```

### MongoDB Metrics
```
Atlas Dashboard → Metrics
- Operations/sec
- Memory usage
- Network I/O
```

### Health Checks
```bash
# Backend alive
curl https://cart-api-production.onrender.com/

# API working
curl https://cart-api-production.onrender.com/api/v2/products

# Check logs
gcloud logging read "resource.type=app_engine"
```

---

## Architecture Diagrams

Sistema completo con diagrama de flujo:
- Ver [ARCHITECTURE_RENDER_GCP_MONGODB.md](./ARCHITECTURE_RENDER_GCP_MONGODB.md)

---

## Troubleshooting

### MongoDB connection failed
- Verificar MONGODB_URI en Render env
- Verificar IP whitelist en MongoDB Atlas
- Verificar credenciales (username:password)

### App won't deploy
- Check logs en Render
- Verificar `package.json` scripts
- Verificar Node version compatibility

### Slow queries
- Check MongoDB indexes
- Monitor en Atlas Dashboard
- Upgrade tier si needed

Ver documentos para más detalles → [GCP_MONGODB_ATLAS_SETUP.md](./GCP_MONGODB_ATLAS_SETUP.md)

---

## Cost Breakdown

| Service | Tier | Cost/Month |
|---------|------|-----------|
| MongoDB Atlas | M0 (Free) | $0 |
| Render | Free | $0 |
| **Total** | **MVP** | **$0** |
| | **Growing** | ~$70 (MongoDB M2 + Render Pro) |
| | **Enterprise** | $300+ (M5+ tier) |

---

## Next Steps

1. **Crear MongoDB Atlas cluster** → [GCP_MONGODB_ATLAS_SETUP.md](./GCP_MONGODB_ATLAS_SETUP.md)
2. **Configurar Render env vars** con connection string
3. **Test endpoints** localmente
4. **Deploy a Render** con `git push origin main`
5. **Monitorear** en dashboards

---

## Resources

- 📖 [Architecture & Design](./ARCHITECTURE_RENDER_GCP_MONGODB.md)
- 📖 [MongoDB Atlas Setup](./GCP_MONGODB_ATLAS_SETUP.md)
- 📖 [Versioning Guide](./docs/GITMOJI_GUIDE.md)
- 🔗 [Render Docs](https://render.com/docs)
- 🔗 [MongoDB Docs](https://docs.mongodb.com)
- 🔗 [Express Docs](https://expressjs.com)

---

## Team

- **Yécid**: Full Stack Developer
- **Compañero 2**: (Configuración)
- **Compañero 3**: (Configuración)

---

## License

ISC

---

**Status**: ✅ Production Ready - Render + GCP MongoDB
