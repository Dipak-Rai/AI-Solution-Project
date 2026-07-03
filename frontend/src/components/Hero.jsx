import React from 'react';
import heroImg from '../photo/home_page.png';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-32" style={{ backgroundColor: '#0a0e27' }}>
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.05) 25%, rgba(0, 240, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.05) 25%, rgba(0, 240, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.05) 75%, rgba(0, 240, 255, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white py-12">
            <p className="text-sm uppercase tracking-widest text-cyan-400 font-semibold mb-4">Next Generation AI Technology</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
              Futuristic
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">AI Solutions</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mb-8">
              Enterprise-grade AI consulting, machine learning solutions, and automation services powered by quantum-ready algorithms and holographic interfaces for tomorrow's enterprises.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="inline-block px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                Launch Your AI Journey
              </a>
              <a href="#services" className="inline-block px-8 py-3 rounded-lg font-semibold text-cyan-400 bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300">
                Explore Services
              </a>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div
              className="relative w-full max-w-md h-96 rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 240, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <img src={heroImg} alt="Futuristic AI interface" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;