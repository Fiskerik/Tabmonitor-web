'use client';

export default function LandingPage() {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <header className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Min Chrome Extension
        </h1>
        <p className="text-gray-400 text-xl mb-8">
          Automatisera ditt arbetsflöde på sekunder. Enkel, snabb och kraftfull.
        </p>
        
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Lifetime Access</h2>
          <p className="text-4xl font-bold mb-6">199 kr</p>
          <ul className="text-left space-y-3 mb-8 text-gray-300">
            <li>✅ Full tillgång till alla funktioner</li>
            <li>✅ Framtida uppdateringar ingår</li>
            <li>✅ Support dygnet runt</li>
          </ul>
          <button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Köp nu
          </button>
        </div>
      </header>
      
      <footer className="mt-12 text-gray-500 text-sm">
        © 2026 Din Extension AB
      </footer>
    </div>
  );
}
