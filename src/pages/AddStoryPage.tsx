import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Skull, Terminal, Info, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', source: '', content: '' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('The void requires a title and body!');
      return;
    }
    setLoading(true);
    try {
      await api('/api/stories', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      toast.success('The tale has been successfully ingested.');
      navigate('/');
    } catch (err) {
      toast.error('Ingestion failed. The server spat it back out.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <Link to="/" className="text-slime-green font-pixel text-xl hover:text-hot-pink flex items-center gap-2 mb-12 group w-fit transition-colors">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" /> 
            RETURN TO THE CRYPT
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="retro-window">
                <div className="retro-window-header">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    CRYPT_INGESTION_MODULE.EXE
                  </div>
                </div>
                <div className="p-8 bg-black/60 backdrop-blur-md">
                  <h2 className="font-creepy text-6xl mb-10 text-slime-green animate-neon-flicker">NEW TALE</h2>
                  <form onSubmit={handleSubmit} className="space-y-8 font-pixel text-xl">
                    <div className="group">
                      <label className="block mb-3 text-hot-pink tracking-widest uppercase">STORY TITLE</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-black border-4 border-slime-green p-4 text-slime-green text-2xl focus:outline-none focus:border-hot-pink focus:shadow-retro-pink transition-all placeholder:opacity-30"
                        placeholder="e.g. THE WHISPERING MODEM..."
                      />
                    </div>
                    <div>
                      <label className="block mb-3 text-hot-pink tracking-widest uppercase">SOURCE / SENDER</label>
                      <input
                        type="text"
                        value={form.source}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                        className="w-full bg-black border-4 border-slime-green p-4 text-slime-green focus:outline-none focus:border-hot-pink focus:shadow-retro-pink transition-all placeholder:opacity-30"
                        placeholder="e.g. USER_X_99 / REDDIT"
                      />
                    </div>
                    <div>
                      <label className="block mb-3 text-hot-pink tracking-widest uppercase">THE HORROR (CONTENT)</label>
                      <textarea
                        required
                        rows={12}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="w-full bg-black border-4 border-slime-green p-4 text-slime-green font-mono text-lg focus:outline-none focus:border-hot-pink focus:shadow-retro-pink transition-all resize-none placeholder:opacity-20 leading-relaxed"
                        placeholder="PASTE YOUR SPOOKY TEXT HERE. USE LINE BREAKS FOR PACING."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="retro-button-pink w-full py-6 text-4xl shadow-retro-pink active:translate-y-2 active:shadow-none transition-all"
                    >
                      {loading ? 'PROCESS...' : 'INGEST STORY'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <aside className="space-y-8">
              <div className="retro-panel bg-hot-pink/5 border-hot-pink shadow-retro-pink">
                <div className="flex items-center gap-3 text-hot-pink mb-4">
                  <Info className="w-8 h-8" />
                  <h3 className="font-pixel text-2xl uppercase">GUIDELINES</h3>
                </div>
                <ul className="font-pixel text-lg space-y-4 text-white/90">
                  <li className="flex gap-2">
                    <span className="text-hot-pink">•</span>
                    USE FREQUENT PARAGRAPH BREAKS FOR BREATHING ROOM.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-hot-pink">•</span>
                    ADD [PAUSE] OR [EFFECT] TAGS IF NEEDED.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-hot-pink">•</span>
                    CHECK FOR CHARACTER NAMES BEFORE RECORDING.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-hot-pink">•</span>
                    KEEP IT MORALLY GRIM.
                  </li>
                </ul>
              </div>
              <div className="retro-panel bg-slime-green/5 border-slime-green">
                <div className="flex items-center gap-3 text-slime-green mb-4">
                  <AlertTriangle className="w-8 h-8" />
                  <h3 className="font-pixel text-2xl uppercase">WARNING</h3>
                </div>
                <p className="font-pixel text-lg text-white/80 leading-relaxed">
                  INGESTED TALES ARE PERSISTED IN THE PERMANENT CRYPT. ENSURE ALL CONTENT ADHERES TO BROADCAST STANDARDS.
                </p>
                <div className="mt-6 flex justify-center">
                  <Skull className="w-16 h-16 text-slime-green/30 animate-pulse" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <RetroFooter />
    </div>
  );
}