import { useEffect, useMemo, useState } from 'react';
import MiniSearch from 'minisearch';
import FlipCard from './FlipCard';

type SoftSkillSearchProps = {
	skills: string[];
};

export default function SoftSkillSearch({ skills }: SoftSkillSearchProps) {
	const [query, setQuery] = useState('');
	const [flipped, setFlipped] = useState<Set<number>>(new Set());

	const miniSearch = useMemo(() => {
		const index = new MiniSearch<{ id: number; text: string }>({
			fields: ['text'],
			storeFields: ['text'],
		});
		index.addAll(skills.map((text, id) => ({ id, text })));
		return index;
	}, [skills]);

	useEffect(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setFlipped(new Set());
			return;
		}
		const results = miniSearch.search(trimmed, { prefix: true, fuzzy: 0.2 });
		setFlipped(new Set(results.map((result) => result.id as number)));
	}, [query, miniSearch]);

	function toggleCard(id: number) {
		setFlipped((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<input
				type="text"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Buscar habilidad..."
				aria-label="Buscar habilidad blanda"
				className="w-full rounded-full border border-border bg-surface-2 px-4 py-2 font-mono text-xs text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-primary"
			/>
			<div className="grid grid-cols-2 gap-3">
				{skills.map((skill, id) => (
					<FlipCard
						key={skill}
						label={skill}
						flipped={flipped.has(id)}
						onToggle={() => toggleCard(id)}
					/>
				))}
			</div>
		</div>
	);
}
