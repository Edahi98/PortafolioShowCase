import { useEffect, useMemo, useState } from 'react';
import MiniSearch from 'minisearch';
import FlipCard from './FlipCard';

type SoftSkillSearchProps = {
	skills: string[];
};

function shouldFlipFromUrl() {
	if (typeof window === 'undefined') return false;
	return new URLSearchParams(window.location.search).get('flip') === 'habilidades-blandas';
}

export default function SoftSkillSearch({ skills }: SoftSkillSearchProps) {
	const [query, setQuery] = useState('');
	// Flip manual (click) o disparado por el botón del hero; la búsqueda lo sobreescribe mientras hay texto.
	const [manualFlipped, setManualFlipped] = useState<Set<number>>(new Set());

	// El estado inicial debe coincidir con el HTML renderizado en el servidor (sin voltear) para
	// evitar un mismatch de hidratación; el flip por URL se aplica ya montado, en el cliente.
	useEffect(() => {
		if (!shouldFlipFromUrl()) return;
		setManualFlipped(new Set(skills.map((_, id) => id)));

		const url = new URL(window.location.href);
		url.searchParams.delete('flip');
		window.history.replaceState({}, '', url);
	}, [skills]);

	const miniSearch = useMemo(() => {
		const index = new MiniSearch<{ id: number; text: string }>({
			fields: ['text'],
			storeFields: ['text'],
		});
		index.addAll(skills.map((text, id) => ({ id, text })));
		return index;
	}, [skills]);

	const searchFlipped = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed) return null;
		const results = miniSearch.search(trimmed, { prefix: true, fuzzy: 0.2 });
		return new Set(results.map((result) => result.id as number));
	}, [query, miniSearch]);

	const flipped = searchFlipped ?? manualFlipped;

	function toggleCard(id: number) {
		setManualFlipped((prev) => {
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
