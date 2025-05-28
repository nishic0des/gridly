"use client";
import { useState } from "react";
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
			<SpreadsheetPage
				title={title}
				setTitle={setTitle}
				refetchKey={refetchKey}
			/>
		</div>
	);
}
