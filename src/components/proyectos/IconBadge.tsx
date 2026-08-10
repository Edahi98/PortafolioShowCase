import type { ReactNode } from 'react';

type Variant = 'plain' | 'emerald' | 'cyan' | 'yellow';

const VARIANTS: Record<Variant, string> = {
	plain:   'rounded-full bg-surface/80 p-1.5 backdrop-blur transition hover:opacity-80',
	emerald: 'flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/20 text-emerald-300 shadow-[0_0_12px_-2px] shadow-emerald-400/50 backdrop-blur transition hover:bg-emerald-400/30',
	cyan:    'flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-400/20 text-cyan-300 shadow-[0_0_12px_-2px] shadow-cyan-400/50 backdrop-blur transition hover:bg-cyan-400/30',
	yellow:  'flex h-8 w-8 items-center justify-center rounded-full border border-yellow-400/60 bg-yellow-400/20 text-yellow-300 shadow-[0_0_12px_-2px] shadow-yellow-400/50 backdrop-blur transition hover:bg-yellow-400/30',
};

interface Props {
	href: string;
	label: string;
	variant?: Variant;
	children: ReactNode;
}

export function IconBadge({ href, label, variant = 'plain', children }: Props) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			aria-label={label}
			className={`pointer-events-auto ${VARIANTS[variant]}`}
		>
			{children}
		</a>
	);
}
