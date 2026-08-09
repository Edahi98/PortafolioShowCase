import { useState, useEffect } from 'react';
import axios from 'axios';
import { Crown } from 'lucide-react';
import type { Proyecto } from '../data/proyectos';
import { TarjetaProyecto } from './proyectos/TarjetaProyecto';
import { ArticuloProyecto } from './proyectos/ArticuloProyecto';

const JSON_URL =
	'https://raw.githubusercontent.com/Edahi98/PortafolioShowCase/main/public/data/proyectos.json';

export default function ProyectosIsla() {
	const [proyectos, setProyectos] = useState<Proyecto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		axios
			.get<Proyecto[]>(JSON_URL)
			.then((res) => {
				setProyectos(res.data);
				setLoading(false);
			})
			.catch(() => {
				setError('No se pudieron cargar los proyectos.');
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="glass-card h-48 animate-pulse rounded-2xl border border-border" />
				))}
			</div>
		);
	}

	if (error) {
		return <p className="font-mono text-sm text-slate-500">{error}</p>;
	}

	const visibles = proyectos.filter((p) => !p.anidadoEn);
	const destacados = visibles.filter((p) => p.destacado);
	const resto = visibles.filter((p) => !p.destacado);

	return (
		<>
			{[destacados, resto].map(
				(grupo, index) =>
					grupo.length > 0 && (
						<div key={index} className="flex flex-col gap-6">
							{index === 0 ? (
								<h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
									<Crown className="h-4 w-4" aria-hidden="true" />
									Proyectos destacados
								</h3>
							) : (
								<h3 className="font-mono text-xs tracking-widest text-secondary uppercase">
									Otros proyectos
								</h3>
							)}
							<div className="grid gap-6 sm:grid-cols-2">
								{grupo.map((proyecto) =>
									proyecto.slug ? (
										<TarjetaProyecto key={proyecto.nombre} proyecto={proyecto} todos={proyectos} />
									) : (
										<ArticuloProyecto key={proyecto.nombre} proyecto={proyecto} />
									)
								)}
							</div>
						</div>
					)
			)}
		</>
	);
}
