# EcoXperiencia - Documento de Diseño del Sistema

**Versión:** 1.0
**Fecha:** 14 de abril de 2026
**Estado:** Prototipo Frontend → Producción

---

## TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Modelo Entidad-Relación (ER)](#2-modelo-entidad-relación-er)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Mockups UI](#4-mockups-ui)
5. [Plan de Implementación](#5-plan-de-implementación)

---

## 1. RESUMEN EJECUTIVO

### 1.1 Estado Actual del Proyecto

EcoXperiencia es una plataforma de ecoturismo que conecta viajeros con experiencias auténticas en Colombia. Actualmente se encuentra en estado de **prototipo funcional frontend** con las siguientes características:

| Aspecto | Estado Actual |
|---------|--------------|
| **Frontend** | ✅ Completo (HTML/CSS/JS Vanilla) |
| **Autenticación** | ⚠️ Simulada (LocalStorage) |
| **Catálogo de Experiencias** | ✅ 8 experiencias hardcodeadas |
| **Sistema de Favoritos** | ⚠️ LocalStorage (sin persistencia real) |
| **Reservas** | ⚠️ Simuladas (sin backend) |
| **Backend** | ❌ No implementado |
| **Base de Datos** | ❌ No implementada |
| **Pagos** | ❌ No implementado |

### 1.2 Propósito del Documento

Este documento establece el diseño técnico completo para evolucionar el prototipo actual a un sistema de producción escalable, manteniendo coherencia con la arquitectura frontend ya implementada.

---

## 2. MODELO ENTIDAD-RELACIÓN (ER)

### 2.1 Entidades Identificadas

A partir del análisis del código existente, se identifican las siguientes entidades necesarias:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ENTIDADES PRINCIPALES                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Usuario (User)           6. Reseña (Review)                          │
│ 2. Anfitrión (Host)         7. Reserva (Booking)                        │
│ 3. Experiencia (Experience) 8. Notificación (Notification)              │
│ 4. Categoría (Category)     9. Mensaje (Message)                        │
│ 5. Imagen (Image)           10. Pago (Payment)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Modelo de Datos Detallado

#### **USUARIO (users)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Correo electrónico |
| `password_hash` | VARCHAR(255) | NOT NULL | Contraseña hasheada (bcrypt) |
| `nombre_completo` | VARCHAR(255) | NOT NULL | Nombre del usuario |
| `telefono` | VARCHAR(20) | NULL | Número de contacto |
| `bio` | TEXT | NULL | Biografía opcional |
| `avatar_url` | VARCHAR(500) | NULL | URL de foto de perfil |
| `rol` | ENUM | NOT NULL, DEFAULT 'viajero' | 'viajero', 'anfitrion', 'admin' |
| `email_verificado` | BOOLEAN | DEFAULT FALSE | Estado de verificación |
| `fecha_creacion` | TIMESTAMP | DEFAULT NOW() | Fecha de registro |
| `ultima_sesion` | TIMESTAMP | NULL | Último inicio de sesión |
| `estado` | ENUM | DEFAULT 'activo' | 'activo', 'suspendido', 'eliminado' |

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(500),
    rol ENUM('viajero', 'anfitrion', 'admin') DEFAULT 'viajero',
    email_verificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_sesion TIMESTAMP,
    estado ENUM('activo', 'suspendido', 'eliminado') DEFAULT 'activo'
);
```

#### **ANFITRIÓN (hosts)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `usuario_id` | UUID | FK → users.id, UNIQUE | Referencia al usuario |
| `documento_tipo` | ENUM | NOT NULL | 'CC', 'CE', 'PASAPORTE' |
| `documento_numero` | VARCHAR(50) | UNIQUE, NOT NULL | Número de identificación |
| `fecha_nacimiento` | DATE | NOT NULL | Fecha de nacimiento |
| `direccion_completa` | TEXT | NOT NULL | Dirección física |
| `ciudad` | VARCHAR(100) | NOT NULL | Ciudad de residencia |
| `departamento` | VARCHAR(100) | NOT NULL | Departamento |
| `pais` | VARCHAR(100) | DEFAULT 'Colombia' | País |
| `biografia_anfitrion` | TEXT | NULL | Bio específica para anfitrión |
| `certificaciones` | JSONB | NULL | Certificaciones verificadas |
| `fecha_verificacion` | TIMESTAMP | NULL | Cuando fue verificado |
| `estado_verificacion` | ENUM | DEFAULT 'pendiente' | 'pendiente', 'verificado', 'rechazado' |

```sql
CREATE TABLE hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    documento_tipo ENUM('CC', 'CE', 'PASAPORTE') NOT NULL,
    documento_numero VARCHAR(50) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion_completa TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Colombia',
    biografia_anfitrion TEXT,
    certificaciones JSONB,
    fecha_verificacion TIMESTAMP,
    estado_verificacion ENUM('pendiente', 'verificado', 'rechazado') DEFAULT 'pendiente'
);
```

#### **EXPERIENCIA (experiences)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `anfitrion_id` | UUID | FK → hosts.id, NOT NULL | Anfitrión propietario |
| `titulo` | VARCHAR(255) | NOT NULL | Nombre de la experiencia |
| `slug` | VARCHAR(300) | UNIQUE, NOT NULL | URL amigable |
| `descripcion` | TEXT | NOT NULL | Descripción completa |
| `categoria_id` | UUID | FK → categories.id | Categoría principal |
| `subcategoria` | VARCHAR(100) | NULL | Subcategoría opcional |
| `ubicacion_texto` | VARCHAR(255) | NOT NULL | Ej: "Boyacá, Colombia" |
| `latitud` | DECIMAL(10,8) | NULL | Coordenada GPS |
| `longitud` | DECIMAL(11,8) | NULL | Coordenada GPS |
| `precio_base` | DECIMAL(12,2) | NOT NULL | Precio por persona |
| `moneda` | VARCHAR(3) | DEFAULT 'COP' | Tipo de moneda |
| `duracion_horas` | INTEGER | NOT NULL | Duración en horas |
| `max_personas` | INTEGER | NOT NULL | Capacidad máxima |
| `min_personas` | INTEGER | DEFAULT 1 | Mínimo de personas |
| `incluye` | JSONB | NULL | Array de items incluidos |
| `no_incluye` | JSONB | NULL | Array de items no incluidos |
| `requisitos` | JSONB | NULL | Requisitos para participantes |
| `punto_encuentro` | TEXT | NULL | Instrucciones de encuentro |
| `politica_cancelacion` | ENUM | DEFAULT 'flexible' | 'flexible', 'moderada', 'estricta' |
| `estado` | ENUM | DEFAULT 'borrador' | 'borrador', 'pendiente', 'activa', 'pausada', 'rechazada' |
| `fecha_activacion` | TIMESTAMP | NULL | Cuando se hizo pública |
| `fecha_creacion` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

```sql
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anfitrion_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    categoria_id UUID REFERENCES categories(id),
    subcategoria VARCHAR(100),
    ubicacion_texto VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    precio_base DECIMAL(12,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    duracion_horas INTEGER NOT NULL,
    max_personas INTEGER NOT NULL,
    min_personas INTEGER DEFAULT 1,
    incluye JSONB,
    no_incluye JSONB,
    requisitos JSONB,
    punto_encuentro TEXT,
    politica_cancelacion ENUM('flexible', 'moderada', 'estricta') DEFAULT 'flexible',
    estado ENUM('borrador', 'pendiente', 'activa', 'pausada', 'rechazada') DEFAULT 'borrador',
    fecha_activacion TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **CATEGORÍA (categories)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `nombre` | VARCHAR(100) | NOT NULL | Ej: "Senderismo" |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | Ej: "hiking" |
| `descripcion` | TEXT | NULL | Descripción de categoría |
| `icono` | VARCHAR(50) | NOT NULL | Nombre del ícono SVG |
| `orden` | INTEGER | DEFAULT 0 | Orden de visualización |
| `activa` | BOOLEAN | DEFAULT TRUE | Visible en filtros |

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) NOT NULL,
    orden INTEGER DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE
);

-- Datos iniciales (basados en el frontend actual)
INSERT INTO categories (nombre, slug, icono, orden) VALUES
('Senderismo', 'hiking', 'mountain', 1),
('Avistamiento', 'wildlife', 'eye', 2),
('Camping', 'camping', 'tent', 3),
('Ríos y cascadas', 'rivers', 'droplet', 4),
('Agroturismo', 'agrotourism', 'coffee', 5),
('Alta montaña', 'highmountain', 'compass', 6),
('Buceo', 'diving', 'fish', 7);
```

#### **IMAGEN (experience_images)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `experiencia_id` | UUID | FK → experiences.id, NOT NULL | Experiencia asociada |
| `url` | VARCHAR(500) | NOT NULL | URL de la imagen |
| `titulo` | VARCHAR(255) | NULL | Título descriptivo |
| `orden` | INTEGER | DEFAULT 0 | Orden en galería |
| `es_portada` | BOOLEAN | DEFAULT FALSE | Imagen principal |
| `fecha_subida` | TIMESTAMP | DEFAULT NOW() | Fecha de carga |

```sql
CREATE TABLE experience_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiencia_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    titulo VARCHAR(255),
    orden INTEGER DEFAULT 0,
    es_portada BOOLEAN DEFAULT FALSE,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **RESERVA (bookings)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `experiencia_id` | UUID | FK → experiences.id, NOT NULL | Experiencia reservada |
| `usuario_id` | UUID | FK → users.id, NOT NULL | Usuario que reserva |
| `fecha_experiencia` | DATE | NOT NULL | Fecha del tour |
| `horario` | TIME | NOT NULL | Hora de inicio |
| `personas` | INTEGER | NOT NULL | Número de participantes |
| `precio_unitario` | DECIMAL(12,2) | NOT NULL | Precio al momento |
| `precio_total` | DECIMAL(12,2) | NOT NULL | Total pagado |
| `estado` | ENUM | DEFAULT 'pendiente' | 'pendiente', 'confirmada', 'cancelada', 'completada', 'no_show' |
| `codigo_confirmacion` | VARCHAR(20) | UNIQUE | Código único |
| `notas_usuario` | TEXT | NULL | Notas del viajero |
| `notas_anfitrion` | TEXT | NULL | Notas internas |
| `fecha_reserva` | TIMESTAMP | DEFAULT NOW() | Cuando se reservó |
| `fecha_cancelacion` | TIMESTAMP | NULL | Cuando se canceló |

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiencia_id UUID NOT NULL REFERENCES experiences(id),
    usuario_id UUID NOT NULL REFERENCES users(id),
    fecha_experiencia DATE NOT NULL,
    horario TIME NOT NULL,
    personas INTEGER NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    precio_total DECIMAL(12,2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada', 'no_show') DEFAULT 'pendiente',
    codigo_confirmacion VARCHAR(20) UNIQUE,
    notas_usuario TEXT,
    notas_anfitrion TEXT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cancelacion TIMESTAMP
);
```

#### **RESEÑA (reviews)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `experiencia_id` | UUID | FK → experiences.id, NOT NULL | Experiencia calificada |
| `usuario_id` | UUID | FK → users.id, NOT NULL | Usuario que califica |
| `booking_id` | UUID | FK → bookings.id, UNIQUE | Reserva asociada (evita reviews múltiples) |
| `calificacion` | INTEGER | NOT NULL, CHECK 1-5 | Estrellas (1-5) |
| `titulo` | VARCHAR(255) | NULL | Título de la reseña |
| `comentario` | TEXT | NOT NULL | Comentario detallado |
| `calificacion_limpieza` | INTEGER | NULL | Subcategoría (opcional) |
| `calificacion_valor` | INTEGER | NULL | Subcategoría (opcional) |
| `calificacion_experiencia` | INTEGER | NULL | Subcategoría (opcional) |
| `respuesta_anfitrion` | TEXT | NULL | Respuesta del anfitrión |
| `fecha_respuesta` | TIMESTAMP | NULL | Fecha de respuesta |
| `fecha_creacion` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `visible` | BOOLEAN | DEFAULT TRUE | Visible públicamente |

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiencia_id UUID NOT NULL REFERENCES experiences(id),
    usuario_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID UNIQUE REFERENCES bookings(id),
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(255),
    comentario TEXT NOT NULL,
    calificacion_limpieza INTEGER CHECK (calificacion_limpieza BETWEEN 1 AND 5),
    calificacion_valor INTEGER CHECK (calificacion_valor BETWEEN 1 AND 5),
    calificacion_experiencia INTEGER CHECK (calificacion_experiencia BETWEEN 1 AND 5),
    respuesta_anfitrion TEXT,
    fecha_respuesta TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible BOOLEAN DEFAULT TRUE
);
```

#### **PAGO (payments)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `booking_id` | UUID | FK → bookings.id, UNIQUE | Reserva asociada |
| `usuario_id` | UUID | FK → users.id, NOT NULL | Usuario que paga |
| `monto` | DECIMAL(12,2) | NOT NULL | Monto del pago |
| `moneda` | VARCHAR(3) | DEFAULT 'COP' | Moneda |
| `metodo` | ENUM | NOT NULL | 'tarjeta', 'paypal', 'transferencia' |
| `estado` | ENUM | DEFAULT 'pendiente' | 'pendiente', 'aprobado', 'rechazado', 'reembolsado' |
| `transaction_id` | VARCHAR(255) | UNIQUE | ID de transacción externa |
| `gateway_response` | JSONB | NULL | Respuesta completa del gateway |
| `fecha_pago` | TIMESTAMP | DEFAULT NOW() | Fecha del pago |
| `fecha_reembolso` | TIMESTAMP | NULL | Fecha de reembolso |

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id),
    usuario_id UUID NOT NULL REFERENCES users(id),
    monto DECIMAL(12,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    metodo ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    estado ENUM('pendiente', 'aprobado', 'rechazado', 'reembolsado') DEFAULT 'pendiente',
    transaction_id VARCHAR(255) UNIQUE,
    gateway_response JSONB,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_reembolso TIMESTAMP
);
```

#### **FAVORITO (favorites)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `usuario_id` | UUID | FK → users.id, NOT NULL | Usuario |
| `experiencia_id` | UUID | FK → experiences.id, NOT NULL | Experiencia |
| `fecha_agregado` | TIMESTAMP | DEFAULT NOW() | Fecha |

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experiencia_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, experiencia_id)
);
```

#### **NOTIFICACIÓN (notifications)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `usuario_id` | UUID | FK → users.id, NOT NULL | Usuario destinatario |
| `tipo` | ENUM | NOT NULL | Tipo de notificación |
| `titulo` | VARCHAR(255) | NOT NULL | Título |
| `mensaje` | TEXT | NOT NULL | Cuerpo del mensaje |
| `leido` | BOOLEAN | DEFAULT FALSE | Estado de lectura |
| `url_accion` | VARCHAR(500) | NULL | Link relacionado |
| `fecha_creacion` | TIMESTAMP | DEFAULT NOW() | Fecha |

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo ENUM('reserva', 'mensaje', 'sistema', 'promocion', 'recordatorio') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    url_accion VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **MENSAJE (messages)**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `conversacion_id` | UUID | FK → conversations.id, NOT NULL | Conversación |
| `emisor_id` | UUID | FK → users.id, NOT NULL | Quien envía |
| `mensaje` | TEXT | NOT NULL | Contenido |
| `leido` | BOOLEAN | DEFAULT FALSE | Estado |
| `fecha_envio` | TIMESTAMP | DEFAULT NOW() | Fecha |

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    anfitrion_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experiencia_id UUID REFERENCES experiences(id),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, anfitrion_id, experiencia_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversacion_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    emisor_id UUID NOT NULL REFERENCES users(id),
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    USUARIOS     │       │   ANFITRIONES   │       │   CATEGORÍAS    │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │1    1│ id (PK)         │1   N│ id (PK)         │
│ email           │──────│ usuario_id (FK) │     │ nombre          │
│ password_hash   │       │ documento       │     │ slug            │
│ nombre          │       │ biografia       │     │ icono           │
│ rol             │       └────────┬────────┘     └────────┬────────┘
└─────────────────┘                │                       │
         │                         │1                      │1
         │1                        │                       │
         │                        N│                       │
         │                         │                       │
         │                         ▼                       │
         │              ┌─────────────────┐                │
         │              │  EXPERIENCIAS   │                │
         │              │─────────────────│                │
         │         1    │ id (PK)         │   N            │
         │─────────────│ anfitrion_id(FK)│────────────────│
         │             │ categoria_id(FK)│                │
         │             │ titulo          │                │
         │             │ descripcion     │                │
         │             │ precio_base     │                │
         │             └────────┬────────┘                │
         │                      │                         │
         │         ┌────────────┼────────────┐            │
         │        N│            │1           │N           │
         │         │            │            │            │
         ▼         │            ▼            │            ▼
┌─────────────────┐│   ┌─────────────────┐  │   ┌─────────────────┐
│    FAVORITOS    ││   │     RESERVAS    │  │   │     RESEÑAS     │
│─────────────────││   │─────────────────│  │   │─────────────────│
│ id (PK)         ││   │ id (PK)         │  │   │ id (PK)         │
│ usuario_id (FK) ││   │ experiencia_id  │  │   │ experiencia_id  │
│ experiencia_id  ││   │ usuario_id (FK) │  │   │ usuario_id (FK) │
└─────────────────┘│   │ precio_total    │  │   │ calificacion    │
                   │   │ estado          │  │   │ comentario      │
                   │   └────────┬────────┘  │   └─────────────────┘
                   │            │1           │
                   │            │            │
                   │           N│            │
                   │            │            │
                   │   ┌─────────────────┐  │
                   │   │      PAGOS      │  │
                   │   │─────────────────│  │
                   │   │ id (PK)         │  │
                   │   │ booking_id (FK) │  │
                   │   │ monto           │  │
                   │   │ estado          │  │
                   │   └─────────────────┘  │
                   │                        │
                   │   ┌─────────────────┐  │
                   │   │   NOTIFICACIONES│  │
                   │   │─────────────────│  │
                   │   │ id (PK)         │◄─┘
                   │   │ usuario_id (FK) │
                   │   │ mensaje         │
                   │   └─────────────────┘
                   │
                   │   ┌─────────────────┐
                   │   │    MENSAJES     │
                   │   │─────────────────│
                   │   │ id (PK)         │
                   │   │ conversacion_id │
                   │   │ emisor_id (FK)  │
                   │   └─────────────────┘
```

### 2.4 Relaciones Detalladas

| Relación | Tipo | Descripción |
|----------|------|-------------|
| Usuario → Anfitrión | 1:1 | Un usuario puede ser anfitrión (opcional) |
| Anfitrión → Experiencias | 1:N | Un anfitrión puede tener múltiples experiencias |
| Categoría → Experiencias | 1:N | Una categoría agrupa múltiples experiencias |
| Usuario → Experiencias (Favoritos) | N:M | Usuarios pueden guardar múltiples experiencias |
| Usuario → Experiencias (Reservas) | N:M | Usuarios pueden reservar múltiples experiencias |
| Experiencia → Reservas | 1:N | Una experiencia puede tener múltiples reservas |
| Reserva → Pago | 1:1 | Cada reserva tiene un pago asociado |
| Usuario → Reseñas | 1:N | Un usuario puede escribir múltiples reseñas |
| Experiencia → Reseñas | 1:N | Una experiencia recibe múltiples reseñas |
| Usuario → Notificaciones | 1:N | Un usuario recibe múltiples notificaciones |
| Usuario ↔ Usuario (Mensajes) | N:M | Conversaciones entre usuarios y anfitriones |

---

## 3. ARQUITECTURA DEL SISTEMA

### 3.1 Arquitectura Actual (Frontend Only)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (NAVEGADOR)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  FRONTEND (HTML/CSS/JS Vanilla)                              │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  ││
│  │  │   Vistas    │  │  Componentes│  │  Lógica de Negocio  │  ││
│  │  │  (11 HTML)  │  │  (Navbar,   │  │  (Auth, Favorites,  │  ││
│  │  │             │  │   Footer,   │  │   Toast, Modal)     │  ││
│  │  │             │  │   Cards)    │  │                     │  ││
│  │  └─────────────┘  └─────────────┘  └──────────┬──────────┘  ││
│  │                                                │            ││
│  │                                    ┌───────────▼────────┐   ││
│  │                                    │   LocalStorage     │   ││
│  │                                    │  (Persistencia)    │   ││
│  │                                    └────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Características:**
- Single Page Application simulada (múltiples HTML)
- Todos los datos hardcodeados en `app.js`
- Autenticación simulada con LocalStorage
- Sin validación del lado del servidor
- Sin protección CSRF/XSS

### 3.2 Arquitectura Propuesta (Producción)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE PRESENTACIÓN                        │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                         CLIENTES                                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  ││
│  │  │  Web Browser │  │   Mobile     │  │  Admin Dashboard         │  ││
│  │  │  (SPA React) │  │   App        │  │  (React/Next.js)         │  ││
│  │  │              │  │  (React      │  │                          │  ││
│  │  │              │  │   Native)    │  │                          │  ││
│  │  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  ││
│  └─────────│─────────────────│───────────────────────│────────────────┘│
└────────────│─────────────────│───────────────────────│──────────────────┘
             │                 │                       │
             │    ┌────────────▼───────────────────────▼───────────────┐
             │    │              API GATEWAY / LOAD BALANCER            │
             │    │           (NGINX / AWS ALB / Cloudflare)            │
             │    └────────────────────────┬───────────────────────────┘
             │                             │
             │    ┌────────────────────────▼───────────────────────────┐
             │    │              BACKEND API (REST + GraphQL)           │
┌────────────▼────▼────────────────────────────────────────────────────▼───┐
│                            CAPA DE APLICACIÓN                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │  Node.js +      │  │  Servicios      │  │  Background Jobs        │  │
│  │  Express/NestJS │  │  Externos       │  │  (Bull/BullMQ)          │  │
│  │                 │  │  - Stripe       │  │  - Emails               │  │
│  │  - Auth Module  │  │  - SendGrid     │  │  - Reportes             │  │
│  │  - Users        │  │  - Cloudinary   │  │  - Limpieza             │  │
│  │  - Experiences  │  │  - AWS S3       │  │                         │  │
│  │  - Bookings     │  │  - Twilio       │  │                         │  │
│  │  - Payments     │  │  - Google Maps  │  │                         │  │
│  │  - Reviews      │  │                 │  │                         │  │
│  │  - Messages     │  │                 │  │                         │  │
│  └────────┬────────┘  └─────────────────┘  └─────────────────────────┘  │
           │                                                               │
           │    ┌────────────────────────▼─────────────────────────────┐  │
           │    │                   CAPA DE DATOS                       │  │
           │    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
           │    │  │  PostgreSQL  │  │    Redis     │  │   AWS S3 /   │ │  │
           │    │  │  (Primary)   │  │   (Cache)    │  │  Cloudinary  │ │  │
           │    │  │              │  │              │  │  (Imágenes)  │ │  │
           │    │  │ - Users      │  │ - Sessions   │  │              │ │  │
           │    │  │ - Experiences│  │ - Cache API  │  │              │ │  │
           │    │  │ - Bookings   │  │ - Rate Limit │  │              │ │  │
           │    │  │ - Payments   │  │ - Colas      │  │              │ │  │
           │    │  │ - Reviews    │  │              │  │              │ │  │
           │    │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
           │    └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Tecnologías Recomendadas

#### **Frontend (Evolución del actual)**

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Framework | **React 18+** | Componentes reutilizables, ecosistema maduro |
| Meta-Framework | **Next.js 14** | SSR, SEO, routing, API routes |
| Estado Global | **Zustand** | Ligero, simple, suficiente para este caso |
| Forms | **React Hook Form** | Validación, performance |
| HTTP Client | **TanStack Query** | Cache, reintentos, optimista |
| Estilos | **Tailwind CSS** | Rápido, consistente, mantiene design tokens |
| UI Components | **Radix UI** | Accesibilidad, customización |

#### **Backend**

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Runtime | **Node.js 20 LTS** | Mismo lenguaje que frontend, performance |
| Framework | **NestJS** | Arquitectura modular, TypeScript, escalable |
| ORM | **Prisma** | Type-safe, migraciones, DX excelente |
| Validación | **Zod** | Schema validation, type inference |
| Auth | **Passport.js + JWT** | Flexible, ampliamente adoptado |
| Emails | **SendGrid / Resend** | Transaccionales, templates |
| Pagos | **Stripe** | PCI compliant, webhooks, Colombia support |
| Imágenes | **Cloudinary** | Optimización, transformations, CDN |

#### **Base de Datos**

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Primary DB | **PostgreSQL 16** | ACID, JSONB, full-text search, extensions |
| Cache | **Redis 7** | Sessions, rate limiting, cache API |
| Search | **PostgreSQL FTS** | Suficiente para MVP, luego Elasticsearch |

#### **Infraestructura**

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Cloud | **AWS** | Ecosistema completo, presencia LatAm |
| Contenedores | **Docker** | Consistencia, CI/CD |
| Orquestación | **AWS ECS/Fargate** | Serverless containers, auto-scaling |
| CDN | **CloudFront** | Baja latencia en Colombia |
| Monitoring | **DataDog / Grafana** | Observabilidad completa |

### 3.4 Flujo de Datos

#### **3.4.1 Flujo Actual (Frontend Only)**

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐
│ Usuario │────▶│  Navegador  │────▶│  app.js     │
│         │     │             │     │  (Lógica)   │
└─────────┘     └─────────────┘     └──────┬───────┘
                                           │
                                           ▼
                                   ┌──────────────┐
                                   │ LocalStorage │
                                   │ (Persistencia│
                                   │  simulada)   │
                                   └──────────────┘
```

**Problemas:**
- No hay persistencia real (se pierde al limpiar cache)
- No hay sincronización entre dispositivos
- Datos hardcodeados en el cliente
- Sin seguridad real

#### **3.4.2 Flujo Propuesto (Producción)**

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Usuario │────▶│  Frontend   │────▶│  API Gateway │────▶│   Backend   │
│         │     │  (Next.js)  │     │  (Rate Limit)│     │   (NestJS)  │
└─────────┘     └─────────────┘     └──────────────┘     └──────┬──────┘
                                                                │
                    ┌───────────────────────────────────────────┤
                    │                                           │
                    ▼                                           ▼
            ┌──────────────┐                          ┌──────────────┐
            │   Redis      │                          │  PostgreSQL  │
            │   (Cache)    │                          │  (Primary)   │
            └──────────────┘                          └──────────────┘
                                                            │
                    ┌───────────────────────────────────────┤
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
            │   Stripe     │    │  Cloudinary  │    │   SendGrid   │
            │   (Pagos)    │    │  (Imágenes)  │    │   (Emails)   │
            └──────────────┘    └──────────────┘    └──────────────┘
```

**Ejemplo: Flujo de Reserva**

```
1. Usuario selecciona fecha/personas
         │
         ▼
2. Frontend valida datos (React Hook Form + Zod)
         │
         ▼
3. POST /api/bookings { experienciaId, fecha, personas }
         │
         ▼
4. API Gateway valida rate limiting
         │
         ▼
5. Backend autentica (JWT middleware)
         │
         ▼
6. Backend valida:
   - Experiencia existe y está activa
   - Hay disponibilidad (fecha no reservada)
   - Personas <= max_personas
         │
         ▼
7. Backend crea reserva (estado: 'pendiente')
         │
         ▼
8. Backend inicia pago con Stripe (Payment Intent)
         │
         ▼
9. Frontend muestra formulario de Stripe Elements
         │
         ▼
10. Usuario ingresa datos de tarjeta
         │
         ▼
11. Stripe procesa pago → Webhook → Backend
         │
         ▼
12. Backend actualiza:
    - Payment (estado: 'aprobado')
    - Booking (estado: 'confirmada')
         │
         ▼
13. Backend envía:
    - Email confirmación (SendGrid)
    - Notificación al anfitrión
         │
         ▼
14. Frontend muestra modal de confirmación
```

### 3.5 Estructura de Directorios Propuesta

```
ecoxperiencia/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router (Next.js 14)
│   │   │   ├── components/    # Componentes React
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utilidades, config
│   │   │   ├── stores/        # Zustand stores
│   │   │   └── types/         # TypeScript types
│   │   └── public/
│   │
│   └── admin/                  # Dashboard admin
│       └── ...
│
├── packages/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── experiences/
│   │   │   │   ├── bookings/
│   │   │   │   ├── payments/
│   │   │   │   ├── reviews/
│   │   │   │   └── messages/
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── ui/                     # Componentes compartidos
│       └── ...
│
├── docker-compose.yml
├── package.json
└── turbo.json                  # Turborepo (monorepo)
```

### 3.6 API Endpoints Propuestos

#### **Autenticación**
```
POST   /api/auth/register          # Registro
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Recuperar contraseña
POST   /api/auth/reset-password    # Resetear contraseña
POST   /api/auth/verify-email      # Verificar email
POST   /api/auth/refresh           # Refresh token
GET    /api/auth/me                # Obtener usuario actual
```

#### **Usuarios**
```
GET    /api/users/:id              # Perfil público
PUT    /api/users/profile          # Actualizar perfil
PUT    /api/users/password         # Cambiar contraseña
DELETE /api/users/account          # Eliminar cuenta
GET    /api/users/bookings         # Mis reservas
GET    /api/users/favorites        # Mis favoritos
GET    /api/users/reviews          # Mis reseñas
```

#### **Experiencias**
```
GET    /api/experiences            # Listar (con filtros, paginación)
GET    /api/experiences/:slug      # Detalle por slug
POST   /api/experiences            # Crear (anfitriones)
PUT    /api/experiences/:id        # Actualizar
DELETE /api/experiences/:id        # Eliminar
GET    /api/experiences/:id/availability  # Disponibilidad
GET    /api/experiences/:id/reviews       # Reseñas
POST   /api/experiences/:id/images        # Subir imágenes
```

#### **Reservas**
```
GET    /api/bookings               # Listar reservas del usuario
GET    /api/bookings/:id           # Detalle de reserva
POST   /api/bookings               # Crear reserva
PUT    /api/bookings/:id/cancel    # Cancelar reserva
PUT    /api/bookings/:id/confirm   # Confirmar (anfitrión)
```

#### **Pagos**
```
POST   /api/payments/create-intent # Crear Payment Intent (Stripe)
POST   /api/payments/webhook       # Webhook de Stripe
GET    /api/payments/:id           # Estado de pago
POST   /api/payments/:id/refund    # Reembolsar
```

#### **Favoritos**
```
GET    /api/favorites              # Listar favoritos
POST   /api/favorites/:id          # Agregar favorito
DELETE /api/favorites/:id          # Eliminar favorito
```

#### **Reseñas**
```
GET    /api/reviews/experience/:id # Reseñas de experiencia
POST   /api/reviews                # Crear reseña
PUT    /api/reviews/:id            # Actualizar reseña
DELETE /api/reviews/:id            # Eliminar reseña
PUT    /api/reviews/:id/response   # Responder (anfitrión)
```

#### **Mensajes**
```
GET    /api/conversations          # Listar conversaciones
GET    /api/conversations/:id      # Mensajes de conversación
POST   /api/conversations          # Iniciar conversación
POST   /api/messages               # Enviar mensaje
PUT    /api/messages/:id/read      # Marcar como leído
```

### 3.7 Seguridad y Buenas Prácticas

#### **Autenticación y Autorización**
```typescript
// JWT Strategy
{
  algorithm: 'RS256',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
}

// Password Hashing
{
  algorithm: 'bcrypt',
  rounds: 12,
}

// Roles y Permisos
enum Role {
  USER = 'user',
  HOST = 'host',
  ADMIN = 'admin',
}

// Guards necesarios:
- JwtAuthGuard (todas las rutas protegidas)
- RolesGuard (rutas admin/host)
- OwnerGuard (usuarios solo pueden modificar sus recursos)
```

#### **Validación de Datos**
```typescript
// Zod Schema ejemplo
const createBookingSchema = z.object({
  experienciaId: z.string().uuid(),
  fecha: z.string().date().refine(d => new Date(d) >= new Date()),
  horario: z.string().time(),
  personas: z.number().int().positive().max(10),
});
```

#### **Rate Limiting**
```typescript
// Configurar por endpoint
{
  '/api/auth/login': { limit: 5, window: '15m' },
  '/api/auth/register': { limit: 3, window: '1h' },
  '/api/bookings': { limit: 10, window: '1h' },
}
```

#### **Protección CSRF/XSS**
```typescript
// Helmet.js para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
    }
  }
}));

// CORS configurado
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
}
```

---

## 4. MOCKUPS UI

### 4.1 Vistas Actuales (Análisis)

El frontend actual cuenta con las siguientes vistas implementadas:

| Vista | Archivo | Estado | Descripción |
|-------|---------|--------|-------------|
| Landing | `index.html` | ✅ Completa | Hero, categorías, experiencias destacadas, cómo funciona, testimonios |
| Explorar | `explorar.html` | ✅ Completa | Catálogo con filtros (categoría, precio, ubicación, búsqueda) |
| Detalle | `experiencia.html` | ✅ Completa | Galería, descripción, anfitrión, booking card, reseñas |
| Login | `login.html` | ✅ Completa | Formulario login, validación |
| Registro | `registro.html` | ✅ Completa | Formulario registro, términos |
| Perfil | `perfil.html` | ⚠️ Parcial | Edición perfil, placeholder reservas |
| Favoritos | `favoritos.html` | ✅ Completa | Listado favoritos |
| Anfitrión | `anfitrion.html` | ⚠️ Parcial | Landing informativa, modal "Próximamente" |
| Contacto | `contacto.html` | ⚠️ Parcial | Formulario simulado |
| Cómo funciona | `como-funciona.html` | ✅ Completa | Informativo |
| Legal | `legal.html` | ✅ Completa | Términos, privacidad |
| Soporte | `soporte.html` | ✅ Completa | FAQ, ayuda |
| 404 | `404.html` | ✅ Completa | Error page |

### 4.2 Estructura Visual por Vista

#### **4.2.1 Landing Page (index.html)**

```
┌────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Logo] EcoXperiencia  Explorar  Cómo funciona  Sé anfitrión│  │
│  │                     [Login] [Registrarse]  [☰ Mobile]     │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│  HERO SECTION                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │         [Imagen de fondo: Montañas de Colombia]           │  │
│  │                                                          │  │
│  │         "Descubre Colombia desde adentro"                 │  │
│  │         Experiencias ecoturísticas auténticas...          │  │
│  │                                                          │  │
│  │    ┌─────────────────────────────────────────────────┐   │  │
│  │    │ Destino │ Fecha │ Personas │  [Buscar]         │   │  │
│  │    └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │    ★ 4.9 · +2.400 experiencias · 180 anfitriones         │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│  CATEGORÍAS (Scroll horizontal)                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │ 🏔  │ │ 👁  │ │ ⛺  │ │ 💧  │ │ ☕  │ │ 🧭  │ │ 🐠  │ │ 🔍  │     │
│  │Sender│ │Avist.│ │Camp. │ │ Ríos │ │Agro. │ │Mont. │ │Buceo│ │Todo│  │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
├────────────────────────────────────────────────────────────────┤
│  EXPERIENCIAS DESTACADAS (Grid 3 columnas)                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │
│  │ [Imagen]  │  │ [Imagen]  │  │ [Imagen]  │                  │
│  │ ★Destacado│  │ [Imagen]  │  │ ★Destacado│                  │
│  │ ♡         │  │ ♡         │  │ ♡         │                  │
│  │───────────│  │───────────│  │───────────│                  │
│  │ 📍 Boyacá │  │ 📍 Leticia│  │ 📍 Nuquí  │                  │
│  │ Amanecer  │  │ Kayak     │  │ Ballenas  │                  │
│  │ en Cocuy  │  │ Amazonas  │  │ Pacífico  │                  │
│  │ ★ 4.9(127)│  │ ★ 4.8(89) │  │ ★ 4.9(156)│                  │
│  │ $180.000  │  │ $250.000  │  │ $320.000  │                  │
│  │ [Ver]     │  │ [Ver]     │  │ [Ver]     │                  │
│  └───────────┘  └───────────┘  └───────────┘                  │
│                                                                │
│              [Ver todas las experiencias]                      │
├────────────────────────────────────────────────────────────────┤
│  CÓMO FUNCIONA (3 pasos)                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │   01     │  │   02     │  │   03     │                     │
│  │   🔍     │  │   📱     │  │   ❤️     │                     │
│  │ Explora  │  │ Reserva  │  │  Vive    │                     │
│  │ y elige  │  │ con seg. │  │  la exp. │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
├────────────────────────────────────────────────────────────────┤
│  SÉ ANFITRIÓN (Banner)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Comparte tu territorio, genera ingresos"              │   │
│  │  ✓ Publica gratis     [Conviértete en anfitrión →]      │   │
│  │  ✓ Pagos seguros                                        │   │
│  │  ✓ Herramientas pro                                     │   │
│  │  [Imagen: Anfitrión guiando tour]                       │   │
│  └─────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│  TESTIMONIOS (Grid 3 columnas)                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │
│  │ [MC]      │  │ [AP]      │  │ [LG]      │                  │
│  │ María C.  │  │ Andrés P. │  │ Laura G.  │                  │
│  │ ★★★★★    │  │ ★★★★★    │  │ ★★★★★    │                  │
│  │ "Una exp. │  │ "Ver las  │  │ "La exp.  │                  │
│  │  increí-  │  │  ballenas │  │  del café │                  │
│  │  ble..."  │  │  fue..."  │  │  superó"  │                  │
│  └───────────┘  └───────────┘  └───────────┘                  │
├────────────────────────────────────────────────────────────────┤
│  ESTADÍSTICAS                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │  2400+  │  │  180+   │  │  15000+ │  │  4.9★   │          │
│  │Experienc│  │Anfitrion│  │Viajeros │  │Promedio │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
├────────────────────────────────────────────────────────────────┤
│  FOOTER                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Logo]    Explorar    Empresa    Legal       Soporte     │  │
│  │ EcoXperi. Experiencias Sobre nos. Términos   Centro ayuda│  │
│  │ Conectamos Destinos   Sé anfitrión Privacidad Contacto   │  │
│  │ ...       Categorías  Blog        Cookies    FAQ         │  │
│  │                                                          │  │
│  │ [Instagram] [Facebook] [TikTok]                          │  │
│  │                                                          │  │
│  │ © 2024 EcoXperiencia  [🛡 Turismo resp.] [💳 Pago seguro]│  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### **4.2.2 Detalle de Experiencia (experiencia.html)**

```
┌────────────────────────────────────────────────────────────────┐
│  NAVBAR (igual que landing)                                    │
├────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS                                                   │
│  Experiencias / Amanecer en el Cocuy                           │
├────────────────────────────────────────────────────────────────┤
│  TÍTULO Y METADATOS                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Amanecer en el Cocuy                                    │   │
│  │ ★ 4.9 · 127 reseñas  │  📍 Boyacá, Colombia  │  🏔 Senderismo││
│  └─────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│  GALERÍA DE IMÁGENES                                           │
│  ┌─────────────────────────────┐  ┌───────┬───────┐            │
│  │                             │  │       │       │            │
│  │      [Imagen Principal]     │  │ Thumb │ Thumb │            │
│  │                             │  │       │       │            │
│  │                             │  ├───────┼───────┤            │
│  │                             │  │       │       │            │
│  │                             │  │ Thumb │ Thumb │            │
│  │                             │  │       │       │            │
│  └─────────────────────────────┘  └───────┴───────┘            │
├─────────────────────────────────────────────────────────────────┤
│  CONTENIDO PRINCIPAL (2 columnas)                               │
│  ┌───────────────────────────────┐  ┌─────────────────────┐    │
│  │  ACERCA DE ESTA EXPERIENCIA   │  │  BOOKING CARD       │    │
│  │                               │  │  ┌─────────────────┐│    │
│  │  [Descripción completa...]    │  │  │ $180.000 COP    ││    │
│  │  Vive la magia del amanecer   │  │  │ / persona       ││    │
│  │  en el Parque Nacional...     │  │  ├─────────────────┤│    │
│  │                               │  │  │ Fecha [📅]      ││    │
│  │  LO QUE INCLUYE               │  │  │ Horario [▼]     ││    │
│  │  ✓ Guía local experto         │  │  ├─────────────────┤│    │
│  │  ✓ Transporte                 │  │  │ Personas [▼]    ││    │
│  │  ✓ Alimentación               │  │  ├─────────────────┤│    │
│  │  ✓ Seguro de viaje            │  │  │ $180.000 x 2    ││    │
│  │                               │  │  │ ─────────────   ││    │
│  │  TU ANFITRIÓN                 │  │  │ Total $360.000  ││    │
│  │  ┌────┐                       │  │  ├─────────────────┤│    │
│  │  │ CM │ Carlos Martínez       │  │  │ [RESERVAR]      ││    │
│  │  └────┘ Anfitrión desde 2019  │  │  │                 ││    │
│  │         "Guía de montaña..."   │  │  │ [♡ Guardar]     ││    │
│  │                               │  │  │                 ││    │
│  │  RESEÑAS                      │  │  │ Cancelación     ││    │
│  │  ★ 4.9 · 127 reseñas          │  │  │ gratuita 24h    ││    │
│  │  ┌─────────────────────────┐  │  │  └─────────────────┘│    │
│  │  │ [MG] María G.  ★★★★★   │  │  │                     │    │
│  │  │ "Una experiencia        │  │  │                     │    │
│  │  │  increíble..."          │  │  │                     │    │
│  │  └─────────────────────────┘  │  │                     │    │
│  │  ┌─────────────────────────┐  │  │                     │    │
│  │  │ [CR] Carlos R. ★★★★★   │  │  │                     │    │
│  │  │ "Superó todas mis..."    │  │  │                     │    │
│  │  └─────────────────────────┘  │  │                     │    │
│  └───────────────────────────────┘  └─────────────────────┘    │
├────────────────────────────────────────────────────────────────┤
│  FOOTER                                                        │
└────────────────────────────────────────────────────────────────┘
```

#### **4.2.3 Login/Registro**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│            ┌─────────────────────────────────────┐             │
│            │         [Logo] EcoXperiencia        │             │
│            │                                     │             │
│            │     Login / Registro                │             │
│            │                                     │             │
│            │  ┌───────────────────────────────┐  │             │
│            │  │ Email                         │  │             │
│            │  │ [___________________________] │  │             │
│            │  └───────────────────────────────┘  │             │
│            │                                     │             │
│            │  ┌───────────────────────────────┐  │             │
│            │  │ Contraseña                    │  │             │
│            │  │ [___________________________] │  │             │
│            │  └───────────────────────────────┘  │             │
│            │                                     │             │
│            │  [            Iniciar sesión    ]  │             │
│            │                                     │             │
│            │  ¿No tienes cuenta? Regístrate     │             │
│            │                                     │             │
│            └─────────────────────────────────────┘             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### **4.2.4 Perfil de Usuario**

```
┌────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                        │
├────────────────────────────────────────────────────────────────┤
│  HEADER DE PERFIL                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌─────┐                                                │   │
│  │  │     │  Juan Pérez                           [Mis fav] │   │
│  │  │ JP  │  juan@email.com                         [Logout]│   │
│  │  │     │  Miembro desde enero 2024                       │   │
│  │  └─────┘                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│  TABS                                                          │
│  [Información] [Mis reservas] [Favoritos]                      │
├────────────────────────────────────────────────────────────────┤
│  INFORMACIÓN PERSONAL                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Nombre completo                                        │   │
│  │  [Juan Pérez________________________________]           │   │
│  │                                                         │   │
│  │  Email (no editable)                                    │   │
│  │  [juan@email.com____________________________]           │   │
│  │                                                         │   │
│  │  Teléfono                                               │   │
│  │  [+57 300 000 0000__________________________]           │   │
│  │                                                         │   │
│  │  Bio                                                    │   │
│  │  [Cuéntanos un poco sobre ti...____________]            │   │
│  │                                                         │   │
│  │  [Guardar cambios]  [Cambiar contraseña]                │   │
│  └─────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│  RESERVAS RECIENTES                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           Aún no tienes reservas                        │   │
│  │           [Explora experiencias]                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### 4.3 Vistas Faltantes (Propuestas)

#### **4.3.1 Dashboard de Anfitrión**

```
┌────────────────────────────────────────────────────────────────┐
│  NAVBAR (con link a "Volver al sitio")                         │
├────────────────────────────────────────────────────────────────┤
│  SIDEBAR + CONTENIDO PRINCIPAL                                 │
│  ┌────────────┐  ┌─────────────────────────────────────────┐   │
│  │            │  │  RESUMEN                                │   │
│  │ [Dashboard]│  │  ┌───────┬───────┬───────┬───────┐     │   │
│  │            │  │  │Reservas│Ingresos│Vistas │Favor. │     │   │
│  │ Experiencias│  │  │  12   │$2.4M  │ 340   │  89   │     │   │
│  │            │  │  └───────┴───────┴───────┴───────┘     │   │
│  │ Reservas    │  │                                        │   │
│  │            │  │  RESERVAS RECIENTES                     │   │
│  │ Mensajes    │  │  ┌─────────────────────────────────┐  │   │
│  │            │  │  │ Fecha    │ Exp.     │ Estado    │  │   │
│  │ Ingresos    │  │  │ 15 Ene   │ Cocuy    │ ✓ Conf.   │  │   │
│  │            │  │  │ 18 Ene   │ Amazonas │ ⏳ Pend.   │  │   │
│  │ Configurac. │  │  │ 20 Ene   │ Quindío  │ ✓ Conf.   │  │   │
│  │            │  │  └─────────────────────────────────┘  │   │
│  │ [← Volver] │  │                                        │   │
│  │            │  │  PRÓXIMAS EXPERIENCIAS                  │   │
│  │            │  │  ┌─────────────────────────────────┐  │   │
│  │            │  │  │ [Crear nueva experiencia +]     │  │   │
│  │            │  │  └─────────────────────────────────┘  │   │
│  └────────────┘  └─────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

#### **4.3.2 Crear/Editar Experiencia**

```
┌────────────────────────────────────────────────────────────────┐
│  < Volver a Experiencias  │  Crear nueva experiencia           │
├────────────────────────────────────────────────────────────────┤
│  PROGRESO: ○ Información → ○ Ubicación → ○ Imágenes → ○ Detalles│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INFORMACIÓN BÁSICA                                       │  │
│  │                                                           │  │
│  │  Título *                                                │  │
│  │  [___________________________________________]           │  │
│  │                                                           │  │
│  │  Categoría *                                             │  │
│  │  [Seleccionar ▼ _____________________________]           │  │
│  │                                                           │  │
│  │  Descripción *                                           │  │
│  │  [___________________________________________]           │  │
│  │  [___________________________________________]           │  │
│  │  [___________________________________________]           │  │
│  │                                                           │  │
│  │  Duración (horas) *     Máx. personas *                   │  │
│  │  [____] horas           [____] personas                   │  │
│  │                                                           │  │
│  │  Precio por persona *                                    │  │
│  │  $ [___________] COP                                     │  │
│  │                                                           │  │
│  │  Lo que incluye                                          │  │
│  │  [✓] Guía local  [✓] Transporte  [✓] Alimentación        │  │
│  │  [✓] Seguro      [ ] Equipo      [+] Agregar otro        │  │
│  │                                                           │  │
│  │                    [Guardar y continuar →]                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### **4.3.3 Historial de Reservas**

```
┌────────────────────────────────────────────────────────────────┐
│  MIS RESERVAS                                                  │
│  [Próximas] [Historial] [Canceladas]                           │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Imagen]  Amanecer en el Cocuy                          │  │
│  │          ★ 4.9 │ 📍 Boyacá                               │  │
│  │                                                          │  │
│  │  Fecha: 15 de enero, 2025 │ 08:00 AM                     │  │
│  │  Personas: 2                                              │  │
│  │  Total: $360.000 COP                                      │  │
│  │  Estado: [✓ Confirmada]                                   │  │
│  │  Código: ABC123                                           │  │
│  │                                                          │  │
│  │  [Ver detalles]  [Contactar anfitrión]  [Cancelar]       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Imagen]  Café de origen en el Quindío                  │  │
│  │          ★ 5.0 │ 📍 Armenia                              │  │
│  │                                                          │  │
│  │  Fecha: 20 de diciembre, 2024 │ 09:00 AM                 │  │
│  │  Personas: 4                                              │  │
│  │  Total: $380.000 COP                                      │  │
│  │  Estado: [✓ Completada]                                   │  │
│  │                                                          │  │
│  │  [Dejar reseña]  [Ver detalles]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 4.4 Mejoras de UX Propuestas

#### **4.4.1 Mejoras Generales**

| Área | Mejora Propuesta | Prioridad |
|------|-----------------|-----------|
| **Loading States** | Skeletons en lugar de spinners | Alta |
| **Empty States** | Ilustraciones + CTAs claros | Alta |
| **Error Handling** | Mensajes específicos + retry | Alta |
| **Mobile** | Menú hamburguesa más accesible | Alta |
| **Búsqueda** | Autocomplete + sugerencias | Media |
| **Filtros** | Filtros en tiempo real (sin botón) | Media |
| **Imágenes** | Lazy loading + placeholder blur | Media |
| **Accesibilidad** | ARIA labels, focus states, keyboard nav | Alta |

#### **4.4.2 Mejoras Específicas por Vista**

**Landing:**
- Agregar video de fondo opcional en hero
- Testimonios con carousel en mobile
- Sticky CTA de búsqueda en scroll

**Detalle de Experiencia:**
- Mapa interactivo de ubicación (Google Maps)
- Galería con lightbox (zoom en imágenes)
- Calendar de disponibilidad visible
- FAQ específica de la experiencia
- Compartir en redes sociales

**Checkout/Reserva:**
- Progress indicator de pasos
- Resumen sticky en scroll
- Trust badges (pago seguro, cancelación)
- Chat rápido con anfitrión

**Perfil:**
- Avatar editable (upload de foto)
- Historial completo con filtros
- Configuración de notificaciones
- Datos de facturación

### 4.5 Sistema de Diseño

#### **Design Tokens (Actuales - Mantener)**

```css
:root {
  /* Colores */
  --color-moss: #1C3A2A;        /* Primario */
  --color-moss-light: #2A4A38;
  --color-moss-dark: #142D20;
  --color-earth: #C4893A;       /* Secundario */
  --color-cream: #F5F0E8;       /* Fondos */
  --color-off-white: #FAFAF7;
  --color-lime: #7EC850;        /* Acentos/CTA */
  --color-gold: #D4AF37;        /* Destacados */

  /* Tipografía */
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;

  /* Espaciado */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Bordes */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
}
```

#### **Componentes a Crear (React)**

```typescript
// Componentes base
- Button (variants: primary, secondary, outline, ghost)
- Input (with validation states)
- Select
- TextArea
- Checkbox
- Radio
- Modal
- Toast
- Skeleton
- Avatar
- Badge
- Card

// Componentes específicos
- ExperienceCard
- ExperienceGrid
- BookingCard
- ReviewCard
- FilterBar
- SearchBar
- CategoryPill
- Navbar
- Footer
- UserProfile
- ReservationCard
- HostDashboard
```

---

## 5. PLAN DE IMPLEMENTACIÓN

### 5.1 Fases Propuestas

#### **Fase 1: Fundación (4-6 semanas)**
- [ ] Configurar monorepo (Turborepo)
- [ ] Setup Next.js frontend
- [ ] Setup NestJS backend
- [ ] Configurar PostgreSQL + Prisma
- [ ] Implementar autenticación (JWT)
- [ ] Migrar datos hardcodeados a DB

#### **Fase 2: Core (6-8 semanas)**
- [ ] CRUD de experiencias
- [ ] Sistema de reservas completo
- [ ] Integración con Stripe
- [ ] Sistema de emails (SendGrid)
- [ ] Upload de imágenes (Cloudinary)

#### **Fase 3: Dashboard Anfitrión (4-6 semanas)**
- [ ] Panel de control
- [ ] Gestión de experiencias
- [ ] Gestión de reservas
- [ ] Reportes de ingresos

#### **Fase 4: Pulido (4 semanas)**
- [ ] Testing (unit, integration, e2e)
- [ ] Optimización de performance
- [ ] SEO técnico
- [ ] Analytics
- [ ] Beta cerrada

### 5.2 Criterios de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tiempo de carga (LCP) | < 2.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Tasa de conversión | > 3% |
| Uptime | > 99.9% |

---

## APÉNDICE A: Datos Actuales para Migración

### Experiencias Hardcodeadas (8)

```json
[
  {
    "id": 1,
    "title": "Amanecer en el Cocuy",
    "location": "Boyacá, Colombia",
    "category": "Senderismo",
    "categoryId": "hiking",
    "price": 180000,
    "rating": 4.9,
    "reviews": 127,
    "featured": true,
    "duration": "12 horas",
    "maxPeople": 8,
    "host": {"name": "Carlos Martínez", "avatar": "CM", "since": "2019"}
  },
  {
    "id": 2,
    "title": "Kayak en el Amazonas",
    "location": "Leticia, Amazonas",
    "category": "Ríos y cascadas",
    "categoryId": "rivers",
    "price": 250000,
    "rating": 4.8,
    "reviews": 89,
    "duration": "8 horas",
    "maxPeople": 6,
    "host": {"name": "Lucía Ticuna", "avatar": "LT", "since": "2018"}
  },
  {
    "id": 3,
    "title": "Café de origen en el Quindío",
    "location": "Armenia, Quindío",
    "category": "Agroturismo",
    "categoryId": "agrotourism",
    "price": 95000,
    "rating": 5.0,
    "reviews": 203,
    "featured": true,
    "duration": "6 horas",
    "maxPeople": 12,
    "host": {"name": "Roberto Ospina", "avatar": "RO", "since": "2020"}
  },
  {
    "id": 4,
    "title": "Ballenas en el Pacífico",
    "location": "Nuquí, Chocó",
    "category": "Avistamiento",
    "categoryId": "wildlife",
    "price": 320000,
    "rating": 4.9,
    "reviews": 156,
    "featured": true,
    "duration": "4 horas",
    "maxPeople": 10,
    "host": {"name": "María Elena Becerra", "avatar": "MB", "since": "2017"}
  },
  {
    "id": 5,
    "title": "Páramo de Chingaza",
    "location": "Cundinamarca, Colombia",
    "category": "Alta montaña",
    "categoryId": "highmountain",
    "price": 120000,
    "rating": 4.7,
    "reviews": 74,
    "duration": "10 horas",
    "maxPeople": 15,
    "host": {"name": "Andrés Gómez", "avatar": "AG", "since": "2016"}
  },
  {
    "id": 6,
    "title": "Ciénaga Grande",
    "location": "Magdalena, Colombia",
    "category": "Buceo",
    "categoryId": "diving",
    "price": 145000,
    "rating": 4.8,
    "reviews": 92,
    "duration": "5 horas",
    "maxPeople": 8,
    "host": {"name": "Pedro Zapata", "avatar": "PZ", "since": "2018"}
  },
  {
    "id": 7,
    "title": "Glamping en el Desierto",
    "location": "Villa de Leyva, Boyacá",
    "category": "Camping",
    "categoryId": "camping",
    "price": 280000,
    "rating": 4.9,
    "reviews": 68,
    "featured": true,
    "duration": "2 días / 1 noche",
    "maxPeople": 4,
    "host": {"name": "Catalina Rincón", "avatar": "CR", "since": "2021"}
  },
  {
    "id": 8,
    "title": "Termales de San Vicente",
    "location": "Santa Rosa de Cabal, Risaralda",
    "category": "Ríos y cascadas",
    "categoryId": "rivers",
    "price": 110000,
    "rating": 4.8,
    "reviews": 145,
    "duration": "7 horas",
    "maxPeople": 10,
    "host": {"name": "Diego Valencia", "avatar": "DV", "since": "2019"}
  }
]
```

---

**Documento generado el:** 14 de abril de 2026
**Autor:** EcoXperiencia Development Team
**Próxima revisión:** Después de Fase 1
