import { Handle, Position, type NodeProps } from 'reactflow';

type FilterData = { query: string; category: string; difficulty: string; count: number };

export function FilterNode({ data }: NodeProps<FilterData>) {
	return (
		<div className="rounded-xl border border-purple-400/40 bg-slate-900/90 px-4 py-3 shadow-lg min-w-[150px]">
			<Handle type="target" position={Position.Left} className="!bg-purple-400 !border-purple-600" />
			<p className="font-mono text-[10px] uppercase tracking-widest text-purple-400 mb-1">Filter</p>
			<p className="text-sm font-semibold text-slate-100">MiniSearch</p>
			<div className="mt-1 space-y-0.5">
				<p className="font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
					q: {data.query || '—'}
				</p>
				<p className="font-mono text-[10px] text-slate-400">cat: {data.category}</p>
				<p className="font-mono text-[10px] text-slate-400">diff: {data.difficulty}</p>
			</div>
			<p className="font-mono text-xs text-purple-300 mt-1">{data.count} resultados</p>
			<Handle type="source" position={Position.Right} className="!bg-purple-400 !border-purple-600" />
		</div>
	);
}
