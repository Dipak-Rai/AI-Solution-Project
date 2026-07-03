import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Testimonials = ({ limit = 6, showSummary = false }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get('/feedback');
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeedback();
  }, []);

  const totalReviews = feedbacks.length;
  const averageRating = totalReviews
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedbacks.filter((item) => item.rating === star).length,
  }));

  return (
    <section className="relative py-20" style={{ backgroundColor: '#0a0e27' }}>
      <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl opacity-15" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.36em] text-cyan-300 mb-3">Verified customer feedback</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ratings that prove value across every deployment</h2>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto">
            Dive into real reviews and interactive score metrics for our AI systems. Every rating is built from live customer input.
          </p>
        </div>

        {showSummary && (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr] mb-12">
            <div className="rating-summary-card p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300 mb-4">Average Score</p>
              <div className="flex flex-wrap items-end gap-4">
                <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 leading-none">
                  {averageRating}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-cyan-200 text-2xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.round(Number(averageRating)) ? 'opacity-100 rating-star' : 'opacity-30 rating-star'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300">
                    {totalReviews} review{totalReviews === 1 ? '' : 's'} collected
                  </p>
                </div>
              </div>
              <p className="mt-6 text-slate-300 leading-7">
                Ratings refresh automatically as customers submit feedback. Our performance metrics stay current with every review.
              </p>
            </div>

            <div className="rating-summary-card p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300 mb-4">Rating distribution</p>
              <div className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.star} className="grid grid-cols-[5rem_1fr_auto] items-center gap-4">
                    <span className="font-semibold text-cyan-200">{item.star}★</span>
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${totalReviews ? (item.count / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-300">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {feedbacks.length ? (
            feedbacks.slice(0, limit).map((item, index) => (
              <article
                key={item._id || index}
                className="rating-review-card group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="min-w-[3rem] h-12 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-cyan-500/20">
                      {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="review-badge inline-flex items-center rounded-full px-3 py-1 font-semibold tracking-wide">{item.rating} / 5</span>
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-400 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < item.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 leading-7 tracking-tight">“{item.comment}”</p>
              </article>
            ))
          ) : (
            [1, 2].map((item) => (
              <article key={item} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
                <p className="text-3xl mb-4">⭐⭐⭐⭐⭐</p>
                <p className="text-slate-600 italic">“Great service and fast response times.”</p>
                <p className="mt-5 font-semibold text-slate-900">- Customer {item}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
