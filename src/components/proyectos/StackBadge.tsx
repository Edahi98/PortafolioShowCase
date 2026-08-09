import type { StackItem } from '../../data/proyectos';

export function StackBadge({ tech }: { tech: StackItem }) {
	return <img src={tech.badge} alt={tech.nombre} className="h-6" />;
}
