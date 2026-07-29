import { useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

type SourceData = { count: number };

export function SourceNode({ data }: NodeProps<SourceData>) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setLoaded(true), 900);
		return () => clearTimeout(t);
	}, []);

	return (
		<div className="node-base border-cyan-500/50 shadow-cyan-500/20" style={{ minWidth: 172 }}>
			<span className="node-label text-cyan-400">Source</span>
			<p className="text-sm font-bold text-white mt-0.5">DOCX Dataset</p>

			<div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">
				{loaded ? (
					<>
						<div className="flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
							<span className="font-mono text-[10px] text-emerald-400">cargado</span>
						</div>
						<p className="font-mono text-lg font-bold text-white mt-1">{data.count}</p>
						<p className="font-mono text-[10px] text-slate-400">registros listos</p>
					</>
				) : (
					<>
						<div className="flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
							<span className="font-mono text-[10px] text-amber-400">leyendo docx…</span>
						</div>
						<div className="mt-2 h-2 rounded bg-slate-700 overflow-hidden">
							<div className="h-full bg-cyan-500/60 animate-[loading_0.9s_ease-in_forwards]" style={{ width: '100%' }} />
						</div>
					</>
				)}
			</div>

			<p className="mt-2 font-mono text-[9px] text-slate-600">denki-sample.docx</p>
			<Handle type="source" position={Position.Right} style={{ width: 11, height: 11, background: '#229AA4', border: '2px solid #1e293b', borderRadius: '50%' }} />
		</div>
	);
}
