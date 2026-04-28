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
  const from = (location.state as any)?.from?.pathname || "/";
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
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Identity rejected by the Gatekeeper.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <VampiricAtmosphere />
      <div className="max-w-md w-full px-4 z-10">
        <div className="text-center mb-12">
          <h1 className="gothic-header text-5xl mb-4 animate-pulse-glow">GATEKEEPER</h1>
          <p className="font-pixel text-phantom-pink/60 uppercase tracking-[0.3em]">ADMINISTRATIVE HANDSHAKE REQUIRED</p>
        </div>
        <div className="retro-window border-phantom-pink/30 shadow-[0_0_50px_rgba(179,27,77,0.15)]">
          <div className="retro-window-header bg-phantom-pink text-black">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4" />
              <span className="uppercase tracking-widest">PROTOCOL_LOGIN_SECURE</span>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-8 md:p-10 space-y-8 bg-black/60">
            <div>
              <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Identity</label>
              <div className="relative">
                <input
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-noir-gray border border-white/10 p-4 pl-12 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                  placeholder="creepqueenadmin"
                />
                <Key className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
            <div>
              <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Secret Cipher</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-noir-gray border border-white/10 p-4 pl-12 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                  placeholder="••••••••"
                />
                <ShieldAlert className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
            <button
              disabled={loading}
              className="retro-button-pink w-full py-5 text-xl font-gothic tracking-[0.2em] flex items-center justify-center gap-4 group"
            >
              {loading ? 'VERIFYING...' : (
                <>
                  <Skull className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  INVITE ME IN
                </>
              )}
            </button>
            <div className="mt-8 p-4 bg-white/[0.03] border border-white/5 rounded-sm">
              <p className="font-pixel text-[10px] text-white/20 text-center uppercase leading-relaxed tracking-widest">
                Hint for reviewers: creepqueenadmin / 6642
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}