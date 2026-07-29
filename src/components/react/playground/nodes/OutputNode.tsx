import { Handle, Position, type NodeProps } from 'reactflow';

type OutputData = {
	count: number;
	fields: number;
	onView: () => void;
	onDownload: () => void;
};

export function OutputNode({ data }: NodeProps<OutputData>) {
	return (
		<div className="node-base border-rose-500/50 shadow-rose-500/20" style={{ minWidth: 160 }}>
			<Handle type="target" position={Position.Left} className="!bg-rose-400 !w-3 !h-3 !border-2 !border-slate-900" />
			<span className="node-label text-rose-400">Output</span>
			<p className="text-sm font-bold text-white mt-0.5">DataFrame</p>

			<div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-center">
				<p className="font-mono text-2xl font-bold text-white">{data.count}</p>
				<p className="font-mono text-[10px] text-slate-400">filas · {data.fields} cols</p>
			</div>

			<div className="mt-3 flex flex-col gap-1.5">
				<button
					onClick={data.onView}
					className="nodrag w-full rounded-lg bg-rose-500/20 border border-rose-500/40 py-1.5 font-mono text-[11px] text-rose-300 transition hover:bg-rose-500/30"
				>
					Ver resultado ↓
				</button>
				<button
					onClick={data.onDownload}
					className="nodrag w-full rounded-lg bg-slate-700/60 border border-slate-600/40 py-1.5 font-mono text-[11px] text-slate-300 transition hover:bg-slate-700"
				>
					Descargar DOCX
				</button>
			</div>
		</div>
	);
}
