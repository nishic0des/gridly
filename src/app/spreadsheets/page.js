"use client";
import { useState, Suspense } from "react";
import Navbar from "../components/Navbar";
import SpreadsheetPage from "../components/SpreadsheetPage.js";

export default function Spreadsheets() {
	const [title, setTitle] = useState("Untitled Spreadsheet");
	const [refetchKey, setRefetchKey] = useState(0);

	const handleTitleSaved = () => setRefetchKey((k) => k + 1);

	return (
		<div>
			<Navbar
				title={title}
				setTitle={setTitle}
				onTitleSaved={handleTitleSaved}
			/>
			<Suspense fallback={<div>Loading spreadsheet...</div>}>
				<SpreadsheetPage
					title={title}
					setTitle={setTitle}
					refetchKey={refetchKey}
				/>
			</Suspense>
		</div>
	);
}
