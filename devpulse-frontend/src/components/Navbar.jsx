import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, BookOpen, X, Code, Terminal, Layers, Upload } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenAuth, onUpdateAvatar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocsOpen, setIsDocsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Scroll listener to toggle background transparency on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAvatarFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && onUpdateAvatar) {
            onUpdateAvatar(file);
            setIsDropdownOpen(false)
        }
    };

    const getInitials = () => {
        if (!user) return 'DP';
        const nameStr = user.name || user.username || user.email || '';
        if (!nameStr) return 'U';

        const parts = nameStr.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return nameStr.slice(0, 2).toUpperCase();
    };

    return (
        <>
            {/* Fixed Positioning with Dynamic Glassmorphism Background & Bottom Border */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full max-w-7xl m-auto transition-all duration-300 border-b ${isScrolled
                    ? 'backdrop-blur-md border-indigo-500/20 shadow-xl py-3'
                    : 'backdrop-blur-sm border-slate-800/80 py-3'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
                    {/* DevPulse Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight cursor-pointer">
                            DevPulse
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={() => setIsDocsOpen(true)}
                            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer focus:outline-none"
                        >
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                            <span>Docs</span>
                        </button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-indigo-500/70 bg-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md overflow-hidden hover:border-indigo-400 focus:outline-none transition cursor-pointer"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>{getInitials()}</span>
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-60 sm:w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="pb-3 border-b border-slate-800">
                                            <p className="text-sm font-bold text-slate-100 truncate">
                                                {user.name || user.username || 'Developer'}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                                {user.email || 'No email set'}
                                            </p>
                                        </div>

                                        <div className="py-3 border-b border-slate-800">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarFileSelect}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                                            >
                                                <Upload className="w-4 h-4 text-indigo-400" />
                                                <span>Change Profile Picture</span>
                                            </button>
                                        </div>

                                        <div className="pt-3">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    onLogout();
                                                }}
                                                className="w-full flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 rounded-xl transition cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={onOpenAuth}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-[5px] shadow-lg transition cursor-pointer hover:rounded-xl"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Docs Modal */}
            {isDocsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-bold text-white">DevPulse Documentation</h2>
                            </div>
                            <button
                                onClick={() => setIsDocsOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-5 text-sm text-slate-300">
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
                                    <Code className="w-4 h-4 text-indigo-400" /> Quick Start
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Welcome to DevPulse. Manage components, monitor dynamic data, and update user preferences seamlessly from your dashboard.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-300 mb-1">
                                        <Terminal className="w-4 h-4" /> Component Setup
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Functional components with built-in Tailwind responsive layout wrappers.
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-2 font-semibold text-xs text-purple-300 mb-1">
                                        <Layers className="w-4 h-4" /> Profile State
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Supports initials fallback and local file avatar uploads.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={() => setIsDocsOpen(false)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-[5px] transition cursor-pointer hover:rounded-xl"
                            >
                                Close Docs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}