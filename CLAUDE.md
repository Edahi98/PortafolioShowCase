# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con Astro + Tailwind CSS v4.

## Stack

- Astro 5 (TypeScript strict) — SSG puro; la única isla client-side es `ProyectosIsla`.
- **React 19** vía `@astrojs/react` — usado exclusivamente en `src/components/ProyectosIsla.tsx`, montado con `client:visible` desde `Proyectos.astro`. Usa `useState`/`useEffect` + `axios` para cargar `public/data/proyectos.json` en runtime. Íconos con `lucide-react`.
- **axios** — solo en `ProyectosIsla.tsx` para el fetch de proyectos.
- Tailwind CSS v4 vía `@tailwindcss/vite` (sin `tailwind.config`; el theme se define con `@theme` en `src/styles/global.css`).
- Three.js para gráficos 3D (`NeuralNetworkScene.astro`), cargado con `<script>` client-side dentro del componente Astro.
- anime.js v4 (`animate` de `'animejs'`) para animar propiedades de objetos Three.js (posición de partículas, `emissiveIntensity`) en `NeuralNetworkScene.astro`.
- `@lucide/astro` para íconos SVG en componentes `.astro` (p. ej. `Medal` en `TrailerScene.astro`). En el componente React se usa `lucide-react` en su lugar.

## Tema visual: oscuro azul-morado elegante

- **Fondo**: `--color-bg` (`#161950`) azul-morado oscuro. Sin degradados radiales en `body`; el glow está implícito en las tarjetas glass y la red neuronal.
- **Paleta** (definida en `src/styles/global.css` bajo `@theme`):
  - `--color-bg` `#161950` — fondo de página
  - `--color-surface` `#1e215e` — fondo de tarjetas
  - `--color-surface-2` `#272b6c` — superficie secundaria (footer, variantes)
  - `--color-primary` `yellow-400` — acento principal, botones, texto destacado
  - `--color-secondary` `rose-500` — headings de sección, botón Ver CV
  - `--color-accent` `cyan-400` — acento terciario
  - `--color-border` `#323678` — bordes sutiles
- **Texto con degradado**: clase utilitaria `.text-gradient` (amarillo → rosa) para títulos destacados.
- **Tarjetas "glass"**: clase `.glass-card` — `color-mix(in oklab, surface 70%, transparent)` + `backdrop-filter: blur(12px)` + borde `--color-border`. Usar para cualquier bloque de contenido.
- **Tipografía tech**: `font-mono` para etiquetas, kickers y badges (uppercase, tracking-widest), sans-serif regular para el resto del contenido.
- **Interacción**: hover sutil (`hover:border-primary/60`, `hover:opacity-90`), sin animaciones agresivas.
- **Footer**: fondo diferenciado con `linear-gradient(to bottom, transparent → surface-2)` para separarlo visualmente de la página.
- **NeuralNetworkScene**: nodos en paleta `[0xa855f7, 0xfacc15, 0xf43f5e]` (púrpura/amarillo/rosa), `setClearColor(0x161950, 1)` para coincidir con `--color-bg`.

Al agregar nuevas secciones o páginas, reutilizar estas clases/variables en lugar de introducir colores o efectos nuevos, para mantener consistencia visual.

## Contenido

`src/pages/index.astro` solo compone las secciones del Home; cada sección vive como componente en `src/components/`: `Navbar`, `Hero`, `SobreMi`, `Proyectos`, `Formacion`, `Habilidades`, `Footer`. Las escenas especiales son `TrailerScene.astro` (título del juego + `GameMosaic` + audio + badge de reconocimiento) y `NeuralNetworkScene.astro` (Three.js + anime.js). `DockerScene.astro` existe en el repo pero no está en uso activo.

`Proyectos.astro` monta `<ProyectosIsla client:visible />` — la única isla React del sitio. `ProyectosIsla.tsx` carga los datos desde `public/data/proyectos.json` vía `axios` y renderiza las tarjetas en el cliente.

Las piezas pequeñas y reutilizables van en `src/components/atoms/`: `LanguageGrid`, `ToolGrid` (grids de íconos de [skillicons.dev](https://skillicons.dev)), `SoftSkillList` (habilidades blandas), `CertCard` (tarjeta linkeable — certificados, cursos, reconocimientos), `FormacionCard` (tarjeta estática — formación académica), `GameArt`, `GameMosaic`, `UnmuteButton`. Todas son componentes Astro estáticos (sin JS ni frameworks de UI).

`SoftSkillList` asigna a cada habilidad un color distinto (clases literales de Tailwind, p. ej. `border-rose-400/40` / `bg-rose-400/10` / `text-rose-300`) fuera de la paleta del tema, para diferenciarlas visualmente sin salirse del tono oscuro. Las clases deben escribirse completas (no con template strings dinámicos) para que el escáner de Tailwind las detecte.

Los datos de `Formacion.astro` viven en `src/data/formacion.ts` (interfaces `FormacionItem` y `CertItem`, arreglos `formacion`, `certificaciones`, `cursos`, `reconocimientos`). El contenido proviene del CV de Canva "Edahi CV". Si el CV se actualiza, reflejar los cambios en el archivo de datos correspondiente.

## Certificados y reconocimientos

Los certificados (PDF) viven en `public/certificados/` y se muestran en una página dedicada (p. ej. `src/pages/certificado-solana.astro`, `src/pages/curso-webscraping.astro`) con el PDF embebido en un `<iframe h-[80vh]>`, usando el mismo layout con `Navbar` y las clases del tema.

Los reconocimientos (imagen PNG) viven en `public/reconocimientos/` y se muestran en una página dedicada (p. ej. `src/pages/reconocimiento-videojuegos.astro`) con `<img>` dentro de una `glass-card`. Si la imagen está en orientación vertical (retrato) pero el documento original es horizontal, rotarla -90° con PIL antes de guardarla.

El punto de entrada de cada ítem es su `CertCard` en `Formacion.astro` (propiedad `href` en `src/data/formacion.ts`). El layout de todas estas páginas sigue el mismo patrón: `Navbar` + título + contenido + enlace de retorno al home.

## Showcase de proyectos

Los datos de `Proyectos.astro` viven en `src/data/proyectos.ts` (`Proyecto[]`, con `slug` e `imagenes` opcionales). Cuando un proyecto tiene `slug`, su tarjeta se renderiza como `<a href="/proyectos/{slug}">` con "Ver proyecto →"; sin `slug` se renderiza como `<article>` estático. La ruta dinámica `src/pages/proyectos/[slug].astro` usa `getStaticPaths()` sobre `proyectos` filtrando por `slug`, y muestra la galería de `imagenes` (o "Capturas próximamente." si el arreglo está vacío) con el mismo layout que `certificado-solana.astro`. Las capturas de cada proyecto viven en `public/proyectos/<slug>/`, recortadas para no mostrar barras de navegador/SO (barra de direcciones, marcadores, barra de tareas de Windows, barra de estado de Android, etc.) — solo el contenido de la app.

Proyectos "contenedor" (uno que integra a otros como piezas propias, no como proyectos paralelos — p. ej. RedDragon integrando a Tsubasa Engine y Denki Pipeline Designer) usan `contiene: string[]` (nombres de los proyectos integrados). Esos proyectos integrados marcan `anidadoEn: 'Nombre del contenedor'` para no renderizarse como tarjeta propia en la grilla del Home (siguen teniendo su propia página de showcase). La tarjeta del contenedor ocupa `sm:col-span-2` y muestra una sección "Integra & encierra" con mini-tarjetas de cada proyecto integrado (con su propio ícono de GitHub, corona si aplica, y "Ver proyecto →"); se resalta con un color distinto (rojo) al ámbar de "destacado" normal, para diferenciarse visualmente. Mismo patrón replicado en la página de showcase del contenedor.

Nota sobre imágenes pegadas en el chat: las imágenes que el usuario pega inline (no como adjunto vía `@ruta`) no existen como archivo accesible por las herramientas de shell/lectura en este entorno remoto; solo se reciben como contenido multimodal del mensaje. Para procesarlas (p. ej. recortarlas), hay que extraer su base64 desde el transcript de la sesión (`/root/.claude/projects/<proyecto>/<session-id>.jsonl`, bloques `content[].type == "image"` con `source.data`), decodificarlas a archivos temporales, y trabajar sobre esos archivos.
