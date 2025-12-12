"use client";
import { SignIn as _SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function SignInPage() {
	const { isLoaded, signIn } = useSignIn();
	const { getToken } = useAuth();
	const router = useRouter();
	const [isSyncing, setIsSyncing] = useState(false);

	const handleLoginSuccess = async (result) => {
		console.log("Syncing user to backend");
		console.log(result);

		if (result.status === "complete") {
			setIsSyncing(true);
			try {
				const token = await getToken();
				const response = await fetch("/api/users/sync", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				console.log("Response after syncing: ", response);

				if (!response.ok) {
					throw new Error("Failed to sync user data");
				}

				const userData = await response.json();
				console.log("User synced:", userData);
				router.push("/spreadsheets");
			} catch (error) {
				console.error("Error during signup sync:", error);
				// Handle error (maybe show error message to user)
			} finally {
				setIsSyncing(false);
			}
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen">
			<_SignIn
				afterSignInUrl="/api/users/sync"
				onSuccess={handleLoginSuccess}
				fallbackRedirectUrl="/spreadsheets"
			/>
		</div>
	);
}
