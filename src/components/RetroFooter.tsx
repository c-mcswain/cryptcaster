import React from 'react';
import {
  Video,
  Hash,
  AtSign,
  ExternalLink,
  Skull,
  Send,
  LayoutDashboard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function RetroFooter() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="mt-auto border-t-4 border-lichen-green bg-crypt-purple py-10 md:py-12 px-5 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-[0.035] -rotate-12 translate-x-1/4 pointer-events-none">
        <Skull className="w-[420px] h-[420px] md:w-[560px] md:h-[560px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_1fr] items-center gap-8 md:gap-10 relative z-10">
        <div className="text-center lg:text-left">
          <div className="font-creepy text-4xl md:text-5xl text-slime-green/85 mb-2 glow-text tracking-widest uppercase leading-none">
            Invite Me In
          </div>

          <div className="font-pixel text-base md:text-lg text-phantom-pink/75 uppercase tracking-[0.22em] leading-tight">
            A Morally Grim Production
          </div>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-5 mt-5">
            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-3 font-pixel text-sm md:text-base text-slime-green/85 hover:text-white transition-colors tracking-[0.16em] uppercase group"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Contribute to the Void
            </Link>

            {isAuthenticated && (
              <Link
                to="/crypt"
                className="inline-flex items-center justify-center gap-3 font-pixel text-sm md:text-base text-white/55 hover:text-slime-green transition-colors tracking-[0.16em] uppercase group"
              >
                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform text-slime-green" />
                Staff Dashboard
              </Link>
            )}
          </div>

          <p className="font-pixel text-sm md:text-base text-slime-green/60 mt-5 tracking-[0.14em] uppercase leading-tight">
            Copyright © {currentYear} Morally Grim. All souls reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-black/45 border border-slime-green/35 px-4 py-3 font-pixel text-xs md:text-sm text-slime-green/65 flex flex-col items-center leading-tight tracking-widest">
            <span>BEST VIEWED IN</span>
            <span className="text-sm md:text-base font-bold text-slime-green/90 uppercase">
              Netscape
            </span>
          </div>

          <div className="bg-black/45 border border-phantom-pink/35 px-4 py-3 font-pixel text-xs md:text-sm text-phantom-pink/65 flex flex-col items-center leading-tight tracking-widest">
            <span>STYLING</span>
            <span className="text-sm md:text-base font-bold text-phantom-pink/90 uppercase">
              Slime Green
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-4">
          <div className="flex gap-4">
            <a
              href="#"
              className="p-3 bg-black/80 border border-white/10 hover:border-slime-green hover:bg-slime-green/10 text-white/40 hover:text-slime-green transition-all"
              aria-label="Video channel"
            >
              <Video className="w-6 h-6" />
            </a>

            <a
              href="#"
              className="p-3 bg-black/80 border border-white/10 hover:border-slime-green hover:bg-slime-green/10 text-white/40 hover:text-slime-green transition-all"
              aria-label="Hashtag feed"
            >
              <Hash className="w-6 h-6" />
            </a>

            <a
              href="#"
              className="p-3 bg-black/80 border border-white/10 hover:border-slime-green hover:bg-slime-green/10 text-white/40 hover:text-slime-green transition-all"
              aria-label="Contact link"
            >
              <AtSign className="w-6 h-6" />
            </a>
          </div>

          <div className="flex items-center gap-3 font-pixel text-sm md:text-base text-phantom-pink/65 hover:text-phantom-pink hover:underline cursor-pointer group tracking-[0.16em] uppercase">
            Channel Link
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 md:mt-9 pt-6 border-t border-white/10 text-center font-pixel text-[0.72rem] md:text-sm text-white/55 leading-snug tracking-[0.12em] md:tracking-[0.16em] uppercase relative z-10">
        The information presented in this crypt is for entertainment purposes
        only. Morally Grim is not responsible for any ghosts, ghouls, or spirits
        invited into your home as a result of broadcasting these records.
      </div>
    </footer>
  );
}
