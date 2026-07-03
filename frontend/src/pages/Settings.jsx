import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // profile
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Administrator');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // appearance
  const [themePreview, setThemePreview] = useState(() => localStorage.getItem('admin_theme') || 'light');
  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'light');

  // notifications
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const resp = await api.get('/admin/profile').catch(() => null);
        if (resp && resp.data) {
          const p = resp.data;
          if (!mounted) return;
          setFullName(p.fullName || p.name || '');
          setEmail(p.email || '');
          setRole(p.role || 'Administrator');
          setUsername(p.username || '');
          setBio(p.bio || '');
          if (p.avatar) setPreview(p.avatar);
        } else {
          const stored = JSON.parse(localStorage.getItem('adminProfile') || 'null');
          if (stored && mounted) {
            setFullName(stored.fullName || '');
            setEmail(stored.email || '');
            setRole(stored.role || 'Administrator');
            setUsername(stored.username || '');
            setBio(stored.bio || '');
            setPreview(stored.avatar || '');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setAvatar(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setMessage('');
    setError('');
    const payload = { fullName, email, role, username, bio, avatar: preview };
    try {
      const resp = await api.put('/admin/profile', payload).catch(() => null);
      if (resp && resp.status >= 200 && resp.status < 300) {
        setMessage('Profile updated successfully');
      } else {
        localStorage.setItem('adminProfile', JSON.stringify(payload));
        setMessage('Profile saved locally (no server endpoint)');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save profile');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3500);
  };

  const validatePassword = () => {
    if (!newPassword) {
      setError('New password required');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    setMessage('');
    setError('');
    if (!validatePassword()) return;
    try {
      const resp = await api.post('/admin/change-password', { currentPassword, newPassword }).catch(() => null);
      if (resp && resp.status >= 200 && resp.status < 300) {
        setMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage('Password change simulated (no server endpoint)');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to change password');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3500);
  };

  const handleSaveAppearance = () => {
    localStorage.setItem('admin_theme', themePreview);
    setTheme(themePreview);
    setMessage('Appearance updated');
    setTimeout(() => setMessage(''), 2500);
  };

  const pageTheme = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-950';
  const pageGradient = theme === 'dark'
    ? 'linear-gradient(135deg, #020617 0%, #091028 50%, #07192f 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';

  return (
    <div className={`min-h-screen py-8 ${pageTheme}`} style={{ background: pageGradient }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[32px] border border-cyan-500/10 bg-slate-950/40 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Settings</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Administrator control center</h1>
              <p className="max-w-2xl text-sm text-slate-300">A professional, responsive panel for managing profile settings, security, and appearance in one place.</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              Back to dashboard
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass-card rounded-[28px] border border-cyan-500/10 bg-slate-950/45 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Navigation</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Quick access</h2>
              </div>

              <div className="space-y-3">
                {['profile', 'appearance', 'security'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${activeTab === tab ? 'bg-cyan-500/20 text-cyan-100 shadow-[0_10px_30px_rgba(15,184,255,0.12)]' : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-cyan-500/30 hover:text-white'}`}
                  >
                    {tab === 'profile' ? 'Profile' : tab === 'appearance' ? 'Appearance' : 'Security'}
                  </button>
                ))}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status summary</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
                    <span>Profile status</span>
                    <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-xs text-cyan-100">Live</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-3">
                    <span>Theme mode</span>
                    <span className="rounded-full bg-slate-700/80 px-2 py-1 text-xs text-slate-300">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="glass-card rounded-[28px] border border-cyan-500/10 bg-slate-950/45 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              {message && <div className="mb-4 rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-500/10">{message}</div>}
              {error && <div className="mb-4 rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/10">{error}</div>}

              {activeTab === 'profile' && (
                <section className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-cyan-500/20 bg-slate-800">
                        {preview ? (
                          <img src={preview} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-500">No photo</div>
                        )}
                      </div>
                      <div className="mt-6 space-y-3 text-sm text-slate-300">
                        <p className="font-medium text-white">Administrator profile</p>
                        <p>Update your identity, contact email, and personal bio for a polished admin presence.</p>
                      </div>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                        <input type="file" onChange={handleAvatarChange} className="hidden" />Upload photo
                      </label>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">Full name</label>
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name"
                            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">Role</label>
                          <input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Role"
                            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
                          <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Bio"
                          className="min-h-[140px] w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button onClick={handleSaveProfile} className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Save profile</button>
                        <button onClick={() => window.location.reload()} className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-950 transition hover:border-cyan-400/40">Discard changes</button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'appearance' && (
                <section className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {['light', 'dark'].map((mode) => {
                      const selected = themePreview === mode;
                      return (
                        <div
                          key={mode}
                          className={`rounded-[28px] border p-5 transition ${selected ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_20px_70px_rgba(6,182,212,0.14)]' : 'border-slate-700 bg-slate-900/70'}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{mode === 'light' ? 'Light mode' : 'Dark mode'}</p>
                              <p className="mt-1 text-xs text-slate-400">{mode === 'light' ? 'Bright, modern workspace' : 'Premium dark console'}</p>
                            </div>
                            {selected && <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100">Selected</span>}
                          </div>
                          <div className={`mt-5 h-32 rounded-[24px] ${mode === 'light' ? 'bg-gradient-to-b from-slate-100 to-slate-200' : 'bg-gradient-to-b from-slate-800 to-slate-950'} border border-white/5`} />
                          <button
                            onClick={() => setThemePreview(mode)}
                            className="mt-5 w-full rounded-full border  border-slate-700 px-4 py-3 text-sm text-slate-950 transition hover:border-cyan-400/40"
                          >
                            Choose {mode}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={handleSaveAppearance} className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Apply theme</button>
                    <button onClick={() => setThemePreview(theme)} className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-950 transition hover:border-cyan-400/40">Reset preview</button>
                  </div>
                </section>
              )}

              {activeTab === 'security' && (
                <section className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-[28px] border border-slate-700 bg-slate-900/80 p-6">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Change password</p>
                      <div className="mt-5 space-y-4">
                        <input
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Current password"
                          type="password"
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                        />
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          type="password"
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                        />
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          type="password"
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/70"
                        />
                      </div>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button onClick={handleChangePassword} className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Update password</button>
                        <button
                          onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-950 transition hover:border-cyan-400/40"
                        >
                          Clear fields
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-700 bg-slate-900/80 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Active sessions</p>
                          <p className="mt-2 text-sm text-slate-500">Review and revoke active sessions to keep your account secure.</p>
                        </div>
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100">Secure</span>
                      </div>
                      <div className="mt-6 space-y-4">
                        {['This device', 'Other session'].map((session, idx) => (
                          <div key={idx} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-white">{session}</p>
                                <p className="text-xs text-slate-500">Last active {session === 'This device' ? 'now' : 'earlier today'}</p>
                              </div>
                              <button className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-950 transition hover:border-cyan-400/40">Sign out</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-5 text-sm text-slate-500">Revoke any session you no longer recognize.</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
