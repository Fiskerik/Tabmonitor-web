export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #06090f; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
      `}</style>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '120px 32px 80px', fontFamily: "'DM Sans', sans-serif" }}>
        <a href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00d4ff', textDecoration: 'none', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
          ← TABMONITOR
        </a>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: '0.02em', marginBottom: 8, color: '#e2e8f0' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4a5568', marginBottom: 56 }}>
          Last updated: {new Date().toLocaleDateString('sv-SE')}
        </p>

        {[
          {
            title: '1. Overview',
            content: `TabMonitor is a Chrome extension that monitors browser tab memory and CPU usage. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.`,
          },
          {
            title: '2. Data we collect',
            content: `The TabMonitor extension collects no personal data and makes no external network requests. All tab metrics (memory usage, CPU usage, titles, URLs) are processed locally in your browser and never transmitted to any server.\n\nIf you choose to purchase a Pro subscription, we collect your email address for account management and billing purposes. Payment information is handled entirely by Stripe and is never stored on our servers.`,
          },
          {
            title: '3. Local storage',
            content: `The extension stores the following data locally in your browser using Chrome's storage API:\n\n• Your settings preferences (dark mode, alert thresholds, etc.)\n• Closed tab history (titles and URLs, stored locally only)\n• Session statistics (RAM freed, tabs closed)\n• License state (plan type, trial status)\n\nThis data never leaves your device and can be cleared at any time by removing the extension.`,
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
            content: `We retain your email address and subscription status for as long as you have an active account. If you cancel your subscription and request deletion, we will remove your data within 30 days. To request deletion, contact us at the email below.`,
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
            content: `If you have questions about this privacy policy, please contact us at support@tabmonitor.com.`,
          },
        ].map(({ title, content }) => (
          <section key={title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid #1e2836' }}>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: '#00d4ff', marginBottom: 12, letterSpacing: '0.05em' }}>
              {title}
            </h2>
            {content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: '#8892a4', lineHeight: 1.8, marginBottom: 12 }}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
