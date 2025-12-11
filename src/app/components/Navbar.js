// components/Navbar.js
"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { useEffect } from "react";
async function saveTitleToBackend(newTitle) {
	try {
		const id = new URL(window.location.href).pathname.split("/").pop();
		if (!id) return;
		const response = await fetch(`/api/spreadsheets/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newTitle }),
		});
		console.log("Saved title", response);

		if (!response.ok) {
			throw new Error("Failed to save title");
		}
	} catch (err) {
		console.error("Failed to save title:", err);
	}
}

export default function Navbar({
	title: propTitle,
	onTitleChange,
	isSpreadsheetPage,
}) {
	const { isSignedIn, user } = useUser();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitleState] = useState(propTitle || "Untitled Spreadsheet");
	const [isSaving, setIsSaving] = useState(false);

	const handleTitleChange = async (e) => {
		const newTitle = e.target.value;
		onTitleChange(newTitle); // Update local state

		try {
			console.log(isSaving);

			setIsSaving(true);
			await saveTitleToBackend(newTitle);
		} catch (error) {
			console.log(error);

			// toast.error("Failed to save title");
		} finally {
			setIsSaving(false);
		}
	};

	const inputRef = useRef(null);
	useEffect(() => {
		console.log(title);

		setTitleState(propTitle || "Untitled Spreadsheet");
	}, [propTitle]);

	const handleEdit = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
		}, 0);
	};

	const handleBlur = () => {
		setIsEditing(false);

		if (!title.trim()) setTitleState("Untitled SpreadSheet");
		else {
			saveTitleToBackend(title);
			if (onTitleChange) onTitleChange(title);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setIsEditing(false);
			if (!title.trim()) setTitleState("Untitled SpreadSheet");
			else {
				saveTitleToBackend(title);
				if (onTitleChange) onTitleChange(title);
			}
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center p-4 border-b">
				<div className="flex items-center space-x-4">
					<Link href="/spreadsheets" className="font-bold">
						gridly
					</Link>
					{isSpreadsheetPage && isSignedIn && (
						<div className="ml-3 border w-fill h-8 border-gray-300 p-0.5 pr-1 pl-1 text-md rounded-md">
							{isEditing ? (
								<input
									type="text"
									ref={inputRef}
									value={title}
									onChange={handleTitleChange}
									onBlur={handleBlur}
									onKeyDown={handleKeyDown}
									className="outline-none w-full"
								/>
							) : (
								<div onClick={handleEdit} className="truncate">
									{title || "Untitled Spreadsheet"}
								</div>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center space-x-4">
					{isSignedIn ? (
						<>
							<span className="text-sm">
								{user?.emailAddresses[0]?.emailAddress}
							</span>
							<UserButton afterSignOutUrl="/" />
						</>
					) : (
						<>
							<span className="text-sm">To save your progress,</span>
							<Link href="/login" className="text-sm hover:text-blue-600">
								Sign In
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
