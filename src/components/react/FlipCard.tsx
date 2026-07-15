import { useState } from 'react';

type FlipCardProps = {
	label: string;
	iconSrc?: string;
	alt?: string;
};

export default function FlipCard({ label, iconSrc, alt }: FlipCardProps) {
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
					{iconSrc ? (
						<img
							src={iconSrc}
							alt={alt ?? label}
							width={40}
							height={40}
							loading="lazy"
							className="h-10 w-10"
						/>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
							className="h-8 w-8 text-primary"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.95-6.95-2.12 2.12M8.17 15.83l-2.12 2.12m0-13.9 2.12 2.12m9.66 9.66 2.12 2.12"
							/>
						</svg>
					)}
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
