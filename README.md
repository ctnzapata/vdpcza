# ✨ vdpcza - Nuestro Universo

Bienvenido al repositorio de **vdpcza**, una aplicación web personal diseñada como un regalo digital único. Este proyecto combina un diseño estético de alta gama ("Nebula Glass") con funcionalidades robustas de gestión de usuarios y contenido.

## 🚀 Tecnologías Utilizadas

Este proyecto ha sido construido utilizando las herramientas más modernas del desarrollo web:

*   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) para una experiencia de desarrollo ultrarrápida.
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y elegante.
*   **Animaciones**: [Framer Motion](https://www.framer.com/motion/) para transiciones suaves y efectos visuales.
*   **Backend & Auth**: [Supabase](https://supabase.com/) para la autenticación, base de datos en tiempo real y almacenamiento de archivos.
*   **Iconos**: [Lucide React](https://lucide.dev/) para una iconografía limpia y consistente.
*   **Despliegue**: [Vercel](https://vercel.com/) para CI/CD automático.

## 🌟 Funcionalidades Implementadas

### 1. Sistema de Autenticación Avanzado
*   **Login Híbrido**: Soporte tanto para "Magic Links" (sin contraseña) como para inicio de sesión tradicional con correo y contraseña.
*   **Protección de Rutas**: Sistema de seguridad (`RequireAuth` y `RequireAdmin`) que restringe el acceso a ciertas secciones según el rol del usuario.
*   **Gestión de Sesiones**: Persistencia de sesión y manejo de estados de carga/error.

### 2. Gestión de Perfiles y Roles (RBAC)
*   **Roles de Usuario**: Diferenciación clara entre `admin` (acceso total) y `user` (acceso restringido).
*   **Edición de Perfil**: Los usuarios pueden actualizar su nombre, biografía y subir una foto de perfil personalizada.
*   **Avatar Upload**: Integración con Supabase Storage para subir y gestionar imágenes de perfil.

### 3. Experiencia de Usuario (UX/UI)
*   **Diseño "Nebula Glass"**: Una estética moderna con fondos oscuros, gradientes sutiles y efectos de vidrio esmerilado.
*   **Barra Superior (TopBar)**: Navegación persistente con acceso rápido al perfil y estado del usuario.
*   **Navegación Inferior (BottomNav)**: Menú móvil intuitivo que se adapta según los permisos del usuario (oculta secciones de Admin a usuarios normales).

### 4. Módulos Específicos
*   **Dashboard**: Pantalla principal con un contador de tiempo especial ("Nuestro Tiempo Juntos"), frases aleatorias y bienvenida personalizada.
*   **Viajes y Recuerdos**: Secciones exclusivas para administradores para gestionar contenido multimedia (en desarrollo).
*   **Música**: Integración de playlist (en desarrollo).

## 🛠️ Configuración e Instalación

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/vdpcza.git
    cd vdpcza
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz del proyecto con las siguientes claves:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima
    VITE_KEY_DATE=18/06/2024
    VITE_WHITELIST_EMAILS=correo1@ejemplo.com,correo2@ejemplo.com
    ```

4.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```

## 📦 Estructura del Proyecto

```
src/
├── components/
│   ├── Auth/       # Login, Profile, RequireAuth
│   ├── Dashboard/  # Pantalla principal, Widgets
│   ├── Layout/     # TopBar, BottomNav, Wrapper principal
│   ├── Memories/   # Galería de fotos (Admin)
│   └── Travel/     # Mapa de viajes (Admin)
├── context/
│   └── AuthContext.jsx # Lógica global de autenticación
├── lib/            # Utilidades (supabaseClient.js)
└── App.jsx         # Configuración de Rutas
```

## 🤝 Contribución

Este es un proyecto personal privado. Las contribuciones están limitadas a los administradores del proyecto.

---
*Desarrollado con ❤️ para Vale.*
