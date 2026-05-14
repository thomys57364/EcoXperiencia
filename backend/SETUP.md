# 🚀 Backend EcoXperiencia - Documentación

**Estado:** Backend en construcción | **Framework:** NestJS | **ORM:** Prisma | **BD:** PostgreSQL

---

## 📋 Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Setup](#instalación-y-setup)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Módulos y Servicios](#módulos-y-servicios)
6. [API Endpoints](#api-endpoints)
7. [Estructura Prisma](#estructura-prisma)
8. [Próximos Pasos](#próximos-pasos)

---

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── prisma/                 # Servicio y módulo de Prisma
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── users/                  # Módulo de Usuarios
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   │
│   ├── categories/             # Módulo de Categorías
│   │   ├── categories.service.ts
│   │   ├── categories.controller.ts
│   │   └── categories.module.ts
│   │
│   ├── experiences/            # Módulo de Experiencias
│   │   ├── experiences.service.ts
│   │   ├── experiences.controller.ts
│   │   └── experiences.module.ts
│   │
│   ├── hosts/                  # Módulo de Anfitriones
│   │   ├── hosts.service.ts
│   │   ├── hosts.controller.ts
│   │   └── hosts.module.ts
│   │
│   ├── bookings/               # Módulo de Reservas
│   │   ├── bookings.service.ts
│   │   ├── bookings.controller.ts
│   │   └── bookings.module.ts
│   │
│   ├── payments/               # Módulo de Pagos
│   │   ├── payments.service.ts
│   │   ├── payments.controller.ts
│   │   └── payments.module.ts
│   │
│   ├── reviews/                # Módulo de Reseñas
│   │   ├── reviews.service.ts
│   │   ├── reviews.controller.ts
│   │   └── reviews.module.ts
│   │
│   ├── app.module.ts           # Módulo raíz
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma           # Esquema de BD (10 modelos)
│   ├── migrations/
│   │   └── 0_init/
│   │       └── migration.sql   # Migration SQL inicial
│   └── seed.ts                 # Seeder de datos de prueba
│
├── .env                        # Variables de entorno
├── .env.example                # Template de .env
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 📦 Requisitos Previos

- **Node.js:** 18+ (recomendado 20 LTS)
- **npm:** 9+
- **PostgreSQL:** 12+ instalado localmente o acceso a una BD en la nube
- **Git:** Para control de versiones

---

## 🔧 Instalación y Setup

### 1. Clonar o descargar el proyecto

```bash
cd /path/to/EcoXperiencia/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env` y rellenar:

```bash
cp .env.example .env
```

**Editar `.env` con tu configuración:**

```env
# DATABASE
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecoxperiencia"

# APLICACIÓN
NODE_ENV="development"
PORT=3000

# JWT
JWT_SECRET="tu_secret_super_seguro"
JWT_EXPIRY="7d"

# EMAIL (SendGrid o Resend)
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.xxxx"

# IMÁGENES (Cloudinary o S3)
CLOUDINARY_CLOUD_NAME="tu_cloud"
CLOUDINARY_API_KEY="tu_key"
```

### CORS (opcional)

La variable `CORS_ORIGIN` permite controlar los orígenes permitidos. Acepta:

- Un JSON array: `["http://localhost:3000","http://localhost:5173"]`
- Una lista separada por comas: `http://localhost:3000,http://localhost:5173`
- Si no se define, se usan valores por defecto para desarrollo.

Ejemplo en `.env`:

```
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

### 4. Crear base de datos PostgreSQL

```bash
# Opción 1: Localmente
createdb ecoxperiencia

# Opción 2: Usar Docker
docker run --name postgres-eco -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecoxperiencia -p 5432:5432 -d postgres:16
```

### 5. Ejecutar migraciones de Prisma

```bash
# Crear tablas desde el schema
npm run prisma:migrate -- --name init

# O si prefieres usar db push (sin archivos de migration)
npm run db:push
```

### 6. Poblar BD con datos iniciales (opcional)

```bash
npm run prisma:seed
```

---

## 🗄️ Configuración de Base de Datos

### Conexión Local

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecoxperiencia"
```

### Conexión en la Nube

#### **Opción 1: Supabase (Recomendado)**

```env
DATABASE_URL="postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres"
```

#### **Opción 2: Railway**

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

#### **Opción 3: AWS RDS**

```env
DATABASE_URL="postgresql://admin:password@rds-instance.xxxxx.rds.amazonaws.com:5432/ecoxperiencia"
```

---

## 📦 Módulos y Servicios

### 1. **PrismaModule**
- **Servicio:** PrismaService
- **Propósito:** Conexión y gestión de BD
- **Métodos:** $connect(), $disconnect()

### 2. **UsersModule**
- **Servicio:** UsersService
- **Endpoints:**
  - `GET /users` - Listar usuarios
  - `GET /users/:id` - Obtener usuario
  - `POST /users` - Crear usuario
  - `PUT /users/:id` - Actualizar usuario
  - `DELETE /users/:id` - Eliminar usuario

### 3. **CategoriesModule**
- **Servicio:** CategoriesService
- **Endpoints:**
  - `GET /categories` - Listar categorías activas
  - `GET /categories/:id` - Obtener categoría
  - `POST /categories` - Crear categoría
  - `PUT /categories/:id` - Actualizar categoría
  - `DELETE /categories/:id` - Eliminar categoría

### 4. **ExperiencesModule**
- **Servicio:** ExperiencesService
- **Endpoints:**
  - `GET /experiences` - Listar experiencias (con filtros)
  - `GET /experiences/:id` - Obtener detalle
  - `GET /experiences/slug/:slug` - Por slug
  - `POST /experiences` - Crear experiencia
  - `POST /experiences/:id/images` - Agregar imagen
  - `PUT /experiences/:id` - Actualizar
  - `DELETE /experiences/:id` - Eliminar

### 5. **BookingsModule**
- **Servicio:** BookingsService
- **Endpoints:**
  - `GET /bookings` - Listar reservas
  - `GET /bookings/:id` - Obtener reserva
  - `POST /bookings` - Crear reserva
  - `PUT /bookings/:id` - Actualizar
  - `POST /bookings/:id/cancel` - Cancelar

### 6. **HostsModule**
- **Servicio:** HostsService
- **Endpoints:**
  - `GET /hosts` - Listar anfitriones
  - `GET /hosts/:id` - Obtener anfitrión
  - `POST /hosts` - Crear anfitrión
  - `PUT /hosts/:id` - Actualizar
  - `POST /hosts/:id/verify` - Verificar anfitrión

### 7. **PaymentsModule**
- **Servicio:** PaymentsService
- **Endpoints:**
  - `GET /payments` - Listar pagos
  - `GET /payments/:id` - Obtener pago
  - `POST /payments` - Crear pago
  - `PUT /payments/:id/status` - Actualizar estado

### 8. **ReviewsModule**
- **Servicio:** ReviewsService
- **Endpoints:**
  - `POST /reviews` - Crear reseña
  - `GET /reviews/experiencia/:id` - Reseñas de experiencia
  - `GET /reviews/usuario/:id` - Reseñas del usuario
  - `GET /reviews/experiencia/:id/rating` - Rating promedio
  - `PUT /reviews/:id/respuesta` - Respuesta del anfitrión

---

## 📊 Estructura Prisma

### Modelos de Base de Datos

#### **Tabla: users**
```typescript
model User {
  id              String
  email           String (UNIQUE)
  passwordHash    String
  nombreCompleto  String
  rol             UserRole (VIAJERO | ANFITRION | ADMIN)
  emailVerificado Boolean
  estado          UserStatus (ACTIVO | SUSPENDIDO | ELIMINADO)
  
  // Relaciones
  host            Host?
  favoritos       Favorite[]
  reservas        Booking[]
  reseñas         Review[]
  pagos           Payment[]
}
```

#### **Tabla: experiences**
```typescript
model Experience {
  id                  String
  anfitrionId         String (FK → hosts)
  titulo              String
  slug                String (UNIQUE)
  descripcion         String
  categoriaId         String (FK → categories)
  ubicacionTexto      String
  latitud, longitud   Decimal
  precioBase          Decimal (COP)
  duracionHoras       Int
  maxPersonas         Int
  estado              ExperienceStatus (BORRADOR | ACTIVA | PAUSADA | etc)
  
  // Relaciones
  imagenes            ExperienceImage[]
  favoritos           Favorite[]
  reservas            Booking[]
  reseñas             Review[]
}
```

#### **Tabla: bookings**
```typescript
model Booking {
  id                  String
  experienciaId       String (FK)
  usuarioId           String (FK)
  fechaExperiencia    DateTime
  horario             String (TIME format)
  personas            Int
  precioUnitario      Decimal
  precioTotal         Decimal
  estado              BookingStatus (PENDIENTE | CONFIRMADA | CANCELADA | etc)
  
  // Relaciones
  pago                Payment?
  reseña              Review?
}
```

#### **Tabla: payments**
```typescript
model Payment {
  id              String
  bookingId       String (FK, UNIQUE)
  usuarioId       String (FK)
  monto           Decimal
  metodo          PaymentMethod (TARJETA | PAYPAL | TRANSFERENCIA)
  estado          PaymentStatus (PENDIENTE | APROBADO | RECHAZADO | REEMBOLSADO)
  transactionId   String (UNIQUE, ID externo)
  gatewayResponse Json (respuesta completa del gateway)
}
```

#### **Tabla: reviews**
```typescript
model Review {
  id                      String
  experienciaId           String (FK)
  usuarioId               String (FK)
  bookingId               String (FK, UNIQUE)
  calificacion            Int (1-5)
  comentario              String
  calificacionLimpieza    Int (1-5, opcional)
  calificacionValor       Int (1-5, opcional)
  calificacionExperiencia Int (1-5, opcional)
  respuestaAnfitrion      String (opcional)
}
```

**Total de 10 modelos:** User, Host, Category, Experience, ExperienceImage, Favorite, Booking, Payment, Review, Notification, Conversation, Message

---

## 🚀 Ejecutar el Servidor

### Desarrollo (modo watch)

```bash
npm run start:dev
```

**Output esperado:**
```
[Nest] 12345  - 05/11/2026, 10:30:45 AM   LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/11/2026, 10:30:45 AM   LOG [InstanceLoader] PrismaModule dependencies initialized +XX ms
[Nest] 12345  - 05/11/2026, 10:30:45 AM   LOG [InstanceLoader] UsersModule dependencies initialized +XX ms
...
[Nest] 12345  - 05/11/2026, 10:30:46 AM   LOG [NestApplication] Nest application successfully started
```

### Producción

```bash
npm run build
npm run start:prod
```

---

## 🧪 Comandos Útiles

```bash
# Prisma
npm run prisma:generate    # Generar cliente de Prisma
npm run prisma:migrate     # Crear nueva migration
npm run db:push            # Push schema a BD (sin migrations)
npm run prisma:seed        # Ejecutar seeder

# NestJS
npm run start              # Iniciar servidor
npm run start:dev          # Modo desarrollo con watch
npm run build              # Compilar TypeScript
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier

# Testing
npm test                   # Ejecutar tests
npm run test:cov          # Coverage
npm run test:e2e          # E2E tests
```

---

## 📡 Ejemplos de Requests

### Crear Usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "passwordHash": "hashed_password",
    "nombreCompleto": "Juan Pérez",
    "rol": "VIAJERO"
  }'
```

### Listar Experiencias con Filtros

```bash
# Por categoría
curl http://localhost:3000/experiences?categoriaId=<id>&skip=0&take=10

# Por ubicación/búsqueda
curl http://localhost:3000/experiences?estado=ACTIVA
```

### Crear Reserva

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experienciaId": "<id>",
    "usuarioId": "<id>",
    "fechaExperiencia": "2026-06-15T00:00:00Z",
    "horario": "09:00:00",
    "personas": 4,
    "precioUnitario": 250000,
    "precioTotal": 1000000
  }'
```

---

## 🔐 Seguridad (Próximas Implementaciones)

- [ ] Autenticación JWT con RS256
- [ ] Encriptación de contraseñas (bcrypt)
- [ ] Rate limiting por endpoint
- [ ] CORS configurado
- [ ] Helmet.js para headers HTTP
- [ ] Validación con DTOs y class-validator
- [ ] Sanitización de inputs

---

## 📝 Próximos Pasos

### Fase 1: Autenticación (Siguiente)
- [ ] Implementar módulo de Auth
- [ ] JWT tokens (access + refresh)
- [ ] Login/Register endpoints
- [ ] Password reset flow

### Fase 2: Integraciones Externas
- [ ] SendGrid/Resend para emails
- [ ] Cloudinary para imágenes
- [ ] Stripe para pagos
- [ ] Google Maps API para geolocalización

### Fase 3: Features Avanzadas
- [ ] Búsqueda full-text
- [ ] Recomendaciones de experiencias
- [ ] Sistema de chat real-time (Socket.io)
- [ ] Notificaciones push
- [ ] Analytics y reportes

### Fase 4: Deployment
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Staging environment
- [ ] Production deployment (AWS/Railway/Vercel)

---

## 🆘 Troubleshooting

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -d ecoxperiencia

# Revisar DATABASE_URL en .env
echo $DATABASE_URL
```

### Error: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en main.ts o usar:
PORT=3001 npm run start:dev
```

### Limpiar BD (desarrollo)
```bash
npm run prisma:reset
```

---

## 📚 Documentación Adicional

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT Authentication](https://jwt.io)

---

**Última actualización:** 11 de mayo de 2026  
**Versión:** 1.0.0 (Beta)
