#!/bin/bash

# Script de instalación de herramientas en Compute Engine para conectarse a MongoDB Atlas

set -e

echo "Actualizando sistema..."
sudo apt-get update
sudo apt-get upgrade -y

echo "Instalando mongosh (cliente MongoDB)..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-mongosh

echo "Instalando curl y otros utilities..."
sudo apt-get install -y curl wget git nano

echo "Configurando variables de entorno..."
echo "export MONGODB_ATLAS_URI='${mongodb_uri}'" | sudo tee -a /etc/profile.d/mongodb.sh

echo "✓ Herramientas instaladas exitosamente"
echo "Puedes conectarte a MongoDB Atlas con:"
echo "mongosh \"\${mongodb_uri}\""
