# 🚀 Guía Rápida: Terraform Setup

Esta guía te ayudará a desplegar la infraestructura Terraform en 5 pasos.

## Paso 1: Preparación Inicial

```bash
# Asegúrate de tener Terraform instalado
terraform version

# Autenticarse en GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## Paso 2: Inicializar Terraform (Script Automático)

```bash
# Hacer el script ejecutable
chmod +x terraform/scripts/init-terraform.sh

# Ejecutar el script
cd terraform
./scripts/init-terraform.sh
```

**Este script:**
- ✓ Verifica que Terraform esté instalado
- ✓ Te pide el GCP Project ID
- ✓ Te pide el MongoDB Atlas URI
- ✓ Crea terraform.tfvars automáticamente
- ✓ Ejecuta `terraform init`

## Paso 3: Validar Configuración

```bash
# Hacer script ejecutable
chmod +x terraform/scripts/validate-terraform.sh

# Ejecutar validación
./scripts/validate-terraform.sh
```

**Este script:**
- ✓ Verifica que terraform.tfvars existe
- ✓ Valida toda la sintaxis
- ✓ Muestra un preview del plan (opcional)

## Paso 4: Desplegar Infraestructura

```bash
# En el directorio terraform/
terraform apply
```

**Expectedoutput:**
- ✓ Se creará VPC Network
- ✓ Se creará Compute Engine (2-3 minutos)
- ✓ Se creará Cloud Storage bucket
- ✓ Se configurarán firewall rules

## Paso 5: Verificar Deployment

```bash
# Hacer script ejecutable
chmod +x terraform/scripts/verify-deployment.sh

# Ejecutar verificación
./scripts/verify-deployment.sh
```

**Este script:**
- ✓ Obtiene las IPs y recursos creados
- ✓ Verifica conectividad SSH
- ✓ Verifica que mongosh está instalado
- ✓ Muestra próximos pasos

## Próximos: Conectar a MongoDB Atlas

### Opción A: Desde la VM (Recomendado)

```bash
# 1. Obtener IP de la VM
terraform output compute_engine_ip

# 2. Conectarse por SSH
ssh -i ~/.ssh/id_rsa ubuntu@<IP>

# 3. Dentro de la VM, crear colecciones
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/db" < create_collections_atlas.js
```

### Opción B: Desde tu máquina local

```bash
# Si tienes mongosh instalado localmente
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/db" < terraform/scripts/create_collections_atlas.js
```

## 📊 Verificar Recursos en GCP Console

1. Ve a https://console.cloud.google.com
2. Navega a:
   - **Compute > Compute Engine** - Ver VM
   - **VPC Network** - Ver red
   - **Storage > Buckets** - Ver bucket

## 🗑️ Destruir Todo (Cuando Termines)

```bash
# Opción 1: Comandodirecto
terraform destroy

# Opción 2: Script
chmod +x terraform/destroy.sh
./destroy.sh
```

## 🔧 Si Algo Sale Mal

### La VM no responde por SSH

```bash
# Espera 3-5 minutos (puede estar inicializando)
# Luego intenta nuevamente
ssh -i ~/.ssh/id_rsa ubuntu@<IP>
```

### No puedo conectar a MongoDB Atlas

1. Ve a https://cloud.mongodb.com/v2 → tu cluster
2. Haz clic en "Network Access"
3. Asegúrate que 0.0.0.0/0 está en la whitelist
4. Verifica el usuario y contraseña en la URI

### Error de permisos SQL/SSH

```bash
# Dar permisos ejecutables a todos los scripts
chmod +x terraform/scripts/*.sh
```

### Resetear todo

```bash
# Limpia el estado de Terraform
chmod +x terraform/scripts/clean.sh
./terraform/scripts/clean.sh

# Ejecuta terraform destroy
cd terraform && terraform destroy

# Vuelve a iniciar
./scripts/init-terraform.sh
```

## 📚 Documentación Completa

Ver [README.md](README.md) para información detallada sobre:
- Arquitectura de módulos
- Variables disponibles
- Outputs después del deployment
- Troubleshooting avanzado
- Referencias de documentación

## 💿 Variables Importantes

**En terraform.tfvars:**
```hcl
gcp_project_id     = "my-project-id"      # Tu Google Cloud Project
mongodb_atlas_uri  = "mongodb+srv://..."   # Tu MongoDB Atlas connection string
environment        = "dev"                  # dev, staging, o prod
gcp_region         = "us-central1"         # Región GCP
machine_type       = "e2-medium"           # Tipo de máquina
```

## ⏱️ Tiempos Estimados

| Paso | Tiempo |
|------|--------|
| Init Terraform | 30 segundos |
| Validar config | 10 segundos |
| terraform plan | 1-2 minutos |
| terraform apply | 3-5 minutos |
| VM inicializa | 2-3 minutos |
| MongoDB ops | 1-2 minutos |
| **Total** | **~15 minutos** |

---

¿Necesitas ayuda? Ve al [README.md](README.md) o ejecuta:
```bash
terraform output   # Ver todos los outputs
terraform show     # Ver el estado actual
```
