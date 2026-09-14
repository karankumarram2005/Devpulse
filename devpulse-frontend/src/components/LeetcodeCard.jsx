import { Award, Zap } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';

export default function LeetcodeCard({
    data,
    leetcodeInput,
    getLeetcodeAvatar,
    setPreviewImage,
}) {
    return (
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src={
                            getLeetcodeAvatar?.() ||
                            `https://unavatar.io/leetcode/${data.leetcode.username || leetcodeInput}`
                        }
                        alt={data.leetcode.username || leetcodeInput || 'LeetCode User'}
                        title="Click to view profile picture"
                        onClick={() =>
                            setPreviewImage?.({
                                url:
                                    getLeetcodeAvatar?.() ||
                                    `https://unavatar.io/leetcode/${data.leetcode.username || leetcodeInput}`,
                                name: `${data.leetcode.username || leetcodeInput || 'LeetCode Profile'}`,
                            })
                        }
                        className="w-16 h-16 rounded-full border-2 border-amber-500/50 shadow-lg object-cover cursor-pointer hover:border-amber-400 transition shrink-0"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            const username =
                                data?.leetcode?.username || leetcodeInput;

                            if (username) {
                                e.currentTarget.src = `https://unavatar.io/leetcode/${username}`;
                            } else {
                                e.currentTarget.src =
                                    'https://leetcode.com/static/images/LeetCode_Sharing.png';
                            }
                        }}
                    />

                    <div className="min-w-0 flex-1">
                        <h2
                            className="text-lg font-bold text-slate-100 truncate tracking-tight"
                            title={data.leetcode.username || leetcodeInput}
                        >
                            {data.leetcode.username || leetcodeInput || 'LeetCode User'}
                        </h2>

                        <a
                            href={`https://leetcode.com/u/${data.leetcode.username || leetcodeInput}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition cursor-pointer w-fit mt-0.5"
                        >
                            <SiLeetcode className="w-4 h-4 fill-current text-amber-500 shrink-0" />
                            <span className="truncate">LeetCode Profile</span>
                        </a>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ml-auto whitespace-nowrap">
                        <Award className="w-3.5 h-3.5" /> Rank #
                        {data.leetcode.ranking
                            ? data.leetcode.ranking.toLocaleString()
                            : 'N/A'}
                    </div>
                </div>

                {/* Total Solved Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-400">
                            Total Solved Problems
                        </span>
                        <span className="font-bold text-slate-200">
                            {data.leetcode.totalSolved ?? 0}
                        </span>
                    </div>

                    {(() => {
                        const total = data.leetcode.totalSolved || 1;

                        const easyPct = Math.min(
                            100,
                            Math.max(
                                0,
                                ((data.leetcode.easySolved || 0) / total) * 100
                            )
                        );

                        const medPct = Math.min(
                            100,
                            Math.max(
                                0,
                                ((data.leetcode.mediumSolved || 0) / total) * 100
                            )
                        );

                        const hardPct = Math.min(
                            100,
                            Math.max(
                                0,
                                ((data.leetcode.hardSolved || 0) / total) * 100
                            )
                        );

                        return (
                            <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
                                <div
                                    style={{ width: `${easyPct}%` }}
                                    className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                                    title={`Easy: ${data.leetcode.easySolved || 0}`}
                                />

                                <div
                                    style={{ width: `${medPct}%` }}
                                    className="h-full bg-amber-500 transition-all duration-500"
                                    title={`Medium: ${data.leetcode.mediumSolved || 0}`}
                                />

                                <div
                                    style={{ width: `${hardPct}%` }}
                                    className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                                    title={`Hard: ${data.leetcode.hardSolved || 0}`}
                                />
                            </div>
                        );
                    })()}
                </div>

                {/* Difficulty Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                        <span className="text-xs text-emerald-400 block font-medium">
                            Easy
                        </span>
                        <span className="text-lg font-bold text-emerald-300">
                            {data.leetcode.easySolved ?? 0}
                        </span>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                        <span className="text-xs text-amber-400 block font-medium">
                            Medium
                        </span>
                        <span className="text-lg font-bold text-amber-300">
                            {data.leetcode.mediumSolved ?? 0}
                        </span>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-center">
                        <span className="text-xs text-rose-400 block font-medium">
                            Hard
                        </span>
                        <span className="text-lg font-bold text-rose-300">
                            {data.leetcode.hardSolved ?? 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center gap-3 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                    <Zap className="w-4 h-4" />
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-amber-300">
                        Daily Coding Momentum
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-tight">
                        "Consistency is key. Every problem solved is a step closer to mastery!"
                    </p>
                </div>
            </div>
        </div>
    );
}