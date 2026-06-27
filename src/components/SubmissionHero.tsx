import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function SubmissionHero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-18 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-7 md:gap-9"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center w-full"
        >
          <div className="absolute inset-0 bg-phantom-pink blur-[45px] md:blur-[80px] opacity-10 group-hover:opacity-25 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-slime-green blur-[24px] md:blur-[48px] opacity-0 group-hover:opacity-15 transition-opacity duration-1000" />

          <button className="retro-button-pink w-full md:w-auto inline-flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7 px-5 sm:px-10 md:px-14 lg:px-16 py-7 md:py-10 text-2xl sm:text-4xl md:text-5xl font-gothic tracking-[0.08em] sm:tracking-[0.16em] md:tracking-[0.22em] shadow-[4px_4px_0_0_rgba(40,167,69,0.4)] md:shadow-[6px_6px_0_0_rgba(40,167,69,0.45)] border-2 md:border-4 border-slime-green/25 hover:border-slime-green transition-all duration-700 hover:scale-[1.01] active:scale-95 bg-black z-10 relative overflow-hidden break-words whitespace-normal">
            <div className="absolute inset-0 bg-gradient-to-tr from-phantom-pink/5 via-transparent to-slime-green/5 animate-mist pointer-events-none opacity-60" />

            <Skull className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:rotate-180 group-hover:text-slime-green transition-all duration-500 shrink-0" />

            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent uppercase font-black leading-tight">
              Submit to the Void
            </span>

            <Send className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:translate-x-4 md:group-hover:translate-x-6 md:group-hover:-translate-y-6 group-hover:text-phantom-pink transition-all duration-500 shrink-0" />
          </button>
        </Link>

        <div className="space-y-5 max-w-4xl mx-auto px-4">
          <p className="font-pixel text-base sm:text-xl md:text-2xl text-slime-green/85 tracking-[0.08em] sm:tracking-[0.16em] md:tracking-[0.24em] uppercase leading-[1.8] font-bold">
            Unearth your chronicles of the unexplained. We are waiting for your
            spooky communications.
          </p>

          <div className="flex justify-center items-center gap-4 md:gap-10 opacity-25">
            <div className="h-[1px] flex-1 max-w-[72px] sm:max-w-[180px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />

            <div className="flex gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:300ms]" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:600ms]" />
            </div>

            <div className="h-[1px] flex-1 max-w-[72px] sm:max-w-[180px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
          </div>

          <p className="font-mono text-xs md:text-sm text-white/28 uppercase tracking-[0.18em] md:tracking-widest italic block text-center leading-relaxed">
            Direct ingestion pipeline v4.0.2 active // Encryption: MG_SEC_V3
          </p>
        </div>
      </motion.div>
    </div>
  );
}
