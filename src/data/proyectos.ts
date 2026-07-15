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
	},
	{
		nombre: 'Sistema POS - Paletería',
		descripcion:
			'Aplicación web con algoritmos de Machine Learning, desarrollada con metodología DevOps.',
		stack: ['Laravel', 'Machine Learning', 'DevOps'],
		slug: 'creamyx',
		imagenes: [
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
	},
	{
		nombre: 'Sistema de Gestión de Control de Cambios',
		descripcion:
			'Manejo de versiones de documentos para Gestión de Calidad, con extracción de metadatos asistida por IA local, Machine Learning y heurística para equipos de bajos recursos.',
		stack: ['IA Local', 'Machine Learning', 'Heurística'],
	},
];
