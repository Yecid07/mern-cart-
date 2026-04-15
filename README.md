# Cart Course API - CI/CD + Docker

Guia paso a paso para ejecutar el proyecto y validar la entrega (testing/production).

## URLs de despliegue
- Production: `https://cart-api-production.onrender.com/`
- Testing: `https://cart-api-testing.onrender.com/`

## 1. Requisitos
- Node.js 20+
- npm 10+
- Docker Desktop
- Git
- (Opcional) Postman

## 2. Clonar e instalar
```bash
git clone https://github.com/Yecid07/mern-cart-.git
cd mern-cart-
npm ci
```

## 3. Variables de entorno
Crea `.env` en la raiz basado en `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cart_local
NODE_ENV=development
SEBASTIAN_MESSAGE_API_URL=http://shipment-alb-468259091.us-east-2.elb.amazonaws.com/api/v2/mensaje
FIRESTORE_MESSAGES_COLLECTION=message_chain_logs
```

## 4. Ejecutar API en local (sin Docker)
```bash
npm run dev
```

API disponible en:
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/users`
- `http://localhost:5000/api/orders`

## 5. Ejecutar todo con Docker

### Testing (ambiente de pruebas)
```bash
docker compose -f docker-compose.testing.yml up --build
```

Servicios:
- API: `http://localhost:5001`
- Mongo: `mongodb://localhost:27018`
- Base de datos: `cart_testing`

### Production (ambiente de produccion)
```bash
docker compose -f docker-compose.production.yml up --build
```

Servicios:
- API: `http://localhost:5000`
- Mongo: `mongodb://localhost:27019`
- Base de datos: `cart_production`

### Detener contenedores
```bash
docker compose -f docker-compose.testing.yml down
docker compose -f docker-compose.production.yml down
```

## 6. Pruebas automatizadas y quality gates

Correr tests:
```bash
npm test
```

Correr tests con cobertura:
```bash
npm run test:coverage
```

Gate de testing (>= 60%):
```bash
npm run quality:staging
```

Gate de production (>= 85%):
```bash
npm run quality:production
```

Si falla una prueba o no se cumple cobertura, el pipeline debe fallar.

## 7. Ramas y flujo de trabajo
- `feature/new-feature`: desarrollo
- `testing`: ambiente de pruebas
- `production`: ambiente productivo

Flujo sugerido:
1. Desarrollar en `feature/new-feature`.
2. Merge a `testing` y validar CI Testing.
3. Si pasa, merge a `production` y validar CI Production.

## 8. GitHub Actions (SaaS CI/CD)
Workflows:
- `.github/workflows/ci-testing.yml`
- `.github/workflows/ci-production.yml`

Disparadores:
- `CI Testing`: push/PR a `testing`
- `CI Production`: push a `production`

Cada pipeline ejecuta:
1. Instalacion de dependencias
2. Pruebas automatizadas
3. Validacion de cobertura
4. Build de imagen Docker
5. Deploy por webhook (si existe secret)

## 9. Configuracion en GitHub
En el repo:
1. `Settings > Environments`
2. Crear `testing` y `production`
3. Agregar secrets:
   - `STAGING_DEPLOY_HOOK_URL`
   - `PRODUCTION_DEPLOY_HOOK_URL`

## 10. Entidades de la API
- `Product`
- `User`
- `Order`

Cumple requisito de minimo 3 entidades con persistencia real en MongoDB.

## 11. Evidencia para entrega
- Link del repositorio
- Capturas de `CI Testing` en verde
- Capturas de `CI Production` en verde
- Evidencia de cobertura (>=60% testing, >=85% production)
- URLs de ambos ambientes (PaaS)

## 12. Notas
- Este repositorio esta configurado como API-only en Docker (sin servir frontend).
- Si abres el puerto de Mongo en navegador veras un mensaje de protocolo (es normal). Usa Compass/mongosh.

##13. Fallo de producción 
- git checkout production
- (Get-Content package.json -Raw) -replace '"quality:production": "npm run test:coverage && node scripts/check-coverage.mjs 85"','"quality:production": "npm run test:coverage && node scripts/check-coverage.mjs 99"' | Set-Content -Encoding utf8 package.json
-git add package.json
-git commit -m "🧪 force production coverage failure"
-git push origin production
