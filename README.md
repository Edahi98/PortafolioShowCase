# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com).

🔗 **Demo en vivo:** [portafolioshowcase.vercel.app](https://portafolioshowcase.vercel.app)

## Capturas

| Hero | Móvil |
| :--: | :--: |
| ![Hero con escena 3D de contenedores](./docs/screenshots/hero.png) | ![Vista móvil](./docs/screenshots/mobile.png) |

| Sección de Proyectos |
| :--: |
| ![Sección de Proyectos](./docs/screenshots/proyectos.png) |

<details>
<summary>Ver página completa</summary>

![Home completo](./docs/screenshots/home-full.png)

</details>

## Stack

- **Astro 5** (TypeScript en modo `strict`)
- **Tailwind CSS v4** vía `@tailwindcss/vite`
- **React 19** — únicamente para islas interactivas (ver sección de arquitectura)
- **Three.js** para las escenas 3D del hero (contenedores estilo Docker) y de la sección "Sobre mí" (red neuronal)
- **anime.js** para las animaciones de la red neuronal
- **axios** para el fetch del catálogo de proyectos desde GitHub

## Arquitectura de islas (Astro + React)

El sitio es **SSG puro** (Static Site Generation): Astro genera todas las páginas en HTML estático en tiempo de build. No hay servidor en runtime.

Para la sección de Proyectos se usa el patrón de **islas de Astro** (`client:visible`): el resto del DOM es HTML estático, y solo el componente `ProyectosIsla` se hidrata en el cliente cuando entra al viewport.

```mermaid
graph TD
    subgraph SSG["index.astro — SSG (HTML estático)"]
        Navbar["Navbar.astro\n— HTML estático, 0 JS"]
        Hero["Hero.astro\n— HTML estático, 0 JS"]
        SobreMi["SobreMi.astro\n— HTML estático, 0 JS"]
        subgraph Wrapper["Proyectos.astro (wrapper)"]
            Isla["⚛️ ProyectosIsla.tsx\nclient:visible\nuseEffect → axios.get → proyectos.json → render tarjetas"]
        end
        Formacion["Formacion.astro\n— HTML estático, 0 JS"]
        Habilidades["Habilidades.astro\n— HTML estático, 0 JS"]
        Footer["Footer.astro\n— HTML estático, 0 JS"]
    end

    Navbar --> Hero --> SobreMi --> Wrapper --> Formacion --> Habilidades --> Footer
```

### Flujo de datos de proyectos

```mermaid
flowchart TD
    JSON["📄 public/data/proyectos.json\nfuente de verdad única"]

    JSON --> BT & RT

    subgraph BT["BUILD TIME — Astro SSG"]
        TS["src/data/proyectos.ts\nre-exporta con tipos"]
        Slug["src/pages/proyectos/[slug].astro\ngetStaticPaths()"]
        Pages["páginas estáticas generadas\n/proyectos/creamyx\n/proyectos/reddragon\n…"]
        TS --> Slug --> Pages
    end

    subgraph RT["RUNTIME — isla React"]
        Axios["axios.get(raw.githubusercontent.com)"]
        Isla["ProyectosIsla.tsx\nrenderiza tarjetas"]
        Axios --> Isla
    end
```

> Para actualizar el catálogo basta con editar `public/data/proyectos.json` y hacer push a `main`; el sitio se redeploya automáticamente en Vercel.

Ver [docs/proyectos-json-schema.md](./docs/proyectos-json-schema.md) para el esquema completo del JSON.

### Directiva `client:visible`

`<ProyectosIsla client:visible />` le indica a Astro que:

1. En el build, el componente se pre-renderiza a HTML estático (skeleton vacío).
2. En el cliente, el JS de React se descarga e hidrata **solo cuando el elemento entra al viewport** (Intersection Observer), no al cargar la página.

Esto mantiene el Time to Interactive bajo: el JS de React y axios solo se ejecuta si el usuario llega a ver la sección.

## Estructura del proyecto

```text
src/
├── components/
│   ├── atoms/                   # piezas pequeñas reutilizables
│   │   ├── LanguageGrid.astro
│   │   ├── ToolGrid.astro
│   │   └── SoftSkillList.astro
│   ├── ProyectosIsla.tsx        # isla React (única excepción a Astro puro)
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── SobreMi.astro
│   ├── Proyectos.astro          # wrapper que monta la isla
│   ├── Formacion.astro
│   ├── Habilidades.astro
│   ├── Footer.astro
│   ├── DockerScene.astro
│   └── NeuralNetworkScene.astro
├── data/
│   └── proyectos.ts             # tipos + re-exporta public/data/proyectos.json
├── pages/
│   ├── index.astro              # compone las secciones del Home
│   ├── cv.astro
│   ├── certificado-solana.astro
│   └── proyectos/
│       └── [slug].astro         # página dinámica por proyecto
└── styles/
    └── global.css               # tema (paleta, tarjetas glass, texto en degradado)

public/
└── data/
    └── proyectos.json           # fuente de verdad del catálogo

docs/
├── proyectos-json-schema.md     # esquema del JSON de proyectos
└── screenshots/
```

Ver [CLAUDE.md](./CLAUDE.md) para el detalle del sistema de diseño.

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando           | Acción                                          |
| :----------------- | :----------------------------------------------- |
| `npm install`       | Instala las dependencias                          |
| `npm run dev`       | Levanta el servidor de desarrollo en `localhost:4321` |
| `npm run build`     | Compila el sitio para producción en `./dist/`     |
| `npm run preview`   | Previsualiza el build de producción localmente    |
