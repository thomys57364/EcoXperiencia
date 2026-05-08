EcoXperiencia — Qué hace y cómo funcionan los roles                                                                                                                                                                      
                                                                                                                                       
  Propósito general
                                                                                                                                                                                                                           
  Marketplace de ecoturismo colombiano. Conecta viajeros que buscan experiencias auténticas en la naturaleza con anfitriones locales que las ofrecen (senderismo, kayak, café de origen, glamping, avistamiento, etc.).

  Demo accounts to test with:

  ┌───────────┬─────────────────────────────┬────────────┐
  │   Role    │            Email            │  Password  │
  ├───────────┼─────────────────────────────┼────────────┤
  │ Admin     │ admin@ecoxperiencia.com     │ admin123   │
  ├───────────┼─────────────────────────────┼────────────┤
  │ Anfitrión │ anfitrion@ecoxperiencia.com │ host123    │
  ├───────────┼─────────────────────────────┼────────────┤
  │ Viajero   │ viajero@ecoxperiencia.com   │ viajero123 │
  └───────────┴─────────────────────────────┴────────────┘
                                                                                                                                                                                                                           
  ---                                                       
  Roles

  Visitante (sin cuenta)

  - Puede navegar el catálogo en explorar.html y ver detalles en experiencia.html
  - Puede buscar y filtrar por categoría, precio, ubicación
  - Al intentar reservar, guardar favoritos o escribir reseña → redirige a login

  ---
  Viajero (role: 'viajero')

  Cuenta estándar. Se registra en registro.html eligiendo "Viajero".

  Puede:
  - Reservar experiencias → genera código ECO-XXXXXXXX, queda en historial
  - Cancelar reservas desde perfil.html → Mis reservas
  - Guardar favoritos (por usuario, aislados de otras cuentas)
  - Escribir reseñas con calificación 1-5 estrellas (una por experiencia)
  - Recibir notificaciones (bienvenida, confirmación de reserva, cancelación)
  - Editar su perfil (nombre, teléfono, bio) y cambiar contraseña
  - Convertirse en anfitrión desde el CTA en su perfil o yendo a anfitrion.html

  No puede:
  - Acceder al dashboard de anfitrión
  - Ver reservas de otras personas

  ---
  Anfitrión (role: 'anfitrion')

  Se convierte en anfitrión de dos formas:
  1. Registrarse en registro.html eligiendo "Anfitrión" → va a anfitrion.html?register=1
  2. Estar logueado como viajero y hacer clic en "Convertirme en anfitrión"

  El formulario de registro pide: documento, fecha de nacimiento, dirección, bio de anfitrión y certificaciones. La solicitud queda en estado pendiente hasta ser verificada.

  Puede todo lo del viajero, más:
  - Dashboard (dashboard-anfitrion.html) con:
    - Estadísticas: experiencias, reservas totales, confirmadas, ingresos estimados
    - Tab "Mis experiencias" → ve las experiencias que tiene asignadas con métricas
    - Tab "Reservas recibidas" → ve quién reservó sus experiencias
    - Tab "Perfil anfitrión" → sus datos de verificación y certificaciones
  - Badge en navbar con acceso directo al Dashboard
  - Badge de verificación en su dashboard: Verificado ✓ / En revisión / Rechazado

  ▎ Por ahora las experiencias se asignan manualmente por hostId en experiencesData. El host demo (anfitrion@ecoxperiencia.com) tiene la experiencia "Amanecer en el Cocuy" asignada.

  ---
  Admin (role: 'admin')

  Superusuario. Hereda todos los permisos del anfitrión (hasRole('anfitrion') devuelve true para admin).

  - Accede al Dashboard de anfitrión
  - En el futuro sería el responsable de aprobar/rechazar solicitudes de anfitriones
  - Actualmente no tiene panel de administración separado

  ---
  Flujos principales

  Registro → Login → Explorar → Ver experiencia → Reservar
                                                → Guardar favorito
                                                → Escribir reseña

  Viajero → Anfitrión → Completar perfil → Dashboard → Ver reservas recibidas

  ---
  Persistencia

  Todo vive en localStorage. Si limpias el storage del navegador, los datos de usuario se borran pero los datos demo se re-siembran automáticamente al recargar.
