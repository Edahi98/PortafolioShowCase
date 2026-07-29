import { Handle, Position, type NodeProps } from 'reactflow';

type AggregateData = { groups: Record<string, number> };

const CATEGORY_COLORS: Record<string, string> = {
	Frontend: 'text-cyan-300',
	Backend: 'text-green-300',
	DevOps: 'text-orange-300',
	ML: 'text-pink-300',
	Database: 'text-yellow-300',
};

export function AggregateNode({ data }: NodeProps<AggregateData>) {
	const entries = Object.entries(data.groups);
	return (
		<div className="rounded-xl border border-emerald-400/40 bg-slate-900/90 px-4 py-3 shadow-lg min-w-[150px]">
			<Handle type="target" position={Position.Left} className="!bg-emerald-400 !border-emerald-600" />
			<p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Aggregate</p>
			<p className="text-sm font-semibold text-slate-100">Group by Category</p>
			<div className="mt-1 space-y-0.5">
				{entries.length === 0 ? (
					<p className="font-mono text-[10px] text-slate-500">sin resultados</p>
				) : (
					entries.map(([cat, n]) => (
						<p key={cat} className={`font-mono text-[10px] ${CATEGORY_COLORS[cat] ?? 'text-slate-300'}`}>
							{cat}: {n}
						</p>
					))
				)}
			</div>
			<Handle type="source" position={Position.Right} className="!bg-emerald-400 !border-emerald-600" />
		</div>
	);
}
