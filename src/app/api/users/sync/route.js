// src/app/api/users/sync/route.js
import prisma from "../../../../../lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export async function POST(request) {
	const { userId: clerkUserId, sessionClaims } = getAuth(request);

	if (!clerkUserId) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		// First try to get email from session claims
		let email = sessionClaims?.email;

		// If email not in session claims, fetch user data from Clerk
		if (!email) {
			try {
				// Get the session token from the Authorization header
				const authHeader = headers().get("authorization");
				const token = authHeader?.split(" ")[1];

				if (!token) {
					throw new Error("No authorization token found");
				}

				// Fetch user data from Clerk's API
				const clerkResponse = await fetch(
					`https://api.clerk.com/v1/users/${clerkUserId}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (!clerkResponse.ok) {
					const error = await clerkResponse.text();
					throw new Error(`Failed to fetch user from Clerk: ${error}`);
				}

				const userData = await clerkResponse.json();
				email = userData.email_addresses?.[0]?.email_address;

				if (!email) {
					throw new Error("Email not found in Clerk user data");
				}
			} catch (error) {
				console.error("Error fetching user from Clerk:", error);
				return new Response(
					JSON.stringify({
						error: "Failed to fetch user data",
						details: error.message,
					}),
					{
						status: 400,
						headers: { "Content-Type": "application/json" },
					}
				);
			}
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (existingUser) {
			return new Response(JSON.stringify(existingUser), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Create new user if doesn't exist
		const newUser = await prisma.user.create({
			data: {
				id: clerkUserId,
				clerkUserId,
				email,
				name: sessionClaims?.name || email.split("@")[0],
			},
		});

		return new Response(JSON.stringify(newUser), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in user sync:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to sync user",
				details: error.message,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
