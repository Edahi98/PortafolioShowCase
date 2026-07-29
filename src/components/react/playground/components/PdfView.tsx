import { forwardRef } from 'react';
import type { DataItem } from '../../../../data/denkiDataset';
import type { PipelineSettings } from '../hooks/usePipeline';

type Props = {
	items: Partial<DataItem>[];
	fields: (keyof DataItem)[];
	settings: PipelineSettings;
	groups: Record<string, number>;
};

const FIELD_LABELS: Record<string, string> = {
	name: 'Nombre', category: 'Categoría', language: 'Lenguaje',
	difficulty: 'Nivel', description: 'Descripción', stars: '★',
};

const DIFF_COLOR: Record<string, string> = {
	Beginner: '#059669', Intermediate: '#d97706', Advanced: '#e11d48',
};
const CAT_COLOR: Record<string, string> = {
	Frontend: '#0891b2', Backend: '#16a34a', DevOps: '#ea580c',
	ML: '#db2777', Database: '#ca8a04',
};

function Cell({ field, value }: { field: keyof DataItem; value: unknown }) {
	const s = String(value ?? '—');
	if (field === 'difficulty') return <span style={{ color: DIFF_COLOR[s] ?? '#64748b', fontWeight: 600 }}>{s}</span>;
	if (field === 'category') return <span style={{ color: CAT_COLOR[s] ?? '#64748b', fontWeight: 600 }}>{s}</span>;
	if (field === 'stars') return <span style={{ color: '#ca8a04' }}>{'★'.repeat(Math.min(5, Math.floor(Number(s) / 20)))}</span>;
	if (field === 'description') return <span style={{ color: '#64748b', fontSize: 11 }}>{s}</span>;
	return <>{s}</>;
}

function DataTable({ items, fields }: { items: Partial<DataItem>[]; fields: (keyof DataItem)[] }) {
	if (items.length === 0) return null;
	return (
		<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
			<thead>
				<tr>
					{fields.map((f) => (
						<th key={f} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>
							{FIELD_LABELS[f] ?? f}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{items.map((item, i) => (
					<tr key={item.id ?? i} style={{ borderBottom: '1px solid #f1f5f9' }}>
						{fields.map((f) => (
							<td key={f} style={{ padding: '5px 8px', verticalAlign: 'top' }}>
								<Cell field={f} value={item[f]} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export const PdfView = forwardRef<HTMLDivElement, Props>(function PdfView({ items, fields, settings, groups }, ref) {
	const grouped = settings.groupByCategory
		? Object.keys(groups).reduce<Record<string, Partial<DataItem>[]>>((acc, cat) => {
				acc[cat] = items.filter((i) => i.category === cat);
				return acc;
		  }, {})
		: null;

	const subtitle = [
		settings.query && `búsqueda: "${settings.query}"`,
		settings.categoryFilter !== 'All' && settings.categoryFilter,
		settings.difficultyFilter !== 'All' && settings.difficultyFilter,
	].filter(Boolean).join(' · ');

	return (
		<div ref={ref} style={{ background: 'white', borderRadius: 12, padding: '28px 32px', minHeight: 300, fontFamily: 'Georgia, serif', color: '#1e293b' }}>
			{/* Header */}
			<div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
				<h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0f172a' }}>Denki Pipeline — Resultado</h1>
				<p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace' }}>
					{items.length} elemento{items.length !== 1 ? 's' : ''}
					{subtitle && ` · ${subtitle}`}
				</p>
			</div>

			{/* Content */}
			{items.length === 0 ? (
				<p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '32px 0' }}>
					Sin resultados para los filtros actuales.
				</p>
			) : grouped ? (
				Object.entries(grouped).map(([cat, rows]) => (
					<div key={cat} style={{ marginBottom: 20 }}>
						<h3 style={{ fontSize: 13, fontWeight: 700, color: CAT_COLOR[cat] ?? '#334155', marginBottom: 6 }}>
							{cat} ({rows.length})
						</h3>
						<DataTable items={rows} fields={fields} />
					</div>
				))
			) : (
				<DataTable items={items} fields={fields} />
			)}

			<p style={{ marginTop: 24, fontSize: 10, color: '#cbd5e1', textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: 8, fontFamily: 'monospace' }}>
				Generado por Denki Pipeline Designer · dataset: denki-sample.docx
			</p>
		</div>
	);
});
