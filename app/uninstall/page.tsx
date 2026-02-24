'use client';

import { useState } from 'react';

const REASONS = [
  { id: 'not-useful',    label: "It didn't do what I expected" },
  { id: 'too-slow',      label: "It slowed down my browser" },
  { id: 'privacy',       label: "I had privacy concerns" },
  { id: 'better-alt',    label: "I found a better alternative" },
  { id: 'temporary',     label: "Just uninstalling temporarily" },
  { id: 'bugs',          label: "Too many bugs or errors" },
  { id: 'other',         label: "Other reason" },
];

type Step = 'form' | 'submitted';

export default function UninstallPage() {
  const [step, setStep]             = useState<Step>('form');
  const [selected, setSelected]     = useState<string | null>(null);
  const [detail, setDetail]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await fetch('/api/feedback/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: selected, detail: detail.trim() }),
      });
    } catch {}
    setSubmitting(false);
    setStep('submitted');
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:     #06090f;
          --panel:  #0d1117;
          --border: #1e2836;
          --text:   #e2e8f0;
          --mid:    #8892a4;
          --dim:    #4a5568;
          --cyan:   #00d4ff;
          --red:    #ef4444;
          --green:  #22c55e;
        }

        body {
          background: var(--bg); color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow-x: hidden;
        }

        .noise {
          position: fixed; inset: 0; opacity: 0.025; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .glow {
          position: fixed; border-radius: 50%; filter: blur(150px);
          pointer-events: none; z-index: 0;
        }

        .card {
          position: relative; z-index: 1;
          width: 100%; max-width: 520px;
          background: var(--panel); border: 1px solid var(--border);
          border-radius: 20px; padding: 48px 44px;
          margin: 24px;
          box-shadow: 0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4);
        }

        /* ── Header ── */
        .logo {
          font-family: 'Bebas Neue', sans-serif; font-size: 18px;
          letter-spacing: 0.12em; color: var(--cyan); margin-bottom: 36px;
          display: flex; align-items: center; gap: 8px;
        }
        .logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); opacity: 0.6; }

        .card-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 36px;
          letter-spacing: 0.02em; line-height: 1; margin-bottom: 10px;
        }
        .card-sub {
          font-size: 14px; color: var(--mid); line-height: 1.65;
          margin-bottom: 36px;
        }

        /* ── Radio options ── */
        .options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }

        .option {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          background: transparent; border: 1px solid var(--border); border-radius: 10px;
          cursor: pointer; transition: all 0.15s; text-align: left;
          font-family: inherit; width: 100%;
        }
        .option:hover { border-color: #2a3444; background: rgba(255,255,255,0.02); }
        .option.selected {
          border-color: var(--cyan); background: rgba(0,212,255,0.06);
        }

        .radio-circle {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid var(--dim); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .option.selected .radio-circle {
          border-color: var(--cyan); background: var(--cyan);
        }
        .radio-inner {
          width: 6px; height: 6px; border-radius: 50%; background: var(--bg);
          opacity: 0; transition: opacity 0.15s;
        }
        .option.selected .radio-inner { opacity: 1; }

        .option-label {
          font-size: 14px; font-weight: 500; color: var(--text);
        }

        /* ── Text area ── */
        .detail-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim);
          margin-bottom: 8px; display: block;
        }
        .detail-field {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 12px 14px; color: var(--text); font-family: 'DM Sans', sans-serif;
          font-size: 13px; resize: none; min-height: 80px;
          outline: none; transition: border-color 0.2s; margin-bottom: 28px;
        }
        .detail-field:focus { border-color: rgba(0,212,255,0.3); }
        .detail-field::placeholder { color: var(--dim); }

        /* ── Buttons ── */
        .btn-submit {
          width: 100%; padding: 14px;
          background: var(--cyan); color: var(--bg);
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:disabled { opacity: 0.4; cursor: default; }
        .btn-submit:not(:disabled):hover {
          background: #33dcff; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,212,255,0.3);
        }

        .btn-skip {
          display: block; text-align: center; margin-top: 14px;
          font-size: 13px; color: var(--dim); cursor: pointer;
          background: none; border: none; font-family: inherit;
          transition: color 0.2s; width: 100%;
        }
        .btn-skip:hover { color: var(--mid); }

        /* ── Progress dots ── */
        .step-dots {
          display: flex; gap: 5px; margin-bottom: 28px;
        }
        .dot { width: 20px; height: 3px; border-radius: 2px; transition: all 0.3s; }

        /* ── Success state ── */
        .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin: 0 auto 28px;
        }
        .success-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 40px;
          letter-spacing: 0.02em; text-align: center; margin-bottom: 12px;
        }
        .success-sub {
          font-size: 14px; color: var(--mid); text-align: center;
          line-height: 1.65; margin-bottom: 36px;
        }
        .reinstall-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 13px 28px; background: transparent;
          border: 1px solid var(--border); border-radius: 10px;
          color: var(--text); font-family: inherit; font-weight: 600; font-size: 14px;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
          width: 100%;
        }
        .reinstall-btn:hover { border-color: var(--cyan); color: var(--cyan); background: rgba(0,212,255,0.04); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(6,9,15,0.3); border-top-color: var(--bg); border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="noise" />
      <div className="glow" style={{ width: 500, height: 500, background: 'rgba(0,212,255,0.04)', top: -200, right: -100 }} />
      <div className="glow" style={{ width: 300, height: 300, background: 'rgba(239,68,68,0.04)', bottom: -100, left: -50 }} />

      <div className="card">
        {step === 'form' && (
          <div className="fade-up">
            <div className="logo">
              <div className="logo-dot" />
              TabMonitor
            </div>

            <div className="step-dots">
              <div className="dot" style={{ background: 'var(--cyan)', width: 32 }} />
              <div className="dot" style={{ background: 'var(--border)' }} />
            </div>

            <h1 className="card-title">Sorry to see you go.</h1>
            <p className="card-sub">
              Quick question — what made you uninstall? Your answer helps us improve TabMonitor for everyone.
            </p>

            <div className="options">
              {REASONS.map(r => (
                <button
                  key={r.id}
                  className={`option ${selected === r.id ? 'selected' : ''}`}
                  onClick={() => setSelected(r.id)}
                >
                  <div className="radio-circle">
                    <div className="radio-inner" />
                  </div>
                  <span className="option-label">{r.label}</span>
                </button>
              ))}
            </div>

            {selected && (
              <div className="fade-up">
                <label className="detail-label">Anything else you'd like to add? (optional)</label>
                <textarea
                  className="detail-field"
                  placeholder="Tell us more..."
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  maxLength={400}
                />
              </div>
            )}

            <button
              className="btn-submit"
              disabled={!selected || submitting}
              onClick={handleSubmit}
            >
              {submitting
                ? <><div className="spinner" /> Sending…</>
                : 'Submit feedback'}
            </button>

            <button
              className="btn-skip"
              onClick={() => setStep('submitted')}
            >
              Skip — don't send feedback
            </button>
          </div>
        )}

        {step === 'submitted' && (
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div className="logo" style={{ justifyContent: 'center' }}>
              <div className="logo-dot" />
              TabMonitor
            </div>

            <div className="step-dots" style={{ justifyContent: 'center' }}>
              <div className="dot" style={{ background: 'var(--green)', width: 20 }} />
              <div className="dot" style={{ background: 'var(--green)', width: 32 }} />
            </div>

            <div className="success-icon">✓</div>
            <h2 className="success-title">Thanks for the feedback.</h2>
            <p className="success-sub">
              We read every response and use it to make TabMonitor better.
              <br />
              You can always reinstall — it takes 10 seconds.
            </p>

            <a
              href="https://chromewebstore.google.com"
              className="reinstall-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4285F4"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
                <path d="M12 8h8.66A10 10 0 0 0 12 2z" fill="#EA4335"/>
                <path d="M4.22 17A10 10 0 0 0 12 22l4.33-7.5A4 4 0 0 1 12 8H3.34A10 10 0 0 0 4.22 17z" fill="#34A853"/>
                <path d="M12 8H3.34A10 10 0 0 0 4.22 17L8.5 9.5A4 4 0 0 1 12 8z" fill="#FBBC04"/>
              </svg>
              Reinstall TabMonitor
            </a>
          </div>
        )}
      </div>
    </>
  );
}
