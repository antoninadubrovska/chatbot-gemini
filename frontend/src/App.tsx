import { useEffect, useState } from "react";
import "./App.css";

// backend uses parts (frontend uses text)

type ApiMessage = {
	role: "user" | "model";
	parts: { text: string }[];
};

function App() {
	const [question, setQuestion] = useState("");

	const [messages, setMessages] = useState<
		{ role: "user" | "model"; text: string }[]
	>([]);

	// fetch history when the app opens
	useEffect(() => {
		async function loadHistory() {
			try {
				// retrieve the backend's conversation
				const response = await fetch("/api/chat");

				if (!response.ok) {
					throw new Error("Failed to load chat history.");
				}

				const history: ApiMessage[] = await response.json();

				// display the retrieved messages
				setMessages(
					// convert each backend message into the format React already uses
					history.map((message) => ({
						role: message.role,
						text: message.parts.map((part) => part.text).join(""),
					})),
				);
			} catch (error) {
				console.error("Failed to load chat history:", error);
			}
		}

		void loadHistory();
	}, []);

	async function clearChat() {
		try {
			const response = await fetch("/api/chat", {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to clear chat history.");
			}

			setMessages([]);
			setQuestion("");
		} catch (error) {
			console.error("Failed to clear chat:", error);
		}
	}

	async function sendQuestion(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedQuestion = question.trim();

		if (!trimmedQuestion) return;

		setMessages((previous) => [
			...previous,
			{ role: "user", text: trimmedQuestion },
		]);

		setQuestion("");

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ question: trimmedQuestion }),
			});

			const data: { answer: string } = await response.json();

			if (!response.ok) {
				throw new Error(data.answer || "Something went wrong.");
			}

			setMessages((previous) => [
				...previous,
				{ role: "model", text: data.answer },
			]);
		} catch (error) {
			console.error("Failed to send question:", error);
		}
	}

	return (
		<main className="chat">
			{/* <header className="chat-header">
				<h1>Gemini Chatbot</h1>
				<p>Ask me anything</p>
			</header> */}

			<header className="chat-header">
				<div>
					<h1>Gemini Chatbot</h1>
					<p>Ask me anything</p>
				</div>

				<button
					type="button"
					className="clear-button"
					onClick={clearChat}
				>
					Clear chat
				</button>
			</header>

			<section className="chat-messages">
				{messages.length === 0 ? (
					<p className="empty-message">
						Conversation will appear here.
					</p>
				) : (
					messages.map((message, index) => (
						<div key={index} className={`message ${message.role}`}>
							<strong>
								{message.role === "user" ? "You" : "Gemini"}
							</strong>
							<p>{message.text}</p>
						</div>
					))
				)}
			</section>

			<form className="chat-form" onSubmit={sendQuestion}>
				<input
					type="text"
					value={question}
					onChange={(event) => setQuestion(event.target.value)}
					placeholder="Type your question..."
				/>

				<button type="submit">Send</button>
			</form>
		</main>
	);
}

export default App;
