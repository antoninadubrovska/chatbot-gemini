
import express from 'express'
import { sendRequest } from '../ai.ts'
import { questionSchema, type Content, type QuestionBody } from '../schemas.ts'

const router = express.Router()

// Temporary in-memory history. Will be replaced with DynamoDB later.
const history: Content[] = []

type PromptResponse = {
    answer: string
}

router.post<{}, PromptResponse, QuestionBody>('/', async (req, res) => {
    const parsed = questionSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).send({ answer: 'Invalid question.' })
        return
    }

    const question = parsed.data.question.trim()

    if (!question) {
        res.status(400).send({ answer: 'Question cannot be empty.' })
        return
    }

    history.push({
        role: 'user',
        parts: [{ text: question }]
    })

    const before = performance.now()
    const answer = await sendRequest(history)
    const elapsed = Math.round(performance.now() - before)

    console.log(`Gemini replied in ${elapsed}ms.`)

    if (!answer) {
        history.pop()
        res.status(502).send({ answer: 'Gemini could not provide a response.' })
        return
    }

    history.push({
        role: 'model',
        parts: [{ text: answer }]
    })

    res.send({ answer })
})

router.get<{}, Content[]>('/', (_req, res) => {
    res.send(history)
})

router.delete('/', (_req, res) => {
    history.splice(0, history.length)
    res.sendStatus(204)
})

export default router
