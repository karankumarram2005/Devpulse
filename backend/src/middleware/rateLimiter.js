import rateLimit from 'express-rate-limit';

// Standard API Limiter (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// SVG Badge Limiter (More permissive for GitHub README embedding: 300 requests per 15 minutes)
export const badgeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: 'Badge rate limit exceeded.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});