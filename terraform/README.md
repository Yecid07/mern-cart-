# Terraform - Infraestructura en Google Cloud Platform

Este proyecto define la infraestructura de la aplicación Cart API en GCP usando Terraform de forma modular, integrando MongoDB Atlas como base de datos.

## ⚡ Quick Start

```bash
# 1. Inicializar (pide Project ID y MongoDB URI)
./scripts/init-terraform.sh

# 2. Validar configuración
./scripts/validate-terraform.sh

# 3. Desplegar infraestructura
terraform apply

# 4. Verificar deployment
./scripts/verify-deployment.sh
```

## 📋 Servicios Configurados

1. **VPC Network** - Red privada con subredes
2. **Compute Engine** - Máquina virtual para ejecutar la aplicación y scripts
3. **Cloud Storage** - Almacenamiento de objetos
4. **MongoDB Atlas** - Base de datos MongoDB en la nube (referenciada externamente)

## 📁 Estructura del Proyecto

```
terraform/
├── main.tf                      # Orquestación de módulos
├── variables.tf                 # Variables globales
├── outputs.tf                   # Salidas de la infraestructura
├── provider.tf                  # Configuración de GCP
├── terraform.tfvars.example     # Ejemplo de variables (copiar a terraform.tfvars)
├── .gitignore                   # Archivos a ignorar en Git
├── modules/
│   ├── network/                # VPC, subnets, firewall rules
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/                # Compute Engine
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── storage/                # Cloud Storage
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── database/               # Configuración de MongoDB Atlas
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/                    # Entorno de desarrollo
│   │   └── main.tf
│   ├── staging/                # Entorno de staging
│   │   └── main.tf
│   └── prod/                   # Entorno de producción
│       └── main.tf
├── scripts/
│   ├── init-terraform.sh       # Script automático de inicialización
│   ├── validate-terraform.sh   # Script de validación
│   ├── setup_server.sh         # Instalación de herramientas en VM
│   ├── setup_mongodb.sh        # Configuración de MongoDB (legacy)
│   ├── create_collections_atlas.js  # Crear colecciones en Atlas
│   ├── insert_data_atlas.js    # Insertar datos de prueba
│   └── drop_database_atlas.js  # Borrar base de datos
├── destroy.sh                  # Script para destruir infraestructura
└── README.md                   # Este archivo
```

## 🚀 Prerequisitos

- Terraform >= 1.0
- Google Cloud SDK instalado
- Credenciales de GCP configuradas
- SSH key generada (ssh-keygen -t rsa)

## 🔧 Configuración Previa

### 1. Requisitos del Sistema

**Linux/macOS:**
```bash
# Terraform
brew install terraform

# Google Cloud SDK
brew install google-cloud-sdk

# SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
```

**Windows (PowerShell):**
```powershell
# Terraform - usar Chocolatey
choco install terraform

# Google Cloud SDK - descargar desde:
# https://cloud.google.com/sdk/docs/install

# SSH key (Already included in Windows 10+)
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\id_rsa
```

### 2. Autenticarse en GCP

```bash
gcloud auth login
gcloud config set project TU_PROJECT_ID
```

### 3. Obtener MongoDB Atlas URI

1. Ve a https://cloud.mongodb.com/v2
2. Selecciona tu proyecto
3. Ve a "Database Deployments"
4. Haz clic en "Connect"
5. Selecciona "Connect with MongoDB Atlas Database Tools"
6. Copia la URI completa (formato: `mongodb+srv://usuario:password@cluster.mongodb.net/database_name`)

### 4. Configurar SSH Key en GCP (Opcional pero Recomendado)

Si quieres que Terraform agregue tu SSH key automáticamente a la VM:

```bash
# Para agregar key a tu proyecto GCP
gcloud compute os-login ssh-keys add --key-file=~/.ssh/id_rsa.pub
```

## 📝 Despliegue

### Opción A: Usar Script Automático (Recomendado)

El script `init-terraform.sh` configura todo automáticamente:

```bash
chmod +x scripts/init-terraform.sh
./scripts/init-terraform.sh
```

Este script:
1. Verifica que Terraform está instalado
2. Te pide el GCP Project ID
3. Te pide el MongoDB Atlas URI
4. Crea `terraform.tfvars`
5. Ejecuta `terraform init`

### Opción B: Configuración Manual

#### 1. Crear archivo de variables

Copia `terraform.tfvars.example` a `terraform.tfvars`:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edita `terraform.tfvars` con:
- Tu GCP Project ID
- Tu MongoDB Atlas URI

#### 2. Inicializar Terraform

```bash
terraform init
```

### Validar la Configuración

Ejecuta el script de validación:

```bash
chmod +x scripts/validate-terraform.sh
./scripts/validate-terraform.sh
```

Este script:
1. Verifica que `terraform.tfvars` existe
2. Valida la sintaxis de Terraform
3. Muestra un preview del plan (opcional)

### Aplicar la Configuración

Una vez validado, aplica los cambios:

```bash
terraform apply
```

Terraform te pedirá confirmación. Escribe `yes` para continuar.

## 🔐 Conexión y Operaciones en MongoDB Atlas

### 1. Obtener IP de Compute Engine

```bash
terraform output compute_engine_ip
```

O ver todos los outputs:

```bash
terraform output
```

### 2. Conectarse por SSH a la VM

```bash
# Linux/macOS
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA>

# Windows (PowerShell)
ssh -i $env:USERPROFILE\.ssh\id_rsa ubuntu@<IP_PUBLICA>
```

### 3. Copiar Scripts de MongoDB

Desde tu máquina local, copia los scripts MongoDB a la VM:

```bash
# Crear directorio en la VM (ejecutar una vez)
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA> "mkdir -p ~/mongodb-scripts"

# Copiar scripts
scp -i ~/.ssh/id_rsa terraform/scripts/create_collections_atlas.js ubuntu@<IP_PUBLICA>:~/mongodb-scripts/
scp -i ~/.ssh/id_rsa terraform/scripts/insert_data_atlas.js ubuntu@<IP_PUBLICA>:~/mongodb-scripts/
scp -i ~/.ssh/id_rsa terraform/scripts/drop_database_atlas.js ubuntu@<IP_PUBLICA>:~/mongodb-scripts/
```

### 4. Ejecutar Scripts en MongoDB Atlas

Conectate a la VM y ejecuta los scripts:

```bash
# Conectar a la VM
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA>

# Dentro de la VM:

# Crear colecciones y índices
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/cart_production" < ~/mongodb-scripts/create_collections_atlas.js

# Insertar datos de prueba
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/cart_production" < ~/mongodb-scripts/insert_data_atlas.js

# Verificar datos (opcional)
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/cart_production" --eval "db.users.find().pretty()"

# Eliminar base de datos (cuando termines)
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/cart_production" < ~/mongodb-scripts/drop_database_atlas.js
```

**Nota:** Reemplaza `usuario:password@cluster` con tu conexión real de MongoDB Atlas.

### Alternativa: Ejecutar Scripts Directamente desde Local

Si tu máquina tiene mongosh instalado, puedes ejecutar directamente:

```bash
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/cart_production" < terraform/scripts/create_collections_atlas.js
```

## 🗑️ Destruir la Infraestructura

### Opción 1: Comando de Terraform

```bash
terraform destroy
```

### Opción 2: Script de Destrucción

```bash
bash destroy.sh
```

## 📊 Outputs Importantes

Después de ejecutar `terraform apply`, obtén los outputs con:

```bash
terraform output
```

Outputs disponibles:
- `vpc_network_id` - ID de la red VPC
- `compute_engine_ip` - IP pública de la VM
- `compute_engine_internal_ip` - IP interna de la VM
- `storage_bucket_name` - Nombre del bucket de Storage
- `mongodb_atlas_connection_info` - Conexión a MongoDB Atlas configurada

## 🔒 Seguridad

- Las contraseñas se almacenan en `terraform.tfvars` (agregar a `.gitignore`)
- Firewall rules solo permiten SSH, MongoDB y HTTP/HTTPS
- MongoDB requiere autenticación
- Cloud Storage usa uniform bucket-level access

## 🐛 Troubleshooting

### Error: "Terraform Init Fails"

```bash
# Verifica que tienes credenciales de GCP
gcloud auth list

# Verifica que el proyecto está configurado
gcloud config get-value project

# Limpiar cache y reintentar
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### Error: "terraform.tfvars not found"

Crea manualmente o usa el script:

```bash
./scripts/init-terraform.sh
# O copia manualmente
cp terraform.tfvars.example terraform.tfvars
# Edita terraform.tfvars con tus valores
```

### Problemas de conexión SSH a la VM

1. Verifica que la VM está corriendo:
```bash
gcloud compute instances list
```

2. Verifica firewall rules permiten SSH:
```bash
gcloud compute firewall-rules list --filter="name:cart-api*"
```

3. Intenta borrar la clave de known_hosts y reconectar:
```bash
ssh-keygen -R <IP_PUBLICA>
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA>
```

### MongoDB Atlas no responde

1. Verifica que tu IP está en IP Whitelist de Atlas:
   - Ve a Security → Network Access
   - Asegúrate que 0.0.0.0/0 está permitido o tu IP específica

2. Verifica la conexión desde la VM:
```bash
# Desde dentro de la VM
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/test"
```

3. Verifica credenciales del Atlas:
   - Usuario y contraseña correctos en la URI
   - Base de datos existe (por defecto: admin)

### Errores de permiso al ejecutar scripts

```bash
# Dar permisos de ejecución a los scripts
chmod +x scripts/init-terraform.sh
chmod +x scripts/validate-terraform.sh
chmod +x scripts/setup_server.sh
chmod +x destroy.sh
```

### Costo de Infraestructura muy alto

Ve a tu proyecto en GCP Console:
- Ve a "Billing"
- Revisa qué servicios consumen más
- Ejecuta `terraform destroy` para eliminar recursos

## ✅ Verificación del Deployment

Después de `terraform apply`, verifica:

1. Compute Engine corriendo:
```bash
terraform output compute_engine_ip
```

2. Storage bucket creado:
```bash
terraform output storage_bucket_name
```

3. VPC y Subnets:
```bash
gcloud compute networks list --filter="name:cart-api*"
gcloud compute networks subnets list --filter="network:cart-api*"
```

4. Conectividad SSH:
```bash
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA> "echo 'SSH conectado exitosamente'"
```

5. Mongosh instalado en la VM:
```bash
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICA> "mongosh --version"
```

## 📖 Referencias

- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [GCP Compute Engine](https://cloud.google.com/compute/docs)
