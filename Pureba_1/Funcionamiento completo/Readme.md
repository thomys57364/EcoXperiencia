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

 // Guardado en localStorage:
 // - ecoxperiencia_users → Array de usuarios registrados
 // - ecoxperiencia_currentUser → Usuario logueado actual

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

  // En favoritos.html y perfil.html:
  if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
  }

  
