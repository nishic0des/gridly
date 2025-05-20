import { Signup } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<Signup />
		</div>
	);
}
