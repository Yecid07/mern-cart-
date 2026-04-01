# Multi-stage build para optimizar tamaño en Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Stage final - imagen pequeña
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias del builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar código de la aplicación
COPY . .

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Exponer puerto (Cloud Run asigna automáticamente)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar aplicación
CMD ["node", "server.js"]
