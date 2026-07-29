import { forwardRef, useState } from 'react';
import type { DataItem } from '../../../../data/denkiDataset';
import type { PipelineSettings } from '../hooks/usePipeline';

type Props = {
	items: Partial<DataItem>[];
	fields: (keyof DataItem)[];
	settings: PipelineSettings;
	groups: Record<string, number>;
	onDownload: () => void;
};

const COL_LABEL: Record<string, string> = {
	name: 'title', genre: 'genre', director: 'director',
	year: 'year', rating: 'rating', duration: 'duration_min',
	language: 'language', era: 'era',
};

const COL_TYPE: Record<string, string> = {
	name: 'Utf8', genre: 'Categorical', director: 'Utf8',
	year: 'Int32', rating: 'Int32', duration: 'Int32',
	language: 'Utf8', era: 'Categorical',
};

const GENRE_COLOR: Record<string, string> = {
	'Acción': '#ef4444', 'Drama': '#60a5fa', 'Thriller': '#fb923c',
	'Ciencia ficción': '#22d3ee', 'Comedia': '#facc15',
	'Animación': '#f472b6', 'Terror': '#c084fc',
};

const ERA_COLOR: Record<string, string> = {
	'Clásico': '#fbbf24', 'Moderno': '#818cf8', 'Reciente': '#34d399',
};

type View = 'polars' | 'sql';

function CellValue({ field, value }: { field: keyof DataItem; value: unknown }) {
	if (value === undefined || value === null)
		return <span style={{ color: '#334155' }}>null</span>;
	const s = String(value);

	if (field === 'genre') {
		const c = GENRE_COLOR[s] ?? '#94a3b8';
		return <span style={{ color: c, fontWeight: 700, fontSize: 11 }}>{s}</span>;
	}
	if (field === 'era') {
		const c = ERA_COLOR[s] ?? '#94a3b8';
		return (
			<span style={{ background: `${c}18`, border: `1px solid ${c}40`, color: c, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>
				{s}
			</span>
		);
	}
	if (field === 'rating') {
		const n = Number(s);
		const c = n >= 85 ? '#22c55e' : n >= 70 ? '#f59e0b' : '#ef4444';
		return (
			<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
				<span style={{ display: 'inline-block', width: 40, height: 4, borderRadius: 2, background: '#1e2440', overflow: 'hidden' }}>
					<span style={{ display: 'block', width: `${n}%`, height: '100%', background: c, borderRadius: 2 }} />
				</span>
				<span style={{ color: c, fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{n}</span>
			</span>
		);
	}
	if (field === 'name') return <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{s}</span>;
	if (field === 'director') return <span style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>{s}</span>;
	if (field === 'year' || field === 'duration') return <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{s}</span>;
	return <span style={{ color: '#cbd5e1', fontSize: 12 }}>{s}</span>;
}

function buildSql(settings: PipelineSettings, fields: (keyof DataItem)[]): { tokens: { text: string; type: 'kw' | 'str' | 'plain' }[][] } {
	const cols = fields.map((f) => COL_LABEL[f] ?? f).join(', ');
	const conds: string[] = [];
	if (settings.query.trim()) conds.push(`title ILIKE '%${settings.query}%'\n          OR director ILIKE '%${settings.query}%'`);
	if (settings.categoryFilter !== 'All') conds.push(`genre = '${settings.categoryFilter}'`);
	if (settings.difficultyFilter !== 'All') conds.push(`era = '${settings.difficultyFilter}'`);

	const lines: string[] = [
		`SELECT  ${cols}`,
		`FROM    denki_sample`,
		...(conds.length ? [`WHERE   ${conds.join('\n  AND   ')}`] : []),
		`;`,
	];

	return {
		tokens: lines.map((line) => {
			const parts: { text: string; type: 'kw' | 'str' | 'plain' }[] = [];
			const tokens = line.split(/(\b(?:SELECT|FROM|WHERE|AND|OR|ILIKE)\b|'[^']*')/g);
			for (const t of tokens) {
				if (!t) continue;
				if (/^\b(SELECT|FROM|WHERE|AND|OR|ILIKE)\b$/.test(t)) parts.push({ text: t, type: 'kw' });
				else if (/^'.*'$/.test(t)) parts.push({ text: t, type: 'str' });
				else parts.push({ text: t, type: 'plain' });
			}
			return parts;
		}),
	};
}

export const ResultTable = forwardRef<HTMLDivElement, Props>(
	function ResultTable({ items, fields, settings, groups, onDownload }, ref) {
		const [view, setView] = useState<View>('polars');
		const sql = buildSql(settings, fields);

		return (
			<div ref={ref} style={{ background: '#0b0e1c', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e2440', display: 'flex', flexDirection: 'column' }}>

				{/* Toolbar */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#060810', borderBottom: '1px solid #1e2440', gap: 8, flexWrap: 'wrap' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						{/* Toggle Polars / SQL */}
						<div style={{ display: 'flex', background: '#1e2440', borderRadius: 6, padding: 2, gap: 2 }}>
							{(['polars', 'sql'] as View[]).map((v) => (
								<button key={v} onClick={() => setView(v)} style={{
									padding: '3px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
									fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
									textTransform: 'uppercase', letterSpacing: '0.08em',
									background: view === v ? '#22d3ee' : 'transparent',
									color: view === v ? '#060810' : '#475569', transition: 'all 0.15s',
								}}>
									{v}
								</button>
							))}
						</div>
						<span style={{ fontFamily: 'monospace', fontSize: 10, color: '#334155' }}>
							shape: ({items.length}, {fields.length})
						</span>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
						{Object.entries(groups).map(([g, n]) => (
							<span key={g} style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: GENRE_COLOR[g] ?? '#64748b', background: `${GENRE_COLOR[g] ?? '#64748b'}15`, borderRadius: 20, padding: '2px 7px' }}>
								{g} {n}
							</span>
						))}
						<button onClick={onDownload} style={{
							display: 'inline-flex', alignItems: 'center', gap: 4,
							background: 'transparent', border: '1px solid #1e2440',
							borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
							fontFamily: 'monospace', fontSize: 10, color: '#475569', transition: 'all 0.15s',
						}}
							onMouseEnter={(e) => { e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.borderColor = '#22d3ee60'; }}
							onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#1e2440'; }}
						>
							↓ .docx
						</button>
					</div>
				</div>

				{/* SQL View */}
				{view === 'sql' && (
					<div style={{ padding: '20px 24px', background: '#060810', minHeight: 180, overflowX: 'auto' }}>
						<pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.9, whiteSpace: 'pre' }}>
							{sql.tokens.map((line, li) => (
								<span key={li}>
									{line.map((tok, ti) => (
										<span key={ti} style={{
											color: tok.type === 'kw' ? '#22d3ee'
												: tok.type === 'str' ? '#f472b6'
												: '#64748b',
											fontWeight: tok.type === 'kw' ? 700 : 400,
										}}>
											{tok.text}
										</span>
									))}
									{'\n'}
								</span>
							))}
						</pre>
					</div>
				)}

				{/* Polars DataFrame view */}
				{view === 'polars' && (
					<div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 440 }}>
						{items.length === 0 ? (
							<div style={{ padding: '52px 24px', textAlign: 'center', fontFamily: 'monospace', color: '#334155', fontSize: 13 }}>
								DataFrame vacío — ninguna fila pasa los filtros actuales.
							</div>
						) : (
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
									{/* Type row */}
									<tr style={{ background: '#060810' }}>
										<th style={{ padding: '3px 14px', fontFamily: 'monospace', fontSize: 9, color: '#1e2440', textAlign: 'right', minWidth: 44 }}>#</th>
										{fields.map((f) => (
											<th key={f} style={{ padding: '3px 14px 2px', fontFamily: 'monospace', fontSize: 9, color: '#1e2440', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>
												{COL_TYPE[f] ?? 'Utf8'}
											</th>
										))}
									</tr>
									{/* Column name row */}
									<tr style={{ background: '#0b0e1c', borderBottom: '2px solid #1e2440' }}>
										<th style={{ padding: '6px 14px', fontFamily: 'monospace', fontSize: 11, color: '#334155', textAlign: 'right' }}>—</th>
										{fields.map((f) => (
											<th key={f} style={{ padding: '6px 14px', fontFamily: 'monospace', fontSize: 11, color: '#22d3ee', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
												{COL_LABEL[f] ?? f}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{items.map((item, i) => (
										<tr key={item.id ?? i} style={{ borderBottom: '1px solid #141929', background: i % 2 === 0 ? 'transparent' : '#0d1020' }}>
											<td style={{ padding: '5px 14px', fontFamily: 'monospace', fontSize: 11, color: '#1e2440', textAlign: 'right', userSelect: 'none' }}>
												{i}
											</td>
											{fields.map((f) => (
												<td key={f} style={{ padding: '5px 14px', whiteSpace: 'nowrap' }}>
													<CellValue field={f} value={item[f]} />
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				)}

				{/* Status bar */}
				<div style={{ padding: '5px 14px', background: '#060810', borderTop: '1px solid #1e2440', display: 'flex', gap: 16 }}>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: '#334155' }}>{items.length} rows × {fields.length} cols</span>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: '#1e2440' }}>|</span>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: '#1e2440' }}>DataFrame · denki-sample.docx → Polars</span>
				</div>
			</div>
		);
	},
);
