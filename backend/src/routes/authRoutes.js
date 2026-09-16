import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import express from 'express';
import passport from 'passport';
import User from '../models/UserModel.js';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import {
    register,
    loginUser,
    logout,
    getMe,
    updateAvatar
} from '../controllers/authController.js';

const router = express.Router();
const findOrCreateOAuthUser = async (oauthUser) => {
    let user = await User.findOne({ email: oauthUser.email });

    if (!user) {
        user = await User.create({
            name: oauthUser.displayName,
            email: oauthUser.email,
            avatar: oauthUser.avatar || '',
            provider: oauthUser.provider,
            providerId: oauthUser.id
        });
    } else {
        if (!user.providerId) {
            user.provider = oauthUser.provider;
            user.providerId = oauthUser.id;
            await user.save();
        }
    }

    return user;
};

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/update-avatar', upload.single('avatar'), updateAvatar);

// Passport Session Helpers
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 3. PASSPORT OAUTH STRATEGIES

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            // Ab yahan process.env guarantee ke saath kaam karega
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                avatar: profile._json?.avatar_url,
                provider: 'github',
            };
            return done(null, user);
        }
    )
);

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                username: profile.emails?.[0]?.value?.split('@')[0] || profile.displayName,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
                provider: 'google',
            };
            return done(null, user);
        }
    )
);

// GitHub Routes
router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login', session: false }),
    async (req, res) => {
        const saveUser = await findOrCreateOAuthUser(req.user);
        // console.log("OAuth JWT SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: saveUser._id },
            process.env.JWT_SECRET || 'devpulse_super_secret_jwt_key_2026',
            {
                expiresIn: '7d',
            }
        );

        res
            .cookie('devpulse_token', token, COOKIE_OPTIONS)
            .redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }
);

// Google Routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async (req, res) => {
        const saveUser = await findOrCreateOAuthUser(req.user);

        const token = jwt.sign(
            { id: saveUser._id },
            process.env.JWT_SECRET || 'devpulse_super_secret_jwt_key_2026',
            {
                expiresIn: '7d',
            }
        );

        res
            .cookie('devpulse_token', token, COOKIE_OPTIONS)
            .redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }
);

export default router;