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
        case 'heart':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20s-7-4.35-7-10a4.2 4.2 0 0 1 7-3.2A4.2 4.2 0 0 1 19 10c0 5.65-7 10-7 10Z" fill="currentColor" />
                </svg>
            );
        case 'bookmark':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3-5 3V4.75Z" fill="currentColor" />
                </svg>
            );
        case 'chevronLeft':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m14.5 5.5-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'chevronRight':
            return (
                <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9.5 5.5 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
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
                        autoPlay
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
                        <div className="player-title">{title || 'F2M HyperPlayer'}{episodeLabel}</div>
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


const CarouselRail = ({ title, children, className = '', emptyMessage = '', autoSlide = false }) => {
    const railRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const syncButtons = () => {
        const node = railRef.current;
        if (!node) return;
        setCanPrev(node.scrollLeft > 6);
        setCanNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 6);
    };

    useEffect(() => {
        syncButtons();
        const node = railRef.current;
        if (!node) return;
        node.addEventListener('scroll', syncButtons, { passive: true });
        window.addEventListener('resize', syncButtons);
        return () => {
            node.removeEventListener('scroll', syncButtons);
            window.removeEventListener('resize', syncButtons);
        };
    }, [children]);

    const slide = (direction) => {
        const node = railRef.current;
        if (!node) return;
        node.scrollBy({ left: direction * Math.max(320, node.clientWidth * 0.72), behavior: 'smooth' });
    };

    const childCount = React.Children.count(children);

    useEffect(() => {
        if (!autoSlide || childCount < 2 || isHovered) return;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        if (prefersReducedMotion) return;

        const timer = window.setInterval(() => {
            const node = railRef.current;
            if (!node) return;
            const isAtEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 10;
            if (isAtEnd) {
                node.scrollTo({ left: 0, behavior: 'smooth' });
                return;
            }
            node.scrollBy({ left: Math.max(280, node.clientWidth * 0.72), behavior: 'smooth' });
        }, 5200);

        return () => window.clearInterval(timer);
    }, [autoSlide, childCount, isHovered]);

    return (
        <div
            className={`library-row-section ${className}`.trim()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="section-head">
                <div className="section-title">{title}</div>
                <div className="carousel-nav">
                    <button className="icon-btn btn carousel-btn" onClick={() => slide(-1)} disabled={!canPrev} type="button" aria-label={`Previous in ${title}`}>
                        <Icon name="chevronLeft" />
                    </button>
                    <button className="icon-btn btn carousel-btn" onClick={() => slide(1)} disabled={!canNext} type="button" aria-label={`Next in ${title}`}>
                        <Icon name="chevronRight" />
                    </button>
                </div>
            </div>
            <div className="scroll-fade">
                <div className="media-row" ref={railRef}>
                    {children}
                    {!childCount && emptyMessage ? <div className="notice">{emptyMessage}</div> : null}
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

const LibraryPage = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const selectedId = id ? Number(id) : null;
    const [media, setMedia] = useState([]);
    const [details, setDetails] = useState(null);
    const [search, setSearch] = useState('');
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [isTheater, setIsTheater] = useState(false);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [watchlist, setWatchlist] = useState(new Set());
    const [favorites, setFavorites] = useState(new Set());
    const [episodeProgressMap, setEpisodeProgressMap] = useState({});
    const [mediaLoading, setMediaLoading] = useState(true);
    const [continueWatching, setContinueWatching] = useState([]);
    const [continueLoading, setContinueLoading] = useState(true);

    useEffect(() => {
        setMediaLoading(true);
        apiFetch('/api/media', {}, token)
            .then((res) => res.json())
            .then((data) => setMedia(data.data || []))
            .catch(() => setMedia([]))
            .finally(() => setMediaLoading(false));
    }, [token]);

    useEffect(() => {
        setContinueLoading(true);
        apiFetch('/api/user/continue-watching', {}, token)
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setContinueWatching(Array.isArray(data) ? data : []))
            .catch(() => setContinueWatching([]))
            .finally(() => setContinueLoading(false));
    }, [token]);

    useEffect(() => {
        apiFetch('/api/watchlist', {}, token)
            .then((res) => res.json())
            .then((data) => setWatchlist(new Set((data.data || []).map((item) => item.id))))
            .catch(() => setWatchlist(new Set()));
        apiFetch('/api/favorites', {}, token)
            .then((res) => res.json())
            .then((data) => setFavorites(new Set((data.data || []).map((item) => item.id))))
            .catch(() => setFavorites(new Set()));
    }, [token]);

    const toggleWatchlist = async (mediaId) => {
        const isActive = watchlist.has(mediaId);
        const method = isActive ? 'DELETE' : 'POST';
        await apiFetch('/api/watchlist', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ media_id: mediaId }),
        }, token);
        setWatchlist((prev) => {
            const next = new Set(prev);
            if (isActive) next.delete(mediaId);
            else next.add(mediaId);
            return next;
        });
    };

    const toggleFavorite = async (mediaId) => {
        const isActive = favorites.has(mediaId);
        const method = isActive ? 'DELETE' : 'POST';
        await apiFetch('/api/favorites', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ media_id: mediaId }),
        }, token);
        setFavorites((prev) => {
            const next = new Set(prev);
            if (isActive) next.delete(mediaId);
            else next.add(mediaId);
            return next;
        });
    };

    useEffect(() => {
        if (!selectedId) {
            setDetails(null);
            return;
        }
        apiFetch(`/api/media/${selectedId}`, {}, token)
            .then((res) => res.json())
            .then((data) => setDetails(data))
            .catch(() => setDetails(null));
    }, [selectedId, token]);

    useEffect(() => {
        setCurrentEpisodeIndex(0);
        setEpisodeProgressMap({});
    }, [details?.media?.id]);

    const filtered = media.filter((item) =>
        `${item.title || ''}`.toLowerCase().includes(search.toLowerCase())
    );

    const cinematicRows = useMemo(() => {
        const movies = filtered.filter((item) => item.type === 'movie');
        const series = filtered.filter((item) => item.type === 'series');
        const topRated = [...filtered]
            .sort((a, b) => Number(b.imdb_rating || 0) - Number(a.imdb_rating || 0))
            .slice(0, 14);

        return [
            { key: 'movies', title: 'Movies', items: movies },
            { key: 'series', title: 'Series', items: series },
            { key: 'top', title: 'Top Rated', items: topRated },
        ].filter((row) => row.items.length);
    }, [filtered]);

    const libraryStats = useMemo(() => {
        const movieCount = media.filter((item) => item.type === 'movie').length;
        const seriesCount = media.filter((item) => item.type === 'series').length;
        const topRating = media.reduce((best, item) => Math.max(best, Number(item.imdb_rating || 0)), 0);
        return {
            movieCount,
            seriesCount,
            topRating: topRating > 0 ? topRating.toFixed(1) : '—',
        };
    }, [media]);

    const flatEpisodes = useMemo(() => {
        if (!details?.seasons) return [];
        const list = [];
        details.seasons.forEach((season) => {
            season.episodes?.forEach((episode) => {
                list.push({
                    seasonNumber: season.number,
                    seasonId: season.id,
                    seasonTitle: season.title,
                    episode,
                });
            });
        });
        return list;
    }, [details]);

    useEffect(() => {
        if (!details?.media?.id) return;
        apiFetch(`/api/progress/latest?media_id=${details.media.id}`, {}, token)
            .then((res) => res.json())
            .then((data) => {
                const episodeId = data?.episode_id;
                if (!episodeId) return;
                const index = flatEpisodes.findIndex((entry) => entry.episode.id === episodeId);
                if (index >= 0) {
                    setCurrentEpisodeIndex(index);
                }
            })
            .catch(() => {});
    }, [details?.media?.id, flatEpisodes, token]);

    useEffect(() => {
        if (!flatEpisodes.length) {
            setCurrentEpisodeIndex(0);
        }
    }, [flatEpisodes.length]);

    useEffect(() => {
        if (!details?.media?.id || details.media?.type !== 'series') {
            setEpisodeProgressMap({});
            return;
        }
        apiFetch(`/api/progress/list?media_id=${details.media.id}`, {}, token)
            .then((res) => res.json())
            .then((data) => {
                const nextMap = {};
                (data?.episodes || []).forEach((entry) => {
                    const id = Number(entry?.episode_id || 0);
                    if (!id) return;
                    const seconds = Number(entry?.seconds || 0);
                    const fromPercent = Number(entry?.percent || 0) * 100;
                    const percent = Math.min(100, Math.max(0, Number.isFinite(fromPercent) ? fromPercent : 0));
                    nextMap[id] = {
                        percent,
                        seconds: Number.isFinite(seconds) ? Math.max(0, seconds) : 0,
                    };
                });
                setEpisodeProgressMap(nextMap);
            })
            .catch(() => setEpisodeProgressMap({}));
    }, [details?.media?.id, details?.media?.type, token]);


    const currentEpisode = flatEpisodes[currentEpisodeIndex]?.episode || null;
    const handleEnded = () => {
        if (!autoPlayNext) return;
        if (!flatEpisodes.length) return;
        const nextIndex = currentEpisodeIndex + 1;
        if (nextIndex < flatEpisodes.length) {
            setCurrentEpisodeIndex(nextIndex);
        }
    };

    const currentDownloads = useMemo(() => {
        if (!details) return [];
        if (details.media?.type === 'series') {
            return currentEpisode?.downloads || [];
        }
        return details.downloads || [];
    }, [details, currentEpisode]);

    return (
        <div className="app-shell">
            <div className="top-bar">
                <div className="brand">
                    <div className="brand-mark" />
                    <div>
                        <div>F2M PRIME</div>
                        <div className="notice">A premium cinematic library experience</div>
                    </div>
                </div>
                <div className="search-bar">
                    <span>🔍</span>
                    <input
                        className="search-input"
                        placeholder="Search your library..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <div className="user-chip">
                    <span>{user?.name || 'User'}</span>
                    <button className="btn" onClick={() => navigate('/account')}>Account</button>
                    {user?.is_admin && (
                        <button className="btn" onClick={() => navigate('/admin')}>Admin</button>
                    )}
                    <button className="btn" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>Logout</button>
                </div>
            </div>

            <div className={`layout ${isTheater ? 'theater' : ''} ${!details ? 'full-width' : ''}`}>
                <div className={`hero-panel ${isTheater ? 'theater' : ''}`}>
                    {!details && (
                        <div className="library-stack fade-in">
                            <div className="library-header-block">
                                <div className="library-title">Discover your next obsession</div>
                                <div className="notice">Cinematic rows with smoother carousel motion on desktop and mobile.</div>
                                <div className="library-kpi-grid">
                                    <div className="library-kpi-item">
                                        <span>Movies</span>
                                        <strong>{libraryStats.movieCount}</strong>
                                    </div>
                                    <div className="library-kpi-item">
                                        <span>Series</span>
                                        <strong>{libraryStats.seriesCount}</strong>
                                    </div>
                                    <div className="library-kpi-item">
                                        <span>Top IMDb</span>
                                        <strong>{libraryStats.topRating}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="cinematic-hero-scroll">
                                <CarouselRail title="Continue Watching" className="carousel-hero" emptyMessage={!continueLoading ? 'Nothing to resume yet.' : ''}>
                                    {continueLoading && Array.from({ length: 3 }).map((_, idx) => (
                                        <div key={`continue-skeleton-${idx}`} className="hero-card skeleton-block" />
                                    ))}
                                    {!continueLoading && continueWatching.map((item) => (
                                        <button
                                            key={`continue-${item.id}`}
                                            className="hero-card"
                                            onClick={() => navigate(`/media/${item.id}`)}
                                            type="button"
                                        >
                                            {item.poster_url ? <img src={item.poster_url} alt={item.title || 'Poster'} /> : <div className="poster-fallback">F2M</div>}
                                            <div className="hero-card-overlay">
                                                <div className="hero-card-title">{item.title || 'Untitled'}</div>
                                                <div className="hero-progress-track"><span style={{ width: `${Math.max(0, Math.min(100, Number(item.progress_percentage || 0)))}%` }} /></div>
                                            </div>
                                        </button>
                                    ))}
                                </CarouselRail>
                            </div>

                            {cinematicRows.map((row) => (
                                <CarouselRail key={row.key} title={row.title} autoSlide emptyMessage={!mediaLoading ? 'No titles in this row yet.' : ''}>
                                    {mediaLoading && Array.from({ length: 8 }).map((_, idx) => (
                                        <div key={`${row.key}-skeleton-${idx}`} className="media-card skeleton-block" />
                                    ))}
                                    {!mediaLoading && row.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="media-card"
                                            onClick={() => navigate(`/media/${item.id}`)}
                                        >
                                            <div className="media-card-actions">
                                                <button
                                                    className={`icon-btn action-btn ${watchlist.has(item.id) ? 'active' : ''}`}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleWatchlist(item.id);
                                                    }}
                                                    title="Watchlist"
                                                    aria-label="Watchlist"
                                                >
                                                    <Icon name="bookmark" />
                                                </button>
                                                <button
                                                    className={`icon-btn action-btn ${favorites.has(item.id) ? 'active' : ''}`}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleFavorite(item.id);
                                                    }}
                                                    title="Favourite"
                                                    aria-label="Favourite"
                                                >
                                                    <Icon name="heart" />
                                                </button>
                                            </div>
                                            <div className="media-card-media">
                                                {item.poster_url ? (
                                                    <img src={item.poster_url} alt={item.title || 'poster'} />
                                                ) : (
                                                    <div className="poster-fallback">F2M</div>
                                                )}
                                            </div>
                                            <div className="media-card-body">
                                                <div className="media-card-title">{item.title || 'Untitled'}</div>
                                                <div className="media-card-meta">{item.year || '—'} · IMDb {item.imdb_rating || '—'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </CarouselRail>
                            ))}

                            {!mediaLoading && cinematicRows.length === 0 && (
                                <div className="notice">No titles matched your search.</div>
                            )}
                        </div>
                    )}

                    {details && (
                        <Player
                            title={details.media?.title}
                            mediaId={details.media?.id}
                            episodeId={currentEpisode?.id}
                            token={token}
                            downloads={currentDownloads}
                            onEnded={handleEnded}
                            autoPlayNext={autoPlayNext}
                            onToggleAutoplay={setAutoPlayNext}
                            showAutoplay={details.media?.type === 'series'}
                            episodes={flatEpisodes}
                            currentEpisodeIndex={currentEpisodeIndex}
                            onSelectEpisode={setCurrentEpisodeIndex}
                            onTheaterChange={setIsTheater}
                            episodeProgressMap={episodeProgressMap}
                        />
                    )}
                </div>

                <div className="sidebar">
                    {details && (
                        <div className="panel">
                            <div className="section-title">Actions</div>
                            <button className="btn" onClick={() => navigate('/')}>Back to Library</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminPage = () => {
    const { token, user } = useAuth();
    const [items, setItems] = useState([]);
    const [url, setUrl] = useState('');
    const [poster, setPoster] = useState('');
    const [type, setType] = useState('movie');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [busyId, setBusyId] = useState(null);
    const [posterBusyId, setPosterBusyId] = useState(null);
    const [createBusy, setCreateBusy] = useState(false);
    const [mediaStatuses, setMediaStatuses] = useState({});

    const loadItems = () => {
        apiFetch('/api/admin/media', {}, token)
            .then((res) => res.json())
            .then((data) => {
                const list = data.data || [];
                setItems(list);
                list.forEach((item) => {
                    apiFetch(`/api/admin/media-status/${item.id}`, {}, token)
                        .then((res) => res.ok ? res.json() : null)
                        .then((payload) => {
                            if (!payload?.status) return;
                            setMediaStatuses((prev) => ({ ...prev, [item.id]: payload.status }));
                        })
                        .catch(() => {});
                });
            })
            .catch(() => setItems([]));
    };

    useEffect(() => {
        loadItems();
    }, [token]);

    const handleCreate = async (event) => {
        event.preventDefault();
        setStatus('');
        setCreateBusy(true);
        try {
            const res = await apiFetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    poster_url: poster || null,
                    type: type || null,
                    title: title || null,
                }),
            }, token);
            if (!res.ok) {
                setStatus('Create failed.');
                return;
            }
            setUrl('');
            setPoster('');
            setTitle('');
            setStatus('Added and crawled.');
            loadItems();
        } catch {
            setStatus('Create failed.');
        } finally {
            setCreateBusy(false);
        }
    };

    const handleRefresh = async (id) => {
        setBusyId(id);
        try {
            await apiFetch(`/api/admin/media/${id}/refresh`, { method: 'POST' }, token);
            loadItems();
        } finally {
            setBusyId(null);
        }
    };

    const handlePosterUpload = async (id, file) => {
        if (!file) return;
        setPosterBusyId(id);
        try {
            const form = new FormData();
            form.append('poster', file);
            await apiFetchForm(`/api/admin/media/${id}/poster`, form, token);
            loadItems();
        } finally {
            setPosterBusyId(null);
        }
    };

    return (
        <div className="app-shell admin-shell fade-in">
            <div className="top-bar">
                <div className="brand">
                    <div className="brand-mark" />
                    <div>
                        <div>Admin Panel</div>
                        <div className="notice">Premium internal tooling for catalog ops</div>
                    </div>
                </div>
                <div className="user-chip">
                    <span>{user?.name || 'Admin'}</span>
                    <Link className="btn back-btn" to="/"><Icon name="chevronLeft" /> Back to Library</Link>
                </div>
            </div>

            <div className="admin-grid">
                <div className="panel glass-panel">
                    <div className="section-title">Add Media</div>
                    <form className="admin-form" onSubmit={handleCreate}>
                        <label className="field-floating">
                            <span>Media URL</span>
                            <input className="auth-input" value={url} onChange={(event) => setUrl(event.target.value)} required />
                        </label>
                        <label className="field-floating">
                            <span>Poster URL (optional)</span>
                            <input className="auth-input" value={poster} onChange={(event) => setPoster(event.target.value)} />
                        </label>
                        <label className="field-floating">
                            <span>Title override (optional)</span>
                            <input className="auth-input" value={title} onChange={(event) => setTitle(event.target.value)} />
                        </label>
                        <select className="btn" value={type} onChange={(event) => setType(event.target.value)}>
                            <option value="movie">Movie</option>
                            <option value="series">Series</option>
                        </select>
                        <button className={`btn primary crawl-cta ${createBusy ? 'is-loading' : ''}`} type="submit" disabled={createBusy}>
                            {createBusy ? 'Crawling…' : 'Crawl & Add'}
                        </button>
                        {status && <div className="notice">{status}</div>}
                    </form>
                </div>

                <div className="panel glass-panel">
                    <div className="section-title">Library</div>
                    <div className="admin-list">
                        {items.map((item) => (
                            <div key={item.id} className="admin-item table-card">
                                <div className="admin-thumb">
                                    {item.poster_url ? (
                                        <img src={item.poster_url} alt={item.title || 'poster'} />
                                    ) : (
                                        <div className="poster-fallback">F2M</div>
                                    )}
                                </div>
                                <div className="admin-meta">
                                    <div className="admin-title">{item.title || 'Untitled'}</div>
                                    <div className="notice">{item.year || '—'} · IMDb {item.imdb_rating || '—'}</div>
                                    <div className={`status-badge ${mediaStatuses[item.id] || 'ready'}`}>{mediaStatuses[item.id] || 'ready'}</div>
                                </div>
                                <div className="admin-actions">
                                    <label className="btn upload-btn">
                                        {posterBusyId === item.id ? 'Uploading…' : 'Upload Poster'}
                                        <input type="file" accept="image/*" onChange={(event) => handlePosterUpload(item.id, event.target.files?.[0])} />
                                    </label>
                                    <button className="btn" onClick={() => handleRefresh(item.id)} disabled={busyId === item.id}>
                                        {busyId === item.id ? 'Refreshing…' : 'Update'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountPage = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        apiFetch('/api/stats/overview', {}, token)
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch(() => setStats(null));
        apiFetch('/api/user/watchlist', {}, token)
            .then((res) => res.json())
            .then((data) => setWatchlist(data.data || []))
            .catch(() => setWatchlist([]));
        apiFetch('/api/favorites', {}, token)
            .then((res) => res.json())
            .then((data) => setFavorites(data.data || []))
            .catch(() => setFavorites([]));
    }, [token]);

    return (
        <div className="app-shell account-shell fade-in">
            <div className="top-bar">
                <div className="brand">
                    <div className="brand-mark" />
                    <div>
                        <div>Account</div>
                        <div className="notice">{user?.name || 'User'} dashboard</div>
                    </div>
                </div>
                <div className="user-chip">
                    <Link className="btn back-btn" to="/"><Icon name="chevronLeft" /> Back to Library</Link>
                </div>
            </div>

            <div className="account-grid cinematic-account-grid">
                <div className="panel cinematic-stat-hero">
                    <div className="notice">Total watch time</div>
                    <div className="hero-stat-value">{formatSeconds(stats?.total_watch_seconds || 0)}</div>
                    <div className="stat-inline-grid">
                        <div className="mini-stat"><span>Movies</span><strong>{stats?.movie_count_watched || 0}</strong></div>
                        <div className="mini-stat"><span>Series</span><strong>{stats?.series_count_watched || 0}</strong></div>
                        <div className="mini-stat"><span>70%+</span><strong>{stats?.completed_70_total || 0}</strong></div>
                    </div>
                </div>

                {stats?.last_watched && (
                    <button className="panel last-watched-hero" type="button" onClick={() => navigate(`/media/${stats.last_watched.id}`)}>
                        <div className="notice">Last watched</div>
                        <div className="admin-title">{stats.last_watched.title}</div>
                        <div className="hero-progress-track"><span style={{ width: `${Math.min(100, ((stats.last_watched.seconds || 0) / Math.max(stats.last_watched.duration_seconds || 1, 1)) * 100)}%` }} /></div>
                        <div className="btn primary">Resume</div>
                    </button>
                )}

                <div className="panel">
                    <div className="section-title">Watchlist</div>
                    <div className="scroll-fade">
                        <div className="mini-row">
                            {watchlist.map((item) => (
                                <button key={item.id} className="mini-card cinematic-mini-card" type="button" onClick={() => navigate(`/media/${item.id}`)}>
                                    {item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} /> : <div className="poster-fallback">F2M</div>}
                                    <div className="mini-title">{item.title || 'Untitled'}</div>
                                </button>
                            ))}
                            {watchlist.length === 0 && <div className="notice">No items yet.</div>}
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="section-title">Curated Collection</div>
                    <div className="scroll-fade">
                        <div className="mini-row">
                            {favorites.map((item) => (
                                <button key={item.id} className="mini-card cinematic-mini-card" type="button" onClick={() => navigate(`/media/${item.id}`)}>
                                    {item.poster_url ? <img src={item.poster_url} alt={item.title || 'poster'} /> : <div className="poster-fallback">F2M</div>}
                                    <div className="mini-title">{item.title || 'Untitled'}</div>
                                </button>
                            ))}
                            {favorites.length === 0 && <div className="notice">No items yet.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MainApp = () => (
    <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/media/:id" element={<LibraryPage />} />
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
