export type ProyectoImagen = {
	src: string;
	alt: string;
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
		imagenes: [],
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
