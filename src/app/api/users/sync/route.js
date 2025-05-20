import prisma from "../../../../../lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
	const { userId: clerkUserId, sessionClaims } = getAuth(request);
	if (!clerkUserId) {
		return new Response("Unauthorized", { status: 401 });
	}
	// Safely extract email from Clerk claims and log claims for debugging
	console.log("sessionClaims:", sessionClaims);
	let email = null;
	if (
		sessionClaims?.email_addresses &&
		Array.isArray(sessionClaims.email_addresses) &&
		sessionClaims.email_addresses.length > 0 &&
		sessionClaims.email_addresses[0].email_address
	) {
		email = sessionClaims.email_addresses[0].email_address;
	} else if (sessionClaims?.email) {
		email = sessionClaims.email;
	} else if (sessionClaims?.primary_email_address) {
		email = sessionClaims.primary_email_address;
	} else if (sessionClaims?.emailAddress) {
		email = sessionClaims.emailAddress;
	} else if (sessionClaims?.userPrimaryEmailAddress) {
		email = sessionClaims.userPrimaryEmailAddress;
	} else if (sessionClaims?.userEmail) {
		email = sessionClaims.userEmail;
	}
	if (!email) {
		return new Response("Email not found in session claims", { status: 400 });
	}
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				clerkUserId: clerkUserId,
			},
		});
		if (existingUser) {
			return new Response(JSON.stringify(existingUser), { status: 200 });
		}
		const newUser = await prisma.user.create({
			data: {
				clerkUserId: clerkUserId,
				email: email,
				name: `${sessionClaims.fullname}`.trim(),
			},
		});
		return new Response(JSON.stringify(newUser), { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return new Response("Failed to sync user", { status: 500 });
	}
}
