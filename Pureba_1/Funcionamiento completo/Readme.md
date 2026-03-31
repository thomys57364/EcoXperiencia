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
