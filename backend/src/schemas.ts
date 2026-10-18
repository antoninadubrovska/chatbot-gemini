
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

