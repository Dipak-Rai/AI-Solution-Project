import React, { useState } from 'react';
import aiConsultingImg from '../photo/ai cunsulting.png';
import machineLearningImg from '../photo/mechine learning solution.png';
import automationServicesImg from '../photo/automation services.png';
import dataAnalyticsImg from '../photo/data analytics.png';
import virtualAssistanceImg from '../photo/virtual assistance.png';
import rapidPrototypingImg from '../photo/rapid prototyping.png';

const Icon = ({ children }) => (
  <div
    className="
      relative
      h-14
      w-14
      rounded-2xl
      bg-gradient-to-br
      from-cyan-500/15
      to-blue-500/10
      border
      border-cyan-400/20
      flex
      items-center
      justify-center
      text-2xl
      backdrop-blur-lg
      shadow-lg
    "
  >
    {children}
  </div>
);

const ServiceCard = ({ title, description, icon, image }) => {
  const [open, setOpen] = useState(false);

  const detailsId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-details`;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-7
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-cyan-400/40
        hover:bg-white/[0.06]
        hover:shadow-[0_25px_80px_rgba(0,180,255,.18)]
      "
    >
      <div
        className="absolute inset-0 bg-center bg-cover opacity-70 blur-0 transition-all duration-500 group-hover:opacity-40 group-hover:blur-sm"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          bg-gradient-to-br
          from-cyan-500/[0.04]
          to-blue-500/[0.04]
          transition
        "
      />

      <div className="relative z-10">

        <div className="flex items-start gap-5">

          <Icon>{icon}</Icon>

          <div className="flex-1">

            <h3
              className="
                text-xl
                font-bold
                text-white
                mb-2
              "
            >
              {title}
            </h3>

            <p
              className="
                text-slate-300
                leading-7
              "
            >
              {description.slice(0, 90)}
              {description.length > 90 ? '…' : ''}
            </p>

          </div>

          <button
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-cyan-300 hover:bg-cyan-500/10 hover:text-white transition-transform duration-200 transform-gpu active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          >
            <span className="text-sm font-medium">{open ? 'Hide' : 'Details'}</span>
            <svg className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        {open && (
          <div
            className="
              mt-6
              pt-6
              border-t
              border-white/10
            "
          >
            <p
              className="
                text-slate-300
                leading-8
              "
            >
              {description}
            </p>

            <div className="mt-5">
              <a
                href="#contact"
                className="
                  btn-primary
                  inline-flex
                  items-center
                  shadow-[0_10px_40px_rgba(0,180,255,.25)]
                "
              >
                Talk to an expert
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const services = [
  {
    title: 'AI Consulting',
    description:
      'Strategic guidance for AI implementation and digital transformation tailored to your enterprise.',
    icon: '🧠',
    image: aiConsultingImg,
  },
  {
    title: 'Machine Learning Solutions',
    description:
      'Custom ML models and algorithms designed for your specific business challenges.',
    icon: '⚙️',
    image: machineLearningImg,
  },
  {
    title: 'Automation Services',
    description:
      'Intelligent automation to streamline processes and reduce operational overhead.',
    icon: '⚡',
    image: automationServicesImg,
  },
  {
    title: 'Data Analytics',
    description:
      'Advanced analytics and insights from your data to drive strategic decisions.',
    icon: '📊',
    image: dataAnalyticsImg,
  },
  {
    title: 'Virtual Assistance',
    description:
      'AI-powered virtual assistants that enhance employee and customer experiences.',
    icon: '🤖',
    image: virtualAssistanceImg,
  },
  {
    title: 'Rapid Prototyping',
    description:
      'Quick-turn prototypes and proof-of-concepts for AI-driven innovation.',
    icon: '🚀',
    image: rapidPrototypingImg,
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        py-24
        bg-gradient-to-b
        from-[#070B14]
        via-[#08101D]
        to-[#050913]
      "
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-600/10 blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span
            className="
              inline-block
              px-5
              py-2
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              text-cyan-400
              text-sm
              tracking-widest
              uppercase
              mb-6
            "
          >
            Enterprise Solutions
          </span>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-extrabold
              text-white
              mb-6
            "
          >
            Our AI Services
          </h2>

          <p
            className="
              text-slate-300
              max-w-3xl
              mx-auto
              leading-8
            "
          >
            Comprehensive AI solutions for modern enterprises.
            From strategy to deployment, we deliver cutting-edge
            technology and measurable results.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              image={service.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;

