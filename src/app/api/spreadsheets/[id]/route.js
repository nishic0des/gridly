// app/api/spreadsheets/route.js
import prisma from "../../../../../lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	try {
		const { id } = await Promise.resolve(params);

		const { userId: clerkUserId } = getAuth(request);

		if (!clerkUserId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!id) {
			return NextResponse.json(
				{ error: "Spreadsheet ID is required" },
				{ status: 400 }
			);
		}

		// Return a single spreadsheet by id
		const spreadsheet = await prisma.spreadsheet.findUnique({
			where: { id },
			include: { user: true },
		});
		if (!spreadsheet) {
			return NextResponse.json(
				{ error: "Spreadsheet not found" },
				{ status: 404 }
			);
		}
		if (spreadsheet.user.clerkUserId !== clerkUserId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { user, ...spreadsheetData } = spreadsheet;
		return NextResponse.json(spreadsheetData, { status: 200 });
	} catch (error) {
		// console.error("[API /api/spreadsheets]", error);
		return NextResponse.json(
			{ error: "Failed to fetch spreadsheets" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	const { userId: clerkUserId } = getAuth(request);
	const { name, data, meta } = await request.json();

	if (!clerkUserId) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	try {
		const user = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (!user) {
			return new Response(JSON.stringify({ error: "User not found" }), {
				status: 404,
			});
		}

		const newSpreadsheet = await prisma.spreadsheet.create({
			data: {
				name,
				data,
				meta,
				user: {
					connect: { id: user.id },
				},
				userId: user.id,
			},
		});

		return new Response(JSON.stringify(newSpreadsheet), {
			status: 201,
		});
	} catch (error) {
		// console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to create spreadsheet" }),
			{
				status: 500,
			}
		);
	}
}

// In [id]/route.js
export async function PUT(request, { params }) {
	try {
		const { id } = params;

		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const updateData = await request.json();

		// Find the user
		const user = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Prepare update data
		const dataToUpdate = {
			...(updateData.name !== undefined && { name: updateData.name }),
			...(updateData.data !== undefined && { data: updateData.data }),
			...(updateData.meta !== undefined && { meta: updateData.meta }),
			updatedAt: new Date(),
		};
		// console.log("Data to update: ", updateData);

		// Update the spreadsheet
		const updatedSpreadsheet = await prisma.spreadsheet.update({
			where: {
				id,
				userId: user.id,
			},
			data: dataToUpdate,
		});
		// console.log("Updated Spreadsheet: ", updatedSpreadsheet);

		return NextResponse.json(updatedSpreadsheet, { status: 200 });
	} catch (error) {
		// console.error("[API /api/spreadsheets/[id]]", error);
		return NextResponse.json(
			{ error: "Failed to update spreadsheet" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { userId: clerkUserId } = getAuth(request);
		const { id } = params;

		if (!clerkUserId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// First get the spreadsheet to check ownership
		const existing = await prisma.spreadsheet.findUnique({
			where: { id },
			include: { user: true },
		});

		if (!existing) {
			return NextResponse.json(
				{ error: "Spreadsheet not found" },
				{ status: 404 }
			);
		}

		if (existing.user.clerkUserId !== clerkUserId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await prisma.spreadsheet.delete({
			where: { id },
		});

		return new Response(null, { status: 204 });
	} catch (error) {
		// console.error(`[API /api/spreadsheets/[id]]`, error);
		return NextResponse.json(
			{ error: "Failed to delete spreadsheet" },
			{ status: 500 }
		);
	}
}
