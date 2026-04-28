import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skull, Send, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { motion, AnimatePresence } from 'framer-motion';
export function SubmissionPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    content: '',
    mediaUrl: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/submit', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSubmitted(true);
    } catch (err) {
      toast.error('The void rejected your offering. Try again later.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <VampiricAtmosphere />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex-1 z-10 w-full">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Link to="/" className="inline-flex items-center gap-3 text-white/40 font-pixel text-xl hover:text-phantom-pink transition-colors mb-12 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                RETURN TO SHADOWS
              </Link>
              <header className="mb-16">
                <h1 className="gothic-header text-4xl md:text-6xl mb-4 tracking-[0.2em]">OFFER YOUR TALE</h1>
                <p className="font-pixel text-lg text-phantom-pink/60 uppercase tracking-widest">BROADCAST SUBMISSION PORTAL</p>
              </header>
              <div className="retro-window border-phantom-pink/30">
                <div className="retro-window-header bg-phantom-pink text-black">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span className="uppercase tracking-widest">PROTOCOL_SUBMIT_V2</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 bg-black/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Your Name / Alias</label>
                      <input 
                        required value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-noir-gray border border-white/5 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                        placeholder="Anonymous"
                      />
                    </div>
                    <div>
                      <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Contact Email</label>
                      <input 
                        required type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-noir-gray border border-white/5 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                        placeholder="soul@void.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Story Subject</label>
                    <input 
                      required value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full bg-noir-gray border border-white/5 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                      placeholder="A strange sound from the attic..."
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">The Tale (Full Content)</label>
                    <textarea 
                      required rows={10} value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      className="w-full bg-noir-gray border border-white/5 p-4 text-white font-mono leading-relaxed focus:border-phantom-pink transition-all outline-none resize-none"
                      placeholder="Write your darkest secrets here..."
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-xs mb-3 text-white/40 tracking-widest uppercase">Supporting Media URL (Optional)</label>
                    <input 
                      value={form.mediaUrl}
                      onChange={e => setForm(f => ({ ...f, mediaUrl: e.target.value }))}
                      className="w-full bg-noir-gray border border-white/5 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                      placeholder="YouTube link, Image gallery, etc."
                    />
                  </div>
                  <button 
                    disabled={loading}
                    className="retro-button-pink w-full py-6 text-2xl font-gothic tracking-widest flex items-center justify-center gap-4 group"
                  >
                    {loading ? 'SEALING PACT...' : (
                      <>
                        <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                        SUBMIT TO THE VOID
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="flex justify-center mb-10">
                <div className="relative">
                  <CheckCircle2 className="w-24 h-24 text-slime-green animate-pulse" />
                  <Skull className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <h2 className="gothic-header text-5xl mb-6 tracking-widest text-white">THE PACT IS SEALED</h2>
              <p className="font-pixel text-2xl text-slime-green/60 uppercase tracking-[0.3em] mb-12">Your tale has been filed into the crypt.</p>
              <div className="max-w-md mx-auto p-8 border border-white/10 bg-noir-gray/50 mb-16 text-left">
                <p className="font-mono text-sm text-white/40 leading-relaxed uppercase">
                  Our creep queen will review your submission. If deemed worthy, it shall be broadcast to the world via the Morally Grim network.
                </p>
              </div>
              <Link to="/" className="retro-button px-16 py-4 text-xl font-gothic tracking-widest">
                RETURN TO HOME
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className="mt-auto py-12 px-8 border-t border-white/5 z-10 text-center font-pixel text-sm text-white/20 tracking-widest uppercase">
        MORALLY GRIM BROADCASTING // ARCHIVE SUBMISSION SYSTEM V2.4
      </footer>
    </div>
  );
}