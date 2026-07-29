import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	type Node,
	type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { usePipeline } from './hooks/usePipeline';
import { PdfView } from './components/PdfView';
import { SourceNode } from './nodes/SourceNode';
import { FilterNode } from './nodes/FilterNode';
import { TransformNode } from './nodes/TransformNode';
import { AggregateNode } from './nodes/AggregateNode';
import { OutputNode } from './nodes/OutputNode';
import { downloadDocx } from './utils/docxExport';
import type { DataItem } from '../../../data/denkiDataset';
import type { Category, Difficulty } from '../../../data/denkiDataset';
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
	{ id: 'e1', source: 'source', target: 'filter', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
	{ id: 'e2', source: 'filter', target: 'transform', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
	{ id: 'e3', source: 'transform', target: 'aggregate', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
	{ id: 'e4', source: 'aggregate', target: 'output', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
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

	const handleQueryChange = useCallback((v: string) => update({ query: v }), [update]);
	const handleCategoryChange = useCallback((v: Category | 'All') => update({ categoryFilter: v }), [update]);
	const handleDifficultyChange = useCallback((v: Difficulty | 'All') => update({ difficultyFilter: v }), [update]);
	const handleToggleField = useCallback((f: keyof VisibleFields) => toggleField(f), [toggleField]);
	const handleToggleGroup = useCallback((v: boolean) => update({ groupByCategory: v }), [update]);

	const nodes = useMemo<Node[]>(
		() => [
			{
				id: 'source',
				type: 'source',
				position: { x: 20, y: 60 },
				data: { count: pipelineState.sourceCount },
			},
			{
				id: 'filter',
				type: 'filter',
				position: { x: 230, y: 20 },
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
				id: 'transform',
				type: 'transform',
				position: { x: 464, y: 40 },
				data: {
					visibleFields: settings.visibleFields,
					onToggleField: handleToggleField,
				},
			},
			{
				id: 'aggregate',
				type: 'aggregate',
				position: { x: 678, y: 20 },
				data: {
					groups: pipelineState.groups,
					total: pipelineState.filterCount,
					groupByCategory: settings.groupByCategory,
					onToggleGroup: handleToggleGroup,
				},
			},
			{
				id: 'output',
				type: 'output',
				position: { x: 896, y: 60 },
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
				className="rounded-2xl border border-slate-700/60 bg-[#090d1a] overflow-hidden"
				style={{ height: 380 }}
			>
				<ReactFlow
					nodes={nodes}
					edges={EDGES}
					nodeTypes={nodeTypes}
					fitView
					fitViewOptions={{ padding: 0.12, minZoom: 0.6, maxZoom: 1 }}
					minZoom={0.4}
					maxZoom={1.5}
					nodesDraggable={true}
					nodesConnectable={false}
					elementsSelectable={false}
					deleteKeyCode={null}
				>
					<Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e2440" />
				</ReactFlow>
			</div>

			{/* Output section */}
			<div ref={outputRef} className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="font-mono text-xs uppercase tracking-widest text-rose-400">
						Vista PDF — {pipelineState.outputItems.length} elementos
					</h3>
					<button
						onClick={handleDownload}
						className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/50 bg-rose-400/10 px-4 py-1.5 font-mono text-xs text-rose-300 transition hover:bg-rose-400/20"
					>
						Descargar DOCX ↓
					</button>
				</div>
				<div className="overflow-auto rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]">
					<PdfView
						items={pipelineState.outputItems}
						fields={pipelineState.transformedFields as (keyof DataItem)[]}
						settings={settings}
						groups={pipelineState.groups}
					/>
				</div>
			</div>
		</div>
	);
}
