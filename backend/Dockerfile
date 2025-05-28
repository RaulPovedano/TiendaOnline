# Etapa 1: Build de frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend .
RUN npm run build

# Etapa 2: Backend
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia el backend
COPY package*.json ./
RUN npm install
COPY . .

# Copia el build del frontend al backend
COPY --from=frontend-build /app/frontend/dist/frontend ./frontend/dist/frontend

EXPOSE 3000

CMD ["node", "src/index.js"]

