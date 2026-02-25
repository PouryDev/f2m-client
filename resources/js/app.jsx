import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

const Icon = ({ name, className = 'size-4' }) => {
    const classes = className;
    switch (name) {
        case 'play': return <svg className={classes} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
        case 'pause': return <svg className={classes} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
        case 'search': return <svg className={classes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
        case 'close': return <svg className={classes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg>;
        case 'skipBack': return <svg className={classes} viewBox="0 0 24 24" fill="currentColor"><path d="M11 6 3 12l8 6V6Zm2 0h8v12h-8V6Z"/></svg>;
        case 'skipForward': return <svg className={classes} viewBox="0 0 24 24" fill="currentColor"><path d="m13 6 8 6-8 6V6ZM3 6h8v12H3V6Z"/></svg>;
        default: return <span className={classes}>•</span>;
    }
};

const AuthContext = createContext(null);
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const apiFetch = (url, options = {}, token) => {
    const fullUrl = API_BASE && url.startsWith('/') ? `${API_BASE}${url}` : url;
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(fullUrl, { ...options, headers, cache: 'no-store' });
};

const formatTime = (value) => {
    if (!Number.isFinite(value) || value <= 0) return '0:00';
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = Math.floor(value % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s}` : `${m}:${s}`;
};

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('f2m:token') || '');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) return setUser(null);
        apiFetch('/api/auth/user', {}, token).then((res) => res.ok ? res.json() : null).then((data) => setUser(data?.user || null)).catch(() => setUser(null));
    }, [token]);

    const login = async (payload) => {
        const res = await apiFetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('f2m:token', data?.token || '');
        setToken(data?.token || '');
        setUser(data?.user || null);
    };

    const register = async (payload) => {
        const res = await apiFetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Register failed');
        const data = await res.json();
        localStorage.setItem('f2m:token', data?.token || '');
        setToken(data?.token || '');
        setUser(data?.user || null);
    };

    const logout = async () => {
        if (token) apiFetch('/api/auth/logout', { method: 'POST' }, token).catch(() => {});
        localStorage.removeItem('f2m:token');
        setToken('');
        setUser(null);
    };

    return <AuthContext.Provider value={{ token, user, login, register, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);
const RequireAuth = ({ children }) => useAuth().token ? children : <Navigate to="/login" replace />;

const TopNav = ({ search, setSearch, suggestions, active, onPickSuggestion }) => {
    const { user, logout } = useAuth();
    const nav = [{ label: 'Watch', to: '/' }, { label: 'Curate', to: '/account' }, { label: 'Crawl', to: '/admin' }];
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#2A2A2A] bg-[#0F0F0F]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-[1600px] items-center gap-4 px-4 md:px-8" dir="ltr">
                <Link to="/" className="group flex items-center gap-3"><div className="grid size-10 place-content-center rounded-xl bg-[#1A1A1A] ring-1 ring-[#2A2A2A] text-[#FF2D55]">F2M</div><div><div className="text-sm font-semibold tracking-[0.18em]">F2M</div><div className="text-base font-bold text-[#FF2D55]">HyperPlayer</div></div></Link>
                <nav className="hidden items-center gap-2 lg:flex">
                    {nav.map((item) => {
                        const isActive = active === item.to;
                        return <Link key={item.to} to={item.to} className={`group relative rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'text-[#F1F1F1]' : 'text-[#A0A0A0] hover:text-[#F1F1F1]'}`}><span>{item.label}</span><span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#FF2D55] transition ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} /></Link>;
                    })}
                </nav>
                <div className="relative mx-auto hidden w-full max-w-xl md:block"><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#A0A0A0]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movies and episodes" className="w-full rounded-full border border-[#2A2A2A] bg-[#1A1A1A] py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#FF2D55]" />{suggestions.length > 0 && <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616] shadow-2xl shadow-[#FF2D55]/20">{suggestions.map((item) => <button key={item.id} onClick={() => onPickSuggestion(item.id)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-[#202020]"><span>{item.title}</span><span className="text-[#A0A0A0]">{item.year || '—'}</span></button>)}</div>}</div>
                <div className="ml-auto flex items-center gap-2 text-sm"><span className="rounded-full border border-[#2A2A2A] px-3 py-1.5 text-[#A0A0A0]">PK</span><Link className="rounded-full border border-[#2A2A2A] px-3 py-1.5" to="/account">Account</Link>{user?.is_admin && <Link className="rounded-full border border-[#2A2A2A] px-3 py-1.5" to="/admin">Admin</Link>}<button onClick={logout} className="rounded-full border border-[#2A2A2A] px-3 py-1.5 transition hover:border-[#FF2D55]">Logout</button></div>
            </div>
        </header>
    );
};

const PosterCard = ({ item, progress = 0, onClick }) => (
    <button onClick={onClick} className="group relative w-[280px] shrink-0 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] text-left shadow-lg transition duration-300 hover:scale-105 hover:shadow-[0_20px_48px_rgba(255,45,85,0.25)]">
        <div className="relative aspect-video overflow-hidden">{item.poster_url ? <img src={item.poster_url} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /> : <div className="grid h-full place-content-center bg-[#242424] text-[#A0A0A0]">No Poster</div>}<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-4"><h3 className="line-clamp-1 text-sm font-semibold">{item.title}</h3><p className="text-xs text-[#A0A0A0]">{item.year || 'Unknown year'} · {(item.type || 'title').toUpperCase()}</p><div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#FF2D55]" style={{ width: `${Math.max(4, progress)}%` }} /></div></div></div>
    </button>
);

const RowSection = ({ title, items, loading, onSelect, progressMap }) => (
    <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button className="text-xs font-medium text-[#A0A0A0] transition hover:text-[#F1F1F1]">See all</button></div>
        {loading ? <div className="flex gap-4 overflow-hidden">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="shimmer h-[158px] w-[280px] shrink-0 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]" />)}</div> : <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">{items.map((item) => <PosterCard key={`${title}-${item.id}`} item={item} progress={progressMap[item.id] || 0} onClick={() => onSelect(item.id)} />)}</div>}
    </section>
);

const Player = ({ activeItem, details, onClose, autoNext, setAutoNext }) => {
    const { token } = useAuth();
    const videoRef = useRef(null);
    const hideTimerRef = useRef(null);
    const [showControls, setShowControls] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [showEpisodes, setShowEpisodes] = useState(false);
    const episodes = useMemo(() => (details?.seasons || []).flatMap((s) => (s.episodes || []).map((ep) => ({ ...ep, season: s.number }))), [details]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const firstEpisode = episodes[0];
        const initial = firstEpisode?.downloads?.[0] || details?.downloads?.[0] || null;
        setSelected(initial ? { ...initial, episode: firstEpisode || null } : null);
    }, [details, episodes]);

    useEffect(() => {
        if (!videoRef.current || !activeItem || !selected) return;
        const key = selected?.episode?.id ? `${activeItem.id}:${selected.episode.id}` : `${activeItem.id}:movie`;
        videoRef.current.currentTime = Number(localStorage.getItem(`f2m-progress:${key}`) || '0');
    }, [activeItem, selected]);

    useEffect(() => {
        if (!videoRef.current || !activeItem || !selected) return;
        const interval = setInterval(() => {
            const video = videoRef.current;
            const key = selected?.episode?.id ? `${activeItem.id}:${selected.episode.id}` : `${activeItem.id}:movie`;
            localStorage.setItem(`f2m-progress:${key}`, String(video.currentTime || 0));
            apiFetch('/api/media/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ media_id: activeItem.id, episode_id: selected?.episode?.id || null, seconds: video.currentTime, duration_seconds: video.duration, watched_delta: 5 }) }, token).catch(() => {});
        }, 5000);
        return () => clearInterval(interval);
    }, [activeItem, selected, token]);

    const showThenHideControls = () => {
        setShowControls(true);
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    useEffect(() => { showThenHideControls(); return () => clearTimeout(hideTimerRef.current); }, []);
    const onTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime || 0);
        setDuration(video.duration || 0);
        const end = video.buffered?.length ? video.buffered.end(video.buffered.length - 1) : 0;
        setBuffered(end);
    };

    if (!activeItem || !selected) return null;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
        <aside className="relative w-full overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#111111]">
            <div className="relative aspect-video w-full bg-black" onMouseMove={showThenHideControls} onTouchStart={showThenHideControls}>
                <video ref={videoRef} className="h-full w-full" src={selected.stream_url || selected.url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onTimeUpdate} autoPlay />
                <div className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/20 to-black/50 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center justify-between"><div><h3 className="text-lg font-semibold">{activeItem.title}</h3>{selected.episode && <p className="text-xs text-[#A0A0A0]">Season {selected.episode.season} · Episode {selected.episode.number}</p>}</div><button className="rounded-full bg-black/40 p-2" onClick={onClose}><Icon name="close" className="size-5" /></button></div>
                    <div className="space-y-4"><div className="relative h-1.5 overflow-hidden rounded-full bg-white/20"><div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${bufferedPercent}%` }} /><div className="absolute inset-y-0 left-0 bg-[#FF2D55]" style={{ width: `${progress}%` }} /><input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { const t = Number(e.target.value); if (videoRef.current) videoRef.current.currentTime = t; setCurrentTime(t); }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" /></div><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button className="player-btn" onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }}><Icon name="skipBack" className="size-5" /></button><button className="player-btn h-12 w-12" onClick={() => (playing ? videoRef.current.pause() : videoRef.current.play())}>{playing ? <Icon name="pause" className="size-6" /> : <Icon name="play" className="ml-0.5 size-6" />}</button><button className="player-btn" onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}><Icon name="skipForward" className="size-5" /></button><span className="text-xs text-[#A0A0A0]">{formatTime(currentTime)} / {formatTime(duration)}</span></div><div className="flex items-center gap-2"><button className="player-btn" onClick={() => setShowEpisodes((p) => !p)}>Episodes</button><button className="player-btn">Quality</button><button className="player-btn">Subtitles</button><button className="player-btn">Speed</button><button className="player-btn">PIP</button><button className="player-btn">Theater</button><label className="player-btn gap-2 px-3 text-xs text-[#A0A0A0]"><span>Auto next</span><input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} /></label></div></div></div>
                </div>
            </div>
            {showEpisodes && episodes.length > 0 && <div className="absolute right-4 top-24 z-40 w-80 rounded-2xl border border-[#2A2A2A] bg-[#111111]/95 p-3 shadow-2xl"><div className="mb-2 flex items-center justify-between"><h4 className="text-sm font-semibold">Episode List</h4><button onClick={() => setShowEpisodes(false)}><Icon name="close" className="size-4 text-[#A0A0A0]" /></button></div><div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">{episodes.map((ep) => { const epDownload = ep.downloads?.[0]; const key = `${activeItem.id}:${ep.id}`; const pct = Number(localStorage.getItem(`f2m-progress:${key}`) || '0'); const selectedEpisode = selected?.episode?.id === ep.id; return <button key={ep.id} onClick={() => setSelected({ ...epDownload, episode: ep })} className={`w-full rounded-xl border p-3 text-left ${selectedEpisode ? 'border-[#FF2D55] bg-[#1F1F1F]' : 'border-[#2A2A2A] bg-[#171717]'}`}><div className="text-xs text-[#A0A0A0]">Season {ep.season}</div><div className="text-sm font-semibold">Episode {ep.number}</div><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#FF2D55]" style={{ width: `${Math.min(100, pct)}%` }} /></div></button>; })}</div></div>}
        </aside>
    );
};

const LibraryPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const selectedId = id ? Number(id) : null;
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);
    const [search, setSearch] = useState('');
    const [autoNext, setAutoNext] = useState(true);

    useEffect(() => { setLoading(true); apiFetch('/api/media', {}, token).then((res) => res.json()).then((data) => setMedia(data.data || [])).catch(() => setMedia([])).finally(() => setLoading(false)); }, [token]);
    useEffect(() => { if (!selectedId) return setDetails(null); apiFetch(`/api/media/${selectedId}`, {}, token).then((res) => res.ok ? res.json() : null).then((data) => setDetails(data || null)).catch(() => setDetails(null)); }, [selectedId, token]);

    const filtered = useMemo(() => { const term = search.trim().toLowerCase(); return term ? media.filter((item) => item.title?.toLowerCase().includes(term)) : media; }, [media, search]);
    const suggestions = filtered.slice(0, 5);
    const featured = filtered[0];
    const continueWatching = filtered.slice(0, 12);
    const trending = [...filtered].sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0)).slice(0, 12);
    const newReleases = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 12);
    const library = filtered.slice(0, 24);
    const progressMap = useMemo(() => Object.fromEntries(media.map((item) => [item.id, Number(localStorage.getItem(`f2m-progress:${item.id}:movie`)) > 0 ? 40 : 8])), [media]);

    return (
        <div className="min-h-screen bg-[#0F0F0F] pb-24 pt-20 text-[#F1F1F1]" dir="ltr">
            <TopNav search={search} setSearch={setSearch} suggestions={search ? suggestions : []} active={location.pathname.startsWith('/admin') ? '/admin' : location.pathname.startsWith('/account') ? '/account' : '/'} onPickSuggestion={(pickedId) => navigate(`/media/${pickedId}`)} />
            <main className="mx-auto grid max-w-[1600px] gap-6 px-4 md:px-8 xl:grid-cols-[minmax(0,1fr)_380px]">
                <section className="space-y-7 transition-all duration-300">
                    <section className="relative overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#161616] p-6 md:p-8"><div className="absolute inset-0 bg-gradient-to-r from-[#FF2D55]/20 via-transparent to-transparent" /><div className="relative max-w-3xl space-y-4"><p className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#111111] px-3 py-1 text-xs font-semibold text-[#A0A0A0]">HyperDark Cinema</p><h1 className="text-3xl font-bold md:text-4xl">{featured?.title || 'Your premium streaming universe'}</h1><p className="max-w-2xl text-sm text-[#A0A0A0]">{featured?.synopsis || 'Continue watching your favorites, discover what is trending, and build your personal cinema library.'}</p>{featured && <button onClick={() => navigate(`/media/${featured.id}`)} className="rounded-full bg-[#FF2D55] px-5 py-2 text-sm font-semibold transition hover:brightness-110">Play Featured Title</button>}</div></section>
                    <RowSection title="Continue Watching" items={continueWatching} loading={loading} onSelect={(mediaId) => navigate(`/media/${mediaId}`)} progressMap={progressMap} />
                    <RowSection title="Trending" items={trending} loading={loading} onSelect={(mediaId) => navigate(`/media/${mediaId}`)} progressMap={progressMap} />
                    <RowSection title="New Releases" items={newReleases} loading={loading} onSelect={(mediaId) => navigate(`/media/${mediaId}`)} progressMap={progressMap} />
                    <section className="space-y-3"><h2 className="text-lg font-semibold">Your Library</h2>{loading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="shimmer aspect-video rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]" />)}</div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{library.map((item) => <PosterCard key={`grid-${item.id}`} item={item} progress={progressMap[item.id] || 0} onClick={() => navigate(`/media/${item.id}`)} />)}</div>}</section>
                </section>
                {selectedId && details?.media && <section className="xl:sticky xl:top-24 xl:self-start transition-all duration-300"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#A0A0A0]">Now Playing</h2><button onClick={() => navigate('/')} className="rounded-full border border-[#2A2A2A] p-2 text-[#A0A0A0] hover:text-[#F1F1F1]"><Icon name="close" className="size-4" /></button></div><Player activeItem={details.media} details={details} autoNext={autoNext} setAutoNext={setAutoNext} onClose={() => navigate('/')} /></section>}
            </main>
            <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-[#2A2A2A] bg-[#111111]/95 p-3 text-xs md:hidden"><Link className="mobile-nav-link" to="/">Home</Link><button className="mobile-nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Search</button><button className="mobile-nav-link" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Library</button><Link className="mobile-nav-link" to="/account">Profile</Link></nav>
        </div>
    );
};

const AuthPage = ({ mode }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const isLogin = mode === 'login';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) await login({ email, password }); else await register({ name, email, password });
            navigate('/');
        } catch {
            setError(isLogin ? 'Login failed. Please verify your credentials.' : 'Registration failed.');
        }
    };

    return <div className="grid min-h-screen place-content-center bg-[#0F0F0F] p-4" dir="ltr"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl border border-[#2A2A2A] bg-[#151515] p-8"><h1 className="text-2xl font-bold">{isLogin ? 'Welcome back to F2M HyperPlayer' : 'Create your F2M HyperPlayer account'}</h1>{!isLogin && <input value={name} onChange={(e) => setName(e.target.value)} className="auth-input" placeholder="Name" required />}<input value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="Email" type="email" required /><input value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="Password" type="password" required />{error && <div className="text-sm text-[#FF6B8D]">{error}</div>}<button className="w-full rounded-xl bg-[#FF2D55] py-3 text-sm font-semibold">{isLogin ? 'Login' : 'Register'}</button><p className="text-sm text-[#A0A0A0]">{isLogin ? 'Need an account?' : 'Already have an account?'} <Link className="text-[#F1F1F1] underline" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Login'}</Link></p></form></div>;
};

const AccountPage = () => {
    const { user } = useAuth();
    return <div className="min-h-screen bg-[#0F0F0F] p-8 pt-24" dir="ltr"><TopNav search="" setSearch={() => {}} suggestions={[]} active="/account" onPickSuggestion={() => {}} /><div className="mx-auto max-w-4xl rounded-3xl border border-[#2A2A2A] bg-[#151515] p-8"><h1 className="text-3xl font-bold">Account</h1><p className="mt-2 text-[#A0A0A0]">Signed in as {user?.name || 'User'}.</p></div></div>;
};

const AdminPage = () => <div className="min-h-screen bg-[#0F0F0F] p-8 pt-24" dir="ltr"><TopNav search="" setSearch={() => {}} suggestions={[]} active="/admin" onPickSuggestion={() => {}} /><div className="mx-auto max-w-4xl rounded-3xl border border-[#2A2A2A] bg-[#151515] p-8"><h1 className="text-3xl font-bold">Admin</h1><p className="mt-2 text-[#A0A0A0]">Crawl, curate, and manage your media pipeline from here.</p></div></div>;

const RootApp = () => (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route path="/*" element={<RequireAuth><Routes><Route path="/" element={<LibraryPage />} /><Route path="/media/:id" element={<LibraryPage />} /><Route path="/account" element={<AccountPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></RequireAuth>} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);

createRoot(document.getElementById('app')).render(<RootApp />);
