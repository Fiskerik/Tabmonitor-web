'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = ['Features', 'Pricing', 'Download'];

const FEATURES = [
  {
    icon: '💾',
    title: 'Real-time RAM tracking',
    desc: 'See exactly how much memory every tab is consuming, updated every 3 seconds.',
    color: '#00d4ff',
  },
  {
    icon: '⚡',
    title: 'CPU per tab',
    desc: 'Identify which tabs are silently draining your processor even when idle.',
    color: '#a78bfa',
  },
  {
    icon: '🎯',
    title: 'One-click kill',
    desc: 'Close any tab instantly from the dashboard. Or nuke all critical tabs at once.',
    color: '#00ff88',
  },
  {
    icon: '😴',
    title: 'Tab suspension',
    desc: 'Put tabs to sleep without closing them. Wake them up with one click.',
    color: '#00d4ff',
  },
  {
    icon: '📊',
    title: 'Session history',
    desc: 'Memory usage charts over time. See trends, peaks, and top consumers.',
    color: '#a78bfa',
  },
  {
    icon: '🔔',
    title: 'Smart alerts',
    desc: 'Get notified the moment a tab exceeds your memory threshold.',
    color: '#ff6b35',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    features: [
      'RAM & CPU per tab',
      'One-click tab close',
      'Close all critical tabs',
      'Tab suspension',
      'Closed tab history',
      'Session graph',
      'Dark mode',
    ],
    locked: [],
    cta: 'Install free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '49',
    period: 'per year',
    features: [
      'Everything in Free',
      'Advanced insights',
      'Per-site memory rules',
      'Weekly reports',
      'CSV export',
      'Priority support',
    ],
    locked: [],
    cta: 'Start 7-day trial',
    highlight: true,
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function TabMockup() {
  const tabs = [
    { name: 'YouTube', mb: 847, status: 'critical', cpu: 18.2 },
    { name: 'Figma', mb: 512, status: 'warning', cpu: 6.4 },
    { name: 'Gmail', mb: 203, status: 'normal', cpu: 1.1 },
    { name: 'GitHub', mb: 148, status: 'normal', cpu: 0.4 },
    { name: 'Notion', mb: 290, status: 'warning', cpu: 3.8 },
  ];

  const statusColor: Record<string, string> = {
    critical: '#ff6b35',
    warning: '#f59e0b',
    normal: '#00ff88',
  };

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid #1e2836',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      boxShadow: '0 0 80px rgba(0,212,255,0.08), 0 40px 80px rgba(0,0,0,0.6)',
    }}>
      {/* Titlebar */}
      <div style={{ background: '#080b14', padding: '12px 16px', borderBottom: '1px solid #1e2836', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ color: '#4a5568', marginLeft: 8 }}>TabMonitor — 5 tabs · 2.0 GB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span style={{ color: '#00d4ff', fontSize: 10 }}>↻ LIVE</span>
        </div>
      </div>

      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px', padding: '8px 16px', color: '#4a5568', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #1e2836' }}>
        <span>Tab</span><span>RAM</span><span>CPU</span><span></span>
      </div>

      {/* Tab rows */}
      {tabs.map((tab, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 80px 60px',
          padding: '10px 16px',
          alignItems: 'center',
          borderBottom: i < tabs.length - 1 ? '1px solid #1a2030' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[tab.status] }} />
            <span style={{ color: '#cbd5e1' }}>{tab.name}</span>
          </div>
          <span style={{ color: statusColor[tab.status] }}>{tab.mb} MB</span>
          <span style={{ color: tab.cpu > 10 ? '#ff6b35' : '#8892a4' }}>{tab.cpu}%</span>
          <button style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 4,
            color: '#ef4444',
            fontSize: 10,
            padding: '3px 8px',
            cursor: 'pointer',
          }}>kill</button>
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '10px 16px', background: '#080b14', borderTop: '1px solid #1e2836', display: 'flex', gap: 16 }}>
        <span style={{ color: '#ff6b35', fontSize: 10 }}>● 1 critical</span>
        <span style={{ color: '#f59e0b', fontSize: 10 }}>● 2 warning</span>
        <span style={{ color: '#00ff88', fontSize: 10 }}>● 2 healthy</span>
        <button style={{
          marginLeft: 'auto',
          background: 'rgba(255,107,53,0.15)',
          border: '1px solid rgba(255,107,53,0.3)',
          borderRadius: 6,
          color: '#ff6b35',
          fontSize: 10,
          padding: '4px 12px',
          cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace",
        }}>⚠ close critical</button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #06090f;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        ::selection { background: rgba(0,212,255,0.3); }

        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          transition: all 0.3s;
        }
        .nav.scrolled {
          background: rgba(6,9,15,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 14px 48px;
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.1em;
          color: #00d4ff;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          color: #8892a4;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #e2e8f0; }

        .nav-cta {
          background: #00d4ff;
          color: #06090f !important;
          padding: 9px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-cta:hover { background: #33dcff; transform: translateY(-1px); }

        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 64px;
          padding: 140px 48px 80px;
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #00d4ff;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #00d4ff;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 7vw, 96px);
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }
        .hero-title span {
          display: block;
          background: linear-gradient(135deg, #00d4ff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 17px;
          line-height: 1.7;
          color: #8892a4;
          margin-bottom: 40px;
          max-width: 420px;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #00d4ff;
          color: #06090f;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover { background: #33dcff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #e2e8f0;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid #2a3444;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: #4a5568; background: rgba(255,255,255,0.04); }

        .stats-bar {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #1e2836;
        }
        .stat-item { }
        .stat-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          color: #e2e8f0;
          display: block;
        }
        .stat-label {
          font-size: 12px;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        section {
          position: relative;
          z-index: 1;
        }

        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 48px;
        }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #00d4ff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-label::after {
          content: '';
          display: block;
          height: 1px;
          width: 40px;
          background: #00d4ff;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 16px;
          color: #8892a4;
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 64px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #1e2836;
          border: 1px solid #1e2836;
          border-radius: 16px;
          overflow: hidden;
        }

        .feature-card {
          background: #0d1117;
          padding: 32px;
          transition: background 0.2s;
        }
        .feature-card:hover { background: #111820; }

        .feature-icon {
          font-size: 28px;
          margin-bottom: 16px;
          display: block;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #e2e8f0;
        }

        .feature-desc {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.6;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          max-width: 800px;
        }

        .pricing-card {
          background: #0d1117;
          border: 1px solid #1e2836;
          border-radius: 16px;
          padding: 36px;
          position: relative;
          transition: all 0.2s;
        }
        .pricing-card:hover { border-color: #2a3444; }
        .pricing-card.highlight {
          border-color: #00d4ff;
          background: linear-gradient(135deg, #0d1117, #0d1a24);
        }
        .pricing-card.highlight::before {
          content: 'MOST POPULAR';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #00d4ff;
          color: #06090f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 4px 14px;
          border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
        }

        .plan-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a5568;
          margin-bottom: 12px;
        }

        .plan-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 1;
          letter-spacing: 0.02em;
          margin-bottom: 4px;
        }
        .plan-price sup {
          font-size: 24px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          vertical-align: super;
        }

        .plan-period {
          font-size: 13px;
          color: #4a5568;
          margin-bottom: 28px;
        }

        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }
        .plan-features li {
          font-size: 14px;
          color: #8892a4;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .plan-features li::before {
          content: '✓';
          color: #00ff88;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
        }

        .plan-cta {
          display: block;
          text-align: center;
          padding: 13px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .plan-cta.primary {
          background: #00d4ff;
          color: #06090f;
        }
        .plan-cta.primary:hover { background: #33dcff; transform: translateY(-1px); }
        .plan-cta.secondary {
          background: transparent;
          color: #8892a4;
          border: 1px solid #2a3444;
        }
        .plan-cta.secondary:hover { border-color: #4a5568; color: #e2e8f0; }

        .download-section {
          background: linear-gradient(135deg, #080b14 0%, #0d1117 100%);
          border-top: 1px solid #1e2836;
          border-bottom: 1px solid #1e2836;
        }

        .download-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 48px;
        }

        .download-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          letter-spacing: 0.02em;
          margin-bottom: 12px;
        }

        .download-sub {
          font-size: 15px;
          color: #4a5568;
        }

        .chrome-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #e2e8f0;
          color: #06090f;
          padding: 16px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .chrome-badge:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

        .footer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          color: #2a3444;
        }
        .footer-links {
          display: flex;
          gap: 24px;
          list-style: none;
        }
        .footer-links a {
          font-size: 13px;
          color: #2a3444;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: #4a5568; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 120px 24px 60px; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 100%; }
          .section-inner { padding: 60px 24px; }
          .nav { padding: 16px 24px; }
          .nav.scrolled { padding: 12px 24px; }
          .nav-links { display: none; }
          .download-inner { grid-template-columns: 1fr; gap: 24px; }
          .footer { flex-direction: column; gap: 16px; }
        }
      `}</style>

      <div className="noise" />

      {/* Glow orbs */}
      <div className="glow-orb" style={{ width: 600, height: 600, background: 'rgba(0,212,255,0.06)', top: -200, right: -100 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: 'rgba(167,139,250,0.05)', bottom: '20%', left: -100 }} />

      {/* Nav */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">TabMonitor</div>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <a href="#download" className="nav-cta">Add to Chrome →</a>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <section className="hero" style={{ maxWidth: '100%', padding: '140px 48px 80px' }}>
          <div>
            <p className="hero-eyebrow">Chrome Extension · Free forever</p>
            <h1 className="hero-title">
              Find the bloat.
              <span>Kill the lag.</span>
            </h1>
            <p className="hero-desc">
              TabMonitor shows you exactly which tabs are eating your RAM and CPU — and lets you close them in one click.
            </p>
            <div className="hero-buttons">
              <a href="#download" className="btn-primary">
                <span>⬇</span> Add to Chrome — Free
              </a>
              <a href="#features" className="btn-ghost">See features</a>
            </div>
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-num"><AnimatedCounter target={2400} suffix="+" /></span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-num"><AnimatedCounter target={4} suffix="★" /></span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-num"><AnimatedCounter target={100} suffix="%" /></span>
                <span className="stat-label">Free forever</span>
              </div>
            </div>
          </div>
          <div>
            <TabMockup />
          </div>
        </section>
      </div>

      {/* Features */}
      <section id="features">
        <div className="section-inner">
          <p className="section-label">Features</p>
          <h2 className="section-title">Everything your browser<br />never told you</h2>
          <p className="section-sub">Real-time data on every tab, with the tools to act on it.</p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="section-inner">
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Simple, honest pricing</h2>
          <p className="section-sub">Start free. Upgrade if you want deeper insights and custom rules.</p>
          <div className="pricing-grid">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}>
                <p className="plan-name">{plan.name}</p>
                <div className="plan-price">
                  {plan.price === '0' ? 'Free' : <><sup>kr</sup>{plan.price}</>}
                </div>
                <p className="plan-period">{plan.period}</p>
                <ul className="plan-features">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="#download" className={`plan-cta ${plan.highlight ? 'primary' : 'secondary'}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="download-section">
        <div className="download-inner">
          <div>
            <h2 className="download-title">Ready to reclaim your RAM?</h2>
            <p className="download-sub">Free to install. No account required. Works immediately.</p>
          </div>
          <a href="https://chromewebstore.google.com" className="chrome-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#4285F4"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
              <path d="M12 8h8.66A10 10 0 0 0 12 2z" fill="#EA4335"/>
              <path d="M4.22 17A10 10 0 0 0 12 22l4.33-7.5A4 4 0 0 1 12 8H3.34A10 10 0 0 0 4.22 17z" fill="#34A853"/>
              <path d="M12 8H3.34A10 10 0 0 0 4.22 17L8.5 9.5A4 4 0 0 1 12 8z" fill="#FBBC04"/>
            </svg>
            Add to Chrome — It's free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer">
          <span className="footer-logo">TabMonitor</span>
          <ul className="footer-links">
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="mailto:support@tabmonitor.com">Support</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
