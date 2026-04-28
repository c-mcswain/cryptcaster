import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
export function SubmissionHero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-12"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center w-full"
        >
          {/* Enhanced Animated Glow Field */}
          <div className="absolute inset-0 bg-phantom-pink blur-[120px] opacity-15 group-hover:opacity-40 animate-pulse transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-slime-green blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
          <button className="retro-button-pink w-full md:w-auto inline-flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-8 md:px-20 py-12 md:py-16 text-3xl md:text-6xl font-gothic tracking-[0.3em] shadow-[8px_8px_0_0_rgba(40,167,69,0.5)] hover:shadow-[16px_16px_0_0_rgba(40,167,69,0.8)] border-4 md:border-8 border-slime-green/20 hover:border-slime-green transition-all duration-700 hover:scale-[1.02] active:scale-95 bg-black z-10 relative overflow-hidden">
            {/* Animated Mist Overlay for button */}
            <div className="absolute inset-0 bg-gradient-to-tr from-phantom-pink/5 via-transparent to-slime-green/5 animate-mist pointer-events-none" />
            <Skull className="w-12 h-12 md:w-16 md:h-16 text-white group-hover:rotate-180 group-hover:text-slime-green transition-all duration-500" />
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent uppercase font-black">
              SUBMIT TO THE VOID
            </span>
            <Send className="w-12 h-12 md:w-16 md:h-16 text-white group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:text-phantom-pink transition-all duration-500" />
          </button>
        </Link>
        <div className="space-y-6 max-w-4xl mx-auto px-6">
          <p className="font-pixel text-lg md:text-2xl text-slime-green/80 tracking-[0.4em] uppercase leading-relaxed font-bold">
            Unearth your chronicles of the unexplained. We are waiting for your spooky communications.
          </p>
          <div className="flex justify-center items-center gap-12 opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="h-[2px] w-24 md:w-48 bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
            <div className="flex gap-4">
              <Zap className="w-5 h-5 text-phantom-pink animate-blink" />
              <Zap className="w-5 h-5 text-phantom-pink animate-blink [animation-delay:300ms]" />
              <Zap className="w-5 h-5 text-phantom-pink animate-blink [animation-delay:600ms]" />
            </div>
            <div className="h-[2px] w-24 md:w-48 bg-gradient-to-r from-transparent via-phantom-pink to-transparent" />
          </div>
          <p className="font-mono text-base text-white/20 uppercase tracking-widest italic">
            Direct ingestion pipeline v4.0.2 is now active for public submissions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}