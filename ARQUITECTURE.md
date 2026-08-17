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

`Proyectos.astro` monta `<ProyectosIsla client:visible />` — la única isla React del sitio. `ProyectosIsla.tsx` es el orquestador: carga `public/data/proyectos.json` vía `axios` desde GitHub raw, agrupa en "Proyectos principales" / "Otros proyectos" y renderiza la grilla. Los componentes React de proyectos siguen atomic design en `src/components/proyectos/`:
- `StackBadge.tsx` — átomo: imagen `<img>` del badge de shields.io para una tecnología
- `IconBadge.tsx` — átomo: botón circular con variantes de color (`plain`, `emerald`, `cyan`, `yellow`) para los íconos de esquina de la tarjeta (GitHub, Docker, Docs, Manual, Live)
- `TarjetaProyecto.tsx` — molécula: tarjeta con link overlay, hover de imagen, `IconBadge`s de repo/Docker/docs/manual/live y sección "Integra & encierra" para contenedores
- `ArticuloProyecto.tsx` — molécula: tarjeta estática (sin link) para proyectos sin `slug`

El campo `stack` en `public/data/proyectos.json` es `{ nombre: string; badge: string }[]` — cada tecnología lleva su propia URL de badge de shields.io (`style=for-the-badge`). Al agregar una tecnología nueva, añadir su entrada directamente en el JSON. El JSON se puede editar directamente en GitHub para actualizar proyectos sin redeploy; el componente lo carga en runtime desde GitHub raw.

Las piezas pequeñas y reutilizables de Astro van en `src/components/atoms/`: `LanguageGrid`, `ToolGrid` (grids de íconos de [skillicons.dev](https://skillicons.dev)), `SoftSkillList` (habilidades blandas), `CertCard` (tarjeta linkeable — certificados, cursos, reconocimientos), `FormacionCard` (tarjeta estática — formación académica), `GameArt`, `GameMosaic`, `UnmuteButton`. Los componentes transversales como `PillLink` (botón pill con variantes `emerald`/`cyan`/`primary` para Docs/Manual/Ver sitio) y `IconLink` (enlace con ícono de imagen) se encuentran en `src/shared/atoms/`. Todas son componentes Astro estáticos (sin JS ni frameworks de UI).

`SoftSkillList` asigna a cada habilidad un color distinto (clases literales de Tailwind, p. ej. `border-rose-400/40` / `bg-rose-400/10` / `text-rose-300`) fuera de la paleta del tema, para diferenciarlas visualmente sin salirse del tono oscuro. Las clases deben escribirse completas (no con template strings dinámicos) para que el escáner de Tailwind las detecte.

Los datos de `Formacion.astro` viven en `src/data/formacion.ts` (interfaces `FormacionItem` y `CertItem`, arreglos `formacion`, `certificaciones`, `cursos`, `reconocimientos`). El contenido proviene del CV de Canva "Edahi CV". Si el CV se actualiza, reflejar los cambios en el archivo de datos correspondiente.

## Certificados y reconocimientos

Los certificados (PDF) viven en `public/certificados/` y se muestran en una página dedicada (p. ej. `src/pages/certificado-solana.astro`, `src/pages/curso-webscraping.astro`) utilizando el layout estandarizado `src/components/layouts/PDF.astro`.

Los reconocimientos (imagen PNG) viven en `public/reconocimientos/` y se muestran en una página dedicada (p. ej. `src/pages/reconocimiento-videojuegos.astro`) utilizando el layout estandarizado `src/components/layouts/Page.astro`. Si la imagen está en orientación vertical (retrato) pero el documento original es horizontal, rotarla -90° con PIL antes de guardarla.

El punto de entrada de cada ítem es su `CertCard` en `Formacion.astro` (propiedad `href` en `src/data/formacion.ts`). Estos layouts unifican la cabecera (Navbar), metadatos, título, visualización del contenido y botón de retorno.

## Showcase de proyectos

Los datos de proyectos viven en `public/data/proyectos.json` (fuente de verdad en runtime) y sus tipos en `src/data/proyectos.ts`. Tipos relevantes:

```ts
type StackItem     = { nombre: string; badge: string };
type ProyectoImagen = { src: string; alt: string; descripcion: string; grupo?: string };
type ProyectoVideo  = { src: string; titulo?: string; descripcion?: string; grupo?: string; colores?: string[] };
type Proyecto = {
  nombre: string; descripcion: string; stack: StackItem[];
  slug?: string; imagenes?: ProyectoImagen[]; videos?: ProyectoVideo[];
  repoUrl?: string; dockerHubUrl?: string; dockerHubUrls?: string[];
  documentacionUrl?: string; manualUrl?: string; liveUrl?: string;
  destacado?: boolean; notaCapturas?: string;
  relacionados?: string[]; contiene?: string[]; anidadoEn?: string;
};
```

- `dockerHubUrls` (array) admite múltiples imágenes Docker; `dockerHubUrl` (singular) existe para retrocompatibilidad.
- `manualUrl` — PDF de manual de usuario (botón cian "Manual de usuario", diferente al botón verde "Documentación" de `documentacionUrl`).
- `liveUrl` — URL del sitio en vivo (botón amarillo "Ver sitio").
- `videos` — lista de videos del proyecto. Se renderizan antes de la galería (`_organisms/ProyectoVideo.astro` + `_atoms/VideoFigura.astro`), cada uno con su título y descripción opcionales. Los archivos viven en `public/proyectos/<slug>/` (los explicativos, en su subcarpeta `videos/`).

**Videos agrupados**: igual que la galería, si algún video tiene `grupo` se renderiza un apartado por grupo (encabezado + descripción de la sección), en el orden de aparición; sin `grupo`, todos van en una lista única sin encabezado. Grupos soportados (`GRUPOS_VIDEO` en `_proyectoSlugPage.ts`): `"demo"` (ícono Play, "Demo" — el producto en uso) y `"explicativo"` (ícono Clapperboard, "Cómo funciona por dentro" — arquitectura y configuración). Los helpers `tieneGrupos`/`getGruposOrdenados` son compartidos entre imágenes y videos (tipo `Agrupable`).

**Nube de color**: un video con `colores` (hex de sus tonos dominantes) se envuelve en `_atoms/NubeFrame.astro`, un marco con silueta de nube en SVG (círculos + cuerpo redondeado bajo un mismo degradado `userSpaceOnUse`, `blur` + `mix-blend-mode: screen` sobre el fondo oscuro). Sin `colores`, `NubeFrame` renderiza solo su slot, así que el mismo `VideoFigura` sirve para videos con y sin nube. Los colores se obtienen muestreando fotogramas del video con ffmpeg y quedándose con las familias de tono más saturadas — así la nube usa la paleta real de cada video, no una decorativa.

Cuando un proyecto tiene `slug`, su tarjeta se renderiza como `<a href="/proyectos/{slug}">` con "Ver proyecto →"; sin `slug` se renderiza como `<article>` estático. La ruta dinámica `src/pages/proyectos/[slug].astro` usa `getStaticPaths()` sobre `proyectos` filtrando por `slug`, y muestra la galería de `imagenes`. Esta página de showcase está modularizada con sus propios subcomponentes en `src/pages/proyectos/_atoms/` y `src/pages/proyectos/_organisms/`, junto a utilidades en `_proyectoSlugPage.ts`. Las capturas de cada proyecto viven en `public/proyectos/<slug>/`, recortadas para no mostrar barras de navegador/SO.

**Galería agrupada**: si alguna imagen tiene `grupo`, la galería se muestra en dos columnas lado a lado (`sm:grid-cols-2`), una columna por grupo. Grupos soportados: `"web"` (ícono Globe, etiqueta "Aplicación web") y `"bot"` (ícono Bot, etiqueta "Bot de Telegram"). Sin `grupo`, la galería es una lista plana. Los botones de la cabecera del showcase usan átomos: `IconLink` para GitHub/Docker y `PillLink` para Documentación/Manual/Ver sitio.

Proyectos "contenedor" (uno que integra a otros como piezas propias, no como proyectos paralelos — p. ej. RedDragon integrando a Tsubasa Engine y Denki Pipeline Designer) usan `contiene: string[]` (nombres de los proyectos integrados). Esos proyectos integrados marcan `anidadoEn: 'Nombre del contenedor'` para no renderizarse como tarjeta propia en la grilla del Home (siguen teniendo su propia página de showcase). La tarjeta del contenedor ocupa `sm:col-span-2` y muestra una sección "Integra & encierra" con mini-tarjetas de cada proyecto integrado (con su propio ícono de GitHub, corona si aplica, y "Ver proyecto →"); se resalta con un color distinto (rojo) al ámbar de "destacado" normal, para diferenciarse visualmente. Mismo patrón replicado en la página de showcase del contenedor.

Nota sobre imágenes pegadas en el chat: las imágenes que el usuario pega inline (no como adjunto vía `@ruta`) no existen como archivo accesible por las herramientas de shell/lectura en este entorno remoto; solo se reciben como contenido multimodal del mensaje. Para procesarlas (p. ej. recortarlas), hay que extraer su base64 desde el transcript de la sesión, decodificarlas a archivos temporales, y trabajar sobre esos archivos.
