import React, { useEffect, useMemo, useRef, useState, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';

const Icon = ({ name, className }) => {
    const classes = ['icon', className].filter(Boolean).join(' ');
    switch (name) {
        case 'play':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.25 6.75v10.5a.75.75 0 0 0 1.128.65l8.25-5.25a.75.75 0 0 0 0-1.3l-8.25-5.25a.75.75 0 0 0-1.128.65Z" fill="currentColor" />
                </svg>
            );
        case 'pause':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" />
                    <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" />
                </svg>
            );
        case 'rewind15':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 6 6 12l5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 6l-5 6 5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">15</text>
                </svg>
            );
        case 'rewind5':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 6 6 12l5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 6l-5 6 5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">5</text>
                </svg>
            );
        case 'forward15':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">15</text>
                </svg>
            );
        case 'forward5':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">5</text>
                </svg>
            );
        case 'volume':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.25 5.653a1.125 1.125 0 0 1 1.913.796v11.102a1.125 1.125 0 0 1-1.913.796l-3.26-3.26H5.25A2.25 2.25 0 0 1 3 12.837v-1.674A2.25 2.25 0 0 1 5.25 8.913h2.74l3.26-3.26Z" fill="currentColor" />
                    <path d="M16.5 9.75a3.75 3.75 0 0 1 0 4.5M18.75 7.5a7.125 7.125 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'mute':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.25 5.653a1.125 1.125 0 0 1 1.913.796v11.102a1.125 1.125 0 0 1-1.913.796l-3.26-3.26H5.25A2.25 2.25 0 0 1 3 12.837v-1.674A2.25 2.25 0 0 1 5.25 8.913h2.74l3.26-3.26Z" fill="currentColor" />
                    <path d="m16.5 9 4.5 6m0-6-4.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'pip':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="12" y="10" width="6.5" height="4.5" rx="1" fill="currentColor" />
                </svg>
            );
        case 'fullscreen':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 4H4v4m12-4h4v4m0 12h-4v-4M4 20h4v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'episodes':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="4" y="5" width="3" height="3" rx="0.75" fill="currentColor" />
                    <rect x="4" y="10.5" width="3" height="3" rx="0.75" fill="currentColor" />
                    <rect x="4" y="16" width="3" height="3" rx="0.75" fill="currentColor" />
                    <path d="M10 6.5h10M10 12h10M10 17.5h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case 'sources':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="6.25" cy="12" r="2.75" fill="currentColor" />
                    <circle cx="17.75" cy="6.75" r="2.75" fill="currentColor" />
                    <circle cx="17.75" cy="17.25" r="2.75" fill="currentColor" />
                    <path d="m8.7 10.9 6.6-2.9m-6.6 5.2 6.6 2.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'theater':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="4.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M6.5 8.25h11v5.5h-11z" fill="currentColor" />
                </svg>
            );
        case 'close':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            );
        default:
            return null;
    }
};

const formatTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const pickQualityLabel = (download) => {
    const parts = [];
    if (download.quality) parts.push(download.quality);
    if (download.format) parts.push(download.format.toUpperCase());
    if (download.language) parts.push(download.language.toUpperCase());
    return parts.join(' · ') || download.label || 'Download';
};

const getPlayUrl = (download) => download?.stream_url || download?.url || '';
const isHlsSource = (url) => /\.m3u8(\?|#|$)/i.test(url || '');

const getResumeKey = (mediaId, episodeId) => {
    if (!mediaId) return null;
    return episodeId ? `f2m:resume:${mediaId}:${episodeId}` : `f2m:resume:${mediaId}`;
};

const AuthContext = createContext(null);

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const MOBILE_SEEK_SECONDS = 15;
const DESKTOP_SEEK_SECONDS = 5;

const apiFetch = (url, options = {}, token) => {
    const fullUrl = API_BASE && url.startsWith('/') ? `${API_BASE}${url}` : url;
    const headers = { ...(options.headers || {}) };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const requestOptions = {
        ...options,
        headers,
    };
    if (!requestOptions.cache) {
        requestOptions.cache = 'no-store';
    }
    return fetch(fullUrl, requestOptions);
};

const apiFetchForm = (url, formData, token) => {
    const fullUrl = API_BASE && url.startsWith('/') ? `${API_BASE}${url}` : url;
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return fetch(fullUrl, {
        method: 'POST',
        headers,
        body: formData,
    });
};

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('f2m:token') || '');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }
        apiFetch('/api/auth/user', {}, token)
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setUser(data?.user || null))
            .catch(() => setUser(null));
    }, [token]);

    const login = async (payload) => {
        const res = await apiFetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error('Login failed');
        }
        const data = await res.json();
        const nextToken = data?.token || '';
        localStorage.setItem('f2m:token', nextToken);
        setToken(nextToken);
        setUser(data?.user || null);
    };

    const register = async (payload) => {
        const res = await apiFetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error('Register failed');
        }
        const data = await res.json();
        const nextToken = data?.token || '';
        localStorage.setItem('f2m:token', nextToken);
        setToken(nextToken);
        setUser(data?.user || null);
    };

    const logout = async () => {
        if (token) {
            apiFetch('/api/auth/logout', { method: 'POST' }, token).catch(() => {});
        }
        localStorage.removeItem('f2m:token');
        sessionStorage.removeItem('f2m:token');
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

const formatSeconds = (seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0m';
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

const qualityRank = (value) => {
    if (!value) return 0;
    const lowered = String(value).toLowerCase();
    if (lowered.includes('4k')) return 2160;
    const match = lowered.match(/(2160|1440|1080|720|480|360)/);
    return match ? Number(match[1]) : 0;
};

const getLanguageKey = (download) => download?.language || 'other';

const languageLabel = (key) => {
    if (key === 'dub') return 'Dub';
    if (key === 'sub') return 'Sub';
    if (key === 'original') return 'Original';
    return 'Other';
};

const sortDownloads = (downloads) => {
    const rank = (quality) => {
        if (!quality) return 0;
        if (quality.includes('2160')) return 6;
        if (quality.includes('1440')) return 5;
        if (quality.includes('1080')) return 4;
        if (quality.includes('720')) return 3;
        if (quality.includes('480')) return 2;
        if (quality.includes('360')) return 1;
        return 0;
    };

    return [...downloads].sort((a, b) => rank(b.quality) - rank(a.quality));
};

const Player = ({
    title,
    mediaId,
    episodeId,
    token,
    downloads,
    onEnded,
    autoPlayNext,
    onToggleAutoplay,
    showAutoplay,
    episodes,
    currentEpisodeIndex,
    onSelectEpisode,
    onTheaterChange,
    episodeProgressMap,
}) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [current, setCurrent] = useState(downloads[0] || null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [theater, setTheater] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState(null);
    const [subtitleOpen, setSubtitleOpen] = useState(false);
    const [bufferedPercent, setBufferedPercent] = useState(0);
    const [autoQuality, setAutoQuality] = useState(true);
    const [activeLanguage, setActiveLanguage] = useState('other');
    const [qualityOpen, setQualityOpen] = useState(false);
    const [openSeason, setOpenSeason] = useState(null);
    const hideTimerRef = useRef(null);
    const autoSwitchRef = useRef(0);
    const resumeTimeRef = useRef(null);
    const activeEpisodeRef = useRef(null);
    const drawerRef = useRef(null);
    const lastSaveRef = useRef(0);
    const lastPositionRef = useRef(0);
    const lastTapRef = useRef(0);
    const episodeChangedRef = useRef(false);
    const appliedSourceRef = useRef('');
    const qualitySwitchMetaRef = useRef(null);
    const qualitySwitchingRef = useRef(false);
    const stalledRef = useRef(false);

    const getFullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

    const enterFullscreen = async (element) => {
        if (!element) return false;
        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
                return true;
            }
            if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    };

    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                return true;
            }
            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    };

    const isSubtitleLink = (download) => {
        if (!download?.url) return false;
        const url = download.url.toLowerCase();
        return /\.(vtt|srt|ass|ssa)(\?|#|$)/.test(url);
    };

    const playableDownloads = useMemo(
        () => downloads.filter((item) => !isSubtitleLink(item)),
        [downloads]
    );
    const subtitleDownloads = useMemo(
        () => downloads.filter((item) => isSubtitleLink(item)),
        [downloads]
    );

    useEffect(() => {
        if (!playableDownloads.length) {
            setCurrent(null);
            return;
        }
        if (!current || !playableDownloads.find((item) => item.url === current.url)) {
            setCurrent(playableDownloads[0]);
        }
    }, [playableDownloads]);

    useEffect(() => {
        if (!subtitleDownloads.length) {
            setActiveSubtitle(null);
            return;
        }
        const preferred = subtitleDownloads.find((item) => /\.vtt(\?|#|$)/.test(item.url.toLowerCase()));
        setActiveSubtitle(preferred || null);
    }, [subtitleDownloads]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = volume;
        video.muted = muted;
    }, [volume, muted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        const key = getResumeKey(mediaId, episodeId);
        if (!key || !mediaId) return;
        const saved = Number(localStorage.getItem(key) || 0);
        if (Number.isFinite(saved) && saved > 0) {
            resumeTimeRef.current = saved;
        }
        const params = new URLSearchParams();
        params.set('media_id', String(mediaId));
        if (episodeId) params.set('episode_id', String(episodeId));
        apiFetch(`/api/progress?${params.toString()}`, {}, token)
            .then((res) => res.json())
            .then((data) => {
                const seconds = Number(data?.seconds || 0);
                if (Number.isFinite(seconds) && seconds > 0) {
                    resumeTimeRef.current = seconds;
                    if (videoRef.current) {
                        videoRef.current.currentTime = seconds;
                    }
                }
            })
            .catch(() => {});
    }, [mediaId, episodeId, token]);

    useEffect(() => {
        episodeChangedRef.current = true;
        setTime(0);
        setDuration(0);
        setBufferedPercent(0);
        lastPositionRef.current = 0;
    }, [episodeId]);

    useEffect(() => {
        const handleFullscreenChange = async () => {
            if (!getFullscreenElement() && screen.orientation?.unlock) {
                try {
                    await screen.orientation.unlock();
                } catch {
                    // ignore
                }
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        if (!current) return;
        setActiveLanguage(getLanguageKey(current));
    }, [current]);

    useEffect(() => {
        onTheaterChange?.(theater);
    }, [theater, onTheaterChange]);

    const handleKeyDown = (event) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
        if (event.code === 'Space') {
            event.preventDefault();
            togglePlay();
        }
        if (event.key === 'm') setMuted((value) => !value);
        if (event.key === 'f') toggleFullscreen();
        if (event.key === 't') setTheater((value) => !value);
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            seekBy(DESKTOP_SEEK_SECONDS);
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            seekBy(-DESKTOP_SEEK_SECONDS);
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setVolume((value) => Math.min(1, value + 0.05));
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setVolume((value) => Math.max(0, value - 0.05));
        }
    };

    const requestImmersiveMode = async () => {
        const container = containerRef.current;
        const video = videoRef.current;
        if (!container || getFullscreenElement()) return;
        const entered = await enterFullscreen(container);

        if (!entered && video?.webkitEnterFullscreen) {
            try {
                video.webkitEnterFullscreen();
            } catch {
                // ignore
            }
        }

        if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches && screen.orientation?.lock) {
            try {
                await screen.orientation.lock('landscape');
            } catch {
                // ignore
            }
        }
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setPlaying(true);
            pulseOverlay();
            requestImmersiveMode();
        } else {
            video.pause();
            setPlaying(false);
            pulseOverlay();
        }
    };

    const pulseOverlay = () => {
        setShowOverlay(true);
        window.setTimeout(() => setShowOverlay(false), 200);
    };

    const seekTo = (value) => {
        const video = videoRef.current;
        if (!video) return;
        const next = Math.min(duration, Math.max(0, value));
        video.currentTime = next;
        setTime(next);
    };

    const seekBy = (delta) => {
        seekTo(time + delta);
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        const video = videoRef.current;
        if (!container) return;
        if (getFullscreenElement()) {
            await exitFullscreen();
            return;
        }

        const entered = await enterFullscreen(container);
        if (!entered && video?.webkitEnterFullscreen) {
            try {
                video.webkitEnterFullscreen();
            } catch {
                // ignore
            }
        }

        if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches && screen.orientation?.lock) {
            try {
                await screen.orientation.lock('landscape');
            } catch {
                // ignore
            }
        }
    };

    const togglePip = async () => {
        const video = videoRef.current;
        if (!video || !document.pictureInPictureEnabled) return;
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await video.requestPictureInPicture();
        }
    };

    const onTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        setTime(video.currentTime);
        const now = Date.now();
        if (now - lastSaveRef.current < 2000) return;
        lastSaveRef.current = now;
        const key = getResumeKey(mediaId, episodeId);
        if (!key) return;
        if (video.currentTime > 5 && Number.isFinite(video.duration) && video.duration > 0) {
            localStorage.setItem(key, String(video.currentTime));
            const delta = Math.max(0, video.currentTime - (lastPositionRef.current || 0));
            const watchedDelta = delta > 0 && delta <= 12 ? delta : 0;
            lastPositionRef.current = video.currentTime;
            apiFetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    media_id: mediaId,
                    episode_id: episodeId ?? null,
                    seconds: video.currentTime,
                    duration_seconds: video.duration || 0,
                    watched_delta: watchedDelta,
                }),
            }, token).catch(() => {});
        }
    };

    const onProgress = () => {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration) || video.duration === 0) {
            setBufferedPercent(0);
            return;
        }
        try {
            const buffered = video.buffered;
            if (!buffered || buffered.length === 0) {
                setBufferedPercent(0);
                return;
            }
            const end = buffered.end(buffered.length - 1);
            const percent = Math.min(100, (end / video.duration) * 100);
            setBufferedPercent(percent);
        } catch {
            setBufferedPercent(0);
        }
    };

    const onLoaded = () => {
        const video = videoRef.current;
        if (!video) return;
        setDuration(video.duration || 0);
        if (resumeTimeRef.current !== null) {
            const nextTime = Math.min(video.duration || resumeTimeRef.current, resumeTimeRef.current);
            video.currentTime = Math.max(0, nextTime);
            resumeTimeRef.current = null;
        }
        lastPositionRef.current = video.currentTime || 0;
    };

    const onEndedInternal = () => {
        setPlaying(false);
        const key = getResumeKey(mediaId, episodeId);
        if (key) {
            localStorage.removeItem(key);
        }
        if (mediaId) {
            apiFetch('/api/progress', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    media_id: mediaId,
                    episode_id: episodeId ?? null,
                }),
            }, token).catch(() => {});
        }
        onEnded?.();
    };

    const progress = duration ? (time / duration) * 100 : 0;
    const sortedDownloads = useMemo(() => sortDownloads(playableDownloads), [playableDownloads]);
    const currentEntry = episodes?.[currentEpisodeIndex] || null;
    const pad2 = (value) => String(value || 0).padStart(2, '0');
    const episodeLabel = currentEntry
        ? ` (S${pad2(currentEntry.seasonNumber)}E${pad2(currentEntry.episode?.number || currentEntry.index + 1)})`
        : '';

    const languageOptions = useMemo(() => {
        const options = new Map();
        playableDownloads.forEach((item) => {
            options.set(getLanguageKey(item), true);
        });
        return Array.from(options.keys());
    }, [playableDownloads]);

    const downloadsForLanguage = useMemo(() => {
        return playableDownloads
            .filter((item) => getLanguageKey(item) === activeLanguage)
            .sort((a, b) => qualityRank(b.quality) - qualityRank(a.quality));
    }, [playableDownloads, activeLanguage]);

    const episodesBySeason = useMemo(() => {
        const map = new Map();
        episodes?.forEach((entry, index) => {
            const key = entry.seasonNumber || 1;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push({ ...entry, index });
        });
        return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    }, [episodes]);

    const currentSeasonNumber = episodes?.[currentEpisodeIndex]?.seasonNumber || 1;

    const getEpisodeProgress = (episodeId) => {
        if (!episodeId || !episodeProgressMap) return { percent: 0, seconds: 0 };
        return episodeProgressMap[episodeId] || { percent: 0, seconds: 0 };
    };


    useEffect(() => {
        if (currentSeasonNumber) {
            setOpenSeason(currentSeasonNumber);
        }
    }, [currentSeasonNumber]);

    const preloadSource = (url) => new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }
        const probe = document.createElement('video');
        probe.preload = 'auto';
        probe.src = url;
        let done = false;
        const finalize = (result) => {
            if (done) return;
            done = true;
            probe.removeAttribute('src');
            probe.load();
            resolve(result);
        };
        const timeout = window.setTimeout(() => finalize(false), 1800);
        probe.addEventListener('canplay', () => {
            window.clearTimeout(timeout);
            finalize(true);
        }, { once: true });
        probe.addEventListener('error', () => {
            window.clearTimeout(timeout);
            finalize(false);
        }, { once: true });
        probe.load();
    });

    const setQuality = async (download, options = {}) => {
        if (!download) return;
        const { smooth = false } = options;
        const nextUrl = getPlayUrl(download);
        const currentUrl = getPlayUrl(current);
        if (nextUrl && currentUrl && nextUrl === currentUrl) return;

        const video = videoRef.current;
        if (!video || episodeChangedRef.current) {
            qualitySwitchMetaRef.current = null;
            setCurrent(download);
            return;
        }

        const snapshot = {
            time: video.currentTime || 0,
            wasPlaying: !video.paused,
            playbackRate,
        };

        if (smooth && snapshot.wasPlaying && !isHlsSource(nextUrl)) {
            if (qualitySwitchingRef.current) return;
            qualitySwitchingRef.current = true;
            await preloadSource(nextUrl);
        }

        qualitySwitchMetaRef.current = snapshot;
        setCurrent(download);
    };

    useEffect(() => {
        if (!downloadsForLanguage.length) return;
        if (current && getLanguageKey(current) === activeLanguage) return;
        setQuality(downloadsForLanguage[0]);
    }, [downloadsForLanguage, activeLanguage]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !current) return;
        const sourceUrl = getPlayUrl(current);
        if (!sourceUrl || appliedSourceRef.current === sourceUrl) return;

        const switchMeta = qualitySwitchMetaRef.current;
        if (episodeChangedRef.current) {
            resumeTimeRef.current = 0;
        } else if (switchMeta && Number.isFinite(switchMeta.time)) {
            resumeTimeRef.current = switchMeta.time;
        }
        appliedSourceRef.current = sourceUrl;
        episodeChangedRef.current = false;

        const playNext = async () => {
            const shouldPlay = switchMeta?.wasPlaying ?? !video.paused;
            try {
                video.src = sourceUrl;
                video.load();
                video.playbackRate = switchMeta?.playbackRate || playbackRate;
                if (shouldPlay) {
                    await video.play();
                    setPlaying(true);
                } else {
                    setPlaying(false);
                }
            } catch (error) {
                setPlaying(false);
            } finally {
                qualitySwitchMetaRef.current = null;
                qualitySwitchingRef.current = false;
            }
        };
        playNext();
    }, [current, playbackRate]);

    useEffect(() => {
        const handleOrientation = () => {
            if (!window.matchMedia || !window.matchMedia('(max-width: 720px)').matches) return;
            const isLandscape = window.matchMedia('(orientation: landscape)').matches;
            if (isLandscape && containerRef.current && !getFullscreenElement()) {
                enterFullscreen(containerRef.current);
            }
        };
        window.addEventListener('orientationchange', handleOrientation);
        return () => window.removeEventListener('orientationchange', handleOrientation);
    }, []);

    useEffect(() => {
        if (!drawerOpen || !activeEpisodeRef.current) return;
        const node = activeEpisodeRef.current;
        requestAnimationFrame(() => {
            node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
    }, [drawerOpen, currentEpisodeIndex, openSeason]);

    useEffect(() => {
        if (!autoQuality || !downloadsForLanguage.length || !current) return;
        const now = Date.now();
        if (now - autoSwitchRef.current < 9000) return;
        const video = videoRef.current;
        if (!video || video.paused || qualitySwitchingRef.current || isHlsSource(getPlayUrl(current))) return;
        const buffered = video.buffered;
        if (!buffered || buffered.length === 0) return;
        const bufferEnd = buffered.end(buffered.length - 1);
        const bufferAhead = bufferEnd - video.currentTime;

        const currentIndex = downloadsForLanguage.findIndex((item) => item.url === current.url);
        if (currentIndex < 0) return;

        if (bufferAhead < 2 && currentIndex < downloadsForLanguage.length - 1 && (loading || stalledRef.current)) {
            autoSwitchRef.current = now;
            setQuality(downloadsForLanguage[currentIndex + 1], { smooth: true });
        } else if (bufferAhead > 30 && currentIndex > 0 && !loading && !stalledRef.current) {
            autoSwitchRef.current = now;
            setQuality(downloadsForLanguage[currentIndex - 1], { smooth: true });
        }
    }, [autoQuality, downloadsForLanguage, current, time, loading]);

    const showControls = (forceHide = false) => {
        setControlsVisible(true);
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
        }
        if (playing || forceHide) {
            hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2200);
        }
    };

    const hideControlsSoon = () => {
        if (!playing) return;
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
        }
        hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 800);
    };

    return (
        <div className={`player-shell ${theater ? 'theater' : ''}`}>
            <div
                className="video-stage"
                ref={containerRef}
                onMouseMove={showControls}
                onMouseLeave={hideControlsSoon}
                onKeyDown={handleKeyDown}
                onDoubleClick={() => toggleFullscreen()}
                onTouchEnd={() => {
                    const now = Date.now();
                    if (now - lastTapRef.current < 280) {
                        lastTapRef.current = 0;
                        toggleFullscreen();
                        return;
                    }
                    lastTapRef.current = now;
                }}
                tabIndex={0}
            >
                {current ? (
                    <video
                        ref={videoRef}
                        crossOrigin="anonymous"
                        onTimeUpdate={onTimeUpdate}
                        onProgress={onProgress}
                        onLoadedMetadata={onLoaded}
                        onLoadStart={() => setLoading(true)}
                        onWaiting={() => { setLoading(true); stalledRef.current = true; }}
                        onCanPlay={() => { setLoading(false); stalledRef.current = false; }}
                        onCanPlayThrough={() => { setLoading(false); stalledRef.current = false; }}
                        onLoadedData={() => setLoading(false)}
                        onPlaying={() => { setLoading(false); stalledRef.current = false; }}
                        onError={() => setLoading(false)}
                        onEnded={onEndedInternal}
                        onPlay={() => {
                            setPlaying(true);
                            showControls(true);
                            requestImmersiveMode();
                        }}
                        onPause={() => {
                            setPlaying(false);
                            setControlsVisible(true);
                        }}
                        onClick={() => {
                            if (!controlsVisible) {
                                showControls(true);
                                return;
                            }
                            togglePlay();
                        }}
                        controls={false}
                        playsInline
                        preload="metadata"
                    >
                        {activeSubtitle && /\.vtt(\?|#|$)/.test(activeSubtitle.url.toLowerCase()) && (
                            <track
                                key={activeSubtitle.url}
                                src={getPlayUrl(activeSubtitle)}
                                kind="subtitles"
                                srcLang="fa"
                                label="Subtitles"
                                default
                            />
                        )}
                    </video>
                ) : (
                    <div className="player-empty">
                        No playable links found for this title.
                    </div>
                )}
                <div className={`player-overlay ${showOverlay ? 'show' : ''}`}>
                    <Icon name={playing ? 'pause' : 'play'} className="overlay-icon" />
                </div>
                <div className={`player-center-controls ${controlsVisible ? 'show' : ''}`} onClick={(event) => event.stopPropagation()}>
                    <button
                        className="icon-btn seek-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            seekBy(-MOBILE_SEEK_SECONDS);
                        }}
                        aria-label="Back 15 seconds"
                        title="Back 15 seconds"
                    >
                        <Icon name="rewind15" />
                    </button>
                    <button
                        className="icon-btn primary large"
                        onClick={(event) => {
                            event.stopPropagation();
                            togglePlay();
                        }}
                        aria-label={playing ? 'Pause' : 'Play'}
                        title={playing ? 'Pause' : 'Play'}
                    >
                        {loading ? <div className="loader-spinner compact" /> : <Icon name={playing ? 'pause' : 'play'} />}
                    </button>
                    <button
                        className="icon-btn seek-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            seekBy(MOBILE_SEEK_SECONDS);
                        }}
                        aria-label="Forward 15 seconds"
                        title="Forward 15 seconds"
                    >
                        <Icon name="forward15" />
                    </button>
                </div>
                <div className={`player-hud ${controlsVisible ? 'show' : ''}`} onClick={(event) => event.stopPropagation()}>
                    <div className="player-topbar">
                        <div className="player-title">{title || 'Now Playing'}{episodeLabel}</div>
                        <div className="player-actions">
                            {episodes?.length > 0 && (
                                <button
                                    className="ghost-btn icon-btn"
                                    onClick={() => {
                                        setDrawerOpen((value) => !value);
                                        setControlsVisible(true);
                                    }}
                                    aria-label="Episodes"
                                    title="Episodes"
                                >
                                    <Icon name="episodes" />
                                </button>
                            )}
                            <button
                                className="ghost-btn icon-btn"
                                onClick={() => {
                                    setDrawerOpen((value) => !value);
                                    setControlsVisible(true);
                                }}
                                aria-label="Sources"
                                title="Sources"
                            >
                                <Icon name="sources" />
                            </button>
                            <button
                                className="ghost-btn icon-btn"
                                onClick={() => setTheater((value) => !value)}
                                aria-label={theater ? 'Standard mode' : 'Theater mode'}
                                title={theater ? 'Standard mode' : 'Theater mode'}
                            >
                                <Icon name="theater" />
                            </button>
                            {showAutoplay && (
                                <label className="toggle ghost-toggle">
                                    <input
                                        type="checkbox"
                                        checked={autoPlayNext}
                                        onChange={(event) => onToggleAutoplay(event.target.checked)}
                                    />
                                    Auto next
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="player-bottom">
                        <div
                            className="progress"
                            onClick={(event) => {
                                event.stopPropagation();
                                const rect = event.currentTarget.getBoundingClientRect();
                                const ratio = (event.clientX - rect.left) / rect.width;
                                seekTo(ratio * duration);
                            }}
                        >
                            <div className="progress-buffer" style={{ width: `${bufferedPercent}%` }} />
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="control-row">
                            <div className="control-group primary-controls">
                                <button
                                    className="btn icon-btn primary"
                                    onClick={togglePlay}
                                    aria-label={playing ? 'Pause' : 'Play'}
                                    title={playing ? 'Pause' : 'Play'}
                                >
                                    <Icon name={playing ? 'pause' : 'play'} />
                                </button>
                                <button
                                    className="btn icon-btn seek-btn"
                                    onClick={() => seekBy(-DESKTOP_SEEK_SECONDS)}
                                    aria-label="Back 5 seconds"
                                    title="Back 5 seconds"
                                >
                                    <Icon name="rewind5" />
                                </button>
                                <button
                                    className="btn icon-btn seek-btn"
                                    onClick={() => seekBy(DESKTOP_SEEK_SECONDS)}
                                    aria-label="Forward 5 seconds"
                                    title="Forward 5 seconds"
                                >
                                    <Icon name="forward5" />
                                </button>
                                <span className="notice">{formatTime(time)} / {formatTime(duration)}</span>
                            </div>

                            <div className="control-group secondary-controls">
                                <div className="volume-control">
                                    <button
                                        className="btn icon-btn"
                                        onClick={() => setMuted((value) => !value)}
                                        aria-label={muted ? 'Unmute' : 'Mute'}
                                        title={muted ? 'Unmute' : 'Mute'}
                                    >
                                        <Icon name={muted ? 'mute' : 'volume'} />
                                    </button>
                                    <div className="volume-popover">
                                        <input
                                            className="range"
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(event) => setVolume(Number(event.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className={`quality-control ${qualityOpen ? 'open' : ''}`}>
                                    <button
                                        className="btn icon-btn quality-btn"
                                        onClick={() => setQualityOpen((value) => !value)}
                                        aria-label="Quality"
                                        title="Quality"
                                    >
                                        <span className="quality-label">
                                            {autoQuality ? 'Auto' : (current?.quality || '—')}
                                            {activeLanguage && activeLanguage !== 'other' && (
                                                <span className="quality-lang"> · {languageLabel(activeLanguage)}</span>
                                            )}
                                        </span>
                                    </button>
                                    <div className="quality-popover">
                                        <div className="subtitle-header">Quality</div>
                                        <div className="pill-group">
                                            <button
                                                className={`pill ${autoQuality ? 'active' : ''}`}
                                                onClick={() => {
                                                    setAutoQuality(true);
                                                    setQualityOpen(false);
                                                }}
                                            >
                                                Auto
                                            </button>
                                            {downloadsForLanguage.map((download) => (
                                                <button
                                                    key={download.id || download.url}
                                                    className={`pill ${!autoQuality && current?.url === download.url ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setAutoQuality(false);
                                                        setQuality(download, { smooth: false });
                                                        setQualityOpen(false);
                                                    }}
                                                >
                                                    {pickQualityLabel(download)}
                                                </button>
                                            ))}
                                        </div>
                                        {languageOptions.length > 1 && (
                                            <div className="pill-group">
                                                {languageOptions.map((lang) => (
                                                    <button
                                                        key={lang}
                                                        className={`pill ${activeLanguage === lang ? 'active' : ''}`}
                                                        onClick={() => setActiveLanguage(lang)}
                                                    >
                                                        {languageLabel(lang)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <select className="btn" value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}>
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                        <option key={rate} value={rate}>{rate}x</option>
                                    ))}
                                </select>
                                <div className={`subtitle-control ${subtitleOpen ? 'open' : ''}`}>
                                    <button
                                        className="btn icon-btn"
                                        onClick={() => setSubtitleOpen((value) => !value)}
                                        aria-label="Subtitles"
                                        title="Subtitles"
                                    >
                                        <Icon name="sources" />
                                    </button>
                                    <div className="subtitle-popover">
                                        <div className="subtitle-header">Subtitles</div>
                                        {subtitleDownloads.length === 0 && (
                                            <div className="notice">No subtitles detected.</div>
                                        )}
                                        {subtitleDownloads.map((download) => (
                                            <button
                                                key={download.url}
                                                className={`pill ${activeSubtitle?.url === download.url ? 'active' : ''}`}
                                                onClick={() => setActiveSubtitle(download)}
                                            >
                                                {pickQualityLabel(download)}
                                            </button>
                                        ))}
                                        {subtitleDownloads.length > 0 && !subtitleDownloads.some((download) => /\.vtt(\?|#|$)/.test(download.url.toLowerCase())) && (
                                            <div className="notice">SRT/ASS subtitles need conversion to VTT for browser playback.</div>
                                        )}
                                    </div>
                                </div>
                                <button className="btn icon-btn pip-btn" onClick={togglePip} aria-label="Picture in picture" title="Picture in picture">
                                    <Icon name="pip" />
                                </button>
                                <button className="btn icon-btn fullscreen-btn" onClick={toggleFullscreen} aria-label="Fullscreen" title="Fullscreen">
                                    <Icon name="fullscreen" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {drawerOpen && (
                    <div
                        className="player-backdrop"
                        onClick={() => setDrawerOpen(false)}
                        role="presentation"
                    />
                )}
                <div className={`player-drawer ${drawerOpen ? 'open' : ''}`} ref={drawerRef}>
                    <div className="drawer-header">
                        <div className="drawer-title">Player Menu</div>
                        <button
                            className="icon-btn subtle"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close panel"
                            title="Close"
                        >
                            <Icon name="close" />
                        </button>
                    </div>
                    {episodes?.length > 0 && (
                        <div className="drawer-section">
                            <div className="drawer-title">Episodes</div>
                            {episodesBySeason.map(([seasonNumber, items]) => (
                                <div key={`season-${seasonNumber}`} className="season-block">
                                    <button
                                        className={`season-title ${openSeason === seasonNumber ? 'open' : ''}`}
                                        onClick={() => setOpenSeason(seasonNumber)}
                                    >
                                        Season {seasonNumber}
                                    </button>
                                    {openSeason === seasonNumber && (
                                        <div className="episode-list compact">
                                            {items.map((entry) => (
                                                <div
                                                    key={`${entry.seasonNumber}-${entry.episode.id}`}
                                                    ref={entry.index === currentEpisodeIndex ? activeEpisodeRef : null}
                                                    className={`episode-item ${entry.index === currentEpisodeIndex ? 'active' : ''}`}
                                                    onClick={() => {
                                                        onSelectEpisode?.(entry.index);
                                                        setDrawerOpen(false);
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 600 }}>{entry.episode.title || `Episode ${entry.episode.number || entry.index + 1}`}</div>
                                                    <div className="notice">Episode {entry.episode.number || entry.index + 1}</div>
                                                    <div className="episode-progress-track">
                                                        <div
                                                            className="episode-progress-fill"
                                                            style={{ width: `${getEpisodeProgress(entry.episode.id).percent}%` }}
                                                        />
                                                    </div>
                                                    <div className="notice">{Math.round(getEpisodeProgress(entry.episode.id).percent)}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="drawer-section">
                        <div className="drawer-title">Sources</div>
                        {languageOptions.length > 1 && (
                            <div className="pill-group">
                                {languageOptions.map((lang) => (
                                    <button
                                        key={lang}
                                        className={`pill ${activeLanguage === lang ? 'active' : ''}`}
                                        onClick={() => setActiveLanguage(lang)}
                                    >
                                        {languageLabel(lang)}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="pill-group">
                            <button
                                className={`pill ${autoQuality ? 'active' : ''}`}
                                onClick={() => setAutoQuality(true)}
                            >
                                Auto
                            </button>
                            {downloadsForLanguage.map((download) => (
                                <button
                                    key={download.id || download.url}
                                    className={`pill ${!autoQuality && current?.url === download.url ? 'active' : ''}`}
                                    onClick={() => {
                                        setAutoQuality(false);
                                        setQuality(download, { smooth: false });
                                    }}
                                >
                                    {pickQualityLabel(download)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {subtitleDownloads.length > 0 && (
                        <div className="drawer-section">
                            <div className="drawer-title">Subtitles</div>
                            <div className="pill-group">
                                {subtitleDownloads.map((download) => (
                                    <button
                                        key={download.id || download.url}
                                        className={`pill ${activeSubtitle?.url === download.url ? 'active' : ''}`}
                                        onClick={() => setActiveSubtitle(download)}
                                    >
                                        {pickQualityLabel(download)}
                                    </button>
                                ))}
                            </div>
                            {!subtitleDownloads.some((download) => /\.vtt(\?|#|$)/.test(download.url.toLowerCase())) && (
                                <div className="notice">SRT/ASS subtitles need conversion to VTT for browser playback.</div>
                            )}
                        </div>
                    )}

                    {current?.format === 'mkv' && (
                        <div className="notice">Browser support for MKV is limited. If playback fails, switch to MP4.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RequireAuth = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const RequireAdmin = ({ children }) => {
    const { user } = useAuth();
    if (!user?.is_admin) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Login failed.');
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-title">Welcome back</div>
                <div className="notice">Login to continue watching.</div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button className="btn primary" type="submit">Login</button>
                </form>
                <div className="notice">No account? <Link to="/register">Register</Link></div>
            </div>
        </div>
    );
};

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await register({ name, email, password });
            navigate('/');
        } catch (err) {
            setError('Register failed.');
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-title">Create account</div>
                <div className="notice">Start your library journey.</div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button className="btn primary" type="submit">Register</button>
                </form>
                <div className="notice">Already have an account? <Link to="/login">Login</Link></div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="cine-skeleton-card" aria-hidden="true">
        <div className="cine-skeleton-poster" />
        <div className="cine-skeleton-line" />
        <div className="cine-skeleton-line short" />
    </div>
);

const MediaCarousel = ({ title, items, onWatch, watchProgress = {}, loading = false }) => {
    const trackRef = useRef(null);

    const slide = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.85, 280), behavior: 'smooth' });
    };

    return (
        <section className="cine-row">
            <div className="cine-row-header">
                <h2>{title}</h2>
                <div className="cine-row-arrows">
                    <button className="icon-btn" onClick={() => slide(-1)} aria-label={`Scroll ${title} left`}>‹</button>
                    <button className="icon-btn" onClick={() => slide(1)} aria-label={`Scroll ${title} right`}>›</button>
                </div>
            </div>
            <div className="cine-carousel" ref={trackRef}>
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={`${title}-${index}`} />)
                    : items.map((item) => {
                        const progress = Math.min(100, Math.max(0, watchProgress[item.id] || 0));
                        return (
                            <article className="cine-card" key={`${title}-${item.id}`} onClick={() => onWatch(item.id)}>
                                <div className="cine-card-media">
                                    {item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} /> : <div className="poster-fallback">CinePK</div>}
                                    <div className="cine-card-overlay">
                                        <div className="cine-card-title">{item.title || 'Untitled'}</div>
                                    </div>
                                </div>
                                {title === 'Continue Watching' && (
                                    <div className="cine-progress-track">
                                        <div className="cine-progress-fill" style={{ width: `${progress}%` }} />
                                    </div>
                                )}
                            </article>
                        );
                    })}
            </div>
        </section>
    );
};

const MobileBottomNav = ({ user }) => (
    <nav className="cine-mobile-nav">
        <Link to="/">Home</Link>
        <Link to="/">Search</Link>
        <Link to="/">Library</Link>
        <Link to="/account">{user?.name ? 'Account' : 'Account'}</Link>
    </nav>
);

const LibraryPage = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        apiFetch('/api/home/dashboard', {}, token)
            .then((res) => res.json())
            .then((data) => setDashboard(data))
            .catch(() => setDashboard({ featured: null, rows: {}, progress: {} }))
            .finally(() => setLoading(false));
    }, [token]);

    const allRows = dashboard?.rows || {};
    const filterItems = (items = []) => items.filter((item) => (item.title || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="cine-shell">
            <header className="cine-topbar">
                <div className="brand">
                    <img src="/logo.png" alt="CinePK" className="h-8 w-auto" />
                    <div>
                        <div>CinePK</div>
                        <div className="notice">HyperDark Cinema 2025</div>
                    </div>
                </div>
                <div className="cine-toolbar">
                    <input className="cine-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your library" />
                    {user?.is_admin && <Link className="btn" to="/admin">Admin</Link>}
                    <Link className="btn" to="/account">Account</Link>
                    <button className="btn" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
                </div>
            </header>

            <section className="cine-hero">
                {loading ? <div className="cine-hero-skeleton" /> : (
                    <>
                        <div className="cine-hero-content">
                            <div className="notice">Featured tonight</div>
                            <h1>{dashboard?.featured?.title || 'No featured media yet'}</h1>
                            <p>{dashboard?.featured?.synopsis || 'Add media from admin panel to populate your premium home dashboard.'}</p>
                            {dashboard?.featured?.id && <button className="btn primary" onClick={() => navigate(`/watch/${dashboard.featured.id}`)}>Start Streaming</button>}
                        </div>
                        {dashboard?.featured?.poster_url && <img src={dashboard.featured.poster_url} alt={dashboard.featured.title || 'featured'} className="cine-hero-poster" />}
                    </>
                )}
            </section>

            <MediaCarousel title="Continue Watching" items={filterItems(allRows.continue_watching)} onWatch={(id) => navigate(`/watch/${id}`)} watchProgress={dashboard?.progress || {}} loading={loading} />
            <MediaCarousel title="Trending" items={filterItems(allRows.trending)} onWatch={(id) => navigate(`/watch/${id}`)} loading={loading} />
            <MediaCarousel title="New Releases" items={filterItems(allRows.new_releases)} onWatch={(id) => navigate(`/watch/${id}`)} loading={loading} />
            <MediaCarousel title="Your Library" items={filterItems(allRows.your_library)} onWatch={(id) => navigate(`/watch/${id}`)} loading={loading} />
            <MobileBottomNav user={user} />
        </div>
    );
};

const WatchPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const mediaId = Number(id);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [episodeProgressMap, setEpisodeProgressMap] = useState({});

    useEffect(() => {
        if (!mediaId) return;
        setLoading(true);
        apiFetch(`/api/media/${mediaId}`, {}, token)
            .then((res) => res.json())
            .then((data) => setDetails(data))
            .catch(() => setDetails(null))
            .finally(() => setLoading(false));
    }, [mediaId, token]);

    const flatEpisodes = useMemo(() => {
        if (!details?.seasons) return [];
        return details.seasons.flatMap((season) => (season.episodes || []).map((episode, index) => ({ seasonNumber: season.number, episode, index })));
    }, [details]);

    useEffect(() => {
        if (!details?.media?.id || details.media.type !== 'series') return;
        apiFetch(`/api/progress/list?media_id=${details.media.id}`, {}, token)
            .then((res) => res.json())
            .then((data) => {
                const nextMap = {};
                (data?.episodes || []).forEach((entry) => {
                    nextMap[entry.episode_id] = { percent: Math.round((entry.percent || 0) * 100) };
                });
                setEpisodeProgressMap(nextMap);
            })
            .catch(() => setEpisodeProgressMap({}));
    }, [details?.media?.id, details?.media?.type, token]);

    const currentEpisode = flatEpisodes[currentEpisodeIndex]?.episode;
    const downloads = details?.media?.type === 'series' ? (currentEpisode?.downloads || []) : (details?.downloads || []);

    return (
        <div className="cine-watch-shell">
            <header className="cine-watch-topbar">
                <button className="btn" onClick={() => navigate('/')}>← Back</button>
                <div className="cine-watch-title">{details?.media?.title || 'Loading stream...'}</div>
                <img src="/logo.png" alt="CinePK" className="h-8 w-auto" />
            </header>
            {loading && <div className="panel">Loading stream...</div>}
            {!loading && details?.media && (
                <div className="cine-watch-layout">
                    <Player
                        title={details.media.title}
                        mediaId={details.media.id}
                        episodeId={currentEpisode?.id || null}
                        token={token}
                        downloads={downloads}
                        onEnded={() => {
                            if (currentEpisodeIndex < flatEpisodes.length - 1) {
                                setCurrentEpisodeIndex((value) => value + 1);
                            }
                        }}
                        autoPlayNext
                        onToggleAutoplay={() => {}}
                        showAutoplay={details.media.type === 'series'}
                        episodes={flatEpisodes.map((entry, index) => ({ ...entry, index }))}
                        currentEpisodeIndex={currentEpisodeIndex}
                        onSelectEpisode={setCurrentEpisodeIndex}
                        onTheaterChange={() => {}}
                        episodeProgressMap={episodeProgressMap}
                    />
                    {details.media.type === 'series' && (
                        <aside className="cine-episode-sidebar custom-scrollbar">
                            <h3>Episodes</h3>
                            {flatEpisodes.map((entry, index) => (
                                <button
                                    key={entry.episode.id}
                                    className={`cine-episode-item ${index === currentEpisodeIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentEpisodeIndex(index)}
                                >
                                    <span>S{entry.seasonNumber} · E{entry.episode.number || index + 1}</span>
                                    <strong>{entry.episode.title || `Episode ${index + 1}`}</strong>
                                    <div className="cine-progress-track"><div className="cine-progress-fill" style={{ width: `${episodeProgressMap[entry.episode.id]?.percent || 0}%` }} /></div>
                                </button>
                            ))}
                        </aside>
                    )}
                </div>
            )}
            <MobileBottomNav user={{}} />
        </div>
    );
};

const AdminPage = () => {
    const { token } = useAuth();
    const [url, setUrl] = useState('');
    const [type, setType] = useState('movie');
    const [title, setTitle] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [media, setMedia] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const fetchMedia = () => {
        setLoading(true);
        apiFetch('/api/admin/media', {}, token)
            .then((res) => res.json())
            .then((data) => setMedia(data.data || []))
            .catch(() => setMedia([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchMedia(); }, [token]);

    const addMedia = async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
            await apiFetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, type, title, poster_url: posterUrl }),
            }, token);
            setUrl(''); setTitle(''); setPosterUrl('');
            fetchMedia();
        } finally {
            setBusy(false);
        }
    };

    const filtered = media.filter((item) => (item.title || '').toLowerCase().includes(search.toLowerCase()));
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));

    return (
        <div className="cine-shell">
            <header className="cine-topbar">
                <div className="brand"><img src="/logo.png" alt="CinePK" className="h-8 w-auto" /><div><div>Admin Panel</div><div className="notice">Manage CinePK library</div></div></div>
                <Link className="btn" to="/">Back to Home</Link>
            </header>
            <div className="admin-layout">
                <form className="panel" onSubmit={addMedia}>
                    <h2>Add Media</h2>
                    <input className="auth-input" placeholder="Media URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
                    <input className="auth-input" placeholder="Poster URL" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
                    <input className="auth-input" placeholder="Title override" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <select className="auth-input" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="movie">Movie</option><option value="series">Series</option>
                    </select>
                    <button className="btn primary" disabled={busy}>{busy ? 'Crawling...' : 'Crawl & Add'}</button>
                </form>
                <section className="panel">
                    <div className="cine-row-header"><h2>Library list</h2><input className="cine-search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                    <div className="admin-list">
                        {loading ? Array.from({ length: 5 }).map((_, i) => <div className="admin-item" key={i}><SkeletonCard /></div>) : paged.map((item) => (
                            <div className="admin-item" key={item.id}>
                                <div className="admin-meta">
                                    {item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} className="admin-thumb" /> : <div className="admin-thumb poster-fallback">CinePK</div>}
                                    <div>
                                        <div className="admin-title">{item.title || 'Untitled'}</div>
                                        <div className="notice">{item.type?.toUpperCase()} · Updated {new Date(item.updated_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="admin-actions">
                                    <label className="btn">
                                        Upload Poster
                                        <input type="file" hidden onChange={async (event) => {
                                            const file = event.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('poster', file);
                                            await apiFetchForm(`/api/admin/media/${item.id}/poster`, formData, token);
                                            fetchMedia();
                                        }} />
                                    </label>
                                    <button className="btn" onClick={async () => { await apiFetch(`/api/admin/media/${item.id}/refresh`, { method: 'POST' }, token); fetchMedia(); }}>Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button className="btn" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>Prev</button>
                        <span className="notice">Page {page} / {maxPage}</span>
                        <button className="btn" disabled={page >= maxPage} onClick={() => setPage((v) => Math.min(maxPage, v + 1))}>Next</button>
                    </div>
                </section>
            </div>
            <MobileBottomNav user={{}} />
        </div>
    );
};

const AccountPage = () => {
    const { token, user } = useAuth();
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        apiFetch('/api/account/dashboard', {}, token)
            .then((res) => res.json())
            .then((data) => setDashboard(data))
            .catch(() => setDashboard({ stats: {}, watchlist: [], favorites: [], top_replays: [] }));
    }, [token]);

    const stats = dashboard?.stats || {};

    return (
        <div className="cine-shell">
            <header className="cine-topbar">
                <div className="brand"><img src="/logo.png" alt="CinePK" className="h-8 w-auto" /><div><div>{user?.name || 'Account'}</div><div className="notice">Premium watch analytics</div></div></div>
                <Link className="btn" to="/">Back to Home</Link>
            </header>
            <div className="account-grid-premium">
                <div className="glass-card"><div className="notice">Total watch time</div><div className="stat-value">{formatSeconds(stats.total_watch_seconds || 0)}</div></div>
                <div className="glass-card"><div className="notice">Movies watched</div><div className="stat-value">{stats.movie_count_watched || 0}</div></div>
                <div className="glass-card"><div className="notice">Series watched</div><div className="stat-value">{stats.series_count_watched || 0}</div></div>
                <div className="glass-card"><div className="notice">70% Completions</div><div className="stat-value">{stats.completed_70_total || 0}</div></div>
            </div>
            {stats.last_watched && <section className="panel"><h2>Last watched</h2><div className="notice">{stats.last_watched.title} · {formatSeconds(stats.last_watched.seconds || 0)} watched</div></section>}
            <section className="panel"><h2>Favourites</h2><div className="mini-grid">{(dashboard?.favorites || []).map((item) => <article key={item.id} className="mini-card cine-card">{item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} /> : <div className="poster-fallback">CinePK</div>}<div className="mini-title">{item.title}</div></article>)}</div></section>
            <section className="panel"><h2>Watchlist</h2><div className="mini-grid">{(dashboard?.watchlist || []).map((item) => <article key={item.id} className="mini-card cine-card">{item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} /> : <div className="poster-fallback">CinePK</div>}<div className="mini-title">{item.title}</div></article>)}</div></section>
            <section className="panel"><h2>Top 70% Replays</h2><div className="admin-list">{(dashboard?.top_replays || []).map((item) => <div key={item.id} className="admin-item"><div className="admin-title">{item.title}</div><div className="notice">{item.type?.toUpperCase()} · {item.completions}x</div></div>)}</div></section>
            <MobileBottomNav user={user} />
        </div>
    );
};

const MainApp = () => (
    <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

const RootApp = () => (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/*"
                    element={(
                        <RequireAuth>
                            <MainApp />
                        </RequireAuth>
                    )}
                />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);

const root = createRoot(document.getElementById('app'));
root.render(<RootApp />);


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
