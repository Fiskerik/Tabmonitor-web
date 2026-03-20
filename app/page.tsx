'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import tabmonitorLogo from '../logo.png';
import tabmonitorIcon from '../icon48.png';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Download', href: '#download' },
  { label: 'Blog', href: '/blog' },
];

const FEATURES = [
  {
    icon: '🔒',
    title: 'Focus Mode lock',
    desc: 'Preserve selected tabs, lock new tabs/windows for a timed session, then restore your full workspace automatically.',
    color: '#22c55e',
  },
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

const SEO_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Tab Monitor',
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'Chrome',
  description:
    'TabMonitor is a Chrome side panel extension for focus and productivity. It provides Focus Mode lock sessions, live tab monitoring, tab manager controls, lightweight task manager support, and pomodoro-friendly workflows to reduce tab overload.',
  featureList: [
    'Focus Mode lock that blocks opening new tabs and windows for a selected duration',
    'Restore preserved tabs automatically after Focus Mode ends',
    'Live RAM and CPU monitoring per tab',
    'Tab suspension and one-click cleanup actions',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4',
    ratingCount: '2400',
  },
  url: 'https://www.tabmonitor.se',
};
const EXTENSION_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tab Monitor",
  "applicationCategory": "BrowserApplication",
  "browserRequirements": "Requires Chrome 88+",
  "operatingSystem": "Chrome OS, Windows, macOS, Linux",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating", 
    "ratingValue": "5.0",
    "ratingCount": "100"  
  },
  "installUrl": "https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd",
  "screenshot": "https://lh3.googleusercontent.com/vbJnjbT4tmuwLb3qJWnJcsmAiw5dPFZHm98xveMUzFIt-CLEQlyw4qyZpurs_BQmHZNbl872Ro-q9nCpCuEfl612k5A=s800-w800-h500",  
  "featureList": [
    "Focus Mode lock sessions",
    "Real-time RAM and CPU monitoring per tab",
    "Tab suspension and cleanup",
    "Session history tracking",
    "Pomodoro-style workflows"
  ]
}

const MOCK_TABS = [
  { id: 1, title: 'YouTube — Lofi Study Beats', domain: 'youtube.com', mb: 847, cpu: 18.2, status: 'critical', winColor: '#3b82f6', favicon: '▶' },
  { id: 2, title: 'Design System — Figma', domain: 'figma.com', mb: 512, cpu: 6.4, status: 'warning', winColor: '#3b82f6', favicon: '◈' },
  { id: 3, title: 'Inbox — Gmail', domain: 'mail.google.com', mb: 203, cpu: 1.1, status: 'normal', winColor: '#22c55e', favicon: 'M' },
  { id: 4, title: 'tabmonitor-web — VS Code', domain: 'github.dev', mb: 390, cpu: 4.8, status: 'warning', winColor: '#22c55e', favicon: '⌥' },
  { id: 5, title: 'Hacker News', domain: 'news.ycombinator.com', mb: 78, cpu: 0.2, status: 'normal', winColor: '#22c55e', favicon: 'Y' },
] as const;

const SETTINGS_LOCALE = {
  en: {
    title: 'Settings',
    subtitle: 'Soft theme preview · English locale',
    sections: {
      optionalFeatures: {
        title: 'Optional features',
        description: 'Toggle lightweight enhancements only when you need them.',
        items: ['Soft theme', 'Compact metrics row', 'Focus reminders'],
      },
      activeDevices: {
        title: 'Active devices',
        description: 'Review browsers currently connected to your license.',
        status: '2 of 3 devices active',
      },
      accountAndLicense: {
        title: 'Account & license',
        description: 'Signed in as hello@tabmonitor.se · Pro trial until Apr 2',
        cta: 'Manage license',
      },
      proFeatures: {
        title: 'Pro features',
        description: 'Unlock reports, rules, and higher device limits whenever you are ready.',
        cta: 'See Pro features',
      },
    },
  },
} as const;

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does TabMonitor Focus Mode work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Choose tabs you want to preserve, start a timer, and TabMonitor blocks opening new tabs or windows until the timer ends. After the session, your full tab workspace is restored automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is TabMonitor a good alternative to OneTab and Workona?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. TabMonitor combines tab performance monitoring with focus workflows, timed lock sessions, and cleanup actions in one side panel.',
      },
    },
  ],
};

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
  const [tabs, setTabs] = useState([...MOCK_TABS]);
  const [preservedTabIds, setPreservedTabIds] = useState<number[]>([2, 3]);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(15);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [activeView, setActiveView] = useState<'tabs' | 'settings'>('tabs');

  const locale = SETTINGS_LOCALE.en;

  const totalMb = tabs.reduce((sum, tab) => sum + tab.mb, 0);
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

    const iconSleep = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const iconBin   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;

  const critCount = tabs.filter(tab => tab.status === 'critical').length;
  const warnCount = tabs.filter(tab => tab.status === 'warning').length;
  const normCount = tabs.filter(tab => tab.status === 'normal').length;
  const maxMb = Math.max(...tabs.map(t => t.mb));

  const togglePreservedTab = (id: number) => {
    if (isFocusModeActive) return;
    setPreservedTabIds(current => {
      const hasId = current.includes(id);
      if (hasId) return current.filter(tabId => tabId !== id);
      return [...current, id];
    });
  };

  const handleStartFocusMode = () => {
    const selectedCount = preservedTabIds.length;
    if (selectedCount === 0 || isFocusModeActive) return;

    const preservedTabs = MOCK_TABS.filter(tab => preservedTabIds.includes(tab.id));
    const durationInSeconds = focusMinutes * 60;

    console.log('[Focus Mode] Starting session', {
      preservedTabs: preservedTabs.map(tab => tab.title),
      focusMinutes,
      durationInSeconds,
    });

    setTabs(preservedTabs);
    setRemainingSeconds(durationInSeconds);
    setIsFocusModeActive(true);
  };

  useEffect(() => {
    if (!isFocusModeActive || remainingSeconds <= 0) return;

    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds(current => current - 1);
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [isFocusModeActive, remainingSeconds]);

  useEffect(() => {
    if (!isFocusModeActive || remainingSeconds > 0) return;

    console.log('[Focus Mode] Session completed. Restoring all tabs.');
    setIsFocusModeActive(false);
    setTabs([...MOCK_TABS]);
  }, [isFocusModeActive, remainingSeconds]);

  const remainingMinutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSecs = (remainingSeconds % 60).toString().padStart(2, '0');

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
          <span
            style={{
              fontSize: 9,
              color: isFocusModeActive ? '#22c55e' : '#4a5568',
              border: `1px solid ${isFocusModeActive ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`,
              borderRadius: 10,
              padding: '2px 6px',
              fontFamily: 'monospace',
            }}
          >
            {isFocusModeActive ? `FOCUS ${remainingMinutes}:${remainingSecs}` : 'READY'}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--cyan)', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '2px 6px' }}>{totalGb} GB</span>
          <button
            onClick={() => setActiveView((current) => current === 'tabs' ? 'settings' : 'tabs')}
            aria-label={locale.title}
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              border: `1px solid ${activeView === 'settings' ? 'rgba(87,188,255,0.35)' : 'var(--border)'}` ,
              background: activeView === 'settings' ? 'rgba(87,188,255,0.12)' : 'rgba(255,255,255,0.4)',
              color: activeView === 'settings' ? 'var(--accent-strong)' : 'var(--text-mid)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            ⚙
          </button>
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

      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>FOCUS MODE</span>
          <input
            type="number"
            min={5}
            max={90}
            value={focusMinutes}
            disabled={isFocusModeActive}
            onChange={(event) => setFocusMinutes(Number(event.target.value) || 5)}
            style={{ width: 46, padding: '2px 4px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 9 }}
          />
          <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'monospace' }}>MIN</span>
          <button
            onClick={handleStartFocusMode}
            disabled={isFocusModeActive || preservedTabIds.length === 0}
            style={{ marginLeft: 'auto', padding: '3px 8px', borderRadius: 5, border: '1px solid rgba(34,197,94,0.4)', background: isFocusModeActive ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 9, cursor: isFocusModeActive ? 'default' : 'pointer', fontFamily: 'inherit' }}
          >
            {isFocusModeActive ? 'Session active' : 'Start focus'}
          </button>
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'monospace' }}>
          Preserve tabs by toggling 🔒. While active, new tabs/windows are blocked in this demo.
        </div>
      </div>

      {activeView === 'tabs' ? (
        <>
      {/* Sort/filter bar */}
      <div style={{ padding: '4px 12px 6px', display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: 'var(--text-dim)', marginRight: 4, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sort</span>
        {['RAM ↓', 'CPU', 'Idle'].map((s, i) => (
          <button key={s} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 999, border: i === 0 ? '1px solid rgba(87,188,255,0.35)' : '1px solid var(--border)', background: i === 0 ? 'rgba(87,188,255,0.12)' : 'rgba(255,255,255,0.65)', color: i === 0 ? 'var(--accent-strong)' : 'var(--text-dim)', cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{tabs.length} tabs</span>
      </div>

      {/* Tab list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {tabs.map((tab, i) => {
          const ramPct = Math.min((tab.mb / maxMb) * 100, 100);
          const cpuPct = Math.min(tab.cpu * 4, 100);
          const mbStr = tab.mb >= 1024 ? `${(tab.mb/1024).toFixed(2)} GB` : `${tab.mb} MB`;
          const isPreserved = preservedTabIds.includes(tab.id);
          return (
            <div key={tab.id} style={{
              background: statusBg[tab.status],
              borderBottom: i < tabs.length - 1 ? '1px solid rgba(122,145,173,0.18)' : 'none',
              borderLeft: `2px solid ${tab.winColor}`,
              padding: '8px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[tab.status], flexShrink: 0 }} />
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(233,241,250,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--text-mid)', fontWeight: 700, flexShrink: 0 }}>{tab.favicon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.title}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{tab.domain}</div>
                </div>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  <button
                    onClick={() => togglePreservedTab(tab.id)}
                    disabled={isFocusModeActive}
                    style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${isPreserved ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`, background: isPreserved ? 'rgba(34,197,94,0.14)' : 'transparent', color: isPreserved ? '#22c55e' : '#4a5568', cursor: isFocusModeActive ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    🔒
                  </button>
                  {[iconSleep, iconBin].map((icon, j) => (
                    <button key={j} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  ))}
                </div>
              </div>
              {/* Metric bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 8, color: 'var(--text-dim)', fontFamily: 'monospace', width: 20, textTransform: 'uppercase' }}>RAM</span>
                  <div style={{ flex: 1, height: 3, background: 'rgba(122,145,173,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ramPct}%`, background: tab.status === 'critical' ? '#ef4444' : tab.status === 'warning' ? '#f59e0b' : 'rgba(0,212,255,0.6)', borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: statusColor[tab.status], minWidth: 44, textAlign: 'right' }}>{mbStr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 8, color: 'var(--text-dim)', fontFamily: 'monospace', width: 20, textTransform: 'uppercase' }}>CPU</span>
                  <div style={{ flex: 1, height: 3, background: 'rgba(122,145,173,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cpuPct}%`, background: tab.cpu > 10 ? '#ff6b35' : 'rgba(167,139,250,0.6)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: tab.cpu > 10 ? '#ff6b35' : '#8892a4', minWidth: 44, textAlign: 'right' }}>{tab.cpu}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

        </>
      ) : (
        <div style={{ padding: '12px', display: 'grid', gap: 10, background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(244,248,252,0.92))' }}>
          <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(122,145,173,0.22)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>{locale.title}</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 3, fontFamily: 'monospace' }}>{locale.subtitle}</div>
          </div>
          {[
            locale.sections.optionalFeatures,
            locale.sections.activeDevices,
            locale.sections.accountAndLicense,
            locale.sections.proFeatures,
          ].map((section) => (
            <div key={section.title} style={{ padding: '11px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(122,145,173,0.22)', boxShadow: '0 10px 24px rgba(15,23,42,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em' }}>{section.title}</div>
                {'status' in section ? <span style={{ fontSize: 8, color: 'var(--accent-strong)', background: 'rgba(87,188,255,0.12)', borderRadius: 999, padding: '3px 6px', fontFamily: 'monospace' }}>{section.status}</span> : null}
                {'cta' in section ? <span style={{ fontSize: 8, color: 'var(--accent-strong)', fontWeight: 700 }}>{section.cta}</span> : null}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', lineHeight: 1.5, marginTop: 5 }}>
                {section.description}
              </div>
              {'items' in section ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {section.items.map((item) => (
                    <span key={item} style={{ fontSize: 8, padding: '4px 7px', borderRadius: 999, background: 'rgba(233,241,250,0.95)', color: 'var(--text-dim)', border: '1px solid rgba(122,145,173,0.18)' }}>{item}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{ padding: '8px 12px', background: 'var(--panel-top)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button style={{ flex: 1, padding: '6px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>⚠ Close critical</button>
        <button disabled={isFocusModeActive} style={{ flex: 1, padding: '6px', borderRadius: 7, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.65)', color: isFocusModeActive ? 'var(--text-dim)' : 'var(--text-mid)', fontSize: 10, cursor: isFocusModeActive ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>+ New tab</button>
        <button disabled={isFocusModeActive} style={{ flex: 1, padding: '6px', borderRadius: 7, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.65)', color: isFocusModeActive ? 'var(--text-dim)' : 'var(--text-mid)', fontSize: 10, cursor: isFocusModeActive ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>+ New window</button>
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
      <Script id="tabmonitor-seo-structured-data" type="application/ld+json">
        {JSON.stringify(SEO_STRUCTURED_DATA)}
      </Script>
      <Script id="tabmonitor-faq-structured-data" type="application/ld+json">
        {JSON.stringify(FAQ_STRUCTURED_DATA)}
      </Script>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #f5f7fb;
          --panel:      rgba(255,255,255,0.86);
          --panel-top:  rgba(244,248,252,0.96);
          --border:     rgba(122,145,173,0.22);
          --text:       #18212f;
          --text-mid:   #506176;
          --text-dim:   #6f8196;
          --cyan:       #57bcff;
          --purple:     #8d8cf8;
          --green:      #1fa463;
          --orange:     #e47a3f;
          --red:        #dc5c5c;
          --accent-strong: #1f6fb7;
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
          background: rgba(245,247,251,0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(122,145,173,0.18); padding: 14px 48px;
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
        .btn-ghost:hover { border-color: rgba(87,188,255,0.28); background: rgba(255,255,255,0.75); }

        /* ── Extension frame ── */
        .extension-frame {
          position: relative;
          /* Chrome extension frame */
        }
        .chrome-frame {
          background: rgba(233,239,247,0.96); border-radius: 12px 12px 0 0;
          padding: 10px 14px 0; border: 1px solid rgba(122,145,173,0.24); border-bottom: none;
          display: flex; align-items: center; gap: 8px; margin-bottom: -1px;
        }
        .chrome-dots { display: flex; gap: 5px; }
        .chrome-dot { width: 9px; height: 9px; border-radius: 50%; }
        .chrome-url {
          flex: 1; background: rgba(255,255,255,0.78); border-radius: 999px;
          padding: 3px 10px; font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: var(--text-dim); letter-spacing: 0.02em;
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
        .feature-card:hover { background: rgba(250,252,255,0.98); }
        .feature-icon { font-size: 26px; margin-bottom: 16px; display: block; }
        .feature-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
        .feature-desc { font-size: 13px; color: var(--text-dim); line-height: 1.65; }

        /* ── Pricing ── */
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 800px; }

        .pricing-card {
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 16px; padding: 36px; position: relative; transition: all 0.2s;
        }
        .pricing-card:hover { border-color: rgba(87,188,255,0.28); box-shadow: 0 12px 34px rgba(15,23,42,0.05); }
        .pricing-card.highlight {
          border-color: var(--cyan);
          background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(236,244,255,0.98));
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
        .plan-cta.secondary:hover { border-color: rgba(87,188,255,0.28); color: var(--text); background: rgba(255,255,255,0.82); }

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
        .chrome-badge:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(15,23,42,0.12); }

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
          .nav-cta { display: none; }
          .hero-buttons { width: 100%; }
          .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
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
          <Image src={tabmonitorLogo} alt="Tab Monitor Chrome extension icon - side panel productivity tool" className="brand-logo" priority />
          TabMonitor
          <span className="nav-badge">v1.0</span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a href={link.href}>{link.label}</a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </li>
          ))}
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
          <h1>Tab Monitor - Chrome Extension for Tab Management & RAM Monitoring</h1>
          <h2>Control browser memory, manage tabs, and stay focused from one side panel</h2>
          <p className="hero-desc">
            TabMonitor gives you one side panel for monitoring, tab management, and focus. See heavy tabs live, cut browser lag fast, and stay organized with task manager and pomodoro-style workflows.
          </p>
          <div className="hero-buttons">
            <a href="https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd" className="btn-primary">⬇ Add to Chrome — Free</a>
            <a href="#features" className="btn-ghost">See features</a>
          </div>
         <div className="stats-bar" hidden>
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
          </div>
        </div>

        {/* Accurate extension mockup */}
        <div className="extension-frame">
          <div className="chrome-frame">
            <div className="chrome-dots">
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} className="chrome-dot" style={{ background: c }} />)}
            </div>
            <div className="chrome-url">chrome-extension://tabmonitor/sidepanel.html</div>
            <div className="chrome-ext-icon">
              <Image src={tabmonitorIcon} alt="Tab Monitor Chrome extension icon - side panel productivity tool" width={20} height={20} />
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
          <p className="section-sub">Built for people who want focus and productivity: monitor every tab in real time, run Focus Mode lock sessions, and take action before Chrome slows down. Compared to single-purpose tab tools, TabMonitor combines monitoring + focus in one panel.</p>
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
            <Image src={tabmonitorLogo} alt="Tab Monitor Chrome extension icon - side panel productivity tool" className="footer-logo-img" />
            TabMonitor
          </span>
          <ul className="footer-links">
            <li><a href="/blog">Blog</a></li>
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
