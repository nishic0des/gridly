"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
	const router = useRouter();
	return (
		<div className="flex justify-center items-center min-h-screen">
			<SignIn afterSignInUrl="/spreadsheets" redirectUrl="/spreadsheets" />
		</div>
	);
}
