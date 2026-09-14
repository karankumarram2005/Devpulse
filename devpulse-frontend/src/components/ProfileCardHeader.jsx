import React from 'react';
import { Bookmark, Star, Users, FolderGit2 } from 'lucide-react';

export default function ProfileCardHeader({
    profileData,
    user,
    savedProfiles,
    onToggleBookmark,
    onOpenAuth
}) {
    // Check if current profile is already saved
    const isBookmarked = savedProfiles.some(
        (item) => item.username === profileData.login || item.username === profileData.username
    );

    const handleBookmarkClick = () => {
        if (!user) {
            // Guest Nudge: Trigger Auth Modal if not logged in
            onOpenAuth();
        } else {
            // Toggle saved profile state for authenticated user
            onToggleBookmark({
                id: profileData.id || profileData.login || profileData.username,
                username: profileData.login || profileData.username,
                name: profileData.name || profileData.login || profileData.username,
                avatar: profileData.avatar_url || profileData.avatar || `https://github.com/${profileData.login || profileData.username}.png`,
                type: profileData.login ? 'github' : 'leetcode',
            });
        }
    };

    return (
        <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
                {/* Profile Avatar & Name Details */}
                <h3 className="text-lg font-bold text-white">
                    {profileData.name || profileData.login || profileData.username}
                </h3>
            </div>

            {/* Bookmark / Pin Button (Guest Nudge + Persistent State) */}
            <button
                onClick={handleBookmarkClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${isBookmarked
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                title={user ? (isBookmarked ? 'Remove Bookmark' : 'Save Profile') : 'Sign in to bookmark profile'}
            >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save Profile'}</span>
            </button>
        </div>
    );
}