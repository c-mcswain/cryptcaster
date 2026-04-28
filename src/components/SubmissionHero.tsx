import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
export function SubmissionHero() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-10"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center w-full md:w-auto"
        >
          {/* Enhanced Pulsing Animated Glow Background */}
          <div className="absolute inset-0 bg-phantom-pink blur-[80px] opacity-10 group-hover:opacity-30 animate-pulse transition-opacity duration-700" />
          <div className="absolute inset-0 bg-slime-green blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
          <button className="retro-button-pink w-full md:w-auto inline-flex items-center justify-center gap-8 px-12 md:px-20 py-10 md:py-12 text-3xl md:text-6xl font-gothic tracking-[0.25em] shadow-[8px_8px_0_0_rgba(40,167,69,0.5)] hover:shadow-[16px_16px_0_0_rgba(40,167,69,0.8)] border-4 border-slime-green/30 hover:border-slime-green transition-all duration-500 hover:scale-[1.03] active:scale-95 bg-black z-10">
            <Skull className="w-10 h-10 md:w-16 md:h-16 text-white group-hover:rotate-12 group-hover:text-slime-green transition-all duration-300" />
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent uppercase">
              SUBMIT TO THE VOID
            </span>
            <Send className="w-10 h-10 md:w-16 md:h-16 text-white group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:text-phantom-pink transition-all duration-300" />
          </button>
        </Link>
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="font-pixel text-base md:text-xl text-slime-green/70 tracking-[0.3em] uppercase leading-relaxed font-bold">
            Unearth your tales and spooky communications for Morally Grim review.
          </p>
          <div className="flex justify-center items-center gap-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="h-[1px] w-20 md:w-40 bg-gradient-to-r from-transparent to-phantom-pink" />
            <div className="flex gap-4">
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse" />
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse [animation-delay:200ms]" />
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse [animation-delay:400ms]" />
            </div>
            <div className="h-[1px] w-20 md:w-40 bg-gradient-to-l from-transparent to-phantom-pink" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}