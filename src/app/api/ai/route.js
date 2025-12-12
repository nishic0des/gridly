import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
	const { query, sheetData } = await req.json();

	try {
		const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

		const prompt = `
	    You are an AI assistant for spreadsheets. Given this data:
	    ${JSON.stringify(sheetData)}
	    Answer this question: "${query}"
	    Be concise and clear and make sure you answer in minimum one line and max 4 lines.
	  `;

		const res = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
			config: {
				thinkingConfig: {
					thinkingBudget: 0,
				},
			},
		});

		// const response = await fetch("https://api.together.xyz/v1/chat/completions", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
		// 	},
		// 	body: JSON.stringify({
		// 		model: "meta-llama/Llama-3-70b-chat-hf",
		// 		messages: [{ role: "user", content: prompt }],
		// 		max_tokens: 256,
		// 	}),
		// });

		// const data = await response.json();
		// const answer =
		// 	data.choices?.[0]?.message?.content ||
		// 	"Sorry, I couldn't process your request.";
		console.log("AI Response:", res.text);
		const ans = res.text;

		return NextResponse.json({ ans }, { status: 200 });
	} catch (error) {
		console.error("Error in AI route:", error);
		return NextResponse.json(
			{ error: "AI isn't available at the moment" },
			{ status: 500 }
		);
	}
}
