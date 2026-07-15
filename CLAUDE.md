# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con Astro + Tailwind CSS v4.

## Stack

- Astro 5 (TypeScript strict), sin framework de UI adicional.
- Tailwind CSS v4 vía `@tailwindcss/vite` (sin `tailwind.config`; el theme se define con `@theme` en `src/styles/global.css`).
- Three.js para gráficos 3D (`src/components/DockerScene.astro`, `src/components/NeuralNetworkScene.astro`), cargado con `<script>` client-side dentro del componente Astro (sin framework de reactividad).
- anime.js v4 (`animate` de `'animejs'`) para animar propiedades de objetos Three.js (posición de partículas, `emissiveIntensity`) en `NeuralNetworkScene.astro`.

## Tema visual: degradado elegante, esencia tech

- **Fondo**: `--color-bg` (#05060f) casi negro, con degradados radiales sutiles de `--color-primary`/`--color-secondary`/`--color-accent` aplicados en `body` (glow difuso, no ruidoso).
- **Paleta** (definida en `src/styles/global.css` bajo `@theme`):
  - `--color-primary` `#22d3ee` (cyan)
  - `--color-secondary` `#a855f7` (púrpura)
  - `--color-accent` `#6366f1` (índigo)
  - `--color-surface` / `--color-surface-2`: superficies oscuras para tarjetas
  - `--color-border` `#1e2440`: bordes sutiles
- **Texto con degradado**: clase utilitaria `.text-gradient` (cyan → púrpura) para títulos destacados.
- **Tarjetas "glass"**: clase `.glass-card` — fondo semitransparente + `backdrop-filter: blur` + borde sutil. Usar para cualquier bloque de contenido (proyectos, formación, etc.).
- **Tipografía tech**: `font-mono` para etiquetas, kickers y badges (uppercase, tracking-widest), sans-serif regular para el resto del contenido.
- **Interacción**: hover sutil (`hover:border-primary/60`, `hover:opacity-90`), sin animaciones agresivas.

Al agregar nuevas secciones o páginas, reutilizar estas clases/variables en lugar de introducir colores o efectos nuevos, para mantener consistencia visual.

## Contenido

El contenido de la página Home (`src/pages/index.astro`) proviene del CV de Canva "Edahi CV". Si el CV se actualiza, reflejar los cambios ahí (proyectos, formación, certificaciones, habilidades, contacto).
