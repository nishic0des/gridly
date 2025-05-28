"use client";
import "handsontable/dist/handsontable.full.css"; // Import Handsontable styles
import Handsontable from "handsontable";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

// ✅ Define customCellRenderer properly
function customCellRenderer(
	instance,
	td,
	row,
	col,
	prop,
	value,
	cellProperties
) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);

	const meta = instance.getCellMeta(row, col);
	td.style.fontWeight = meta.bold ? "bold" : "normal";
	// Italic
	td.style.fontStyle = meta.italic ? "italic" : "normal";
	// Underline
	td.style.textDecoration = meta.underline ? "underline" : "none";
	// Font size
	td.style.fontSize = meta.fontSize || "inherit";
	// Text color
	td.style.color = meta.color || "inherit";
	// Background color
	td.style.backgroundColor = meta.backgroundColor || "inherit";
	// Alignment
	td.style.textAlign = meta.alignment || "left";
}

const HandsontableComponent = forwardRef(
	({ onCellSelect, initialData, initialMeta }, ref) => {
		const containerRef = useRef(null);
		const hotRef = useRef(null);

		useImperativeHandle(ref, () => ({
			getInstance: () => hotRef.current,
		}));
		useEffect(() => {
			const rows = 100;
			const cols = 26;
			const data = Array.from({ length: rows }, () => Array(cols).fill(""));

			// ✅ Initialize Handsontable
			const hot = new Handsontable(containerRef.current, {
				data: initialData.length > 0 ? initialData : data,
				rowHeaders: true,
				colHeaders: Array.from({ length: cols }, (_, index) =>
					String.fromCharCode(65 + index)
				),
				height: 800,
				width: "100%",
				stretchH: "all",
				columnSorting: true,
				contextMenu: true,
				manualColumnResize: true,
				manualRowResize: true,
				licenseKey: "non-commercial-and-evaluation",

				rowHeights: 30,
				colWidths: 100,

				// ✅ Use custom renderer
				cells: (row, col) => {
					return { renderer: customCellRenderer };
				},

				afterSelection: (row, col) => {
					if (onCellSelect) {
						onCellSelect({ row, col });
					}
				},
			});
			if (Array.isArray(initialMeta)) {
				initialMeta.forEach((meta) => {
					const cellMeta = hot.getCellMeta(meta.row, meta.col);
					Object.assign(cellMeta, meta);
				});
				hot.render();
			}

			hotRef.current = hot;

			return () => hot.destroy();
		}, []);

		return (
			<div ref={containerRef} className="w-full h-full overflow-auto"></div>
		);
	}
);

export default HandsontableComponent;
