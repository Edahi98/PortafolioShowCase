# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con Astro + Tailwind CSS v4.

## Stack

- Astro 5 (TypeScript strict). React (`@astrojs/react`) solo para islas puntuales que necesitan interactividad con estado (p. ej. `FlipCard`); el resto del sitio es Astro sin framework de UI.
- Tailwind CSS v4 vía `@tailwindcss/vite` (sin `tailwind.config`; el theme se define con `@theme` en `src/styles/global.css`).
- Three.js para gráficos 3D (`src/components/DockerScene.astro`, `src/components/NeuralNetworkScene.astro`), cargado con `<script>` client-side dentro del componente Astro (sin framework de reactividad).
- anime.js v4 (`animate` de `'animejs'`) para animar propiedades de objetos Three.js (posición de partículas, `emissiveIntensity`) en `NeuralNetworkScene.astro`.
- MiniSearch para la búsqueda de habilidades blandas en `SoftSkillSearch.tsx` (índice en memoria sobre el arreglo de habilidades, con `prefix` y `fuzzy` habilitados).

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

`src/pages/index.astro` solo compone las secciones del Home; cada sección vive como componente en `src/components/`: `Hero`, `SobreMi`, `Proyectos`, `Formacion`, `Habilidades`, `Contacto` (más `Navbar`, `DockerScene` y `NeuralNetworkScene`). Las piezas pequeñas y reutilizables dentro de una sección van en `src/components/atoms/` (p. ej. `LanguageGrid` y `ToolGrid`, los grids de lenguajes/herramientas con íconos de [skillicons.dev](https://skillicons.dev); `SoftSkillList`, la lista de habilidades blandas). Los componentes React (islas) viven en `src/components/react/`: `FlipCard` es una tarjeta tipo memorama reutilizable (controlada vía props `flipped`/`onToggle`, o no controlada con estado interno si se omiten) que se usa sin `iconSrc` para mostrar un ícono genérico al frente y el nombre al voltear; `SoftSkillSearch` compone la barra de búsqueda (MiniSearch) y el grid de `FlipCard` para Habilidades blandas — las tarjetas cuyo nombre coincide con la búsqueda se voltean automáticamente. También responde al query param `?flip=habilidades-blandas` (usado por el botón "Ver habilidades blandas" del hero) volteando todas las tarjetas al llegar; ese estado se aplica en un `useEffect` posterior al montaje (no en el estado inicial) para no generar un mismatch de hidratación con React 19, que no parcha atributos divergentes tras hidratar. `LanguageGrid` y `ToolGrid` muestran ícono + nombre en tarjetas estáticas (sin flip). El contenido proviene del CV de Canva "Edahi CV". Si el CV se actualiza, reflejar los cambios en el componente correspondiente.

## Certificados

Los certificados (PDF) viven en `public/certificados/` y se muestran en una página dedicada (p. ej. `src/pages/certificado-solana.astro`) con el PDF embebido en un `<iframe>`, siguiendo el mismo layout con `Navbar` y las clases del tema. El punto de entrada es la tarjeta correspondiente en `Formacion.astro` (propiedad `href` en el objeto de `certificaciones`), que se renderiza como `<a>` en vez de `<div>` cuando existe.

## Showcase de proyectos

Los datos de `Proyectos.astro` viven en `src/data/proyectos.ts` (`Proyecto[]`, con `slug` e `imagenes` opcionales). Cuando un proyecto tiene `slug`, su tarjeta se renderiza como `<a href="/proyectos/{slug}">` con "Ver proyecto →"; sin `slug` se renderiza como `<article>` estático. La ruta dinámica `src/pages/proyectos/[slug].astro` usa `getStaticPaths()` sobre `proyectos` filtrando por `slug`, y muestra la galería de `imagenes` (o "Capturas próximamente." si el arreglo está vacío) con el mismo layout que `certificado-solana.astro`. Las capturas de cada proyecto viven en `public/proyectos/<slug>/`, recortadas para no mostrar barras de navegador/SO (barra de direcciones, marcadores, barra de tareas de Windows, barra de estado de Android, etc.) — solo el contenido de la app.

Nota sobre imágenes pegadas en el chat: las imágenes que el usuario pega inline (no como adjunto vía `@ruta`) no existen como archivo accesible por las herramientas de shell/lectura en este entorno remoto; solo se reciben como contenido multimodal del mensaje. Para procesarlas (p. ej. recortarlas), hay que extraer su base64 desde el transcript de la sesión (`/root/.claude/projects/<proyecto>/<session-id>.jsonl`, bloques `content[].type == "image"` con `source.data`), decodificarlas a archivos temporales, y trabajar sobre esos archivos.
