# Backend API con Node.js, MongoDB y JWT

## Descripción
Backend basado en Node.js y MongoDB que proporciona una API para una tienda online. Incluye autenticación de usuarios, gestión de productos, carrito de compras y gestión de pedidos. Utiliza JWT (JSON Web Tokens) para la autenticación y Docker para su despliegue.


1. Crea un archivo `.env` en la carpeta /backend del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://admin:password@mongodb:27017/db_apis?authSource=admin
JWT_SECRET=tu_jwt_secreto
STRIPE_SECRET_KEY=sk_test_7665789......
STRIPE_PUBLISHABLE_KEY=pk_test_6568288.....
```

Los servicios estarán disponibles en:
- API: http://localhost:3000
- MongoDB: localhost:27017
- Mongo Express (Administración BD): http://localhost:8081
  - Usuario: admin
  - Contraseña: password

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
    "password": "tucontraseña",
    "name": "Nombre Usuario"
}
```
Respuesta (201 Created):
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
        "id": "user_id",
        "email": "usuario@ejemplo.com",
        "name": "Nombre Usuario",
        "role": "ROLE_USER"
    }
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
        "id": "user_id",
        "email": "usuario@ejemplo.com",
        "name": "Nombre Usuario",
        "role": "ROLE_USER"
    }
}
```

### Productos

#### Obtener Todos los Productos (Público)
```http
GET /api/products
```

#### Buscar Productos (Público)
```http
GET /api/products/search?name=nombre_producto
```

#### Obtener un Producto (Público)
```http
GET /api/products/:id
```

#### Crear Producto (Admin)
```http
POST /api/admin/products
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
    "stock": 100,
    "img": "url_imagen"
}
```

#### Actualizar Producto (Admin)
```http
PUT /api/admin/products/:id
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "name": "Nuevo Nombre",
    "price": 149.99,
    "stock": 50
}
```

#### Eliminar Producto (Admin)
```http
DELETE /api/admin/products/:id
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

#### Subir Productos CSV (Admin)
```http
POST /api/admin/products/upload
```
Headers:
```
Authorization: Bearer tu-token-aquí
Content-Type: multipart/form-data
```
Body:
```
file: archivo.csv
```

### Carrito

#### Obtener Carrito
```http
GET /api/cart
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

#### Añadir al Carrito
```http
POST /api/cart
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "productId": "id_producto",
    "quantity": 1
}
```

#### Actualizar Cantidad
```http
PUT /api/cart/:productId
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "quantity": 2
}
```

#### Eliminar del Carrito
```http
DELETE /api/cart/:productId
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

### Pedidos

#### Crear Pedido
```http
POST /api/orders
```
Headers:
```
Authorization: Bearer tu-token-aquí
```
Body:
```json
{
    "address": "Dirección de envío",
    "paymentMethod": "tarjeta"
}
```

#### Obtener Pedidos del Usuario
```http
GET /api/orders
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

#### Obtener Detalles de Pedido
```http
GET /api/orders/:id
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

### Administración

#### Obtener Todos los Usuarios (Admin)
```http
GET /api/admin/users
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

#### Obtener Todos los Pedidos (Admin)
```http
GET /api/admin/orders
```
Headers:
```
Authorization: Bearer tu-token-aquí
```

## Estructura del Proyecto
```
src/
  ├── config/
  │   └── database.js     # Configuración de MongoDB
  ├── controllers/
  │   ├── auth.controller.js    # Lógica de autenticación
  │   ├── product.controller.js # Lógica de productos
  │   ├── cart.controller.js    # Lógica del carrito
  │   ├── order.controller.js   # Lógica de pedidos
  │   └── admin.controller.js   # Lógica de administración
  ├── middleware/
  │   ├── auth.js         # Middleware de autenticación JWT
  │   └── admin.js        # Middleware de verificación de admin
  ├── models/
  │   ├── User.js         # Modelo de usuario
  │   ├── Product.js      # Modelo de producto
  │   ├── Cart.js         # Modelo de carrito
  │   └── Order.js        # Modelo de pedido
  ├── routes/
  │   ├── auth.routes.js  # Rutas de autenticación
  │   ├── product.routes.js # Rutas de productos
  │   ├── cart.routes.js  # Rutas del carrito
  │   ├── order.routes.js # Rutas de pedidos
  │   └── admin.routes.js # Rutas de administración
  └── index.js            # Punto de entrada
```

## Notas Importantes
- Los tokens JWT expiran en 24 horas
- Las contraseñas se encriptan con bcrypt antes de almacenarse
- Las rutas protegidas requieren el token JWT en el header
- La base de datos es persistente gracias a los volúmenes de Docker
- Mongo Express permite administrar la base de datos visualmente
- Los roles de usuario son: ROLE_USER y ROLE_ADMIN
- Las imágenes de productos deben ser URLs válidas
- El carrito se limpia automáticamente al crear un pedido

## Códigos de Error Comunes

### Errores de Autenticación (401)
```json
{
    "message": "No token provided"
}
```
```json
{
    "message": "Token inválido"
}
```
```json
{
    "message": "Credenciales inválidas"
}
```

### Errores de Autorización (403)
```json
{
    "message": "Acceso denegado. Se requiere rol de administrador."
}
```

### Errores de Recursos (404)
```json
{
    "message": "Producto no encontrado"
}
```
```json
{
    "message": "Carrito no encontrado"
}
```
```json
{
    "message": "Pedido no encontrado"
}
```

### Errores de Validación (400)
```json
{
    "message": "El usuario ya existe"
}
```
```json
{
    "message": "Datos de producto inválidos"
}
```
```json
{
    "message": "Stock insuficiente"
}
```

### Errores del Servidor (500)
```json
{
    "message": "¡Ups! Algo salió mal!"
}
```