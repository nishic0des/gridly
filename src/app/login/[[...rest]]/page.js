"use client";
import { SignIn as _SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<_SignIn afterSignInUrl="/spreadsheets" redirectUrl="/spreadsheets" />
		</div>
	);
}
