import { useCallback, useMemo } from 'react';
import ReactFlow, {
	Background,
	Controls,
	type Node,
	type Edge,
	BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { usePipeline } from './hooks/usePipeline';
import { SettingsPanel } from './components/SettingsPanel';
import { PdfView } from './components/PdfView';
import { SourceNode } from './nodes/SourceNode';
import { FilterNode } from './nodes/FilterNode';
import { TransformNode } from './nodes/TransformNode';
import { AggregateNode } from './nodes/AggregateNode';
import { OutputNode } from './nodes/OutputNode';
import { downloadDocx } from './utils/docxExport';
import type { DataItem } from '../../../data/denkiDataset';

const nodeTypes = {
	source: SourceNode,
	filter: FilterNode,
	transform: TransformNode,
	aggregate: AggregateNode,
	output: OutputNode,
};

const EDGE_STYLE = { stroke: '#4b5563', strokeWidth: 1.5 };

export default function DenkiPlayground() {
	const { settings, pipelineState, update, toggleField } = usePipeline();

	const nodes = useMemo<Node[]>(
		() => [
			{
				id: 'source',
				type: 'source',
				position: { x: 10, y: 80 },
				data: { count: pipelineState.sourceCount },
			},
			{
				id: 'filter',
				type: 'filter',
				position: { x: 185, y: 60 },
				data: {
					query: settings.query,
					category: settings.categoryFilter,
					difficulty: settings.difficultyFilter,
					count: pipelineState.filterCount,
				},
			},
			{
				id: 'transform',
				type: 'transform',
				position: { x: 375, y: 70 },
				data: { fields: pipelineState.transformedFields },
			},
			{
				id: 'aggregate',
				type: 'aggregate',
				position: { x: 550, y: 55 },
				data: { groups: pipelineState.groups },
			},
			{
				id: 'output',
				type: 'output',
				position: { x: 730, y: 80 },
				data: { count: pipelineState.outputItems.length },
			},
		],
		[settings, pipelineState],
	);

	const edges = useMemo<Edge[]>(
		() => [
			{ id: 'e1', source: 'source', target: 'filter', style: EDGE_STYLE, animated: true },
			{ id: 'e2', source: 'filter', target: 'transform', style: EDGE_STYLE, animated: true },
			{ id: 'e3', source: 'transform', target: 'aggregate', style: EDGE_STYLE, animated: true },
			{ id: 'e4', source: 'aggregate', target: 'output', style: EDGE_STYLE, animated: true },
		],
		[],
	);

	const handleDownload = useCallback(async () => {
		await downloadDocx(
			pipelineState.outputItems,
			pipelineState.transformedFields as (keyof DataItem)[],
		);
	}, [pipelineState]);

	return (
		<div className="flex flex-col gap-4 text-slate-100">
			{/* Pipeline canvas */}
			<div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden" style={{ height: 220 }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					fitView
					fitViewOptions={{ padding: 0.3 }}
					nodesDraggable={false}
					nodesConnectable={false}
					elementsSelectable={false}
					zoomOnScroll={false}
					panOnScroll={false}
					panOnDrag={false}
				>
					<Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#1e2440" />
					<Controls showInteractive={false} className="!border-slate-700 !bg-slate-800 !shadow-none" />
				</ReactFlow>
			</div>

			{/* Bottom: settings + pdf */}
			<div className="grid gap-4 lg:grid-cols-[260px_1fr]">
				{/* Settings */}
				<div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
					<SettingsPanel settings={settings} onUpdate={update} onToggleField={toggleField} />
				</div>

				{/* PDF view */}
				<div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4" style={{ minHeight: 400 }}>
					<PdfView
						items={pipelineState.outputItems}
						fields={pipelineState.transformedFields as (keyof DataItem)[]}
						settings={settings}
						groups={pipelineState.groups}
						onDownload={handleDownload}
					/>
				</div>
			</div>
		</div>
	);
}
