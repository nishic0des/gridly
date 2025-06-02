// components/Navbar.js
"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { useEffect } from "react";

async function saveTitleToBackend(newTitle) {
	try {
		const spreadsheetId = new URLSearchParams(window.location.search).get("id");
		if (!spreadsheetId) return;
		await fetch(`/api/spreadsheets?id=${spreadsheetId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newTitle }),
		});
	} catch (err) {
		console.error("Failed to save title:", err);
	}
}

export default function Navbar({ title, setTitle, onTitleSaved }) {
	const { isSignedIn, user } = useUser();
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef(null);

	const handleEdit = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current.setSelectionRange(0, inputRef.current.value.length);
		}, 0);
	};

	const handleBlur = () => {
		setIsEditing(false);

		if (!title.trim()) setTitle("Untitled SpreadSheet");
		else {
			saveTitleToBackend(title);
			if (onTitleSaved) onTitleSaved(title);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setIsEditing(false);
			if (!title.trim()) setTitle("Untitled SpreadSheet");
			else {
				saveTitleToBackend(title);
				if (onTitleSaved) onTitleSaved(title);
			}
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center p-4 border-b">
				<div className="flex items-center space-x-4">
					<Link href="/" className="font-bold">
						gridly
					</Link>

					{isSignedIn && (
						<div className="ml-3 border w-fit border-gray-300 p-0.5 pr-1 pl-1 rounded-md">
							{isEditing ? (
								<input
									type="text"
									ref={inputRef}
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									onBlur={handleBlur}
									onKeyDown={handleKeyDown}
									className="outline-none"
								/>
							) : (
								<div onClick={handleEdit}>{title}</div>
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

			{isSignedIn && (
				<div>
					<ul className="flex flex-row ml-3 mr-3 mt-2 mb-2">
						<li className="mr-5 cursor-pointer hover:text-blue-500">File</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">Edit</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">View</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">Insert</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">Format</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">Data</li>
						<li className="mr-5 cursor-pointer hover:text-blue-500">Tools</li>
					</ul>
				</div>
			)}
		</div>
	);
}
