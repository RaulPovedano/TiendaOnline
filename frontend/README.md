# Frontend Tienda Online con Angular

## Descripción
Frontend de una tienda online desarrollado con Angular 17, utilizando Tailwind CSS para los estilos y siguiendo un diseño responsive. La aplicación incluye autenticación de usuarios, catálogo de productos, carrito de compras, gestión de pedidos y panel de administración.

## Requisitos Previos
- Node.js 20+
- npm 10+
- Docker y Docker Compose (para desarrollo con contenedores)

## Instalación

### Desarrollo Local

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Desarrollo con Docker

1. Clona el repositorio
2. Ejecuta los contenedores:
```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:80`

## Estructura del Proyecto
```
src/
  ├── app/
  │   ├── components/
  │   │   ├── products/           # Componentes de productos
  │   │   ├── cart/              # Componentes del carrito
  │   │   ├── auth/              # Componentes de autenticación
  │   │   ├── admin/             # Componentes de administración
  │   │   ├── profile/           # Componentes de perfil
  │   │   ├── checkout/          # Componentes de pago
  │   │   ├── about/             # Componentes de información
  │   │   └── contact/           # Componentes de contacto
  │   ├── services/
  │   │   ├── auth.service.ts    # Servicio de autenticación
  │   │   ├── product.service.ts # Servicio de productos
  │   │   ├── cart.service.ts    # Servicio del carrito
  │   │   └── order.service.ts   # Servicio de pedidos
  │   ├── models/
  │   │   ├── product.model.ts   # Modelo de producto
  │   │   ├── user.model.ts      # Modelo de usuario
  │   │   ├── cart.model.ts      # Modelo de carrito
  │   │   └── order.model.ts     # Modelo de pedido
  │   ├── guards/
  │   │   ├── auth.guard.ts      # Guard de autenticación
  │   │   └── admin.guard.ts     # Guard de administrador
  │   ├── pipes/
  │   │   └── cart-count.pipe.ts # Pipe para contar items
  │   └── app.component.ts       # Componente principal
  ├── assets/                    # Recursos estáticos
  └── environments/              # Configuración por entorno
```

## Características Principales

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Protección de rutas
- Gestión de tokens JWT

### Catálogo de Productos
- Lista de productos con diseño responsive
- Búsqueda de productos
- Detalles de producto
- Indicadores de stock

### Carrito de Compras
- Añadir/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia del carrito
- Validación de stock

### Proceso de Compra
- Resumen del pedido
- Método de pago (Stripe)
- Dirección de envío
- Confirmación de pedido
- Historial de pedidos

### Panel de Administración
- Gestión de productos (CRUD)
- Gestión de usuarios (CRUD)
- Gestión de pedidos (CRUD)
- Estadísticas de ventas (top 5 clientes que mas gastaron)
- Importación de productos mediante CSV

### Perfil de Usuario
- Información personal
- Historial de pedidos
- Gestión de direcciones

## Componentes Responsive

### Navegación
- Menú hamburguesa en móvil
- Menú desplegable en escritorio (perfil)
- Indicador de carrito
- Menú de usuario

### Lista de Productos
- Grid de 2 columnas en móvil
- Grid de 3 columnas en tablet
- Grid de 4 columnas en escritorio
- Imágenes
- Texto adaptable

### Carrito
- Vista compacta en móvil
- Vista expandida en escritorio
- Controles táctiles
- Resumen responsive

### Formularios
- Campos adaptables
- Validación en tiempo real
- Mensajes de error claros
- Botones táctiles

## Tecnologías Utilizadas

### Core
- Angular 17
- TypeScript
- RxJS (para manejar operaciones asíncronas)
- Angular Router (sistema de rutas de Angular)
- Angular Forms (para crear y manejar formularios)

### Estilos
- Tailwind CSS
- Responsive
- Flexbox/Grid

### Herramientas
- Angular CLI
- Docker
- Nginx (producción)

## Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

```

### Docker
```bash
# Construir imagen
docker build -t tienda-online-frontend .

# Ejecutar contenedor
docker run -p 80:80 tienda-online-frontend
```

## Despliegue

### Producción
1. Construir la aplicación:
```bash
npm run build
```

2. Los archivos generados estarán en `dist/`

### Docker
1. Construir la imagen:
```bash
docker build -t tienda-online-frontend .
```

2. Ejecutar el contenedor:
```bash
docker run -d -p 80:80 tienda-online-frontend
```

## Notas Importantes
- La aplicación está optimizada para móviles primero
- El carrito persiste entre sesiones
- Los formularios incluyen validación completa
- Las rutas están protegidas según el rol del usuario

## Códigos de Error Comunes

### Errores de Autenticación
```typescript
{
    message: "Credenciales inválidas"
}
```

### Errores de API
```typescript
{
    message: "Error al conectar con el servidor"
}
```

### Errores de Validación
```typescript
{
    message: "Por favor, complete todos los campos"
}
```

