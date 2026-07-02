import type { Metadata } from 'next';
import Link from 'next/link';

const posts = [
  {
    slug: 'chrome-tabs-using-too-much-memory',
    title: 'Chrome Tabs Using Too Much Memory? How to Find and Fix Heavy Tabs',
    description:
      'A practical guide to reducing Chrome memory usage with live tab visibility, safer cleanup decisions, and focus controls that prevent tab overload from returning.',
    category: 'Performance',
    readTime: '8 min read',
  },
  {
    slug: 'tab-monitor-vs-top-tab-tools',
    title: 'Tab Monitor vs the Top 5 Tab Tools: Why It Wins for Focus and Speed',
    description:
      'A side-by-side comparison of Tab Monitor, Workona, OneTab, Session Buddy, Toby, and Tabli with a practical table for users deciding what to install next.',
    category: 'Top tools',
    readTime: '9 min read',
  },
  {
    slug: 'onetab-not-working',
    title: 'OneTab Not Working? Why More Chrome Users Are Switching to Tab Monitor',
    description:
      'A comparison guide for users searching for a reliable OneTab alternative with live tab monitoring, focus controls, and better visibility into browser performance.',
    category: 'Comparison',
    readTime: '7 min read',
  },
];

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read Tab Monitor articles about tab management, browser performance, focus workflows, and alternatives to Workona, OneTab, and Session Buddy.',
  keywords: ['tab management', 'tab hoarding', 'multiple tabs', 'task manager', 'alt tab'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Tab Monitor Blog',
    description:
      'Guides and comparison posts about tab overload, browser performance, and better extension workflows.',
    url: 'https://www.tabmonitor.se/blog',
  },
};

export default function BlogPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body {
          margin: 0;
          background:
            radial-gradient(circle at top, rgba(87,188,255,0.18), transparent 34%),
            linear-gradient(180deg, #f5f7fb 0%, #eef4fb 50%, #f5f7fb 100%);
          color: #18212f;
          font-family: 'DM Sans', sans-serif;
        }
        a { color: inherit; }
      `}</style>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '96px 24px 72px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
            color: '#00d4ff',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            textDecoration: 'none',
            letterSpacing: '0.12em',
          }}
        >
          ← TABMONITOR
        </Link>

        <p
          style={{
            margin: '0 0 14px',
            color: '#22c55e',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Blog
        </p>
        <h1
          style={{
            margin: '0 0 14px',
            maxWidth: 780,
            fontSize: 'clamp(2.35rem, 5vw, 4.1rem)',
            fontWeight: 800,
            letterSpacing: '-0.055em',
            lineHeight: 1.08,
            textWrap: 'balance',
          }}
        >
          Guides for calmer tabs and faster browsing
        </h1>
        <p style={{ maxWidth: 720, margin: '0 0 40px', color: '#506176', fontSize: 18, lineHeight: 1.7 }}>
          Explore practical advice on tab overload, browser slowdowns, focus sessions, and why people move from list-only
          tab savers to smarter workflow extensions.
        </p>

        <section
          style={{
            display: 'grid',
            gap: 20,
          }}
        >
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 24,
                padding: 28,
                boxShadow: '0 24px 70px rgba(15, 23, 42, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    borderRadius: 999,
                    padding: '6px 10px',
                    background: 'rgba(0,212,255,0.12)',
                    color: '#67e8f9',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {post.category}
                </span>
                <span style={{ color: '#6f8196', fontSize: 14 }}>{post.readTime}</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(1.55rem, 2.6vw, 2.05rem)', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.035em' }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ margin: '0 0 22px', color: '#506176', fontSize: 17, lineHeight: 1.7 }}>{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#00d4ff',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Read article →
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
