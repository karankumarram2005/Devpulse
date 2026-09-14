import { X, Sparkles } from 'lucide-react';

export default function WelcomeModal({ isOpen, onClose, onOpenAuth }) {
    if (!isOpen) return null;

    const handleStayLoggedOut = () => {
        // Save preference so modal doesn't re-appear repeatedly in the same session
        sessionStorage.setItem('devpulse_welcome_dismissed', 'true');
        onClose();
    };

    const handleLoginClick = () => {
        sessionStorage.setItem('devpulse_welcome_dismissed', 'true');
        onOpenAuth();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl overflow-hidden">

                {/* Subtle Background Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top-Right Cross (X) Close Icon */}
                <button
                    onClick={handleStayLoggedOut}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon & Heading */}
                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Welcome to DevPulse
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed px-2">
                        Track developer profiles, analyze LeetCode stats, and compare GitHub metrics seamlessly.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    {/* Button 1: Login / Register */}
                    <button
                        onClick={handleLoginClick}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition cursor-pointer"
                    >
                        <span className='text-xs'>Log-in</span>
                    </button>

                    {/* Button 2: Stay Logged Out */}
                    <button
                        onClick={handleStayLoggedOut}
                        className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700/80 transition cursor-pointer"
                    >
                        Stay Logged Out
                    </button>
                </div>

            </div>
        </div>
    );
}