import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // ============================================================
  // CREAR CATEGORÍAS
  // ============================================================
  console.log('📂 Creando categorías...');
  const categories = await prisma.category.createMany({
    data: [
      {
        nombre: 'Senderismo',
        slug: 'hiking',
        icono: 'mountain',
        descripcion: 'Caminatas y trekking en la naturaleza',
        orden: 1,
      },
      {
        nombre: 'Avistamiento',
        slug: 'wildlife',
        icono: 'eye',
        descripcion: 'Observación de fauna y aves',
        orden: 2,
      },
      {
        nombre: 'Camping',
        slug: 'camping',
        icono: 'tent',
        descripcion: 'Acampadas en la naturaleza',
        orden: 3,
      },
      {
        nombre: 'Ríos y cascadas',
        slug: 'rivers',
        icono: 'droplet',
        descripcion: 'Actividades acuáticas y cascadas',
        orden: 4,
      },
      {
        nombre: 'Agroturismo',
        slug: 'agrotourism',
        icono: 'coffee',
        descripcion: 'Experiencias en fincas y cultivos',
        orden: 5,
      },
      {
        nombre: 'Alta montaña',
        slug: 'highmountain',
        icono: 'compass',
        descripcion: 'Montañismo y escalada',
        orden: 6,
      },
      {
        nombre: 'Buceo',
        slug: 'diving',
        icono: 'fish',
        descripcion: 'Buceo y snorkel',
        orden: 7,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ ${categories.count} categorías creadas`);

  // ============================================================
  // CREAR USUARIO DE PRUEBA
  // ============================================================
  console.log('👤 Creando usuario de prueba...');
  const testUser = await prisma.user.upsert({
    where: { email: 'viajero@test.com' },
    update: {},
    create: {
      email: 'viajero@test.com',
      passwordHash: '$2a$10$test_hash_bcrypt', // En producción usar bcrypt real
      nombreCompleto: 'Juan Viajero',
      rol: 'VIAJERO',
      emailVerificado: true,
      estado: 'ACTIVO',
      telefono: '+57 300 1234567',
      bio: 'Amante de la naturaleza y las aventuras',
    },
  });
  console.log(`✅ Usuario creado: ${testUser.email}`);

  // ============================================================
  // CREAR ANFITRIÓN DE PRUEBA
  // ============================================================
  console.log('🏠 Creando anfitrión de prueba...');
  const hostUser = await prisma.user.upsert({
    where: { email: 'anfitrion@test.com' },
    update: {},
    create: {
      email: 'anfitrion@test.com',
      passwordHash: '$2a$10$test_hash_bcrypt',
      nombreCompleto: 'Carlos Anfitrión',
      rol: 'ANFITRION',
      emailVerificado: true,
      estado: 'ACTIVO',
      telefono: '+57 300 7654321',
      bio: 'Experimentado guía turístico en los andes',
    },
  });

  const host = await prisma.host.upsert({
    where: { usuarioId: hostUser.id },
    update: {},
    create: {
      usuarioId: hostUser.id,
      documentoTipo: 'CC',
      documentoNumero: '1234567890',
      fechaNacimiento: new Date('1985-05-15'),
      direccionCompleta: 'Calle 10 #5-50, Bogotá',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      pais: 'Colombia',
      biografiaAnfitrion:
        'Guía de montaña certificado con 15 años de experiencia',
      estadoVerificacion: 'VERIFICADO',
      fechaVerificacion: new Date(),
    },
  });
  console.log(`✅ Anfitrión creado: ${hostUser.email}`);

  // ============================================================
  // CREAR EXPERIENCIAS DE PRUEBA
  // ============================================================
  console.log('🎒 Creando experiencias de prueba...');

  const hiking = await prisma.category.findUnique({
    where: { slug: 'hiking' },
  });
  const wildlife = await prisma.category.findUnique({
    where: { slug: 'wildlife' },
  });
  const camping = await prisma.category.findUnique({
    where: { slug: 'camping' },
  });

  const experiences = [
    {
      anfitrionId: host.id,
      titulo: 'Senderismo por Los Nevados',
      slug: 'senderismo-los-nevados',
      descripcion:
        'Una increíble caminata de 2 días por los Nevados del Ruiz. Experiencia ideal para amantes de la montaña.',
      categoriaId: hiking?.id,
      ubicacionTexto: 'Parque Nacional Natural Los Nevados, Risaralda',
      latitud: 4.875,
      longitud: -75.328,
      precioBase: 250000, // COP
      duracionHoras: 16,
      maxPersonas: 8,
      minPersonas: 2,
      incluye: JSON.stringify([
        'Guía especializado',
        'Almuerzo incluido',
        'Botiquín de primeros auxilios',
      ]),
      requisitos: JSON.stringify([
        'Condición física media-alta',
        'Ropa adecuada para clima frío',
      ]),
      politicaCancelacion: 'MODERADA' as const,
      estado: 'ACTIVA' as const,
      fechaActivacion: new Date(),
    },
    {
      anfitrionId: host.id,
      titulo: 'Avistamiento de Aves en Tatacoa',
      slug: 'avistamiento-aves-tatacoa',
      descripcion:
        'Tour de 4 horas en el desierto de La Tatacoa para observar más de 100 especies de aves.',
      categoriaId: wildlife?.id,
      ubicacionTexto: 'Desierto de La Tatacoa, Huila',
      latitud: 2.8769,
      longitud: -75.1883,
      precioBase: 80000,
      duracionHoras: 4,
      maxPersonas: 10,
      minPersonas: 1,
      incluye: JSON.stringify([
        'Binoculares',
        'Desayuno y almuerzo',
        'Transporte',
      ]),
      politicaCancelacion: 'FLEXIBLE' as const,
      estado: 'ACTIVA' as const,
      fechaActivacion: new Date(),
    },
    {
      anfitrionId: host.id,
      titulo: 'Camping en Valle de Cocora',
      slug: 'camping-valle-cocora',
      descripcion:
        'Acampar entre las palmas de cera más altas del mundo. Una noche mágica bajo las estrellas.',
      categoriaId: camping?.id,
      ubicacionTexto: 'Valle de Cocora, Quindío',
      latitud: 4.6418,
      longitud: -75.3939,
      precioBase: 150000,
      duracionHoras: 24,
      maxPersonas: 12,
      minPersonas: 4,
      incluye: JSON.stringify(['Carpa', 'Comidas', 'Hoguera nocturna']),
      politicaCancelacion: 'FLEXIBLE' as const,
      estado: 'ACTIVA' as const,
      fechaActivacion: new Date(),
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: {},
      create: exp,
    });
  }
  console.log(`✅ ${experiences.length} experiencias creadas`);

  // ============================================================
  // CREAR IMÁGENES DE PRUEBA
  // ============================================================
  console.log('🖼️ Creando imágenes de prueba...');
  const expWithImages = await prisma.experience.findUnique({
    where: { slug: 'senderismo-los-nevados' },
  });

  if (expWithImages) {
    await prisma.experienceImage.createMany({
      data: [
        {
          experienciaId: expWithImages.id,
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          titulo: 'Nevados del Ruiz',
          orden: 1,
          esPortada: true,
        },
        {
          experienciaId: expWithImages.id,
          url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
          titulo: 'Vista panorámica',
          orden: 2,
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log(`✅ Imágenes creadas`);

  console.log('✨ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
