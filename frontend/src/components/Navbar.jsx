
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../logo/c1056a23-37cb-49db-bcbb-5d0bfde481d5.png';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/#services' },
  { label: 'Articles', to: '/#articles' },
  { label: 'Gallery', to: '/#gallery' },
  { label: 'Ratings', to: '/ratings' },
  { label: 'Contact', to: '/#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const location =
    useLocation();

  const toggleMenu = () =>
    setIsOpen((v) => !v);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(
        window.scrollY > 8
      );

    onScroll();

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      );
  }, []);

  const activeItem = (path) => {
    const hash =
      path.startsWith('/#');

    return hash
      ? location.hash ===
          path.slice(1)
      : location.pathname ===
          path;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500`}> 

      <div
        style={{ maxWidth: '1440px', width: 'calc(100% - 40px)', margin: '16px auto' }}
        className={`rounded-[32px] overflow-hidden relative z-50 transition-all duration-500`}
      >

        <div className={`px-6 py-3 ${scrolled ? 'bg-[#07152f]/85 border border-cyan-500/15 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,.35)]' : 'bg-[#07152f]/70 border-transparent backdrop-blur-xl'}`}>

          <div className="grid grid-cols-3 items-center gap-6">

            {/* Left: logo */}
            <div className="col-span-1 flex items-center">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-cyan-500/30 bg-white shadow-[0_4px_20px_rgba(6,182,212,0.1)] hover:border-cyan-400/50 transition-all duration-300">
                  <img src={logo} alt="logo" className="w-full h-full object-cover" />
                </div>

                <div className="hidden md:block">
                  <h2 className="text-2xl font-black text-white leading-tight">AI <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">-Solutions</span></h2>
                  <p className="text-[9px] uppercase tracking-[3px] text-slate-500 font-medium">Enterprise AI</p>
                </div>
              </Link>
            </div>

            {/* Center: nav (desktop only) */}
            <div className="col-span-1 flex justify-center">
              <nav aria-label="Primary navigation" className="hidden lg:flex navbar-links">
                <div className="flex items-center gap-10">
                  {navItems.map((item) => (
                    <Link key={item.label} to={item.to} className={`nav-link ${activeItem(item.to) ? 'active' : ''} px-3 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 rounded-lg hover:text-white`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>

            {/* Right: admin button (desktop) + hamburger (mobile) */}
            <div className="col-span-1 flex items-center justify-end gap-3">
              <Link to="/admin/login" className="hidden lg:inline-flex navbar-admin items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 shadow-[0_8px_30px_rgba(6,182,212,0.15)] hover:shadow-[0_16px_50px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/40">Admin Portal</Link>

              <button onClick={toggleMenu} className="lg:hidden text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30">
                <svg className="h-8 w-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Menu */}

        <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-[700px]' : 'max-h-0'}`}>
          <div className="border-t border-white/8 p-5 lg:hidden bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-transparent">
            <div className="space-y-2">
              {navItems.map((item, idx) => (
                <Link key={item.label} to={item.to} onClick={() => setIsOpen(false)} style={{ animationDelay: `${idx * 50}ms` }} className={`navbar-mobile-item block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${activeItem(item.to) ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'}`}>
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-white/8">
                <Link to="/admin/login" onClick={() => setIsOpen(false)} style={{ animationDelay: `${navItems.length * 50}ms` }} className="navbar-mobile-item block rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 py-3 px-4 text-center font-semibold text-white transition-all duration-300 hover:shadow-[0_12px_35px_rgba(6,182,212,0.2)]">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

