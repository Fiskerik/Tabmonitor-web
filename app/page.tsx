'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import tabmonitorLogo from '../logo.png';
import tabmonitorIcon from '../icon48.png';

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
    cta: 'Install free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '2.99',
    period: 'per month',
    features: [
      'Everything in Free',
      'Advanced insights',
      'Per-site memory rules',
      'Weekly reports',
      'CSV export',
      'Priority support',
    ],
    cta: 'Start 3-day trial',
    highlight: true,
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// ── Accurate Extension Mockup ─────────────────────────────
function ExtensionMockup() {
  const tabs = [
    { title: 'YouTube — Lofi Study Beats', domain: 'youtube.com', mb: 847, cpu: 18.2, status: 'critical', winColor: '#3b82f6', favicon: '▶' },
    { title: 'Design System — Figma', domain: 'figma.com', mb: 512, cpu: 6.4, status: 'warning', winColor: '#3b82f6', favicon: '◈' },
    { title: 'Inbox — Gmail', domain: 'mail.google.com', mb: 203, cpu: 1.1, status: 'normal', winColor: '#22c55e', favicon: 'M' },
    { title: 'tabmonitor-web — VS Code', domain: 'github.dev', mb: 390, cpu: 4.8, status: 'warning', winColor: '#22c55e', favicon: '⌥' },
    { title: 'Hacker News', domain: 'news.ycombinator.com', mb: 78, cpu: 0.2, status: 'normal', winColor: '#22c55e', favicon: 'Y' },
  ];

  const totalMb = tabs.reduce((s, t) => s + t.mb, 0);
  const totalGb = (totalMb / 1024).toFixed(1);

  const statusColor: Record<string, string> = {
    critical: '#ef4444',
    warning: '#f59e0b',
    normal: '#22c55e',
  };
  const statusBg: Record<string, string> = {
    critical: 'rgba(239,68,68,0.06)',
    warning: 'rgba(245,158,11,0.04)',
    normal: 'transparent',
  };

  const iconFocus = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
  const iconSleep = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const iconBin   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;

  const critCount = tabs.filter(t => t.status === 'critical').length;
  const warnCount = tabs.filter(t => t.status === 'warning').length;
  const normCount = tabs.filter(t => t.status === 'normal').length;
  const maxMb = Math.max(...tabs.map(t => t.mb));

  return (
    <div style={{
      width: 340,
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12,
      boxShadow: '0 0 80px rgba(0,212,255,0.1), 0 40px 80px rgba(0,0,0,0.7)',
      flexShrink: 0,
    }}>
      {/* Top bar */}
      <div style={{ background: 'var(--panel-top)', padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.1em', color: 'var(--cyan)' }}>TabMonitor</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--cyan)', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '2px 6px' }}>{totalGb} GB</span>
          <span style={{ fontSize: 16, cursor: 'pointer' }}>⚙</span>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '10px 12px 6px' }}>
        {[
          { label: 'Critical', count: critCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
          { label: 'Warning', count: warnCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
          { label: 'Normal', count: normCount, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.count}</div>
            <div style={{ fontSize: 9, color: s.color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sort/filter bar */}
      <div style={{ padding: '4px 12px 6px', display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: '#4a5568', marginRight: 4, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sort</span>
        {['RAM ↓', 'CPU', 'Idle'].map((s, i) => (
          <button key={s} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, border: i === 0 ? '1px solid var(--cyan)' : '1px solid var(--border)', background: i === 0 ? 'rgba(0,212,255,0.1)' : 'transparent', color: i === 0 ? 'var(--cyan)' : '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#4a5568', fontFamily: 'monospace' }}>{tabs.length} tabs</span>
      </div>

      {/* Tab list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {tabs.map((tab, i) => {
          const ramPct = Math.min((tab.mb / maxMb) * 100, 100);
          const cpuPct = Math.min(tab.cpu * 4, 100);
          const mbStr = tab.mb >= 1024 ? `${(tab.mb/1024).toFixed(2)} GB` : `${tab.mb} MB`;
          return (
            <div key={i} style={{
              background: statusBg[tab.status],
              borderBottom: i < tabs.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              borderLeft: `2px solid ${tab.winColor}`,
              padding: '8px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[tab.status], flexShrink: 0 }} />
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#8892a4', fontWeight: 700, flexShrink: 0 }}>{tab.favicon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.title}</div>
                  <div style={{ fontSize: 9, color: '#4a5568', fontFamily: 'monospace' }}>{tab.domain}</div>
                </div>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {[iconFocus, iconSleep, iconBin].map((icon, j) => (
                    <button key={j} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  ))}
                </div>
              </div>
              {/* Metric bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 8, color: '#4a5568', fontFamily: 'monospace', width: 20, textTransform: 'uppercase' }}>RAM</span>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ramPct}%`, background: tab.status === 'critical' ? '#ef4444' : tab.status === 'warning' ? '#f59e0b' : 'rgba(0,212,255,0.6)', borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: statusColor[tab.status], minWidth: 44, textAlign: 'right' }}>{mbStr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 8, color: '#4a5568', fontFamily: 'monospace', width: 20, textTransform: 'uppercase' }}>CPU</span>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cpuPct}%`, background: tab.cpu > 10 ? '#ff6b35' : 'rgba(167,139,250,0.6)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: tab.cpu > 10 ? '#ff6b35' : '#8892a4', minWidth: 44, textAlign: 'right' }}>{tab.cpu}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div style={{ padding: '8px 12px', background: 'var(--panel-top)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button style={{ flex: 1, padding: '6px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>⚠ Close critical</button>
        <button style={{ flex: 1, padding: '6px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: '#8892a4', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>↻ Refresh</button>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderTop: '1px solid var(--border)', background: 'var(--panel-top)' }}>
        {[
          { icon: '▦', label: 'Tabs', active: true },
          { icon: '◷', label: 'Session', active: false },
          { icon: '⟳', label: 'History', active: false },
          { icon: '✦', label: 'Stats', active: false },
          { icon: '⭐', label: 'Favs', active: false },
          { icon: '◎', label: 'Analytics', active: false },
        ].map(tab => (
          <button key={tab.label} style={{ padding: '7px 4px 5px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderTop: tab.active ? '2px solid var(--cyan)' : '2px solid transparent', marginTop: -1 }}>
            <span style={{ fontSize: 13, color: tab.active ? 'var(--cyan)' : '#4a5568' }}>{tab.icon}</span>
            <span style={{ fontSize: 8, color: tab.active ? 'var(--cyan)' : '#4a5568', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{tab.label}</span>
          </button>
        ))}
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #06090f;
          --panel:      #0d1117;
          --panel-top:  #080b14;
          --border:     #1e2836;
          --text:       #e2e8f0;
          --text-mid:   #8892a4;
          --text-dim:   #4a5568;
          --cyan:       #00d4ff;
          --purple:     #a78bfa;
          --green:      #22c55e;
          --orange:     #ff6b35;
          --red:        #ef4444;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        ::selection { background: rgba(0,212,255,0.25); }

        /* Noise overlay */
        .noise {
          position: fixed; inset: 0; opacity: 0.025;
          pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .glow-orb {
          position: fixed; border-radius: 50%;
          filter: blur(140px); pointer-events: none; z-index: 0;
        }

        /* Scanline effect on hero area */
        .scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          pointer-events: none; z-index: 0;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px; transition: all 0.3s;
        }
        .nav.scrolled {
          background: rgba(6,9,15,0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05); padding: 14px 48px;
        }
        .nav-logo {
          font-family: 'Bebas Neue', sans-serif; font-size: 22px;
          letter-spacing: 0.1em; color: var(--cyan);
          display: flex; align-items: center; gap: 8px;
        }
        .brand-logo {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(0,212,255,0.35);
        }
        .nav-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.25);
          color: var(--cyan); padding: 2px 7px; border-radius: 4px;
          letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px;
        }
        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a { color: var(--text-mid); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-cta {
          background: var(--cyan); color: var(--bg) !important; padding: 9px 20px;
          border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .nav-cta:hover { background: #33dcff; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,212,255,0.3); }

        /* ── HERO ── */
        .hero-wrap {
          position: relative; z-index: 1; min-height: 100vh;
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 56px;
          padding: 140px 48px 80px;
        }

        .hero-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; color: var(--cyan); text-transform: uppercase;
          margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
        }
        .hero-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: var(--cyan); }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 7.5vw, 108px);
          line-height: 0.92; letter-spacing: 0.02em; margin-bottom: 26px;
        }
        .hero-title .accent {
          background: linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hero-desc { font-size: 17px; line-height: 1.75; color: var(--text-mid); margin-bottom: 40px; max-width: 440px; }

        .hero-buttons { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--cyan); color: var(--bg); padding: 14px 28px; border-radius: 10px;
          font-weight: 700; font-size: 15px; text-decoration: none;
          transition: all 0.2s; border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #33dcff; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,212,255,0.35); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--text); padding: 14px 28px; border-radius: 10px;
          font-weight: 600; font-size: 15px; text-decoration: none;
          transition: all 0.2s; border: 1px solid var(--border); cursor: pointer;
        }
        .btn-ghost:hover { border-color: #2a3444; background: rgba(255,255,255,0.03); }

        /* ── Extension frame ── */
        .extension-frame {
          position: relative;
          /* Chrome extension frame */
        }
        .chrome-frame {
          background: #1a1d2e; border-radius: 12px 12px 0 0;
          padding: 10px 14px 0; border: 1px solid #2a3444; border-bottom: none;
          display: flex; align-items: center; gap: 8px; margin-bottom: -1px;
        }
        .chrome-dots { display: flex; gap: 5px; }
        .chrome-dot { width: 9px; height: 9px; border-radius: 50%; }
        .chrome-url {
          flex: 1; background: rgba(255,255,255,0.05); border-radius: 4px;
          padding: 3px 10px; font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: #4a5568; letter-spacing: 0.02em;
        }
        .chrome-ext-icon {
          width: 16px; height: 16px; border-radius: 3px;
          background: var(--cyan); display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: var(--bg); font-family: 'Bebas Neue', sans-serif;
        }

        /* ── Stats bar ── */
        .stats-bar {
          display: flex; gap: 32px; margin-top: 48px; padding-top: 32px;
          border-top: 1px solid var(--border);
        }
        .stat-num {
          font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700;
          color: var(--text); display: block;
        }
        .stat-label {
          font-size: 11px; color: var(--text-dim); text-transform: uppercase;
          letter-spacing: 0.1em; margin-top: 2px; font-family: 'JetBrains Mono', monospace;
        }

        /* ── Sections ── */
        section { position: relative; z-index: 1; }
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 100px 48px; }

        .section-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--cyan); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::after { content: ''; display: block; height: 1px; width: 40px; background: var(--cyan); }

        .section-title {
          font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 5vw, 64px);
          line-height: 1; letter-spacing: 0.02em; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: var(--text-mid); max-width: 480px; line-height: 1.7; margin-bottom: 64px; }

        /* ── Features ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
        }
        .feature-card { background: var(--panel); padding: 32px; transition: background 0.2s; }
        .feature-card:hover { background: #111820; }
        .feature-icon { font-size: 26px; margin-bottom: 16px; display: block; }
        .feature-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
        .feature-desc { font-size: 13px; color: var(--text-dim); line-height: 1.65; }

        /* ── Pricing ── */
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 800px; }

        .pricing-card {
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 16px; padding: 36px; position: relative; transition: all 0.2s;
        }
        .pricing-card:hover { border-color: #2a3444; }
        .pricing-card.highlight {
          border-color: var(--cyan);
          background: linear-gradient(135deg, var(--panel), #0d1a24);
        }
        .pricing-card.highlight::before {
          content: 'MOST POPULAR';
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--cyan); color: var(--bg); font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; padding: 4px 14px; border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
        .plan-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; }
        .plan-price { font-family: 'Bebas Neue', sans-serif; font-size: 56px; line-height: 1; letter-spacing: 0.02em; margin-bottom: 4px; }
        .plan-price sup { font-size: 22px; font-family: 'DM Sans', sans-serif; font-weight: 700; vertical-align: super; }
        .plan-period { font-size: 13px; color: var(--text-dim); margin-bottom: 28px; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .plan-features li { font-size: 14px; color: var(--text-mid); display: flex; align-items: center; gap: 10px; }
        .plan-features li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 12px; flex-shrink: 0; }
        .plan-cta {
          display: block; text-align: center; padding: 13px; border-radius: 10px;
          font-weight: 700; font-size: 14px; text-decoration: none; cursor: pointer;
          border: none; transition: all 0.2s;
        }
        .plan-cta.primary { background: var(--cyan); color: var(--bg); }
        .plan-cta.primary:hover { background: #33dcff; transform: translateY(-1px); }
        .plan-cta.secondary { background: transparent; color: var(--text-mid); border: 1px solid var(--border); }
        .plan-cta.secondary:hover { border-color: #2a3444; color: var(--text); }

        /* ── Download ── */
        .download-section { background: linear-gradient(135deg, var(--panel-top), var(--panel)); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .download-inner { max-width: 1200px; margin: 0 auto; padding: 80px 48px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 48px; }
        .download-title { font-family: 'Bebas Neue', sans-serif; font-size: 48px; letter-spacing: 0.02em; margin-bottom: 12px; }
        .download-sub { font-size: 15px; color: var(--text-dim); }

        .chrome-badge {
          display: flex; align-items: center; gap: 12px;
          background: var(--text); color: var(--bg); padding: 16px 28px; border-radius: 12px;
          text-decoration: none; font-weight: 700; font-size: 15px; white-space: nowrap; transition: all 0.2s;
        }
        .chrome-badge:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }

        /* ── Footer ── */
        .footer-inner { max-width: 1200px; margin: 0 auto; padding: 40px 48px; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.1em; color: var(--text-dim); }
        .footer-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-logo-img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          opacity: 0.8;
        }
        .footer-links { display: flex; gap: 24px; list-style: none; }
        .footer-links a { font-size: 13px; color: var(--text-dim); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #4a5568; }

        /* ── Divider line ── */
        .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); max-width: 1200px; margin: 0 auto; }

        /* ── Animated tag ── */
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse-dot 1.5s ease-in-out infinite; }

        /* ── Responsive ── */
        @media (max-width: 1000px) {
          .hero-wrap { grid-template-columns: 1fr; padding: 120px 24px 60px; }
          .extension-frame { display: none; }
        }
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 100%; }
          .section-inner { padding: 60px 24px; }
          .nav { padding: 16px 24px; }
          .nav.scrolled { padding: 12px 24px; }
          .nav-links { display: none; }
          .download-inner { grid-template-columns: 1fr; gap: 28px; }
          .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

      <div className="noise" />
      <div className="glow-orb" style={{ width: 700, height: 700, background: 'rgba(0,212,255,0.05)', top: -250, right: -150 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: 'rgba(167,139,250,0.04)', bottom: '15%', left: -80 }} />

      {/* ── Nav ── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <Image src={tabmonitorLogo} alt="TabMonitor logo" className="brand-logo" priority />
          TabMonitor
          <span className="nav-badge">v1.0</span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <a href="https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd" className="nav-cta">
          Add to Chrome →
        </a>
      </nav>

      {/* ── Hero ── */}
      <div className="hero-wrap">
        <div>
          <p className="hero-eyebrow">
            <span className="live-dot" /> Chrome Extension · Free forever
          </p>
          <h1 className="hero-title">
            Your tabs<br />
            are eating<br />
            <span className="accent">your RAM.</span>
          </h1>
          <p className="hero-desc">
            TabMonitor shows exactly which tabs are draining your memory and CPU — live, per-tab, every 3 seconds. Kill the lag in one click.
          </p>
          <div className="hero-buttons">
            <a href="https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd" className="btn-primary">⬇ Add to Chrome — Free</a>
            <a href="#features" className="btn-ghost">See features</a>
          </div>
         <div className="stats-bar" display="none" hidden>
            <div>
              <span className="stat-num"><AnimatedCounter target={2400} suffix="+" /></span>
              <span className="stat-label">Active users</span>
            </div>
            <div>
              <span className="stat-num"><AnimatedCounter target={4} suffix="★" /></span>
              <span className="stat-label">Chrome rating</span>
            </div>
            <div>
              <span className="stat-num"><AnimatedCounter target={100} suffix="%" /></span>
              <span className="stat-label">Free forever</span>
            </div>
          </div>*/
        </div>

        {/* Accurate extension mockup */}
        <div className="extension-frame">
          <div className="chrome-frame">
            <div className="chrome-dots">
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} className="chrome-dot" style={{ background: c }} />)}
            </div>
            <div className="chrome-url">chrome-extension://tabmonitor/sidepanel.html</div>
            <div className="chrome-ext-icon">
              <Image src={tabmonitorIcon} alt="TabMonitor extension icon" width={20} height={20} />
            </div>
          </div>
          <ExtensionMockup />
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features">
        <div className="section-inner">
          <p className="section-label">Features</p>
          <h2 className="section-title">Everything your browser<br />never told you</h2>
          <p className="section-sub">Real-time data on every open tab — with the tools to act on it immediately.</p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.02), transparent)' }}>
        <div className="section-inner">
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Simple, honest pricing</h2>
          <p className="section-sub">Start free — forever. Upgrade only if you want deeper insights and custom rules.</p>
          <div className="pricing-grid">
            {PRICING.map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}>
                <p className="plan-name">{plan.name}</p>
                <div className="plan-price">
                  {plan.price === '0' ? 'Free' : <><sup>$</sup>{plan.price}</>}
                </div>
                <p className="plan-period">{plan.period}</p>
                <ul className="plan-features">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="https://buy.stripe.com/3cI00idIFeLp3qb3sSc3m03" className={`plan-cta ${plan.highlight ? 'primary' : 'secondary'}`}>{plan.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download ── */}
      <section id="download" className="download-section">
        <div className="download-inner">
          <div>
            <h2 className="download-title">Ready to reclaim your RAM?</h2>
            <p className="download-sub">Free to install. No account required. Works immediately after adding to Chrome.</p>
          </div>
          <a href="https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd" className="chrome-badge">
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

      {/* ── Footer ── */}
      <footer>
        <div className="footer-inner">
          <span className="footer-logo footer-logo-wrap">
            <Image src={tabmonitorLogo} alt="TabMonitor logo" className="footer-logo-img" />
            TabMonitor
          </span>
          <ul className="footer-links">
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="mailto:eaconsulting.supp@gmail.com">Support</a></li>
            <li><a href="/uninstall">Uninstall</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
