# Guía de Inicio Rápido - EcoXperiencia

## ⚡ Opción 1: Docker Compose (5 minutos)

La forma más rápida de tener todo funcionando:

```bash
# 1. Ir al directorio del proyecto
cd ecoxperiencia

# 2. Iniciar servicios
docker-compose up -d

# 3. Esperar 30 segundos y verificar
docker-compose ps

# 4. Acceder a:
# Frontend: http://localhost
# API: http://localhost:3000
# Docs: http://localhost:3000/api/docs
```

### ¿Qué instala Docker Compose?

- ✅ PostgreSQL 16 (base de datos)
- ✅ Redis 7 (caché, opcional)
- ✅ Backend NestJS (API)
- ✅ Frontend (Nginx sirviendo HTML)
- ✅ Seed de datos (8 experiencias + usuarios de prueba)

### Detener servicios

```bash
# Detener
docker-compose down

# Detener y eliminar datos
docker-compose down -v
```

---

## ⚙️ Opción 2: Instalación Manual

### Paso 1: Base de datos

```bash
# Con Docker
docker run -d \
  --name ecoxperiencia-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecoxperiencia \
  -p 5432:5432 \
  postgres:16-alpine

# O instalar PostgreSQL localmente y crear base de datos:
# createdb ecoxperiencia
```

### Paso 2: Backend

```bash
# Ir al backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# El .env por defecto debería funcionar con Docker:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecoxperiencia?schema=public"

# Crear tablas y datos de prueba
npx prisma migrate dev
npx prisma db seed

# Iniciar servidor
npm run start:dev
```

### Paso 3: Frontend

```bash
# Desde la raíz del proyecto
# Opción 1: Python
python -m http.server 5500

# Opción 2: Node.js
npx serve -l 5500

# Opción 3: VS Code
# Click derecho en index.html → Open with Live Server
```

---

## 🧪 Verificar instalación

### 1. Frontend

Abre http://localhost:5500 (o el puerto que uses)

Deberías ver la landing page de EcoXperiencia.

### 2. Backend

```bash
# Test API
curl http://localhost:3000/api/docs

# Debería mostrar la documentación Swagger
```

### 3. Login de prueba

Usa estas credenciales:

```
Email: usuario@ejemplo.com
Contraseña: password123
```

---

## 🐛 Troubleshooting

### Puerto 3000 ocupado

```bash
# Buscar proceso
lsof -i :3000
# o
netstat -ano | findstr :3000

# Matar proceso
kill -9 <PID>
```

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
docker ps

# Ver logs
docker logs ecoxperiencia-postgres

# Resetear base de datos
docker-compose down -v
docker-compose up -d postgres
```

### Error "Cannot find module '@prisma/client'"

```bash
cd backend
npx prisma generate
npm install
```

### Prisma migrate falla

```bash
# Resetear migraciones
npx prisma migrate reset

# O forzar recreación
npx prisma migrate dev --name init
```

---

## 📝 Comandos útiles

### Docker

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild
docker-compose up -d --build

# Shell en contenedor
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres
```

### Backend

```bash
cd backend

# Modo desarrollo
npm run start:dev

# Modo debug
npm run start:debug

# Producción
npm run build
npm run start:prod

# Prisma
npx prisma studio        # UI de base de datos
npx prisma db seed     # Recrear datos de prueba
```

---

## 🎯 Siguientes pasos

1. **Explora la API**
   - Ve a http://localhost:3000/api/docs
   - Prueba los endpoints con Swagger

2. **Crea un usuario**
   - Regístrate en el frontend
   - O usa el endpoint POST /auth/register

3. **Conviértete en anfitrión**
   - Ve a la sección "Sé anfitrión"
   - Completa el registro

4. **Crea una experiencia**
   - POST /experiences (desde Swagger o implementa el formulario)

---

## 📚 Documentación

- [API Integration Guide](./API_INTEGRATION.md)
- [Design Document](./design_document.md)
- [Backend README](./backend/README.md)

## 💬 Soporte

Si tienes problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica que los puertos estén libres
3. Asegúrate de tener Node.js 20+ y npm
4. Consulta el [documento de diseño](./design_document.md)

---

**¡Listo!** 🎉 Ahora tienes EcoXperiencia corriendo localmente.
