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
	name: 'Título', genre: 'Género', director: 'Director',
	year: 'Año', rating: 'Rating', duration: 'Dur. (min)',
	language: 'Idioma', era: 'Era',
};

const GENRE_COLOR: Record<string, string> = {
	'Acción':          '#ef4444',
	'Drama':           '#3b82f6',
	'Thriller':        '#f97316',
	'Ciencia ficción': '#06b6d4',
	'Comedia':         '#eab308',
	'Animación':       '#ec4899',
	'Terror':          '#a855f7',
};

const ERA_STYLE: Record<string, { bg: string; color: string }> = {
	'Clásico':  { bg: '#fef3c7', color: '#92400e' },
	'Moderno':  { bg: '#e0e7ff', color: '#3730a3' },
	'Reciente': { bg: '#d1fae5', color: '#065f46' },
};

function ratingBar(value: number) {
	const color = value >= 85 ? '#16a34a' : value >= 70 ? '#ca8a04' : '#dc2626';
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
			<div style={{ width: 48, height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
				<div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4 }} />
			</div>
			<span style={{ fontSize: 11, fontWeight: 600, color }}>{value}</span>
		</div>
	);
}

function Cell({ field, value }: { field: keyof DataItem; value: unknown }) {
	if (value === undefined || value === null) return <>—</>;
	const s = String(value);
	if (field === 'genre') return <span style={{ color: GENRE_COLOR[s] ?? '#64748b', fontWeight: 700, fontSize: 11 }}>{s}</span>;
	if (field === 'era') {
		const st = ERA_STYLE[s] ?? { bg: '#f1f5f9', color: '#475569' };
		return <span style={{ background: st.bg, color: st.color, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{s}</span>;
	}
	if (field === 'rating') return <>{ratingBar(Number(s))}</>;
	if (field === 'duration') return <span style={{ color: '#64748b', fontSize: 11 }}>{s} min</span>;
	if (field === 'year') return <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{s}</span>;
	return <>{s}</>;
}

function DataTable({ items, fields }: { items: Partial<DataItem>[]; fields: (keyof DataItem)[] }) {
	if (items.length === 0) return null;
	return (
		<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
			<thead>
				<tr style={{ borderBottom: '2px solid #e2e8f0' }}>
					{fields.map((f) => (
						<th key={f} style={{ textAlign: 'left', padding: '6px 10px', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'system-ui,sans-serif' }}>
							{FIELD_LABELS[f] ?? f}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{items.map((item, i) => (
					<tr key={item.id ?? i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
						{fields.map((f) => (
							<td key={f} style={{ padding: '6px 10px', verticalAlign: 'middle' }}>
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
		? Object.keys(groups).reduce<Record<string, Partial<DataItem>[]>>((acc, genre) => {
				acc[genre] = items.filter((i) => i.genre === genre);
				return acc;
		  }, {})
		: null;

	const subtitle = [
		settings.query && `"${settings.query}"`,
		settings.categoryFilter !== 'All' && settings.categoryFilter,
		settings.difficultyFilter !== 'All' && settings.difficultyFilter,
	].filter(Boolean).join(' · ');

	return (
		<div ref={ref} style={{ background: 'white', borderRadius: 12, padding: '28px 32px', minHeight: 300, fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
			<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: 14, marginBottom: 18, gap: 12 }}>
				<div>
					<h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0f172a' }}>Denki Pipeline — Películas</h1>
					<p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace' }}>
						{items.length} resultado{items.length !== 1 ? 's' : ''}
						{subtitle && <> · filtro: {subtitle}</>}
					</p>
				</div>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
					{Object.entries(groups).map(([genre, n]) => (
						<span key={genre} style={{ fontSize: 10, fontWeight: 600, color: GENRE_COLOR[genre] ?? '#64748b', background: `${GENRE_COLOR[genre] ?? '#64748b'}15`, border: `1px solid ${GENRE_COLOR[genre] ?? '#64748b'}30`, borderRadius: 20, padding: '2px 8px' }}>
							{genre} {n}
						</span>
					))}
				</div>
			</div>

			{items.length === 0 ? (
				<p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '40px 0' }}>
					Sin resultados para los filtros actuales.
				</p>
			) : grouped ? (
				Object.entries(grouped).map(([genre, rows]) => rows.length > 0 && (
					<div key={genre} style={{ marginBottom: 24 }}>
						<h3 style={{ fontSize: 13, fontWeight: 700, color: GENRE_COLOR[genre] ?? '#334155', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
							<span style={{ width: 8, height: 8, borderRadius: '50%', background: GENRE_COLOR[genre] ?? '#334155', display: 'inline-block' }} />
							{genre} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 12 }}>({rows.length})</span>
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
