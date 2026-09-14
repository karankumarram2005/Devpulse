import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devpulse_super_secret_jwt_key_2026';

// Cookie configuration options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to extract token from Cookie or Auth Header
const extractToken = (req) => {
    if (req.cookies && req.cookies.devpulse_token) {
        return req.cookies.devpulse_token;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

// Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, password).'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email address.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff`;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: defaultAvatar
        });

        const token = generateToken(user._id);

        return res
            .cookie('devpulse_token', token, COOKIE_OPTIONS)
            .status(201)
            .json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration.'
        });
    }
};

// Login Controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);
        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366F1&color=fff`;

        return res
            .cookie('devpulse_token', token, COOKIE_OPTIONS)
            .status(200)
            .json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: avatarUrl
                }
            });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error during login'
        });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    res.clearCookie('devpulse_token', COOKIE_OPTIONS);
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Get Current Logged-in User Info (For session verification on app load)
export const getMe = async (req, res) => {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(401).json({ success: false, message: 'No session token found' });
        }
        // console.log("ME JWT SECRET:", JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.clearCookie('devpulse_token', COOKIE_OPTIONS);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Update Avatar Controller
export const updateAvatar = async (req, res) => {
    try {
        const token = extractToken(req);
        let userId = req.body.userId;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                return res.status(401).json({ success: false, message: 'Invalid token signature' });
            }
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized user.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file.' });
        }

        const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { returnDocument: 'after' }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.error('Update Avatar Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update avatar' });
    }
};