"use client";
import "handsontable/dist/handsontable.full.css"; // Import Handsontable styles
import Handsontable from "handsontable";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

// ✅ Define customCellRenderer properly
<<<<<<< HEAD
function customCellRenderer(
=======
const customCellRenderer = function (
>>>>>>> origin/master
	instance,
	td,
	row,
	col,
	prop,
	value,
	cellProperties
) {
<<<<<<< HEAD
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
=======
	Handsontable.renderers.TextRenderer.call(
		this,
		instance,
		td,
		row,
		col,
		prop,
		value,
		cellProperties
	);

	const meta = instance.getCellMeta(row, col);

	// ✅ Apply bold styling if enabled
	td.style.fontWeight = meta.customBold ? "bold" : "normal";

	// ✅ Apply background color if set
	td.style.backgroundColor = meta.customColor ? meta.customColor : "";
};

const HandsontableComponent = forwardRef(
	({ onCellSelect, initialData }, ref) => {
>>>>>>> origin/master
		const containerRef = useRef(null);
		const hotRef = useRef(null);

		useImperativeHandle(ref, () => ({
			getInstance: () => hotRef.current,
		}));
<<<<<<< HEAD

=======
		useEffect(() => {
			console.log("HAndsonTable initial data:", initialData);
			let isMounted = true;
			if (hotRef.current && !hotRef.current.isDestroyed && initialData) {
				hotRef.current.loadData(initialData);
			}
			return () => {
				isMounted = false;
			};
		}, [initialData]);
>>>>>>> origin/master
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
<<<<<<< HEAD
			if (Array.isArray(initialMeta)) {
				initialMeta.forEach((meta) => {
					const cellMeta = hot.getCellMeta(meta.row, meta.col);
					Object.assign(cellMeta, meta);
				});
				hot.render();
			}
=======
>>>>>>> origin/master

			hotRef.current = hot;

			return () => hot.destroy();
<<<<<<< HEAD
		}, []);
=======
		}, [initialData]);
>>>>>>> origin/master

		return (
			<div ref={containerRef} className="w-full h-full overflow-auto"></div>
		);
	}
);

export default HandsontableComponent;
