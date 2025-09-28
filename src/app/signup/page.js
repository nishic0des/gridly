"use client";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const router = useRouter();
	return (
		<div className="flex justify-center items-center min-h-screen">
			<SignUp afterSignInUrl="/spreadsheets" afterSignUpUrl="/spreadsheets" />
		</div>
	);
}
