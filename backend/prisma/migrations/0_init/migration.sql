-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VIAJERO', 'ANFITRION', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVO', 'SUSPENDIDO', 'ELIMINADO');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CC', 'CE', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDIENTE', 'VERIFICADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "ExperienceStatus" AS ENUM ('BORRADOR', 'PENDIENTE', 'ACTIVA', 'PAUSADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "CancellationPolicy" AS ENUM ('FLEXIBLE', 'MODERADA', 'ESTRICTA');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TARJETA', 'PAYPAL', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RESERVA', 'MENSAJE', 'SISTEMA', 'PROMOCION', 'RECORDATORIO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "rol" "UserRole" NOT NULL DEFAULT 'VIAJERO',
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaSesion" TIMESTAMP(3),
    "estado" "UserStatus" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "documentoTipo" "DocumentType" NOT NULL,
    "documentoNumero" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "direccionCompleta" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Colombia',
    "biografiaAnfitrion" TEXT,
    "certificaciones" JSONB,
    "fechaVerificacion" TIMESTAMP(3),
    "estadoVerificacion" "VerificationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "anfitrionId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoriaId" TEXT,
    "subcategoria" TEXT,
    "ubicacionTexto" TEXT NOT NULL,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "precioBase" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'COP',
    "duracionHoras" INTEGER NOT NULL,
    "maxPersonas" INTEGER NOT NULL,
    "minPersonas" INTEGER NOT NULL DEFAULT 1,
    "incluye" JSONB,
    "noIncluye" JSONB,
    "requisitos" JSONB,
    "puntoEncuentro" TEXT,
    "politicaCancelacion" "CancellationPolicy" NOT NULL DEFAULT 'FLEXIBLE',
    "estado" "ExperienceStatus" NOT NULL DEFAULT 'BORRADOR',
    "fechaActivacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceImage" (
    "id" TEXT NOT NULL,
    "experienciaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titulo" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "experienciaId" TEXT NOT NULL,
    "fechaAgregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "experienciaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fechaExperiencia" TIMESTAMP(3) NOT NULL,
    "horario" TEXT NOT NULL,
    "personas" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "precioTotal" DECIMAL(12,2) NOT NULL,
    "estado" "BookingStatus" NOT NULL DEFAULT 'PENDIENTE',
    "codigoConfirmacion" TEXT,
    "notasUsuario" TEXT,
    "notasAnfitrion" TEXT,
    "fechaReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCancelacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'COP',
    "metodo" "PaymentMethod" NOT NULL,
    "estado" "PaymentStatus" NOT NULL DEFAULT 'PENDIENTE',
    "transactionId" TEXT,
    "gatewayResponse" JSONB,
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaReembolso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "experienciaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "titulo" TEXT,
    "comentario" TEXT NOT NULL,
    "calificacionLimpieza" INTEGER,
    "calificacionValor" INTEGER,
    "calificacionExperiencia" INTEGER,
    "respuestaAnfitrion" TEXT,
    "fechaRespuesta" TIMESTAMP(3),
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" "NotificationType" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "urlAccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "anfitrionId" TEXT NOT NULL,
    "experienciaId" TEXT,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversacionId" TEXT NOT NULL,
    "emisorId" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rol_idx" ON "User"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "Host_usuarioId_key" ON "Host"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_documentoNumero_key" ON "Host"("documentoNumero");

-- CreateIndex
CREATE INDEX "Host_usuarioId_idx" ON "Host"("usuarioId");

-- CreateIndex
CREATE INDEX "Host_documentoNumero_idx" ON "Host"("documentoNumero");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nombre_key" ON "Category"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_anfitrionId_idx" ON "Experience"("anfitrionId");

-- CreateIndex
CREATE INDEX "Experience_categoriaId_idx" ON "Experience"("categoriaId");

-- CreateIndex
CREATE INDEX "Experience_slug_idx" ON "Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_estado_idx" ON "Experience"("estado");

-- CreateIndex
CREATE INDEX "ExperienceImage_experienciaId_idx" ON "ExperienceImage"("experienciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_usuarioId_experienciaId_key" ON "Favorite"("usuarioId", "experienciaId");

-- CreateIndex
CREATE INDEX "Favorite_usuarioId_idx" ON "Favorite"("usuarioId");

-- CreateIndex
CREATE INDEX "Favorite_experienciaId_idx" ON "Favorite"("experienciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_codigoConfirmacion_key" ON "Booking"("codigoConfirmacion");

-- CreateIndex
CREATE INDEX "Booking_experienciaId_idx" ON "Booking"("experienciaId");

-- CreateIndex
CREATE INDEX "Booking_usuarioId_idx" ON "Booking"("usuarioId");

-- CreateIndex
CREATE INDEX "Booking_estado_idx" ON "Booking"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_usuarioId_idx" ON "Payment"("usuarioId");

-- CreateIndex
CREATE INDEX "Payment_estado_idx" ON "Payment"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_experienciaId_idx" ON "Review"("experienciaId");

-- CreateIndex
CREATE INDEX "Review_usuarioId_idx" ON "Review"("usuarioId");

-- CreateIndex
CREATE INDEX "Notification_usuarioId_idx" ON "Notification"("usuarioId");

-- CreateIndex
CREATE INDEX "Notification_leido_idx" ON "Notification"("leido");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_usuarioId_anfitrionId_experienciaId_key" ON "Conversation"("usuarioId", "anfitrionId", "experienciaId");

-- CreateIndex
CREATE INDEX "Conversation_usuarioId_idx" ON "Conversation"("usuarioId");

-- CreateIndex
CREATE INDEX "Conversation_anfitrionId_idx" ON "Conversation"("anfitrionId");

-- CreateIndex
CREATE INDEX "Message_conversacionId_idx" ON "Message"("conversacionId");

-- CreateIndex
CREATE INDEX "Message_emisorId_idx" ON "Message"("emisorId");

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_anfitrionId_fkey" FOREIGN KEY ("anfitrionId") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceImage" ADD CONSTRAINT "ExperienceImage_experienciaId_fkey" FOREIGN KEY ("experienciaId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_experienciaId_fkey" FOREIGN KEY ("experienciaId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_experienciaId_fkey" FOREIGN KEY ("experienciaId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_experienciaId_fkey" FOREIGN KEY ("experienciaId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_anfitrionId_fkey" FOREIGN KEY ("anfitrionId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_experienciaId_fkey" FOREIGN KEY ("experienciaId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_emisorId_fkey" FOREIGN KEY ("emisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
