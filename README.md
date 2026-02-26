# Federico Tomadin - Music


Sitio web personal para músico, baterista y compositor. Single page con Firebase y Firestore, siguiendo la estructura de [casa_ramayon](https://github.com/federicotomadin/casa_ramayon).

## Características

- **Galería**: Imágenes de conciertos y presentaciones
- **Conciertos**: Eventos y anuncios de fechas
- **Música**: Tracks para reproducir en el sitio (subir MP3 o URLs)
- **Enlaces**: Spotify, YouTube, Apple Music, Instagram, Facebook
- **Panel de administración**: Gestión de contenido sin código

## Estilo

Diseño inspirado en [federicotomadin.com](https://www.federicotomadin.com/) (Wix): fondo oscuro, tipografía Cormorant Garamond + Inter, acento dorado (#c9a227).

## Setup

1. Clonar y instalar dependencias:
   ```bash
   npm install
   ```

2. Crear `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configurar Firebase:
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilitar Firestore, Storage y Authentication (Email/Password)
   - Crear colecciones: `events`, `musicTracks`, `galleryImages`, `settings`
   - Copiar credenciales a `.env`

4. (Opcional) Cloudinary para imágenes:
   - Crear cuenta y upload preset en Cloudinary
   - Si no se configura, se usa Firebase Storage para imágenes y audio

5. Sin Firebase configurado, el sitio usa **modo demo** con localStorage.

## GitHub Pages

El sitio está configurado para publicarse en GitHub Pages. La URL será `https://<tu-usuario>.github.io/federicotomadin_music/`.

**Configurar en GitHub:**
1. Ir a **Settings → Pages** del repositorio
2. En "Build and deployment", elegir **GitHub Actions** como fuente
3. Al hacer push a `main`, el workflow despliega automáticamente

**Despliegue manual (alternativa):**
```bash
npm run deploy
```
Esto construye el proyecto y sube el contenido a la rama `gh-pages`. Si usas este método, en Settings → Pages elige la rama `gh-pages` como fuente.

**Si tu repositorio tiene otro nombre:** edita `base` en `vite.config.ts` (por ejemplo `/mi-repo/`).

## Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build
- `npm run deploy` - Desplegar a GitHub Pages (rama gh-pages)

## Estructura

- `src/pages/Home.tsx` - Página principal (single page)
- `src/components/sections/` - Hero, Bio, Music, Events, Gallery, Contact
- `src/components/layout/` - Header, Footer
- `src/contexts/DataContext.tsx` - Firestore + localStorage
- `src/pages/admin/` - Panel de administración
