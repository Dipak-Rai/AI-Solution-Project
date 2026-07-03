import React from 'react';
import aboutImg from '../photo/about.png';
import {
  Brain,
  ShieldCheck,
  BarChart3,
  Rocket,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Strategic Delivery',
    desc: 'From discovery through production, we align AI initiatives with business priorities, governance, and operational readiness.',
  },
  {
    icon: ShieldCheck,
    title: 'Operational Confidence',
    desc: 'Secure, scalable solutions with monitoring, compliance, and lifecycle support built into every deployment.',
  },
  {
    icon: Rocket,
    title: 'Cross-functional Expertise',
    desc: 'AI research, engineering, and product strategy combined into practical enterprise solutions.',
  },
  {
    icon: BarChart3,
    title: 'Value-focused Outcomes',
    desc: 'Fast time-to-value through measurable KPIs and business-driven execution.',
  },
];

const stats = [
  {
    value: '150+',
    label: 'AI Deployments',
  },
  {
    value: '95%',
    label: 'Client Satisfaction',
  },
  {
    value: '24/7',
    label: 'System Monitoring',
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-24"
    >
      {/* Background image (low opacity, only for About) */}
      <div
        className="absolute inset-0 bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: `url(${aboutImg})`,
          opacity: 0.20,
          mixBlendMode: 'normal',
        }}
      />
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-500/10 blur-[160px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-cyan-300 mb-6">
            <Sparkles size={18} />
            AI SOLUTIONS COMPANY
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            About Our
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Firm
            </span>
          </h2>

          <p className="mt-8 text-lg text-slate-300 leading-8 max-w-3xl mx-auto">
            Enterprise AI solutions built for measurable outcomes.
            We help organizations design, deploy, and scale intelligent
            systems that improve decisions, reduce risk, and unlock
            long-term business value.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">

          {stats.map((item, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-8
                text-center
                hover:border-cyan-400/40
                transition
              "
            >
              <h3 className="text-5xl font-bold text-cyan-400">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-300">
                {item.label}
              </p>
            </div>
          ))}

        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  relative
                  rounded-3xl
                  border
                  border-white/10
                  bg-gradient-to-br
                  from-white/5
                  to-white/[0.02]
                  p-8
                  backdrop-blur-xl
                  hover:-translate-y-2
                  hover:border-cyan-400/40
                  transition-all
                  duration-500
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    rounded-3xl
                    opacity-0
                    group-hover:opacity-100
                    bg-gradient-to-r
                    from-cyan-500/5
                    to-blue-500/5
                    transition
                  "
                />

                <div className="relative z-10">

                  <div
                    className="
                      mb-5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-cyan-500/15
                      text-cyan-400
                    "
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="text-2xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-300">
                    {item.desc}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-col sm:flex-row justify-center gap-5">

          <a
            href="#contact"
            className="
              rounded-xl
              bg-cyan-500
              px-8
              py-4
              text-white
              font-semibold
              hover:scale-105
              transition
            "
          >
            Engage Our Team
          </a>

          <a
            href="#contact"
            className="
              rounded-xl
              border
              border-white/20
              px-8
              py-4
              text-white
              hover:bg-white/10
              transition
            "
          >
            Review Case Studies
          </a>

        </div>

      </div>
    </section>
  );
};

export default About;