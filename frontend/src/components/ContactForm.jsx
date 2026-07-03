
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import contactImg from '../photo/contact.png';
import countries from '../data/countries';

const ContactForm = () => {
  const containerRef = useRef(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    phoneCode: '',
    company: '',
    country: '',
    jobTitle: '',
    jobDetails: '',
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryQuery, setCountryQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryActiveIndex, setCountryActiveIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\(\)\+]{6,}$/.test(phone);

  const filteredCountries = useMemo(() => {
    if (!countryQuery.trim()) return countries;
    return countries.filter((country) =>
      country.name.toLowerCase().includes(countryQuery.toLowerCase())
    );
  }, [countryQuery]);

  const formatFlag = (iso2) =>
    iso2
      ? String.fromCodePoint(
          ...[...iso2.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
        )
      : '🌍';

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    if (!form.phoneCode.trim()) {
      newErrors.phoneCode = 'Country code is required';
    }
    if (!form.company.trim()) newErrors.company = 'Company is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!form.jobDetails.trim()) {
      newErrors.jobDetails = 'Please describe your requirements';
    } else if (form.jobDetails.length < 20) {
      newErrors.jobDetails = 'Please provide more details (min 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'phone') {
      finalValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));

    if (name === 'country') {
      setCountryQuery(finalValue);
      setCountryOpen(true);
      if (!selectedCountry || selectedCountry.name.toLowerCase() !== finalValue.toLowerCase()) {
        setSelectedCountry(null);
        setForm((prev) => ({ ...prev, phoneCode: '' }));
      }
    }

    if (touched[name]) {
      const newErrors = { ...errors };

      if (name === 'email' && finalValue.trim() && !validateEmail(finalValue)) {
        newErrors.email = 'Invalid email format';
      } else if (name === 'phone' && finalValue.trim() && !validatePhone(finalValue)) {
        newErrors.phone = 'Invalid phone format';
      } else if (name === 'jobDetails' && finalValue.length < 20) {
        newErrors.jobDetails = 'Please provide more details (min 20 characters)';
      } else if (name === 'country' && finalValue.trim()) {
        delete newErrors.country;
      } else {
        delete newErrors[name];
      }

      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFocusedField('');
  };

  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setForm((prev) => ({
      ...prev,
      country: country.name,
      phoneCode: country.dial_code,
    }));
    setCountryQuery(country.name);
    setCountryOpen(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.country;
      delete next.phoneCode;
      return next;
    });
    setTouched((prev) => ({ ...prev, country: true }));
  };

  const handleCountryInputKeyDown = (e) => {
    if (!countryOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCountryActiveIndex((prev) => Math.min(prev + 1, filteredCountries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCountryActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeCountry = filteredCountries[countryActiveIndex];
      if (activeCountry) handleSelectCountry(activeCountry);
    } else if (e.key === 'Escape') {
      setCountryOpen(false);
    }
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'email', 'phone', 'phoneCode', 'company', 'country', 'jobTitle', 'jobDetails'];
    const hasMissingFields = requiredFields.some((field) => String(form[field]).trim() === '');

    if (hasMissingFields) {
      setStatus('Please! Must Be Filled All Data');
      return;
    }

    if (!validateForm()) {
      setStatus('Please fix the errors above');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('');

      await api.post('/contact', form);

      setStatus('✓ Message sent successfully! Our team will respond within 24 hours.');
      
      setForm({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        jobTitle: '',
        jobDetails: '',
      });
      setTouched({});
      setErrors({});

      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error(error);
      setStatus('✕ Unable to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldConfig = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: '👤', col: 1 },
    { name: 'email', label: 'Business Email', type: 'email', icon: '📧', col: 2 },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: '📱', col: 1 },
    { name: 'company', label: 'Company', type: 'text', icon: '🏢', col: 2 },
    { name: 'country', label: 'Country', type: 'search', icon: '🌍', col: 1 },
    { name: 'jobTitle', label: 'Job Title', type: 'text', icon: '💼', col: 2 },
  ];

  const renderField = (field) => {
    const hasError = errors[field.name];
    const isFocused = focusedField === field.name;
    const isTouched = touched[field.name];

    if (field.name === 'country') {
      return (
        <div key={field.name} className="group min-w-0 relative" ref={containerRef}>
          <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
            <span className="inline-block mr-2">{field.icon}</span>
            {field.label}
            <span className="text-cyan-400 ml-1">*</span>
          </label>

          <button
            type="button"
            onClick={() => setCountryOpen((prev) => !prev)}
            onFocus={() => setFocusedField(field.name)}
            className={
              `w-full rounded-2xl px-5 py-4 text-left text-white placeholder:text-slate-500 border-2 transition-all duration-300 outline-none backdrop-blur-xl flex items-center justify-between gap-3 ${
                hasError && isTouched
                  ? 'border-red-500/50 bg-red-500/5'
                  : isFocused
                  ? 'border-cyan-400 bg-white/[0.08] shadow-lg shadow-cyan-500/10'
                  : 'border-white/10 bg-white/[0.04] hover:border-white/20'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <span>{selectedCountry ? formatFlag(selectedCountry.iso2) : '🌍'}</span>
              <span className={selectedCountry ? 'text-white' : 'text-slate-500'}>
                {selectedCountry?.name || 'Select country'}
              </span>
            </span>
            <span className="text-slate-400">{countryOpen ? '▴' : '▾'}</span>
          </button>

          {countryOpen && (
            <div className="absolute z-20 mt-2 h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/30">
              <div className="p-3">
                <label className="sr-only" htmlFor="country-search">
                  Search country
                </label>
                <input
                  id="country-search"
                  type="search"
                  autoComplete="off"
                  value={countryQuery}
                  onChange={(e) => {
                    setCountryQuery(e.target.value);
                    setCountryActiveIndex(0);
                  }}
                  onKeyDown={handleCountryInputKeyDown}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="Search country"
                />
              </div>

              <div className="max-h-[calc(100%-80px)] overflow-y-auto overscroll-contain px-2 pb-2">
                {filteredCountries.length === 0 ? (
                  <div className="p-4 text-sm text-slate-400">No countries found.</div>
                ) : (
                  filteredCountries.map((country, index) => {
                    const active = index === countryActiveIndex;
                    return (
                      <button
                        key={country.iso2}
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        onMouseEnter={() => setCountryActiveIndex(index)}
                        className={`w-full rounded-2xl px-4 py-3 text-left transition-all duration-150 ${
                          active ? 'bg-cyan-500/10 text-white shadow-inner' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="text-lg">{formatFlag(country.iso2)}</span>
                          <span>{country.name}</span>
                        </span>
                        <span className="text-slate-500 text-sm">{country.dial_code}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {hasError && isTouched && (
            <p className="text-red-400 text-sm mt-2">{hasError}</p>
          )}
        </div>
      );
    }

    if (field.name === 'phone') {
      const hasPhoneCodeError = errors.phoneCode;
      return (
        <div key={field.name} className="group min-w-0">
          <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
            <span className="inline-block mr-2">{field.icon}</span>
            {field.label}
            <span className="text-cyan-400 ml-1">*</span>
          </label>

          <div className="relative flex items-stretch gap-3">
            <div className="flex items-center rounded-2xl border-2 border-white/10 bg-white/[0.04] px-4 text-slate-200 transition-all duration-300">
              <span className="mr-2 text-lg">{selectedCountry ? formatFlag(selectedCountry.iso2) : '🌍'}</span>
              <span className="text-slate-300">{form.phoneCode || '+__'}</span>
            </div>

            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={
                selectedCountry ? `e.g. ${form.phoneCode} 123 456 789` : 'Enter phone number'
              }
              className={
                `w-full rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 border-2 transition-all duration-300 outline-none backdrop-blur-xl ${
                  (hasError || hasPhoneCodeError) && isTouched
                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-400 focus:ring-4 focus:ring-red-500/10'
                    : focusedField === 'phone'
                    ? 'border-cyan-400 bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                }`
              }
            />
          </div>

          {(hasError || hasPhoneCodeError) && isTouched && (
            <p className="text-red-400 text-sm mt-2">{hasError || hasPhoneCodeError}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="group min-w-0">
        <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
          <span className="inline-block mr-2">{field.icon}</span>
          {field.label}
          <span className="text-cyan-400 ml-1">*</span>
        </label>
        
        <div className="relative min-w-0">
          <input
            name={field.name}
            type={field.type}
            value={form[field.name]}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={
              `w-full rounded-2xl px-5 py-4 text-white placeholder:text-slate-500
              border-2 transition-all duration-300 outline-none backdrop-blur-xl
              ${
                hasError && isTouched
                  ? 'border-red-500/50 bg-red-500/5 focus:border-red-400 focus:ring-4 focus:ring-red-500/10'
                  : isFocused
                  ? 'border-cyan-400 bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
                  : 'border-white/10 bg-white/[0.04] hover:border-white/20'
              }`
            }
          />
          
          {hasError && isTouched && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">⚠️</span>
          )}
          
          {!hasError && isTouched && form[field.name] && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-lg">✓</span>
          )}
        </div>

        {hasError && isTouched && (
          <p className="text-red-400 text-sm mt-2">{hasError}</p>
        )}
      </div>
    );
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#040816] py-32"
    >
      {/* Background image (Contact) */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-20"
          style={{ backgroundImage: `url(${contactImg})` }}
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-[-180px] top-[-80px] h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute right-[-180px] bottom-[-100px] h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-2 text-xs uppercase tracking-[4px] text-cyan-300">
            Direct Communication
          </span>

          <h2 className="mt-8 text-5xl md:text-7xl font-black text-white leading-tight">
            Build Your Next
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              AI Initiative
            </span>
          </h2>

          <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-slate-400">
            Connect with our AI specialists. Share your vision and let us craft the perfect solution tailored to your business goals.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[40px] overflow-hidden border border-white/10 bg-transparent backdrop-blur-2xl p-10 md:p-14 shadow-2xl shadow-cyan-500/5">
            
            {/* Status Messages */}
            {status && (
              <div
                className={`
                  mb-8 rounded-2xl px-6 py-4 text-center font-medium transition-all duration-300
                  ${
                    status.includes('✓')
                      ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                      : status.includes('✕')
                      ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                      : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                  }
                `}
              >
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Form Fields Grid */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {fieldConfig.map(field => (
                  <div key={field.name} className={`${field.col === 2 ? 'md:col-span-2' : ''} min-w-0`}>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              {/* Message Area */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                  <span className="inline-block mr-2">📝</span>
                  Project Requirements
                  <span className="text-cyan-400 ml-1">*</span>
                </label>

                <div className="relative group">
                  <textarea
                    rows="6"
                    name="jobDetails"
                    value={form.jobDetails}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Describe your challenge, project goals, AI requirements, timeline, and budget constraints..."
                    className={`
                      w-full rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 resize-none
                      border-2 transition-all duration-300 outline-none backdrop-blur-xl
                      ${
                        errors.jobDetails && touched.jobDetails
                          ? 'border-red-500/50 bg-red-500/5 focus:border-red-400 focus:ring-4 focus:ring-red-500/10'
                          : focusedField === 'jobDetails'
                          ? 'border-cyan-400 bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
                          : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                      }
                    `}
                  />

                  <span className={`
                    absolute right-4 bottom-4 text-sm transition-colors duration-300
                    ${
                      form.jobDetails.length === 0
                        ? 'text-slate-500'
                        : form.jobDetails.length < 20
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }
                  `}>
                    {form.jobDetails.length}/500
                  </span>
                </div>

                {errors.jobDetails && touched.jobDetails && (
                  <p className="text-red-400 text-sm mt-2">{errors.jobDetails}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className={`
                  w-full py-5 rounded-2xl text-lg font-semibold uppercase tracking-wide
                  transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    isSubmitting
                      ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Inquiry</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-slate-500 text-center mt-6">
                We respect your privacy. Your information is secure and will only be used to assist with your inquiry.
              </p>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🔒', text: 'Secure' },
              { icon: '⚡', text: '24h Response' },
              { icon: '✓', text: 'Expert Team' },
              { icon: '🎯', text: 'Results-Driven' },
            ].map((badge, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-500/30 transition-all">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
