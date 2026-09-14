import NodeCache from 'node-cache';
import * as apiService from '../services/apiService.js';
import axios from 'axios';

// Initialize cache with a 1-hour default TTL
const profileCache = new NodeCache({ stdTTL: 3600 });

// Helper to calculate individual platform scores and overall score
const calculateScores = (github, leetcode) => {
    let githubScore = 0;
    if (github) {
        githubScore += Math.min((github.publicRepos || 0) * 10, 150);
        githubScore += Math.min((github.totalStars || 0) * 20, 200);
        githubScore += Math.min((github.followers || 0) * 5, 150);
    }
    githubScore = Math.min(githubScore, 500);

    let leetcodeScore = 0;
    if (leetcode) {
        leetcodeScore += Math.min(
            (leetcode.easySolved || 0) * 1 +
            (leetcode.mediumSolved || 0) * 3 +
            (leetcode.hardSolved || 0) * 6,
            500
        );
    }
    leetcodeScore = Math.min(leetcodeScore, 500);

    const devScore = githubScore + leetcodeScore;

    return { githubScore, leetcodeScore, devScore };
};

export const getAggregatedProfile = async (req, res, next) => {
    try {
        const { github, leetcode } = req.query;
        const cacheKey = `profile_${github || 'none'}_${leetcode || 'none'}`;

        // 1. Check cached data
        const cachedData = profileCache.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                cached: true,
                data: cachedData,
            });
        }

        // 2. Fetch fresh data
        const results = {};

        if (github) {
            results.github = await apiService.getGitHubStats(github);
            results.languages = await apiService.getGitHubLanguages(github);
        }
        if (leetcode) {
            results.leetcode = await apiService.getLeetCodeStats(leetcode);
        }

        const { githubScore, leetcodeScore, devScore } = calculateScores(results.github, results.leetcode);
        results.githubScore = githubScore;
        results.leetcodeScore = leetcodeScore;
        results.devScore = devScore;

        // 3. Store result in cache
        profileCache.set(cacheKey, results);

        res.status(200).json({
            success: true,
            cached: false,
            data: results,
        });
    } catch (error) {
        next(error);
    }
};

// Image Proxy Controller
export const proxyAvatar = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send('URL required');

        // Send User-Agent and Referer headers so AWS S3 / LeetCode doesn't block the request
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://leetcode.com/'
            }
        });

        const contentType = response.headers['content-type'] || 'image/png';

        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(Buffer.from(response.data));
    } catch (error) {
        console.error('Avatar Proxy Error:', error.message);
        res.status(500).send('Error fetching image');
    }
};

export const getBadgeSvg = async (req, res) => {
    try {
        const { github, leetcode } = req.query;
        const ghUser = github || 'DevPulse';
        const lcUser = leetcode || '';

        let ghScore = parseInt(req.query.ghScore);
        let lcScore = parseInt(req.query.lcScore);
        let totalScore = parseInt(req.query.score);

        // Agar query parameters me score missing ho (Jaise Github README embeds me)
        if (isNaN(ghScore) || isNaN(lcScore) || isNaN(totalScore)) {
            let ghData = null;
            let lcData = null;

            if (github) {
                ghData = await apiService.getGitHubStats(github);
            }
            if (leetcode) {
                lcData = await apiService.getLeetCodeStats(leetcode);
            }

            const calculated = calculateScores(ghData, lcData);
            ghScore = calculated.githubScore;
            lcScore = calculated.leetcodeScore;
            totalScore = calculated.devScore;
        }

        const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="130" viewBox="0 0 400 130" fill="none">
        <rect width="400" height="130" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <path d="M 0 0 L 400 0" stroke="url(#paint0_linear)" stroke-width="4"/>
        
        <!-- Header Title -->
        <text x="20" y="30" fill="#818cf8" font-family="Segoe UI, sans-serif" font-weight="700" font-size="12" letter-spacing="1">
          DEVPULSE ENGINEERING DASHBOARD
        </text>

        <!-- User Handles -->
        <text x="20" y="52" fill="#94a3b8" font-family="Segoe UI, sans-serif" font-size="12">
          GH: @${ghUser} ${lcUser ? `| LC: @${lcUser}` : ''}
        </text>

        <!-- Dynamic Scores -->
        <text x="20" y="80" fill="#a5b4fc" font-family="Segoe UI, sans-serif" font-weight="600" font-size="13">
          GitHub: <tspan fill="#ffffff" font-weight="800">${ghScore}</tspan>/500 pts
          <tspan dx="15" fill="#fcd34d">LeetCode: </tspan><tspan fill="#ffffff" font-weight="800">${lcScore}</tspan>/500 pts
        </text>

        <!-- Total DevScore -->
        <text x="20" y="110" fill="#ffffff" font-family="Segoe UI, sans-serif" font-weight="800" font-size="22">
          DevScore: ${totalScore} <tspan fill="#6366f1" font-size="14">/ 1000 PTS</tspan>
        </text>

        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6366f1"/>
            <stop offset="0.5" stop-color="#a855f7"/>
            <stop offset="1" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
      </svg>
    `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'max-age=3600');
        res.send(svgContent);
    } catch (error) {
        res.status(500).send('Error generating badge');
    }
};