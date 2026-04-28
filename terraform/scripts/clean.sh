#!/bin/bash

# Script de limpieza rápida
# Borra el estado de Terraform sin destruir infraestructura

set -e

echo "⚠️  ADVERTENCIA: Este script borra el estado local de Terraform"
echo "   Usa esto solo si:"
echo "   - La infraestructura ya fue destruida manualmente"
echo "   - Necesitas reiniciar desde cero"
echo ""

read -p "¿Estás seguro? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Cancelado"
    exit 0
fi

TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$TERRAFORM_DIR"

echo "Limpiando estado de Terraform..."

# Remover directorios de Terraform
rm -rf .terraform
rm -f .terraform.lock.hcl
rm -f terraform.tfstate*

echo "✓ Limpieza completada"
echo "Puedes ejecutar: terraform init"
