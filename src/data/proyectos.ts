import proyectosData from '../../public/data/proyectos.json';

export type ProyectoImagen = {
	src: string;
	alt: string;
	descripcion: string;
	grupo?: string;
};

export type StackItem = { nombre: string; badge: string };

export type Proyecto = {
	nombre: string;
	descripcion: string;
	stack: StackItem[];
	slug?: string;
	imagenes?: ProyectoImagen[];
	repoUrl?: string;
	dockerHubUrl?: string;
	dockerHubUrls?: string[];
	documentacionUrl?: string;
	manualUrl?: string;
	liveUrl?: string;
	videoUrl?: string;
	destacado?: boolean;
	notaCapturas?: string;
	relacionados?: string[];
	contiene?: string[];
	anidadoEn?: string;
};

export const proyectos: Proyecto[] = proyectosData as Proyecto[];
