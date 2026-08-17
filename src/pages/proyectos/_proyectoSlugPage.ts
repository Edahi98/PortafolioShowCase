import { proyectos } from '../../data/proyectos';
import type { Proyecto, ProyectoImagen, ProyectoVideo } from '../../data/proyectos';

export type Agrupable = { grupo?: string };

export type GrupoMeta = { label: string; icon: 'Globe' | 'Bot' };

export const GRUPOS: Record<string, GrupoMeta> = {
	web: { label: 'Aplicación web', icon: 'Globe' },
	bot: { label: 'Bot de Telegram', icon: 'Bot' },
};

export type GrupoVideoMeta = { label: string; descripcion: string; icon: 'Play' | 'Clapperboard' };

export const GRUPOS_VIDEO: Record<string, GrupoVideoMeta> = {
	demo: {
		label: 'Demo',
		descripcion: 'El sistema en uso, visto desde afuera.',
		icon: 'Play',
	},
	explicativo: {
		label: 'Cómo funciona por dentro',
		descripcion: 'Serie de videos sobre la arquitectura y la configuración del proyecto.',
		icon: 'Clapperboard',
	},
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
	 * @param items - Capturas o videos de un proyecto.
	 * @returns `true` si algún elemento trae `grupo` (se renderiza agrupado).
	 */
	static tieneGrupos(items: Agrupable[]): boolean {
		return items.some((item) => item.grupo);
	}

	/**
	 * @param items - Capturas o videos de un proyecto agrupados.
	 * @returns Los identificadores de `grupo` únicos, en el orden en que aparecen.
	 */
	static getGruposOrdenados(items: Agrupable[]): string[] {
		return [...new Set(items.map((item) => item.grupo).filter(Boolean))] as string[];
	}
}
