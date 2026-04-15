# GitHub Actions Auto-Deploy a Cloud Run

Este workflow despliega automáticamente a Cloud Run **cada vez que haces push a `production`**.

---

## 🔧 Setup (Una sola vez)

### Paso 1: Crear Service Account en GCP

1. Ir a [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **"Create Service Account"**
3. Name: `github-deploy`
4. Click **Create and Continue**
5. Grant roles:
   - ✅ Cloud Run Admin
   - ✅ Service Account User
   - ✅ Storage Admin (para Container Registry)
6. Click **Continue** → **Done**

### Paso 2: Crear JSON Key

1. Seleccionar el service account `github-deploy`
2. Ir a tab **"Keys"**
3. Click **"Add Key"** → **"Create new key"**
4. Seleccionar **JSON**
5. Click **Create**
6. Se descarga automáticamente `github-deploy-xxxxx.json`

### Paso 3: Agregar Secrets a GitHub

1. Ir a tu repo en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Crear estos 3 secrets:

#### Secret 1: `GCP_SA_KEY`
- Name: `GCP_SA_KEY`
- Value: **Copiar TODO el contenido del JSON descargado** (incluyendo llaves {})
- Click **Add secret**

#### Secret 2: `GCP_PROJECT_ID`
- Name: `GCP_PROJECT_ID`
- Value: Tu GCP Project ID (ejemplo: `my-project-123456`)
- Click **Add secret**

#### Secret 3: `MONGODB_URI`
- Name: `MONGODB_URI`
- Value: Tu connection string de MongoDB Atlas
- Click **Add secret**

---

## 🚀 Uso

Ahora cada vez que hagas push a `production`, se ejecuta automáticamente:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"

# Push a production
git push origin production
```

GitHub Actions:
1. ✅ Build la imagen Docker
2. ✅ La sube a GCP Container Registry
3. ✅ La despliega en Cloud Run
4. ✅ Configura variables de entorno

---

## ✅ Verificar que funcionó

1. Ir a [GitHub Actions](https://github.com/Yecid07/mern-cart-/actions)
2. Ver el workflow corriendo
3. Ir a [GCP Cloud Run](https://console.cloud.google.com/run) 
4. Ver el servicio `cart-api-orders` en estado "deployed"

---

## 🔗 Obtener la URL

Una vez desplegado, en Cloud Run verás la URL:
```
https://cart-api-orders-abc123xyz.run.app
```

Usa esa URL para comunicarte con Sebas.

---

## 🆘 Troubleshooting

### Error: "service account key invalid"
- Verifica que copiaste TODO el JSON (incluyendo `{` y `}`)
- No uses formato de bloque código en GitHub secrets

### Error: "project not found"
- Verifica que `GCP_PROJECT_ID` es correcto
- No incluyas guiones ni caracteres especiales

### Error: "permission denied"
- Asegúrate que el service account tiene estos roles:
  - Cloud Run Admin
  - Service Account User
  - Storage Admin

---

## Próximos pasos

Una vez desplegado en Cloud Run:
1. ✅ Comparte tu URL de Cloud Run con Sebas
2. ✅ Crea endpoint en tu código para llamar a la URL de Sebas
3. ✅ Agrega monitoreo (DataDog/New Relic)
