import React from 'react';
import { Video, Hash, AtSign, ExternalLink, Skull } from 'lucide-react';
export function RetroFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t-8 border-slime-green bg-crypt-purple py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5 -rotate-12 translate-x-1/4">
        <Skull className="w-96 h-96" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="text-center md:text-left">
          <div className="font-creepy text-4xl text-slime-green mb-2 glow-text">INVITE ME IN</div>
          <div className="font-pixel text-xl text-hot-pink uppercase tracking-widest">
            A MORALLY GRIM PRODUCTION
          </div>
          <p className="font-pixel text-sm text-slime-green/60 mt-4">
            COPYRIGHT © {currentYear} ALL SOULS RESERVED.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {/* Mock 90s Web Badges */}
          <div className="bg-black border-2 border-slime-green p-1 font-pixel text-[10px] text-slime-green flex flex-col items-center leading-none">
            <span>BEST VIEWED IN</span>
            <span className="text-xs font-bold">NETSCAPE</span>
          </div>
          <div className="bg-black border-2 border-hot-pink p-1 font-pixel text-[10px] text-hot-pink flex flex-col items-center leading-none">
            <span>MADE WITH</span>
            <span className="text-xs font-bold">SLIME</span>
          </div>
          <div className="bg-black border-2 border-white p-1 font-pixel text-[10px] text-white flex flex-col items-center leading-none">
            <span>100%</span>
            <span className="text-xs font-bold">SPOOKY</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-black border-4 border-slime-green hover:bg-slime-green hover:text-black transition-all">
              <Video className="w-6 h-6" />
            </a>
            <a href="#" className="p-2 bg-black border-4 border-slime-green hover:bg-slime-green hover:text-black transition-all">
              <Hash className="w-6 h-6" />
            </a>
            <a href="#" className="p-2 bg-black border-4 border-slime-green hover:bg-slime-green hover:text-black transition-all">
              <AtSign className="w-6 h-6" />
            </a>
          </div>
          <div className="flex items-center gap-2 font-pixel text-sm text-hot-pink hover:underline cursor-pointer group">
            CHANNEL LINK <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slime-green/20 text-center font-pixel text-xs text-slime-green/40">
        THE INFORMATION PRESENTED IN THIS CRYPT IS FOR ENTERTAINMENT PURPOSES ONLY. MORALLY GRIM IS NOT RESPONSIBLE FOR ANY GHOSTS, GHOULS, OR SPIRITS INVITED INTO YOUR HOME AS A RESULT OF BROADCASTING THESE TOMB RECORDS.
      </div>
    </footer>
  );
}