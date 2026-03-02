# Changelog - vdpcza 🚀

## [Phase 5] - 2026-03-02 - "Arquitectura Limpia & Minimalismo Brutal"

### ✨ Nuevas Funcionalidades
- **Arquitectura Limpia (Clean Architecture)**: Refactorización profunda de toda la base de código separando la lógica de presentación de la lógica de negocio y datos. 
- **Capa de Repositorios**: Se crearon múltiples clases Repository (`GiftRepository`, `TravelRepository`, `MoodRepository`, `ProfileRepository`, `MemoriesRepository`, etc.) aislando por completo las interacciones directas con Supabase de los componentes de React.
- **Rediseño: Minimalismo Brutalista**: Transformación completa de la estética visual eliminando bordes excesivos ("AI slop") a favor de sombras masivas, padding extremo y desenfoques radicales (`backdrop-blur-[40px]`).
- **Páginas Aisladas**: Todos los módulos base (`Gifts.jsx`, `Dashboard.jsx`, `Restaurants.jsx`, `Profile.jsx`) operan ahora sin lógica estricta de bases de datos internamente.
- **DESIGN.md**: Creación sistemática del archivo `DESIGN.md` fungiendo como fuente de la verdad para mantener una cohesión visual consistente.

### 🎨 Mejoras de Diseño
- **Espacio y Contraste**: Se implementó una filosofía "Cosmic Solitude" incrementando drásticamente el uso de espacio vacío y limitando los ruidos visuales.
- **Tipografía Diamante**: Reducción de textos genéricos apostando por tipografías Display enormes (Playfair Display) combinadas con micro-copias mono-espaciadas ultraseparadas.
- **Animaciones Fluidas**: Componentes del Dashboard y menú de navegación reformulados para usar transiciones de estado más físicas y suaves con `framer-motion`.

---

## [Phase 4] - 2026-02-15 - "Cartas Mágicas & Notificaciones"

### ✨ Nuevas Funcionalidades
- **Sistema de Cartas Dinámicas**: Refactorización completa de la sección de Regalos. Ahora el administrador puede crear, editar y borrar sobres de regalo.
- **Mecanismo de Bloqueo**: Las cartas pueden crearse bloqueadas. Permanecerán así hasta que el administrador decida liberarlas, creando un sistema de anticipación y sorpresas programadas.
- **Notificaciones en Tiempo Real (Badge)**: Implementación de un globo de notificación rojo en el icono de Regalos del menú inferior.
- **Banner de Sorpresa**: El Dashboard ahora muestra un banner flotante ("¡Sorpresa!") cada vez que hay cartas nuevas esperando ser abiertas.
- **Lógica de "Visto" individual**: La notificación solo desaparece cuando el regalo ha sido desbloqueado y abierto por el usuario.

### 🎨 Mejoras de Diseño
- **Sobres 3D & Animación de Cartas**: Nuevo diseño visual para los regalos en forma de sobres elegantes. Al abrirlos, se despliega una carta con diseño de papel de cuaderno realista y tipografía cursiva.
- **Sincronización de UI**: Uso de eventos de `localStorage` y suscripciones de Supabase para asegurar que las notificaciones se actualicen instantáneamente en todas las pestañas sin recargar.

### 🛠️ Correcciones y Mejoras Técnicas
- **Supabase Real-time**: Integración de canales de escucha (Real-time) para el contador de notificaciones.
- **Gestión de Estado**: Optimización de la detección de regalos vistos para evitar que las notificaciones se repitan innecesariamente.
- **Mensaje Personalizado**: Actualización del mensaje de bloqueo con un toque personal ("PD: TE AMO").

---

## [Phase 3] - 2026-02-15

### ✨ Nuevas Funcionalidades
- **Gestor de Viajes y Recuerdos**: Galería interactiva con soporte para álbumes y subida de archivos vinculados (Storage de Supabase).
- **Restaurantes (CRUD)**: Sistema completo para añadir, editar y eliminar restaurantes favoritos, con un módulo interno de **opiniones y valoraciones**.
- **Regalos**: Lista visual de ideas y regalos recibidos.
- **Bucket List**: Lista de metas y sueños compartidos con sistema de checklist.
- **Navegación "Universo"**: Nueva barra de navegación horizontal con diseño minimalista, iconos animados y soporte táctil fluido.
- **Perfil de Usuario**: Página básica de perfil.

### 🎨 Mejoras de Diseño (Nebula Glass 2.0)
- **Fondo Aurora Dinámico**: Animaciones de fondo optimizadas con colores profundos (Rose/Indigo/Cyan).
- **Efectos de Cristal**: Tarjetas y botones con un acabado de cristal esmerilado (`backdrop-blur`) más pulido y sombras realistas.
- **Micro-interacciones**: Animaciones al hacer hover, click y transiciones de página suaves con `framer-motion`.
- **Tipografía**: Implementación de fuentes `Playfair Display` para títulos elegantes y `Outfit` para textos modernos.

### 🛠️ Correcciones y Mejoras Técnicas
- **Autenticación Robusta**:
    - Soporte para Login con **Magic Link** y **Contraseña**.
    - Sistema de roles (Admin/User) para proteger secciones sensibles (Viajes, Recuerdos).
    - Lógica de "Whitelist" para restringir el acceso solo a correos autorizados.
- **Solución de Bugs**:
    - Arreglado el error de pantalla blanca en rutas protegidas por falta de contexto.
    - Corregida la superposición de la barra de navegación con los modales.
    - Mejorado el manejo de errores en la subida de imágenes.

### 🔒 Seguridad
- Implementación de `RequireAdmin` para proteger rutas de escritura crítica.
- Validación de sesiones y redirección inteligente.

---
*Hecho con ❤️ para Vale & Cris*
