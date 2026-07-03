
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import RatingForm from '../components/RatingForm';

const Ratings = () => {
  const [refreshKey, setRefreshKey] =
    useState(0);

  const handleSubmitted = () =>
    setRefreshKey((k) => k + 1);

  const stats = [
    {
      label: 'Average Score',
      value: '4.9',
      desc:
        'Calculated from verified customer reviews.',
    },
    {
      label: 'Review Volume',
      value: '320+',
      desc:
        'Ratings submitted by enterprise clients.',
    },
    {
      label: 'Response Quality',
      value: 'A+',
      desc:
        'Fast feedback and continuous improvement.',
    },
  ];

  return (
    <main
      className="
        relative
        overflow-hidden
        bg-[#040816]
        min-h-screen
      "
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            left-[-200px]
            top-[0]
            w-[600px]
            h-[600px]
            rounded-full
            bg-cyan-500/10
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            right-[-200px]
            bottom-[-100px]
            w-[600px]
            h-[600px]
            rounded-full
            bg-blue-600/10
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]
            bg-[size:44px_44px]
          "
        />

      </div>

      <section
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          pt-28
          pb-20
        "
      >

        {/* HEADER */}

        <div className="text-center">

          <span
            className="
              inline-flex
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-6
              py-2
              text-cyan-300
              text-xs
              uppercase
              tracking-[4px]
            "
          >
            Customer Ratings
          </span>

          <h1
            className="
              mt-8
              text-5xl
              md:text-7xl
              font-black
              text-white
            "
          >
            Trusted By
            <br />

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
              Enterprise Teams
            </span>

          </h1>

          <p
            className="
              mt-8
              max-w-3xl
              mx-auto
              text-lg
              text-slate-400
              leading-8
            "
          >
            Explore verified customer feedback,
            live review analytics, and executive
            insights from our latest AI services.
          </p>

        </div>

        {/* STATS */}

        <div
          className="
            mt-16
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {stats.map((item) => (

            <div
              key={item.label}
              className="
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-8
                transition
                hover:border-cyan-400/20
                hover:-translate-y-1
              "
            >

              <p
                className="
                  uppercase
                  text-xs
                  tracking-[4px]
                  text-slate-500
                "
              >
                {item.label}
              </p>

              <h3
                className="
                  mt-6
                  text-5xl
                  font-black
                  text-white
                "
              >
                {item.value}
              </h3>

              <p
                className="
                  mt-4
                  text-slate-400
                "
              >
                {item.desc}
              </p>

            </div>

          ))}

        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-14
            flex
            flex-wrap
            justify-center
            gap-5
          "
        >

          <Link
            to="/admin/login"
            className="
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-8
              py-4
              text-white
              font-semibold
              transition
              hover:scale-[1.02]
            "
          >
            Admin Dashboard
          </Link>

          <Link
            to="/"
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-8
              py-4
              text-white
            "
          >
            Back To Home
          </Link>

        </div>

      </section>

      <section
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          pb-14
        "
      >
        <div
          className="
            rounded-[36px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
          "
        >
          <RatingForm
            onSubmitted={
              handleSubmitted
            }
          />
        </div>
      </section>

      <section
        className="
          relative
          z-10
          pb-28
        "
      >

        <Testimonials
          key={refreshKey}
          showSummary={true}
          limit={8}
        />

      </section>

    </main>
  );
};

export default Ratings;

