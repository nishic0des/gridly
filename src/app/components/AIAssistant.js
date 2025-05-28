import { useState } from "react";

export default function AIAssistant({ sheetData }) {
	const [query, setQuery] = useState("");
	const [answer, setAnswer] = useState("");
	const [loading, setLoading] = useState(false);

	const askAI = async () => {
		if (!query.trim()) return;
		console.log("Sheet data: ", sheetData);

		if (!sheetData || sheetData.length === 0) {
			setAnswer("No data");
			return;
		}
		setLoading(true);
		setAnswer("");
		const res = await fetch("/api/ai", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query, sheetData }),
		});
		const data = await res.json();
		setAnswer(data.answer);
		setLoading(false);
	};

	return (
		<div>
			<input
				className="border p-2 w-2/3"
				placeholder="Ask Gridly Copilot..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && askAI()}
			/>
			<button
				className="ml-2 px-4 py-2 bg-slate-900 text-white rounded"
				onClick={askAI}
				disabled={loading}>
				Ask
			</button>
			{loading && <div className="mt-2">Thinking...</div>}
			{answer && <div className="mt-2 bg-gray-100 p-2 rounded">{answer}</div>}
		</div>
	);
}
