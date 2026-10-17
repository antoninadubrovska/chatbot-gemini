import express, { type Express } from 'express'
import { formatTimestamp, logger } from './middleware.ts'
import chatRouter from './routes/chat.ts'

const app: Express = express()
const port: number = 3010

// Middleware
app.use('/', logger)
app.use(express.json())

// API routes
app.use('/api/chat', chatRouter)

// Start the server
app.listen(port, () => {
    const now = formatTimestamp()
    console.log(`Server is listening on port ${port}. The time is ${now}.`)
})