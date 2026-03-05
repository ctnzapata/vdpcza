# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.0.0 (2026-03-05)


### Features

* **admin:** add premium trivia CRUD manager and birthday test mode ([0513513](https://github.com/ctnzapata/vdpcza/commit/05135138c70b71c1bf96e7d38c4621da731b15d7))
* **architecture:** refactor to Clean Architecture and apply brutal minimalist design ([59a2c03](https://github.com/ctnzapata/vdpcza/commit/59a2c03e420026e37c5a105eef4621e394a023a8))
* **dashboard:** add birthday countdown and hacked daily trivia for gift reveal ([56babef](https://github.com/ctnzapata/vdpcza/commit/56babef5821ced4fe1e511b1699aa395fedcf631))
* **dashboard:** separate birthday clues from daily trivia ([32bbba1](https://github.com/ctnzapata/vdpcza/commit/32bbba13d2c17ea95fdcafaa1782c31fd524bf1a))
* **dashboard:** show birthday clues day-by-day instead of sequential clicks ([0934e43](https://github.com/ctnzapata/vdpcza/commit/0934e43207e3f7bde97f9c7e95b5a957c4253f0e))
* **dashboard:** update trivia messages and add RLS fix script ([b848803](https://github.com/ctnzapata/vdpcza/commit/b8488033680617bc9bb52c96bee5a352e9502d9f))
* **memories:** premium ui redesign with masonry, lightbox, and full CRUD via RLS fix ([7f68a41](https://github.com/ctnzapata/vdpcza/commit/7f68a4172cf712b1d5f0dcf7d1895279ab7e491b))
* **memories:** radical 3-skill redesign (frontend, mobile, react-components) ([49e531b](https://github.com/ctnzapata/vdpcza/commit/49e531b3abe799b1df757190ec625a0b81bd0f6d))
* **notifications:** add web push notifications system with vercel serverless API ([10f83e1](https://github.com/ctnzapata/vdpcza/commit/10f83e1dbcddc1c657e4ea92313771cba68b7da9))
* **Phase 3:** Added Gifts, Restaurants, Bucket List, and upgraded to Nebula Glass 2.0 design system. Fixed auth bugs and navigation. ([7eb1bae](https://github.com/ctnzapata/vdpcza/commit/7eb1bae0ec55fea4cf32c00a236bff65be0b9a1d))
* **ui:** apply michelin & glass ticket redesign to capsules and restaurants via global skills ([5b79c82](https://github.com/ctnzapata/vdpcza/commit/5b79c825dc53d37c4bf71bcc3fd16916e6e0b3fd))
* **ui:** refine frontend aesthetics and responsive layout ([53ba2a1](https://github.com/ctnzapata/vdpcza/commit/53ba2a1df3fbed425b7a4b738fb59aefc9e3d6b4))


### Bug Fixes

* **admin:** remove q column payload to fix supabase schema error on trivia save ([5ca9de4](https://github.com/ctnzapata/vdpcza/commit/5ca9de47fa9148368744511c739954ff5c00ae03))
* **memories:** adjust floating dock position to prevent nav bar overlap ([eac28bf](https://github.com/ctnzapata/vdpcza/commit/eac28bf3d218e4c9e80fe1e178b1143825d91d48))
* **memories:** push floating dock higher to clear bottom nav ([19337ab](https://github.com/ctnzapata/vdpcza/commit/19337ab9a766775feda0c05f64e0715f14ddac70))
* restore mood tracker and fix flickering issue in dashboard ([99f15a5](https://github.com/ctnzapata/vdpcza/commit/99f15a54a49bf9743f3e8bc8868dca97bc72a5f6))

# Changelog - vdpcza 🚀

## [Phase 5] - 2026-03-02 - "Arquitectura Limpia & Minimalismo Brutal"

### ✨ Nuevas Funcionalidades
- **Arquitectura Limpia (Clean Architecture)**: Refactorización profunda de toda la base de código separando la lógica de presentación de la lógica de negocio y datos. 
- **Capa de Repositorios**: Se crearon múltiples clases Repository (`GiftRepository`, `TravelRepository`, `MoodRepository`, `ProfileRepository`, `MemoriesRepository`, etc.) aislando por completo las interacciones directas con Supabase de los componentes de React.
- **Rediseño: Minimalismo Brutalista**: Transformación completa de la estética visual eliminando bordes excesivos ("AI slop") a favor de sombras masivas, padding extremo y desenfoques radicales (`backdrop-blur-[40px]`).
- **Páginas Aisladas**: Todos los módulos base (`Gifts.jsx`, `Dashboard.jsx`, `Restaurants.jsx`, `Profile.jsx`) operan ahora sin lógica estricta de bases de datos internamente.
- **DESIGN.md**: Creación sistemática del archivo `DESIGN.md` fungiendo como fuente de la verdad para mantener una cohesión visual consistente.
- **Notificaciones Push Web**: Sistema bidireccional de notificaciones Push (PWA) habilitado nativamente. Ahora el dispositivo vibra e ilumina la pantalla cuando se envía una actualización.
- **Push Serverless API**: Implementación de una arquitectura API en `/api/send_push.js` para Vercel Serverless, garantizando envíos masivos seguros ocultando las llaves VAPID.

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
