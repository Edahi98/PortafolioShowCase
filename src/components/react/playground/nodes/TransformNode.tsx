import { Handle, Position, type NodeProps } from 'reactflow';
import type { VisibleFields } from '../hooks/usePipeline';

const FIELDS: { key: keyof VisibleFields; label: string }[] = [
	{ key: 'name', label: 'Título' },
	{ key: 'genre', label: 'Género' },
	{ key: 'director', label: 'Director' },
	{ key: 'year', label: 'Año' },
	{ key: 'rating', label: 'Rating' },
	{ key: 'duration', label: 'Duración' },
	{ key: 'language', label: 'Idioma' },
	{ key: 'era', label: 'Era' },
];

type TransformData = {
	visibleFields: VisibleFields;
	onToggleField: (f: keyof VisibleFields) => void;
};

export function TransformNode({ data }: NodeProps<TransformData>) {
	const activeCount = Object.values(data.visibleFields).filter(Boolean).length;

	return (
		<div className="node-base border-indigo-500/50 shadow-indigo-500/20" style={{ minWidth: 180 }}>
			<Handle type="target" position={Position.Left} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-slate-900" />
			<span className="node-label text-indigo-400">Transform</span>
			<p className="text-sm font-bold text-white mt-0.5">Select Fields</p>
			<p className="font-mono text-[10px] text-slate-500 mb-3">{activeCount} de {FIELDS.length} columnas</p>

			<div className="grid grid-cols-2 gap-x-3 gap-y-2">
				{FIELDS.map(({ key, label }) => (
					<label key={key} className="nodrag flex cursor-pointer items-center gap-1.5 select-none">
						<div
							onClick={() => data.onToggleField(key)}
							className={`h-3.5 w-3.5 rounded border transition-all flex items-center justify-center flex-shrink-0 ${
								data.visibleFields[key]
									? 'border-indigo-400 bg-indigo-500'
									: 'border-slate-600 bg-transparent'
							}`}
						>
							{data.visibleFields[key] && (
								<svg viewBox="0 0 10 8" className="h-2 w-2">
									<path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
								</svg>
							)}
						</div>
						<span className={`font-mono text-[10px] ${data.visibleFields[key] ? 'text-slate-200' : 'text-slate-600'}`}>
							{label}
						</span>
					</label>
				))}
			</div>

			<Handle type="source" position={Position.Right} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-slate-900" />
		</div>
	);
}
