import React, { useState } from 'react';
import axios from 'axios';
import { X, Mail, Lock, User, EyeOff, Eye } from 'lucide-react';
import { SiGithub, SiGoogle } from 'react-icons/si';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isSignUp ? '/api/v1/auth/register' : '/api/v1/auth/login';
            const payload = isSignUp ? { name, email, password } : { email, password };

            // Axios call with HttpOnly Cookie Credentials enabled
            const response = await axios.post(
                `${API_BASE_URL}${endpoint}`,
                payload,
                {
                    timeout: 10000,
                    withCredentials: true // <--- IMPORTANT: HttpOnly cookie pass/receive karne ke liye
                }
            );

            // Validation updated for HttpOnly Cookie Flow (token is set in cookies automatically)
            if (response.data && response.data.success && response.data.user) {
                const userData = response.data.user;

                if (onAuthSuccess) {
                    onAuthSuccess(userData);
                }

                setName('');
                setEmail('');
                setPassword('');
                setError('');
                onClose();
            } else {
                setError(response.data?.message || 'Unexpected response structure from server.');
            }
        } catch (err) {
            console.error('Auth Error Details:', err.response?.data);
            setError(
                err.response?.data?.message ||
                'Authentication failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = (provider) => {
        window.location.href = `${API_BASE_URL}/api/v1/auth/${provider}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {isSignUp ? 'Create your DevPulse Account' : 'Welcome back to DevPulse'}
                </h2>
                <p className="text-xs text-slate-400 text-center mb-6">
                    Track your stats across platforms
                </p>

                {error && (
                    <div className="mb-4 text-xs text-red-400 text-center bg-red-950/30 border border-red-800/40 py-2 px-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input
                                type="email"
                                required
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                            Password
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-11 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition cursor-pointer"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="my-6 text-center border-t border-slate-800 relative">
                    <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-slate-900 px-3 text-[11px] text-slate-500">
                        Have Google or GitHub?
                    </span>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => handleOAuth('github')}
                        className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer text-slate-200"
                    >
                        <SiGithub className="w-4 h-4" /> Continue with GitHub
                    </button>
                    <button
                        onClick={() => handleOAuth('google')}
                        className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer text-slate-200"
                    >
                        <SiGoogle className="w-4 h-4 text-rose-500" /> Continue with Google
                    </button>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        className="text-indigo-400 hover:underline font-semibold cursor-pointer ml-1"
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}