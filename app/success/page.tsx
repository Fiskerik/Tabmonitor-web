import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Success',
  description: 'Your Tab Monitor payment was completed successfully. Return to the extension and unlock premium features.',
  alternates: {
    canonical: '/success',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4fb] px-6 py-10 text-[#2f2a3c]">
      <div className="pointer-events-none absolute -left-36 -top-40 h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle,rgba(138,124,243,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(180,151,243,0.12),transparent_72%)]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#e0d5ed] bg-[#fffdfd] p-10 text-center shadow-[0_8px_40px_rgba(93,79,122,0.10),0_2px_8px_rgba(93,79,122,0.06)] sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d8ccec] bg-[linear-gradient(160deg,#f3ecff_0%,#eef5ff_100%)]">
            <span className="text-4xl" aria-hidden="true">🎉</span>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7cf3]">Tab Monitor Pro</p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-[-0.02em] text-[#2f2a3c]">Betalningen klar!</h1>
          <p className="mb-8 leading-relaxed text-[#7a6f86]">
            Tack för ditt förtroende. Du kan nu öppna din extension och börja använda premium-funktionerna direkt.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[#cfc3e2] bg-[#f2eef8] px-5 py-2.5 text-sm font-semibold text-[#5f4f78] transition-colors hover:border-[#b9aad3] hover:bg-[#ece5f7]"
          >
            Gå tillbaka till startsidan
          </Link>
        </div>
      </section>
    </main>
  );
}
