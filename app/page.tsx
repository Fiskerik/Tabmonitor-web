'use client';

import LoginButton from '@/components/LoginButton';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto p-6 flex justify-between items-center">
        <div className="font-bold text-xl">TabMonitor</div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{user.email}</span>
            <button 
              onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
              className="text-sm text-slate-500 hover:text-white"
            >
              Logga ut
            </button>
          </div>
        ) : (
          <LoginButton />
        )}
      </nav>

      {/* Hero Section - samma som innan men vi kollar om användaren är inloggad */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Gör din webbläsare smartare.
        </h1>
        
        {user ? (
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4">Redo att uppgradera?</h2>
            <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500">
              Köp Premium - 199 kr
            </button>
          </div>
        ) : (
          <div className="text-slate-400 italic">
            Logga in med Google ovan för att kunna köpa licens.
          </div>
        )}
      </section>
    </main>
  );
}