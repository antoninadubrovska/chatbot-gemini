
import type { RequestHandler } from 'express'

export function formatTimestamp(): string {
    return new Date().toLocaleString()
}

export const logger: RequestHandler = (req, res, next) => {
    console.log(`${formatTimestamp()} - ${req.method} ${req.originalUrl}`)
    next()
}
