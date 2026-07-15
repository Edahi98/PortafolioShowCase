# PortafolioShowCase

Portafolio personal de Edahi Yaxquin Avila Garcia, construido con [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com).

## Stack

- **Astro 5** (TypeScript en modo `strict`)
- **Tailwind CSS v4** vía `@tailwindcss/vite`
- **Three.js** para las escenas 3D del hero (contenedores estilo Docker) y de la sección "Sobre mí" (red neuronal)
- **anime.js** para las animaciones de la red neuronal

## Estructura del proyecto

```text
src/
├── components/
│   ├── atoms/            # piezas pequeñas y reutilizables (LanguageGrid, SoftSkillList)
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── SobreMi.astro
│   ├── Proyectos.astro
│   ├── Formacion.astro
│   ├── Habilidades.astro
│   ├── Contacto.astro
│   ├── DockerScene.astro
│   └── NeuralNetworkScene.astro
├── pages/
│   └── index.astro       # compone las secciones del Home
└── styles/
    └── global.css        # tema (paleta, tarjetas glass, texto en degradado)
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
