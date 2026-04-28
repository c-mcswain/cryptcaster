import React from 'react';
import { Video, Hash, AtSign, ExternalLink, Skull, Send, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
export function RetroFooter() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  return (
    <footer className="mt-auto border-t-4 border-lichen-green bg-crypt-purple py-20 px-8 relative overflow-hidden">
      {/* Subtle Background decoration */}
      <div className="absolute top-0 right-0 opacity-[0.02] -rotate-12 translate-x-1/4 pointer-events-none">
        <Skull className="w-[600px] h-[600px]" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
        <div className="text-center md:text-left space-y-4">
          <div className="font-creepy text-6xl text-slime-green/80 mb-4 glow-text tracking-widest uppercase">Invite Me In</div>
          <div className="font-pixel text-2xl text-phantom-pink/60 uppercase tracking-[0.3em]">
            A MORALLY GRIM PRODUCTION
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <Link to="/submit" className="inline-flex items-center gap-3 font-pixel text-base text-slime-green hover:text-white transition-colors tracking-[0.2em] uppercase group">
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Contribute to the Void
            </Link>
            {isAuthenticated && (
              <Link to="/crypt" className="inline-flex items-center gap-3 font-pixel text-base text-white/40 hover:text-slime-green transition-colors tracking-[0.2em] uppercase group">
                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform text-slime-green" />
                Staff Dashboard
              </Link>
            )}
          </div>
          <p className="font-pixel text-base text-slime-green/40 mt-8 tracking-widest block uppercase">
            Copyright © {currentYear} Morally Grim. All souls reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-black/40 border border-slime-green/30 px-4 py-2 font-pixel text-xs text-slime-green/50 flex flex-col items-center leading-tight tracking-widest">
            <span>BEST VIEWED IN</span>
            <span className="text-sm font-bold text-slime-green/80 uppercase">Netscape</span>
          </div>
          <div className="bg-black/40 border border-phantom-pink/30 px-4 py-2 font-pixel text-xs text-phantom-pink/50 flex flex-col items-center leading-tight tracking-widest">
            <span>STYLING</span>
            <span className="text-sm font-bold text-phantom-pink/80 uppercase">Slime Green</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-6">
            <a href="#" className="p-3 bg-black border border-white/5 hover:border-slime-green hover:bg-slime-green/10 text-white/20 hover:text-slime-green transition-all">
              <Video className="w-7 h-7" />
            </a>
            <a href="#" className="p-3 bg-black border border-white/5 hover:border-slime-green hover:bg-slime-green/10 text-white/20 hover:text-slime-green transition-all">
              <Hash className="w-7 h-7" />
            </a>
            <a href="#" className="p-3 bg-black border border-white/5 hover:border-slime-green hover:bg-slime-green/10 text-white/20 hover:text-slime-green transition-all">
              <AtSign className="w-7 h-7" />
            </a>
          </div>
          <div className="flex items-center gap-3 font-pixel text-base text-phantom-pink/40 hover:text-phantom-pink hover:underline cursor-pointer group tracking-[0.2em] uppercase">
            Channel Link <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-white/5 text-center font-pixel text-sm text-white/20 leading-relaxed tracking-widest uppercase opacity-40">
        The information presented in this crypt is for entertainment purposes only. Morally Grim is not responsible for any ghosts, ghouls, or spirits invited into your home as a result of broadcasting these records.
      </div>
    </footer>
  );
}