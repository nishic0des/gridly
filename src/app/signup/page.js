"use client";
import { SignUp as ClerkSignUp, useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
	const { signUp, isLoaded } = useSignUp();
	const { getToken } = useAuth();
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSignUpSuccess = async (result, redirectUrl) => {
		if (result.status === "complete") {
			try {
				setIsProcessing(true);
				const token = await getToken();

				// Call the sync endpoint
				const response = await fetch("/api/users/sync", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					const error = await response.text();
					console.error("Sync failed:", error);
					// Handle error (show toast, etc.)
					return;
				}

				// Redirect after successful sync
				router.push("/spreadsheets");
			} catch (error) {
				console.error("Error during signup:", error);
				// Handle error
			} finally {
				setIsProcessing(false);
			}
		}
	};

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex justify-center items-center min-h-screen">
			<ClerkSignUp
				afterSignUpUrl="/spreadsheets"
				afterSignInUrl="/spreadsheets"
				onSuccess={handleSignUpSuccess}
				redirectUrl="/spreadsheets"
			/>
			{isProcessing && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-lg">
						<p>Setting up your account...</p>
					</div>
				</div>
			)}
		</div>
	);
}
