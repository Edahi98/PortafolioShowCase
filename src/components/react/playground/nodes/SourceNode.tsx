import { Handle, Position, type NodeProps } from 'reactflow';

type SourceData = { count: number };

export function SourceNode({ data }: NodeProps<SourceData>) {
	return (
		<div className="rounded-xl border border-cyan-400/40 bg-slate-900/90 px-4 py-3 shadow-lg min-w-[140px]">
			<p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Source</p>
			<p className="text-sm font-semibold text-slate-100">DOCX Dataset</p>
			<p className="font-mono text-xs text-slate-400 mt-1">{data.count} registros</p>
			<Handle type="source" position={Position.Right} className="!bg-cyan-400 !border-cyan-600" />
		</div>
	);
}
