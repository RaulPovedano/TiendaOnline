# 1. Build del frontend (Angular)
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# 2. Build del backend (Node.js)
FROM node:20-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# 3. Imagen final: Node.js sirviendo el frontend
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./frontend/dist
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "start"] 