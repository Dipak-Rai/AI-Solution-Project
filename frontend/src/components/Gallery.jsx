import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import galleryImg from '../photo/gallery.png';

const formatDate = (value) => {
  if (!value) return 'Recent';

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getImage = (item) => {
  if (!item) return '';

  const API_BASE = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5001/api'
  ).replace('/api', '');

  if (item.imageUrl && item.imageUrl.startsWith('data:')) {
    return item.imageUrl;
  }

  if (
    item.imageUrl &&
    (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://'))
  ) {
    return item.imageUrl;
  }

  if (
    item.fileUrl &&
    (item.fileUrl.startsWith('http://') || item.fileUrl.startsWith('https://'))
  ) {
    return item.fileUrl;
  }

  if (item.imageUrl?.startsWith('/uploads')) {
    return `${API_BASE}${item.imageUrl}`;
  }

  if (item.fileName?.trim()) {
    return `${API_BASE}/uploads/${encodeURIComponent(item.fileName.trim())}`;
  }

  if (item.imageUrl) {
    return `${API_BASE}/uploads/${item.imageUrl}`;
  }

  return 'https://placehold.co/1200x700?text=Image';
};

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await api.get('/gallery');

      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
          ? res.data.items
          : [];

      setItems(data);
    } catch (err) {
      console.error('Gallery Error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        items
          .map((item) => String(item.category || 'event').trim())
          .filter(Boolean)
      )
    );

    return ['all', ...unique];
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;

    return items.filter(
      (item) => String(item.category || '').toLowerCase().trim() === filter
    );
  }, [items, filter]);

  return (
    <section id="gallery" className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-40"
        style={{ backgroundImage: `url(${galleryImg})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.2),_transparent_35%),linear-gradient(135deg,_rgba(2,6,23,0.95),_rgba(2,6,23,0.85))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Curated Gallery
          </div>
          <h2 className="mt-6 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            A refined showcase of innovation and impact
          </h2>
          <p className="mt-5 text-base text-slate-300 sm:text-lg">
            Discover the latest highlights, moments, and event stories brought to life through a dynamic and responsive gallery experience.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Highlights' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live Collection</p>
            <p className="mt-3 text-3xl font-semibold text-white">{filtered.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Categories</p>
            <p className="mt-3 text-3xl font-semibold text-white">{categories.length - 1}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Updated</p>
            <p className="mt-3 text-3xl font-semibold text-white">Daily</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-20 text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="mt-6 text-slate-400">Loading gallery...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-20 rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-10 text-center">
            <p className="text-lg text-slate-300">No gallery items are available right now.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/30"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/1200x700?text=No+Image';
                    }}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                    {item.category || 'Event'}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                      {formatDate(item.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description || 'A memorable moment captured for the community.'}
                  </p>
                  <button
                    onClick={() => setSelected(item)}
                    className="mt-6 inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6"
            onClick={() => setSelected(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                  {selected.category || 'Gallery Item'}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                <img
                  src={getImage(selected)}
                  alt={selected.title}
                  className="w-full rounded-[24px] object-cover"
                />
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    {selected.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    {selected.description || 'No additional description available.'}
                  </p>
                  <div className="mt-4 text-sm font-medium text-cyan-400">
                    {formatDate(selected.eventDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}