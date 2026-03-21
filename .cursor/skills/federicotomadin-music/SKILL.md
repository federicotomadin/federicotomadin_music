---
name: federicotomadin-music
description: >-
  Manages the Federico Tomadin music website — a React/Vite site with Firebase
  backend, Cloudinary image hosting, and GitHub Pages deployment. Use when
  working on sections (Hero, Bio, Music, Events, Gallery, Contact), admin panel,
  Firebase/Firestore integration, or deploying the site.
---

# Federico Tomadin Music Site

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Firebase (Firestore for data, Auth for admin login)
- **Images**: Cloudinary (with client-side compression before upload)
- **Deployment**: GitHub Pages via GitHub Actions
- **Routing**: react-router-dom with SPA 404 fallback

## Project Structure

```
src/
├── components/
│   ├── sections/          # Public page sections
│   │   ├── HeroSection    # Background photo + name + featured track
│   │   ├── BioSection     # Biography with background image
│   │   ├── MusicSection   # Album discography (Tornasolado, Straight Street)
│   │   ├── EventsSection  # Concerts with flyer images + lightbox
│   │   ├── GallerySection # Photo grid
│   │   └── ContactSection # Contact form with background image
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components (shadcn-style)
├── pages/
│   ├── Home.tsx           # Assembles all sections
│   └── admin/             # Admin panel (CRUD for events, music, gallery)
├── contexts/
│   ├── DataContext.tsx     # Data layer — Firestore with localStorage fallback
│   └── AuthContext.tsx     # Firebase Auth (Google + email/password)
├── lib/
│   ├── firebase.ts        # Firebase initialization
│   ├── cloudinary.ts      # Image upload + compression
│   └── utils.ts           # cn(), assetUrl()
└── types/index.ts         # Event, MusicTrack, GalleryImage, SiteSettings
```

## Key Patterns

### Data Persistence (DataContext)

On startup, tests Firestore connectivity with a 5s timeout:
- **Connected** → uses Firestore `onSnapshot` listeners for real-time reads, `addDoc`/`updateDoc` for writes
- **Not connected** → falls back to `localStorage` for both reads and writes

All CRUD operations: `createItem`, `updateItem`, `deleteItem` — generic helpers parameterized by collection name.

### Image Uploads

1. `isCloudinaryConfigured()` → upload to Cloudinary (preferred)
2. Otherwise → upload to Firebase Storage

Images are **compressed client-side** before upload (max 2400px, JPEG quality 85%, target < 9MB) to stay within Cloudinary's 10MB free-tier limit.

### Public Asset URLs

Use `assetUrl("filename.jpg")` for images in the `/public` folder. This prepends `import.meta.env.BASE_URL` for correct paths on GitHub Pages.

### Background Images with Overlays

Sections with background images use this pattern:
```tsx
<div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
     style={{ backgroundImage: `url(${assetUrl("image.png")})` }} />
<div className="absolute inset-0 z-0 bg-background/40 md:bg-background/60" />
<div className="absolute inset-0 z-0 bg-gradient-to-b ..." />
```
Mobile gets lighter overlays so photos are more visible.

## Design System

- **Font families**: `font-serif` (Cormorant Garamond), `font-sans` (Inter), `font-script` (Great Vibes)
- **Color palette**: warm dark theme — `--color-background: #131211`, `--color-primary: #c8a55a` (gold accent)
- **Section spacing**: `py-28 md:py-36`, `px-6 lg:px-12`
- **Section labels**: gold uppercase text with `section-line` divider
- **Responsive**: mobile-first, with `md:` and `lg:` breakpoints

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Builds with `npm run build` using GitHub Secrets for env vars
2. Copies `dist/index.html` → `dist/404.html` (SPA routing)
3. Deploys to GitHub Pages

Required GitHub Secrets: `VITE_FIREBASE_*` (6 keys), `VITE_CLOUDINARY_*` (2 keys).

Custom domain: `federicotomadin.com` — DNS A records point to GitHub Pages IPs, CNAME `www` → `federicotomadin.github.io`.

## Admin Panel

Located at `/panel`. Protected by Firebase Auth. Sections:
- **Eventos**: CRUD with date picker, image upload, active toggle
- **Música**: Track management with audio upload
- **Galería**: Image grid management
- **Configuración**: Site settings (bio, social links, album info)

All admin pages show error/success alerts (red/green) for user feedback.
