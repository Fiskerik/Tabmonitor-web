import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Success',
  description: 'Your Tab Monitor payment was completed successfully. Return to the extension and unlock premium features.',
  keywords: ['tab management', 'tab manager', 'multiple tabs', 'task manager', 'alt tab'],
  alternates: {
    canonical: '/success',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SuccessPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@500;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-[#f5f7fb] px-6 py-10 font-['DM_Sans',sans-serif] text-[#18212f]">
        <div className="pointer-events-none absolute -left-36 -top-40 h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle,rgba(87,188,255,0.18),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.11),transparent_72%)]" />

        <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center justify-center">
          <div className="w-full rounded-[28px] border border-[rgba(122,145,173,0.22)] bg-[rgba(255,255,255,0.9)] p-10 text-center shadow-[0_12px_42px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.05)] sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(122,145,173,0.24)] bg-[linear-gradient(160deg,#f2f8ff_0%,#edf6ff_100%)]">
              <span className="text-4xl" aria-hidden="true">🎉</span>
            </div>

            <p className="mb-3 font-['DM_Mono',monospace] text-xs font-semibold uppercase tracking-[0.18em] text-[#57bcff]">Tab Monitor Pro</p>
            <h1 className="mb-4 font-['Syne',sans-serif] text-3xl font-extrabold tracking-[-0.02em] text-[#18212f]">Betalningen klar!</h1>
            <p className="mb-8 leading-relaxed text-[#506176]">
              Tack för ditt förtroende. Du kan nu öppna din extension och börja använda premium-funktionerna direkt.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(122,145,173,0.22)] bg-[rgba(255,255,255,0.82)] px-5 py-2.5 text-sm font-semibold text-[#1f6fb7] transition-colors hover:border-[rgba(87,188,255,0.36)] hover:bg-[rgba(255,255,255,0.96)]"
            >
              Gå tillbaka till startsidan
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
