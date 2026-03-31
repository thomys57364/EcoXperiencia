/**
 * EcoXperiencia - JavaScript principal
 * Funcionalidades: Auth, Favoritos, Búsqueda, UI
 */

// ═══════════════════════════════════════════════
// DATOS DE EXPERIENCIAS
// ═══════════════════════════════════════════════
const experiencesData = [
    {
        id: 1,
        title: "Amanecer en el Cocuy",
        location: "Boyacá, Colombia",
        category: "Senderismo",
        categoryId: "hiking",
        price: 180000,
        rating: 4.9,
        reviews: 127,
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        featured: true,
        description: "Vive la magia del amanecer en el Parque Nacional Natural del Cocuy. Nuestro anfitrión te guiará por senderos de alta montaña mientras el sol ilumina las cumbres nevadas. Una experiencia transformadora que te conectará con la majestuosidad de los Andes.",
        duration: "12 horas",
        maxPeople: 8,
        includes: ["Guía local experto", "Transporte desde El Cocuy", "Alimentación", "Seguro de viaje"],
        host: {
            name: "Carlos Martínez",
            avatar: "CM",
            since: "2019",
            bio: "Guía de montaña certificado con 10 años de experiencia en los Andes colombianos."
        }
    },
    {
        id: 2,
        title: "Kayak en el Amazonas",
        location: "Leticia, Amazonas",
        category: "Ríos y cascadas",
        categoryId: "rivers",
        price: 250000,
        rating: 4.8,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        featured: false,
        description: "Rema por las aguas del río más caudaloso del mundo. Navega entre delfines rosados, observa guacamayas al atardecer y sumérgete en el pulmón del mundo con comunidades indígenas como guardianes de la selva.",
        duration: "8 horas",
        maxPeople: 6,
        includes: ["Equipo de kayak", "Guía indígena", "Refrigerio amazónico", "Fotos de la experiencia"],
        host: {
            name: "Lucía Ticuna",
            avatar: "LT",
            since: "2018",
            bio: "Nacida y criada en la comunidad Ticuna, conecta viajeros con la sabiduría ancestral del Amazonas."
        }
    },
    {
        id: 3,
        title: "Café de origen en el Quindío",
        location: "Armenia, Quindío",
        category: "Agroturismo",
        categoryId: "agrotourism",
        price: 95000,
        rating: 5.0,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        featured: true,
        description: "Desde la semilla hasta la taza, descubre el proceso del café más suave del mundo en una finca familiar del Eje Cafetero. Cosecha, despulpa, seca y degusta mientras aprendes de familias caficultoras de tercera generación.",
        duration: "6 horas",
        maxPeople: 12,
        includes: ["Recorrido por la finca", "Degustación de cafés especiales", "Almuerzo típico", "Bolsa de café de regalo"],
        host: {
            name: "Roberto Ospina",
            avatar: "RO",
            since: "2020",
            bio: "Productor de café de tercera generación, apasionado por compartir el legado cafetero colombiano."
        }
    },
    {
        id: 4,
        title: "Ballenas en el Pacífico",
        location: "Nuquí, Chocó",
        category: "Avistamiento",
        categoryId: "wildlife",
        price: 320000,
        rating: 4.9,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        featured: true,
        description: "Desde junio hasta noviembre, las ballenas jorobadas llegan al Pacífico colombiano para dar a luz. Observa saltos, coletazos y el vientre lleno de vida en un espectáculo natural único mientras el sol se oculta en el océano.",
        duration: "4 horas",
        maxPeople: 10,
        includes: ["Transporte acuático", "Guía biólogo marino", "Hidratación", "Charla de conservación"],
        host: {
            name: "María Elena Becerra",
            avatar: "MB",
            since: "2017",
            bio: "Bióloga marina dedicada a la conservación de cetáceos en el Pacífico colombiano."
        }
    },
    {
        id: 5,
        title: "Páramo de Chingaza",
        location: "Cundinamarca, Colombia",
        category: "Alta montaña",
        categoryId: "highmountain",
        price: 120000,
        rating: 4.7,
        reviews: 74,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        featured: false,
        description: "Caminá entre frailejones gigantes en uno de los ecosistemas más importantes de Colombia. El Páramo de Chingaza suministra el 80% del agua de Bogotá y alberga especies endémicas que no encontrarás en ningún otro lugar del mundo.",
        duration: "10 horas",
        maxPeople: 15,
        includes: ["Guía especializado en páramos", "Permiso de ingreso", "Refrigerio ecológico", "Charla de conservación"],
        host: {
            name: "Andrés Gómez",
            avatar: "AG",
            since: "2016",
            bio: "Ecólogo especializado en ecosistemas de alta montaña y educación ambiental."
        }
    },
    {
        id: 6,
        title: "Ciénaga Grande",
        location: "Magdalena, Colombia",
        category: "Buceo",
        categoryId: "diving",
        price: 145000,
        rating: 4.8,
        reviews: 92,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        featured: false,
        description: "Explora los manglares de la Ciénaga Grande de Santa Marta en kayak. Este ecosistema único combina agua dulce y salada, creando un hábitat vital para peces, aves y el sustento de comunidades pesqueras ancestrales.",
        duration: "5 horas",
        maxPeople: 8,
        includes: ["Kayak y chaleco salvavidas", "Guía local", "Almuerzo con pescadores", "Observación de aves"],
        host: {
            name: "Pedro Zapata",
            avatar: "PZ",
            since: "2018",
            bio: "Pescador de la región convertido en guía, defensor de la conservación de los manglares."
        }
    },
    {
        id: 7,
        title: "Glamping en el Desierto",
        location: "Villa de Leyva, Boyacá",
        category: "Camping",
        categoryId: "camping",
        price: 280000,
        rating: 4.9,
        reviews: 68,
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
        featured: true,
        description: "Dormí bajo un manto de estrellas en el desierto de Villa de Leyva. Nuestras carpas de lujo tienen cama real, baño privado y una vista espectacular del cielo nocturno, libre de contaminación lumínica.",
        duration: "2 días / 1 noche",
        maxPeople: 4,
        includes: ["Carpa de lujo equipada", "Cena bajo las estrellas", "Desayuno campestre", "Tour astronómico"],
        host: {
            name: "Catalina Rincón",
            avatar: "CR",
            since: "2021",
            bio: "Apasionada por el turismo sostenible y la vida al aire libre."
        }
    },
    {
        id: 8,
        title: "Termales de San Vicente",
        location: "Santa Rosa de Cabal, Risaralda",
        category: "Ríos y cascadas",
        categoryId: "rivers",
        price: 110000,
        rating: 4.8,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        featured: false,
        description: "Sumérgete en aguas termales naturales en medio del bosque húmedo tropical. Un refugio de paz donde el vapor se mezcla con la vegetación exuberante y el sonido de las aves crea una sinfonía de relajación.",
        duration: "7 horas",
        maxPeople: 10,
        includes: ["Acceso a termales", "Toalla y locker", "Almuerzo típico", "Masaje relajante"],
        host: {
            name: "Diego Valencia",
            avatar: "DV",
            since: "2019",
            bio: "Guía de bienestar y terapeuta especializado en aguas termomedicinales."
        }
    }
];

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
    leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 22l2-9h16l2 9"/><path d="M4 13V9a4 4 0 014-4h8a4 4 0 014 4v4"/><path d="M12 5V3"/></svg>`,
    fish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 010 20 14.5 14.5 0 010-20"/><path d="M2 12h20"/></svg>`,
    tent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/><path d="M12 22V8"/></svg>`,
    droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"/></svg>`,
    umbrella: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M12 2a9.94 9.94 0 018.84 5.5"/><path d="M12 2a9.94 9.94 0 00-8.84 5.5"/><path d="M12 14v6a2 2 0 004 0"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

// ═══════════════════════════════════════════════
// LOCALSTORAGE UTILITIES
// ═══════════════════════════════════════════════
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(`ecoxperiencia_${key}`));
        } catch {
            return null;
        }
    },
    set(key, value) {
        localStorage.setItem(`ecoxperiencia_${key}`, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(`ecoxperiencia_${key}`);
    }
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

    register(userData) {
        const users = Storage.get('users') || [];

        // Verificar si el email ya existe
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Este email ya está registrado' };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // En producción: hashear
            createdAt: new Date().toISOString(),
            avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        };

        users.push(newUser);
        Storage.set('users', users);
        Storage.set('currentUser', newUser);

        return { success: true, user: newUser };
    },

    login(email, password) {
        const users = Storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Email o contraseña incorrectos' };
        }

        Storage.set('currentUser', user);
        return { success: true, user };
    },

    logout() {
        Storage.remove('currentUser');
        window.location.href = 'index.html';
    },

    updateProfile(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false };

        const users = Storage.get('users') || [];
        const index = users.findIndex(u => u.id === currentUser.id);

        if (index === -1) return { success: false };

        const updatedUser = { ...users[index], ...userData };
        users[index] = updatedUser;

        Storage.set('users', users);
        Storage.set('currentUser', updatedUser);

        return { success: true, user: updatedUser };
    }
};

// ═══════════════════════════════════════════════
// FAVORITOS
// ═══════════════════════════════════════════════
const Favorites = {
    getAll() {
        return Storage.get('favorites') || [];
    },

    add(experienceId) {
        const favorites = this.getAll();
        if (!favorites.includes(experienceId)) {
            favorites.push(experienceId);
            Storage.set('favorites', favorites);
        }
        return favorites;
    },

    remove(experienceId) {
        const favorites = this.getAll().filter(id => id !== experienceId);
        Storage.set('favorites', favorites);
        return favorites;
    },

    toggle(experienceId) {
        if (this.isFavorite(experienceId)) {
            this.remove(experienceId);
            return false;
        } else {
            this.add(experienceId);
            return true;
        }
    },

    isFavorite(experienceId) {
        return this.getAll().includes(experienceId);
    },

    getExperiences() {
        const favoriteIds = this.getAll();
        return experiencesData.filter(exp => favoriteIds.includes(exp.id));
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

    show(message, type = 'success') {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? icons.success : icons.error}</span>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════
const Modal = {
    show(title, message, buttons = []) {
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

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close(overlay);
            }
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

        const confirmBtn = overlay.querySelector('.btn-submit');
        confirmBtn.addEventListener('click', () => {
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
                            <div class="nav-user" onclick="window.location.href='perfil.html'">
                                <span class="nav-user-name">${user.name}</span>
                                <div class="nav-user-avatar">${user.avatar}</div>
                            </div>
                        ` : `
                            <a href="login.html" class="nav-link ${currentPage === 'login.html' ? 'nav-link-active' : ''}">Iniciar sesión</a>
                            <a href="registro.html" class="nav-cta ${currentPage === 'registro.html' ? 'nav-link-active' : ''}">Registrarse</a>
                        `}
                    </div>

                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <!-- Mobile Menu -->
                <div class="mobile-menu" id="mobileMenu">
                    <a href="explorar.html" class="nav-link">Explorar</a>
                    <a href="como-funciona.html" class="nav-link">Cómo funciona</a>
                    <a href="anfitrion.html" class="nav-link">Sé anfitrión</a>
                    ${isLoggedIn ? `
                        <a href="favoritos.html" class="nav-link">Favoritos</a>
                        <a href="perfil.html" class="nav-link">Mi Perfil</a>
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
                                <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram de EcoXperiencia">
                                    ${icons.instagram}
                                </a>
                                <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook de EcoXperiencia">
                                    ${icons.facebook}
                                </a>
                                <a href="https://tiktok.com" target="_blank" class="social-link" aria-label="TikTok de EcoXperiencia">
                                    ${icons.tiktok}
                                </a>
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
                        <p class="footer-copyright">&copy; 2024 EcoXperiencia. Todos los derechos reservados.</p>
                        <div class="footer-badges">
                            <span class="footer-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                Turismo responsable
                            </span>
                            <span class="footer-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                                    <path d="M2 10h20"/>
                                </svg>
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
                    ${experience.featured ? `
                        <span class="badge-featured">
                            ${icons.star}
                            Destacado
                        </span>
                    ` : ''}
                    <button class="btn-wishlist ${isFav ? 'active' : ''}" data-id="${experience.id}" aria-label="Guardar ${experience.title} en favoritos">
                        ${isFav ? icons.heartFilled : icons.heart}
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-location">
                        ${icons.location}
                        ${experience.location}
                    </div>
                    <h3 class="card-title">${experience.title}</h3>
                    <div class="card-rating">
                        <span class="stars" aria-hidden="true">${'★'.repeat(Math.floor(experience.rating))}</span>
                        <span>${experience.rating}</span>
                        <span class="reviews">(${experience.reviews} reseñas)</span>
                    </div>
                    <div class="card-price">
                        Desde <strong>$${experience.price.toLocaleString('es-CO')} COP</strong> / persona
                    </div>
                    <button class="btn-view" onclick="window.location.href='experiencia.html?id=${experience.id}'">Ver experiencia</button>
                </div>
            </article>
        `;
    }
};

// ═══════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
    // Insertar navbar y footer
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');

    if (navbarContainer) {
        navbarContainer.innerHTML = Components.navbar();
    }

    if (footerContainer) {
        footerContainer.innerHTML = Components.footer();
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Fade up animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Wishlist buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-wishlist')) {
            const btn = e.target.closest('.btn-wishlist');
            const experienceId = parseInt(btn.dataset.id);

            if (!Auth.isLoggedIn()) {
                Toast.show('Inicia sesión para guardar favoritos', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                }, 1500);
                return;
            }

            const isNowFavorite = Favorites.toggle(experienceId);
            btn.classList.toggle('active', isNowFavorite);
            btn.innerHTML = isNowFavorite ? icons.heartFilled : icons.heart;

            Toast.show(isNowFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos');
        }
    });

    // Navbar scroll effect (solo en páginas que no tengan hero)
    const navbar = document.getElementById('navbar');
    if (navbar && !document.querySelector('.hero')) {
        navbar.classList.add('scrolled');
    }

    // Stats counter animation
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statNumbers = statsSection.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach((stat, index) => {
                        animateCounter(stat, index * 200);
                    });
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }
});

// Animate counter function
function animateCounter(element, delay = 0) {
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

            if (decimals > 0) {
                element.textContent = current.toFixed(decimals);
            } else {
                element.textContent = '+' + Math.floor(current).toLocaleString('es-CO');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }, delay);
}

// Format price
function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO') + ' COP';
}

// Get URL parameter
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Export modules for use in other scripts
window.EcoXperiencia = {
    Auth,
    Favorites,
    Toast,
    Modal,
    Storage,
    experiencesData,
    icons,
    formatPrice,
    getUrlParam
};
