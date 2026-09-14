import { Bookmark, Flame } from 'lucide-react';
import { SiGithub, SiLeetcode } from 'react-icons/si';

export default function ScoreCards({
    data,
    user,
    savedProfiles,
    setIsAuthOpen,
    handleToggleBookmark,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {data.github && (
                <div className="bg-slate-900/60 border border-indigo-500/30 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-xl relative">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <SiGithub className="w-4 h-4 text-indigo-400" /> GitHub Score
                            </div>

                            <button
                                onClick={() => {
                                    if (!user) {
                                        setIsAuthOpen(true);
                                    } else {
                                        handleToggleBookmark({
                                            id: data.github.id || data.github.login,
                                            username: data.github.login,
                                            name: data.github.name || data.github.login,
                                            avatar:
                                                data.github.avatar_url ||
                                                data.github.avatar ||
                                                `https://github.com/${data.github.login}.png`,
                                            type: 'github',
                                        });
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${savedProfiles?.some(
                                    (item) => item.username === data.github.login
                                )
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                title={
                                    user
                                        ? savedProfiles?.some(
                                            (item) => item.username === data.github.login
                                        )
                                            ? 'Remove Bookmark'
                                            : 'Save Profile'
                                        : 'Sign in to bookmark profile'
                                }
                            >
                                <Bookmark
                                    className={`w-3.5 h-3.5 ${savedProfiles?.some(
                                        (item) => item.username === data.github.login
                                    )
                                        ? 'fill-amber-400 text-amber-400'
                                        : ''
                                        }`}
                                />

                                <span>
                                    {savedProfiles?.some(
                                        (item) => item.username === data.github.login
                                    )
                                        ? 'Saved'
                                        : 'Save'}
                                </span>
                            </button>
                        </div>

                        <div className="text-3xl font-extrabold text-white mt-2">
                            {data.githubScore ?? 0}{' '}
                            <span className="text-slate-500 text-sm font-normal">
                                / 500 pts
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {data.leetcode && (
                <div className="bg-slate-900/60 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-xl relative">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <SiLeetcode className="w-4 h-4 text-amber-400" /> LeetCode Score
                            </div>

                            <button
                                onClick={() => {
                                    if (!user) {
                                        setIsAuthOpen(true);
                                    } else {
                                        handleToggleBookmark({
                                            id: data.leetcode.username,
                                            username: data.leetcode.username,
                                            name:
                                                data.leetcode.name || data.leetcode.username,
                                            avatar:
                                                data.leetcode.avatar ||
                                                data.leetcode.userAvatar,
                                            type: 'leetcode',
                                        });
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${savedProfiles?.some(
                                    (item) =>
                                        item.username === data.leetcode.username
                                )
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                title={
                                    user
                                        ? savedProfiles?.some(
                                            (item) =>
                                                item.username === data.leetcode.username
                                        )
                                            ? 'Remove Bookmark'
                                            : 'Save Profile'
                                        : 'Sign in to bookmark profile'
                                }
                            >
                                <Bookmark
                                    className={`w-3.5 h-3.5 ${savedProfiles?.some(
                                        (item) =>
                                            item.username === data.leetcode.username
                                    )
                                        ? 'fill-amber-400 text-amber-400'
                                        : ''
                                        }`}
                                />

                                <span>
                                    {savedProfiles?.some(
                                        (item) =>
                                            item.username === data.leetcode.username
                                    )
                                        ? 'Saved'
                                        : 'Save'}
                                </span>
                            </button>
                        </div>

                        <div className="text-3xl font-extrabold text-white mt-2">
                            {data.leetcodeScore ?? 0}{' '}
                            <span className="text-slate-500 text-sm font-normal">
                                / 500 pts
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {data.devScore !== undefined && (
                <div
                    className={`bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-purple-900/50 border border-purple-500/30 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-xl ${!data.github || !data.leetcode
                        ? 'md:col-span-2'
                        : ''
                        }`}
                >
                    <div>
                        <div className="text-xs text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-purple-400" /> Overall DevScore
                        </div>

                        <div className="text-3xl font-extrabold text-white mt-2">
                            {data.devScore}{' '}
                            <span className="text-slate-500 text-sm font-normal">
                                / 1000 pts
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}