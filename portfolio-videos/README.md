# Serie de videos — InventarioArticulosCasa

Tres videos explicativos generados para documentar el proyecto **InventarioArticulosCasa**
(sistema de inventario doméstico: frontend Vue 3 + backend Express/Drizzle + agente
conversacional con IA + bot de Telegram). Producidos con [HyperFrames](https://hyperframes.heygen.com),
mismo estilo visual y voz en toda la serie (paleta "candy", tipografía Bodoni Moda /
Space Grotesk, narración en español).

## Videos

### 01 — Primeros pasos (`01-primeros-pasos.mp4`, 1m 08s)

Introducción general al sistema: qué es InventarioArticulosCasa y sus cuatro piezas
(frontend, backend, agente, bot), cómo configurarlo para arrancar (variables de entorno
esenciales, `docker-compose`, creación de usuario admin), y qué puede hacer el agente
conversando por Telegram — consultar y editar artículos, categorías, notas e imágenes,
con búsqueda semántica. Incluye capturas reales del bot en uso.

### 02 — Variables de entorno (`02-variables-de-entorno.mp4`, 1m 05s)

Referencia técnica de los cuatro archivos `.env` del proyecto (raíz, backend, agente,
bot), agrupando las variables del backend por tema (base de datos, almacenamiento,
servidor) y cerrando con los errores de configuración más comunes y la regla de
copiar siempre desde `.env.example`.

### 03 — URLs dentro de Docker (`03-urls-docker.mp4`, 1m 51s)

El más profundo de la serie: cómo Docker resuelve las URLs entre servicios. Explica
por qué `localhost` no funciona entre contenedores, la cadena real de nombres de
servicio del proyecto (`bot → inventario-agente:5000 → inventario-backend:4000 →
db:5432`), el uso de `host.docker.internal` como puente hacia servicios que corren
fuera de Docker (Ollama), y la diferencia entre URLs internas (fijas en
`docker-compose.yaml`) y URLs públicas como `VITE_API_URL` / `PUBLIC_URL`, pensadas
para quien accede desde afuera del compose.

## Notas de producción

- Formato: 1920×1080, MP4.
- Narración generada con TTS offline (Kokoro, voz `ef_dora`, español).
- Diseño: preset "capsule" — paleta candy con gradientes radiales, geometría de
  píldoras, contorno de tinta de 2px.
- Sin música de fondo ni subtítulos automáticos (limitaciones del pipeline offline
  usado en esta producción).
