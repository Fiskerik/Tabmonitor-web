'use client';

export default function LandingPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Betalningsfel:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide">
          Nu tillgänglig i Chrome Web Store
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
          Spara timmar av <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            manuellt arbete.
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Sluta kopiera och klistra. Vår extension automatiserar ditt arbetsflöde direkt i webbläsaren så att du kan fokusera på det som faktiskt spelar roll.
        </p>
        
        <button 
          onClick={handleCheckout}
          className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-5 px-10 rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:scale-[1.03] active:scale-95"
        >
          Skaffa Premium – 199 kr
        </button>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-y border-slate-800/50">
        <h2 className="text-3xl font-bold text-center mb-16">Kom igång på 3 enkla steg</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-slate-700">1</div>
            <h3 className="font-bold text-xl mb-3">Installera</h3>
            <p className="text-slate-400">Hämta extensionen från Chrome Web Store på bara ett klick.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-slate-700">2</div>
            <h3 className="font-bold text-xl mb-3">Aktivera</h3>
            <p className="text-slate-400">Köp din licens här på sidan för att låsa upp alla pro-funktioner.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-slate-700">3</div>
            <h3 className="font-bold text-xl mb-3">Automatisera</h3>
            <p className="text-slate-400">Luta dig tillbaka medan verktyget gör grovjobbet åt dig.</p>
          </div>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Byggd för produktivitet</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="text-blue-500 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-bold">Smart Data-extraktion</h4>
                  <p className="text-slate-400">Hämta information från vilken webbsida som helst utan krångel.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-500 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-bold">Anpassade genvägar</h4>
                  <p className="text-slate-400">Skapa egna kommandon som passar ditt unika arbetssätt.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-500 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-bold">Mörkt läge inkluderat</h4>
                  <p className="text-slate-400">Ett gränssnitt som är snällt mot ögonen, oavsett tid på dygnet.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-inner h-[300px] flex items-center justify-center">
            <p className="text-slate-500 italic">[Här kan du lägga en skärmdump av din extension]</p>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-12">Vanliga frågor</h2>
        <div className="space-y-8 text-left">
          <div>
            <h4 className="font-bold text-lg mb-2">Är det en engångskostnad?</h4>
            <p className="text-slate-400">Ja, du betalar en gång och har tillgång till alla nuvarande och framtida uppdateringar för evigt.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Fungerar det på alla webbsidor?</h4>
            <p className="text-slate-400">Extensionen är optimerad för de flesta moderna webbplatser, inklusive LinkedIn, Gmail och SaaS-plattformar.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 Min Chrome Extension. Alla rättigheter reserverade.</p>
      </footer>
    </main>
  );
}