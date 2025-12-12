// src/app/api/db-test/route.js
import prisma from "../../../../lib/prisma";

export async function GET() {
	try {
		// Try to connect to the database
		await prisma.$connect();

		// Try a simple query
		const usersCount = await prisma.user.count();

		return new Response(
			JSON.stringify({
				status: "success",
				message: "Database connection successful",
				usersCount,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Database connection error:", error);
		return new Response(
			JSON.stringify({
				status: "error",
				error: "Database connection failed",
				details: error.message,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
