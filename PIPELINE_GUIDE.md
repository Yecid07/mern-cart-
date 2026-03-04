# Pipeline and Delivery Guide

## 1) Entidades REST (minimo 3)
Implementadas en backend:
- Products
- Users
- Orders

## 2) Ambientes separados
- Testing: rama `testing`, BD `cart_testing`, URL/deploy hook de testing.
- Production: rama `production`, BD `cart_production`, URL/deploy hook de production.

Configurar en GitHub:
- Environments: `testing` y `production`.
- Secrets:
  - `STAGING_DEPLOY_HOOK_URL`
  - `PRODUCTION_DEPLOY_HOOK_URL`

## 3) Pipelines CI/CD (GitHub Actions)
- `.github/workflows/ci-testing.yml`
  - Corre en push/PR a `testing`.
  - Ejecuta pruebas y gate de cobertura >= 60%.
  - Si todo pasa, deploy a testing usando hook.

- `.github/workflows/ci-production.yml`
  - Corre en push a `production`.
  - Ejecuta pruebas y gate de cobertura >= 85%.
  - Si todo pasa, deploy a production usando hook.

## 4) Reglas de calidad
Comandos:
- `npm run quality:staging` (min 60%)
- `npm run quality:production` (min 85%)

Si falla una prueba o no se cumple cobertura, el pipeline falla y no despliega.

## 5) Docker (API + Mongo)
Incluye:
- `Dockerfile`
- `docker-compose.testing.yml`
- `docker-compose.production.yml`

Uso local:
- Testing: `docker compose -f docker-compose.testing.yml up --build`
- Production: `docker compose -f docker-compose.production.yml up --build`

## 6) Git y GitMoji
Usar mensajes tipo:
- `:test_tube: add controller tests and coverage gate`
- `:whale: add docker setup for app and mongo`
- `:rocket: add GitHub Actions pipelines for testing and production`

## 7) Entregables al docente
- Link del repositorio Git.
- Evidencia de pipelines en verde para testing y production.
- URLs de ambos ambientes.
- Evidencia de cobertura cumpliendo los umbrales.
