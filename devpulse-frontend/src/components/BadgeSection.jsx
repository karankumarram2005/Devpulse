import { Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

export default function BadgeSection({
    markdownSnippet,
    copyToClipboard,
    copied,
    badgeUrl,
}) {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Embeddable GitHub README Badge
            </h3>

            <p className="text-sm text-slate-400 mb-4">
                Copy this markdown snippet to embed your live stats directly into your GitHub `README.md`.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-6">
                <input
                    type="text"
                    readOnly
                    value={markdownSnippet}
                    className="w-full bg-transparent text-sm text-slate-300 font-mono focus:outline-none px-2"
                />

                <button
                    onClick={copyToClipboard}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}

                    {copied ? 'Copied!' : 'Copy Markdown'}
                </button>
            </div>

            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                Live Badge Preview
            </div>

            <div className="mt-4 p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/30">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />

                <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-800/60 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                            Current Badge Preview
                        </span>
                    </div>

                    <a
                        href={badgeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                        Open SVG <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <div className="w-full py-6 px-4 bg-slate-950/70 border border-slate-800/50 rounded-xl flex items-center justify-center relative z-10 shadow-inner group-hover:border-slate-700/60 transition-colors">
                    <img
                        src={badgeUrl}
                        alt="DevPulse Badge Preview"
                        className="max-w-full h-auto rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-out"
                        onError={(e) => {
                            e.currentTarget.alt = 'Failed to load live badge preview';
                        }}
                    />
                </div>
            </div>
        </div>
    );
}