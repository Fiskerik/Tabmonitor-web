import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how Tab Monitor handles privacy, local data processing, billing data, and data retention.',
  keywords: ['tab management', 'tab hoarding', 'multiple tabs', 'task manager', 'alt tab'],
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #f7f4fb;
          --surface:    #fffdfd;
          --border:     #e0d5ed;
          --text:       #2f2a3c;
          --muted:      #7a6f86;
          --dim:        #9b8cad;
          --accent:     #8a7cf3;
          --section:    #f4f0fa;
          --section-border: #ddd3eb;
          --display:    'Syne', sans-serif;
          --body:       'DM Sans', sans-serif;
          --mono:       'DM Mono', monospace;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--body);
          min-height: 100vh;
        }
      `}</style>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px', fontFamily: "'DM Sans', sans-serif" }}>
        <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#8a7cf3', textDecoration: 'none', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 44 }}>
          ← TABMONITOR
        </a>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, letterSpacing: '-0.02em', marginBottom: 10, color: '#2f2a3c', fontWeight: 800 }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9b8cad', marginBottom: 52 }}>
          Last updated: {new Date().toLocaleDateString('sv-SE')}
        </p>

        {[
          {
            title: '1. Overview',
            content: `TabMonitor is a Chrome extension that monitors browser tab memory and CPU usage. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.`,
          },
          {
            title: '2. Data we collect',
            content: `TabMonitor processes tab metrics such as memory usage, CPU usage, titles, and URLs locally in your browser. These tab details are not sent to our servers for normal monitoring, cleanup, analytics, saved sessions, or restore features.\n\nThe extension may contact our website, Supabase, Stripe, or Vercel when you sign in, check a Pro license, open checkout, manage billing, submit feedback, or use account/device features. In those cases we use the minimum account and billing data needed to provide the service.`,
          },
          {
            title: '3. Local storage',
            content: `The extension stores the following data locally in your browser using Chrome's storage API:\n\n• Your settings preferences (theme, alert thresholds, Pro toggles, language)\n• Closed tab history, parking lot, saved sessions, and backup snapshots\n• Session statistics such as RAM freed, tabs closed, tabs suspended, and Focus Mode usage\n• Privacy-safe funnel events and Pro usage counters such as install, welcome opened, first action, Pro gate viewed, checkout opened, and license activated\n• License state such as plan type, trial status, and active device metadata\n\nLocal tab titles and URLs stay on your device unless you intentionally share feedback containing that information.`,
          },
          {
            title: '4. Billing & payments',
            content: `If you upgrade to Pro, we use Stripe to process payments. Stripe may collect and store payment information in accordance with their own privacy policy (stripe.com/privacy). We only receive confirmation of payment status and your email address from Stripe — we never see your card details.`,
          },
          {
            title: '5. Website analytics',
            content: `Our website (tabmonitor-web.vercel.app) may collect standard server logs including IP addresses and browser user agents. We do not use third-party analytics services such as Google Analytics. We do not place tracking cookies.`,
          },
          {
            title: '6. Third-party services',
            content: `We use the following third-party services:\n\n• Stripe — payment processing (stripe.com/privacy)\n• Supabase — database for license management (supabase.com/privacy)\n• Vercel — website hosting (vercel.com/legal/privacy-policy)\n\nThese services have their own privacy policies and we encourage you to review them.`,
          },
          {
            title: '7. Data retention',
            content: `We retain your email address, subscription status, license devices, and submitted feedback for as long as needed to provide account, billing, support, and fraud-prevention functionality. If you cancel your subscription and request deletion, we will remove personal account data within 30 days unless we are required to retain limited records for legal or payment compliance. To request deletion, contact us at the email below.`,
          },
          {
            title: '8. Your rights',
            content: `You have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Withdraw consent at any time\n\nTo exercise any of these rights, contact us at support@tabmonitor.com.`,
          },
          {
            title: '9. Children',
            content: `TabMonitor is not directed at children under the age of 13. We do not knowingly collect personal information from children.`,
          },
          {
            title: '10. Changes to this policy',
            content: `We may update this privacy policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Continued use of the extension after changes constitutes acceptance of the updated policy.`,
          },
          {
            title: '11. Contact',
            content: `If you have questions about this privacy policy, please contact us at eaconsulting.supp@gmail.com.`,
          },
        ].map(({ title, content }) => (
          <section key={title} style={{ marginBottom: 24, padding: '26px 24px', border: '1px solid #ddd3eb', borderRadius: 18, background: '#f4f0fa' }}>
            <h2 style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: '#8a7cf3', marginBottom: 12, letterSpacing: '0.05em' }}>
              {title}
            </h2>
            {content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: '#5f5470', lineHeight: 1.8, marginBottom: 12 }}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
