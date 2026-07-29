import {
	Document, Packer, Paragraph, Table, TableRow, TableCell,
	TextRun, HeadingLevel, WidthType, BorderStyle,
} from 'docx';
import type { DataItem } from '../../../../data/denkiDataset';

const FIELD_LABELS: Record<string, string> = {
	name: 'Título', genre: 'Género', director: 'Director',
	year: 'Año', rating: 'Rating', duration: 'Duración (min)',
	language: 'Idioma', era: 'Era',
};

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' };
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function headerCell(text: string) {
	return new TableCell({
		children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: '334155' })] })],
		shading: { fill: 'F8FAFC' },
		borders: CELL_BORDERS,
	});
}

function dataCell(text: string) {
	return new TableCell({
		children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
		borders: CELL_BORDERS,
	});
}

export async function downloadDocx(
	items: Partial<DataItem>[],
	fields: (keyof DataItem)[],
	filename = 'denki-peliculas.docx',
) {
	const headerRow = new TableRow({
		children: fields.map((f) => headerCell(FIELD_LABELS[f] ?? f)),
		tableHeader: true,
	});

	const dataRows = items.map(
		(item) =>
			new TableRow({
				children: fields.map((f) => {
					const v = item[f];
					const text = f === 'duration' ? `${v} min` : String(v ?? '—');
					return dataCell(text);
				}),
			}),
	);

	const doc = new Document({
		sections: [
			{
				children: [
					new Paragraph({ text: 'Denki Pipeline Designer — Resultado', heading: HeadingLevel.HEADING_1 }),
					new Paragraph({ children: [new TextRun({ text: `${items.length} película${items.length !== 1 ? 's' : ''} exportadas`, size: 20 })] }),
					new Paragraph({}),
					new Table({
						width: { size: 100, type: WidthType.PERCENTAGE },
						rows: [headerRow, ...dataRows],
					}),
				],
			},
		],
	});

	const blob = await Packer.toBlob(doc);
	const url = URL.createObjectURL(blob);
	const link = Object.assign(document.createElement('a'), { href: url, download: filename });
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
