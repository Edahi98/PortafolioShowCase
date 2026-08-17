# Esquema de `public/data/proyectos.json`

Este archivo es la única fuente de verdad del catálogo de proyectos.  
Lo consume la isla React (`ProyectosIsla.tsx`) en runtime vía axios desde GitHub, y `src/data/proyectos.ts` lo importa en build time para generar las rutas estáticas (`/proyectos/[slug]`).

---

## Estructura

El archivo es un **array JSON** de objetos `Proyecto`.

```json
[ { ... }, { ... } ]
```

---

## Campos de `Proyecto`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `nombre` | `string` | ✅ | Nombre del proyecto (único, se usa como clave). |
| `descripcion` | `string` | ✅ | Descripción corta visible en la tarjeta. |
| `stack` | `StackItem[]` | ✅ | Tecnologías usadas, cada una con su badge. Al menos un elemento. |
| `slug` | `string` | — | Identificador URL. Si existe, la tarjeta enlaza a `/proyectos/{slug}` y se genera una página estática. |
| `imagenes` | `Imagen[]` | — | Galería de capturas mostrada en la página del proyecto. |
| `videos` | `Video[]` | — | Videos del proyecto. Se muestran apilados antes de la galería, en apartados separados según su `grupo`. |
| `repoUrl` | `string` | — | URL del repositorio en GitHub. Muestra badge con ícono y, en la página del proyecto, un bloque `git clone` copiable. |
| `dockerHubUrl` | `string` | — | URL de la imagen en Docker Hub. Muestra badge con ícono. Retrocompatibilidad: para varias imágenes usar `dockerHubUrls`. |
| `dockerHubUrls` | `string[]` | — | URLs de varias imágenes en Docker Hub. Cada una muestra su propio badge. |
| `documentacionUrl` | `string` | — | URL o ruta de la documentación (PDF u otro). Muestra badge verde. |
| `manualUrl` | `string` | — | URL o ruta del manual de usuario (PDF). Muestra badge cian. |
| `liveUrl` | `string` | — | URL del sitio en vivo. Muestra badge amarillo "Ver sitio". |
| `destacado` | `boolean` | — | `true` → aparece en el grupo "Proyectos destacados" con corona y borde cyan. |
| `notaCapturas` | `string` | — | Nota en cursiva bajo el stack (útil para proyectos sin capturas por derechos de autor). |
| `relacionados` | `string[]` | — | Nombres de otros proyectos relacionados. Se renderizan como enlaces si tienen `slug`. |
| `contiene` | `string[]` | — | Nombres de proyectos que este proyecto integra. Convierte la tarjeta en "contenedor" (borde púrpura, sección "Integra & encierra", ocupa columna doble). |
| `anidadoEn` | `string` | — | Nombre del proyecto contenedor. Si está presente, el proyecto **no** se renderiza como tarjeta propia en el home (sigue teniendo página de showcase). |

### Tipo `StackItem`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `nombre` | `string` | ✅ | Nombre de la tecnología. |
| `badge` | `string` | ✅ | URL del badge de shields.io (`style=for-the-badge`). |

### Tipo `Imagen`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `src` | `string` | ✅ | Ruta relativa (`/proyectos/slug/foto.jpg`) o URL absoluta. |
| `alt` | `string` | ✅ | Texto alternativo accesible. |
| `descripcion` | `string` | ✅ | Pie de foto visible bajo la imagen en la página del proyecto. |
| `grupo` | `string` | — | Agrupa la galería en columnas. Valores soportados: `"web"` (ícono Globe, "Aplicación web") y `"bot"` (ícono Bot, "Bot de Telegram"). |

### Tipo `Video`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `src` | `string` | ✅ | Ruta relativa (`/proyectos/slug/videos/01-intro.mp4`) o URL absoluta. |
| `titulo` | `string` | — | Título en mono/uppercase sobre la descripción. Si falta, no se renderiza. |
| `descripcion` | `string` | — | Pie de video bajo el reproductor. Si falta, no se renderiza. |
| `grupo` | `string` | — | Apartado en el que se agrupa el video. Valores soportados: `"demo"` (ícono Play, "Demo" — el sistema en uso) y `"explicativo"` (ícono Clapperboard, "Cómo funciona por dentro" — arquitectura y configuración). |

---

## Reglas de negocio

- **`slug` requerido para página propia**: solo los proyectos con `slug` generan una ruta `/proyectos/{slug}`. Sin `slug`, la tarjeta es un `<article>` estático sin enlace de detalle.
- **`contiene` implica contenedor**: si `contiene` tiene al menos un elemento, la tarjeta ocupa dos columnas, muestra borde/sombra púrpura y renderiza mini-tarjetas de cada sub-proyecto.
- **`anidadoEn` oculta la tarjeta del home**: el proyecto sigue accesible en `/proyectos/{slug}` pero no aparece en la grilla principal.
- **`destacado` y `anidadoEn` juntos** son válidos (p. ej. Tsubasa Engine y Denki son destacados y están anidados en RedDragon).
- Los nombres en `contiene`, `anidadoEn` y `relacionados` deben coincidir exactamente con el campo `nombre` del proyecto referenciado.
- Las imágenes de proyectos propios viven en `public/proyectos/{slug}/` y se referencian como `/proyectos/{slug}/archivo.jpg`. Deben estar recortadas: sin barra de navegador, barra de tareas ni elementos del SO.
- **Galería agrupada**: si al menos una imagen trae `grupo`, la galería se renderiza en dos columnas (una por grupo, en el orden de aparición); si ninguna lo trae, es una lista plana.
- Los videos viven junto a las capturas en `public/proyectos/{slug}/`; los explicativos de una serie, en su subcarpeta `videos/`. El orden del array `videos` es el orden en que se muestran.
- **Videos agrupados**: si al menos un video trae `grupo`, se renderiza un apartado por grupo (en el orden de aparición), cada uno con su encabezado y descripción; si ninguno lo trae, todos van en una sola lista sin encabezado.

---

## Ejemplo mínimo

```json
[
  {
    "nombre": "Mi Proyecto",
    "descripcion": "Descripción breve del proyecto.",
    "stack": [
      { "nombre": "TypeScript", "badge": "https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" }
    ]
  }
]
```

## Ejemplo completo

```json
[
  {
    "nombre": "RedDragon",
    "descripcion": "Extrae información de documentos Word, Excel y PDF sin captura manual.",
    "stack": [
      { "nombre": "Python", "badge": "https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" },
      { "nombre": "Docker", "badge": "https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" }
    ],
    "slug": "reddragon",
    "repoUrl": "https://github.com/Edahi98/RedDragon",
    "dockerHubUrls": ["https://hub.docker.com/r/edahisnacke/reddragon"],
    "manualUrl": "/proyectos/reddragon/manual.pdf",
    "liveUrl": "https://reddragon.example.com",
    "destacado": true,
    "contiene": ["Tsubasa Engine", "Denki Pipeline Designer"],
    "relacionados": ["Sistema de Gestión de Control de Cambios"],
    "videos": [
      {
        "src": "/proyectos/reddragon/demo.mp4",
        "titulo": "Demo de la aplicación web",
        "descripcion": "Recorrido por el flujo completo: se sube un documento y se descarga ya convertido.",
        "grupo": "demo"
      },
      {
        "src": "/proyectos/reddragon/videos/01-primeros-pasos.mp4",
        "titulo": "01 — Primeros pasos",
        "descripcion": "Qué es el sistema, sus piezas y cómo dejarlo arrancando.",
        "grupo": "explicativo"
      }
    ],
    "imagenes": [
      {
        "src": "https://raw.githubusercontent.com/Edahi98/RedDragon/master/docs/assets/test-environment.png",
        "alt": "Entorno de pruebas de RedDragon",
        "descripcion": "Pantalla de pruebas: se sube un documento y se ve cómo sale convertido.",
        "grupo": "web"
      }
    ]
  },
  {
    "nombre": "Tsubasa Engine",
    "descripcion": "Motor de procesamiento de datos con ~200 operaciones.",
    "stack": [
      { "nombre": "Rust", "badge": "https://img.shields.io/badge/-Rust-000000?style=for-the-badge&logo=rust&logoColor=white" }
    ],
    "slug": "tsubasa-engine",
    "repoUrl": "https://github.com/Edahi98/TsubasaEngine",
    "destacado": true,
    "anidadoEn": "RedDragon"
  }
]
```
