"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect, useRef } from "react";
import { useSyncState } from "@/hooks/useSyncState";
import toast from "react-hot-toast";
import { useCallback } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@clerk/nextjs";
import { memo } from "react";
import {
	Bold,
	Italic,
	Underline,
	TextCursorInput,
	Palette,
	Paintbrush,
	AlignCenter,
	AlignLeft,
	AlignRight,
	
} from "lucide-react";
import { SketchPicker } from "react-color";
import HandsontableComponent from "./HandsontableComponent";
import AIAssistant from "./AIAssistant";
import VoiceCommandBar from "./VoiceCommandBar";

const SpreadsheetPage = memo(({ id, initialData }) => {
	const { user, loading: userLoading } = useUser();
	const [spreadsheet, setSpreadsheet] = useState(initialData);
	const { getToken } = useAuth();
	const initialId = id;
	const [spreadsheetId, setSpreadsheetId] = useState(initialId);

	// Formatting state
	const [selectedCell, setSelectedCell] = useState(null);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showTextColorPicker, setShowTextColorPicker] = useState(false);
	const [currentColor, setCurrentColor] = useState("#ffffff");
	const [currentTextColor, setCurrentTextColor] = useState("#000000");
	const hotRef = useRef(null);
	const sync = useSyncState();
	const [title, setTitle] = useState("Untitled Spreadsheet");

	useEffect(() => {
		// console.log("Spreadsheet id updated:", spreadsheetId);
	}, [spreadsheetId]);

	// const spreadsheetData = useMemo(() => spreadsheet?.data || [], [spreadsheet]);
	// const initialMeta = useMemo(() => {
	// 	if (!spreadsheet?.meta) return [];
	// 	return Object.entries(spreadsheet.meta).flatMap(([row, cols]) =>
	// 		Object.entries(cols).map(([col, meta]) => ({
	// 			row: Number(row),
	// 			col: Number(col),
	// 			...meta,
	// 		}))
	// 	);
	// }, [spreadsheet?.meta]);

	useEffect(() => {
		if (spreadsheet?.name) {
			setTitle(spreadsheet.name);
		}
	}, [spreadsheet?.name, setTitle]);

	useEffect(() => {
		if (
			hotRef.current &&
			spreadsheet &&
			spreadsheet.meta // <-- make sure meta exists
		) {
			const instance = hotRef.current.getInstance();
			const meta = spreadsheet.meta;
			// console.log("Meta data:", meta);
			Object.entries(meta).forEach(([row, cols]) => {
				Object.entries(cols).forEach(([col, cellMeta]) => {
					Object.entries(cellMeta).forEach(([key, value]) => {
						instance.setCellMeta(Number(row), Number(col), key, value);
					});
				});
			});
			instance.render();
		}
	}, [spreadsheet, hotRef]);

	useEffect(() => {
		if (spreadsheet?.name) {
			setTitle(spreadsheet.name);
		}
	}, [spreadsheet]);

	const router = useRouter();

	useEffect(() => {
		if (!user && !userLoading) {
			router.replace("/login");
		}
	}, [user, router, userLoading]);

	// Formatting functions
	const handleCellSelectMemoized = useCallback((cell) => {
		setSelectedCell(cell);
		if (hotRef.current) {
			const instance = hotRef.current.getInstance();
			const meta = instance.getCellMeta(cell.row, cell.col);
			setCurrentColor(meta.backgroundColor || "#ffffff");
			setCurrentTextColor(meta.color || "#000000");
		}
	}, []);

	function getAllCellMeta(instance) {
		const meta = {};
		const rows = instance.countRows();
		const cols = instance.countCols();
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const cellMeta = instance.getCellMeta(row, col);
				const {
					bold,
					italic,
					underline,
					fontSize,
					color,
					backgroundColor,
					alignment,
				} = cellMeta;
				if (
					bold ||
					italic ||
					underline ||
					fontSize ||
					color ||
					backgroundColor ||
					alignment
				) {
					if (!meta[row]) meta[row] = {};
					meta[row][col] = {
						...(bold !== undefined && { bold }),
						...(italic !== undefined && { italic }),
						...(underline !== undefined && { underline }),
						...(fontSize && { fontSize }),
						...(color && { color }),
						...(backgroundColor && { backgroundColor }),
						...(alignment && { alignment }),
					};
				}
			}
		}
		return meta;
	}

	const applyFormatting = (property, value) => {
		if (!selectedCell || !hotRef.current) return;

		const instance = hotRef.current.getInstance();
		instance.setCellMeta(selectedCell.row, selectedCell.col, property, value);
		instance.render();
	};

	const toggleFormatting = (property) => {
		if (!selectedCell || !hotRef.current) return;

		const instance = hotRef.current.getInstance();
		const currentValue =
			instance.getCellMeta(selectedCell.row, selectedCell.col)[property] ||
			false;
		applyFormatting(property, !currentValue);
	};

	const applyBackgroundColor = (color) => {
		setCurrentColor(color.hex);
		applyFormatting("backgroundColor", color.hex);
	};

	const applyTextColor = (color) => {
		setCurrentTextColor(color.hex);
		applyFormatting("color", color.hex);
	};

	const applyAlignment = (align) => {
		applyFormatting("alignment", align);
	};

	const applyFontSize = () => {
		const fontSize = prompt("Enter font size (e.g., 14px):", "14px");
		if (fontSize) applyFormatting("fontSize", fontSize);
	};

	// Fetch spreadsheet data

	const handleVoiceCommandMemoized = useCallback(
		(command) => {
			const lower = command.toLowerCase();

			// Match "write {value} in {cell}" or "enter {value} in {cell}"
			const writeMatch = lower.match(
				/(?:write|enter) (.+?) (?:in|to) ([a-z]+\d+)/i
			);
			if (writeMatch) {
				const value = writeMatch[1];
				const cellRef = writeMatch[2].toUpperCase();
				const cell = parseCellReference(cellRef);
				if (cell && hotRef.current) {
					const instance = hotRef.current.getInstance();
					instance.setDataAtCell(cell.row, cell.col, value);
					setSelectedCell(cell);
					return true;
				}
			}

			// Match "format {cell} as {format}"
			const formatMatch = lower.match(/format ([a-z]+\d+) as (.+)/i);
			if (formatMatch && hotRef.current) {
				const cellRef = formatMatch[1].toUpperCase();
				const format = formatMatch[2];
				const cell = parseCellReference(cellRef);

				if (cell) {
					const instance = hotRef.current.getInstance();

					// Handle different format types
					if (format.includes("bold")) {
						instance.setCellMeta(cell.row, cell.col, "bold", true);
					} else if (format.includes("italic")) {
						instance.setCellMeta(cell.row, cell.col, "italic", true);
					} else if (format.includes("underline")) {
						instance.setCellMeta(cell.row, cell.col, "underline", true);
					} else if (format.includes("font size")) {
						const size = format.match(/\d+/)?.[0] || "14";
						instance.setCellMeta(cell.row, cell.col, "fontSize", `${size}px`);
					}

					instance.render();
					setSelectedCell(cell);
					return true;
				}
			}

			// Add more command patterns here as needed

			return false; // Return false if no command was recognized
		},
		[hotRef]
	);

	const handleSaveMemoized = useCallback(
		async (data, { isAutoSave = false } = {}) => {
			// ... existing handleSave implementation
			sync.startSync();
			const toastId = isAutoSave ? null : toast.loading("Saving...");
			// console.log("Title of the spreadsheet: ", title);
			try {
				const token = await getToken();
				if (!token) {
					throw new Error("Not authenticated");
				}
				const instance = hotRef.current.getInstance();
				if (!instance) {
					throw new Error("Spreadsheet instance not available");
				}
				const meta = getAllCellMeta(instance);
				const endpoint = spreadsheetId
					? `/api/spreadsheets/${spreadsheetId}`
					: `/api/spreadsheets`;
				const method = spreadsheetId ? "PUT" : "POST";

				const response = await fetch(endpoint, {
					method,
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						name: title || "Untitled Spreadsheet",
						data,
						meta,
						lastModified: new Date().toISOString(),
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.error ||
							(response.status === 409
								? "Conflict detected - please refresh"
								: `Failed to save spreadsheet: ${response.status} ${response.statusText}`)
					);
				}

				const result = await response.json();
				if (!spreadsheetId && result.id) {
					setSpreadsheetId(result.id);
					router.push(`/spreadsheets/${result.id}`, {
						scroll: false,
					});
				}
				setSpreadsheet((prev) => ({
					...prev,
					id: result.id || spreadsheetId,
					name: title || "Untitled Spreadsheet",
					data: data || [],
					meta: meta || {},
				}));
				sync.completeSync();
				if (!isAutoSave) {
					toast.success("Saved successfully!", { id: toastId });
				}
				if (!spreadsheetId && result.id) {
					setSpreadsheetId(result.id);
					router.push(`/spreadsheets/${result.id}`);
				}
				return true;
			} catch (error) {
				sync.setError(error);
				if (!isAutoSave) {
					toast.error(error.message, { id: toastId });
				}
				return false;
			}
		},
		[spreadsheetId, title, getToken, sync, router]
	);

	// Save spreadsheet on Ctrl+S
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
				e.preventDefault();
				if (hotRef.current) {
					const instance = hotRef.current.getInstance();
					const data = instance.getData();
					handleSaveMemoized(data);
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleSaveMemoized, hotRef, user]);

	function parseCellReference(ref) {
		// Matches e.g. "A3", "B12", "AA10"
		const match = ref.match(/^([A-Za-z]+)(\d+)$/);
		if (!match) return null;
		const colLetters = match[1].toUpperCase();
		const row = parseInt(match[2], 10) - 1; // Spreadsheet rows are 1-based, JS is 0-based

		let col = 0;
		for (let i = 0; i < colLetters.length; i++) {
			col *= 26;
			col += colLetters.charCodeAt(i) - 65 + 1;
		}
		col -= 1;
		return { row, col };
	}

	// Loading state
	if (userLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}
	// console.log("spreadsheet", spreadsheet);
	// console.log("spreadsheet?.data", spreadsheet?.data);

	return (
		<div className="flex flex-col h-screen">
			<Navbar
				title={title}
				onTitleChange={(newTitle) => {
					setTitle(newTitle);
				}}
				isSpreadsheetPage={true}
			/>

			{/* Toolbar */}
			<div className="bg-gray-100 p-2 border-b">
				<div className="flex items-center space-x-2">
					{/* Text formatting */}
					<button
						onClick={() => toggleFormatting("bold")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Bold">
						<Bold size={18} />
					</button>
					<button
						onClick={() => toggleFormatting("italic")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Italic">
						<Italic size={18} />
					</button>
					<button
						onClick={() => toggleFormatting("underline")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Underline">
						<Underline size={18} />
					</button>

					{/* Font size */}
					<button
						onClick={applyFontSize}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Font Size">
						<TextCursorInput size={18} />
					</button>

					{/* Text color */}
					<div className="relative">
						<button
							onClick={() => setShowTextColorPicker(!showTextColorPicker)}
							className={`p-2 rounded ${
								selectedCell
									? "hover:bg-gray-200"
									: "opacity-50 cursor-not-allowed"
							}`}
							disabled={!selectedCell}
							title="Text Color">
							<Palette size={18} />
						</button>
						{showTextColorPicker && selectedCell && (
							<div className="absolute z-10 mt-2">
								<SketchPicker
									color={currentTextColor}
									onChangeComplete={applyTextColor}
									onChange={(color) => setCurrentTextColor(color.hex)}
								/>
							</div>
						)}
					</div>

					{/* Cell color */}
					<div className="relative">
						<button
							onClick={() => setShowColorPicker(!showColorPicker)}
							className={`p-2 rounded ${
								selectedCell
									? "hover:bg-gray-200"
									: "opacity-50 cursor-not-allowed"
							}`}
							disabled={!selectedCell}
							title="Cell Color">
							<Paintbrush size={18} />
						</button>
						{showColorPicker && selectedCell && (
							<div className="absolute z-10 mt-2">
								<SketchPicker
									color={currentColor}
									onChangeComplete={applyBackgroundColor}
									onChange={(color) => setCurrentColor(color.hex)}
								/>
							</div>
						)}
					</div>

					{/* Alignment */}
					<div className="border-l border-gray-300 h-6 mx-2"></div>
					<button
						onClick={() => applyAlignment("left")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Align Left">
						<AlignLeft size={18} />
					</button>
					<button
						onClick={() => applyAlignment("center")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Align Center">
						<AlignCenter size={18} />
					</button>
					<button
						onClick={() => applyAlignment("right")}
						className={`p-2 rounded ${
							selectedCell
								? "hover:bg-gray-200"
								: "opacity-50 cursor-not-allowed"
						}`}
						disabled={!selectedCell}
						title="Align Right">
						<AlignRight size={18} />
					</button>
				</div>
				<div className="flex-row flex flex-shrink-0 justify-between w-full mt-2 min-w-0">
					<div className="flex-1 min-w-0">
						<AIAssistant sheetData={spreadsheet?.data || []} />
					</div>
					<div className="flex-shrink-0 ml-4">
						{/* Voice Command Bar */}
						<VoiceCommandBar
							onCommand={handleVoiceCommandMemoized}
							loading={userLoading}
						/>
					</div>
				</div>
			</div>
			{/* Spreadsheet */}
			<div className="flex-1 overflow-hidden">
				<HandsontableComponent
					ref={hotRef}
					initialData={spreadsheet?.data || []}
					onSave={handleSaveMemoized}
					onCellSelect={handleCellSelectMemoized}
					key={spreadsheetId}
					initialMeta={
						spreadsheet?.meta
							? Object.entries(spreadsheet.meta).flatMap(([row, cols]) =>
									Object.entries(cols).map(([col, meta]) => ({
										row: Number(row),
										col: Number(col),
										...meta,
									}))
							  )
							: []
					}
				/>
			</div>
		</div>
	);
});

SpreadsheetPage.displayName = "SpreadsheetPage";

export default SpreadsheetPage;
