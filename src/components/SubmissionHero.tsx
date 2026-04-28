import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
export function SubmissionHero() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-10"
      >
        <Link
          to="/submit"
          className="relative group inline-flex items-center justify-center"
        >
          {/* Pulsing Animated Glow Background */}
          <div className="absolute inset-0 bg-phantom-pink blur-3xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />
          <button className="retro-button-pink w-full md:w-auto inline-flex items-center justify-center gap-8 px-16 py-10 text-4xl md:text-6xl font-gothic tracking-[0.25em] shadow-[8px_8px_0_0_rgba(40,167,69,0.5)] hover:shadow-[12px_12px_0_0_rgba(40,167,69,0.8)] border-4 border-slime-green/40 hover:border-slime-green transition-all duration-500 hover:scale-[1.05] active:scale-95 bg-black z-10">
            <Skull className="w-10 h-10 md:w-14 md:h-14 text-white group-hover:rotate-12 group-hover:text-slime-green transition-all duration-300" />
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              SUBMIT TO THE VOID
            </span>
            <Send className="w-10 h-10 md:w-14 md:h-14 text-white group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:text-phantom-pink transition-all duration-300" />
          </button>
        </Link>
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="font-pixel text-lg md:text-xl text-slime-green/80 tracking-[0.3em] uppercase leading-relaxed font-bold">
            Share your spooky emails/stories for Morally Grim review and possible broadcast.
          </p>
          <div className="flex justify-center items-center gap-6 opacity-30">
            <div className="h-[2px] w-16 md:w-32 bg-gradient-to-r from-transparent to-phantom-pink" />
            <div className="flex gap-2">
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse" />
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse delay-75" />
              <Skull className="w-5 h-5 text-phantom-pink animate-pulse delay-150" />
            </div>
            <div className="h-[2px] w-16 md:w-32 bg-gradient-to-l from-transparent to-phantom-pink" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}