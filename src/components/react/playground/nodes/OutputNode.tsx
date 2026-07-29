import { Handle, Position, type NodeProps } from 'reactflow';

type OutputData = { count: number };

export function OutputNode({ data }: NodeProps<OutputData>) {
	return (
		<div className="rounded-xl border border-rose-400/40 bg-slate-900/90 px-4 py-3 shadow-lg min-w-[130px]">
			<Handle type="target" position={Position.Left} className="!bg-rose-400 !border-rose-600" />
			<p className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-1">Output</p>
			<p className="text-sm font-semibold text-slate-100">PDF View</p>
			<p className="font-mono text-xs text-rose-300 mt-1">{data.count} filas</p>
		</div>
	);
}
