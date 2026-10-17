// retrieves the key from your backend environment
export function getApiKey(): string {
	if (!process.env.GEMINI_API_KEY) {
		console.log("Gemini API key not found in .env file!");
		process.exit(1);
	}

	return process.env.GEMINI_API_KEY;
}
