import { NextResponse } from "next/server";

export async function POST(req) {
	const { query, sheetData } = await req.json();

	const prompt = `
    You are an AI assistant for spreadsheets. Given this data:
    ${JSON.stringify(sheetData)}
    Answer this question: "${query}"
    Be concise and clear.
  `;

	const response = await fetch("https://api.together.xyz/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
		},
		body: JSON.stringify({
			model: "meta-llama/Llama-3-70b-chat-hf",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 256,
		}),
	});

	const data = await response.json();
	const answer =
		data.choices?.[0]?.message?.content ||
		"Sorry, I couldn't process your request.";
	return NextResponse.json({ answer });
}
