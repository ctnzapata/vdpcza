# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **TopBar Component**: New persistent top navigation bar showing user profile, role, and logout functionality.
- **Profile Page**: Comprehensive user profile management allowing updates to name, bio, and avatar.
- **Role-Based Access Control (RBAC)**: secure enforcement of `admin` vs `user` roles throughout the application.
- **Admin Dashboard**: Enhanced dashboard experience for authorized users.
- **Password Authentication**: Added support for email/password login alongside Magic Links.
- **Vercel Deployment**: Configuration for automated deployments via Vercel.

### Changed
- **Navigation**: Moved `Profile` access from `BottomNav` to `TopBar` for better separation of concerns.
- **Authentication**: Improved robustness of session handling and role detection.
- **UI/UX**: Refined "Nebula Glass" aesthetic with smoother animations and consistent styling.

### Fixed
- **Login Issues**: Resolved race conditions in `AuthContext` causing blank screens on login.
- **Role Detection**: Implemented fallback mechanism to ensure correct admin privileges based on email.
- **Magic Link Redirects**: Corrected redirect URIs for deployed environments.

### Security
- **Database Hardening**: Created `supabase/best_practices.sql` with recommended RLS policies and Index optimizations.
- **Error Handling**: Improved error logging in `Dashboard` and `Memories` components to prevent silent failures.

### Design
- **Frontend Redesign**: Enhanced "Nebula Glass" aesthetic with new color variables, advanced aurora animations, and refined glassmorphism effects.
- **Typography**: Updated font hierarchy using `Playfair Display` for headings and `Outfit` for body text.
- **Responsive Layout**: Improved responsiveness with a mobile-first approach that expands gracefully to desktop (`max-w-5xl`).
- **Branding**: Implemented new SVG logo and favicon with "VC" monogram and neon effects.
- **Navigation**: Refined `BottomNav` and `TopBar` for better usability across devices.

### Performance
- **Asset Optimization**: Localized `noise.svg` background texture to reduce external HTTP requests and improve LCP.
