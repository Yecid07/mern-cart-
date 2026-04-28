#!/bin/bash

# Script para destruir la infraestructura de Terraform

set -e

echo "⚠️  ADVERTENCIA: Esto eliminará toda la infraestructura en GCP"
echo "Recursos que serán eliminados:"
echo "  - VPC Network"
echo "  - Compute Engine (MongoDB)"
echo "  - Cloud Storage Bucket"
echo "  - Firewall Rules"
echo ""

read -p "¿Estás seguro de que deseas continuar? (sí/no): " confirm

if [[ "$confirm" == "sí" || "$confirm" == "si" || "$confirm" == "yes" ]]; then
  echo "Iniciando destrucción..."
  terraform destroy -auto-approve
  echo "✓ Infraestructura eliminada exitosamente"
else
  echo "Operación cancelada"
  exit 1
fi
