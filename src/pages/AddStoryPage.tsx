import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Info, AlertTriangle, ScrollText, Sparkles, Skull, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { wordCount, estimateReadTime } from '@/lib/utils';
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [draft, setDraft, clearDraft] = useLocalStorage('cryptcaster_draft', { title: '', source: '', content: '' });
  const [form, setForm] = useState(draft);
  // Update draft whenever form changes
  useEffect(() => {
    setDraft(form);
  }, [form, setDraft]);
  const stats = useMemo(() => ({
    words: wordCount(form.content),
    time: estimateReadTime(form.content)
  }), [form.content]);
  const hasRecoverableDraft = useMemo(() => {
    return (draft.title || draft.content) && (!form.title && !form.content);
  }, [draft, form]);
  const handleRecover = () => {
    setForm(draft);
    toast.success('Draft recovered from local storage.');
  };
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
      clearDraft();
      navigate('/');
    } catch (err) {
      toast.error('Ingestion failed. The server spat it back out.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex flex-col relative bg-nocturnal-purple/20 ${isFocusMode ? 'bg-black' : ''}`}>
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-10 lg:py-12">
          {!isFocusMode && (
            <Link to="/" className="text-white font-pixel text-xl hover:text-slime-green flex items-center gap-3 mb-10 group w-fit transition-all">
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
              <span className="tracking-widest uppercase">BACK TO CRYPT</span>
            </Link>
          )}
          {hasRecoverableDraft && !isFocusMode && (
            <div className="mb-8 p-4 border-2 border-phantom-pink bg-phantom-pink/10 flex items-center justify-between font-pixel">
              <div className="flex items-center gap-3 text-white">
                <RotateCcw className="w-5 h-5 text-phantom-pink" />
                <span>UNFINISHED TALE FOUND IN YOUR LOCAL COFFIN.</span>
              </div>
              <button onClick={handleRecover} className="bg-phantom-pink text-white px-4 py-1 hover:bg-white hover:text-black transition-colors">
                RECOVER
              </button>
            </div>
          )}
          <div className={`grid grid-cols-1 ${isFocusMode ? '' : 'lg:grid-cols-12'} gap-12`}>
            <div className={`${isFocusMode ? 'max-w-4xl mx-auto w-full' : 'lg:col-span-8'}`}>
              <div className="retro-window overflow-hidden border-white/20">
                <div className="retro-window-header bg-white text-black py-2">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4" />
                    <span className="tracking-wider">INGESTION_PROTOCOL_v3.FINAL</span>
                  </div>
                  <button 
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className="flex items-center gap-2 hover:bg-black hover:text-white px-2 py-0.5 transition-colors"
                  >
                    {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    <span className="text-[10px]">{isFocusMode ? 'EXIT FOCUS' : 'FOCUS MODE'}</span>
                  </button>
                </div>
                <div className="p-6 md:p-10 bg-black/40 backdrop-blur-xl">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label className="block font-pixel text-sm mb-3 text-phantom-pink tracking-[0.2em] uppercase opacity-70">STORY TITLE</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-black/60 border-2 border-white/10 p-5 text-white font-gothic text-2xl focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                        placeholder="ENTER THE TITLE..."
                      />
                    </div>
                    <div>
                      <label className="block font-pixel text-sm mb-3 text-phantom-pink tracking-[0.2em] uppercase opacity-70">SOURCE ORIGIN</label>
                      <input
                        type="text"
                        value={form.source}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                        className="w-full bg-black/60 border-2 border-white/10 p-5 text-white font-mono text-lg focus:outline-none focus:border-white transition-all placeholder:text-white/10"
                        placeholder="ANONYMOUS / REDDIT / EMAIL"
                      />
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-end mb-3">
                        <label className="block font-pixel text-sm text-phantom-pink tracking-[0.2em] uppercase opacity-70">THE NARRATIVE CONTENT</label>
                        <div className="font-pixel text-xs text-slime-green/60 flex gap-4">
                          <span>WORDS: {stats.words}</span>
                          <span>EST. READ: {stats.time}</span>
                        </div>
                      </div>
                      <textarea
                        required
                        rows={isFocusMode ? 25 : 18}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="w-full bg-black/60 border-2 border-white/10 p-6 text-white font-mono text-lg focus:outline-none focus:border-white transition-all resize-none placeholder:text-white/10 leading-relaxed scrollbar-thin scrollbar-thumb-blood-red"
                        placeholder="BEGIN THE INGESTION PROCESS HERE..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-white text-black w-full py-6 font-gothic text-3xl hover:bg-slime-green transition-all active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-4"
                    >
                      {loading ? (
                        <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <>
                          <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
                          <span>INGEST STORY</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {!isFocusMode && (
              <aside className="lg:col-span-4 space-y-8">
                <div className="retro-panel border-phantom-pink/20 bg-phantom-pink/5">
                  <div className="flex items-center gap-3 text-white mb-6">
                    <Info className="w-6 h-6 text-phantom-pink" />
                    <h3 className="font-gothic text-xl tracking-widest uppercase">The Protocol</h3>
                  </div>
                  <ul className="font-pixel text-base space-y-6 text-white/70">
                    <li className="flex gap-4">
                      <span className="text-phantom-pink font-bold">01</span>
                      <span>USE FREQUENT PARAGRAPH BREAKS FOR NARRATIVE PACING.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-phantom-pink font-bold">02</span>
                      <span>ADD [PAUSE] OR [EFFECT] TAGS FOR THE PRODUCER.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-phantom-pink font-bold">03</span>
                      <span>DRAFTS ARE AUTO-SAVED TO YOUR BROWSER'S VAULT.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-phantom-pink font-bold">04</span>
                      <span>STAY MORALLY GRIM AT ALL TIMES.</span>
                    </li>
                  </ul>
                </div>
                <div className="retro-panel border-white/10 bg-white/5">
                  <div className="flex items-center gap-3 text-white mb-6">
                    <AlertTriangle className="w-6 h-6 text-slime-green" />
                    <h3 className="font-gothic text-xl tracking-widest uppercase">System Note</h3>
                  </div>
                  <p className="font-pixel text-base text-white/50 leading-relaxed">
                    TALES ARE PERSISTED IN THE PERMANENT CRYPT ARCHIVE. ENSURE CONTENT MEETS BROADCAST ELEGANCE STANDARDS.
                  </p>
                  <div className="mt-10 flex justify-center opacity-10">
                    <Skull className="w-24 h-24 text-white" />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      {!isFocusMode && <RetroFooter />}
      <div className={`fixed inset-0 bg-black -z-10 transition-opacity duration-1000 ${isFocusMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
    </div>
  );
}