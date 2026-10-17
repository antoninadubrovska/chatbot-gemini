
import * as z from 'zod'

export const questionSchema = z.object({
    question: z.string().min(1, 'Question cannot be empty')
})

export type QuestionBody = z.infer<typeof questionSchema>


export type Contents = string | Content[]

export type Content = {
    role: 'user' | 'model'
    parts: TextPart[]
}

type TextPart = {
    text: string
}

// const history: Content[] = [
//     {
//         role: 'user',
//         parts: [{ text: 'What is React?' }]
//     },
//     {
//         role: 'model',
//         parts: [{ text: 'React is a JavaScript library for building user interfaces.' }]
//     }
// ]