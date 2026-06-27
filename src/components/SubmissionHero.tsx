import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function SubmissionHero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-5 md:gap-6"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center w-full"
        >
          <div className="absolute inset-0 bg-phantom-pink blur-[36px] md:blur-[56px] opacity-10 group-hover:opacity-22 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-slime-green blur-[20px] md:blur-[36px] opacity-0 group-hover:opacity-15 transition-opacity duration-1000" />

          <button className="retro-button-pink w-full md:w-auto inline-flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 px-5 sm:px-9 md:px-12 lg:px-14 py-5 md:py-7 text-2xl sm:text-3xl md:text-4xl font-gothic tracking-[0.08em] sm:tracking-[0.14em] md:tracking-[0.18em] shadow-[4px_4px_0_0_rgba(40,167,69,0.4)] md:shadow-[5px_5px_0_0_rgba(40,167,69,0.45)] border-2 md:border-4 border-slime-green/30 hover:border-slime-green transition-all duration-700 hover:scale-[1.01] active:scale-95 bg-black z-10 relative overflow-hidden break-words whitespace-normal">
            <div className="absolute inset-0 bg-gradient-to-tr from-phantom-pink/5 via-transparent to-slime-green/5 animate-mist pointer-events-none opacity-60" />

            <Skull className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/90 group-hover:rotate-180 group-hover:text-slime-green transition-all duration-500 shrink-0" />

            <span className="bg-gradient-to-b from-white via-white to-white/45 bg-clip-text text-transparent uppercase font-black leading-tight">
              Submit to the Void
            </span>

            <Send className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/90 group-hover:translate-x-4 md:group-hover:translate-x-5 md:group-hover:-translate-y-5 group-hover:text-phantom-pink transition-all duration-500 shrink-0" />
          </button>
        </Link>

        <div className="space-y-4 max-w-4xl mx-auto px-4">
          <p className="font-pixel text-base sm:text-lg md:text-xl text-slime-green/82 tracking-[0.08em] sm:tracking-[0.14em] md:tracking-[0.2em] uppercase leading-[1.55] font-bold">
            Unearth your chronicles of the unexplained. We are waiting for your
            spooky communications.
          </p>

          <div className="flex justify-center items-center gap-4 md:gap-8 opacity-35">
            <div className="h-[1px] flex-1 max-w-[72px] sm:max-w-[160px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />

            <div className="flex gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:300ms]" />
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-phantom-pink animate-blink [animation-delay:600ms]" />
            </div>

            <div className="h-[1px] flex-1 max-w-[72px] sm:max-w-[160px] bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
          </div>

          <p className="font-mono text-xs md:text-sm text-white/38 uppercase tracking-[0.14em] md:tracking-[0.2em] italic block text-center leading-snug">
            Direct ingestion pipeline v4.0.2 active // Encryption: MG_SEC_V3
          </p>
        </div>
      </motion.div>
    </div>
  );
}
