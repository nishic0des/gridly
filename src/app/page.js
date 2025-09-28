// src/app/page.js
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const { isLoaded, isSignedIn } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded) {
			if (isSignedIn) {
				router.push("/spreadsheets");
			} else {
				router.push("/login");
			}
		}
	}, [isLoaded, isSignedIn, router]);

	// Show loading state while redirecting
	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>
	);
}
