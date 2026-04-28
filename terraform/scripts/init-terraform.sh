#!/bin/bash

# Script de inicialización de Terraform
# Este script configura el ambiente y ejecuta terraform init

set -e

echo "🚀 Inicializando Terraform para MERN Cart API"
echo ""

# Verificar si Terraform está instalado
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform no está instalado"
    echo "Por favor, instala Terraform desde: https://www.terraform.io/downloads"
    exit 1
fi

TERRAFORM_VERSION=$(terraform version | head -n 1)
echo "✓ $TERRAFORM_VERSION encontrado"
echo ""

# Directorio raíz de Terraform
TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$TERRAFORM_DIR"

# Verificar si terraform.tfvars ya existe
if [ -f "terraform.tfvars" ]; then
    echo "⚠️  terraform.tfvars ya existe"
    read -p "¿Deseas reemplazarlo? (s/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Usando terraform.tfvars existente"
        echo ""
    else
        rm terraform.tfvars
    fi
fi

# Si no existe terraform.tfvars, crear uno
if [ ! -f "terraform.tfvars" ]; then
    echo "📝 Configura los valores necesarios"
    echo ""
    
    # Pedir GCP Project ID
    read -p "GCP Project ID: " gcp_project_id
    if [ -z "$gcp_project_id" ]; then
        echo "❌ Project ID es requerido"
        exit 1
    fi
    
    # Pedir MongoDB Atlas URI
    echo ""
    echo "Para obtener tu MongoDB Atlas URI:"
    echo "1. Ve a mongodb.com/atlas"
    echo "2. Ve a tu cluster"
    echo "3. Haz clic en 'Connect'"
    echo "4. Selecciona 'Connect with MongoDB Atlas Database Tools'"
    echo "5. Copia la connection string"
    echo ""
    read -p "MongoDB Atlas URI: " mongodb_atlas_uri
    if [ -z "$mongodb_atlas_uri" ]; then
        echo "❌ MongoDB Atlas URI es requerido"
        exit 1
    fi
    
    # Crear terraform.tfvars
    cat > terraform.tfvars << EOF
gcp_project_id     = "$gcp_project_id"
mongodb_atlas_uri  = "$mongodb_atlas_uri"
environment        = "dev"
app_name           = "cart-api"
gcp_region         = "us-central1"
machine_type       = "e2-medium"
EOF
    
    echo ""
    echo "✓ terraform.tfvars creado"
else
    echo "✓ terraform.tfvars ya existe"
fi

echo ""
echo "Ejecutando terraform init..."
terraform init

echo ""
echo "✓ Inicialización completada"
echo ""
echo "Próximos pasos:"
echo "1. Revisa el plan: terraform plan"
echo "2. Aplica los cambios: terraform apply"
echo "3. Obtén los outputs: terraform output"
