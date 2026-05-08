# Guía de Integración Frontend - API

## URL Base

```
Desarrollo: http://localhost:3000
Producción: http://localhost/api (con nginx proxy)
```

## Autenticación

### Login

```javascript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'password123'
  })
});

const data = await response.json();
// Guardar token: data.accessToken
```

### Usar token en requests

```javascript
const response = await fetch('http://localhost:3000/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Endpoints principales

### Experiencias

```javascript
// Listar experiencias
GET /experiences

// Ver detalle
GET /experiences/:slug

// Buscar con filtros
GET /experiences?category=hiking&minPrice=100000&location=Boyacá

// Crear (requiere auth de anfitrión)
POST /experiences
```

### Reservas

```javascript
// Crear reserva
POST /bookings
{
  "experienciaId": "uuid",
  "fechaExperiencia": "2025-06-15",
  "horario": "08:00",
  "personas": 2,
  "notas": "Opcional"
}

// Ver mis reservas
GET /bookings

// Cancelar
PUT /bookings/:id/cancel
```

### Favoritos

```javascript
// Agregar a favoritos
POST /favorites/:experienceId

// Ver favoritos
GET /favorites

// Eliminar de favoritos
DELETE /favorites/:experienceId

// Verificar si es favorito
GET /favorites/check/:experienceId
```

## Ejemplo completo: Integración con el frontend actual

```javascript
// api.js - Cliente API
const API_URL = 'http://localhost:3000';

class EcoXperienciaAPI {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
      return;
    }

    return response.json();
  }

  // Auth
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Experiences
  getExperiences(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/experiences?${params}`);
  }

  getExperience(slug) {
    return this.request(`/experiences/${slug}`);
  }

  // Favorites
  getFavorites() {
    return this.request('/favorites');
  }

  addFavorite(experienceId) {
    return this.request(`/favorites/${experienceId}`, { method: 'POST' });
  }

  removeFavorite(experienceId) {
    return this.request(`/favorites/${experienceId}`, { method: 'DELETE' });
  }
}

const api = new EcoXperienciaAPI();

// Uso en el frontend
async function loadExperiences() {
  const { data, meta } = await api.getExperiences({
    category: 'hiking',
    page: 1,
    limit: 12
  });
  
  // Renderizar experiencias...
}
```

## Migración desde LocalStorage

### Antes (LocalStorage)

```javascript
// auth
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('favorites', JSON.stringify(favorites));

// experiences hardcoded
const experiences = [...]; // Datos en app.js
```

### Después (API)

```javascript
// auth
const { user, accessToken } = await api.login(credentials);
localStorage.setItem('token', accessToken);

// favorites desde API
const favorites = await api.getFavorites();

// experiences desde API
const experiences = await api.getExperiences();
```

## Códigos de error comunes

| Código | Significado |
|--------|-------------|
| 400 | Datos inválidos |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: email ya existe) |
| 429 | Rate limit excedido |
| 500 | Error del servidor |

## WebSocket (próximamente)

Para notificaciones en tiempo real:

```javascript
const ws = new WebSocket('ws://localhost:3000/notifications');
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  showToast(notification);
};
```
