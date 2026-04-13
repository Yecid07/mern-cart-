# 📋 GCP MongoDB Atlas Setup Guide

## Quick Start

1. Ir a https://www.mongodb.com/cloud/atlas
2. Sign up (gratis)
3. Crear cluster en **Google Cloud (GCP) / us-central1**
4. Crear user: `mern_user`
5. Copiar connection string
6. Pegar en Render env vars

---

## Paso a Paso

### 1. Create MongoDB Atlas Account

```
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email
   - Password
   - Nombre de organización
3. Verificar email
```

### 2. Create Free Cluster

**Después de sign up:**

```
Organizations → Create New Organization
├─ Organization Name: "MERN Commerce"
└─ Plan: FREE

Luego Create a Project:
├─ Project Name: "cart-api"
└─ Default

Luego Create a Deployment:
├─ Cloud Provider: Google Cloud (IMPORTANTE)
├─ Region: us-central1 (IMPORTANTE - sigue siendo GCP)
├─ Cluster Tier: M0 (FREE - 512MB)
├─ Cluster name: "cart-cluster"
└─ Create Deployment
```

### 3. Create Database User

**Después de crear cluster (~10 min):**

```
Security → Database Access → Add Database User
├─ Authentication Type: Password
├─ Username: mern_user
├─ Password: [generar fuerte con uppercase/numbers/symbols]
├─ Built-in Role: Atlas admin
└─ Add User
```

**Copy password somewhere safe!**

### 4. Configure Network Access

```
Security → Network Access → Add IP Address

Option A (Seguro para producción):
├─ Add Render IP (cuando Render te lo diga)
└─ Add Current IP (para testing local)

Option B (Simple pero menos seguro):
├─ IP Address: 0.0.0.0/0
├─ Description: "Render app"
└─ Confirm
```

### 5. Get Connection String

```
Deployment → Connect → Drivers → Node.js
├─ Copy connection string
└─ Formato:
   mongodb+srv://mern_user:PASSWORD@cluster-xyz.mongodb.net/cart_db?retryWrites=true&w=majority
```

### 6. Configure Render Environment

**En Render Dashboard:**

```
Services → cart-api → Environment

Add these variables:
├─ MONGODB_URI = [Tu connection string]
├─ NODE_ENV = production
├─ PORT = 5000
└─ Save
```

**Render redeploy automáticamente.**

### 7. Verify Connection

```bash
# Esperar 2-3 min por deploy

# Test endpoint
curl https://cart-api-production.onrender.com/api/v2/products

# Ver logs
Render Dashboard → Logs → Buscar "MongoDB Connected"
```

---

## Connection String Breakdown

```
mongodb+srv://mern_user:PASSWORD@cluster-xyz.mongodb.net/cart_db?retryWrites=true&w=majority
                    │         │                           │        │
                    │         │                           │        └─ Options
                    │         │                           └─ Database name  
                    │         └─ Cluster address
                    └─ Credentials
```

---

## Data Migration (Opcional)

### Export from Local MongoDB

```bash
# En tu máquina donde tienes mongod local
mongoexport --db cart_db --collection users --out users.json
mongoexport --db cart_db --collection products --out products.json
mongoexport --db cart_db --collection orders --out orders.json
```

### Import to MongoDB Atlas

```bash
# Desde terminal
mongoimport --uri "mongodb+srv://mern_user:PASSWORD@cluster-xyz.mongodb.net" \
  --db cart_db \
  --collection users \
  --file users.json

# Repetir para products y orders
```

---

## Monitoring

### MongoDB Atlas Dashboard

```
Clusters → cart-cluster
├─ Metrics:
│  ├─ Operations/sec
│  ├─ Connections
│  ├─ Network I/O
│  └─ Database file size
├─ Performance Advisor
├─ Alerts
└─ Backups
```

### Common Alerts to Enable

```
Atlas → Alerts → Add Alert

Recommended:
├─ Replication Lag > 10 seconds
├─ CPU > 80%
├─ Memory > 80%
├─ Disk > 80%
└─ Failed Logins > 5/hour

Action: Email notification
```

---

## Scaling

### When to Upgrade

```
M0 (Free - 512MB)          → M2 (Monthly $57) if:
├─ Database > 300MB
├─ 1000+ operations/sec
└─ Need point-in-time recovery

M2 (Shared) → M5+ (Dedicated) when:
├─ Production traffic
├─ 10K+ operations/sec
└─ Need guaranteed resources
```

### How to Upgrade

```
Clusters → Modify
├─ Change Cluster Tier to M2
├─ Select region (stay in us-central1)
└─ Apply Changes

⚠️ Takes 10-30 min, 0 downtime
```

---

## Backup Strategy

### Automatic Backups (Atlas)

```
Backups → Continuous Backups
├─ Enabled by default on M2+
├─ 30-day retention
├─ Point-in-time recovery (72 hours)
├─ Daily snapshots
└─ Encrypted
```

### Manual Backup

```
Backups → Create Backup
├─ Select cluster
├─ Add description
└─ Create

✅ Available for 30 days
```

### Export Data Regularly

```bash
# Semanal/mensual
mongoexport --uri "mongodb+srv://..." --db cart_db --out backup-$(date +%Y%m%d).json

# Guardar en Cloud Storage
gsutil cp backup-*.json gs://your-bucket/
```

---

## Security Best Practices

### Username & Password

```
✅ Strong password:
   - 16+ characters
   - Uppercase + lowercase
   - Numbers + symbols
   - No dictionary words

✗ Avoid:
   - Storing en código
   - Compartir sin encriptar
   - Reutilizar contraseñas
```

### IP Whitelist

```
Security → Network Access

✅ For Render:
   - Add Render IPs only
   - Remove 0.0.0.0/0 in prod

✅ For Local Dev:
   - Add your home IP
   - Or specific office IPs
```

### Roles & Permissions

```
Database Access → Edit User

Roles by environment:
├─ Development: Atlas admin (full access)
├─ Staging: Built-in admin
└─ Production: Custom role (limited scope)
```

---

## Troubleshooting

### "Authentication failed"
```
Problema: Credenciales incorrectas
Solución:
1. Verificar username en connection string
2. Verificar password (copiada completa)
3. Verificar special chars escapados (%40 para @)
4. Reset password en Atlas
```

### "No connection"
```
Problema: IP not whitelisted
Solución:
1. Copy tu IP desde error message
2. Add to Network Access
3. Esperar 5 min
4. Retry
```

### "Connection timeout"
```
Problema: Firewall/Network issue
Solución:
1. Verificar que Render tiene internet
2. Verificar MongoDB status en Atlas dashboard
3. Check Render logs para error específico
4. Esperar si Atlas está bajo mantenimiento
```

### "Storage quota exceeded"
```
Problema: Database > 512MB (M0 tier)
Solución:
1. Delete old data si necesario
   db.orders.deleteMany({createdAt: {$lt: new Date(Date.now() - 30*24*60*60*1000)}})
2. Upgrade a M2 tier
3. Check indexes si hay mucho data
```

---

## Expected Performance

```
Local MongoDB        →  Atlas M0 (GCP)
├─ Latency: ~5ms        Latency: ~50-100ms (from Render)
├─ Storage: Unlimited   Storage: 512MB
├─ Downtime: Your ctrl  Downtime: HA replica set
└─ Cost: Hardware       Cost: Free tier
```

---

## Cost Estimate

```
MongoDB Atlas (GCP):
├─ M0 (Free): $0/month (512MB, limited backups)
├─ M2 (Shared): $57/month (10GB SSD)
├─ M5 (Dedicated): Start at $133/month (40GB SSD)
└─ Auto-scales, pay what you use

Render:
├─ Free: $0/month (may sleep)
├─ Starter: $7/month (0.5GB RAM)
├─ Standard: $12/month (1GB RAM)
└─ Pro: $28+/month (2GB+ RAM)

**Total MVP (lowest cost)**: ~$0/month (everything free tier)
**Total Growing**: ~$70/month (MongoDB M2 + Render Standard)
```

---

## Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Connection String Docs**: https://docs.atlas.mongodb.com/driver-connection
- **Backup Docs**: https://docs.atlas.mongodb.com/backup/back-up-cluster-data
- **GCP Regions**: https://cloud.google.com/about/locations

---

**Next**: Configure en Render y test! 🚀
