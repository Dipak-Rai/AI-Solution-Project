
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import eventImg from '../photo/event.png';

const Events = () => {
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    eventInterest: '',
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get('/events');
        setRegistrations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegistrations();
  }, []);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const res = await api.post('/events', form);

      setRegistrations((prev) => [res.data, ...prev]);

      setStatus('Your interest has been registered.');

      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        eventInterest: '',
      });
    } catch (err) {
      console.error(err);
      setStatus('Unable to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const input =
    `
      w-full
      rounded-2xl
      border
      border-cyan-500/10
      bg-[#0D1526]/80
      backdrop-blur-xl
      px-5
      py-4
      text-white
      placeholder:text-slate-500
      transition-all
      duration-300
      focus:outline-none
      focus:border-cyan-400
      focus:ring-4
      focus:ring-cyan-500/10
      hover:border-cyan-400/30
    `;

  return (
    <section
      id="events"
      className="
        relative
        overflow-hidden
        bg-[#030712]
        py-28
      "
    >
      {/* Event background image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-50"
          style={{ backgroundImage: `url(${eventImg})` }}
        />

        <div
          className="
            absolute
            inset-0
            bg-black/40
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]
            bg-[size:48px_48px]
          "
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-6
              py-2
              text-cyan-300
              text-xs
              tracking-[4px]
              uppercase
              mb-8
            "
          >
            AI Event Experience
          </span>

          <h2
            className="
              text-5xl
              md:text-7xl
              font-black
              text-white
              leading-tight
            "
          >
            Join The Future
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
              Of AI Innovation
            </span>

          </h2>

          <p
            className="
              mt-8
              max-w-3xl
              mx-auto
              text-slate-400
              leading-8
              text-lg
            "
          >
            Register your interest and connect with AI leaders,
            enterprise innovators, and technology teams shaping
            the next generation of intelligent solutions.
          </p>

        </div>

        {status && (
          <div
            className="
              mb-8
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-500/10
              p-5
              text-center
              text-cyan-300
            "
          >
            {status}
          </div>
        )}

        <div
          className="
            relative
            max-w-5xl
            mx-auto
            overflow-hidden
            rounded-[36px]
            border
            border-white/10
            bg-transparent
            backdrop-blur-2xl
            shadow-[0_50px_120px_rgba(0,0,0,.45)]
          "
        >
          <div
            className="absolute inset-0 bg-center bg-cover opacity-50"
            style={{ backgroundImage: `url(${eventImg})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10">
            <div
              className="
                absolute
                inset-x-0
                top-0
                h-[2px]
                bg-gradient-to-r
                from-transparent
                via-cyan-400
                to-transparent
              "
            />
          </div>

          <div className="p-10 md:p-14 relative z-10">

            <div className="mb-10">

              <h3
                className="
                  text-3xl
                  font-bold
                  text-white
                  mb-3
                "
              >
                Register Your Interest
              </h3>

              <p className="text-slate-400">
                Tailored event agenda • Executive networking •
                AI solution showcases
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid md:grid-cols-2 gap-5 mb-5">

                <input
                  className={input}
                  value={form.name}
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />

                <input
                  className={input}
                  value={form.email}
                  name="email"
                  type="email"
                  placeholder="Business Email"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">

                <input
                  className={input}
                  value={form.phone}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                />

                <input
                  className={input}
                  value={form.company}
                  name="company"
                  placeholder="Company"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-10">

                <input
                  className={input}
                  value={form.country}
                  name="country"
                  placeholder="Country"
                  onChange={handleChange}
                  required
                />

                <input
                  className={input}
                  value={form.eventInterest}
                  name="eventInterest"
                  placeholder="AI Topic / Interest"
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group
                  relative
                  w-full
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  py-5
                  text-lg
                  font-bold
                  text-white
                  transition
                  hover:scale-[1.01]
                "
              >
                <span className="relative z-10">
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Reserve Your Spot'}
                </span>
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Events;

