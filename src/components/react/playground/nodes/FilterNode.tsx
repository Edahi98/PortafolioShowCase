import { Handle, Position, type NodeProps } from 'reactflow';
import { GENRES, ERAS, type Genre, type Era } from '../../../../data/denkiDataset';

type FilterData = {
	query: string;
	categoryFilter: Genre | 'All';
	difficultyFilter: Era | 'All';
	count: number;
	total: number;
	onQueryChange: (v: string) => void;
	onCategoryChange: (v: Genre | 'All') => void;
	onDifficultyChange: (v: Era | 'All') => void;
};

export function FilterNode({ data }: NodeProps<FilterData>) {
	const pct = data.total > 0 ? Math.round((data.count / data.total) * 100) : 0;

	return (
		<div className="node-base border-purple-500/50 shadow-purple-500/20" style={{ minWidth: 200 }}>
			<Handle type="target" position={Position.Left} style={{ width: 11, height: 11, background: '#8a8a8a', border: '2px solid #1e293b', borderRadius: '50%' }} />
			<span className="node-label text-purple-400">Filter</span>
			<p className="text-sm font-bold text-white mt-0.5">MiniSearch</p>

			<div className="mt-3 flex flex-col gap-2">
				<div className="flex flex-col gap-0.5">
					<label className="font-mono text-[9px] uppercase text-slate-500">Título / Director / Idioma</label>
					<input
						type="text"
						value={data.query}
						onChange={(e) => data.onQueryChange(e.target.value)}
						placeholder="Nolan, Japonés, Padrino…"
						className="nodrag w-full rounded-md border border-purple-500/30 bg-slate-800/80 px-2 py-1 font-mono text-[11px] text-slate-100 placeholder-slate-600 focus:border-purple-400/60 focus:outline-none"
					/>
				</div>

				<div className="grid grid-cols-2 gap-1.5">
					<div className="flex flex-col gap-0.5">
						<label className="font-mono text-[9px] uppercase text-slate-500">Género</label>
						<select
							value={data.categoryFilter}
							onChange={(e) => data.onCategoryChange(e.target.value as Genre | 'All')}
							className="nodrag rounded-md border border-purple-500/30 bg-slate-800/80 px-1.5 py-1 font-mono text-[10px] text-slate-100 focus:border-purple-400/60 focus:outline-none"
						>
							<option value="All">Todos</option>
							{GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
						</select>
					</div>
					<div className="flex flex-col gap-0.5">
						<label className="font-mono text-[9px] uppercase text-slate-500">Era</label>
						<select
							value={data.difficultyFilter}
							onChange={(e) => data.onDifficultyChange(e.target.value as Era | 'All')}
							className="nodrag rounded-md border border-purple-500/30 bg-slate-800/80 px-1.5 py-1 font-mono text-[10px] text-slate-100 focus:border-purple-400/60 focus:outline-none"
						>
							<option value="All">Todas</option>
							{ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
						</select>
					</div>
				</div>
			</div>

			<div className="mt-3">
				<div className="flex justify-between mb-1">
					<span className="font-mono text-[10px] text-purple-300 font-bold">{data.count} películas</span>
					<span className="font-mono text-[10px] text-slate-500">{pct}%</span>
				</div>
				<div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
					<div
						className="h-full rounded-full bg-purple-500 transition-all duration-300"
						style={{ width: `${pct}%` }}
					/>
				</div>
			</div>

			<Handle type="source" position={Position.Right} style={{ width: 11, height: 11, background: '#229AA4', border: '2px solid #1e293b', borderRadius: '50%' }} />
		</div>
	);
}
