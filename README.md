# Tienda Online - Desplegada en produccion

https://tienda-online-production-08a4.up.railway.app


# Tienda Online - Despliegue Local



Este proyecto es una tienda online con frontend en Angular y backend en Node.js + Express, usando MongoDB como base de datos.  
A continuación tienes los pasos para desplegarlo **en local** usando Docker y Docker Compose.

---

## Requisitos Previos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/) (viene incluido con Docker Desktop)

---

## 1. Clona el repositorio

```bash
git clone https://github.com/RaulPovedano/TiendaOnline.git
cd TiendaOnline
```

---

## 2. Configura las variables de entorno

Puedes usar las variables ya definidas en `docker-compose.yml` o crear un archivo `.env` en la raíz del proyecto.  
Ejemplo de `.env` para el backend:

```env
PORT=3000
MONGODB_URI=mongodb://admin:password@mongodb:27017/tienda?authSource=admin
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:4200
```

## 3. Construye y levanta los contenedores

```bash
docker-compose up --build
```

Esto levantará:
- MongoDB (base de datos)
- Backend (Node.js/Express)
- Frontend (Angular)
- Mongo Express para administrar la base de datos visualmente en `http://localhost:8081`

---

## 4. Accede a la aplicación

- **Frontend Angular:**  
  [http://localhost:4200](http://localhost:4200)

- **Backend API:**  
  [http://localhost:3000/api](http://localhost:3000/api)

- **Mongo Express:**  
  [http://localhost:8081](http://localhost:8081)  
  Usuario: `admin`  
  Contraseña: `password`

---

## 5. Datos

Puedes crear productos, usuarios, etc. desde el frontend o usando Mongo Express.

---

## 6. Parar los contenedores

Para detener todos los servicios:

```bash
docker-compose down
```

---

## Notas

- Si cambias variables de entorno, reinicia los contenedores.
- Si tienes problemas de puertos ocupados, asegúrate de que no tienes otros servicios corriendo en los mismos puertos.
- Puedes modificar los archivos de entorno (`environment.ts` y `environment.prod.ts`) para cambiar las URLs del backend según tu entorno.

---