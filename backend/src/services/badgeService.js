export const generateBadgeSVG = ({ github, leetcode }) => {
    const name = github?.name || leetcode?.username || 'Developer';
    const repos = github?.publicRepos ?? '-';
    const stars = github?.totalStars ?? '-';
    const solved = leetcode?.totalSolved ?? '-';

    return `
    <svg width="400" height="150" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="150" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
      <text x="20" y="35" fill="#38BDF8" font-family="sans-serif" font-size="18" font-weight="bold">DevPulse | ${name}</text>
      
      <g transform="translate(20, 55)">
        <text x="0" y="20" fill="#94A3B8" font-family="sans-serif" font-size="13">GitHub Repos</text>
        <text x="0" y="42" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">${repos}</text>
        
        <text x="130" y="20" fill="#94A3B8" font-family="sans-serif" font-size="13">Total Stars</text>
        <text x="130" y="42" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">${stars}</text>

        <text x="250" y="20" fill="#94A3B8" font-family="sans-serif" font-size="13">LeetCode Solved</text>
        <text x="250" y="42" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">${solved}</text>
      </g>

      <line x1="20" y1="120" x2="380" y2="120" stroke="#1E293B" stroke-width="1"/>
      <text x="20" y="136" fill="#64748B" font-family="sans-serif" font-size="10">Powered by DevPulse Engine</text>
    </svg>
  `;
};