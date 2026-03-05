import type { Metadata } from 'next';

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
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-slate-800/50 p-10 rounded-3xl border border-green-500/30 shadow-2xl shadow-green-500/5">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Betalningen klar!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Tack för ditt förtroende. Du kan nu öppna din extension och börja använda premium-funktionerna direkt.
        </p>
        <a 
          href="/" 
          className="inline-block text-blue-400 hover:text-blue-300 font-medium underline transition-colors"
        >
          Gå tillbaka till startsidan
        </a>
      </div>
    </div>
  );
}
