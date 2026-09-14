import Navbar from './components/Navbar.jsx';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Check, PieChart as PieIcon, Share2 } from 'lucide-react';
import AuthModal from './components/AuthModal.jsx';
import WelcomeModal from './components/WelcomeModal.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import ProfileSearchForm from './components/ProfileSearchForm.jsx';
import GithubCard from './components/GithubCard.jsx';
import LeetcodeCard from './components/LeetcodeCard.jsx';
import ScoreCards from './components/ScoreCards.jsx';
import BadgeSection from './components/BadgeSection.jsx';
import ImagePreviewModal from './components/ImagePreviewModal.jsx';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [leetcodeInput, setLeetcodeInput] = useState('');

  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('devpulse_saved_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Updated Initial User State to use js-cookie
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('devpulse_welcome_dismissed');
    if (!user && !isDismissed) {
      const timer = setTimeout(() => {
        setIsWelcomeOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Handle OAuth Callbacks, Cookies & Tamper Protection
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/auth/me`,
          {
            withCredentials: true
          }
        );

        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          return;
        }

        console.error('Session verification failed:', error);
        setUser(null);
      }
    };

    verifySession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const handleToggleBookmark = (profile) => {
    setSavedProfiles((prev) => {
      const exists = prev.some((item) => item.username === profile.username);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.username !== profile.username);
      } else {
        updated = [...prev, profile];
      }
      localStorage.setItem('devpulse_saved_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const isFormValid = githubInput.trim() !== '' || leetcodeInput.trim() !== '';

  const fetchDevPulseData = useCallback(async (ghUser, lcUser) => {
    const github = ghUser !== undefined ? ghUser : githubInput;
    const leetcode = lcUser !== undefined ? lcUser : leetcodeInput;

    if (!github.trim() && !leetcode.trim()) {
      setError('Please enter at least one username.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/devpulse/profile?github=${encodeURIComponent(github)}&leetcode=${encodeURIComponent(leetcode)}`
      );

      if (response.data && response.data.success) {
        setData(response.data.data);
      } else if (response.data && (response.data.github || response.data.leetcode)) {
        setData(response.data);
      } else {
        setError('No user data returned from server.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to fetch profile stats. Make sure backend service is active.'
      );
    } finally {
      setLoading(false);
    }
  }, [githubInput, leetcodeInput]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const github = params.get('github');
    const leetcode = params.get('leetcode');

    if (github || leetcode) {
      if (github) setGithubInput(github);
      if (leetcode) setLeetcodeInput(leetcode);
      fetchDevPulseData(github || '', leetcode || '');
    }
  }, [fetchDevPulseData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      fetchDevPulseData();
    }
  };

  const badgeUrl = data
    ? `${API_BASE_URL}/api/v1/devpulse/badge?github=${encodeURIComponent(githubInput || '')}&leetcode=${encodeURIComponent(leetcodeInput || '')}&ghScore=${data?.githubScore || 0}&lcScore=${data?.leetcodeScore || 0}&score=${data?.devScore || 0}`
    : '';

  const markdownSnippet = `![DevPulse Stats](${badgeUrl})`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/?github=${encodeURIComponent(githubInput)}&leetcode=${encodeURIComponent(leetcodeInput)}`;
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  axios.defaults.withCredentials = true;

  const handleUpdateAvatar = async (file) => {
    if (!file || !user) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/auth/update-avatar`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        alert('Session expired. Please login again.');
      }
    }
  };

  const getGithubAvatar = () => {
    const github = data?.github;
    if (!github) return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

    if (github.avatarUrl && github.avatarUrl.includes('proxy-avatar?url=')) {
      try {
        const rawUrl = new URL(github.avatarUrl).searchParams.get('url');
        if (rawUrl) return decodeURIComponent(rawUrl);
      } catch (e) {
        console.warn('Failed to parse proxy URL', e);
      }
    }

    if (github.avatarUrl) return github.avatarUrl;
    if (github.avatar_url) return github.avatar_url;

    const username = github.username || github.login;
    if (username) {
      return `https://avatars.githubusercontent.com/${username}`;
    }

    return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  };

  const getLeetcodeAvatar = () => {
    const leetcode = data?.leetcode;
    const username = leetcode?.username;

    if (leetcode?.avatarUrl && typeof leetcode.avatarUrl === 'string' && leetcode.avatarUrl.startsWith('http')) {
      return leetcode.avatarUrl;
    }
    if (leetcode?.avatar && typeof leetcode.avatar === 'string' && leetcode.avatar.startsWith('http')) {
      return leetcode.avatar;
    }

    if (username) {
      return `https://unavatar.io/leetcode/${username}`;
    }

    return `https://unavatar.io/leetcode/${leetcodeInput || 'leetcode'}`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100 pt-16 px-4 sm:px-8 pb-8 flex flex-col items-center font-sans relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <DashboardHeader />

      <ProfileSearchForm
        githubInput={githubInput}
        setGithubInput={setGithubInput}
        leetcodeInput={leetcodeInput}
        setLeetcodeInput={setLeetcodeInput}
        error={error}
        isFormValid={isFormValid}
        loading={loading}
        handleFormSubmit={handleFormSubmit}
      />

      {data && (
        <div className="w-full max-w-4xl flex flex-col gap-8 relative z-10 mb-12">
          <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 backdrop-blur-md px-6 py-4 rounded-2xl">
            <span className="text-sm text-slate-400 font-medium">Live Dashboard Preview</span>
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {linkCopied ? 'Link Copied!' : 'Share Profile Link'}
            </button>
          </div>

          <div className={`w-full grid gap-6 ${data.github && data.leetcode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
            {data.github && (
              <GithubCard
                data={data}
                githubInput={githubInput}
                getGithubAvatar={getGithubAvatar}
                setPreviewImage={setPreviewImage}
                COLORS={COLORS}
              />
            )}

            {data.leetcode && (
              <LeetcodeCard
                data={data}
                leetcodeInput={leetcodeInput}
                getLeetcodeAvatar={getLeetcodeAvatar}
                setPreviewImage={setPreviewImage}
              />
            )}
          </div>

          <ScoreCards
            data={data}
            user={user}
            savedProfiles={savedProfiles}
            setIsAuthOpen={setIsAuthModalOpen}
            handleToggleBookmark={handleToggleBookmark}
          />

          <BadgeSection
            markdownSnippet={markdownSnippet}
            copyToClipboard={copyToClipboard}
            copied={copied}
            badgeUrl={badgeUrl}
          />
        </div>
      )}

      <ImagePreviewModal
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}