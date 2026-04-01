# 🌐 Inter-Cloud Communication Flow

## Arquitectura Multicloud: AWS ↔ GCP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE / FRONTEND                                 │
│                                                                              │
└────────────────────┬──────────────────────────────────────────────────────┘
                     │
                     ↓ REQUEST: POST /api/v2/orders
         ┌───────────────────────────┐
         │  AWS API Gateway          │
         │  (Santiago)               │
         │  ├─ Region: us-east-1     │
         │  ├─ Load Balancer         │
         │  └─ Product API (3000)    │
         └────────┬──────────────────┘
                  │
         ┌────────↓──────────────────┐
         │  Validar + Crear Producto │
         │  Body: {                  │
         │    product: {...}         │
         │  }                        │
         └────────┬──────────────────┘
                  │
   ┌──────────────↓──────────────────────┐
   │ Order API (Sebas) - Llamar siguiente │
   │ POST https://order-api-gcp/...      │
   └──────────────┬──────────────────────┘
                  │
      HTTPS Inter-Cloud (AWS → GCP)
      ↓
   ┌──────────────────────────────────┐
   │  GCP Cloud Run - Order API       │
   │  (Sebas)                         │
   │  ├─ Region: us-central1          │
   │  └─ /api/v2/orders/message       │
   └────────┬───────────────────────┘
            │
   ┌────────↓──────────────────────────┐
   │  Crear Orden + Agregar Product    │
   │  Body: {                          │
   │    product: {...},                │
   │    order: {...}                   │
   │  }                                │
   └────────┬──────────────────────────┘
            │
   ┌────────↓──────────────────────────────┐
   │ Llamar User API (Yécid) - GCP Cloud   │
   │ POST https://user-api-gcp/...message  │
   └────────┬──────────────────────────────┘
            │
      HTTPS Inter-Cloud (GCP → GCP)
      ↓
   ┌──────────────────────────────────────┐
   │  GCP Cloud Run - User API            │
   │  (Yécid)                             │
   │  ├─ Region: us-central1              │
   │  ├─ MongoDB Atlas                    │
   │  └─ /api/v2/users/message            │
   └────────┬────────────────────────────┘
            │
   ┌────────↓──────────────────────────────┐
   │  Obtener Usuario + Agregar a Body     │
   │  Body Final: {                        │
   │    product: {...},                    │
   │    order: {...},                      │
   │    user: {...}                        │
   │  }                                    │
   └────────┬──────────────────────────────┘
            │
   ┌────────↓──────────────────────────────┐
   │  Retornar Response ← User API         │
   │  (Yécid)                              │
   └────────┬──────────────────────────────┘
            │ Respuesta con Usuario agregado
            ↓
   ┌────────────────────────────────────────┐
   │  Recibir Response ← Order API          │
   │  (Sebas)                               │
   └────────┬────────────────────────────────┘
            │ Ya tiene: product, order, user
            ↓
   ┌────────────────────────────────────────┐
   │  Retornar Response ← Order API         │
   │  (Sebas en GCP)                        │
   └────────┬────────────────────────────────┘
            │ Respuesta con todo enriquecido
            ↓ HTTPS Inter-Cloud (GCP → AWS)
   ┌────────────────────────────────────────┐
   │  Recibir Response ← Product API        │
   │  (Santiago en AWS)                     │
   └────────┬────────────────────────────────┘
            │ Ya tiene: product, order, user
            ↓
   ┌────────────────────────────────────────┐
   │  Retornar RESPUESTA FINAL              │
   │  (Santiago)                            │
   └────────┬────────────────────────────────┘
            │ Body Completo:
            │ {                              
            │   product: {...},
            │   order: {...},
            │   user: {...}
            │ }
            ↓
   ┌────────────────────────────────────────┐
   │  Recibir RESPUESTA FINAL ← Cliente     │
   │  (Frontend)                            │
   └────────────────────────────────────────┘
```

## 📋 Detalles de Cada Etapa

### 1️⃣ Cliente → AWS Gateway
```http
POST https://api.product-api-aws.com/api/v2/products/create
Content-Type: application/json

{
  "name": "Laptop XPS",
  "price": 999.99,
  "stock": 50
}
```

### 2️⃣ Product API → Order API
```javascript
// En Product Controller (Santiago)
export const createProduct = async (req, res) => {
  try {
    // 1. Validar y crear producto
    const product = await Product.create(req.body);
    
    // 2. Preparar body para Order API
    const messagePayload = {
      data: { product },
      orderId: null
    };
    
    // 3. Llamar Order API (Sebas)
    const response = await fetch('https://order-api-xxxxxxxx-uc.a.run.app/api/v2/orders/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messagePayload)
    });
    
    return res.status(200).json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 3️⃣ Order API → User API
```javascript
// En Order Controller (Sebas)
export const receiveMessage = async (req, res) => {
  try {
    // 1. Recibir mensaje con datos del producto
    const { data } = req.body;
    
    // 2. Crear orden enriquecida
    const order = await Order.create({
      productId: data.product._id,
      quantity: data.quantity
    });
    
    // 3. Preparar body para User API
    const messagePayload = {
      data: { product: data.product, order },
      orderId: order._id
    };
    
    // 4. Llamar User API (Yécid)
    const response = await fetch('https://user-api-xxxxxxxx-uc.a.run.app/api/v2/users/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messagePayload)
    });
    
    return res.status(200).json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 4️⃣ User API → Respuesta
```javascript
// En User Controller (Yécid) - FINAL DE LA CADENA
export const receiveMessage = async (req, res) => {
  try {
    const { data } = req.body;
    
    // 1. Obtener usuario (si userId en data, sino crear demo)
    let user = await User.findById(data.userId);
    if (!user) {
      user = { _id: 'demo-user-123', name: 'User Demo', email: 'user@demo.com' };
    }
    
    // 2. Enriquecer MESSAGE - ESTO ES EL FINAL
    const enrichedData = {
      ...data,
      user: user,
      completedAt: new Date().toISOString()
    };
    
    // 3. Retornar respuesta (nada más que agregar)
    return res.status(200).json({ 
      success: true, 
      data: enrichedData 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🔐 Seguridad Inter-Cloud

### 1. HTTPS Solo (TLS 1.3)
```yaml
- Todos los endpoints usan HTTPS
- Certificados autofirmados en dev
- Certificados Let's Encrypt en prod
```

### 2. CORS Configuration
```javascript
// En cada servicio
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://product-api-aws.com',           // Santiago
    'https://order-api-xxxxxxxx-uc.a.run.app',  // Sebas
    'https://user-api-xxxxxxxx-uc.a.run.app',   // Yécid
  ];
  
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});
```

### 3. API Keys (Opcional pero Recomendado)
```bash
# En .env de cada servicio
ORDER_API_KEY=sk_order_xxxxx
USER_API_KEY=sk_user_xxxxx

# En headers de cada request inter-cloud
X-API-Key: sk_order_xxxxx
```

## 📊 Latencia Esperada

```
Cliente → AWS:      ~100ms
AWS → GCP:          ~50-150ms (dependiendo de región)
GCP Interno:        ~10-50ms
----
TOTAL:              ~200-300ms (estimado)
```

## ❌ Handling de Errores

### Si Order API cae:
- Product API captura error y retorna `500`
- No se persiste la orden

### Si User API cae:
- Order API captura error y retorna `500`
- No se completa el mensaje

### Retry Logic (Recomendado):
```javascript
const maxRetries = 3;
const retryDelay = 1000;

for (let i = 0; i < maxRetries; i++) {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response;
  } catch (error) {
    if (i < maxRetries - 1) {
      await new Promise(r => setTimeout(r, retryDelay * (i + 1)));
    }
  }
}
```

## ✅ Testing de Flow Completo

```bash
# 1. Verificar salud de todos los servicios
curl https://product-api-aws.com/health
curl https://order-api-gcp.a.run.app/health
curl https://user-api-gcp.a.run.app/health

# 2. Crear un producto (inicia el flujo)
curl -X POST https://product-api-aws.com/api/v2/products/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "price": 99.99}'

# Ver logs en cada servicio
gcloud run logs read order-api --limit 50
gcloud run logs read user-api --limit 50
```

## 🔄 Message Flow Diagram

```
START
  │
  ├─→ [1] POST /products (AWS Product API)
  │       env: Santiago
  │       action: Create product
  │
  ├─→ [2] POST /orders/message (GCP Order API)
  │       env: Sebas
  │       body: { product: {...} }
  │       action: Create order, enrich body
  │
  ├─→ [3] POST /users/message (GCP User API)
  │       env: Yécid
  │       body: { product, order: {...} }
  │       action: Get user, enrich body (FINAL)
  │
  ├─← [3R] Response with user data
  │       return to Order API
  │
  ├─← [2R] Response with product+order+user
  │       return to Product API
  │
  ├─← [1R] Response with full data
  │       return to Client
  │
  END
```

## 📝 Checklist Antes de Producción

- [ ] MongoDB Atlas cluster creado y accesible
- [ ] Cloud Run services desplegados (3 total)
- [ ] Firewall rules configuradas (AWS → GCP)
- [ ] CORS habilitado en todos los servicios
- [ ] Environment variables configuradas
- [ ] Health checks funcionando
- [ ] Logs configurados en Cloud Logging
- [ ] Auto-scaling habilitado
- [ ] Load testing realizado
- [ ] Rollback plan preparado
