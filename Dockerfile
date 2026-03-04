FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm ci
RUN npm ci --prefix frontend

COPY . .

RUN npm run build --prefix frontend

EXPOSE 5000

CMD ["node", "backend/server.js"]
