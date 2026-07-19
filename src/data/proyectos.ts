export type ProyectoImagen = {
	src: string;
	alt: string;
	descripcion: string;
};

export type Proyecto = {
	nombre: string;
	descripcion: string;
	stack: string[];
	slug?: string;
	imagenes?: ProyectoImagen[];
	repoUrl?: string;
	dockerHubUrl?: string;
	destacado?: boolean;
	notaCapturas?: string;
	relacionados?: string[];
};

export const proyectos: Proyecto[] = [
	{
		nombre: 'Sistema de Gestión de Inventario de Casa',
		descripcion:
			'Aplicación web con Node.js y automatización de gestión desde un chatbot de Telegram con agente de IA local, creado con Langchain y Langgraph.',
		stack: ['Node.js', 'Telegram Bot', 'Langchain', 'Langgraph', 'IA Local'],
	},
	{
		nombre: 'Sistema de Gestión Escolar',
		descripcion:
			'Descarga masiva de expedientes de estudiantes para la Universidad Tecnológica de Tecámac, con pruebas de estrés.',
		stack: ['C#', '.NET', 'Pruebas de estrés'],
		destacado: true,
		notaCapturas: 'No se pueden mostrar capturas por derechos de autor.',
	},
	{
		nombre: 'Sistema POS - Paletería',
		descripcion:
			'Aplicación web con algoritmos de Machine Learning, desarrollada con metodología DevOps.',
		stack: ['Laravel', 'Machine Learning', 'DevOps'],
		slug: 'creamyx',
		imagenes: [
			{
				src: '/proyectos/creamyx/sitio-publico-productos.jpg',
				alt: 'Catálogo público de Creamyx',
				descripcion: 'Sitio público: catálogo de productos con filtros por categoría (Todos, Aguas, Paleta).',
			},
			{
				src: '/proyectos/creamyx/panel-gestion.jpg',
				alt: 'Panel de gestión de Creamyx',
				descripcion: 'Panel de gestión: accesos rápidos a Dashboard, POS/Ventas y Productos, con métricas del día.',
			},
			{
				src: '/proyectos/creamyx/pos.jpg',
				alt: 'Punto de venta (POS) de Creamyx',
				descripcion: 'Punto de venta (POS): selección de productos por categoría para armar el carrito de una venta.',
			},
			{
				src: '/proyectos/creamyx/productos.jpg',
				alt: 'Catálogo de productos de Creamyx',
				descripcion: 'Catálogo de productos: listado con precio y stock, y accesos para dar de alta uno nuevo.',
			},
			{
				src: '/proyectos/creamyx/nuevo-producto.jpg',
				alt: 'Formulario de nuevo producto de Creamyx',
				descripcion: 'Alta de producto: formulario con nombre, categoría, tipo de venta, descripción e imagen.',
			},
			{
				src: '/proyectos/creamyx/ventas.jpg',
				alt: 'Historial de ventas de Creamyx',
				descripcion: 'Historial de ventas: totales del día y detalle de cada transacción, con exportación a PDF.',
			},
			{
				src: '/proyectos/creamyx/dashboard.jpg',
				alt: 'Dashboard de Creamyx',
				descripcion: 'Dashboard: resumen general con accesos directos a Productos, Ventas y Reportes.',
			},
			{
				src: '/proyectos/creamyx/configuracion-critica.jpg',
				alt: 'Configuración crítica de Creamyx',
				descripcion: 'Configuración crítica: ajustes sensibles del sistema y estado general (usuarios, ventas, ingresos).',
			},
		],
	},
	{
		nombre: 'Sistema de Gestión de Inventario - Taller Mecánico',
		descripcion: 'Aplicación web para clientes y ventas, desplegada con Docker y Nginx.',
		stack: ['Laravel', 'Docker', 'Nginx'],
		slug: 'taller-mecanico',
		repoUrl: 'https://github.com/Edahi98/LosHermanos_Inventario',
		dockerHubUrl: 'https://hub.docker.com/r/edahisnacke/los-hermanos-web',
		imagenes: [
			{
				src: '/proyectos/taller-mecanico/home.jpg',
				alt: 'Página de inicio del inventario Los Hermanos',
				descripcion: 'Inicio: presentación del sistema y accesos rápidos a Categorías, Marcas y Artículos.',
			},
			{
				src: '/proyectos/taller-mecanico/articulos.jpg',
				alt: 'Listado de artículos del inventario Los Hermanos',
				descripcion: 'Artículos: listado filtrable por nombre, categoría y marca, con alta de nuevos artículos.',
			},
			{
				src: '/proyectos/taller-mecanico/marcas.jpg',
				alt: 'Listado de marcas del inventario Los Hermanos',
				descripcion: 'Marcas: catálogo de marcas de refacciones, con filtro y alta de nuevas marcas.',
			},
			{
				src: '/proyectos/taller-mecanico/categorias.jpg',
				alt: 'Listado de categorías del inventario Los Hermanos',
				descripcion: 'Categorías: catálogo de categorías de productos, con filtro y alta de nuevas categorías.',
			},
			{
				src: '/proyectos/taller-mecanico/agregar-categoria.jpg',
				alt: 'Formulario para agregar categoría en el inventario Los Hermanos',
				descripcion: 'Alta de categoría: formulario simple para registrar una nueva categoría.',
			},
		],
	},
	{
		nombre: 'Sistema de Gestión de Control de Cambios',
		descripcion:
			'Manejo de versiones de documentos para Gestión de Calidad, con extracción de metadatos asistida por IA local, Machine Learning y heurística para equipos de bajos recursos.',
		stack: ['IA Local', 'Machine Learning', 'Heurística'],
		relacionados: ['Denki Pipeline Designer', 'Tsubasa Engine'],
	},
	{
		nombre: 'Denki Pipeline Designer',
		descripcion:
			'Aplicación de escritorio (Electron) para diseñar visualmente pipelines de datos y Machine Learning sobre Polars, arrastrando nodos y ejecutándolos contra un backend Python local.',
		stack: ['Electron', 'React', 'TypeScript', 'Polars', 'Machine Learning'],
		slug: 'denki-pipeline-designer',
		repoUrl: 'https://github.com/Edahi98/DenkiPepelineDesigner',
		relacionados: ['Sistema de Gestión de Control de Cambios', 'Tsubasa Engine'],
		imagenes: [
			{
				src: 'https://raw.githubusercontent.com/Edahi98/DenkiPepelineDesigner/master/img/imagen1.png',
				alt: 'Canvas de diseño de pipelines de Denki',
				descripcion: 'El canvas: arrastra nodos desde la paleta y conéctalos para armar el pipeline.',
			},
			{
				src: 'https://raw.githubusercontent.com/Edahi98/DenkiPepelineDesigner/master/img/imagen2.png',
				alt: 'Modal de resultado de ejecución de Denki',
				descripcion: 'Resultado de ejecución: inspecciona el DataFrame/Series resultante, o su equivalente en SQL.',
			},
			{
				src: 'https://raw.githubusercontent.com/Edahi98/DenkiPepelineDesigner/master/img/imagen3.png',
				alt: 'Biblioteca de ejemplos de pipelines de Denki',
				descripcion: 'Biblioteca de ejemplos: pipelines listos para cargar y aprender de ellos.',
			},
			{
				src: 'https://raw.githubusercontent.com/Edahi98/DenkiPepelineDesigner/master/img/imagen4.png',
				alt: 'Manual de referencia de nodos de Denki',
				descripcion: 'Manual de nodos: ayuda contextual por categoría, con flujos típicos de un click.',
			},
		],
	},
	{
		nombre: 'Tsubasa Engine',
		descripcion:
			'Motor de ejecución detrás de Denki: compila un grafo de nodos a un AST tipado y lo ejecuta con Polars, con ~177 operaciones sobre Series y un registro canónico en Rust.',
		stack: ['Python', 'Polars', 'Rust', 'scikit-learn', 'Flask'],
		slug: 'tsubasa-engine',
		repoUrl: 'https://github.com/Edahi98/TsubasaEngine',
		relacionados: ['Sistema de Gestión de Control de Cambios', 'Denki Pipeline Designer'],
		imagenes: [
			{
				src: 'https://raw.githubusercontent.com/Edahi98/TsubasaEngine/main/img/cliente.png',
				alt: 'Denki Pipeline Designer, cliente visual de Tsubasa Engine',
				descripcion:
					'Denki Pipeline Designer: el editor visual cliente que arma el grafo de nodos y se lo manda a Tsubasa vía POST /execute.',
			},
		],
	},
];
