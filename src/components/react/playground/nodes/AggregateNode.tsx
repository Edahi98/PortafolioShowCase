import { Handle, Position, type NodeProps } from 'reactflow';

type AggregateData = {
	groups: Record<string, number>;
	total: number;
	groupByCategory: boolean;
	onToggleGroup: (v: boolean) => void;
};

const CAT_STYLE: Record<string, { bar: string; text: string }> = {
	Frontend: { bar: 'bg-cyan-500', text: 'text-cyan-300' },
	Backend: { bar: 'bg-green-500', text: 'text-green-300' },
	DevOps: { bar: 'bg-orange-500', text: 'text-orange-300' },
	ML: { bar: 'bg-pink-500', text: 'text-pink-300' },
	Database: { bar: 'bg-yellow-500', text: 'text-yellow-300' },
};

export function AggregateNode({ data }: NodeProps<AggregateData>) {
	const entries = Object.entries(data.groups);
	const max = Math.max(...entries.map(([, n]) => n), 1);

	return (
		<div className="node-base border-emerald-500/50 shadow-emerald-500/20" style={{ minWidth: 180 }}>
			<Handle type="target" position={Position.Left} className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-900" />
			<span className="node-label text-emerald-400">Aggregate</span>
			<p className="text-sm font-bold text-white mt-0.5">Group by Category</p>

			{/* Toggle */}
			<label className="nodrag mt-3 flex cursor-pointer items-center gap-2 select-none">
				<div
					onClick={() => data.onToggleGroup(!data.groupByCategory)}
					className={`relative h-4 w-7 rounded-full transition-colors ${data.groupByCategory ? 'bg-emerald-500' : 'bg-slate-600'}`}
				>
					<div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${data.groupByCategory ? 'translate-x-3' : 'translate-x-0.5'}`} />
				</div>
				<span className="font-mono text-[10px] text-slate-300">Agrupar en PDF</span>
			</label>

			{/* Mini bar chart */}
			<div className="mt-3 flex flex-col gap-1.5">
				{entries.length === 0 ? (
					<p className="font-mono text-[10px] text-slate-600">sin datos</p>
				) : (
					entries.map(([cat, n]) => {
						const style = CAT_STYLE[cat] ?? { bar: 'bg-slate-500', text: 'text-slate-300' };
						return (
							<div key={cat} className="flex items-center gap-2">
								<span className={`w-16 font-mono text-[9px] ${style.text} shrink-0`}>{cat}</span>
								<div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
									<div
										className={`h-full rounded-full ${style.bar} transition-all duration-300`}
										style={{ width: `${(n / max) * 100}%` }}
									/>
								</div>
								<span className="font-mono text-[10px] text-slate-400 w-4 text-right">{n}</span>
							</div>
						);
					})
				)}
			</div>

			<Handle type="source" position={Position.Right} className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-900" />
		</div>
	);
}
