import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request) {
	const { userId: clerkUserId } = getAuth(request);
	if (!clerkUserId) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const user = await prisma.user.findUnique({
		where: { clerkUserId },
		select: { id: true },
	});

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const spreadsheets = await prisma.spreadsheet.findMany({
		where: { userId: user.id },
		select: {
			id: true,
			name: true,
			updatedAt: true,
		},
		orderBy: { updatedAt: "desc" },
	});

	return new Response(JSON.stringify(spreadsheets));
}

export async function POST(request) {
	try {
		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse({ error: "Unauthorized" }, { status: 401 });
		}
		const { name, data = [], meta = {} } = await request.json();
		const user = await prisma.user.findUnique({ where: { clerkUserId } });

		if (!user) {
			return NextResponse({ error: "User not found" }, { status: 404 });
		}

		const newSpreadsheet = await prisma.spreadsheet.create({
			data: {
				name: name || "Untitled Spreadsheet",
				data,
				meta,
				user: {
					connect: { id: user.id },
				},
			},
		});

		return NextResponse.json(newSpreadsheet, { status: 201 });
	} catch (error) {
		// console.error("[API] /api/spreadsheets", error);
		return NextResponse.json(
			{ error: "Failed to create spreadsheet" },
			{ status: 500 }
		);
	}
}
