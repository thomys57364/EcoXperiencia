# 🌿 Backend EcoXperiencia

> API RESTful para la plataforma de ecoturismo **EcoXperiencia**

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-brightgreen)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue)](https://www.postgresql.org/)

---

## 📖 Descripción

Backend de la plataforma **EcoXperiencia**, una aplicación web que conecta viajeros con experiencias auténticas de ecoturismo en Colombia. Construida con **NestJS**, **Prisma** y **PostgreSQL**.

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Runtime** | Node.js 20 LTS |
| **Framework** | NestJS 11 |
| **Lenguaje** | TypeScript |
| **ORM** | Prisma 7 |
| **Base de Datos** | PostgreSQL 12+ |
| **Autenticación** | JWT + bcrypt |
| **Emails** | SendGrid / Resend |
| **Imágenes** | Cloudinary / AWS S3 |
| **Pagos** | Stripe (simulado) |

---

## 🚀 Quick Start

### 1. Requisitos Previos

```bash
# Verificar versiones
node --version  # v20.x
npm --version   # 9.x
psql --version  # PostgreSQL 12+
```

### 2. Clonar e Instalar

```bash
cd backend
npm install
```

### 3. Configurar Base de Datos

```bash
# Copiar template de variables
cp .env.example .env

# Editar .env con tu DATABASE_URL
nano .env
```

### 4. Crear Base de Datos

```bash
# Opción A: Localmente
createdb ecoxperiencia

# Opción B: Con Docker
docker run --name postgres-eco -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecoxperiencia -p 5432:5432 -d postgres:16
```

### 5. Ejecutar Migraciones

```bash
# Crear tablas
npm run prisma:migrate -- --name init

# Poblar con datos de prueba
npm run prisma:seed
```

### 6. Iniciar Servidor

```bash
# Desarrollo (con auto-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

**Servidor corriendo en:** `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── prisma/              # Servicio y módulo Prisma
├── users/               # Gestión de usuarios
├── categories/          # Categorías de experiencias
├── experiences/         # Experiencias de ecoturismo
├── hosts/               # Anfitriones/Guías
├── bookings/            # Reservas/Bookings
├── payments/            # Gestión de pagos
├── reviews/             # Reseñas y ratings
├── app.module.ts        # Módulo raíz
└── main.ts              # Entry point

prisma/
├── schema.prisma        # Definición de modelos (10 entidades)
├── migrations/          # Historial de migraciones
└── seed.ts              # Datos iniciales de prueba
```

---

## 🗄️ Base de Datos

### Modelos Principales

1. **User** - Usuarios (viajeros, anfitriones, admins)
2. **Host** - Información verificada de anfitriones
3. **Category** - Categorías de experiencias
4. **Experience** - Experiencias de ecoturismo
5. **ExperienceImage** - Imágenes de experiencias
6. **Booking** - Reservas de usuarios
7. **Payment** - Pagos y transacciones
8. **Review** - Reseñas y ratings
9. **Favorite** - Experiencias favoritas
10. **Notification** - Notificaciones del sistema
11. **Conversation** - Chats entre usuarios
12. **Message** - Mensajes

### Diagrama ER

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │1
       │ 1:1
       │ ├──→ Host
       │
    N  │ N:M
  ┌────┼────┐
  │    │    │
  ▼    │    ▼
Booking  Favorite
  │ 1:1 │
  │ ├──→ Payment
  │
  └──→ Review
       │1:N
       └──→ Experience
           ├──→ Category
           ├──→ Images
           └──→ Anfitrion(Host)
```

---

## 📡 API Endpoints

### Usuarios

```
GET    /users                 # Listar todos
POST   /users                 # Crear nuevo
GET    /users/:id            # Obtener por ID
PUT    /users/:id            # Actualizar
DELETE /users/:id            # Eliminar
```

### Categorías

```
GET    /categories            # Listar categorías activas
POST   /categories            # Crear categoría
GET    /categories/:id        # Obtener categoría
PUT    /categories/:id        # Actualizar
DELETE /categories/:id        # Eliminar
```

### Experiencias

```
GET    /experiences                    # Listar (con filtros)
GET    /experiences?estado=ACTIVA       # Filtrar por estado
GET    /experiences?categoriaId=X       # Filtrar por categoría
POST   /experiences                    # Crear experiencia
GET    /experiences/:id                # Detalle
GET    /experiences/slug/:slug         # Por slug
POST   /experiences/:id/images         # Agregar imagen
PUT    /experiences/:id                # Actualizar
DELETE /experiences/:id                # Eliminar
```

### Reservas

```
GET    /bookings                       # Listar reservas
GET    /bookings/:id                   # Detalle de reserva
POST   /bookings                       # Crear reserva
PUT    /bookings/:id                   # Actualizar
POST   /bookings/:id/cancel            # Cancelar reserva
```

### Pagos

```
GET    /payments                       # Listar pagos
GET    /payments/:id                   # Detalle de pago
POST   /payments                       # Crear pago
PUT    /payments/:id/status            # Actualizar estado
```

### Reseñas

```
POST   /reviews                        # Crear reseña
GET    /reviews/experiencia/:id        # Reseñas de experiencia
GET    /reviews/usuario/:id            # Reseñas del usuario
GET    /reviews/experiencia/:id/rating # Rating promedio
PUT    /reviews/:id/respuesta          # Respuesta anfitrión
```

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run start              # Iniciar servidor
npm run start:dev         # Modo watch
npm run start:debug       # Modo debug
npm run start:prod        # Producción

# Prisma
npm run prisma:generate   # Generar cliente
npm run prisma:migrate    # Crear migration
npm run db:push           # Push sin migrations
npm run prisma:seed       # Ejecutar seeder

# Calidad de código
npm run lint              # ESLint
npm run format            # Prettier
npm test                  # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Build
npm run build             # Compilar TypeScript
```

---

## 🔐 Configuración

### Variables de Entorno

Ver `.env.example` para lista completa. Principales:

```env
# Base de Datos
DATABASE_URL=postgresql://user:pass@localhost:5432/ecoxperiencia

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu-secret-aqui
JWT_EXPIRY=7d

# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxx

# Imágenes
CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=xxx
```

### CORS

La aplicación acepta la variable de entorno `CORS_ORIGIN` en cualquiera de los siguientes formatos:

- JSON array (ej: `["http://localhost:3000","http://localhost:5173"]`)
- String separada por comas (ej: `http://localhost:3000,http://localhost:5173`)
- Si no está definida se usan orígenes por defecto para desarrollo: `http://localhost:3001, http://localhost:3000, http://127.0.0.1:3001`.

Esto permite integrar fácilmente distintos frontends (Vite/CRA) y entornos.

### Autenticación JWT (Próxima implementación)

```typescript
// Login
POST /auth/login
{ "email": "user@test.com", "password": "pass" }

// Response
{ "accessToken": "jwt_token", "refreshToken": "refresh_token" }
```

---

## 📝 Ejemplos de Uso

### Crear Experiencia

```bash
curl -X POST http://localhost:3000/experiences \
  -H "Content-Type: application/json" \
  -d '{
    "anfitrionId": "uuid-aqui",
    "titulo": "Senderismo Los Nevados",
    "slug": "senderismo-los-nevados",
    "descripcion": "Caminata de 2 días...",
    "ubicacionTexto": "Boyacá, Colombia",
    "precioBase": 250000,
    "duracionHoras": 16,
    "maxPersonas": 8
  }'
```

### Listar Experiencias Activas

```bash
curl http://localhost:3000/experiences?estado=ACTIVA
```

### Crear Reserva

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experienciaId": "uuid",
    "usuarioId": "uuid",
    "fechaExperiencia": "2026-06-15",
    "horario": "09:00:00",
    "personas": 4,
    "precioUnitario": 250000,
    "precioTotal": 1000000
  }'
```

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Inicialización NestJS
- [x] Configuración Prisma
- [x] Schema de BD con 10+ modelos
- [x] Módulos para entidades principales
- [x] Servicios de BD
- [x] Controladores básicos
- [x] Seeder de datos

### 🔄 En Progreso

- [ ] Autenticación JWT
- [ ] DTOs y Validaciones
- [ ] Guards y Middlewares
- [ ] Error handling

### 📋 Próximos

- [ ] SendGrid integration
- [ ] Stripe payment gateway
- [ ] Cloudinary uploads
- [ ] Search y filtros avanzados
- [ ] WebSockets para mensajes
- [ ] Rate limiting
- [ ] Tests (unit + e2e)
- [ ] Docker + CI/CD
- [ ] Deployment

---

## 🆘 Troubleshooting

### Error: "Database connection failed"

```bash
# Verificar PostgreSQL
psql -U postgres -d ecoxperiencia

# O usar password:
psql -h localhost -U postgres -d ecoxperiencia
```

### Error: "Prisma Client not found"

```bash
npm run prisma:generate
```

### Error: "Port already in use"

```bash
# Cambiar puerto
PORT=3001 npm run start:dev

# O liberar puerto 3000
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Documentación

- **[SETUP.md](./SETUP.md)** - Guía completa de instalación
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## 💡 Contacto y Soporte

Para reportar bugs o sugerencias:
- 📧 Email: dev@ecoxperiencia.com
- 🐙 GitHub Issues: [EcoXperiencia/issues](https://github.com/ecoxperiencia/issues)

---

**Estado del Proyecto:** 🟡 En Desarrollo  
**Versión:** 1.0.0 (Beta)  
**Última actualización:** 11 de mayo de 2026

---

## 📄 Licencia

Este proyecto está bajo licencia privada. Todos los derechos reservados © 2026 EcoXperiencia.
