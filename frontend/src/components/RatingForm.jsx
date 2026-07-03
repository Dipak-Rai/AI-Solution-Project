
import React, { useState } from 'react';
import { api } from '../api';

const RatingForm = ({ onSubmitted }) => {
  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (
      !name ||
      !email ||
      !comment ||
      !rating
    ) {
      setError(
        'Please complete all fields.'
      );
      return;
    }

    const payload = {
      name,
      email,
      rating: Number(rating),
      comment,
    };

    try {
      setLoading(true);

      await api.post(
        '/feedback',
        payload
      );

      setSuccess(
        'Thanks for your feedback!'
      );

      setName('');
      setEmail('');
      setRating(5);
      setComment('');

      if (
        typeof onSubmitted ===
        'function'
      ) {
        onSubmitted();
      }
    } catch (err) {
      console.error(err);

      setError(
        'Failed to submit feedback. Please try again later.'
      );
    } finally {
      setLoading(false);

      setTimeout(
        () => setSuccess(''),
        5000
      );
    }
  };

  const input =
    `
      w-full
      rounded-[22px]
      border
      border-white/10
      bg-white/[0.03]
      px-5
      py-4
      text-white
      placeholder:text-slate-500
      outline-none
      transition
      focus:border-cyan-400
      focus:ring-4
      focus:ring-cyan-500/10
    `;

  return (
    <section className="relative py-20">

      <div className="mx-auto max-w-5xl">

        <form
          onSubmit={submit}
          className="
            rounded-[40px]
            border
            border-white/10
            bg-[#071225]
            backdrop-blur-xl
            p-8
            md:p-12
            shadow-[0_0_80px_rgba(0,0,0,.45)]
          "
        >

          <div className="text-center mb-10">

            <span
              className="
                inline-flex
                rounded-full
                bg-cyan-500/10
                px-5
                py-2
                text-xs
                uppercase
                tracking-[4px]
                text-cyan-300
              "
            >
              Customer Experience
            </span>

            <h2
              className="
                mt-6
                text-4xl
                md:text-5xl
                font-black
                text-white
              "
            >
              Rate Our
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
                {' '}AI Platform
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-2xl
                mx-auto
                text-slate-400
                leading-8
              "
            >
              Your feedback helps improve
              our AI services and customer
              experience.
            </p>

          </div>

          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                p-4
                text-red-300
              "
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-emerald-500/20
                bg-emerald-500/10
                p-4
                text-emerald-300
              "
            >
              {success}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 mb-5">

            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className={input}
            />

            <input
              type="email"
              placeholder="Business Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className={input}
            />

          </div>

          <div className="mb-8">

            <label
              className="
                text-sm
                text-slate-400
                block
                mb-5
              "
            >
              Service Rating
            </label>

            <div className="flex flex-wrap gap-4">

              {[1, 2, 3, 4, 5].map(
                (val) => (

                  <button
                    key={val}
                    type="button"
                    onClick={() =>
                      setRating(
                        val
                      )
                    }
                    className={`
                      h-14
                      w-14
                      rounded-2xl
                      text-xl
                      transition
                      ${
                        val <= rating
                          ? `
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-600
                          text-white
                        `
                          : `
                          bg-white/[0.04]
                          text-slate-500
                        `
                      }
                    `}
                  >
                    ★
                  </button>

                )
              )}

              <div
                className="
                  flex
                  items-center
                  text-cyan-300
                  font-semibold
                "
              >
                {rating}/5
              </div>

            </div>

          </div>

          <textarea
            rows="6"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            className={`${input} resize-none mb-8`}
          />

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
            "
          >

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                rounded-[22px]
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-indigo-600
                py-5
                font-semibold
                text-white
                transition
                hover:scale-[1.01]
              "
            >
              {loading
                ? 'Submitting...'
                : 'Submit Review'}
            </button>

            <button
              type="button"
              onClick={() => {
                setName('');
                setEmail('');
                setRating(5);
                setComment('');
                setError('');
                setSuccess('');
              }}
              className="
                rounded-[22px]
                border
                border-white/10
                px-8
                py-5
                text-slate-300
                transition
                hover:bg-white/[0.04]
              "
            >
              Reset
            </button>

          </div>

        </form>

      </div>

    </section>
  );
};

export default RatingForm;
