'use client';

import { useMemo, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const REASONS = [
  { id: 'not-useful',    label: "It didn't do what I expected" },
  { id: 'too-slow',      label: "It slowed down my browser" },
  { id: 'privacy',       label: "I had privacy concerns" },
  { id: 'better-alt',    label: "I found a better alternative" },
  { id: 'pro-expensive', label: "I want PRO functions, but Tab Monitor PRO is too expensive" },
  { id: 'temporary',     label: "Just uninstalling temporarily" },
  { id: 'bugs',          label: "Too many bugs or errors" },
  { id: 'other',         label: "Other reason" },
];

const PLANS = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$2.99',
    period: '/month',
    highlight: false,
    badge: null,
    stripeUrl: 'https://buy.stripe.com/3cI00idIFeLp3qb3sSc3m03',
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: '$29.99',
    period: '/year',
    highlight: true,
    badge: 'Save 16%',
    stripeUrl: 'https://buy.stripe.com/3cI00idIFeLp3qb3sSc3m03',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$49',
    period: 'one-time',
    highlight: false,
    badge: 'Best value',
    stripeUrl: 'https://buy.stripe.com/3cI00idIFeLp3qb3sSc3m03',
  },
];

type Step = 'form' | 'submitted';

function UninstallPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('form');
  const [selected, setSelected]     = useState<string | null>(null);
  const emailFromUrl = searchParams.get('email')?.trim() ?? '';
  const [detail, setDetail]         = useState('');
  const [rating, setRating]         = useState<number>(0);
  const [email, setEmail]           = useState(emailFromUrl);
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const trimmedDetail = detail.trim();
  const trimmedEmail = email.trim();
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail), [trimmedEmail]);

  async function handleSubmit() {
    if (!selected) return;

    if (!isEmailValid) {
      setError('Please enter a valid email before submitting.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/feedback/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: selected,
          details: trimmedDetail,
          rating: rating || null,
          email: trimmedEmail,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Failed to save feedback');
      }

      setStep('submitted');
    } catch (err: any) {
      setError(err?.message || 'Unable to save feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #f8f9fc;
          --surface:    #ffffff;
          --surface-2:  #f1f3f8;
          --border:     #eef0f5;
          --border-2:   #d9e1ee;
          --text:       #1a1d23;
          --mid:        #4b5263;
          --dim:        #8c93a3;
          --cyan:       #00d4ff;
          --purple:     #8b5cf6;
          --green:      #22c55e;
          --red:        #ef4444;
          --amber:      #fbbf24;
          --display:    'Inter', sans-serif;
          --body:       'Inter', sans-serif;
          --mono:       'JetBrains Mono', monospace;
        }

        body {
          background:
            linear-gradient(120deg, rgba(99,102,241,0.10), transparent 34%),
            linear-gradient(0deg, rgba(0,212,255,0.08), transparent 46%),
            var(--bg);
          color: var(--text);
          font-family: var(--body);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow-x: hidden;
          padding: clamp(42px, 8vh, 88px) 16px 32px;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black, transparent 78%);
        }
        body::after {
          display: none;
        }

        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 520px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 34px;
          box-shadow: 0 24px 70px rgba(15,23,42,0.10), 0 0 50px rgba(0,212,255,0.06);
        }

        /* ── Header ── */
        .logo {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--purple);
          text-transform: none;
          margin-bottom: 26px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          opacity: 0.8;
        }

        .card-title {
          font-family: var(--body);
          font-size: 28px;
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
          color: var(--text);
          text-wrap: balance;
          font-feature-settings: "liga" 1, "kern" 1;
          text-rendering: geometricPrecision;
        }
        .card-sub {
          font-size: 14px;
          color: var(--mid);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        /* ── Step dots ── */
        .step-dots {
          display: flex;
          gap: 5px;
          margin-bottom: 24px;
        }
        .dot {
          height: 3px;
          border-radius: 2px;
          transition: all 0.3s;
          background: var(--border-2);
          width: 20px;
        }

        /* ── Radio options ── */
        .options {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 24px;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          font-family: var(--body);
          width: 100%;
          color: var(--text);
        }
        .option:hover {
          border-color: var(--border-2);
          background: var(--surface-2);
        }
        .option.selected {
          border-color: var(--cyan);
          background: rgba(99,102,241,0.08);
        }

        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid var(--dim);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .option.selected .radio-circle {
          border-color: var(--cyan);
          background: var(--cyan);
        }
        .radio-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .option.selected .radio-inner { opacity: 1; }

        .option-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }

        /* ── Fields ── */
        .detail-label {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 8px;
          display: block;
        }
        .detail-field {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 11px 13px;
          color: var(--text);
          font-family: var(--body);
          font-size: 14px;
          resize: none;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 20px;
        }
        .detail-field:focus {
          border-color: rgba(138,124,243,0.4);
          background: var(--surface);
        }
        .detail-field::placeholder { color: var(--dim); }

        .email-field {
          min-height: 44px;
          resize: none;
        }

        .field-help {
          margin: -14px 0 18px;
          color: var(--dim);
          font-size: 12px;
          font-family: var(--mono);
        }
        .field-help.error { color: var(--red); font-weight: 600; }

        /* ── Star rating ── */
        .rating-label {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 8px;
          display: block;
        }
        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .star-btn {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--dim);
          font-size: 20px;
          width: 42px;
          height: 38px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: var(--body);
        }
        .star-btn:hover {
          border-color: rgba(214,164,109,0.4);
          color: var(--amber);
          transform: translateY(-1px);
        }
        .star-btn.active {
          color: var(--amber);
          border-color: rgba(214,164,109,0.4);
          background: rgba(214,164,109,0.08);
        }
        .rating-help {
          margin-bottom: 20px;
          color: var(--dim);
          font-size: 12px;
          font-family: var(--mono);
        }

        /* ── Plans section ── */
        .plans-label {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--dim);
          margin: 4px 0 10px;
          display: block;
        }
        .plans-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .plan-pill {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 8px 10px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 14px;
          text-align: center;
          text-decoration: none;
          color: var(--text);
          transition: all 0.18s;
          cursor: pointer;
        }
        .plan-pill:hover {
          border-color: var(--cyan);
          background: rgba(138,124,243,0.06);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(138,124,243,0.12);
        }
        .plan-pill.featured {
          border-color: rgba(138,124,243,0.4);
          background: linear-gradient(135deg, rgba(138,124,243,0.07), rgba(180,151,243,0.10));
        }
        .plan-pill-badge {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--cyan), var(--purple));
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
          text-transform: uppercase;
        }
        .plan-pill-name {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 5px;
          margin-top: 2px;
        }
        .plan-pill-price {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          margin-bottom: 2px;
        }
        .plan-pill-period {
          font-size: 10px;
          color: var(--mid);
          font-family: var(--mono);
        }

        /* ── Buttons ── */
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00d4ff, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: var(--body);
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(99,102,241,0.22);
        }
        .btn-submit:disabled { opacity: 0.45; cursor: default; box-shadow: none; }
        .btn-submit:not(:disabled):hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(99,102,241,0.30);
        }

        .btn-skip {
          display: block;
          text-align: center;
          margin-top: 14px;
          font-size: 13px;
          color: var(--dim);
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--body);
          transition: color 0.2s;
          width: 100%;
        }
        .btn-skip:hover { color: var(--mid); }

        /* ── Success state ── */
        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(121,184,143,0.15);
          border: 1px solid rgba(121,184,143,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 28px;
        }
        .success-title {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.035em;
          text-align: center;
          margin-bottom: 12px;
        }
        .success-sub {
          font-size: 15px;
          color: var(--mid);
          text-align: center;
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .reinstall-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 28px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: var(--body);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          width: 100%;
        }
        .reinstall-btn:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: rgba(99,102,241,0.05);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 560px) {
          .card { padding: 32px 22px; border-radius: 20px; }
          .plans-row { grid-template-columns: 1fr; }
          .card-title { font-size: 26px; }
        }
      `}</style>

      <div className="card">
        {step === 'form' && (
          <div className="fade-up">
            <div className="logo">
              <div className="logo-dot" />
              TabMonitor
            </div>

            <div className="step-dots">
              <div className="dot" style={{ background: 'var(--cyan)', width: 32 }} />
              <div className="dot" />
            </div>

            <h1 className="card-title">Sorry to see you go.</h1>
            <p className="card-sub">
              Quick question: what broke the flow? Your answer helps us make Tab Monitor better for heavy-tab users.
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
                <label className="rating-label">Rate your overall experience</label>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="rating-help">Optional — helps us understand your experience.</div>

                <label className="detail-label">Email</label>
                <input
                  className="detail-field email-field"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                  maxLength={120}
                />
                <div className={`field-help ${trimmedEmail.length > 0 && !isEmailValid ? 'error' : ''}`}>
                  So we can follow up if needed.
                </div>

                <label className="detail-label">What went wrong?</label>
                <textarea
                  className="detail-field"
                  placeholder="Optional: tell us what happened."
                  value={detail}
                  onChange={e => { setDetail(e.target.value); if (error) setError(''); }}
                  maxLength={400}
                  rows={3}
                />
                <div className="field-help">
                  Optional feedback. {trimmedDetail.length}/400 characters.
                </div>

                {/* Plans section */}
                <label className="plans-label">Or keep Chrome fast with Pro</label>
                <div className="plans-row">
                  {PLANS.map(plan => (
                    <a
                      key={plan.id}
                      href={plan.stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`plan-pill ${plan.highlight ? 'featured' : ''}`}
                    >
                      {plan.badge && (
                        <div className="plan-pill-badge">{plan.badge}</div>
                      )}
                      <div className="plan-pill-name">{plan.name}</div>
                      <div className="plan-pill-price">{plan.price}</div>
                      <div className="plan-pill-period">{plan.period}</div>
                    </a>
                  ))}
                </div>

                {error && <div className="field-help error" style={{ marginBottom: 14 }}>{error}</div>}
              </div>
            )}

            <button
              className="btn-submit"
              disabled={!selected || submitting || !isEmailValid}
              onClick={handleSubmit}
            >
              {submitting
                ? <><div className="spinner" /> Sending…</>
                : 'Submit feedback'}
            </button>

            <button className="btn-skip" onClick={() => setStep('submitted')}>
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
              We read every response and use it to improve Tab Monitor's cleanup, restore, and Pro workflows.
              <br />
              You can reinstall anytime when tab overload starts creeping back.
            </p>

            <a
              href="https://chromewebstore.google.com/detail/tab-monitor/hohggacchdpanlgbklndifoppehgfdcd"
              className="reinstall-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4285F4"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
                <path d="M12 8h8.66A10 10 0 0 0 12 2z" fill="#EA4335"/>
                <path d="M4.22 17A10 10 0 0 0 12 22l4.33-7.5A4 4 0 0 1 12 8H3.34A10 10 0 0 0 4.22 17z" fill="#34A853"/>
                <path d="M12 8H3.34A10 10 0 0 0 4.22 17L8.5 9.5A4 4 0 0 1 12 8z" fill="#FBBC04"/>
              </svg>
              Reinstall Tab Monitor
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default function UninstallPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8f9fc' }} />}>
      <UninstallPage />
    </Suspense>
  );
}
