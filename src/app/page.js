"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
	const { isLoaded, isSignedIn } = useUser();
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	const checkeredBg = {
		backgroundImage: `
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
  `,
		backgroundSize: "40px 40px",
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		pointerEvents: "none", // This ensures clicks pass through the overlay
	};
	const handleGetStarted = () => {
		if (isLoaded) {
			if (isSignedIn) {
				router.push("/spreadsheets");
			} else {
				router.push("/login");
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen w-full">
			{/* Background Image */}
			<div className="fixed inset-0 -z-30">
				<Image
					src="/bg.webp"
					alt="Background"
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Grid Overlay */}
			<div style={checkeredBg} className="fixed inset-0 -z-20"></div>

			{/* Dark Overlay */}
			<div className="fixed inset-0 -z-10 bg-black/50"></div>

			{/* Main Content */}
			<div className="relative z-10 min-h-screen p-8 pb-20 sm:p-20">
				<div className="flex flex-row items-center min-h-screen">
					<main className="flex flex-col items-center justify-center sm:items-start w-full">
						<div className="w-full flex flex-col items-center">
							<h1 className="text-8xl font-bold text-white mt-[-1rem]">
								Gridly
							</h1>
							<p className="text-white mt-4">Spreadsheets Reimagined.</p>
							<button
								className="mt-4 px-6 py-2 rounded-md bg-white text-black"
								onClick={handleGetStarted}>
								Get Started
							</button>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
