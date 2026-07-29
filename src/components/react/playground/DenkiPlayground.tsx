import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	type Node,
	type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlaskConical, Zap } from 'lucide-react';

import { usePipeline } from './hooks/usePipeline';
import { ResultTable } from './components/ResultTable';
import { SourceNode } from './nodes/SourceNode';
import { FilterNode } from './nodes/FilterNode';
import { TransformNode } from './nodes/TransformNode';
import { AggregateNode } from './nodes/AggregateNode';
import { OutputNode } from './nodes/OutputNode';
import { downloadDocx } from './utils/docxExport';
import type { DataItem, Genre, Era } from '../../../data/denkiDataset';
import type { VisibleFields } from './hooks/usePipeline';

// nodeTypes MUST be defined outside the component to avoid ReactFlow re-mounting nodes
const nodeTypes = {
	source: SourceNode,
	filter: FilterNode,
	transform: TransformNode,
	aggregate: AggregateNode,
	output: OutputNode,
};

const EDGES: Edge[] = [
	{ id: 'e1', source: 'source', target: 'filter',    animated: true, style: { stroke: 'rgba(255,255,255,0.55)', strokeWidth: 2.5 } },
	{ id: 'e2', source: 'filter', target: 'transform', animated: true, style: { stroke: 'rgba(255,255,255,0.55)', strokeWidth: 2.5 } },
	{ id: 'e3', source: 'transform', target: 'aggregate', animated: true, style: { stroke: 'rgba(255,255,255,0.55)', strokeWidth: 2.5 } },
	{ id: 'e4', source: 'aggregate', target: 'output', animated: true, style: { stroke: 'rgba(255,255,255,0.55)', strokeWidth: 2.5 } },
];

export default function DenkiPlayground() {
	const { settings, pipelineState, update, toggleField } = usePipeline();
	const outputRef = useRef<HTMLDivElement>(null);

	const handleView = useCallback(() => {
		outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, []);

	const handleDownload = useCallback(async () => {
		await downloadDocx(
			pipelineState.outputItems,
			pipelineState.transformedFields as (keyof DataItem)[],
		);
	}, [pipelineState]);

	const handleQueryChange      = useCallback((v: string)        => update({ query: v }),              [update]);
	const handleCategoryChange   = useCallback((v: Genre | 'All') => update({ categoryFilter: v }),     [update]);
	const handleDifficultyChange = useCallback((v: Era | 'All')   => update({ difficultyFilter: v }),   [update]);
	const handleToggleField      = useCallback((f: keyof VisibleFields) => toggleField(f),             [toggleField]);
	const handleToggleGroup      = useCallback((v: boolean)        => update({ groupByCategory: v }),   [update]);

	const nodes = useMemo<Node[]>(
		() => [
			{
				id: 'source', type: 'source', position: { x: 20, y: 60 },
				data: { count: pipelineState.sourceCount },
			},
			{
				id: 'filter', type: 'filter', position: { x: 230, y: 20 },
				data: {
					query: settings.query,
					categoryFilter: settings.categoryFilter,
					difficultyFilter: settings.difficultyFilter,
					count: pipelineState.filterCount,
					total: pipelineState.sourceCount,
					onQueryChange: handleQueryChange,
					onCategoryChange: handleCategoryChange,
					onDifficultyChange: handleDifficultyChange,
				},
			},
			{
				id: 'transform', type: 'transform', position: { x: 464, y: 40 },
				data: { visibleFields: settings.visibleFields, onToggleField: handleToggleField },
			},
			{
				id: 'aggregate', type: 'aggregate', position: { x: 678, y: 20 },
				data: {
					groups: pipelineState.groups,
					total: pipelineState.filterCount,
					groupByCategory: settings.groupByCategory,
					onToggleGroup: handleToggleGroup,
				},
			},
			{
				id: 'output', type: 'output', position: { x: 896, y: 60 },
				data: {
					count: pipelineState.outputItems.length,
					fields: pipelineState.transformedFields.length,
					onView: handleView,
					onDownload: handleDownload,
				},
			},
		],
		[settings, pipelineState, handleQueryChange, handleCategoryChange, handleDifficultyChange, handleToggleField, handleToggleGroup, handleView, handleDownload],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Pipeline canvas */}
			<div
				className="rounded-2xl overflow-hidden"
				style={{
					border: '1px solid rgba(255,255,255,0.1)',
					boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
				}}
			>
				{/* Toolbar header — Denki style */}
				<div style={{
					display: 'flex', alignItems: 'center', gap: 10,
					padding: '9px 16px',
					background: 'rgba(15,23,42,0.75)',
					backdropFilter: 'blur(12px)',
					borderBottom: '1px solid rgba(255,255,255,0.08)',
					flexWrap: 'wrap',
				}}>
					{/* Brand */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
						<Zap size={14} color="#38bdf8" />
						<span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em' }}>
							DENKI PIPELINE
						</span>
					</div>

					<div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />

					<span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
						denki-sample.docx → Polars LazyFrame
					</span>

					<div style={{ flex: 1 }} />

					{/* Status pills */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<span style={{
							fontFamily: 'ui-monospace,monospace', fontSize: 9, fontWeight: 700,
							color: '#34d399', background: 'rgba(52,211,153,0.12)',
							border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '2px 8px',
						}}>
							{pipelineState.sourceCount} registros
						</span>
						<span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>→</span>
						<span style={{
							fontFamily: 'ui-monospace,monospace', fontSize: 9, fontWeight: 700,
							color: '#38bdf8', background: 'rgba(56,189,248,0.12)',
							border: '1px solid rgba(56,189,248,0.3)', borderRadius: 20, padding: '2px 8px',
						}}>
							{pipelineState.filterCount} filtrados
						</span>
						<span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>→</span>
						<span style={{
							fontFamily: 'ui-monospace,monospace', fontSize: 9, fontWeight: 700,
							color: '#c084fc', background: 'rgba(192,132,252,0.12)',
							border: '1px solid rgba(192,132,252,0.3)', borderRadius: 20, padding: '2px 8px',
						}}>
							{pipelineState.transformedFields.length} cols
						</span>
					</div>

					<button
						onClick={handleView}
						style={{
							display: 'flex', alignItems: 'center', gap: 5,
							padding: '5px 12px', borderRadius: 8, cursor: 'pointer', border: 'none',
							background: 'linear-gradient(to right,#10b981,#14b8a6)',
							color: '#fff', fontFamily: 'ui-monospace,monospace', fontSize: 10, fontWeight: 700,
							boxShadow: '0 0 12px rgba(16,185,129,0.3)',
						}}
					>
						<FlaskConical size={12} />
						Ver resultado
					</button>
				</div>

				{/* ReactFlow canvas — Denki gradient background */}
				<div
					className="denki-canvas"
					style={{
						height: 380,
						background: 'linear-gradient(109.6deg, #1b0a2e 11.2%, #0d1432 100.2%)',
					}}
				>
					<ReactFlow
						nodes={nodes}
						edges={EDGES}
						nodeTypes={nodeTypes}
						fitView
						fitViewOptions={{ padding: 0.12, minZoom: 0.5, maxZoom: 1 }}
						minZoom={0.3}
						maxZoom={1.5}
						nodesDraggable={true}
						nodesConnectable={false}
						elementsSelectable={false}
						deleteKeyCode={null}
						style={{ background: 'transparent' }}
					>
						<Background
							variant={BackgroundVariant.Dots}
							gap={20}
							size={1}
							color="rgba(255,255,255,0.25)"
						/>
						<Controls
							showInteractive={false}
							style={{
								background: 'rgba(15,23,42,0.6)',
								backdropFilter: 'blur(8px)',
								border: '1px solid rgba(59,130,246,0.4)',
								borderRadius: 8,
							}}
						/>
						<MiniMap
							maskColor="rgba(0,0,0,0.75)"
							style={{
								background: 'rgba(15,23,42,0.6)',
								backdropFilter: 'blur(8px)',
								border: '2px solid rgba(59,130,246,0.4)',
								borderRadius: 8,
							}}
							nodeColor={() => 'rgba(56,189,248,0.6)'}
						/>
					</ReactFlow>
				</div>
			</div>

			{/* Output section */}
			<ResultTable
				ref={outputRef}
				items={pipelineState.outputItems}
				fields={pipelineState.transformedFields as (keyof DataItem)[]}
				settings={settings}
				groups={pipelineState.groups}
				onDownload={handleDownload}
			/>
		</div>
	);
}
