'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginButton() {
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button 
      onClick={handleLogin}
      className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
    >
      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
      Logga in med Google
    </button>
  );
}