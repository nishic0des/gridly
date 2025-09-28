import React, { useState, useEffect } from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, Loader2 } from "lucide-react";

export default function VoiceCommandBar({ onCommand, loading }) {
	const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
	const [error, setError] = useState(null);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	useEffect(() => {
		if (!browserSupportsSpeechRecognition) {
			setBrowserSupportsSpeech(false);
			setError(
				"Your browser doesn't support speech recognition. Try using Chrome or edge."
			);
		}
	}, [browserSupportsSpeechRecognition]);

	const handleButtonClick = async () => {
		try {
			if (!browserSupportsSpeechRecognition) {
				setError(
					"Your browser doesn't support speech recognition. Try using Chrome or edge."
				);
				return;
			}

			if (!listening) {
				resetTranscript();
				await SpeechRecognition.startListening({
					continuous: true,
					language: "en-US", // Ensure we're using English
				});
			} else {
				await SpeechRecognition.stopListening();

				if (transcript && onCommand) {
					// Process the command
					const success = onCommand(transcript);

					if (!success) {
						setError(
							"Command not recognized. Try saying something like 'write Hello in A1' or 'format A1 as bold'."
						);
					} else {
						setError(null);
					}

					resetTranscript();
				}
			}
		} catch (err) {
			console.error("Error with speech recognition:", err);
			setError(
				"Error accessing microphone. Please check your permissions and try again."
			);
		}
	};

	return (
		<div className="flex items-center">
			<button
				onClick={handleButtonClick}
				disabled={loading || !browserSupportsSpeechRecognition}
				title={
					browserSupportsSpeechRecognition
						? "Use voice commands"
						: "Voice commands not supported"
				}
				aria-label="Use voice commands"
				className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors border
          ${
						listening
							? "bg-green-100 border-green-400"
							: "bg-gray-100 hover:bg-gray-200 border-gray-300"
					}
          ${
						loading || !browserSupportsSpeechRecognition
							? "opacity-50 cursor-not-allowed"
							: ""
					}
        `}>
				{listening ? (
					<span className="flex items-center justify-center">
						<svg width="24" height="24" viewBox="0 0 24 24">
							{/* Animation bars */}
							<rect
								x="2"
								y="6"
								width="3"
								height="12"
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
								y="2"
								width="3"
								height="20"
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
								y="6"
								width="3"
								height="12"
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
								y="10"
								width="3"
								height="4"
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

			{error && (
				<div className="ml-2 text-red-500 text-sm max-w-xs">{error}</div>
			)}

			{transcript && (
				<div className="ml-2 px-2 py-1 bg-white border border-gray-200 rounded text-sm italic">
					{transcript}
				</div>
			)}
		</div>
	);
}
