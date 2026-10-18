import { useState } from "react";
import "./App.css";

function App() {
	const [question, setQuestion] = useState("");

	const [messages, setMessages] = useState<
		{ role: "user" | "model"; text: string }[]
	>([]);

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
			<header className="chat-header">
				<h1>Gemini Chatbot</h1>
				<p>Ask me anything</p>
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
