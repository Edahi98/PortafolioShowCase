export interface FormacionItem {
	titulo: string;
	institucion: string;
	periodo: string;
}

export interface CertItem {
	titulo: string;
	institucion: string;
	periodo: string;
	duracion?: string;
	proyecto?: string;
	href: string;
	label: string;
}

export const formacion: FormacionItem[] = [
	{
		titulo: 'Ingeniería en Desarrollo y Gestión de Software',
		institucion: 'Universidad Tecnológica de Tecámac',
		periodo: '2025 - 2026',
	},
];

export const certificaciones: CertItem[] = [
	{
		titulo: 'Bootcamp Solana Blockchain (WEB3)',
		institucion: 'WayLearn Latinoamérica',
		periodo: 'Febrero 2026 - Marzo 2026',
		href: '/certificado-solana',
		label: 'Ver certificado',
	},
];

export const cursos: CertItem[] = [
	{
		titulo: 'Master en Web Scraping con Python + ChatGPT [2024]',
		institucion: 'Udemy · Frank Andrade',
		periodo: 'Noviembre 2025',
		duracion: '8.5 horas',
		href: '/curso-webscraping',
		label: 'Ver certificado',
	},
];

export const reconocimientos: CertItem[] = [
	{
		titulo: '2.° Lugar — 6.° Concurso de Creación de Videojuegos',
		institucion: 'Universidad Tecnológica de Tecámac',
		periodo: '08 de abril de 2026',
		proyecto: 'Pasar es Pasar',
		href: '/reconocimiento-videojuegos',
		label: 'Ver reconocimiento',
	},
];
