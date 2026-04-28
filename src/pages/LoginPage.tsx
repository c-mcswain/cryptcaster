import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skull, Key, Lock, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { toast, Toaster } from 'sonner';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import type { AuthResponse } from '@shared/types';
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Handle redirect from ProtectedRoute or default to crypt
  const from = (location.state as any)?.from?.pathname || "/crypt";
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      login(data.token);
      toast.success('Access granted to the inner sanctum.');
      // Smooth transition to the dashboard
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      toast.error('Identity rejected by the Gatekeeper.', {
        description: 'Check your credentials or return to the shadows.',
        className: 'font-pixel uppercase'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <VampiricAtmosphere />
      <div className="max-w-md w-full px-6 z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="gothic-header text-7xl md:text-8xl mb-4 animate-pulse-glow tracking-[0.2em]">GATEKEEPER</h1>
          <p className="font-pixel text-phantom-pink/60 uppercase tracking-[0.4em] text-lg font-bold">ADMINISTRATIVE HANDSHAKE REQUIRED</p>
        </div>
        <div className="retro-window border-phantom-pink/40 shadow-[0_0_60px_rgba(179,27,77,0.1)]">
          <div className="retro-window-header bg-phantom-pink text-black py-2">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <span className="uppercase tracking-widest font-bold">PROTOCOL_LOGIN_v4.2</span>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-10 space-y-10 bg-black/80">
            <div className="space-y-4">
              <label className="block font-pixel text-xs text-white/40 tracking-widest uppercase">Identity Token</label>
              <div className="relative">
                <input
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-noir-gray border border-white/10 p-5 pl-14 text-white font-mono focus:border-phantom-pink transition-all outline-none placeholder:text-white/5"
                  placeholder="creepqueenadmin"
                />
                <Key className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block font-pixel text-xs text-white/40 tracking-widest uppercase">Secret Cipher</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-noir-gray border border-white/10 p-5 pl-14 text-white font-mono focus:border-phantom-pink transition-all outline-none placeholder:text-white/5"
                  placeholder="••••••••"
                />
                <ShieldAlert className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
            <button
              disabled={loading}
              className="retro-button-pink w-full py-8 text-2xl font-gothic tracking-[0.3em] flex items-center justify-center gap-6 group transition-all"
            >
              {loading ? 'VERIFYING...' : (
                <>
                  <Skull className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                  INVITE ME IN
                </>
              )}
            </button>
            <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-sm">
              <p className="font-pixel text-[10px] text-white/10 text-center uppercase leading-relaxed tracking-widest">
                System access restricted to authorized Morally Grim broadcast staff only.
                Unauthorized entry attempts are logged into the crypt.
              </p>
            </div>
          </form>
        </div>
      </div>
      <footer className="absolute bottom-12 text-center w-full font-pixel text-xs text-white/5 uppercase tracking-[0.5em] pointer-events-none">
        Broadcast Identity Control System // 1996 - 2025
      </footer>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}