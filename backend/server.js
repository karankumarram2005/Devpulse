import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';

// Routes Imports
import devpulseRoutes from './src/routes/devpulseRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Setup
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5000'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS Policy Restriction'));
    },
    credentials: true
}));

// 2. Parsers & Passport Middleware
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// 3. API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/devpulse', devpulseRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// 5. Connect Database & Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server active on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err.message);
});