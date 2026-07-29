import { forwardRef, useState } from 'react';
import { Database, Code2, Table2, Download } from 'lucide-react';
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

const PAGE_SIZE = 15;

function CellValue({ field, value }: { field: keyof DataItem; value: unknown }) {
	if (value === undefined || value === null)
		return <span style={{ color: '#475569', fontStyle: 'italic', fontSize: 11 }}>null</span>;
	const s = String(value);

	if (field === 'genre') {
		const c = GENRE_COLOR[s] ?? '#94a3b8';
		return <span style={{ color: c, fontWeight: 700, fontSize: 11 }}>{s}</span>;
	}
	if (field === 'era') {
		const c = ERA_COLOR[s] ?? '#94a3b8';
		return (
			<span style={{
				background: `${c}18`, border: `1px solid ${c}40`,
				color: c, borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 600,
			}}>
				{s}
			</span>
		);
	}
	if (field === 'rating') {
		const n = Number(s);
		const c = n >= 85 ? '#22c55e' : n >= 70 ? '#f59e0b' : '#ef4444';
		return (
			<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
				<span style={{ display: 'inline-block', width: 44, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
					<span style={{ display: 'block', width: `${n}%`, height: '100%', background: c, borderRadius: 2 }} />
				</span>
				<span style={{ color: c, fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{n}</span>
			</span>
		);
	}
	if (field === 'name')     return <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{s}</span>;
	if (field === 'director') return <span style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>{s}</span>;
	if (field === 'year' || field === 'duration')
		return <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{s}</span>;
	return <span style={{ color: '#cbd5e1', fontSize: 12 }}>{s}</span>;
}

function buildSql(settings: PipelineSettings, fields: (keyof DataItem)[]): { lines: { text: string; type: 'kw' | 'str' | 'plain' }[][] } {
	const cols = fields.map((f) => COL_LABEL[f] ?? f).join(', ');
	const conds: string[] = [];
	if (settings.query.trim())
		conds.push(`title ILIKE '%${settings.query}%'\n        OR director ILIKE '%${settings.query}%'`);
	if (settings.categoryFilter !== 'All') conds.push(`genre = '${settings.categoryFilter}'`);
	if (settings.difficultyFilter !== 'All') conds.push(`era = '${settings.difficultyFilter}'`);

	const raw: string[] = [
		`SELECT  ${cols}`,
		`FROM    denki_sample`,
		...(conds.length ? [`WHERE   ${conds.join('\n  AND   ')}`] : []),
		`;`,
	];

	return {
		lines: raw.map((line) => {
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

/* ─── PaginationBar ──────────────────────────────────────────────────────── */
function PaginationBar({ page, totalPages, totalItems, onPrev, onNext }: {
	page: number; totalPages: number; totalItems: number; onPrev: () => void; onNext: () => void;
}) {
	if (totalPages <= 1) return null;
	const start = page * PAGE_SIZE + 1;
	const end   = Math.min((page + 1) * PAGE_SIZE, totalItems);
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(15,23,42,0.5)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
			<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
				Mostrando {start}–{end} de {totalItems}
			</span>
			<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<button
					onClick={onPrev}
					disabled={page === 0}
					style={{
						padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.35)',
						background: 'rgba(15,23,42,0.6)', color: page === 0 ? '#334155' : '#94a3b8',
						fontFamily: 'monospace', fontSize: 10, cursor: page === 0 ? 'default' : 'pointer',
					}}
				>
					← Prev
				</button>
				<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
					{page + 1} / {totalPages}
				</span>
				<button
					onClick={onNext}
					disabled={page >= totalPages - 1}
					style={{
						padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.35)',
						background: 'rgba(15,23,42,0.6)', color: page >= totalPages - 1 ? '#334155' : '#94a3b8',
						fontFamily: 'monospace', fontSize: 10, cursor: page >= totalPages - 1 ? 'default' : 'pointer',
					}}
				>
					Next →
				</button>
			</div>
		</div>
	);
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export const ResultTable = forwardRef<HTMLDivElement, Props>(
	function ResultTable({ items, fields, settings, groups, onDownload }, ref) {
		const [view, setView] = useState<View>('polars');
		const [page, setPage] = useState(0);
		const sql = buildSql(settings, fields);
		const totalPages = Math.ceil(items.length / PAGE_SIZE);
		const paginated  = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

		// Reset to page 0 whenever filters change (items length changes)
		// This is done as a derived value — no extra effect needed
		const safePage   = Math.min(page, Math.max(0, totalPages - 1));
		const safeRows   = items.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
		void paginated; // safePage/safeRows are the used versions

		return (
			<div
				ref={ref}
				className="denki-scroll"
				style={{
					background: 'rgba(15,23,42,0.6)',
					backdropFilter: 'blur(14px)',
					WebkitBackdropFilter: 'blur(14px)',
					borderRadius: 16,
					overflow: 'hidden',
					border: '2px solid rgba(59,130,246,0.45)',
					boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* ── Header ── */}
				<div style={{
					display: 'flex', alignItems: 'center', justifyContent: 'space-between',
					padding: '10px 16px',
					background: 'rgba(10,15,35,0.7)',
					borderBottom: '2px solid rgba(59,130,246,0.4)',
					gap: 10, flexWrap: 'wrap',
				}}>
					{/* Left: icon + title + shape */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div style={{
							width: 30, height: 30, borderRadius: 8,
							background: 'rgba(16,185,129,0.12)',
							border: '1px solid rgba(16,185,129,0.3)',
							display: 'flex', alignItems: 'center', justifyContent: 'center',
						}}>
							<Table2 size={16} color="#34d399" />
						</div>
						<div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
									Resultado de Ejecución
								</span>
								<span style={{
									fontFamily: 'monospace', fontSize: 10,
									background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)',
									color: 'rgba(255,255,255,0.5)', borderRadius: 20, padding: '1px 8px',
								}}>
									{items.length} filas × {fields.length} cols
								</span>
							</div>
							<p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
								Resultado del pipeline de transformación ejecutado.
							</p>
						</div>
					</div>

					{/* Right: genre pills + download */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
						{Object.entries(groups).map(([g, n]) => (
							<span key={g} style={{
								fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
								color: GENRE_COLOR[g] ?? '#64748b',
								background: `${GENRE_COLOR[g] ?? '#64748b'}15`,
								borderRadius: 20, padding: '2px 7px',
							}}>
								{g} {n}
							</span>
						))}
						<button
							onClick={onDownload}
							style={{
								display: 'inline-flex', alignItems: 'center', gap: 5,
								background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
								borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
								fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)',
							}}
							onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'; }}
							onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
						>
							<Download size={11} />
							.docx
						</button>
					</div>
				</div>

				{/* ── ViewModeSwitch — Denki-style pill tabs with icons ── */}
				<div style={{
					padding: '10px 16px', background: 'rgba(10,15,35,0.5)',
					borderBottom: '1px solid rgba(139,92,246,0.25)',
					display: 'flex', alignItems: 'center', gap: 8,
				}}>
					<div style={{
						display: 'flex',
						background: 'rgba(15,23,42,0.7)',
						borderRadius: 8, padding: 4, gap: 4,
						border: '1px solid rgba(139,92,246,0.35)',
					}}>
						{([
							{ key: 'polars', icon: <Database size={13} />, label: 'Modo Polars' },
							{ key: 'sql',    icon: <Code2    size={13} />, label: 'Modo SQL' },
						] as const).map(({ key, icon, label }) => (
							<button
								key={key}
								onClick={() => setView(key)}
								style={{
									display: 'flex', alignItems: 'center', gap: 5,
									padding: '5px 12px', borderRadius: 6,
									border: view === key ? '2px solid rgba(59,130,246,0.5)' : '2px solid transparent',
									background: view === key ? 'rgba(15,23,42,0.8)' : 'transparent',
									color: view === key ? '#fff' : 'rgba(255,255,255,0.4)',
									fontFamily: 'ui-monospace,monospace', fontSize: 11, fontWeight: view === key ? 700 : 400,
									cursor: 'pointer', transition: 'all 0.15s',
									boxShadow: view === key ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
								}}
							>
								{icon}
								{label}
							</button>
						))}
					</div>

					{view === 'polars' && (
						<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>
							shape: ({items.length}, {fields.length})
						</span>
					)}
				</div>

				{/* ── SQL Mode ── */}
				{view === 'sql' && (
					<div style={{ padding: '20px 24px', background: 'rgba(10,15,35,0.6)', minHeight: 180, overflowX: 'auto' }}>
						<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
							<div style={{ flex: 1, minWidth: 280 }}>
								<h4 style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
									SQL Generado
								</h4>
								<pre style={{
									margin: 0, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.9,
									whiteSpace: 'pre', padding: '14px 16px', borderRadius: 12,
									background: 'rgba(59,130,246,0.07)',
									border: '1px solid rgba(59,130,246,0.2)',
									overflowX: 'auto',
								}}>
									{sql.lines.map((line, li) => (
										<span key={li}>
											{line.map((tok, ti) => (
												<span key={ti} style={{
													color: tok.type === 'kw' ? '#38bdf8'
														: tok.type === 'str' ? '#f472b6'
														: 'rgba(255,255,255,0.5)',
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
							<div style={{ flex: 1, minWidth: 220 }}>
								<h4 style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
									Polars Equivalente
								</h4>
								<pre style={{
									margin: 0, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8,
									padding: '14px 16px', borderRadius: 12,
									background: 'rgba(139,92,246,0.07)',
									border: '1px solid rgba(139,92,246,0.2)',
									color: 'rgba(192,132,252,0.8)',
								}}>
{`pl.scan_parquet("denki-sample")${settings.query.trim() ? `\n  .filter(\n    pl.col("title").str.contains("${settings.query}")\n    | pl.col("director").str.contains("${settings.query}")\n  )` : ''}${settings.categoryFilter !== 'All' ? `\n  .filter(pl.col("genre") == "${settings.categoryFilter}")` : ''}${settings.difficultyFilter !== 'All' ? `\n  .filter(pl.col("era") == "${settings.difficultyFilter}")` : ''}
  .select([${fields.map(f => `"${COL_LABEL[f] ?? f}"`).join(', ')}])
  .collect()`}
								</pre>
							</div>
						</div>
						<div style={{
							marginTop: 14, padding: '10px 14px', borderRadius: 10,
							background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
							display: 'flex', alignItems: 'center', gap: 8,
						}}>
							<span style={{ fontSize: 12, color: 'rgba(52,211,153,0.8)' }}>✓</span>
							<span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(52,211,153,0.7)' }}>
								Compilación SQL exitosa. No se reportaron errores en el parseo del AST.
							</span>
						</div>
					</div>
				)}

				{/* ── Polars DataFrame view ── */}
				{view === 'polars' && (
					<>
						<div className="denki-scroll" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 440 }}>
							{items.length === 0 ? (
								<div style={{ padding: '52px 24px', textAlign: 'center', fontFamily: 'monospace', color: '#334155', fontSize: 13 }}>
									DataFrame vacío — ninguna fila pasa los filtros actuales.
								</div>
							) : (
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
										{/* Type row */}
										<tr style={{ background: 'rgba(10,15,35,0.9)' }}>
											<th style={{ padding: '3px 14px', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.15)', textAlign: 'right', minWidth: 44 }}>#</th>
											{fields.map((f) => (
												<th key={f} style={{ padding: '3px 14px 2px', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>
													{COL_TYPE[f] ?? 'Utf8'}
												</th>
											))}
										</tr>
										{/* Column name row — emerald, uppercase, tracking (Denki style) */}
										<tr style={{ background: 'rgba(15,23,42,0.9)', borderBottom: '2px solid rgba(59,130,246,0.4)' }}>
											<th style={{ padding: '7px 14px', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'right', fontWeight: 600 }}>—</th>
											{fields.map((f) => (
												<th key={f} style={{
													padding: '7px 14px', fontFamily: 'monospace', fontSize: 11,
													color: '#34d399', fontWeight: 700, textAlign: 'left',
													whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase',
												}}>
													{COL_LABEL[f] ?? f}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{safeRows.map((item, i) => (
											<tr
												key={item.id ?? i}
												style={{
													borderBottom: '1px solid rgba(139,92,246,0.2)',
													background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
													transition: 'background 0.1s',
												}}
												onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
												onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}
											>
												<td style={{ padding: '5px 14px', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'right', userSelect: 'none' }}>
													{safePage * PAGE_SIZE + i + 1}
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
						<PaginationBar
							page={safePage}
							totalPages={totalPages}
							totalItems={items.length}
							onPrev={() => setPage((p) => Math.max(0, p - 1))}
							onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
						/>
					</>
				)}

				{/* ── Status bar ── */}
				<div style={{
					padding: '5px 14px', background: 'rgba(10,15,35,0.7)',
					borderTop: view === 'polars' && totalPages <= 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
					display: 'flex', gap: 12, alignItems: 'center',
				}}>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
						{items.length} rows × {fields.length} cols
					</span>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.1)' }}>|</span>
					<span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>
						DataFrame · denki-sample.docx → Polars LazyFrame
					</span>
				</div>
			</div>
		);
	},
);
