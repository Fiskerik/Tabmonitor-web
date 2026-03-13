'use client';

import { useEffect, useMemo, useState } from 'react';

type FeedbackStatus = {
  canRate: boolean;
  daysRemaining: number;
  eligibleAt: string;
  existingFeedback: {
    rating: number;
    details: string | null;
    created_at: string;
  } | null;
};

export default function FeedbackPage() {
  const [status, setStatus] = useState<FeedbackStatus | null>(null);
  const [rating, setRating] = useState(0);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/feedback/rating', { method: 'GET' });
        if (!res.ok) throw new Error('Could not load feedback status');

        const json: FeedbackStatus = await res.json();
        console.log('[feedback-page] status loaded', json);

        if (!active) return;
        setStatus(json);

        if (json.existingFeedback?.rating) {
          setRating(json.existingFeedback.rating);
          setDetails(json.existingFeedback.details || '');
          setDone(true);
        }
      } catch (err: any) {
        console.error('[feedback-page] Failed loading status', err?.message || err);
        if (active) setError('Unable to load your feedback status right now.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const eligibilityText = useMemo(() => {
    if (!status) return '';
    if (status.canRate) return 'You can now share your rating.';

    const dayText = status.daysRemaining === 1 ? 'day' : 'days';
    return `You can rate TabMonitor in ${status.daysRemaining} ${dayText}.`;
  }, [status]);

  async function submitFeedback() {
    if (!status?.canRate || rating < 1 || rating > 5) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/feedback/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, details }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save feedback');
      }

      console.log('[feedback-page] feedback submitted', { rating, hasDetails: !!details.trim() });
      setDone(true);
    } catch (err: any) {
      console.error('[feedback-page] Failed submitting feedback', err?.message || err);
      setError(err?.message || 'Unable to save feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#06090f', color: '#e2e8f0', display: 'grid', placeItems: 'center', padding: 16 }}>
      <section style={{ width: '100%', maxWidth: 560, background: '#0d1117', border: '1px solid #1e2836', borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Rate your TabMonitor experience</h1>
        <p style={{ color: '#94a3b8', marginBottom: 20 }}>{eligibilityText}</p>

        {loading && <p>Loading feedback status...</p>}
        {error && <p style={{ color: '#f87171', marginBottom: 12 }}>{error}</p>}

        {!loading && done && (
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Thanks for your feedback.</p>
            <p style={{ color: '#94a3b8' }}>Your rating has been saved.</p>
          </div>
        )}

        {!loading && !done && status?.canRate && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {Array.from({ length: 5 }).map((_, idx) => {
                const value = idx + 1;
                return (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    style={{
                      width: 42,
                      height: 38,
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: rating >= value ? '1px solid #facc15' : '1px solid #334155',
                      background: rating >= value ? 'rgba(250,204,21,0.15)' : 'transparent',
                      color: rating >= value ? '#fde047' : '#64748b',
                      fontSize: 22,
                    }}
                    aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                    type="button"
                  >
                    ★
                  </button>
                );
              })}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Optional: Tell us what worked well or what we should improve"
              rows={4}
              style={{ width: '100%', borderRadius: 10, border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0', padding: 10, marginBottom: 14 }}
            />

            <button
              type="button"
              onClick={submitFeedback}
              disabled={submitting || rating === 0}
              style={{ width: '100%', background: '#00d4ff', color: '#0f172a', border: 'none', borderRadius: 10, padding: '12px 14px', fontWeight: 700, cursor: submitting ? 'default' : 'pointer', opacity: submitting || rating === 0 ? 0.5 : 1 }}
            >
              {submitting ? 'Saving...' : 'Submit rating'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
