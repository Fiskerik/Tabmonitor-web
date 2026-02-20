export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4a5568', marginBottom: 56 }}>
          Last updated: {new Date().toLocaleDateString('sv-SE')}
        </p>

        {[
          {
            title: '1. Acceptance of terms',
            content: `By installing or using TabMonitor ("the extension") or visiting our website, you agree to be bound by these Terms of Service. If you do not agree, please uninstall the extension and do not use our services.`,
          },
          {
            title: '2. Description of service',
            content: `TabMonitor is a Chrome browser extension that monitors memory and CPU usage of browser tabs. It is provided as-is, with a free tier and an optional paid Pro subscription that unlocks additional features.`,
          },
          {
            title: '3. Free tier',
            content: `The free tier of TabMonitor is available to all users at no cost. We reserve the right to modify or discontinue the free tier with reasonable notice. Core functionality will remain free as described on our website.`,
          },
          {
            title: '4. Pro subscription',
            content: `The Pro subscription is billed annually or monthly as selected at checkout. Prices are listed on our website and may change with 30 days notice to existing subscribers.\n\nYou may cancel your subscription at any time through the billing portal. Cancellation takes effect at the end of the current billing period. We do not offer refunds for partial billing periods, but we will consider requests on a case-by-case basis — contact us at support@tabmonitor.com.`,
          },
          {
            title: '5. Free trial',
            content: `New users may be eligible for a 7-day free trial of the Pro plan. Only one trial per email address is permitted. At the end of the trial, your account will revert to the free tier unless you have subscribed.`,
          },
          {
            title: '6. Acceptable use',
            content: `You agree not to:\n\n• Reverse engineer, decompile, or attempt to extract the source code of the extension beyond what is publicly available\n• Use the extension in any way that violates applicable laws or regulations\n• Attempt to circumvent license verification or access Pro features without a valid subscription\n• Resell or redistribute the extension or Pro license`,
          },
          {
            title: '7. Intellectual property',
            content: `TabMonitor and its content, features, and functionality are owned by us and are protected by copyright and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the extension for personal or business purposes in accordance with these terms.`,
          },
          {
            title: '8. Disclaimer of warranties',
            content: `TabMonitor is provided "as is" without warranty of any kind, express or implied. We do not warrant that the extension will be error-free, uninterrupted, or that it will meet your specific requirements. Memory and CPU measurements are estimates and may not be perfectly accurate.`,
          },
          {
            title: '9. Limitation of liability',
            content: `To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, arising from your use of or inability to use TabMonitor. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.`,
          },
          {
            title: '10. Modifications to the service',
            content: `We reserve the right to modify, suspend, or discontinue any aspect of the service at any time. We will provide reasonable notice of significant changes. Your continued use of the extension after changes constitutes acceptance.`,
          },
          {
            title: '11. Governing law',
            content: `These terms are governed by the laws of Sweden. Any disputes arising from these terms or your use of TabMonitor shall be subject to the exclusive jurisdiction of the courts of Sweden.`,
          },
          {
            title: '12. Contact',
            content: `For questions about these terms, contact us at support@tabmonitor.com.`,
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
