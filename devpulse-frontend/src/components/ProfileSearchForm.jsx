import { Zap } from 'lucide-react';
import { SiGithub, SiLeetcode } from 'react-icons/si';

export default function ProfileSearchForm({
    githubInput,
    setGithubInput,
    leetcodeInput,
    setLeetcodeInput,
    error,
    isFormValid,
    loading,
    handleFormSubmit,
}) {
    return (
        <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md p-6 rounded-2xl shadow-2xl mb-10 relative z-10"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        GitHub Username
                    </label>

                    <div className="relative">
                        <SiGithub className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

                        <input
                            type="text"
                            placeholder="e.g., torvalds"
                            value={githubInput}
                            onChange={(e) => setGithubInput(e.target.value)}
                            disabled={loading}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        LeetCode Username
                    </label>

                    <div className="relative">
                        <SiLeetcode className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

                        <input
                            type="text"
                            placeholder="e.g., neal_wu"
                            value={leetcodeInput}
                            onChange={(e) => setLeetcodeInput(e.target.value)}
                            disabled={loading}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

            </div>

            {error && (
                <p className="mb-4 text-sm text-red-400 text-center bg-red-950/30 border border-red-800/40 py-2 rounded-lg">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`relative group/btn overflow-hidden w-full py-3 px-5 rounded-xl font-bold text-white shadow-xl transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-3 ${isFormValid && !loading
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/25 cursor-pointer opacity-100'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
            >
                {isFormValid && !loading && (
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-out" />
                )}

                <Zap
                    className={`w-5 h-5 transition-transform duration-300 ${isFormValid && !loading
                        ? 'group-hover/btn:scale-125 fill-current'
                        : ''
                        }`}
                />

                <span className="tracking-wide">
                    {loading ? 'Fetching Analytics...' : 'Generate Dashboard'}
                </span>
            </button>
        </form>
    );
}