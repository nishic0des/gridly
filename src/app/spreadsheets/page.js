"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import SpreadsheetPage from "../components/SpreadsheetPage";
import Navbar from "../components/Navbar";

export default function Spreadsheets() {
	const { isLoaded: isUserLoaded, isSignedIn } = useUser();
	const router = useRouter();
	const [spreadsheets, setSpreadsheets] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { getToken } = useAuth();

	useEffect(() => {
		if (!isUserLoaded) return;

		if (!isSignedIn) {
			router.push("/login");
			return;
		}

		const fetchSpreadsheets = async () => {
			try {
				setIsLoading(true);
				const token = await getToken();
				const response = await fetch("/api/spreadsheets", {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				// console.log("Response: ", response);

				if (!response.ok) {
					throw new Error("Failed to fetch spreadsheets");
				}
				const data = await response.json();
				setSpreadsheets(data);
			} catch (error) {
				// console.error("Error fetching spreadsheets:", error);
				// Optionally show error message to user
			} finally {
				setIsLoading(false);
			}
		};

		fetchSpreadsheets();
	}, [isUserLoaded, isSignedIn, router, getToken]);

	if (!isUserLoaded || isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar isSpreadsheetPage={false} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900">My Spreadsheets</h1>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{/* New Spreadsheet Card */}
					<Link
						href="/spreadsheets/new"
						className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 h-48">
						<Plus className="h-12 w-12 text-gray-400 mb-2" />
						<span className="text-gray-700 font-medium">New Spreadsheet</span>
					</Link>

					{/* Existing Spreadsheet Cards */}
					{spreadsheets.map((spreadsheet) => (
						<Link
							key={spreadsheet.id}
							href={`/spreadsheets/${spreadsheet.id}`}
							className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-48 flex flex-col">
							<div className="p-4 flex-1">
								<h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
									{spreadsheet.name || "Untitled Spreadsheet"}
								</h3>
								<p className="text-sm text-gray-500">
									Last updated:{" "}
									{spreadsheet.updatedAt
										? new Date(spreadsheet.updatedAt).toLocaleDateString()
										: "N/A"}
								</p>
							</div>
							<div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
								<span className="text-sm text-gray-500">
									{spreadsheet.updatedAt
										? new Date(spreadsheet.updatedAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
										  })
										: ""}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
