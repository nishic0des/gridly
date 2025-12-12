// src/app/spreadsheets/[id]/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";
import SpreadsheetPage from "@/app/components/SpreadsheetPage";
export default function Spreadsheet() {
	const router = useRouter();
	const params = useParams();
	const [spreadsheet, setSpreadsheet] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();

	const getSpreadsheet = async (id) => {
		setLoading(true);
		try {
			const token = await getToken();
			const response = await fetch(`/api/spreadsheets/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to load spreadsheet");
			}

			const data = await response.json();
			setSpreadsheet(data);
			setError(null);
		} catch (err) {
			setError(err.message);
			router.push("/spreadsheets"); // Redirect to list if error
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (params.id && params.id !== "new") {
			getSpreadsheet(params.id);
		}
	}, [params.id]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return spreadsheet ? (
		<SpreadsheetPage id={spreadsheet.id} initialData={spreadsheet} />
	) : null;
}
