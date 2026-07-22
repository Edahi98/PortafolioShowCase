# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con Astro + Tailwind CSS v4.

## Stack

- Astro 5 (TypeScript strict), sin ningún framework de UI (no React/Vue/Svelte) — todo el sitio es Astro puro, sin islas ni hidratación client-side.
- Tailwind CSS v4 vía `@tailwindcss/vite` (sin `tailwind.config`; el theme se define con `@theme` en `src/styles/global.css`).
- Three.js para gráficos 3D (`src/components/DockerScene.astro`, `src/components/NeuralNetworkScene.astro`), cargado con `<script>` client-side dentro del componente Astro (sin framework de reactividad).
- anime.js v4 (`animate` de `'animejs'`) para animar propiedades de objetos Three.js (posición de partículas, `emissiveIntensity`) en `NeuralNetworkScene.astro`.
- `@lucide/astro` (paquete oficial de Lucide para Astro) para íconos SVG puntuales dentro de componentes `.astro`, p. ej. `Crown` en `Proyectos.astro` para destacar un proyecto.

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

`src/pages/index.astro` solo compone las secciones del Home; cada sección vive como componente en `src/components/`: `Hero`, `SobreMi`, `Proyectos`, `Formacion`, `Habilidades`, `Contacto` (más `Navbar`, `DockerScene` y `NeuralNetworkScene`). Las piezas pequeñas y reutilizables dentro de una sección van en `src/components/atoms/` (p. ej. `LanguageGrid` y `ToolGrid`, los grids de lenguajes/herramientas con íconos de [skillicons.dev](https://skillicons.dev); `SoftSkillList`, la lista de habilidades blandas). Las tres son tarjetas estáticas de Astro (sin JS ni frameworks de UI). `SoftSkillList` asigna a cada habilidad un color distinto (definido inline por tarjeta como clases literales de Tailwind, p. ej. `border-rose-400/40` / `bg-rose-400/10` / `text-rose-300`) fuera de la paleta cyan/púrpura/índigo del tema, para diferenciarlas visualmente sin salirse del tono oscuro general; las clases deben escribirse completas (no construidas dinámicamente con template strings) para que el escáner de Tailwind las detecte. El contenido proviene del CV de Canva "Edahi CV". Si el CV se actualiza, reflejar los cambios en el componente correspondiente.

## Certificados

Los certificados (PDF) viven en `public/certificados/` y se muestran en una página dedicada (p. ej. `src/pages/certificado-solana.astro`) con el PDF embebido en un `<iframe>`, siguiendo el mismo layout con `Navbar` y las clases del tema. El punto de entrada es la tarjeta correspondiente en `Formacion.astro` (propiedad `href` en el objeto de `certificaciones`), que se renderiza como `<a>` en vez de `<div>` cuando existe.

## Showcase de proyectos

Los datos de `Proyectos.astro` viven en `src/data/proyectos.ts` (`Proyecto[]`, con `slug` e `imagenes` opcionales). Cuando un proyecto tiene `slug`, su tarjeta se renderiza como `<a href="/proyectos/{slug}">` con "Ver proyecto →"; sin `slug` se renderiza como `<article>` estático. La ruta dinámica `src/pages/proyectos/[slug].astro` usa `getStaticPaths()` sobre `proyectos` filtrando por `slug`, y muestra la galería de `imagenes` (o "Capturas próximamente." si el arreglo está vacío) con el mismo layout que `certificado-solana.astro`. Las capturas de cada proyecto viven en `public/proyectos/<slug>/`, recortadas para no mostrar barras de navegador/SO (barra de direcciones, marcadores, barra de tareas de Windows, barra de estado de Android, etc.) — solo el contenido de la app.

Nota sobre imágenes pegadas en el chat: las imágenes que el usuario pega inline (no como adjunto vía `@ruta`) no existen como archivo accesible por las herramientas de shell/lectura en este entorno remoto; solo se reciben como contenido multimodal del mensaje. Para procesarlas (p. ej. recortarlas), hay que extraer su base64 desde el transcript de la sesión (`/root/.claude/projects/<proyecto>/<session-id>.jsonl`, bloques `content[].type == "image"` con `source.data`), decodificarlas a archivos temporales, y trabajar sobre esos archivos.
