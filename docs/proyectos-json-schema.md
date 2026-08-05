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
| `stack` | `string[]` | ✅ | Tecnologías usadas. Al menos un elemento. |
| `slug` | `string` | — | Identificador URL. Si existe, la tarjeta enlaza a `/proyectos/{slug}` y se genera una página estática. |
| `imagenes` | `Imagen[]` | — | Galería de capturas mostrada en la página del proyecto. |
| `repoUrl` | `string` | — | URL del repositorio en GitHub. Muestra badge con ícono. |
| `dockerHubUrl` | `string` | — | URL de la imagen en Docker Hub. Muestra badge con ícono. |
| `documentacionUrl` | `string` | — | URL o ruta de la documentación (PDF u otro). Muestra badge verde. |
| `destacado` | `boolean` | — | `true` → aparece en el grupo "Proyectos destacados" con corona y borde cyan. |
| `notaCapturas` | `string` | — | Nota en cursiva bajo el stack (útil para proyectos sin capturas por derechos de autor). |
| `relacionados` | `string[]` | — | Nombres de otros proyectos relacionados. Se renderizan como enlaces si tienen `slug`. |
| `contiene` | `string[]` | — | Nombres de proyectos que este proyecto integra. Convierte la tarjeta en "contenedor" (borde púrpura, sección "Integra & encierra", ocupa columna doble). |
| `anidadoEn` | `string` | — | Nombre del proyecto contenedor. Si está presente, el proyecto **no** se renderiza como tarjeta propia en el home (sigue teniendo página de showcase). |

### Tipo `Imagen`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `src` | `string` | ✅ | Ruta relativa (`/proyectos/slug/foto.jpg`) o URL absoluta. |
| `alt` | `string` | ✅ | Texto alternativo accesible. |
| `descripcion` | `string` | ✅ | Pie de foto visible bajo la imagen en la página del proyecto. |

---

## Reglas de negocio

- **`slug` requerido para página propia**: solo los proyectos con `slug` generan una ruta `/proyectos/{slug}`. Sin `slug`, la tarjeta es un `<article>` estático sin enlace de detalle.
- **`contiene` implica contenedor**: si `contiene` tiene al menos un elemento, la tarjeta ocupa dos columnas, muestra borde/sombra púrpura y renderiza mini-tarjetas de cada sub-proyecto.
- **`anidadoEn` oculta la tarjeta del home**: el proyecto sigue accesible en `/proyectos/{slug}` pero no aparece en la grilla principal.
- **`destacado` y `anidadoEn` juntos** son válidos (p. ej. Tsubasa Engine y Denki son destacados y están anidados en RedDragon).
- Los nombres en `contiene`, `anidadoEn` y `relacionados` deben coincidir exactamente con el campo `nombre` del proyecto referenciado.
- Las imágenes de proyectos propios viven en `public/proyectos/{slug}/` y se referencian como `/proyectos/{slug}/archivo.jpg`. Deben estar recortadas: sin barra de navegador, barra de tareas ni elementos del SO.

---

## Ejemplo mínimo

```json
[
  {
    "nombre": "Mi Proyecto",
    "descripcion": "Descripción breve del proyecto.",
    "stack": ["TypeScript", "Node.js"]
  }
]
```

## Ejemplo completo

```json
[
  {
    "nombre": "RedDragon",
    "descripcion": "Extrae información de documentos Word, Excel y PDF sin captura manual.",
    "stack": ["Python", "FastAPI", "Docker", "React"],
    "slug": "reddragon",
    "repoUrl": "https://github.com/Edahi98/RedDragon",
    "destacado": true,
    "contiene": ["Tsubasa Engine", "Denki Pipeline Designer"],
    "relacionados": ["Sistema de Gestión de Control de Cambios"],
    "imagenes": [
      {
        "src": "https://raw.githubusercontent.com/Edahi98/RedDragon/master/docs/assets/test-environment.png",
        "alt": "Entorno de pruebas de RedDragon",
        "descripcion": "Pantalla de pruebas: se sube un documento y se ve cómo sale convertido."
      }
    ]
  },
  {
    "nombre": "Tsubasa Engine",
    "descripcion": "Motor de procesamiento de datos con ~200 operaciones.",
    "stack": ["Python", "Polars", "Rust"],
    "slug": "tsubasa-engine",
    "repoUrl": "https://github.com/Edahi98/TsubasaEngine",
    "destacado": true,
    "anidadoEn": "RedDragon"
  }
]
```
