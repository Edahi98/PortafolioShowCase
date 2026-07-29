import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from '../../../../data/denkiDataset';
import type { PipelineSettings, VisibleFields } from '../hooks/usePipeline';

type Props = {
	settings: PipelineSettings;
	onUpdate: (patch: Partial<PipelineSettings>) => void;
	onToggleField: (field: keyof VisibleFields) => void;
};

const FIELD_LABELS: Record<keyof VisibleFields, string> = {
	name: 'Nombre',
	category: 'Categoría',
	language: 'Lenguaje',
	difficulty: 'Dificultad',
	description: 'Descripción',
	stars: 'Estrellas',
};

export function SettingsPanel({ settings, onUpdate, onToggleField }: Props) {
	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">Configuración del Pipeline</h3>

			{/* Search */}
			<div className="flex flex-col gap-1">
				<label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Búsqueda (MiniSearch)</label>
				<input
					type="text"
					value={settings.query}
					onChange={(e) => onUpdate({ query: e.target.value })}
					placeholder="React, Python, Docker…"
					className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-400/60 focus:outline-none"
				/>
			</div>

			{/* Category filter */}
			<div className="flex flex-col gap-1">
				<label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Categoría</label>
				<select
					value={settings.categoryFilter}
					onChange={(e) => onUpdate({ categoryFilter: e.target.value as Category | 'All' })}
					className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 focus:border-purple-400/60 focus:outline-none"
				>
					<option value="All">Todas</option>
					{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
				</select>
			</div>

			{/* Difficulty filter */}
			<div className="flex flex-col gap-1">
				<label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Dificultad</label>
				<select
					value={settings.difficultyFilter}
					onChange={(e) => onUpdate({ difficultyFilter: e.target.value as Difficulty | 'All' })}
					className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 focus:border-indigo-400/60 focus:outline-none"
				>
					<option value="All">Todas</option>
					{DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
				</select>
			</div>

			{/* Visible fields */}
			<div className="flex flex-col gap-2">
				<label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Columnas visibles</label>
				<div className="grid grid-cols-2 gap-1.5">
					{(Object.keys(FIELD_LABELS) as (keyof VisibleFields)[]).map((field) => (
						<label key={field} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 select-none">
							<input
								type="checkbox"
								checked={settings.visibleFields[field]}
								onChange={() => onToggleField(field)}
								className="accent-cyan-400 h-3.5 w-3.5"
							/>
							{FIELD_LABELS[field]}
						</label>
					))}
				</div>
			</div>

			{/* Group by */}
			<label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 select-none">
				<input
					type="checkbox"
					checked={settings.groupByCategory}
					onChange={(e) => onUpdate({ groupByCategory: e.target.checked })}
					className="accent-emerald-400 h-3.5 w-3.5"
				/>
				Agrupar por categoría en el PDF
			</label>
		</div>
	);
}
