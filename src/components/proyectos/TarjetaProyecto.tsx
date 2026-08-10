import { Crown, Boxes, FileText, BookOpen, ExternalLink } from 'lucide-react';
import type { Proyecto } from '../../data/proyectos';
import { StackBadge } from './StackBadge';
import { IconBadge } from './IconBadge';

function badgeCount(p: Proyecto) {
	return [
		p.repoUrl,
		p.documentacionUrl,
		p.manualUrl,
		p.liveUrl,
		...(p.dockerHubUrl ? [p.dockerHubUrl] : []),
		...(p.dockerHubUrls ?? []),
	].filter(Boolean).length;
}

export function TarjetaProyecto({ proyecto, todos }: { proyecto: Proyecto; todos: Proyecto[] }) {
	const esContenedor = (proyecto.contiene?.length ?? 0) > 0;
	const badges = badgeCount(proyecto);

	const cardClasses = [
		'glass-card group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-6 transition hover:border-primary/60',
		esContenedor
			? 'border-secondary/50 shadow-[0_0_24px_-6px] shadow-secondary/40 sm:col-span-2'
			: proyecto.destacado
				? 'border-primary/50 shadow-[0_0_24px_-6px] shadow-primary/30'
				: '',
	]
		.filter(Boolean)
		.join(' ');

	const tieneIconos = proyecto.repoUrl || proyecto.dockerHubUrl || (proyecto.dockerHubUrls?.length ?? 0) > 0 || proyecto.documentacionUrl || proyecto.manualUrl || proyecto.liveUrl;

	return (
		<div className={cardClasses}>
			{proyecto.slug && (
				<a
					href={`/proyectos/${proyecto.slug}`}
					aria-label={`Ver proyecto: ${proyecto.nombre}`}
					className="absolute inset-0 z-0"
				/>
			)}

			{proyecto.imagenes && proyecto.imagenes.length > 0 && (
				<div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<img src={proyecto.imagenes[0].src} alt="" className="h-full w-full object-cover" />
					<div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/50" />
				</div>
			)}

			{tieneIconos && (
				<div className="pointer-events-none absolute top-4 right-4 z-10 flex gap-2">
					{proyecto.repoUrl && (
						<IconBadge href={proyecto.repoUrl} label="Ver repositorio en GitHub">
							<img src="https://skillicons.dev/icons?i=github" alt="GitHub" width={20} height={20} className="h-5 w-5" />
						</IconBadge>
					)}
					{proyecto.dockerHubUrl && (
						<IconBadge href={proyecto.dockerHubUrl} label="Ver imagen en Docker Hub">
							<img src="https://skillicons.dev/icons?i=docker" alt="Docker Hub" width={20} height={20} className="h-5 w-5" />
						</IconBadge>
					)}
					{(proyecto.dockerHubUrls ?? []).map((url) => {
						const name = url.split('/').pop() ?? 'Docker Hub';
						return (
							<IconBadge key={url} href={url} label={`Ver imagen: ${name}`}>
								<img src="https://skillicons.dev/icons?i=docker" alt={name} width={20} height={20} className="h-5 w-5" />
							</IconBadge>
						);
					})}
					{proyecto.documentacionUrl && (
						<IconBadge href={proyecto.documentacionUrl} label="Ver documentación" variant="emerald">
							<FileText className="h-4 w-4" aria-hidden="true" />
						</IconBadge>
					)}
					{proyecto.manualUrl && (
						<IconBadge href={proyecto.manualUrl} label="Ver manual de usuario" variant="cyan">
							<BookOpen className="h-4 w-4" aria-hidden="true" />
						</IconBadge>
					)}
					{proyecto.liveUrl && (
						<IconBadge href={proyecto.liveUrl} label="Ver sitio en vivo" variant="yellow">
							<ExternalLink className="h-4 w-4" aria-hidden="true" />
						</IconBadge>
					)}
				</div>
			)}

			<div
				className={[
					'pointer-events-none relative z-0 flex flex-1 flex-col gap-3',
					badges >= 5 ? 'pr-56' : badges === 4 ? 'pr-44' : badges === 3 ? 'pr-32' : badges === 2 ? 'pr-24' : badges === 1 ? 'pr-16' : '',
				]
					.filter(Boolean)
					.join(' ')}
			>
				<div className="flex items-start gap-2">
					<h3 className="text-lg font-semibold text-slate-100">{proyecto.nombre}</h3>
					{esContenedor ? (
						<Boxes className="h-5 w-5 shrink-0 text-secondary" aria-label="Proyecto contenedor" />
					) : proyecto.destacado ? (
						<Crown className="h-5 w-5 shrink-0 text-primary" aria-label="Proyecto destacado" />
					) : null}
				</div>

				<p className="text-sm text-slate-400">{proyecto.descripcion}</p>

				<div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
					{proyecto.stack.map((tech) => (
						<StackBadge key={tech.nombre} tech={tech} />
					))}
				</div>

				{proyecto.slug && (
					<p className="font-mono text-xs text-secondary">Ver proyecto &rarr;</p>
				)}

				{proyecto.notaCapturas && (
					<p className="font-mono text-xs text-slate-500 italic">{proyecto.notaCapturas}</p>
				)}

				{proyecto.relacionados && proyecto.relacionados.length > 0 && (
					<div className="flex flex-wrap items-center gap-x-1 gap-y-1 pt-1">
						<span className="font-mono text-xs text-slate-500">Relacionado:</span>
						{proyecto.relacionados.map((nombreRel, i) => {
							const rel = todos.find((p) => p.nombre === nombreRel);
							return (
								<span key={nombreRel}>
									{i > 0 && <span className="font-mono text-xs text-slate-500">,</span>}
									{rel?.slug ? (
										<a
											href={`/proyectos/${rel.slug}`}
											className="pointer-events-auto font-mono text-xs text-secondary transition hover:text-primary"
										>
											{rel.nombre}
										</a>
									) : (
										<span className="font-mono text-xs text-slate-400">{nombreRel}</span>
									)}
								</span>
							);
						})}
					</div>
				)}

				{esContenedor && (
					<div className="pointer-events-auto mt-1 flex flex-col gap-2 border-t border-secondary/30 pt-4">
						<span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-secondary uppercase">
							<Boxes className="h-3.5 w-3.5" aria-hidden="true" />
							Integra &amp; encierra
						</span>
						<div className="flex flex-col gap-3 sm:flex-row">
							{proyecto.contiene!.map((nombreSub) => {
								const sub = todos.find((p) => p.nombre === nombreSub);
								if (!sub) return null;
								return (
									<div
										key={nombreSub}
										className="relative z-20 flex-1 rounded-xl border border-secondary/30 bg-secondary/5 p-3 backdrop-blur transition hover:border-secondary/60"
									>
										{sub.slug && (
											<a
												href={`/proyectos/${sub.slug}`}
												aria-label={`Ver proyecto: ${sub.nombre}`}
												className="absolute inset-0 z-0"
											/>
										)}
										{sub.repoUrl && (
											<a
												href={sub.repoUrl}
												target="_blank"
												rel="noreferrer"
												aria-label="Ver repositorio en GitHub"
												className="pointer-events-auto absolute top-2 right-2 z-10 rounded-full bg-surface/80 p-1 backdrop-blur transition hover:opacity-80"
											>
												<img src="https://skillicons.dev/icons?i=github" alt="GitHub" width={16} height={16} className="h-4 w-4" />
											</a>
										)}
										<div className="pointer-events-none relative z-0 pr-8">
											<div className="flex items-center gap-1.5">
												<p className="text-sm font-semibold text-slate-100">{sub.nombre}</p>
												{sub.destacado && (
													<Crown className="h-3.5 w-3.5 shrink-0 text-primary" aria-label="Proyecto destacado" />
												)}
											</div>
											<p className="mt-1 text-xs text-slate-400">{sub.descripcion}</p>
											<p className="mt-2 font-mono text-xs text-secondary">Ver proyecto &rarr;</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
