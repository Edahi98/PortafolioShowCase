import {
	Document,
	Packer,
	Paragraph,
	Table,
	TableRow,
	TableCell,
	TextRun,
	HeadingLevel,
	WidthType,
	BorderStyle,
} from 'docx';
import type { DataItem } from '../../../../data/denkiDataset';

const FIELD_LABELS: Record<string, string> = {
	name: 'Nombre',
	category: 'Categoría',
	language: 'Lenguaje',
	difficulty: 'Dificultad',
	description: 'Descripción',
	stars: 'Estrellas',
};

function headerCell(text: string) {
	return new TableCell({
		children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
		shading: { fill: '1E2440' },
		borders: {
			top: { style: BorderStyle.SINGLE, size: 1 },
			bottom: { style: BorderStyle.SINGLE, size: 1 },
			left: { style: BorderStyle.SINGLE, size: 1 },
			right: { style: BorderStyle.SINGLE, size: 1 },
		},
	});
}

function dataCell(text: string) {
	return new TableCell({
		children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
		borders: {
			top: { style: BorderStyle.SINGLE, size: 1 },
			bottom: { style: BorderStyle.SINGLE, size: 1 },
			left: { style: BorderStyle.SINGLE, size: 1 },
			right: { style: BorderStyle.SINGLE, size: 1 },
		},
	});
}

export async function downloadDocx(
	items: Partial<DataItem>[],
	fields: (keyof DataItem)[],
	filename = 'denki-resultado.docx',
) {
	const headerRow = new TableRow({
		children: fields.map((f) => headerCell(FIELD_LABELS[f] ?? f)),
		tableHeader: true,
	});

	const dataRows = items.map(
		(item) =>
			new TableRow({
				children: fields.map((f) => dataCell(String(item[f] ?? '—'))),
			}),
	);

	const doc = new Document({
		sections: [
			{
				children: [
					new Paragraph({
						text: 'Denki Pipeline Designer — Resultado Filtrado',
						heading: HeadingLevel.HEADING_1,
					}),
					new Paragraph({
						children: [
							new TextRun({
								text: `${items.length} elemento${items.length !== 1 ? 's' : ''} exportados`,
								size: 20,
							}),
						],
					}),
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
