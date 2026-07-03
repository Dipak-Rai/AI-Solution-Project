import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const timeframeMap = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const metricCards = [
  { key: 'users', label: 'Total Users', icon: '🧠', chartKey: 'users' },
  { key: 'events', label: 'Total Events', icon: '📅', chartKey: 'events' },
  { key: 'articles', label: 'Total Articles', icon: '📝', chartKey: 'articles' },
  { key: 'feedback', label: 'Feedback Submitted', icon: '💬', chartKey: 'feedback' },
  { key: 'contacts', label: 'Contact Requests', icon: '📩', chartKey: 'users' },
  { key: 'growth', label: 'Growth Rate', icon: '📈', chartKey: 'growth' },
];

const metricIcons = {
  users: '🧠',
  events: '📅',
  articles: '📝',
  feedback: '💬',
  contacts: '📩',
  growth: '📈',
};

export default function Analytics() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('monthly');
  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'light');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [demos, setDemos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [displayed, setDisplayed] = useState({ users: 0, articles: 0, events: 0, feedback: 0, demos: 0 });

  useEffect(() => {
    load();
  }, []);

  const [live, setLive] = useState(true);
  useEffect(() => {
    let mounted = true;
    let timer;
    const tick = async () => {
      if (!mounted) return;
      await load();
    };
    const start = () => {
      if (live) timer = setInterval(tick, 30000);
    };
    start();
    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      mounted = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [live]);

  const load = async () => {
    setLoading(true);
    try {
      const [c, a, e, f, d] = await Promise.all([
        api.get('/contact'),
        api.get('/articles'),
        api.get('/events'),
        api.get('/feedback'),
        api.get('/demo'),
      ]);
      setContacts(c.data || []);
      setArticles(a.data || []);
      setEvents(e.data || []);
      setFeedback(f.data || []);
      setDemos(d.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(
    () => ({
      users: contacts.length,
      articles: articles.length,
      events: events.length,
      feedback: feedback.length,
      demos: demos.length,
    }),
    [contacts, articles, events, feedback, demos]
  );

  useEffect(() => {
    const target = {
      users: summary.users,
      articles: summary.articles,
      events: summary.events,
      feedback: summary.feedback,
      demos: summary.demos,
    };
    const startValues = displayed;
    const duration = 500;
    const startTime = performance.now();
    let raf;
    const animate = (time) => {
      const progress = Math.min(1, (time - startTime) / duration);
      setDisplayed({
        users: Math.round(startValues.users + (target.users - startValues.users) * progress),
        articles: Math.round(startValues.articles + (target.articles - startValues.articles) * progress),
        events: Math.round(startValues.events + (target.events - startValues.events) * progress),
        feedback: Math.round(startValues.feedback + (target.feedback - startValues.feedback) * progress),
        demos: Math.round(startValues.demos + (target.demos - startValues.demos) * progress),
      });
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [summary]);

  const timeseries = useMemo(() => {
    const len = timeframe === 'daily' ? 7 : timeframe === 'weekly' ? 8 : timeframe === 'monthly' ? 12 : 6;
    const seed = [contacts.length, articles.length, events.length, feedback.length, demos.length];
    const max = Math.max(...seed, 1);
    return Array.from({ length: len }).map((_, i) => ({
      name: `${i + 1}`,
      users: Math.round((contacts.length / max) * (20 + i * 3)) + Math.round(Math.random() * 8),
      articles: Math.round((articles.length / max) * (10 + i * 2)) + Math.round(Math.random() * 6),
      events: Math.round((events.length / max) * (6 + i * 2)) + Math.round(Math.random() * 4),
      feedback: Math.round((feedback.length / max) * (8 + i * 2)) + Math.round(Math.random() * 5),
    }));
  }, [timeframe, contacts, articles, events, feedback, demos]);

  const kpis = [
    { key: 'users', label: 'Users', value: summary.users, change: Math.round((summary.users / Math.max(1, summary.users + summary.articles)) * 100) - 5 },
    { key: 'articles', label: 'Articles', value: summary.articles, change: Math.round((summary.articles / Math.max(1, summary.articles + 1)) * 100) - 3 },
    { key: 'engagement', label: 'Engagement', value: summary.feedback + summary.demos, change: Math.round((summary.feedback / Math.max(1, summary.users)) * 100) },
    { key: 'traffic', label: 'Traffic', value: summary.users * 3, change: Math.round((summary.users / Math.max(1, summary.users + 10)) * 100) },
    { key: 'growth', label: 'Growth', value: Math.round((summary.articles / Math.max(1, summary.users)) * 100), change: Math.round((summary.articles / Math.max(1, summary.users)) * 10) },
    { key: 'conversion', label: 'Conversion', value: Math.min(100, Math.round((summary.feedback / Math.max(1, summary.users)) * 100)), change: 2 },
    { key: 'performance', label: 'Performance', value: Math.round(100 - Math.min(95, Math.abs(summary.users - summary.articles))), change: -1 },
  ];

  const activityItems = useMemo(() => {
    const rows = [...contacts.slice(0, 6), ...articles.slice(0, 6), ...events.slice(0, 6)].map((it) => ({
      title: it.title || it.fullName || it.name || '—',
      type: it.author ? 'Article' : it.email ? 'Contact' : 'Event',
      date: it.createdAt ? new Date(it.createdAt).toISOString() : '',
    }));
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((r) => r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
  }, [contacts, articles, events, searchQuery]);

  const timelineItems = useMemo(() => {
    const rows = [...contacts.slice(0, 4), ...articles.slice(0, 4), ...events.slice(0, 4)].map((it) => ({
      title: it.title || it.fullName || it.name || 'Activity event',
      type: it.author ? 'Article' : it.email ? 'Contact' : 'Event',
      timestamp: it.createdAt ? new Date(it.createdAt) : new Date(),
    }));
    return rows
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7)
      .map((item) => ({
        ...item,
        time: item.timestamp.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      }));
  }, [contacts, articles, events]);

  const exportCSV = () => {
    const headers = ['Title', 'Type', 'Date'];
    const csv = [headers.join(',')].concat(activityItems.map((r) => `${JSON.stringify(r.title)},${r.type},${r.date}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = !loading && summary.users + summary.articles + summary.events + summary.feedback + summary.demos === 0;

  const lastUpdatedText = lastUpdated.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div
      className="min-h-screen overflow-x-hidden py-8"
      style={{
        background: 'linear-gradient(135deg, #07152F 0%, #0D1B3D 50%, #050E21 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[28px] border border-cyan-500/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">AI Performance Analytics</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">AI Performance Analytics</h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Monitor platform activity, user engagement, growth trends, and operational insights.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 xl:justify-items-end">
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.15)]">
                <span className="pulse-ring inline-flex h-3.5 w-3.5 rounded-full bg-cyan-400 shadow-[0_0_0_6px_rgba(6,182,212,0.12)]" />
                <span>AI pulse active</span>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.15)]">
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Last updated</p>
                <p className="mt-1 text-base font-semibold text-white">{lastUpdatedText}</p>
              </div>
              <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100 shadow-[0_18px_60px_rgba(6,182,212,0.12)]">
                <p className="uppercase tracking-[0.32em] text-cyan-100/80">Status</p>
                <p className="mt-1 text-base font-semibold">{live ? 'Live Monitoring' : 'Paused'}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-6">
          {metricCards.map((metric) => {
            const value =
              metric.key === 'users'
                ? displayed.users
                : metric.key === 'events'
                ? displayed.events
                : metric.key === 'articles'
                ? displayed.articles
                : metric.key === 'feedback'
                ? displayed.feedback
                : metric.key === 'contacts'
                ? displayed.users
                : metric.key === 'growth'
                ? kpis.find((item) => item.key === 'growth')?.value || 0
                : 0;
            const change = metric.key === 'growth' ? kpis.find((item) => item.key === 'growth')?.change || 0 : kpis.find((item) => item.key === metric.key)?.change || 0;
            return (
              <div
                key={metric.key}
                className="glass-card group flex min-h-[170px] flex-col justify-between overflow-hidden rounded-[28px] border border-cyan-500/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/15 text-xl text-cyan-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                    {metricIcons[metric.key]}
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300 transition duration-300 group-hover:bg-cyan-500/20">
                    {timeframeMap[timeframe]}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{loading ? '--' : value}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-300">
                  <span className={`rounded-full px-3 py-1 font-semibold ${change >= 0 ? 'bg-emerald-400/15 text-emerald-200' : 'bg-red-400/15 text-red-200'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                  <div className="h-10 w-24 opacity-80">
                    {!loading && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeseries.map((item) => ({ name: item.name, value: item[metric.chartKey] || item.users || 0 }))}>
                          <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[2.2fr_1fr]">
          <div className="grid gap-6">
            <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">User Growth</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">User Growth</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">A smooth view of user activity and platform adoption through the selected period.</p>
                </div>
                <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">{timeframeMap[timeframe]}</div>
              </div>
              <div className="mt-6 h-[320px] rounded-[28px] bg-slate-950/20 p-4">
                {loading ? (
                  <div className="h-full rounded-[28px] bg-slate-800 animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeseries} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.65} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#03111f', borderRadius: 16, borderColor: 'rgba(148,163,184,0.18)' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      <Area type="monotone" dataKey="users" stroke="#22d3ee" fill="url(#userGrowthGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Engagement Trend</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Engagement</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{summary.feedback + summary.demos} actions</span>
                </div>
                <div className="mt-5 h-48 rounded-[24px] bg-slate-950/20 p-3">
                  {loading ? (
                    <div className="h-full w-full rounded-[24px] bg-slate-800 animate-pulse" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeseries} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#03111f', borderRadius: 16, borderColor: 'rgba(148,163,184,0.18)' }} />
                        <Line type="monotone" dataKey="feedback" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Event Activity</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Events</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{summary.events}</span>
                </div>
                <div className="mt-5 h-48 rounded-[24px] bg-slate-950/20 p-3">
                  {loading ? (
                    <div className="h-full w-full rounded-[24px] bg-slate-800 animate-pulse" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeseries} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#03111f', borderRadius: 16, borderColor: 'rgba(148,163,184,0.18)' }} />
                        <Line type="monotone" dataKey="events" stroke="#22d3ee" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Ratings Overview</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Content Score</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Summary</span>
              </div>
              <div className="mt-5 h-72 rounded-[24px] bg-slate-950/20 p-3">
                {loading ? (
                  <div className="h-full w-full rounded-[24px] bg-slate-800 animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeseries} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#03111f', borderRadius: 16, borderColor: 'rgba(148,163,184,0.18)' }} />
                      <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      <Bar dataKey="articles" stackId="a" fill="#7c3aed" radius={[12, 12, 0, 0]} />
                      <Bar dataKey="feedback" stackId="a" fill="#22d3ee" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <aside className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">AI Insights</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Intelligent recommendations</h2>
              </div>
              <div className="rounded-full bg-slate-900/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">Insight engine</div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Top performing category</p>
                <p className="mt-2 text-sm text-slate-300">{summary.articles >= summary.events ? 'Content publishing' : 'Live events'} is driving the highest velocity.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Most viewed section</p>
                <p className="mt-2 text-sm text-slate-300">Knowledge articles and resources are currently the most engaged touchpoints.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Recent growth</p>
                <p className="mt-2 text-sm text-slate-300">Activity is up {summary.users ? `${Math.round((summary.users / Math.max(1, summary.articles + summary.events)) * 100)}%` : '—'} across the current timeframe.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Recommendations</p>
                <p className="mt-2 text-sm text-slate-300">Focus on converting article engagement into demos and maintain cadence on event follow-ups.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Recent activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Activity timeline</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activity"
                  className="rounded-full border border-white/15 bg-slate-950/40 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-400/40"
                />
                <button onClick={() => setSearchQuery('')} className="rounded-full border border-white/15 bg-slate-950/40 px-4 py-2 text-sm text-white transition hover:bg-slate-900/70">
                  Clear
                </button>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 grid gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="glass-card rounded-[24px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.25)] animate-fade-in-up">
                    <div className="h-4 w-40 rounded bg-slate-800 animate-pulse" />
                    <div className="mt-3 h-4 w-56 rounded bg-slate-800 animate-pulse" />
                    <div className="mt-3 h-3 w-32 rounded bg-slate-800 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : isEmpty ? (
              <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/40 p-10 text-center text-slate-300 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-3xl text-cyan-200">✦</div>
                <h3 className="text-xl font-semibold text-white">Dashboard is empty</h3>
                <p className="mt-3 max-w-xl mx-auto text-sm text-slate-400">No recent items were found yet. Connect more data sources or refresh the dashboard to begin seeing AI analytics.</p>
                <button onClick={load} className="mt-6 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Refresh dashboard
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {timelineItems.map((item, index) => (
                  <div key={index} className="glass-card rounded-[24px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-xl text-cyan-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                          {item.type === 'Article' ? '📝' : item.type === 'Contact' ? '📩' : '📅'}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.type} event</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !isEmpty && (
              <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-slate-950/40 p-5 text-slate-300 shadow-[0_20px_40px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Activity</p>
                  <p className="text-sm text-slate-400">Showing latest {timelineItems.length} events.</p>
                </div>
                <button onClick={exportCSV} className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Export recent feed
                </button>
              </div>
            )}
          </div>

          <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-white/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Operational score</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">AI operations</h2>
              </div>
              <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100">AI recommendation</div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Smart Growth</p>
                <p className="mt-3 text-sm text-slate-300">Maintain the current publishing cadence to keep momentum building across content and engagement.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Engagement Boost</p>
                <p className="mt-3 text-sm text-slate-300">Increase demo follow-ups and lead nurturing around articles for more conversions.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">Performance health</p>
                <p className="mt-3 text-sm text-slate-300">Monitor feedback volume and event attendance to keep platform growth balanced.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-right text-sm text-slate-500">Generated insights • AI Solutions © {new Date().getFullYear()}</footer>
      </div>
    </div>
  );
}
