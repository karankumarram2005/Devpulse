import {
    Star,
    Users,
    FolderGit2,
    PieChart as PieIcon,
} from 'lucide-react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { SiGithub } from 'react-icons/si';

export default function GithubCard({
    data,
    githubInput,
    getGithubAvatar,
    setPreviewImage,
    COLORS,
}) {
    return (
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={
                            getGithubAvatar?.() ||
                            data.github.avatar_url ||
                            data.github.avatar ||
                            `https://github.com/${data.github.login || data.github.username || githubInput || 'ghost'}.png`
                        }
                        alt={
                            data.github.name ||
                            data.github.login ||
                            data.github.username ||
                            'GitHub User'
                        }
                        title="Click to view profile picture"
                        onClick={() => {
                            const avatarUrl =
                                getGithubAvatar?.() ||
                                data.github.avatar_url ||
                                data.github.avatar ||
                                `https://github.com/${data.github.login || data.github.username || githubInput}.png`;

                            setPreviewImage?.({
                                url: avatarUrl,
                                name: `${data.github.name || data.github.login || data.github.username || 'GitHub Profile'}`,
                            });
                        }}
                        className="w-16 h-16 rounded-full border-2 border-indigo-500/50 shadow-lg object-cover cursor-pointer hover:border-indigo-400 transition shrink-0"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            const userHandle =
                                data?.github?.login ||
                                data?.github?.username ||
                                githubInput;

                            if (userHandle) {
                                e.currentTarget.src = `https://github.com/${userHandle}.png`;
                            } else {
                                e.currentTarget.src =
                                    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                            }
                        }}
                    />

                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-slate-100 truncate">
                            {data.github.name ||
                                data.github.login ||
                                data.github.username ||
                                'GitHub Developer'}
                        </h2>

                        <a
                            href={`https://github.com/${data.github.login || data.github.username || githubInput}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition cursor-pointer w-fit mt-1"
                        >
                            <SiGithub className="w-4 h-4 fill-current text-indigo-400 shrink-0" />
                            <span className="truncate">GitHub Profile</span>
                        </a>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                        <FolderGit2 className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-500 block">Repos</span>
                        <span className="text-lg font-bold text-slate-200">
                            {data.github.publicRepos ?? data.github.public_repos ?? 0}
                        </span>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                        <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-500 block">Stars</span>
                        <span className="text-lg font-bold text-slate-200">
                            {data.github.totalStars ?? 0}
                        </span>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                        <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-500 block">Followers</span>
                        <span className="text-lg font-bold text-slate-200">
                            {data.github.followers ?? 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Languages Pie Chart Section */}
            {Array.isArray(data.languages) && data.languages.length > 0 && (
                <div className="border-t border-slate-800/80 pt-4 mt-auto">
                    <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                        <PieIcon className="w-3.5 h-3.5 text-indigo-400" />
                        Top Used Languages
                    </div>

                    <div className="h-32 w-full flex items-center gap-2">
                        <div className="h-full w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.languages.map((item) => ({
                                            ...item,
                                            value: Number(item.value || item.count || 1),
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={25}
                                        outerRadius={45}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.languages.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0F172A',
                                            borderColor: '#1E293B',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-1/2 text-xs space-y-1.5 pl-2 max-h-28 overflow-y-auto custom-scrollbar">
                            {data.languages.map((lang, i) => (
                                <div
                                    key={lang.name || i}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                                        style={{
                                            backgroundColor: COLORS[i % COLORS.length],
                                        }}
                                    />

                                    <span className="text-slate-300 font-medium truncate">
                                        {lang.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}