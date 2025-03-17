# Backend API con Node.js, MongoDB y JWT

## Descripción
Backend basado en Node.js y MongoDB que proporciona autenticación de usuarios y gestión de productos mediante una API RESTful. Utiliza JWT (JSON Web Tokens) para la autenticación y Docker para su despliegue.

## Requisitos Previos
- Docker y Docker Compose instalados
- Node.js 20+ (si se ejecuta localmente)

## Instalación con Docker

1. Clona el repositorio
2. Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://admin:hlanz@mongodb:27017/db_apis?authSource=admin
JWT_SECRET=your_jwt_secret_key
```

3. Ejecuta los contenedores:
```bash
docker-compose up --build
```

Los servicios estarán disponibles en:
- API: http://localhost:3000
- MongoDB: localhost:27017
- Mongo Express (Administración BD): http://localhost:8081
  - Usuario: admin
  - Contraseña: hlanz

## Endpoints

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
```
Body:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "tucontraseña"
}
```
Respuesta (201 Created):
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

#### Login
```http
POST /api/auth/login
```
Body:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "tucontraseña"
}
```
Respuesta (200 OK):
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### Productos

#### Obtener Todos los Productos (Público)
```http
GET /api/products
```

#### Obtener un Producto (Público)
```http
GET /api/products/:id
```

#### Crear Producto (Protegido)
```http
POST /api/products
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "name": "Nombre Producto",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 100
}
```

#### Actualizar Producto (Protegido)
```http
PUT /api/products/:id
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "name": "Nuevo Nombre",
    "price": 149.99
}
```

#### Eliminar Producto (Protegido)
```http
DELETE /api/products/:id
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

## Ejemplos de Uso con cURL

### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "test@ejemplo.com", "password": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@ejemplo.com", "password": "123456"}'
```

### Crear Producto (con token)
```bash
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN" \
-d '{"name": "Producto Test", "description": "Descripción", "price": 99.99, "stock": 10}'
```

### Obtener Productos
```bash
curl http://localhost:3000/api/products
```

## Estructura del Proyecto
```
src/
  ├── config/
  │   └── database.js     # Configuración de MongoDB
  ├── controllers/
  │   ├── auth.controller.js    # Lógica de autenticación
  │   └── product.controller.js # Lógica de productos
  ├── middleware/
  │   └── auth.js         # Middleware de autenticación JWT
  ├── models/
  │   ├── User.js         # Modelo de usuario
  │   └── Product.js      # Modelo de producto
  ├── routes/
  │   ├── auth.routes.js  # Rutas de autenticación
  │   └── product.routes.js # Rutas de productos
  └── index.js            # Punto de entrada
```

## Notas Importantes
- Los tokens JWT expiran en 1 hora
- Las contraseñas se encriptan con bcrypt antes de almacenarse
- Las rutas protegidas requieren el token JWT en el header
- La base de datos es persistente gracias a los volúmenes de Docker
- Mongo Express permite administrar la base de datos visualmente

## Códigos de Error Comunes

### Errores de Autenticación (401)
```json
{
    "message": "No token provided"
}
```
```json
{
    "message": "Invalid token"
}
```
```json
{
    "message": "Invalid credentials"
}
```

### Errores de Recursos (404)
```json
{
    "message": "Product not found"
}
```

### Errores de Validación (400)
```json
{
    "message": "User already exists"
}
```