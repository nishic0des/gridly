"use client";
import { useState } from "react";
import SpreadsheetPage from "../components/SpreadsheetPage";
import Navbar from "../components/Navbar";

export default function Spreadsheets() {
	const [title, setTitle] = useState("Untitled Spreadsheet");
	return (
		<div>
			<Navbar title={title} setTitle={setTitle} />
			<SpreadsheetPage title={title} setTitle={setTitle} />
		</div>
	);
}
