

import { GoogleGenAI } from '@google/genai'
import { getApiKey } from './utils.ts'
import type { Contents } from './schemas.ts'

// creates the client used to call Google's Gemini API
const ai = new GoogleGenAI({
    apiKey: getApiKey()
})

export async function sendRequest(
    prompt: Contents
): Promise<string | null> {
    const modelName = 'gemini-3.1-flash-lite'

    try {
		const response = await ai.models.generateContent({
			// sends the request to Gemini
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction:
                    'You are a helpful assistant. Give clear, concise answers based on facts.'
            }
        })

		// returns the generated text, or null if no text is available
        return response.text ?? null
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error)

        console.error('Error when awaiting response from Gemini:', message)

        return null
    }
}
