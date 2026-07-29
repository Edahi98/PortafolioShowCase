import type { DataItem } from '../../../../data/denkiDataset';
import type { PipelineSettings } from '../hooks/usePipeline';

type Props = {
	items: Partial<DataItem>[];
	fields: (keyof DataItem)[];
	settings: PipelineSettings;
	groups: Record<string, number>;
	onDownload: () => void;
};

const FIELD_LABELS: Record<string, string> = {
	name: 'Nombre',
	category: 'Categoría',
	language: 'Lenguaje',
	difficulty: 'Dificultad',
	description: 'Descripción',
	stars: '★',
};

const DIFFICULTY_COLORS: Record<string, string> = {
	Beginner: 'text-emerald-600',
	Intermediate: 'text-amber-600',
	Advanced: 'text-rose-600',
};

const CATEGORY_COLORS: Record<string, string> = {
	Frontend: 'text-cyan-700',
	Backend: 'text-green-700',
	DevOps: 'text-orange-700',
	ML: 'text-pink-700',
	Database: 'text-yellow-700',
};

function renderCell(field: keyof DataItem, value: unknown) {
	if (value === undefined) return '—';
	const s = String(value);
	if (field === 'difficulty') {
		return <span className={`font-semibold ${DIFFICULTY_COLORS[s] ?? ''}`}>{s}</span>;
	}
	if (field === 'category') {
		return <span className={`font-semibold ${CATEGORY_COLORS[s] ?? ''}`}>{s}</span>;
	}
	if (field === 'description') {
		return <span className="text-gray-600 text-[11px]">{s}</span>;
	}
	return s;
}

function GroupedView({ items, fields, groups }: Pick<Props, 'items' | 'fields' | 'groups'>) {
	const grouped = Object.keys(groups).reduce<Record<string, Partial<DataItem>[]>>((acc, cat) => {
		acc[cat] = items.filter((i) => i.category === cat);
		return acc;
	}, {});

	return (
		<>
			{Object.entries(grouped).map(([cat, rows]) => (
				<div key={cat} className="mb-4">
					<h3 className={`text-sm font-bold mb-1 ${CATEGORY_COLORS[cat] ?? 'text-gray-800'}`}>
						{cat} ({rows.length})
					</h3>
					<TableRows items={rows} fields={fields} />
				</div>
			))}
		</>
	);
}

function TableRows({ items, fields }: { items: Partial<DataItem>[]; fields: (keyof DataItem)[] }) {
	return (
		<table className="w-full border-collapse text-[12px]">
			<thead>
				<tr className="border-b border-gray-300 bg-gray-50">
					{fields.map((f) => (
						<th key={f} className="px-2 py-1 text-left font-semibold text-gray-600 whitespace-nowrap">
							{FIELD_LABELS[f] ?? f}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{items.map((item, i) => (
					<tr key={item.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
						{fields.map((f) => (
							<td key={f} className="px-2 py-1 align-top">
								{renderCell(f, item[f])}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export function PdfView({ items, fields, settings, groups, onDownload }: Props) {
	return (
		<div className="flex flex-col gap-3 h-full">
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<span className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Vista PDF</span>
				<button
					onClick={onDownload}
					className="rounded-full border border-rose-400/50 bg-rose-400/10 px-3 py-1 font-mono text-[10px] text-rose-300 transition hover:bg-rose-400/20"
				>
					Descargar DOCX ↓
				</button>
			</div>

			{/* Paper */}
			<div className="flex-1 overflow-auto rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_24px_rgba(0,0,0,0.12)]">
				<div className="p-6 min-h-full">
					{/* Header */}
					<div className="mb-5 border-b border-gray-200 pb-3">
						<h1 className="text-lg font-bold text-gray-800">Denki Pipeline — Resultado</h1>
						<p className="text-[11px] text-gray-500 mt-0.5">
							{items.length} elemento{items.length !== 1 ? 's' : ''}
							{settings.query ? ` · búsqueda: "${settings.query}"` : ''}
							{settings.categoryFilter !== 'All' ? ` · ${settings.categoryFilter}` : ''}
							{settings.difficultyFilter !== 'All' ? ` · ${settings.difficultyFilter}` : ''}
						</p>
					</div>

					{/* Content */}
					{items.length === 0 ? (
						<p className="text-center text-sm text-gray-400 py-8">Sin resultados para los filtros actuales.</p>
					) : settings.groupByCategory ? (
						<GroupedView items={items} fields={fields} groups={groups} />
					) : (
						<TableRows items={items} fields={fields} />
					)}

					{/* Footer */}
					<p className="mt-6 text-[10px] text-gray-400 text-right border-t border-gray-100 pt-2">
						Generado por Denki Pipeline Designer · Dataset: DOCX
					</p>
				</div>
			</div>
		</div>
	);
}
