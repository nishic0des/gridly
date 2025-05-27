import React from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, Loader, Loader2 } from "lucide-react";

export default function VoiceCommandBar({ onCommand, loading }) {
	const { transcript, listening, resetTranscript } = useSpeechRecognition();

	React.useEffect(() => {
		console.log("Transcript updated:", transcript);
	}, [transcript]);

	const handleButtonClick = () => {
		if (!listening) {
			resetTranscript();
			SpeechRecognition.startListening({ continuous: true });
		} else {
			SpeechRecognition.stopListening();
			if (transcript && onCommand) {
				console.log("Transcript:", transcript);
				onCommand(transcript);

				resetTranscript();
			}
		}
	};

	// return (
	// 	<div style={{ marginBottom: 8 }}>
	// 		<button
	// 			onClick={handleButtonClick}
	// 			disabled={loading}
	// 			className={`px-4 py-2 rounded ${
	// 				listening ? "bg-green-500 text-white" : "bg-gray-200"
	// 			}`}>
	// 			{listening ? <Loader2 className="animate-spin" /> : <Mic size={16} />}
	// 		</button>
	// 		<span style={{ marginLeft: 8, fontStyle: "italic" }}>{transcript}</span>
	// 	</div>
	// );
	return (
		<div>
			<button
				onClick={handleButtonClick}
				disabled={loading}
				title="Edit with Gridly Agent"
				aria-label="Edit with Gridly Agent"
				className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors border
                    ${"bg-gray-100 hover:bg-gray-200 border-gray-300"}
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}>
				{/* Voice frequency/waveform icon */}
				{listening ? (
					<span className="flex items-center justify-center">
						<svg width="24" height="24" viewBox="0 0 24 24">
							<rect
								x="2"
								y={listening ? 6 : 10}
								width="3"
								height={listening ? 12 : 4}
								rx="1.5"
								fill="currentColor">
								<animate
									attributeName="y"
									values="6;10;6"
									dur="1s"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="height"
									values="12;4;12"
									dur="1s"
									repeatCount="indefinite"
								/>
							</rect>
							<rect
								x="7"
								y={listening ? 2 : 10}
								width="3"
								height={listening ? 20 : 4}
								rx="1.5"
								fill="currentColor">
								<animate
									attributeName="y"
									values="2;10;2"
									dur="1.2s"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="height"
									values="20;4;20"
									dur="1.2s"
									repeatCount="indefinite"
								/>
							</rect>
							<rect
								x="12"
								y={listening ? 6 : 10}
								width="3"
								height={listening ? 12 : 4}
								rx="1.5"
								fill="currentColor">
								<animate
									attributeName="y"
									values="6;10;6"
									dur="1.1s"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="height"
									values="12;4;12"
									dur="1.1s"
									repeatCount="indefinite"
								/>
							</rect>
							<rect
								x="17"
								y={listening ? 10 : 10}
								width="3"
								height={listening ? 4 : 4}
								rx="1.5"
								fill="currentColor">
								<animate
									attributeName="y"
									values="10;2;10"
									dur="1.3s"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="height"
									values="4;20;4"
									dur="1.3s"
									repeatCount="indefinite"
								/>
							</rect>
						</svg>
					</span>
				) : (
					<Mic size={16} />
				)}
			</button>
			<span
				style={{
					border: "1px solid #ccc",
					marginLeft: 8,
					fontStyle: "italic",
					color: "black",
					backgroundColor: "white",
				}}>
				{transcript}
			</span>
		</div>
	);
}
