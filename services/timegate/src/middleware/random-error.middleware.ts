import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { trace } from '@opentelemetry/api'
import { RANDOM_ERROR_RATE } from '../config'

const errorMessages = [
    "Timegate malfunction! Somebody jammed a banana in the chrono-converter.",
    "Trace anomaly detected. Timegate says: 'Not today, temporal traveler.'",
    "Oops! You hit a wormhole in the Timegate. Please reboot reality and try again.",
    "Timegate Error 42: The answer is no. Just... no.",
    "Chrono-lock engaged. You're not allowed to proceed without a flux capacitor.",
    "Temporal traffic jam. All time lanes are currently congested.",
    "You just triggered a paradox. The Timegate doesn’t like that.",
    "Quantum hiccup! Timegate threw a tantrum and knocked over your request.",
    "Your trace ID got flagged by the time cops. Please remain where you are.",
    "System error: The Timegate tried to process your request, but started watching 'Back to the Future' instead.",
];

const getRandomErrorMessage = (traceId) => {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)]
}

export default (req: Request, res: Response, next: NextFunction) => {
    const span = trace.getActiveSpan();
    const traceId = span?.spanContext()?.traceId;

    let errorRate = parseFloat((req.query?.errorRate as string))

    if (isNaN(errorRate) || errorRate < 0 || errorRate > 1) {
        errorRate = RANDOM_ERROR_RATE;
    }

    if (traceId) {
        const hash = crypto.createHash('sha256').update(traceId).digest();
        const val = hash.readUInt32BE(0) / 0xffffffff;

        if (val < errorRate) {
            return res.status(500).json({
                message: getRandomErrorMessage(traceId),
                code: 'WARP_ENGINE_ERROR'
            })
        }
    }

    return next();
}