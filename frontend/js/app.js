/**
 * EcoXperiencia - Sistema Frontend Completo v2.0
 * Arquitectura: 100% Local (localStorage) - Sin backend
 * Despliegue estático - Funciona abriendo index.html directamente
 */

// ═══════════════════════════════════════════════
// UTILIDADES DE ALMACENAMIENTO
// ═══════════════════════════════════════════════
const Storage = {
    NS: 'ecoxperiencia_',

    get(key) {
        try { return JSON.parse(localStorage.getItem(this.NS + key)); }
        catch { return null; }
    },

    set(key, value) {
        localStorage.setItem(this.NS + key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(this.NS + key);
    }
};

// ═══════════════════════════════════════════════
// BASE DE DATOS LOCAL (Simulación completa)
// ═══════════════════════════════════════════════
const DB = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    _table(name) {
        return Storage.get('db_' + name) || [];
    },

    _save(name, records) {
        Storage.set('db_' + name, records);
    },

    insert(table, data) {
        const records = this._table(table);
        const record = { id: this.generateId(), createdAt: new Date().toISOString(), ...data };
        records.push(record);
        this._save(table, records);
        return record;
    },

    findAll(table, filterFn) {
        const records = this._table(table);
        return filterFn ? records.filter(filterFn) : [...records];
    },

    findOne(table, filterFn) {
        return this._table(table).find(filterFn) || null;
    },

    findById(table, id) {
        return this.findOne(table, r => r.id === id);
    },

    update(table, id, data) {
        const records = this._table(table);
        const idx = records.findIndex(r => r.id === id);
        if (idx === -1) return null;
        records[idx] = { ...records[idx], ...data, updatedAt: new Date().toISOString() };
        this._save(table, records);
        return records[idx];
    },

    delete(table, id) {
        const records = this._table(table);
        const filtered = records.filter(r => r.id !== id);
        this._save(table, filtered);
        return filtered.length !== records.length;
    },

    init() {
        if (Storage.get('db_v2_initialized')) {
            // Migrate old format session
            const oldUser = Storage.get('currentUser');
            if (oldUser && !oldUser.role) Storage.remove('currentUser');
            return;
        }

        // Migrate old format session
        const oldUser = Storage.get('currentUser');
        if (oldUser && !oldUser.role) Storage.remove('currentUser');

        // Seed demo users
        Storage.set('db_users', [
            {
                id: 'admin001', name: 'Administrador', email: 'admin@ecoxperiencia.com',
                password: 'admin123', avatar: 'AD', role: 'admin',
                phone: '+57 300 000 0001', bio: 'Administrador de la plataforma EcoXperiencia.',
                emailVerified: true, status: 'activo', createdAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: 'host001', name: 'Carlos Martínez', email: 'anfitrion@ecoxperiencia.com',
                password: 'host123', avatar: 'CM', role: 'anfitrion',
                phone: '+57 310 555 0123', bio: 'Guía de montaña certificado con 10 años de experiencia en los Andes colombianos.',
                emailVerified: true, status: 'activo', createdAt: '2024-01-15T00:00:00.000Z'
            },
            {
                id: 'user001', name: 'María García', email: 'viajero@ecoxperiencia.com',
                password: 'viajero123', avatar: 'MG', role: 'viajero',
                phone: '+57 320 111 2222', bio: 'Apasionada del ecoturismo y la naturaleza colombiana.',
                emailVerified: true, status: 'activo', createdAt: '2024-02-01T00:00:00.000Z'
            }
        ]);

        // Seed hosts
        Storage.set('db_hosts', [{
            id: 'hostprofile001', userId: 'host001', documentType: 'CC',
            documentNumber: '1234567890', birthDate: '1985-03-15',
            address: 'Carrera 15 # 82-54', city: 'Bogotá', department: 'Cundinamarca',
            country: 'Colombia', hostBio: 'Guía de montaña certificado.',
            certifications: ['Guía de Alta Montaña COTELCO', 'Primeros Auxilios', 'RCP'],
            verificationStatus: 'verificado', verificationDate: '2024-01-20T00:00:00.000Z',
            createdAt: '2024-01-15T00:00:00.000Z'
        }]);

        // Seed reviews
        Storage.set('db_reviews', [
            { id: 'rev001', experienceId: 1, userId: 'user001', userName: 'María G.', userAvatar: 'MG', rating: 5, comment: 'Una experiencia increíble. El anfitrión fue muy amable y conocedor. Definitivamente volvería.', visible: true, createdAt: '2024-10-15T00:00:00.000Z' },
            { id: 'rev002', experienceId: 1, userId: 'host001', userName: 'Carlos R.', userAvatar: 'CR', rating: 5, comment: 'Superó todas mis expectativas. El amanecer en el Cocuy es algo que no se olvida jamás. Recomiendo totalmente.', visible: true, createdAt: '2024-09-22T00:00:00.000Z' },
            { id: 'rev003', experienceId: 1, userId: 'admin001', userName: 'Ana P.', userAvatar: 'AP', rating: 4, comment: 'Muy bonito, aunque el clima no acompañó mucho. El guía estuvo pendiente en todo momento.', visible: true, createdAt: '2024-08-10T00:00:00.000Z' },
            { id: 'rev004', experienceId: 2, userId: 'user001', userName: 'Pedro M.', userAvatar: 'PM', rating: 5, comment: 'Los delfines rosados son increíbles. Una experiencia única que conecta con la naturaleza.', visible: true, createdAt: '2024-10-01T00:00:00.000Z' },
            { id: 'rev005', experienceId: 2, userId: 'admin001', userName: 'Sofía L.', userAvatar: 'SL', rating: 4, comment: 'Experiencia mágica. La guía indígena Lucía tiene un conocimiento extraordinario del ecosistema.', visible: true, createdAt: '2024-09-05T00:00:00.000Z' },
            { id: 'rev006', experienceId: 3, userId: 'user001', userName: 'Daniela V.', userAvatar: 'DV', rating: 5, comment: 'El mejor café que he probado. Roberto es un maestro y la finca es preciosa.', visible: true, createdAt: '2024-10-20T00:00:00.000Z' },
            { id: 'rev007', experienceId: 4, userId: 'host001', userName: 'Juliana F.', userAvatar: 'JF', rating: 5, comment: 'Ver las ballenas jorobadas en el Pacífico fue la experiencia más emocionante de mi vida.', visible: true, createdAt: '2024-07-15T00:00:00.000Z' },
            { id: 'rev008', experienceId: 5, userId: 'user001', userName: 'Ricardo H.', userAvatar: 'RH', rating: 4, comment: 'Los frailejones del páramo son hipnotizantes. Andrés explicó muy bien el ciclo hídrico.', visible: true, createdAt: '2024-09-30T00:00:00.000Z' },
            { id: 'rev009', experienceId: 6, userId: 'admin001', userName: 'Paola N.', userAvatar: 'PN', rating: 5, comment: 'Kayak por los manglares de la Ciénaga Grande es una experiencia única. Pedro conoce cada rincón.', visible: true, createdAt: '2024-08-25T00:00:00.000Z' },
            { id: 'rev010', experienceId: 7, userId: 'user001', userName: 'Felipe G.', userAvatar: 'FG', rating: 5, comment: 'El glamping en Villa de Leyva fue perfecto. Dormir bajo las estrellas del desierto fue mágico.', visible: true, createdAt: '2024-10-10T00:00:00.000Z' },
            { id: 'rev011', experienceId: 8, userId: 'host001', userName: 'Isabella M.', userAvatar: 'IM', rating: 4, comment: 'Los termales son maravillosos. El ambiente natural es increíble y el masaje incluido fue perfecto.', visible: true, createdAt: '2024-09-12T00:00:00.000Z' }
        ]);

        // Seed demo bookings
        Storage.set('db_bookings', [{
            id: 'book001', userId: 'user001', userName: 'María García',
            experienceId: 3, experienceTitle: 'Café de origen en el Quindío',
            experienceImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
            experienceLocation: 'Armenia, Quindío', date: '2024-12-15', time: '08:00',
            guests: 2, pricePerPerson: 95000, totalPrice: 190000,
            status: 'confirmada', confirmationCode: 'ECO-CAFE0001',
            notes: '', hostName: 'Roberto Ospina', createdAt: '2024-11-20T10:30:00.000Z'
        }]);

        // Seed notifications
        Storage.set('db_notifications', [
            { id: 'notif001', userId: 'user001', type: 'sistema', title: '¡Bienvenido a EcoXperiencia!', message: 'Hola María, gracias por unirte. Explora nuestras experiencias ecoturísticas únicas en Colombia.', actionUrl: 'explorar.html', read: false, createdAt: '2024-02-01T08:00:00.000Z' },
            { id: 'notif002', userId: 'user001', type: 'reserva', title: '¡Reserva confirmada!', message: 'Tu reserva para "Café de origen en el Quindío" el 15 de diciembre está confirmada. Código: ECO-CAFE0001', actionUrl: 'perfil.html', read: false, createdAt: '2024-11-20T10:31:00.000Z' }
        ]);

        Storage.set('db_v2_initialized', true);
    }
};

// ═══════════════════════════════════════════════
// DATOS DE EXPERIENCIAS
// ═══════════════════════════════════════════════
const experiencesData = [
    {
        id: 1, hostId: 'host001',
        title: 'Amanecer en el Cocuy',
        location: 'Boyacá, Colombia',
        category: 'Senderismo', categoryId: 'hiking',
        price: 180000, rating: 4.9, reviews: 127,
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        featured: true,
        description: 'Vive la magia del amanecer en el Parque Nacional Natural del Cocuy. Nuestro anfitrión te guiará por senderos de alta montaña mientras el sol ilumina las cumbres nevadas. Una experiencia transformadora que te conectará con la majestuosidad de los Andes.',
        duration: '12 horas', maxPeople: 8, minPeople: 1,
        includes: ['Guía local experto', 'Transporte desde El Cocuy', 'Alimentación', 'Seguro de viaje'],
        notIncludes: ['Equipamiento personal', 'Ropa abrigada', 'Seguro médico personal'],
        requirements: ['Buena condición física', 'Edad mínima 14 años', 'Ropa cálida'],
        meetingPoint: 'Plaza central de El Cocuy, 5:00 AM',
        cancellationPolicy: 'flexible',
        host: { name: 'Carlos Martínez', avatar: 'CM', since: '2019', bio: 'Guía de montaña certificado con 10 años de experiencia en los Andes colombianos.' }
    },
    {
        id: 2, hostId: null,
        title: 'Kayak en el Amazonas',
        location: 'Leticia, Amazonas',
        category: 'Ríos y cascadas', categoryId: 'rivers',
        price: 250000, rating: 4.8, reviews: 89,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        featured: false,
        description: 'Rema por las aguas del río más caudaloso del mundo. Navega entre delfines rosados, observa guacamayas al atardecer y sumérgete en el pulmón del mundo con comunidades indígenas como guardianes de la selva.',
        duration: '8 horas', maxPeople: 6, minPeople: 2,
        includes: ['Equipo de kayak', 'Guía indígena', 'Refrigerio amazónico', 'Fotos de la experiencia'],
        notIncludes: ['Transporte hasta Leticia', 'Alojamiento', 'Propina para el guía'],
        requirements: ['Saber nadar', 'Llevar protector solar', 'Edad mínima 10 años'],
        meetingPoint: 'Muelle turístico de Leticia, 7:00 AM',
        cancellationPolicy: 'moderada',
        host: { name: 'Lucía Ticuna', avatar: 'LT', since: '2018', bio: 'Nacida y criada en la comunidad Ticuna, conecta viajeros con la sabiduría ancestral del Amazonas.' }
    },
    {
        id: 3, hostId: null,
        title: 'Café de origen en el Quindío',
        location: 'Armenia, Quindío',
        category: 'Agroturismo', categoryId: 'agrotourism',
        price: 95000, rating: 5.0, reviews: 203,
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
        featured: true,
        description: 'Desde la semilla hasta la taza, descubre el proceso del café más suave del mundo en una finca familiar del Eje Cafetero. Cosecha, despulpa, seca y degusta mientras aprendes de familias caficultoras de tercera generación.',
        duration: '6 horas', maxPeople: 12, minPeople: 1,
        includes: ['Recorrido por la finca', 'Degustación de cafés especiales', 'Almuerzo típico', 'Bolsa de café de regalo'],
        notIncludes: ['Transporte desde Armenia', 'Propinas', 'Artesanías adicionales'],
        requirements: ['Calzado cómodo', 'Ropa para actividades al aire libre'],
        meetingPoint: 'Finca El Roble, vereda La Paloma, Armenia',
        cancellationPolicy: 'flexible',
        host: { name: 'Roberto Ospina', avatar: 'RO', since: '2020', bio: 'Productor de café de tercera generación, apasionado por compartir el legado cafetero colombiano.' }
    },
    {
        id: 4, hostId: null,
        title: 'Ballenas en el Pacífico',
        location: 'Nuquí, Chocó',
        category: 'Avistamiento', categoryId: 'wildlife',
        price: 320000, rating: 4.9, reviews: 156,
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        featured: true,
        description: 'Desde junio hasta noviembre, las ballenas jorobadas llegan al Pacífico colombiano para dar a luz. Observa saltos, coletazos y el vientre lleno de vida en un espectáculo natural único mientras el sol se oculta en el océano.',
        duration: '4 horas', maxPeople: 10, minPeople: 2,
        includes: ['Transporte acuático', 'Guía biólogo marino', 'Hidratación', 'Charla de conservación'],
        notIncludes: ['Vuelo a Nuquí', 'Alojamiento', 'Equipo fotográfico'],
        requirements: ['No mareo marino severo', 'Crema solar biodegradable'],
        meetingPoint: 'Muelle de Nuquí, 7:30 AM',
        cancellationPolicy: 'moderada',
        host: { name: 'María Elena Becerra', avatar: 'MB', since: '2017', bio: 'Bióloga marina dedicada a la conservación de cetáceos en el Pacífico colombiano.' }
    },
    {
        id: 5, hostId: null,
        title: 'Páramo de Chingaza',
        location: 'Cundinamarca, Colombia',
        category: 'Alta montaña', categoryId: 'highmountain',
        price: 120000, rating: 4.7, reviews: 74,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        featured: false,
        description: 'Caminá entre frailejones gigantes en uno de los ecosistemas más importantes de Colombia. El Páramo de Chingaza suministra el 80% del agua de Bogotá y alberga especies endémicas que no encontrarás en ningún otro lugar del mundo.',
        duration: '10 horas', maxPeople: 15, minPeople: 2,
        includes: ['Guía especializado en páramos', 'Permiso de ingreso', 'Refrigerio ecológico', 'Charla de conservación'],
        notIncludes: ['Transporte desde Bogotá', 'Ropa impermeable', 'Equipo de senderismo'],
        requirements: ['Buena condición física', 'Ropa abrigada y impermeable', 'Botas de montaña'],
        meetingPoint: 'Entrada al PNN Chingaza, carretera La Calera',
        cancellationPolicy: 'flexible',
        host: { name: 'Andrés Gómez', avatar: 'AG', since: '2016', bio: 'Ecólogo especializado en ecosistemas de alta montaña y educación ambiental.' }
    },
    {
        id: 6, hostId: null,
        title: 'Ciénaga Grande',
        location: 'Magdalena, Colombia',
        category: 'Buceo', categoryId: 'diving',
        price: 145000, rating: 4.8, reviews: 92,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        featured: false,
        description: 'Explora los manglares de la Ciénaga Grande de Santa Marta en kayak. Este ecosistema único combina agua dulce y salada, creando un hábitat vital para peces, aves y el sustento de comunidades pesqueras ancestrales.',
        duration: '5 horas', maxPeople: 8, minPeople: 2,
        includes: ['Kayak y chaleco salvavidas', 'Guía local', 'Almuerzo con pescadores', 'Observación de aves'],
        notIncludes: ['Transporte a la ciénaga', 'Equipo fotográfico', 'Propinas'],
        requirements: ['Saber nadar básico', 'Protector solar', 'Ropa cómoda'],
        meetingPoint: 'Muelle de Tasajera, 6:30 AM',
        cancellationPolicy: 'flexible',
        host: { name: 'Pedro Zapata', avatar: 'PZ', since: '2018', bio: 'Pescador de la región convertido en guía, defensor de la conservación de los manglares.' }
    },
    {
        id: 7, hostId: null,
        title: 'Glamping en el Desierto',
        location: 'Villa de Leyva, Boyacá',
        category: 'Camping', categoryId: 'camping',
        price: 280000, rating: 4.9, reviews: 68,
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80',
        featured: true,
        description: 'Dormí bajo un manto de estrellas en el desierto de Villa de Leyva. Nuestras carpas de lujo tienen cama real, baño privado y una vista espectacular del cielo nocturno, libre de contaminación lumínica.',
        duration: '2 días / 1 noche', maxPeople: 4, minPeople: 1,
        includes: ['Carpa de lujo equipada', 'Cena bajo las estrellas', 'Desayuno campestre', 'Tour astronómico'],
        notIncludes: ['Transporte a Villa de Leyva', 'Almuerzo', 'Bebidas alcohólicas'],
        requirements: ['Ropa para clima frío nocturno', 'Linterna personal'],
        meetingPoint: 'Entrada al Desierto de la Candelaria, 3:00 PM',
        cancellationPolicy: 'moderada',
        host: { name: 'Catalina Rincón', avatar: 'CR', since: '2021', bio: 'Apasionada por el turismo sostenible y la vida al aire libre.' }
    },
    {
        id: 8, hostId: null,
        title: 'Termales de San Vicente',
        location: 'Santa Rosa de Cabal, Risaralda',
        category: 'Ríos y cascadas', categoryId: 'rivers',
        price: 110000, rating: 4.8, reviews: 145,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        featured: false,
        description: 'Sumérgete en aguas termales naturales en medio del bosque húmedo tropical. Un refugio de paz donde el vapor se mezcla con la vegetación exuberante y el sonido de las aves crea una sinfonía de relajación.',
        duration: '7 horas', maxPeople: 10, minPeople: 1,
        includes: ['Acceso a termales', 'Toalla y locker', 'Almuerzo típico', 'Masaje relajante'],
        notIncludes: ['Transporte desde Santa Rosa', 'Tratamientos adicionales', 'Fotos'],
        requirements: ['Traje de baño', 'Chanclas', 'Actitud relajada'],
        meetingPoint: 'Recepcíon Termales San Vicente, 9:00 AM',
        cancellationPolicy: 'flexible',
        host: { name: 'Diego Valencia', avatar: 'DV', since: '2019', bio: 'Guía de bienestar y terapeuta especializado en aguas termomedicinales.' }
    }
];

// ═══════════════════════════════════════════════
// TODAS LAS EXPERIENCIAS (estáticas + creadas por anfitriones)
// ═══════════════════════════════════════════════
const getAllExperiences = () => {
    const dbExps = DB.findAll('experiences');
    return [...experiencesData, ...dbExps];
};

// ═══════════════════════════════════════════════
// ICONOS SVG
// ═══════════════════════════════════════════════
const icons = {
    logo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C16 2 8 8 8 16C8 21 11 26 16 30C21 26 24 21 24 16C24 8 16 2 16 2Z" fill="currentColor" opacity="0.3"/><path d="M16 6C16 6 12 10 12 16C12 19 13.5 22 16 25C18.5 22 20 19 20 16C20 10 16 6 16 6Z" fill="currentColor"/><path d="M16 10C16 10 14 13 14 16C14 18 14.8 20 16 22C17.2 20 18 18 18 16C18 13 16 10 16 10Z" fill="currentColor" opacity="0.6"/></svg>`,
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    creditCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    fish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 010 20 14.5 14.5 0 010-20"/><path d="M2 12h20"/></svg>`,
    tent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/><path d="M12 22V8"/></svg>`,
    droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"/></svg>`,
    umbrella: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M12 2a9.94 9.94 0 018.84 5.5"/><path d="M12 2a9.94 9.94 0 00-8.84 5.5"/><path d="M12 14v6a2 2 0 004 0"/></svg>`
};

// ═══════════════════════════════════════════════
// AUTENTICACIÓN
// ═══════════════════════════════════════════════
const Auth = {
    getCurrentUser() {
        return Storage.get('currentUser');
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (role === 'admin') return user.role === 'admin';
        if (role === 'anfitrion') return user.role === 'anfitrion' || user.role === 'admin';
        return true;
    },

    register(userData) {
        const users = DB._table('users');

        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Este email ya está registrado' };
        }

        const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
        const newUser = DB.insert('users', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            avatar: initials,
            role: userData.role || 'viajero',
            phone: userData.phone || '',
            bio: '',
            emailVerified: false,
            status: 'activo'
        });

        const sessionUser = { ...newUser };
        delete sessionUser.password;
        Storage.set('currentUser', sessionUser);

        Notifications.create(newUser.id, 'sistema', '¡Bienvenido a EcoXperiencia!',
            `Hola ${newUser.name}, gracias por unirte. Explora nuestras experiencias ecoturísticas únicas en Colombia.`,
            'explorar.html'
        );

        return { success: true, user: sessionUser };
    },

    login(email, password) {
        const user = DB.findOne('users', u => u.email === email && u.password === password);

        if (!user) return { success: false, message: 'Email o contraseña incorrectos' };
        if (user.status !== 'activo') return { success: false, message: 'Tu cuenta está suspendida. Contacta soporte.' };

        DB.update('users', user.id, { lastLogin: new Date().toISOString() });

        const sessionUser = { ...user };
        delete sessionUser.password;
        Storage.set('currentUser', sessionUser);

        return { success: true, user: sessionUser };
    },

    logout() {
        Storage.remove('currentUser');
        window.location.href = 'index.html';
    },

    updateProfile(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false };

        const updated = DB.update('users', currentUser.id, userData);
        if (!updated) return { success: false };

        if (userData.name) {
            const newAvatar = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
            DB.update('users', currentUser.id, { avatar: newAvatar });
            updated.avatar = newAvatar;
        }

        const sessionUser = { ...updated };
        delete sessionUser.password;
        Storage.set('currentUser', sessionUser);

        return { success: true, user: sessionUser };
    },

    changePassword(currentPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'No autenticado' };

        const user = DB.findById('users', currentUser.id);
        if (!user || user.password !== currentPassword) {
            return { success: false, message: 'La contraseña actual es incorrecta' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
        }

        DB.update('users', user.id, { password: newPassword });
        return { success: true };
    }
};

// ═══════════════════════════════════════════════
// FAVORITOS (por usuario)
// ═══════════════════════════════════════════════
const Favorites = {
    _key() {
        const user = Auth.getCurrentUser();
        return user ? `favorites_${user.id}` : 'favorites_guest';
    },

    getAll() {
        return Storage.get(this._key()) || [];
    },

    add(experienceId) {
        const favorites = this.getAll();
        if (!favorites.includes(experienceId)) {
            favorites.push(experienceId);
            Storage.set(this._key(), favorites);
        }
        return favorites;
    },

    remove(experienceId) {
        const favorites = this.getAll().filter(id => id !== experienceId);
        Storage.set(this._key(), favorites);
        return favorites;
    },

    toggle(experienceId) {
        if (this.isFavorite(experienceId)) { this.remove(experienceId); return false; }
        else { this.add(experienceId); return true; }
    },

    isFavorite(experienceId) {
        return this.getAll().includes(experienceId);
    },

    getExperiences() {
        const ids = this.getAll();
        return getAllExperiences().filter(exp => ids.includes(exp.id));
    }
};

// ═══════════════════════════════════════════════
// RESERVAS
// ═══════════════════════════════════════════════
const Bookings = {
    _generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ECO-';
        for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    },

    create(data) {
        const user = Auth.getCurrentUser();
        if (!user) return { success: false, message: 'No autenticado' };

        const experience = getAllExperiences().find(e => String(e.id) === String(data.experienceId));
        if (!experience) return { success: false, message: 'Experiencia no encontrada' };

        const booking = DB.insert('bookings', {
            userId: user.id,
            userName: user.name,
            experienceId: data.experienceId,
            experienceTitle: experience.title,
            experienceImage: experience.image,
            experienceLocation: experience.location,
            date: data.date,
            time: data.time,
            guests: parseInt(data.guests),
            pricePerPerson: experience.price,
            totalPrice: experience.price * parseInt(data.guests),
            status: 'confirmada',
            confirmationCode: this._generateCode(),
            notes: data.notes || '',
            hostName: experience.host.name
        });

        Notifications.create(user.id, 'reserva', '¡Reserva confirmada!',
            `Tu reserva para "${experience.title}" el ${data.date} a las ${data.time} está confirmada. Código: ${booking.confirmationCode}`,
            'perfil.html'
        );

        return { success: true, booking };
    },

    getUserBookings() {
        const user = Auth.getCurrentUser();
        if (!user) return [];
        return DB.findAll('bookings', b => b.userId === user.id)
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getById(id) {
        return DB.findById('bookings', id);
    },

    cancel(id) {
        const user = Auth.getCurrentUser();
        const booking = DB.findById('bookings', id);

        if (!booking) return { success: false, message: 'Reserva no encontrada' };
        if (!user || booking.userId !== user.id) return { success: false, message: 'Sin permisos' };
        if (booking.status === 'cancelada') return { success: false, message: 'La reserva ya está cancelada' };

        const updated = DB.update('bookings', id, { status: 'cancelada', cancelledAt: new Date().toISOString() });

        Notifications.create(user.id, 'reserva', 'Reserva cancelada',
            `Tu reserva "${booking.experienceTitle}" para el ${booking.date} ha sido cancelada.`,
            'perfil.html'
        );

        return { success: true, booking: updated };
    },

    getHostBookings() {
        const user = Auth.getCurrentUser();
        if (!user) return [];
        const hostExperienceIds = getAllExperiences().filter(e => e.hostId === user.id).map(e => String(e.id));
        return DB.findAll('bookings', b => hostExperienceIds.includes(String(b.experienceId)))
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

// ═══════════════════════════════════════════════
// RESEÑAS
// ═══════════════════════════════════════════════
const Reviews = {
    create(data) {
        const user = Auth.getCurrentUser();
        if (!user) return { success: false, message: 'No autenticado' };

        const existing = DB.findOne('reviews', r => r.experienceId === data.experienceId && r.userId === user.id);
        if (existing) return { success: false, message: 'Ya has reseñado esta experiencia' };

        if (!data.rating || data.rating < 1 || data.rating > 5) return { success: false, message: 'Calificación inválida' };
        if (!data.comment || data.comment.trim().length < 10) return { success: false, message: 'El comentario debe tener al menos 10 caracteres' };

        const review = DB.insert('reviews', {
            experienceId: data.experienceId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            rating: parseInt(data.rating),
            comment: data.comment.trim(),
            visible: true
        });

        return { success: true, review };
    },

    getByExperience(experienceId) {
        return DB.findAll('reviews', r => r.experienceId === experienceId && r.visible)
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    hasReviewed(experienceId) {
        const user = Auth.getCurrentUser();
        if (!user) return false;
        return !!DB.findOne('reviews', r => r.experienceId === experienceId && r.userId === user.id);
    },

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Hoy';
        if (diff === 1) return 'Hace 1 día';
        if (diff < 7) return `Hace ${diff} días`;
        if (diff < 30) return `Hace ${Math.floor(diff / 7)} semana${Math.floor(diff / 7) > 1 ? 's' : ''}`;
        if (diff < 365) return `Hace ${Math.floor(diff / 30)} mes${Math.floor(diff / 30) > 1 ? 'es' : ''}`;
        return `Hace ${Math.floor(diff / 365)} año${Math.floor(diff / 365) > 1 ? 's' : ''}`;
    }
};

// ═══════════════════════════════════════════════
// NOTIFICACIONES
// ═══════════════════════════════════════════════
const Notifications = {
    create(userId, type, title, message, actionUrl) {
        return DB.insert('notifications', { userId, type, title, message, actionUrl: actionUrl || '', read: false });
    },

    getAll() {
        const user = Auth.getCurrentUser();
        if (!user) return [];
        return DB.findAll('notifications', n => n.userId === user.id)
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getUnreadCount() {
        const user = Auth.getCurrentUser();
        if (!user) return 0;
        return DB.findAll('notifications', n => n.userId === user.id && !n.read).length;
    },

    markAsRead(id) {
        return DB.update('notifications', id, { read: true });
    },

    markAllAsRead() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        DB.findAll('notifications', n => n.userId === user.id && !n.read)
          .forEach(n => DB.update('notifications', n.id, { read: true }));
    },

    typeIcon(type) {
        const map = { reserva: icons.calendar, sistema: icons.info, mensaje: icons.email, promocion: icons.star };
        return map[type] || icons.bell;
    }
};

// ═══════════════════════════════════════════════
// ANFITRIONES
// ═══════════════════════════════════════════════
const Host = {
    register(hostData) {
        const user = Auth.getCurrentUser();
        if (!user) return { success: false, message: 'No autenticado' };

        if (this.getProfile()) return { success: false, message: 'Ya estás registrado como anfitrión' };

        const host = DB.insert('hosts', { userId: user.id, ...hostData, verificationStatus: 'pendiente' });

        DB.update('users', user.id, { role: 'anfitrion' });
        const sessionUser = { ...user, role: 'anfitrion' };
        Storage.set('currentUser', sessionUser);

        Notifications.create(user.id, 'sistema', 'Solicitud de anfitrión recibida',
            'Tu solicitud para convertirte en anfitrión está en revisión. Te notificaremos en 2-3 días hábiles.',
            'dashboard-anfitrion.html'
        );

        return { success: true, host };
    },

    getProfile() {
        const user = Auth.getCurrentUser();
        if (!user) return null;
        return DB.findOne('hosts', h => h.userId === user.id);
    },

    getMyExperiences() {
        const user = Auth.getCurrentUser();
        if (!user) return [];
        return getAllExperiences().filter(e => e.hostId === user.id);
    },

    createExperience(data) {
        const user = Auth.getCurrentUser();
        if (!user) return { success: false, message: 'No autenticado' };
        if (!Auth.hasRole('anfitrion')) return { success: false, message: 'Se requiere rol de anfitrión' };
        if (!data.title || !data.description || !data.price || !data.location) {
            return { success: false, message: 'Completa todos los campos requeridos' };
        }
        const categoryMap = {
            hiking: 'Senderismo', wildlife: 'Avistamiento', camping: 'Camping',
            rivers: 'Ríos y cascadas', agrotourism: 'Agroturismo',
            highmountain: 'Alta montaña', diving: 'Buceo'
        };
        const exp = DB.insert('experiences', {
            hostId: user.id,
            title: data.title,
            location: data.location,
            category: categoryMap[data.categoryId] || data.categoryId,
            categoryId: data.categoryId,
            price: parseInt(data.price),
            rating: 0, reviews: 0, featured: false,
            image: data.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            description: data.description,
            duration: data.duration || '4 horas',
            maxPeople: parseInt(data.maxPeople) || 10,
            minPeople: parseInt(data.minPeople) || 1,
            includes: data.includes ? data.includes.split(',').map(s => s.trim()).filter(Boolean) : [],
            notIncludes: [],
            requirements: data.requirements ? data.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
            meetingPoint: data.meetingPoint || '',
            cancellationPolicy: data.cancellationPolicy || 'flexible',
            host: { name: user.name, avatar: user.avatar, since: new Date().getFullYear().toString(), bio: user.bio || '' }
        });
        return { success: true, experience: exp };
    }
};

// ═══════════════════════════════════════════════
// ADMINISTRACIÓN
// ═══════════════════════════════════════════════
const Admin = {
    getPendingHosts() {
        return DB.findAll('hosts', h => h.verificationStatus === 'pendiente')
            .map(h => { const u = DB.findById('users', h.userId); return { ...h, userName: u ? u.name : '—', userEmail: u ? u.email : '' }; });
    },

    getAllHosts() {
        return DB.findAll('hosts')
            .map(h => { const u = DB.findById('users', h.userId); return { ...h, userName: u ? u.name : '—', userEmail: u ? u.email : '' }; });
    },

    approveHost(hostId) {
        const host = DB.findById('hosts', hostId);
        if (!host) return { success: false, message: 'No encontrado' };
        DB.update('hosts', hostId, { verificationStatus: 'verificado', verificationDate: new Date().toISOString() });
        DB.update('users', host.userId, { role: 'anfitrion' });
        const cur = Auth.getCurrentUser();
        if (cur && cur.id === host.userId) Storage.set('currentUser', { ...cur, role: 'anfitrion' });
        Notifications.create(host.userId, 'sistema', '¡Solicitud aprobada!',
            'Tu solicitud para ser anfitrión ha sido aprobada. Ya puedes publicar y gestionar experiencias.',
            'dashboard-anfitrion.html');
        return { success: true };
    },

    rejectHost(hostId, reason) {
        const host = DB.findById('hosts', hostId);
        if (!host) return { success: false, message: 'No encontrado' };
        DB.update('hosts', hostId, { verificationStatus: 'rechazado', rejectionReason: reason || '' });
        Notifications.create(host.userId, 'sistema', 'Solicitud de anfitrión revisada',
            `Tu solicitud no fue aprobada${reason ? ': ' + reason : '. Puedes actualizar tu información e intentarlo nuevamente.'}`,
            'anfitrion.html');
        return { success: true };
    },

    getAllUsers() {
        return DB.findAll('users').map(u => { const c = { ...u }; delete c.password; return c; });
    },

    getAllBookings() {
        return DB.findAll('bookings').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

// ═══════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type) {
        type = type || 'success';
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? icons.success : (type === 'error' ? icons.error : icons.info)}</span>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════
const Modal = {
    show(title, message, buttons) {
        buttons = buttons || [];
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-icon">${icons.success}</div>
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    ${buttons.map(btn => `
                        <button class="${btn.class || 'btn-submit'}" ${btn.onClick ? `onclick="${btn.onClick}"` : ''}>
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close(overlay);
        });

        return overlay;
    },

    close(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    },

    confirm(title, message, onConfirm) {
        const overlay = this.show(title, message, [
            { text: 'Cancelar', class: 'btn-secondary', onClick: 'this.closest(\'.modal-overlay\').click()' },
            { text: 'Confirmar', class: 'btn-submit', onClick: '' }
        ]);

        overlay.querySelector('.btn-submit').addEventListener('click', () => {
            this.close(overlay);
            onConfirm();
        });

        return overlay;
    }
};

// ═══════════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ═══════════════════════════════════════════════
const Components = {
    navbar() {
        const user = Auth.getCurrentUser();
        const isLoggedIn = Auth.isLoggedIn();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const unreadCount = isLoggedIn ? Notifications.getUnreadCount() : 0;
        const isHost = user && (user.role === 'anfitrion' || user.role === 'admin');

        return `
            <nav class="navbar scrolled" role="navigation" aria-label="Navegación principal">
                <div class="container navbar-inner">
                    <a href="index.html" class="navbar-logo" aria-label="EcoXperiencia - Inicio">
                        <svg class="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M16 2C16 2 8 8 8 16C8 21 11 26 16 30C21 26 24 21 24 16C24 8 16 2 16 2Z" fill="currentColor" opacity="0.3"/>
                            <path d="M16 6C16 6 12 10 12 16C12 19 13.5 22 16 25C18.5 22 20 19 20 16C20 10 16 6 16 6Z" fill="currentColor"/>
                            <path d="M16 10C16 10 14 13 14 16C14 18 14.8 20 16 22C17.2 20 18 18 18 16C18 13 16 10 16 10Z" fill="currentColor" opacity="0.6"/>
                        </svg>
                        EcoXperiencia
                    </a>

                    <div class="navbar-nav">
                        <a href="explorar.html" class="nav-link ${currentPage === 'explorar.html' ? 'nav-link-active' : ''}">Explorar</a>
                        <a href="como-funciona.html" class="nav-link ${currentPage === 'como-funciona.html' ? 'nav-link-active' : ''}">Cómo funciona</a>
                        <a href="anfitrion.html" class="nav-link ${currentPage === 'anfitrion.html' ? 'nav-link-active' : ''}">Sé anfitrión</a>
                        ${isLoggedIn ? `
                            <a href="favoritos.html" class="nav-link ${currentPage === 'favoritos.html' ? 'nav-link-active' : ''}">Favoritos</a>
                            ${isHost ? `<a href="dashboard-anfitrion.html" class="nav-link ${currentPage === 'dashboard-anfitrion.html' ? 'nav-link-active' : ''}">Dashboard</a>` : ''}
                            ${user && user.role === 'admin' ? `<a href="admin.html" class="nav-link ${currentPage === 'admin.html' ? 'nav-link-active' : ''}" style="color: var(--color-earth);">Admin</a>` : ''}
                            <div class="nav-user" onclick="window.location.href='perfil.html'">
                                ${unreadCount > 0 ? `<span class="notif-badge">${unreadCount > 9 ? '9+' : unreadCount}</span>` : ''}
                                <span class="nav-user-name">${user.name.split(' ')[0]}</span>
                                <div class="nav-user-avatar">${user.avatar}</div>
                            </div>
                        ` : `
                            <a href="login.html" class="nav-link ${currentPage === 'login.html' ? 'nav-link-active' : ''}">Iniciar sesión</a>
                            <a href="registro.html" class="nav-cta ${currentPage === 'registro.html' ? 'nav-link-active' : ''}">Registrarse</a>
                        `}
                    </div>

                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú" aria-expanded="false">
                        <span></span><span></span><span></span>
                    </button>
                </div>

                <div class="mobile-menu" id="mobileMenu">
                    <a href="explorar.html" class="nav-link">Explorar</a>
                    <a href="como-funciona.html" class="nav-link">Cómo funciona</a>
                    <a href="anfitrion.html" class="nav-link">Sé anfitrión</a>
                    ${isLoggedIn ? `
                        <a href="favoritos.html" class="nav-link">Favoritos</a>
                        ${isHost ? `<a href="dashboard-anfitrion.html" class="nav-link">Dashboard</a>` : ''}
                        ${user && user.role === 'admin' ? `<a href="admin.html" class="nav-link">Panel Admin</a>` : ''}
                        <a href="perfil.html" class="nav-link">Mi Perfil ${unreadCount > 0 ? `<span class="notif-badge-mobile">${unreadCount}</span>` : ''}</a>
                    ` : `
                        <a href="login.html" class="nav-link">Iniciar sesión</a>
                        <a href="registro.html" class="nav-cta">Registrarse</a>
                    `}
                </div>
            </nav>
        `;
    },

    footer() {
        return `
            <footer class="footer" role="contentinfo">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <a href="index.html" class="footer-logo">
                                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M16 2C16 2 8 8 8 16C8 21 11 26 16 30C21 26 24 21 24 16C24 8 16 2 16 2Z" fill="currentColor" opacity="0.3"/>
                                    <path d="M16 6C16 6 12 10 12 16C12 19 13.5 22 16 25C18.5 22 20 19 20 16C20 10 16 6 16 6Z" fill="currentColor"/>
                                    <path d="M16 10C16 10 14 13 14 16C14 18 14.8 20 16 22C17.2 20 18 18 18 16C18 13 16 10 16 10Z" fill="currentColor" opacity="0.6"/>
                                </svg>
                                EcoXperiencia
                            </a>
                            <p class="footer-description">Conectamos viajeros con experiencias auténticas de ecoturismo en Colombia, impulsando el desarrollo de comunidades locales.</p>
                            <div class="footer-social">
                                <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram de EcoXperiencia">${icons.instagram}</a>
                                <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook de EcoXperiencia">${icons.facebook}</a>
                                <a href="https://tiktok.com" target="_blank" class="social-link" aria-label="TikTok de EcoXperiencia">${icons.tiktok}</a>
                            </div>
                        </div>
                        <div class="footer-column">
                            <h4>Explorar</h4>
                            <ul class="footer-links">
                                <li><a href="explorar.html" class="footer-link">Experiencias</a></li>
                                <li><a href="explorar.html" class="footer-link">Destinos</a></li>
                                <li><a href="explorar.html" class="footer-link">Categorías</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h4>Empresa</h4>
                            <ul class="footer-links">
                                <li><a href="index.html" class="footer-link">Sobre nosotros</a></li>
                                <li><a href="anfitrion.html" class="footer-link">Sé anfitrión</a></li>
                                <li><a href="#" class="footer-link">Blog</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h4>Legal</h4>
                            <ul class="footer-links">
                                <li><a href="legal.html" class="footer-link">Términos de uso</a></li>
                                <li><a href="legal.html" class="footer-link">Privacidad</a></li>
                                <li><a href="legal.html" class="footer-link">Cookies</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h4>Soporte</h4>
                            <ul class="footer-links">
                                <li><a href="soporte.html" class="footer-link">Centro de ayuda</a></li>
                                <li><a href="contacto.html" class="footer-link">Contacto</a></li>
                                <li><a href="soporte.html" class="footer-link">FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p class="footer-copyright">&copy; 2025 EcoXperiencia. Todos los derechos reservados.</p>
                        <div class="footer-badges">
                            <span class="footer-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                Turismo responsable
                            </span>
                            <span class="footer-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                                Pago seguro
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    },

    experienceCard(experience) {
        const isFav = Favorites.isFavorite(experience.id);
        return `
            <article class="experience-card fade-up" data-id="${experience.id}">
                <div class="card-image-wrap">
                    <img src="${experience.image}" alt="${experience.title}" loading="lazy">
                    <span class="badge-category">${experience.category}</span>
                    ${experience.featured ? `<span class="badge-featured">${icons.star} Destacado</span>` : ''}
                    <button class="btn-wishlist ${isFav ? 'active' : ''}" data-id="${experience.id}" aria-label="Guardar ${experience.title} en favoritos">
                        ${isFav ? icons.heartFilled : icons.heart}
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-location">${icons.location} ${experience.location}</div>
                    <h3 class="card-title">${experience.title}</h3>
                    <div class="card-rating">
                        <span class="stars" aria-hidden="true">${'★'.repeat(Math.floor(experience.rating))}</span>
                        <span>${experience.rating}</span>
                        <span class="reviews">(${experience.reviews} reseñas)</span>
                    </div>
                    <div class="card-price">Desde <strong>$${experience.price.toLocaleString('es-CO')} COP</strong> / persona</div>
                    <button class="btn-view" onclick="window.location.href='experiencia.html?id=${experience.id}'">Ver experiencia</button>
                </div>
            </article>
        `;
    },

    bookingCard(booking) {
        const statusMap = {
            confirmada: { label: 'Confirmada', class: 'status-confirmed' },
            cancelada: { label: 'Cancelada', class: 'status-cancelled' },
            completada: { label: 'Completada', class: 'status-completed' },
            pendiente: { label: 'Pendiente', class: 'status-pending' }
        };
        const status = statusMap[booking.status] || statusMap.pendiente;
        const formattedDate = new Date(booking.date + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formattedCreated = new Date(booking.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

        return `
            <div class="booking-item" data-id="${booking.id}">
                <div class="booking-item-image">
                    <img src="${booking.experienceImage}" alt="${booking.experienceTitle}" loading="lazy">
                </div>
                <div class="booking-item-info">
                    <div class="booking-item-header">
                        <h3>${booking.experienceTitle}</h3>
                        <span class="booking-status ${status.class}">${status.label}</span>
                    </div>
                    <p class="booking-item-location">${icons.mapPin} ${booking.experienceLocation}</p>
                    <div class="booking-item-details">
                        <span>${icons.calendar} ${formattedDate} · ${booking.time}</span>
                        <span>${icons.users} ${booking.guests} persona${booking.guests > 1 ? 's' : ''}</span>
                        <span>${icons.creditCard} $${booking.totalPrice.toLocaleString('es-CO')} COP</span>
                    </div>
                    <p class="booking-code">Código: <strong>${booking.confirmationCode}</strong> · Reservado el ${formattedCreated}</p>
                    <div class="booking-item-actions">
                        <button class="btn-view" onclick="window.location.href='experiencia.html?id=${booking.experienceId}'">Ver experiencia</button>
                        ${booking.status === 'confirmada' ? `<button class="btn-danger btn-cancel-booking" data-booking-id="${booking.id}">Cancelar</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    notificationItem(notification) {
        const typeIcon = Notifications.typeIcon(notification.type);
        const timeAgo = Reviews.formatDate(notification.createdAt);

        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon notif-type-${notification.type}">${typeIcon}</div>
                <div class="notification-content">
                    <p class="notification-title">${notification.title}</p>
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${timeAgo}</span>
                </div>
                ${notification.actionUrl ? `<a href="${notification.actionUrl}" class="notification-action">Ver</a>` : ''}
            </div>
        `;
    }
};

// ═══════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
    // Initialize database
    DB.init();

    // Render navbar and footer
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');

    if (navbarContainer) navbarContainer.innerHTML = Components.navbar();
    if (footerContainer) footerContainer.innerHTML = Components.footer();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', mobileMenuBtn.classList.contains('active'));
        });
    }

    // Fade up animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // Auto-observe fade-up elements added dynamically (fixes experience cards rendered via JS)
    const mutObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                const els = node.classList && node.classList.contains('fade-up') ? [node] : [];
                if (node.querySelectorAll) els.push(...node.querySelectorAll('.fade-up'));
                els.forEach(el => fadeObserver.observe(el));
            });
        });
    });
    mutObserver.observe(document.body, { childList: true, subtree: true });

    // Wishlist buttons
    document.addEventListener('click', function (e) {
        if (e.target.closest('.btn-wishlist')) {
            const btn = e.target.closest('.btn-wishlist');
            const experienceId = parseInt(btn.dataset.id);

            if (!Auth.isLoggedIn()) {
                Toast.show('Inicia sesión para guardar favoritos', 'error');
                setTimeout(() => window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href), 1500);
                return;
            }

            const isNowFav = Favorites.toggle(experienceId);
            btn.classList.toggle('active', isNowFav);
            btn.innerHTML = isNowFav ? icons.heartFilled : icons.heart;
            Toast.show(isNowFav ? 'Agregado a favoritos' : 'Eliminado de favoritos');
        }
    });

    // Stats counter animation
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsSection.querySelectorAll('.stat-number').forEach((stat, i) => animateCounter(stat, i * 200));
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
});

// ═══════════════════════════════════════════════
// FUNCIONES UTILITARIAS
// ═══════════════════════════════════════════════
function animateCounter(element, delay) {
    delay = delay || 0;
    setTimeout(() => {
        const target = parseFloat(element.dataset.count);
        const decimals = parseInt(element.dataset.decimals) || 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            element.textContent = decimals > 0
                ? current.toFixed(decimals)
                : '+' + Math.floor(current).toLocaleString('es-CO');

            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }, delay);
}

function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO') + ' COP';
}

function getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// ═══════════════════════════════════════════════
// EXPORTAR AL NAMESPACE GLOBAL
// ═══════════════════════════════════════════════
window.EcoXperiencia = {
    Auth,
    Favorites,
    Bookings,
    Reviews,
    Notifications,
    Host,
    Admin,
    DB,
    Storage,
    Toast,
    Modal,
    Components,
    experiencesData,
    getAllExperiences,
    icons,
    formatPrice,
    getUrlParam
};


// ═══════════════════════════════════════════════════════════════
// BACKEND INTEGRATION - Connects to real API on Render.com
// ═══════════════════════════════════════════════════════════════
const API_BASE_URL = 'https://ecoxperiencia.onrender.com';
const TOKEN_KEY = 'ecoxperiencia_token';

async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            Storage.remove('currentUser');
            return null;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Error ${response.status}`);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Override isLoggedIn to check real JWT token
window.EcoXperiencia.Auth.isLoggedIn = () => !!localStorage.getItem(TOKEN_KEY);

// Override logout to clear JWT
window.EcoXperiencia.Auth.logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    Storage.remove('currentUser');
    EcoXperiencia.Toast.show('Sesión cerrada correctamente');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};

// Async login that calls real backend
window.EcoXperiencia.Auth.loginAsync = async (email, password) => {
    try {
        const response = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (response && response.access_token) {
            localStorage.setItem(TOKEN_KEY, response.access_token);
            const user = await fetchAPI('/auth/me');
            if (user) {
                const fullName = user.nombreCompleto || user.nombre_completo || 'Usuario';
                const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
                Storage.set('currentUser', {
                    id: user.id,
                    name: fullName,
                    email: user.email,
                    avatar: initials,
                    role: (user.rol || 'VIAJERO').toLowerCase(),
                    emailVerified: user.emailVerificado,
                    status: (user.estado || 'ACTIVO').toLowerCase()
                });
            }
            return { success: true, user: Storage.get('currentUser') };
        }
        return { success: false, message: 'Error al iniciar sesión' };
    } catch (error) {
        return { success: false, message: error.message || 'Credenciales inválidas' };
    }
};

// Async register that calls real backend
window.EcoXperiencia.Auth.registerAsync = async (userData) => {
    try {
        const response = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                nombre_completo: userData.name,
                email: userData.email,
                password: userData.password
            })
        });
        if (response) {
            return { success: true };
        }
        return { success: false, message: 'Error al registrarse' };
    } catch (error) {
        return { success: false, message: error.message || 'Error al registrarse' };
    }
};
