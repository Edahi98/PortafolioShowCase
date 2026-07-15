import { useState } from 'react';

type FlipCardProps = {
	iconSrc: string;
	alt: string;
	label: string;
};

export default function FlipCard({ iconSrc, alt, label }: FlipCardProps) {
	const [flipped, setFlipped] = useState(false);

	return (
		<button
			type="button"
			onClick={() => setFlipped((prev) => !prev)}
			aria-pressed={flipped}
			aria-label={label}
			className="h-28 w-full cursor-pointer [perspective:800px]"
		>
			<div
				className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
				style={{ transform: flipped ? 'rotateY(180deg)' : undefined }}
			>
				<div className="glass-card absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-colors hover:border-primary/60 [backface-visibility:hidden]">
					<img src={iconSrc} alt={alt} width={40} height={40} loading="lazy" className="h-10 w-10" />
				</div>
				<div
					className="glass-card absolute inset-0 flex items-center justify-center rounded-2xl p-4 text-center [backface-visibility:hidden]"
					style={{ transform: 'rotateY(180deg)' }}
				>
					<span className="font-mono text-xs text-slate-200">{label}</span>
				</div>
			</div>
		</button>
	);
}
