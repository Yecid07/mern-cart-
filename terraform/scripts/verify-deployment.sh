#!/bin/bash

# Script de verificación post-deploy
# Verifica que la infraestructura fue creada correctamente

set -e

echo "🔍 Verificando infraestructura desplegada..."
echo ""

TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$TERRAFORM_DIR"

# Verificar que terraform.tfvars existe
if [ ! -f "terraform.tfvars" ]; then
    echo "❌ terraform.tfvars no encontrado"
    exit 1
fi

echo "📦 Recursos de Terraform"
echo "========================"

# Obtener outputs
COMPUTE_IP=$(terraform output -raw compute_engine_ip 2>/dev/null || echo "N/A")
internal_ip=$(terraform output -raw compute_engine_internal_ip 2>/dev/null || echo "N/A")
VPC_ID=$(terraform output -raw vpc_network_id 2>/dev/null || echo "N/A")
STORAGE_BUCKET=$(terraform output -raw storage_bucket_name 2>/dev/null || echo "N/A")

echo "✓ Compute Engine IP: $COMPUTE_IP"
echo "✓ Compute Engine Internal IP: $internal_ip"
echo "✓ VPC Network ID: $VPC_ID"
echo "✓ Storage Bucket: $STORAGE_BUCKET"

echo ""
echo "🌐 Verificando GCP..."
echo "===================="

# Verificar que la VM está corriendo
if gcloud compute instances list --filter="name:cart-api*" --format="value(name,status)" 2>/dev/null | grep -q "RUNNING"; then
    echo "✓ Compute Engine running"
else
    echo "⚠️  Compute Engine no está en estado RUNNING"
fi

# Verificar que el bucket existe
if gsutil ls -b "gs://$STORAGE_BUCKET" &>/dev/null 2>&1; then
    echo "✓ Storage bucket accessible"
else
    echo "⚠️  Storage bucket no es accesible"
fi

echo ""
echo "🔐 Verificando SSH..."
echo "===================="

if [ "$COMPUTE_IP" != "N/A" ] && [ ! -z "$COMPUTE_IP" ]; then
    # Intenta conectarse
    if timeout 5 ssh -i ~/.ssh/id_rsa -o ConnectTimeout=5 -o StrictHostKeyChecking=no ubuntu@$COMPUTE_IP "echo OK" &>/dev/null; then
        echo "✓ SSH connection OK"
        
        # Verifica mongosh
        if ssh -i ~/.ssh/id_rsa ubuntu@$COMPUTE_IP "which mongosh" &>/dev/null; then
            echo "✓ mongosh installed"
        else
            echo "⚠️  mongosh not installed yet (installing in background)"
        fi
    else
        echo "⚠️  SSH connection not available yet (may still be initializing)"
        echo "   Intenta nuevamente en unos minutos: ssh -i ~/.ssh/id_rsa ubuntu@$COMPUTE_IP"
    fi
else
    echo "⚠️  Compute Engine IP no obtenido"
fi

echo ""
echo "📋 Próximos pasos:"
echo "================"
echo "1. Espera 2-3 minutos para que la VM termine de inicializar"
echo "2. Copia scripts MongoDB a la VM:"
echo "   scp -i ~/.ssh/id_rsa terraform/scripts/create_collections_atlas.js ubuntu@$COMPUTE_IP:~/"
echo "3. Conectate por SSH:"
echo "   ssh -i ~/.ssh/id_rsa ubuntu@$COMPUTE_IP"
echo "4. Crea colecciones en Atlas:"
echo "   mongosh \"mongodb+srv://...\" < create_collections_atlas.js"
echo ""
echo "Para más ayuda, ve a: terraform/README.md"
