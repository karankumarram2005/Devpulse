import { Sparkles } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <header className="text-center max-w-2xl my-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-4">
                <Sparkles className="w-4 h-4" /> Next-Gen Developer Assessment Platform
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DevPulse Dashboard
            </h1>

            <p className="mt-3 text-slate-400 text-base sm:text-lg">
                Aggregate your live GitHub contributions, LeetCode stats, and language analytics in one unified showcase.
            </p>
        </header>
    );
}