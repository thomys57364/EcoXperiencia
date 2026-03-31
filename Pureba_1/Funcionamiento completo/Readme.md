# 🏗️ 1. ARQUITECTURA GENERAL

## Estructura de archivos

```
ecoxperiencia/
  ├── Páginas HTML (13 archivos) → Cada una es independiente
  ├── css/styles.css → Un solo archivo con todos los estilos
  └── js/app.js → Lógica central compartida por todas las páginas
```
## Cómo funciona la carga

Cada página HTML tiene:
  1. Navbar y Footer dinámicos → Se inyectan mediante JavaScript al cargar
  2. Componentes compartidos → Cards de experiencias, botones, iconos SVG
  3. Datos en memoria → Array experiencesData con 8 experiencias de ejemplo

# 🔐 2. SISTEMA DE AUTENTICACIÓN (localStorage)

## Módulo Auth
```
 // Guardado en localStorage:
 // - ecoxperiencia_users → Array de usuarios registrados
 // - ecoxperiencia_currentUser → Usuario logueado actual
```
## Funciones principales:

- Auth.register({name, email, password}) → Crea usuario, valida email único
- Auth.login(email, password) → Valida credenciales, guarda sesión
- Auth.logout() → Elimina sesión, redirige a home
- Auth.getCurrentUser() → Retorna usuario activo o null

## Flujo

  1. En registro.html → El formulario valida contraseñas, términos, crea usuario
  2. En login.html → Valida contra el array de usuarios guardados
  3. Al loguearse → Redirige a perfil.html o a la página que intentaba visitar
  
## Restricciones por login 
```
  // En favoritos.html y perfil.html:
  if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
  }
```
# ❤️ 3. SISTEMA DE FAVORITOS

## Módulo Favorites
```
  // Guardado en localStorage:
  // - ecoxperiencia_favorites → Array de IDs [1, 3, 7]
```
## Funciones:
  - Favorites.toggle(id) → Agrega/quita de favoritos
  - Favorites.isFavorite(id) → Boolean para UI (corazón lleno/vacío)
  - Favorites.getExperiences() → Retorna objetos completos de experiencias favoritas

## Comportamiento en UI:
  - Botón corazón en cada card → Cambia color si está guardado
  - Si usuario no logueado hace clic → Toast "Inicia sesión" → Redirige a login
  - En favoritos.html → Muestra mensaje vacío si no hay favoritos

# 🔍 4. BÚSQUEDA Y FILTROS

## En index.html (Hero)
```
  // Captura destino, fecha, personas
  // Construye URL: explorar.html?q=amazonas&date=2024-03-15&guests=2
  window.location.href = 'explorar.html?' + params.toString();
```
  En explorar.html (Filtros avanzados)

## Parámetros URL soportados:
  - ?category=hiking → Filtra por categoría
  - ?q=amazonas → Búsqueda por texto en título/descripción
  - ?price=200000 → Precio máximo
  - ?location=boyaca → Por ubicación

## Filtros de UI:
  - Select de categoría (8 opciones)
  - Select de precio máximo
  - Input de ubicación
  - Input de búsqueda general

## Función applyFilters():
```
  // Filtra el array experiencesData según criterios
  // Muestra resultados o mensaje "No se encontraron experiencias"
```
# 📄 5. DETALLE DE EXPERIENCIA

  URL: experiencia.html?id=3

## Proceso:
  1. Lee parámetro id de la URL
  2. Busca en experiencesData la experiencia correspondiente
  3. Si no existe → Redirige a 404.html
  4. Si existe → Renderiza toda la información

## Datos mostrados:
  - Galería de imágenes (1 principal + 4 thumbs)
  - Título, categoría, ubicación, rating, reseñas
  - Descripción completa
  - Lista "Lo que incluye" (checkmarks)
  - Info del anfitrión (avatar, nombre, bio)

## Sistema de reservas (simulado):
  - Selección de fecha (min = hoy)
  - Selección de horario
  - Número de personas
  - Cálculo automático del total: precio × personas
  - Botón "Reservar ahora" → Si logueado: Modal confirmación, Si no: Redirige a login

# 🧩 6. COMPONENTES REUTILIZABLES

## Components.navbar()

  - Detecta si hay usuario logueado
  - Muestra nombre + avatar o botones Login/Registro
  - Marca página activa con clase nav-link-active
  - Incluye menú hamburguesa para móvil

## Components.footer()

  - 4 columnas: Explorar, Empresa, Legal, Soporte
  - Links sociales (Instagram, Facebook, TikTok)
  - Badges de "Turismo responsable" y "Pago seguro"

## Components.experienceCard(exp)
```
  Genera HTML completo de una card:
  <article class="experience-card">
    <div class="card-image-wrap">
      <img src="...">
      <span class="badge-category">Senderismo</span>
      <button class="btn-wishlist">♡</button> <!-- Si es favorito: ♥ rojo -->
    </div>
    <div class="card-body">
      <div class="card-location">Boyacá, Colombia</div>
      <h3 class="card-title">Amanecer en el Cocuy</h3>
      <div class="card-rating">★★★★★ 4.9 (127 reseñas)</div>
      <div class="card-price">Desde $180.000 COP / persona</div>
      <button class="btn-view">Ver experiencia</button>
    </div>
  </article>
```
# 🔔 7. NOTIFICACIONES Y MODALES

## Toast notifications
```
  Toast.show('Mensaje', 'success'); // Verde, auto-cierra en 3s
  Toast.show('Error', 'error');     // Rojo
  Aparece abajo a la derecha, slide-in animation.
```
## Modales
```
  Modal.show('Título', 'Mensaje', [
    {text: 'Cancelar', class: 'btn-secondary', onClick: '...'},
    {text: 'Confirmar', class: 'btn-submit', onClick: '...'}
  ]);
```
### Usado para:
  - Confirmar reservas
  - Mensajes de éxito (contacto enviado, etc.)
  - Advertencias (funcionalidad próxima)

# 📊 8. DATOS DE LAS EXPERIENCIAS

## Estructura de cada experiencia:
```
  {
    id: 1,
    title: "Amanecer en el Cocuy",
    location: "Boyacá, Colombia",
    category: "Senderismo",
    categoryId: "hiking",
    price: 180000,
    rating: 4.9,
    reviews: 127,
    image: "URL unsplash",
    featured: true,
    description: "Texto largo...",
    duration: "12 horas",
    maxPeople: 8,
    includes: ["Guía local", "Transporte", "Alimentación"],
    host: {
      name: "Carlos Martínez",
      avatar: "CM",
      since: "2019",
      bio: "Guía de montaña..."
    }
  }
```
  Hay 8 experiencias pre-cargadas con datos realistas (precios en COP, ubicaciones reales de Colombia).

# 📱 9. FLUJOS DE USUARIO

## Flujo 1: Visitante sin cuenta

  1. Llega a index.html → Ve hero, experiencias destacadas
  2. Hace clic en "Guardar favorito" → Toast "Inicia sesión" → Redirige a login.html?redirect=...
  3. Desde login puede ir a registro
  4. Después de registro → perfil.html

## Flujo 2: Búsqueda

  1. En hero escribe "Amazonas" → Submit
  2. Redirige a explorar.html?q=amazonas
  3. Aplica filtros adicionales (precio, categoría)
  4. Clic en card → experiencia.html?id=2
  5. Ve detalles, reserva o guarda favorito

## Flujo 3: Anfitrión

  1. Va a anfitrion.html
  2. Lee beneficios y pasos
  3. Clic "Comenzar ahora"
  4. Si no logueado → registro
  5. Si logueado → Modal "Próximamente"

# 🔒 10. SEGURIDAD (Front-end)

  - Validación de formularios antes de enviar
  - Sanitización de inputs (trim en emails/nombres)
  - Contraseñas mínimo 6 caracteres
  - Confirmación de contraseñas iguales
  - Fecha mínima = hoy (no permite reservas pasadas)
  - Redirección si intenta acceder a páginas protegidas

# 🎨 11. ESTILOS Y RESPONSIVE

## Breakpoints:

  - Mobile: < 768px (menú hamburguesa, grid 1 columna)
  - Tablet: 768px - 991px (grid 2 columnas)
  - Desktop: > 992px (grid 3 columnas, menú horizontal)

## Variables CSS:

  - Colores: --color-moss, --color-lime, --color-earth
  - Tipografías: --font-display (Playfair), --font-body (DM Sans)
  - Espaciado: --space-1 a --space-20
  - Sombras y transiciones predefinidas

# 🚀 CÓMO PROBAR

  1. Abre https://ecoxperiencia.netlify.app
  2. Regístrate con email ficticio
  3. Explora las experiencias, usa filtros
  4. Guarda favoritos (requiere login)
  5. Reserva una experiencia
  6. Cierra sesión desde el perfil
