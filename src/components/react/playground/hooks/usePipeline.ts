import { useMemo, useState } from 'react';
import MiniSearch from 'minisearch';
import { DATASET, type DataItem, type Category, type Difficulty } from '../../../../data/denkiDataset';

export type VisibleFields = {
	name: boolean;
	category: boolean;
	language: boolean;
	difficulty: boolean;
	description: boolean;
	stars: boolean;
};

export type PipelineSettings = {
	query: string;
	categoryFilter: Category | 'All';
	difficultyFilter: Difficulty | 'All';
	visibleFields: VisibleFields;
	groupByCategory: boolean;
};

export type PipelineState = {
	sourceCount: number;
	filterCount: number;
	transformedFields: (keyof DataItem)[];
	groups: Record<string, number>;
	outputItems: Partial<DataItem>[];
};

const DEFAULT_SETTINGS: PipelineSettings = {
	query: '',
	categoryFilter: 'All',
	difficultyFilter: 'All',
	visibleFields: {
		name: true,
		category: true,
		language: true,
		difficulty: true,
		description: true,
		stars: true,
	},
	groupByCategory: false,
};

const miniSearch = new MiniSearch<DataItem>({
	fields: ['name', 'description', 'language'],
	storeFields: ['id'],
	searchOptions: { prefix: true, fuzzy: 0.2 },
});
miniSearch.addAll(DATASET);

function applyFilter(settings: PipelineSettings): DataItem[] {
	let results = DATASET;

	if (settings.query.trim()) {
		const hits = miniSearch.search(settings.query);
		const hitIds = new Set(hits.map((h) => h.id));
		results = results.filter((item) => hitIds.has(item.id));
	}

	if (settings.categoryFilter !== 'All') {
		results = results.filter((item) => item.category === settings.categoryFilter);
	}

	if (settings.difficultyFilter !== 'All') {
		results = results.filter((item) => item.difficulty === settings.difficultyFilter);
	}

	return results;
}

function applyTransform(items: DataItem[], fields: VisibleFields): Partial<DataItem>[] {
	const activeFields = (Object.keys(fields) as (keyof DataItem)[]).filter(
		(f) => f === 'id' || fields[f as keyof VisibleFields],
	);
	return items.map((item) => {
		const out: Partial<DataItem> = { id: item.id };
		for (const f of activeFields) {
			if (f !== 'id') (out as Record<string, unknown>)[f] = item[f];
		}
		return out;
	});
}

function buildGroups(items: DataItem[]): Record<string, number> {
	return items.reduce<Record<string, number>>((acc, item) => {
		acc[item.category] = (acc[item.category] ?? 0) + 1;
		return acc;
	}, {});
}

export function usePipeline() {
	const [settings, setSettings] = useState<PipelineSettings>(DEFAULT_SETTINGS);

	const pipelineState = useMemo<PipelineState>(() => {
		const filtered = applyFilter(settings);
		const transformed = applyTransform(filtered, settings.visibleFields);
		const groups = buildGroups(filtered);
		const activeFields = (Object.keys(settings.visibleFields) as (keyof VisibleFields)[]).filter(
			(f) => settings.visibleFields[f],
		) as (keyof DataItem)[];

		return {
			sourceCount: DATASET.length,
			filterCount: filtered.length,
			transformedFields: activeFields,
			groups,
			outputItems: transformed,
		};
	}, [settings]);

	const update = (patch: Partial<PipelineSettings>) =>
		setSettings((prev) => ({ ...prev, ...patch }));

	const toggleField = (field: keyof VisibleFields) =>
		setSettings((prev) => ({
			...prev,
			visibleFields: { ...prev.visibleFields, [field]: !prev.visibleFields[field] },
		}));

	return { settings, pipelineState, update, toggleField };
}
