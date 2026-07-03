
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import articleImg from '../photo/article.png';

const API_BASE_URL =
  (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5001/api'
  ).replace(/\/api\/?$/, '');

const normalizeUploadPath = (value) => {

  if (!value) return '';

  // already complete
  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  // "/uploads/file.pdf"
  if (
    value.startsWith('/uploads')
  ) {
    return `${API_BASE_URL}${value}`;
  }

  // "uploads/file.pdf"
  if (
    value.startsWith('uploads/')
  ) {
    return `${API_BASE_URL}/${value}`;
  }

  return `${API_BASE_URL}/uploads/${value}`;

};

const localArticleModules = import.meta.glob(
  '../Articles/*.pdf',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
);

const localArticles = Object.entries(
  localArticleModules
).map(([path, url], index) => {
  const fileName = path
    .split('/')
    .pop()
    .replace('.pdf', '');

  const title = fileName
    .replace(/[-_]+/g, ' ')
    .trim();

  return {
    id: `local-${index}`,
    title,
    content:
      'Open the full article PDF to read the complete content.',
    author: 'Uploaded Article',
    date: '2026',
    fileUrl: url,
    fileName,
  };
});

const defaultArticles =
  localArticles.length > 0
    ? localArticles
    : [
      {
        id: '1',
        title:
          'How AI is Transforming Small Business Workflows',
        content:
          'Discover how AI can automate repetitive tasks, improve customer interactions, and free your team to focus on strategic growth.',
        author: 'Admin Team',
        date: 'May 2026',
      },
      {
        id: '2',
        title:
          'Designing Smarter Customer Experiences',
        content:
          'Learn the principles behind building conversational interfaces that feel intuitive and deliver measurable engagement.',
        author: 'Product Insights',
        date: 'April 2026',
      },
      {
        id: '3',
        title:
          'From Idea to Deployment: AI Project Best Practices',
        content:
          'A practical guide for planning, prototyping, and launching AI-enabled products with confidence.',
        author: 'Development Team',
        date: 'March 2026',
      },
    ];

const formatDate = (value) => {
  if (!value) return 'Recent';

  const date = new Date(value);

  return isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
      }
    );
};

const makeExcerpt = (
  text,
  maxLength = 160
) => {
  if (!text)
    return 'Read the full article for more details.';

  return text.length > maxLength
    ? `${text
      .slice(0, maxLength)
      .trim()}…`
    : text;
};

const Articles = () => {
  const [articles, setArticles] =
    useState(defaultArticles);

  const [
    selectedArticle,
    setSelectedArticle,
  ] = useState(
    defaultArticles[0] || null
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchArticles =
      async () => {
        try {
          const res =
            await api.get(
              '/articles'
            );

          if (
            Array.isArray(
              res.data
            ) &&
            res.data.length > 0
          ) {
            const parsed =
              res.data.map(
                (
                  article
                ) => ({
                  id:
                    article._id ||
                    article.id,

                  title:
                    article.title,

                  content:
                    article.content,

                  author:
                    article.author ||
                    'AI Solutions',

                  date:
                    formatDate(
                      article.createdAt
                    ),

                  fileUrl:
                    article.fileUrl,

                  fileName:
                    article.fileName,
                })
              );

            setArticles(
              parsed
            );

            setSelectedArticle(
              parsed[0]
            );
          }
        } catch (err) {
          console.error(
            'Unable to load articles:',
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchArticles();
  }, []);

  const handleSelectArticle = (
    article
  ) => {
    setSelectedArticle(
      article
    );
  };

 const resolveArticleFileUrl = (article) => {

  const rawUrl =
    article?.fileUrl;

  if (!rawUrl)
    return '';

  // support old base64
  if (
    rawUrl.startsWith('data:')
  ) {
    return rawUrl;
  }

  // uploaded pdf
  return normalizeUploadPath(
    rawUrl
  );

};

  const handleViewPDF = (article) => {

    const url =
      resolveArticleFileUrl(article);

    if (!url) {
      alert('File not found');
      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

  };

 const handleDownloadPDF = async (article) => {

  const url =
    resolveArticleFileUrl(
      article
    );

  if (!url) {
    alert(
      'File not found'
    );
    return;
  }

  try {

    const response =
      await fetch(
        url
      );

    const blob =
      await response.blob();

    const downloadUrl =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        'a'
      );

    link.href =
      downloadUrl;

    link.download =
      article.fileName ||
      'article.pdf';

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      downloadUrl
    );

  }

  catch (
    error
  ) {

    console.error(
      'Download failed',
      error
    );

    alert(
      'Download failed'
    );

  }

};


  return (
    <section
      id="articles"
      className="relative overflow-hidden bg-[#040816] py-28"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-50"
          style={{ backgroundImage: `url(${articleImg})` }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute left-[-180px] top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute right-[-180px] bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-2 text-cyan-300 text-xs tracking-[4px] uppercase mb-8">
            AI KNOWLEDGE HUB
          </span>

          <h2 className="text-5xl md:text-7xl font-black text-white">

            Enterprise
            <br />

            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Research & Insights
            </span>

          </h2>

          <p className="mt-8 text-slate-400 max-w-3xl mx-auto leading-8">

            Research-led articles for executive
            decision makers and AI adoption.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_.85fr]">

          <article className="rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10">

            <span className="inline-flex rounded-full bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 text-cyan-300 text-xs uppercase mb-8">
              Featured Insight
            </span>

            <h3 className="text-4xl text-white font-bold leading-tight">
              {selectedArticle?.title}
            </h3>

            <p className="mt-8 text-slate-400 leading-8">
              {makeExcerpt(
                selectedArticle?.content,
                240
              )}
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">

              <div className="rounded-3xl bg-[#0A1222] border border-white/10 p-6">
                <p className="text-slate-500 uppercase text-xs">
                  Author
                </p>

                <p className="text-white text-xl mt-3">
                  {selectedArticle?.author}
                </p>
              </div>

              <div className="rounded-3xl bg-[#0A1222] border border-white/10 p-6">
                <p className="text-slate-500 uppercase text-xs">
                  Published
                </p>

                <p className="text-white text-xl mt-3">
                  {selectedArticle?.date}
                </p>
              </div>

            </div>

            {selectedArticle?.fileUrl && (

              <div className="mt-10 flex gap-4">

                <button
                  type="button"
                  onClick={() =>
                    handleViewPDF(
                      selectedArticle
                    )
                  }
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-white font-semibold"
                >
                  Read Article
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadPDF(
                      selectedArticle
                    )
                  }
                  aria-label="Download PDF"
                  className="inline-flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-cyan-500/20 px-6 py-3 text-white font-semibold hover:bg-cyan-500/10 hover:shadow-[0_10px_40px_rgba(6,182,212,.12)] transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21H3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Download Articles</span>
                </button>

              </div>

            )}

          </article>

          <div className="space-y-5 max-h-[850px] overflow-y-auto">

            {loading ? (

              <div className="rounded-3xl bg-white/[0.03] p-8 text-slate-400">
                Loading articles...
              </div>

            ) : (

              articles.map(
                (
                  article
                ) => (
                  <div
                    key={
                      article.id
                    }
                    onClick={() =>
                      handleSelectArticle(
                        article
                      )
                    }
                    className={`
                      rounded-3xl
                      p-7
                      cursor-pointer
                      transition

                      ${selectedArticle?.id ===
                        article.id
                        ? 'border border-cyan-400 bg-cyan-500/10'
                        : 'border border-white/10 bg-white/[0.03]'
                      }
                    `}
                  >

                    <div className="flex justify-between mb-5">

                      <span className="text-cyan-300">
                        {
                          article.author
                        }
                      </span>

                      <span className="text-slate-500">
                        {
                          article.date
                        }
                      </span>

                    </div>

                    <h4 className="text-2xl text-white font-semibold mb-4">
                      {
                        article.title
                      }
                    </h4>

                    <p className="text-slate-400">
                      {makeExcerpt(
                        article.content
                      )}
                    </p>

                  </div>
                )
              )

            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default Articles;

