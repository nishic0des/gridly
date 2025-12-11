import prisma from "../../../../lib/prisma";

export async function GET() {
	try {
		const users = await prisma.user.findMany();
		return new Response(JSON.stringify(users), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
			status: 500,
		});
	}
}
