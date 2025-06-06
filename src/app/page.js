"use client";

import Image from "next/image";
import SpreadsheetPage from "./components/SpreadsheetPage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Suspense } from "react";

export default function Home() {
	const [title, setTitle] = useState("Untitled Spreadsheet");

	return (
		<div>
			<Navbar title={title} setTitle={setTitle} />
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-screen">
						Loading...
					</div>
				}>
				<SpreadsheetPage title={title} setTitle={setTitle} />
			</Suspense>
		</div>
	);
}
