#!/bin/bash

# Script de validación de Terraform
# Verifica que la configuración sea correcta antes de ejecutar

set -e

echo "🔍 Validando configuración de Terraform..."
echo ""

TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$TERRAFORM_DIR"

# Verificar que terraform.tfvars existe
if [ ! -f "terraform.tfvars" ]; then
    echo "❌ terraform.tfvars no encontrado"
    echo "Ejecuta primero: ./scripts/init-terraform.sh"
    exit 1
fi

echo "✓ terraform.tfvars encontrado"

# Verificar que Terraform esté inicializado
if [ ! -d ".terraform" ]; then
    echo "⚠️  Terraform no inicializado. Ejecutando terraform init..."
    terraform init
fi

echo "✓ .terraform encontrado"

# Validar configuración
echo ""
echo "Validando sintaxis de Terraform..."
terraform validate

echo ""
echo "✓ Validación completada exitosamente"

# Mostrar plan
echo ""
read -p "¿Deseas ver el plan de Terraform? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    terraform plan
fi

echo ""
echo "Para aplicar los cambios, ejecuta:"
echo "terraform apply"
