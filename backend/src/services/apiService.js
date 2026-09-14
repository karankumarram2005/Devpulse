import axios from 'axios';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// GitHub Personal Access Token Authorization Setup
const GITHUB_HEADERS = process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {};

export const getGitHubStats = async (username) => {
    try {
        const userRes = await axios.get(`https://api.github.com/users/${username}`, {
            headers: GITHUB_HEADERS,
        });
        const userData = userRes.data;

        const reposRes = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
            { headers: GITHUB_HEADERS }
        );
        const reposData = reposRes.data;

        const totalStars = Array.isArray(reposData)
            ? reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
            : 0;

        const originalAvatar = userData.avatar_url;
        // Corrected route name to /proxy-avatar matching devpulseRoutes.js
        const proxiedAvatar = originalAvatar
            ? `${BASE_URL}/api/v1/devpulse/proxy-avatar?url=${encodeURIComponent(originalAvatar)}`
            : null;

        return {
            username: userData.login,
            name: userData.name || userData.login,
            avatarUrl: proxiedAvatar,
            publicRepos: userData.public_repos || 0,
            totalStars: totalStars,
            followers: userData.followers || 0,
            following: userData.following || 0,
            publicGists: userData.public_gists || 0,
            bio: userData.bio || '',
            location: userData.location || '',
            company: userData.company || '',
            createdYear: new Date(userData.created_at).getFullYear(),
        };
    } catch (error) {
        throw new Error(`GitHub user not found: ${username}`);
    }
};

export const getGitHubLanguages = async (username) => {
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers: GITHUB_HEADERS }
        );
        const repos = response.data;

        const langMap = {};
        if (Array.isArray(repos)) {
            repos.forEach((repo) => {
                if (repo.language) {
                    langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                }
            });
        }

        return Object.keys(langMap).map((lang) => ({
            name: lang,
            value: langMap[lang],
        }));
    } catch (error) {
        return [];
    }
};

export const getLeetCodeStats = async (username) => {
    try {
        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            userAvatar
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://leetcode.com/',
                },
            }
        );

        const user = response.data.data?.matchedUser;
        if (!user) throw new Error('LeetCode user not found');

        let originalAvatar = user.profile?.userAvatar;

        // Fix 1: Resolve relative URLs returned by LeetCode API (e.g., /static/images/...)
        if (originalAvatar && originalAvatar.startsWith('/')) {
            originalAvatar = `https://leetcode.com${originalAvatar}`;
        }

        // Fix 2: Point to the exact /proxy-avatar route registered in devpulseRoutes.js
        const proxiedAvatar = originalAvatar
            ? `${BASE_URL}/api/v1/devpulse/proxy-avatar?url=${encodeURIComponent(originalAvatar)}`
            : null;

        const submissions = user.submitStats?.acSubmissionNum || [];

        return {
            username: user.username,
            avatarUrl: proxiedAvatar,
            ranking: user.profile?.ranking || 'N/A',
            totalSolved: submissions.find((s) => s.difficulty === 'All')?.count || 0,
            easySolved: submissions.find((s) => s.difficulty === 'Easy')?.count || 0,
            mediumSolved: submissions.find((s) => s.difficulty === 'Medium')?.count || 0,
            hardSolved: submissions.find((s) => s.difficulty === 'Hard')?.count || 0,
        };
    } catch (error) {
        throw new Error(`LeetCode user not found: ${username}`);
    }
};