# Etapa 1: Build de frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Etapa 2: Backend
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia el backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Copia el build del frontend al backend
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./public

# Configura las variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV FRONTEND_URL=http://localhost:3000

# Expone el puerto
EXPOSE 3000

# Inicia el servidor
CMD ["node", "src/index.js"] 