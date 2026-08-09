import { Crown } from 'lucide-react';
import type { Proyecto } from '../../data/proyectos';
import { StackBadge } from './StackBadge';

export function ArticuloProyecto({ proyecto }: { proyecto: Proyecto }) {
	return (
		<article
			className={[
				'glass-card flex flex-col gap-3 rounded-2xl p-6 transition hover:border-primary/60',
				proyecto.destacado ? 'border-primary/50 shadow-[0_0_24px_-6px] shadow-primary/30' : '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<div className="flex items-start gap-2">
				<h3 className="text-lg font-semibold text-slate-100">{proyecto.nombre}</h3>
				{proyecto.destacado && (
					<Crown className="h-5 w-5 shrink-0 text-primary" aria-label="Proyecto destacado" />
				)}
			</div>
			<p className="text-sm text-slate-400">{proyecto.descripcion}</p>
			<div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
				{proyecto.stack.map((tech) => (
					<StackBadge key={tech.nombre} tech={tech} />
				))}
			</div>
			{proyecto.notaCapturas && (
				<p className="font-mono text-xs text-slate-500 italic">{proyecto.notaCapturas}</p>
			)}
		</article>
	);
}
