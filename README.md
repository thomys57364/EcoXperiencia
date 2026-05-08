# EcoXperiencia

Plataforma de ecoturismo que conecta viajeros con experiencias auténticas en Colombia. Sistema completo con frontend HTML/CSS/JS, backend NestJS + PostgreSQL, y arquitectura de producción.

## 🌿 Características

### Frontend (HTML/CSS/JS Vanilla)
- ✅ Landing page con buscador de experiencias
- ✅ Catálogo con filtros y búsqueda
- ✅ Detalle de experiencias con galería
- ✅ Sistema de autenticación (login/registro)
- ✅ Perfil de usuario
- ✅ Favoritos
- ✅ Diseño responsive con Tailwind CSS

### Backend (NestJS + PostgreSQL)
- ✅ API RESTful completa
- ✅ Autenticación JWT con refresh tokens
- ✅ CRUD de experiencias, reservas, pagos
- ✅ Sistema de reseñas y calificaciones
- ✅ Mensajería entre viajeros y anfitriones
- ✅ Notificaciones
- ✅ Dashboard de anfitrión con estadísticas
- ✅ Integración con Stripe (pagos)
- ✅ Documentación Swagger

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# Requisitos: Docker y Docker Compose

# Clonar/ir al directorio
cd ecoxperiencia

# Iniciar todo el stack
docker-compose up -d

# Acceder a:
# - Frontend: http://localhost
# - Backend API: http://localhost:3000
# - Swagger Docs: http://localhost:3000/api/docs
```

### Opción 2: Manual

#### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Base de datos
npx prisma migrate dev
npx prisma db seed

# Iniciar servidor
npm run start:dev
```

#### Frontend

```bash
# Servir archivos estáticos con cualquier servidor
# Opción 1: Python
python -m http.server 5500

# Opción 2: Node.js
npx serve -l 5500

# Opción 3: VS Code - Live Server
# Click derecho en index.html > Open with Live Server
```

## 📁 Estructura del Proyecto

```
ecoxperiencia/
├── 📄 index.html              # Landing page
├── 📄 explorar.html           # Catálogo de experiencias
├── 📄 experiencia.html        # Detalle de experiencia
├── 📄 login.html              # Inicio de sesión
├── 📄 registro.html           # Registro
├── 📄 perfil.html             # Perfil usuario
├── 📄 favoritos.html          # Favoritos
├── 📄 anfitrion.html          # Landing anfitriones
├── 📄 como-funciona.html      # Cómo funciona
├── 📄 contacto.html           # Contacto
├── 📄 legal.html              # Términos y privacidad
├── 📄 soporte.html            # Centro de ayuda
├── 📄 404.html                # Página no encontrada
├── 📁 css/
│   └── styles.css             # Estilos Tailwind
├── 📁 js/
│   └── app.js                 # Lógica frontend
├── 📁 backend/                # API NestJS
│   ├── src/
│   │   ├── modules/           # Módulos de la API
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── users/         # Usuarios
│   │   │   ├── hosts/         # Anfitriones
│   │   │   ├── experiences/   # Experiencias
│   │   │   ├── bookings/      # Reservas
│   │   │   ├── payments/      # Pagos
│   │   │   ├── reviews/       # Reseñas
│   │   │   ├── favorites/     # Favoritos
│   │   │   ├── messages/      # Mensajes
│   │   │   └── notifications/ # Notificaciones
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Esquema de base de datos
│   │   │   └── seed.ts        # Datos iniciales
│   │   └── main.ts            # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── 📄 docker-compose.yml      # Configuración Docker
├── 📄 nginx.conf              # Configuración Nginx
├── 📄 design_document.md      # Documento de diseño
├── 📄 API_INTEGRATION.md      # Guía de integración
└── 📄 README.md               # Este archivo
```

## 🛠️ Tecnologías

### Frontend
- HTML5
- Tailwind CSS (via CDN)
- JavaScript Vanilla
- Font Awesome (iconos)

### Backend
- NestJS 10
- TypeScript
- PostgreSQL 16
- Prisma ORM
- JWT Authentication
- Swagger/OpenAPI

### Infraestructura
- Docker + Docker Compose
- Nginx (reverse proxy)
- Redis (opcional, para caché)

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Viajero | `usuario@ejemplo.com` | `password123` |
| Anfitrión | `carlos@ejemplo.com` | `password123` |
| Admin | `admin@ejemplo.com` | `password123` |

## 📚 Documentación

- [Documento de Diseño](./design_document.md) - Arquitectura completa
- [Guía de Integración](./API_INTEGRATION.md) - Cómo conectar frontend con API
- [Backend README](./backend/README.md) - Documentación del backend

## 🌐 Endpoints API Principales

```
# Autenticación
POST   /auth/register
POST   /auth/login
GET    /auth/me

# Experiencias
GET    /experiences
GET    /experiences/:slug
POST   /experiences

# Reservas
GET    /bookings
POST   /bookings
PUT    /bookings/:id/cancel

# Favoritos
GET    /favorites
POST   /favorites/:id
DELETE /favorites/:id

# Documentación completa
http://localhost:3000/api/docs
```

## 🧪 Testing

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Con Docker
docker-compose exec backend npm run test
```

## 📝 Scripts Útiles

```bash
# Backend
cd backend

# Migraciones
npx prisma migrate dev

# Seed de datos
npx prisma db seed

# Studio de Prisma (UI para BD)
npx prisma studio

# Reset completo de BD
npm run db:reset
```

## 🚀 Despliegue

### Requisitos de Producción

- Servidor con Docker Compose
- PostgreSQL
- Dominio configurado
- SSL (Let's Encrypt)

### Pasos

```bash
# 1. Configurar variables de entorno
# Editar .env con valores de producción

# 2. Iniciar servicios
docker-compose up -d

# 3. Verificar estado
docker-compose ps

# 4. Logs
docker-compose logs -f backend
```

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles

## 👥 Autores

- **EcoXperiencia Team** - Desarrollo inicial

## 🙏 Agradecimientos

- Comunidad de NestJS
- Prisma Team
- Todos los anfitriones que comparten sus territorios

---

**Nota**: Este proyecto está en desarrollo activo. Algunas características pueden no estar completamente implementadas.
