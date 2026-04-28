import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
export function SubmissionHero() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <Link 
          to="/submit" 
          className="retro-button-pink w-full md:w-auto inline-flex items-center justify-center gap-6 px-16 py-8 text-3xl md:text-5xl font-gothic tracking-[0.2em] shadow-[0_0_30px_rgba(179,27,77,0.3)] hover:shadow-[0_0_50px_rgba(179,27,77,0.5)] group transition-all duration-500 hover:scale-105 active:scale-95"
        >
          <Skull className="w-8 h-8 md:w-12 md:h-12 group-hover:rotate-12 transition-transform duration-300" />
          SUBMIT TO THE VOID
          <Send className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-300" />
        </Link>
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="font-pixel text-sm md:text-base text-white/50 tracking-[0.2em] uppercase leading-relaxed">
            Listeners: Share emails/stories for review by the Creep Queen. 
            If selected, your tale haunts the airwaves.
          </p>
          <div className="flex justify-center items-center gap-4 opacity-20">
            <div className="h-px w-12 bg-phantom-pink" />
            <Skull className="w-4 h-4 text-phantom-pink" />
            <div className="h-px w-12 bg-phantom-pink" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}