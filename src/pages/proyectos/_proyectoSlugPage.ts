import { proyectos } from '../../data/proyectos';
import type { Proyecto, ProyectoImagen, ProyectoVideo } from '../../data/proyectos';

export type GrupoMeta = { label: string; icon: 'Globe' | 'Bot' };

export const GRUPOS: Record<string, GrupoMeta> = {
	web: { label: 'Aplicación web', icon: 'Globe' },
	bot: { label: 'Bot de Telegram', icon: 'Bot' },
};

export class ProyectoSlugPage {
	/**
	 * @returns Las rutas estáticas de Astro (`params`/`props`) para cada proyecto con `slug`.
	 */
	static getStaticPaths() {
		return proyectos
			.filter((proyecto) => proyecto.slug)
			.map((proyecto) => ({
				params: { slug: proyecto.slug },
				props: { proyecto },
			}));
	}

	/**
	 * @param proyecto - Proyecto cuyo campo `relacionados` (nombres) se va a resolver.
	 * @returns Los proyectos referenciados en `relacionados` que existen en el catálogo.
	 */
	static getRelacionados(proyecto: Proyecto): Proyecto[] {
		return (proyecto.relacionados ?? [])
			.map((nombre: string) => proyectos.find((p) => p.nombre === nombre))
			.filter((p): p is Proyecto => Boolean(p));
	}

	/**
	 * @param proyecto - Proyecto contenedor cuyo campo `contiene` (nombres) se va a resolver.
	 * @returns Los proyectos integrados referenciados en `contiene` que existen en el catálogo.
	 */
	static getContenidos(proyecto: Proyecto): Proyecto[] {
		return (proyecto.contiene ?? [])
			.map((nombre: string) => proyectos.find((p) => p.nombre === nombre))
			.filter((p): p is Proyecto => Boolean(p));
	}

	/**
	 * @param proyecto - Proyecto del que se obtienen las capturas.
	 * @returns El arreglo `imagenes` del proyecto, o vacío si no tiene capturas.
	 */
	static getImagenes(proyecto: Proyecto): ProyectoImagen[] {
		return proyecto.imagenes ?? [];
	}

	static getVideos(proyecto: Proyecto): ProyectoVideo[] {
		return proyecto.videos ?? [];
	}

	/**
	 * @param imagenes - Capturas de un proyecto.
	 * @returns `true` si alguna imagen trae `grupo` (galería agrupada en columnas).
	 */
	static tieneGrupos(imagenes: ProyectoImagen[]): boolean {
		return imagenes.some((img) => img.grupo);
	}

	/**
	 * @param imagenes - Capturas de un proyecto con galería agrupada.
	 * @returns Los identificadores de `grupo` únicos, en el orden en que aparecen.
	 */
	static getGruposOrdenados(imagenes: ProyectoImagen[]): string[] {
		return [...new Set(imagenes.map((img) => img.grupo).filter(Boolean))] as string[];
	}
}
