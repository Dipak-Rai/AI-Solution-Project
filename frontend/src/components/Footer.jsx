import React from 'react';
import mailIcon from '../icons/mail.png';
import whatsappIcon from '../icons/whatsapp.png';
import footerBg from '../photo/footer.png';

const contactDetails = [
  {
    label: 'Email',
    value: 'dipak@ai-solutions.com',
    href: 'mailto:dipak@ai-solutions.com',
    icon: mailIcon,
  },
  {
    label: 'WhatsApp',
    value: '+977 9813107564',
    href: 'https://wa.me/9779813107564',
    icon: whatsappIcon,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#030712]">

      {/* Background image (footer) */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-30"
          style={{ backgroundImage: `url(${footerBg})` }}
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-[-250px] top-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute right-[-250px] bottom-[-120px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]
            bg-[size:40px_40px]
          "
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">

          {/* Brand */}

          <div>

            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-5
                py-2
                text-xs
                uppercase
                tracking-[4px]
                text-cyan-300
              "
            >
              Enterprise AI Platform
            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
                text-white
              "
            >
              AI
              <span
                className="
                  bg-gradient-to-r
                  from-cyan-300
                  via-blue-400
                  to-indigo-500
                  bg-clip-text
                  text-transparent
                "
              >
                -Solutions
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-md
                leading-8
                text-slate-400
              "
            >
              Practical enterprise AI solutions
              built to accelerate innovation,
              improve decision making and
              create measurable business value.
            </p>

          </div>

          {/* Company */}

          <div>

            <h4
              className="
                text-lg
                font-semibold
                text-white
                mb-8
              "
            >
              Company
            </h4>

            <div className="space-y-4">

              {[
                'AI Product Strategy',
                'Enterprise Deployment',
                'Rapid Innovation',
                'Digital Transformation',
              ].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    px-5
                    py-4
                    text-slate-400
                    hover:border-cyan-500/20
                    hover:text-white
                    transition
                  "
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h4
              className="
                text-lg
                font-semibold
                text-white
                mb-8
              "
            >
              Contact
            </h4>

            <div className="space-y-5">

              {contactDetails.map((contact) => (

                <a
                  key={contact.label}
                  href={contact.href}
                  target={
                    contact.href.startsWith('http')
                      ? '_blank'
                      : '_self'
                  }
                  rel={
                    contact.href.startsWith('http')
                      ? 'noreferrer'
                      : undefined
                  }
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    p-4
                    hover:border-cyan-500/30
                    transition
                  "
                >

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-cyan-500/10
                      group-hover:scale-110
                      transition
                    "
                  >
                    <img
                      src={contact.icon}
                      alt={contact.label}
                      className="h-6 w-6"
                    />
                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      {contact.label}
                    </p>

                    <p className="text-white">
                      {contact.value}
                    </p>

                  </div>

                </a>

              ))}

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div
          className="
            mt-16
            border-t
            border-white/10
            pt-8
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              text-center
              md:flex-row
              md:justify-between
            "
          >

            <span className="text-slate-500">
              © {year} AI-Solutions.
              All rights reserved.
            </span>

            <span className="text-slate-500">
              Built for teams creating
              intelligent digital experiences.
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;