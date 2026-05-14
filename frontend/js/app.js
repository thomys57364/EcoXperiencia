/* ============================================================================
   ECOXPERIENCIA - MAIN APPLICATION
   Frontend Logic - Auth, Favorites, Experiences, Bookings
   ============================================================================ */

// Configuration
// IMPORTANTE: Cambia esta URL a tu dominio de Railway después de desplegar el backend
// Ejemplo: const API_BASE_URL = 'https://ecoxperiencia-backend-production.up.railway.app';
const API_BASE_URL = 'https://ecoxperiencia.onrender.com';
const TOKEN_KEY = 'ecoxperiencia_token';
const CURRENT_USER_KEY = 'ecoxperiencia_currentUser';
const FAVORITES_KEY = 'ecoxperiencia_favorites';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Make API requests with authentication
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 - Token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      Toast.show('Sesión expirada. Por favor, inicia sesión de nuevo.', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

const Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toast-container') || this._createContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">×</button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.remove();
    }, 4000);
  },

  _createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  },
};

// ============================================================================
// MODAL
// ============================================================================

const Modal = {
  show(title, message, buttons = []) {
    const overlay = document.getElementById('modal-overlay') || this._createModal();
    overlay.classList.add('active');
    
    const modal = overlay.querySelector('.modal');
    modal.innerHTML = `
      <button class="modal-close">×</button>
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
      </div>
      <div class="modal-body">${message}</div>
      <div class="modal-footer"></div>
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
    
    const footer = modal.querySelector('.modal-footer');
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.text;
      button.className = btn.class || 'btn btn-secondary';
      button.addEventListener('click', () => {
        if (btn.onClick) btn.onClick();
        overlay.classList.remove('active');
      });
      footer.appendChild(button);
    });
  },

  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  },

  _createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal"></div>';
    document.body.appendChild(overlay);
    return overlay;
  },
};

// ============================================================================
// AUTH MODULE
// ============================================================================

const Auth = {
  async register(name, email, password) {
    try {
      const response = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre_completo: name, email, password }),
      });

      if (response) {
        Toast.show('Registro exitoso. Por favor, inicia sesión.', 'success');
        return true;
      }
    } catch (error) {
      Toast.show(error.message || 'Error en el registro', 'error');
      return false;
    }
  },

  async login(email, password) {
    try {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response && response.access_token) {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        
        // Get current user info
        const user = await this.getCurrentUser();
        if (user) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          Toast.show('Sesión iniciada correctamente.', 'success');
          return true;
        }
      }
    } catch (error) {
      Toast.show(error.message || 'Error en el inicio de sesión', 'error');
      return false;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(FAVORITES_KEY);
    Toast.show('Sesión cerrada.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  },

  async getCurrentUser() {
    try {
      const user = await fetchAPI('/auth/me');
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUserData() {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
};

// ============================================================================
// FAVORITES MODULE
// ============================================================================

const Favorites = {
  async toggle(experienceId) {
    if (!Auth.isLoggedIn()) {
      Toast.show('Por favor, inicia sesión para guardar favoritos.', 'warning');
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
      return false;
    }

    try {
      if (this.isFavorite(experienceId)) {
        // Remove from favorites
        await fetchAPI(`/favorites/${experienceId}`, { method: 'DELETE' });
        this._removeFavorite(experienceId);
        Toast.show('Removido de favoritos.', 'success');
        return false;
      } else {
        // Add to favorites
        await fetchAPI(`/favorites/${experienceId}`, { 
          method: 'POST',
          body: JSON.stringify({}),
        });
        this._addFavorite(experienceId);
        Toast.show('Agregado a favoritos.', 'success');
        return true;
      }
    } catch (error) {
      Toast.show(error.message || 'Error al guardar favorito', 'error');
      return this.isFavorite(experienceId);
    }
  },

  async getExperiences() {
    try {
      return await fetchAPI('/favorites');
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  isFavorite(experienceId) {
    const favorites = this._getFavorites();
    return favorites.includes(String(experienceId));
  },

  _getFavorites() {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  _addFavorite(experienceId) {
    const favorites = this._getFavorites();
    if (!favorites.includes(String(experienceId))) {
      favorites.push(String(experienceId));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  },

  _removeFavorite(experienceId) {
    const favorites = this._getFavorites();
    const filtered = favorites.filter(id => id !== String(experienceId));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  },
};

// ============================================================================
// EXPERIENCES MODULE
// ============================================================================

const Experiences = {
  async getAll(filters = {}) {
    try {
      let url = '/experiences?';
      
      if (filters.category) url += `categoria=${filters.category}&`;
      if (filters.q) url += `q=${encodeURIComponent(filters.q)}&`;
      if (filters.maxPrice) url += `price=${filters.maxPrice}&`;
      if (filters.location) url += `ubicacion=${encodeURIComponent(filters.location)}&`;
      
      return await fetchAPI(url);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
  },

  async getOne(id) {
    try {
      return await fetchAPI(`/experiences/${id}`);
    } catch (error) {
      console.error('Error fetching experience:', error);
      return null;
    }
  },

  async search(query) {
    return this.getAll({ q: query });
  },
};

// ============================================================================
// BOOKINGS MODULE
// ============================================================================

const Bookings = {
  async create(bookingData) {
    try {
      if (!Auth.isLoggedIn()) {
        Toast.show('Por favor, inicia sesión para hacer una reserva.', 'warning');
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return null;
      }

      const response = await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      Toast.show('Reserva creada exitosamente.', 'success');
      return response;
    } catch (error) {
      Toast.show(error.message || 'Error al crear la reserva', 'error');
      return null;
    }
  },

  async getMyBookings() {
    try {
      if (!Auth.isLoggedIn()) return [];
      return await fetchAPI('/bookings');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },
};

// ============================================================================
// CATEGORIES MODULE
// ============================================================================

const Categories = {
  async getAll() {
    try {
      return await fetchAPI('/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};

// ============================================================================
// COMPONENTS MODULE
// ============================================================================

const Components = {
  /**
   * Render the navbar
   */
  navbar() {
    const isLoggedIn = Auth.isLoggedIn();
    const user = Auth.getCurrentUserData();

    let actionsHTML = '';
    if (isLoggedIn && user) {
      const initials = user.nombre_completo
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

      actionsHTML = `
        <div class="user-menu" onclick="toggleUserMenu()">
          <div class="user-avatar">${initials}</div>
          <span>${user.nombre_completo.split(' ')[0]}</span>
        </div>
        <div id="user-dropdown" class="user-dropdown" style="display: none;">
          <a href="perfil.html">Mi Perfil</a>
          <a href="favoritos.html">Favoritos</a>
          <a href="#" onclick="Auth.logout(); return false;">Cerrar sesión</a>
        </div>
      `;
    } else {
      actionsHTML = `
        <a href="login.html" class="btn btn-outline btn-sm">Iniciar sesión</a>
        <a href="registro.html" class="btn btn-primary btn-sm">Registrarse</a>
      `;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    return `
      <nav class="navbar">
        <div class="navbar-container">
          <a href="index.html" class="navbar-brand">
            <span style="color: #7EC850;">🌿</span> EcoXperiencia
          </a>
          <button class="hamburger" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul class="navbar-nav">
            <li><a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'nav-link-active' : ''}">Inicio</a></li>
            <li><a href="explorar.html" class="nav-link ${currentPage === 'explorar.html' ? 'nav-link-active' : ''}">Explorar</a></li>
            <li><a href="como-funciona.html" class="nav-link ${currentPage === 'como-funciona.html' ? 'nav-link-active' : ''}">Cómo funciona</a></li>
            <li><a href="anfitrion.html" class="nav-link ${currentPage === 'anfitrion.html' ? 'nav-link-active' : ''}">Ser anfitrión</a></li>
            <li><a href="contacto.html" class="nav-link ${currentPage === 'contacto.html' ? 'nav-link-active' : ''}">Contacto</a></li>
          </ul>
          <div class="navbar-actions">
            ${actionsHTML}
          </div>
        </div>
      </nav>
    `;
  },

  /**
   * Render the footer
   */
  footer() {
    return `
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-grid">
            <div class="footer-section">
              <h4>Explorar</h4>
              <ul class="footer-links">
                <li><a href="explorar.html">Experiencias</a></li>
                <li><a href="explorar.html?category=hiking">Senderismo</a></li>
                <li><a href="explorar.html?category=camping">Camping</a></li>
                <li><a href="explorar.html?category=agrotourism">Agroturismo</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Empresa</h4>
              <ul class="footer-links">
                <li><a href="como-funciona.html">Cómo funciona</a></li>
                <li><a href="anfitrion.html">Ser anfitrión</a></li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="#" onclick="alert('Blog próximamente'); return false;">Blog</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Legal</h4>
              <ul class="footer-links">
                <li><a href="legal.html">Términos y condiciones</a></li>
                <li><a href="legal.html">Política de privacidad</a></li>
                <li><a href="legal.html">Política de cancelación</a></li>
                <li><a href="legal.html">Política de cookies</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Soporte</h4>
              <ul class="footer-links">
                <li><a href="soporte.html">Centro de ayuda</a></li>
                <li><a href="soporte.html">Preguntas frecuentes</a></li>
                <li><a href="contacto.html">Reportar un problema</a></li>
                <li><a href="#" onclick="alert('Chat en vivo próximamente'); return false;">Chat en vivo</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="footer-social">
              <a href="#" class="social-icon" title="Instagram">
                <span>f</span>
              </a>
              <a href="#" class="social-icon" title="Facebook">
                <span>📷</span>
              </a>
              <a href="#" class="social-icon" title="TikTok">
                <span>🎵</span>
              </a>
            </div>
            <div class="footer-badges">
              <div class="badge">🌿 Turismo responsable</div>
              <div class="badge">🔒 Pago seguro</div>
            </div>
            <p class="copyright">&copy; 2026 EcoXperiencia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  },

  /**
   * Render an experience card
   */
  experienceCard(exp) {
    const isFav = Favorites.isFavorite(exp.id);
    const rating = exp.rating || 4.8;
    const reviews = exp.reviews_count || 0;
    const price = exp.precio_base || exp.price || 0;
    const location = exp.ubicacion_texto || exp.location || 'Colombia';
    const category = exp.categoria?.nombre || exp.category || 'Experiencia';
    const title = exp.titulo || exp.title || 'Sin título';
    const image = exp.imagen_url || exp.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';

    return `
      <article class="experience-card animate-fade-up">
        <div class="card-image-wrap">
          <img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(title)}'">
          <span class="badge-category">${category}</span>
          <button class="btn-wishlist ${isFav ? 'favorited' : ''}" onclick="toggleFavorite('${exp.id}'); return false;" title="Agregar a favoritos">
            ${isFav ? '♥' : '♡'}
          </button>
        </div>
        <div class="card-body">
          <div class="card-location">📍 ${location}</div>
          <h3 class="card-title">${title}</h3>
          <div class="card-rating">
            <span class="stars">${'★'.repeat(Math.floor(rating))}${rating % 1 >= 0.5 ? '⭐' : ''}</span>
            <span>${rating} (${reviews} reseñas)</span>
          </div>
          <div class="card-price">
            <span>Desde <strong>$${price.toLocaleString('es-CO')}</strong></span>
            <span class="currency"> COP / persona</span>
          </div>
          <a href="experiencia.html?id=${exp.id}" class="btn-view">Ver experiencia</a>
        </div>
      </article>
    `;
  },

  /**
   * Render a loading spinner
   */
  loadingSpinner() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon" style="animation: spin 1s linear infinite;">⚙️</div>
        <p class="empty-state-message">Cargando...</p>
      </div>
    `;
  },

  /**
   * Render empty state
   */
  emptyState(icon = '📭', title = 'No hay resultados', message = 'Intenta cambiar tus filtros') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-message">${message}</p>
      </div>
    `;
  },
};

// ============================================================================
// GLOBAL FUNCTIONS
// ============================================================================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar-nav');
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
}

/**
 * Close mobile menu when clicking on a link
 */
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const hamburger = document.querySelector('.hamburger');
      const nav = document.querySelector('.navbar-nav');
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });
});

/**
 * Toggle user dropdown menu
 */
function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * Close dropdown when clicking outside
 */
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('user-dropdown');
  
  if (dropdown && userMenu && !userMenu.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

/**
 * Toggle favorite
 */
async function toggleFavorite(experienceId) {
  const button = event.target.closest('.btn-wishlist');
  const wasLoading = button.textContent === '...';
  
  if (wasLoading) return;
  
  button.textContent = '...';
  const isFav = await Favorites.toggle(experienceId);
  button.textContent = isFav ? '♥' : '♡';
  button.classList.toggle('favorited', isFav);
}

/**
 * Format price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Get URL parameters
 */
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Redirect if not logged in
 */
function requireLogin() {
  if (!Auth.isLoggedIn()) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `login.html?redirect=${redirectUrl}`;
  }
}

/**
 * Format date for input
 */
function formatDateForInput(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Initialize page - render navbar and footer
 */
function initializePage() {
  // Render navbar
  const navContainer = document.querySelector('nav') || (() => {
    const container = document.createElement('div');
    document.body.insertBefore(container, document.body.firstChild);
    return container;
  })();
  
  if (!navContainer.innerHTML.includes('navbar')) {
    navContainer.innerHTML = Components.navbar();
  }

  // Render footer if not exists
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.innerHTML = Components.footer();
    document.body.appendChild(footer);
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', initializePage);

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Auth,
    Favorites,
    Experiences,
    Bookings,
    Categories,
    Components,
    Toast,
    Modal,
  };
}
