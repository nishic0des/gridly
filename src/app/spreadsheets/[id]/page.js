// src/app/spreadsheets/[id]/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import SpreadsheetPage from "@/app/components/SpreadsheetPage";
import { useAuth } from "@clerk/clerk-react";

export default function Spreadsheet() {
	const router = useRouter();
	const params = useParams();
	const [spreadsheet, setSpreadsheet] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();

	const loadSpreadsheet = useCallback(async () => {
		try {
			const { id } = params;
			if (!id) return;

			// console.log("Loading spreadsheet with ID:", id);
			const token = await getToken();

			if (id === "new") {
				// console.log("Creating new spreadsheet...");
				const response = await fetch("/api/spreadsheets", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ title: "Untitled Spreadsheet" }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to create spreadsheet");
				}

				const data = await response.json();
				router.replace(`/spreadsheets/${data.id}`);
				return;
			}

			// console.log("Fetching existing spreadsheet...");
			const response = await fetch(`/api/spreadsheets/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to load spreadsheet");
			}

			const data = await response.json();
			setSpreadsheet(data);
			setError(null);
		} catch (err) {
			// console.error("Error in loadSpreadsheet:", err);
			setError(err.message || "An error occurred");
			if (params.id !== "new") {
				router.push("/spreadsheets");
			}
		} finally {
			setLoading(false);
		}
	}, [params, router, getToken]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			loadSpreadsheet();
		}

		return () => {
			isMounted = false;
		};
	}, [loadSpreadsheet]);

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

	if (!spreadsheet && params.id !== "new") {
		return (
			<div className="flex justify-center items-center h-screen">
				<p>Spreadsheet not found</p>
			</div>
		);
	}

	return spreadsheet ? (
		<SpreadsheetPage id={spreadsheet.id} initialData={spreadsheet} />
	) : null;
}
