import proyectosData from '../../public/data/proyectos.json';

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
	documentacionUrl?: string;
	destacado?: boolean;
	notaCapturas?: string;
	relacionados?: string[];
	contiene?: string[];
	anidadoEn?: string;
};

export const proyectos: Proyecto[] = proyectosData as Proyecto[];
