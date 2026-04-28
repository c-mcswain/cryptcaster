import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
export function SubmissionHero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-10 md:gap-14"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center w-full"
        >
          <div className="absolute inset-0 bg-phantom-pink blur-[80px] md:blur-[120px] opacity-10 group-hover:opacity-30 animate-pulse transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-slime-green blur-[40px] md:blur-[60px] opacity-0 group-hover:opacity-15 transition-opacity duration-1000" />
          <button className="retro-button-pink w-full md:w-auto inline-flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 px-6 sm:px-12 md:px-20 py-10 md:py-16 text-2xl sm:text-4xl md:text-6xl font-gothic tracking-[0.2em] md:tracking-[0.3em] shadow-[4px_4px_0_0_rgba(40,167,69,0.4)] md:shadow-[8px_8px_0_0_rgba(40,167,69,0.5)] border-2 md:border-8 border-slime-green/20 hover:border-slime-green transition-all duration-700 hover:scale-[1.01] active:scale-95 bg-black z-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-phantom-pink/5 via-transparent to-slime-green/5 animate-mist pointer-events-none opacity-40 md:opacity-100" />
            <Skull className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white group-hover:rotate-180 group-hover:text-slime-green transition-all duration-500 shrink-0" />
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent uppercase font-black">
              SUBMIT TO THE VOID
            </span>
            <Send className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white group-hover:translate-x-6 md:group-hover:translate-x-8 md:group-hover:-translate-y-8 group-hover:text-phantom-pink transition-all duration-500 shrink-0" />
          </button>
        </Link>
        <div className="space-y-6 max-w-4xl mx-auto px-4">
          <p className="font-pixel text-base sm:text-xl md:text-2xl text-slime-green/80 tracking-[0.2em] md:tracking-[0.4em] uppercase leading-relaxed font-bold">
            Unearth your chronicles of the unexplained. We are waiting for your spooky communications.
          </p>
          <div className="flex justify-center items-center gap-6 md:gap-12 opacity-20">
            <div className="h-[1px] md:h-[2px] flex-1 max-w-[120px] md:max-w-[192px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
            <div className="flex gap-2 md:gap-4">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:300ms]" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:600ms]" />
            </div>
            <div className="h-[1px] md:h-[2px] flex-1 max-w-[120px] md:max-w-[192px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
          </div>
          <p className="font-mono text-[10px] md:text-xs text-white/20 uppercase tracking-widest italic block text-center">
            Direct ingestion pipeline v4.0.2 active // Encryption standard: MORALLY_GRIM_V3
          </p>
        </div>
      </motion.div>
    </div>
  );
}