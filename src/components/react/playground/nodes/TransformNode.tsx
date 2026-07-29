import { Handle, Position, type NodeProps } from 'reactflow';

type TransformData = { fields: string[] };

export function TransformNode({ data }: NodeProps<TransformData>) {
	return (
		<div className="rounded-xl border border-indigo-400/40 bg-slate-900/90 px-4 py-3 shadow-lg min-w-[140px]">
			<Handle type="target" position={Position.Left} className="!bg-indigo-400 !border-indigo-600" />
			<p className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Transform</p>
			<p className="text-sm font-semibold text-slate-100">Select Fields</p>
			<p className="font-mono text-xs text-slate-400 mt-1">{data.fields.length} columnas</p>
			<div className="mt-1 flex flex-wrap gap-0.5">
				{data.fields.slice(0, 4).map((f) => (
					<span key={f} className="rounded bg-indigo-400/10 px-1 py-0.5 font-mono text-[9px] text-indigo-300">
						{f}
					</span>
				))}
				{data.fields.length > 4 && (
					<span className="rounded bg-indigo-400/10 px-1 py-0.5 font-mono text-[9px] text-indigo-300">
						+{data.fields.length - 4}
					</span>
				)}
			</div>
			<Handle type="source" position={Position.Right} className="!bg-indigo-400 !border-indigo-600" />
		</div>
	);
}
