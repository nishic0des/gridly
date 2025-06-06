// app/api/spreadsheets/route.js
import prisma from "../../../../lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { userId: clerkUserId } = getAuth(request);

		if (!clerkUserId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (id) {
			// Return a single spreadsheet by id
			const spreadsheet = await prisma.spreadsheet.findUnique({
				where: { id },
			});
			if (!spreadsheet) {
				return NextResponse.json(
					{ error: "Spreadsheet not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json(spreadsheet, { status: 200 });
		} else {
			const user = await prisma.user.findUnique({
				where: { clerkUserId },
				include: { spreadsheets: true },
			});

			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

			return NextResponse.json(user.spreadsheets, { status: 200 });
		}
	} catch (error) {
		console.error("[API /api/spreadsheets]", error);
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
				userId: user.id,
			},
		});

		return new Response(JSON.stringify(newSpreadsheet), {
			status: 201,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to create spreadsheet" }),
			{
				status: 500,
			}
		);
	}
}

export async function PUT(request) {
	const { userId: clerkUserId } = getAuth(request);
	const body = await request.json();
	console.log("Updating data: ", body);
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!clerkUserId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (!id) {
		return NextResponse.json(
			{ error: "Spreadsheet ID required" },
			{ status: 400 }
		);
	}
	const updateData = {};
	if (body.name !== undefined) updateData.name = body.name;
	if (body.data !== undefined) updateData.data = body.data;
	if (body.meta !== undefined) updateData.meta = body.meta;
	console.log("Update data: ", updateData);
	if (Object.keys(updateData).length === 0) {
		return NextResponse.json({ error: "No fields to update" }, { status: 400 });
	}
	const spreadsheet = await prisma.spreadsheet.update({
		where: { id },
		data: updateData,
	});
	return NextResponse.json(spreadsheet, { status: 200 });
}
