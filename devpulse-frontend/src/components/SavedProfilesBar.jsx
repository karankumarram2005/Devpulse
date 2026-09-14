import React from 'react';
import { Bookmark, X, ExternalLink, Sparkles } from 'lucide-react';
import { SiGithub, SiLeetcode } from 'react-icons/si';

export default function SavedProfilesBar({
    savedProfiles = [],
    onSelectProfile,
    onRemoveBookmark,
    user,
    onOpenAuth
}) {
    if (!user) {
        return (
            <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">
                        Sign in to save profiles and access your quick-bookmarks here.
                    </span>
                </div>
                <button
                    onClick={onOpenAuth}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                </button>
            </div>
        );
    }

    if (savedProfiles.length === 0) {
        return (
            <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-6 backdrop-blur-md flex items-center gap-2 text-xs text-slate-400">
                <Bookmark className="w-4 h-4 text-amber-400/60" />
                <span>No saved profiles yet. Click <strong>"Save"</strong> on any score card to pin it here!</span>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>Saved Profiles ({savedProfiles.length})</span>
                </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
                {savedProfiles.map((item) => (
                    <div
                        key={`${item.type}-${item.username}`}
                        className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 px-3 py-2 rounded-xl transition cursor-pointer group shrink-0"
                        onClick={() => onSelectProfile(item)}
                    >
                        <img
                            src={item.avatar}
                            alt={item.name || item.username}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition truncate max-w-[100px]">
                                {item.name || item.username}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                {item.type === 'github' ? (
                                    <SiGithub className="w-2.5 h-2.5 text-indigo-400" />
                                ) : (
                                    <SiLeetcode className="w-2.5 h-2.5 text-amber-400" />
                                )}
                                {item.type}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveBookmark(item);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition ml-1"
                            title="Remove from saved"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}