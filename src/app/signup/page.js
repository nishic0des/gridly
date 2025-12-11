"use client";
import { SignUp as _SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<_SignUp afterSignInUrl="/spreadsheets" afterSignUpUrl="/spreadsheets" />
		</div>
	);
}
