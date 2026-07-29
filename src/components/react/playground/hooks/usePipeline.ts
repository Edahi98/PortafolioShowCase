import { useMemo, useState } from 'react';
import MiniSearch from 'minisearch';
import { DATASET, type DataItem, type Genre, type Era } from '../../../../data/denkiDataset';

export type VisibleFields = {
	name: boolean;
	genre: boolean;
	director: boolean;
	year: boolean;
	rating: boolean;
	duration: boolean;
	language: boolean;
	era: boolean;
};

export type PipelineSettings = {
	query: string;
	categoryFilter: Genre | 'All';
	difficultyFilter: Era | 'All';
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

export const DEFAULT_SETTINGS: PipelineSettings = {
	query: '',
	categoryFilter: 'All',
	difficultyFilter: 'All',
	visibleFields: {
		name: true,
		genre: true,
		director: true,
		year: true,
		rating: true,
		duration: false,
		language: true,
		era: false,
	},
	groupByCategory: false,
};

const miniSearch = new MiniSearch<DataItem>({
	fields: ['name', 'director', 'language'],
	storeFields: ['id'],
	searchOptions: { prefix: true, fuzzy: 0.25 },
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
		results = results.filter((item) => item.genre === settings.categoryFilter);
	}
	if (settings.difficultyFilter !== 'All') {
		results = results.filter((item) => item.era === settings.difficultyFilter);
	}
	return results;
}

function applyTransform(items: DataItem[], fields: VisibleFields): Partial<DataItem>[] {
	const activeFields = (Object.keys(fields) as (keyof VisibleFields)[]).filter((f) => fields[f]);
	return items.map((item) => {
		const out: Partial<DataItem> = { id: item.id };
		for (const f of activeFields) out[f] = item[f] as never;
		return out;
	});
}

function buildGroups(items: DataItem[]): Record<string, number> {
	return items.reduce<Record<string, number>>((acc, item) => {
		acc[item.genre] = (acc[item.genre] ?? 0) + 1;
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
