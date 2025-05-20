"use client";
import "handsontable/dist/handsontable.full.css"; // Import Handsontable styles
import Handsontable from "handsontable";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

// ✅ Define customCellRenderer properly
const customCellRenderer = function (
	instance,
	td,
	row,
	col,
	prop,
	value,
	cellProperties
) {
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
		const containerRef = useRef(null);
		const hotRef = useRef(null);

		useImperativeHandle(ref, () => ({
			getInstance: () => hotRef.current,
		}));
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

			hotRef.current = hot;

			return () => hot.destroy();
		}, [initialData]);

		return (
			<div ref={containerRef} className="w-full h-full overflow-auto"></div>
		);
	}
);

export default HandsontableComponent;
