import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
	try {
		const { userId: clerkUserId } = getAuth(request);

		if (!clerkUserId) {
			console.log("No clerkUserId found in auth()");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.log("Looking for user with clerkUserId:", clerkUserId);
		const user = await prisma.user.findUnique({
			where: { clerkUserId },
			select: { id: true },
		});
		if (!user) {
			console.log("No user found with clerkUserId:", clerkUserId);
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
		console.log(
			`Found ${spreadsheets.length} spreadsheets for user ${user.id}`
		);
		return NextResponse.json(spreadsheets);
	} catch (error) {
		console.error("Error in GET /api/spreadsheets:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { name, data = [], meta = {} } = await request.json();
		const user = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const newSpreadsheet = await prisma.spreadsheet.create({
			data: {
				name: name || "Untitled Spreadsheet",
				data,
				meta,
				User: {
					connect: { id: user.id },
				},
			},
		});

		return NextResponse.json(newSpreadsheet, { status: 201 });
	} catch (error) {
		console.error("[API] POST /api/spreadsheets", error);
		return NextResponse.json(
			{ error: "Failed to create spreadsheet" },
			{ status: 500 }
		);
	}
}
