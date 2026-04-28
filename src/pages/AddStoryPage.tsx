import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Info, ScrollText, Trash2, ShieldCheck, Mail } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast, Toaster } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { wordCount, estimateReadTime, cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const isInitialized = useRef(false);
  const [storyDraft, setStoryDraft, clearStoryDraft] = useLocalStorage('cryptcaster_story_draft', { title: '', source: '', content: '', mediaUrl: '' });
  const [emailDraft, setEmailDraft, clearEmailDraft] = useLocalStorage('cryptcaster_email_draft', { senderEmail: '', subject: '', content: '', mediaUrl: '' });
  const [storyForm, setStoryForm] = useState({ title: '', source: '', content: '', mediaUrl: '' });
  const [emailForm, setEmailForm] = useState({ senderEmail: '', subject: '', content: '', mediaUrl: '' });
  useEffect(() => {
    if (!isInitialized.current) {
      setStoryForm(storyDraft);
      setEmailForm(emailDraft);
      isInitialized.current = true;
    }
  }, [storyDraft, emailDraft]);
  useEffect(() => {
    if (!isInitialized.current) return;
    const saveTimeout = setTimeout(() => {
      setStoryDraft(storyForm);
      setEmailDraft(emailForm);
      setShowSavedToast(true);
      const hideTimeout = setTimeout(() => setShowSavedToast(false), 2000);
      return () => clearTimeout(hideTimeout);
    }, 1500);
    return () => clearTimeout(saveTimeout);
  }, [storyForm, emailForm, setStoryDraft, setEmailDraft]);
  const stats = useMemo(() => ({
    story: { words: wordCount(storyForm.content), time: estimateReadTime(storyForm.content) },
    email: { words: wordCount(emailForm.content), time: estimateReadTime(emailForm.content) }
  }), [storyForm.content, emailForm.content]);
  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title.trim() || !storyForm.content.trim()) {
      return toast.error('Essential data fields are void.', { className: 'font-pixel uppercase' });
    }
    setLoading(true);
    try {
      await api('/api/stories', {
        method: 'POST',
        body: JSON.stringify({ ...storyForm, kind: 'story', metadata: {} })
      });
      toast.success('Narrative sealed into archives.');
      clearStoryDraft();
      setTimeout(() => navigate('/crypt'), 1000);
    } catch (err) {
      toast.error('Ingestion failed.');
    } finally {
      setLoading(false);
    }
  };
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.subject.trim() || !emailForm.content.trim()) {
      return toast.error('Subject and Body required.', { className: 'font-pixel uppercase' });
    }
    setLoading(true);
    try {
      const ticketId = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await api('/api/stories', {
        method: 'POST',
        body: JSON.stringify({
          title: `[${ticketId}] ${emailForm.subject}`,
          source: emailForm.senderEmail || 'Anonymous Listener',
          content: emailForm.content,
          mediaUrl: emailForm.mediaUrl,
          kind: 'email',
          metadata: { senderEmail: emailForm.senderEmail, subject: emailForm.subject, ticketId }
        })
      });
      toast.success('Midnight post filed.');
      clearEmailDraft();
      setTimeout(() => navigate('/crypt'), 1000);
    } catch (err) {
      toast.error('Ticket processing failed.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-1000 ${isFocusMode ? 'bg-black' : 'bg-nocturnal-purple/5'}`}>
      <VampiricAtmosphere />
      <Toaster theme="dark" position="bottom-right" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-12">
          <AnimatePresence>
            {!isFocusMode && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Link to="/crypt" className="text-white/40 font-pixel text-2xl hover:text-slime-green flex items-center gap-4 mb-12 group w-fit transition-all tracking-[0.2em] uppercase">
                  <ArrowLeft className="w-7 h-7 group-hover:-translate-x-3 transition-transform" />
                  RETURN TO DASHBOARD
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={cn("grid grid-cols-1 gap-12 transition-all duration-700", !isFocusMode && "lg:grid-cols-12")}>
            <div className={cn("transition-all duration-700", isFocusMode ? "max-w-5xl mx-auto w-full" : "lg:col-span-8")}>
              <Tabs defaultValue="story" className="w-full">
                {!isFocusMode && (
                  <TabsList className="grid w-full grid-cols-2 bg-black/60 border border-white/5 p-1.5 mb-10 h-auto">
                    <TabsTrigger value="story" className="font-gothic text-xl py-5 data-[state=active]:bg-slime-green data-[state=active]:text-black tracking-widest uppercase">
                      GRIM NARRATIVE
                    </TabsTrigger>
                    <TabsTrigger value="email" className="font-gothic text-xl py-5 data-[state=active]:bg-phantom-pink data-[state=active]:text-black tracking-widest uppercase">
                      MIDNIGHT POST
                    </TabsTrigger>
                  </TabsList>
                )}
                <TabsContent value="story" className="min-h-[600px]">
                  <div className="retro-window border-slime-green/20">
                    <div className="retro-window-header bg-slime-green/80 text-black">
                      <div className="flex items-center gap-4">
                        <ScrollText className="w-5 h-5" />
                        <span className="tracking-widest uppercase">Ingestion_Protocol_04.1</span>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => { if(confirm('Purge current draft?')) { setStoryForm({ title: '', source: '', content: '', mediaUrl: '' }); clearStoryDraft(); }}} className="text-xs font-pixel uppercase border border-black/10 px-2 py-1 hover:bg-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className="text-xs font-pixel uppercase border border-black/20 px-4 py-1 hover:bg-black hover:text-slime-green transition-colors">
                          {isFocusMode ? 'RESTORE INTERFACE' : 'FOCUS TERMINAL'}
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleStorySubmit} className="p-8 md:p-12 space-y-10 bg-black/40">
                      <div>
                        <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Tale Title</label>
                        <input
                          required value={storyForm.title}
                          placeholder="Untitled Grim Report..."
                          onChange={(e) => setStoryForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-noir-gray/50 border border-white/10 p-5 text-white font-gothic text-3xl focus:border-slime-green transition-all outline-none placeholder:text-white/5"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Origin Source</label>
                          <input
                            value={storyForm.source}
                            placeholder="r/NoSleep, Leak, etc."
                            onChange={(e) => setStoryForm(prev => ({ ...prev, source: e.target.value }))}
                            className="w-full bg-noir-gray/50 border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Media Vault Link</label>
                          <input
                            value={storyForm.mediaUrl}
                            placeholder="YouTube / Video Reference"
                            onChange={(e) => setStoryForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                            className="w-full bg-noir-gray/50 border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="block font-pixel text-sm text-slime-green/60 tracking-widest uppercase">Content Ingestion</label>
                          <span className="font-pixel text-xs text-white/20 tracking-widest uppercase">
                            {stats.story.words} WORDS // EST. {stats.story.time}
                          </span>
                        </div>
                        <textarea
                          required rows={isFocusMode ? 25 : 15} value={storyForm.content}
                          placeholder="The void is listening..."
                          onChange={(e) => setStoryForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-noir-gray/50 border border-white/10 p-6 text-white font-mono text-lg leading-relaxed focus:border-slime-green transition-all outline-none resize-none min-h-[400px]"
                        />
                      </div>
                      <div className="relative group pt-4">
                        <AnimatePresence>
                          {showSavedToast && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slime-green font-pixel text-xs uppercase tracking-widest">
                              <ShieldCheck className="w-3 h-3" /> Pact Auto-Saved
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button type="submit" disabled={loading} className="retro-button w-full text-2xl font-gothic py-8 tracking-[0.3em] uppercase">
                          {loading ? 'INGESTING...' : 'SUMMON TO CRYPT'}
                        </button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="email" className="min-h-[600px]">
                   <div className="retro-window border-phantom-pink/20">
                    <div className="retro-window-header bg-phantom-pink/80 text-black">
                      <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5" />
                        <span className="tracking-widest uppercase">Midnight_Post_Ticket_v1.3</span>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => { if(confirm('Incinerate draft?')) { setEmailForm({ senderEmail: '', subject: '', content: '', mediaUrl: '' }); clearEmailDraft(); }}} className="text-xs font-pixel uppercase border border-black/10 px-2 py-1 hover:bg-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className="text-xs font-pixel uppercase border border-black/20 px-4 py-1 hover:bg-black hover:text-phantom-pink transition-colors">
                          {isFocusMode ? 'RESTORE INTERFACE' : 'FOCUS TERMINAL'}
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleEmailSubmit} className="p-8 md:p-12 space-y-10 bg-black/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-phantom-pink/60 tracking-widest uppercase">Sender Identity</label>
                          <input
                            type="email" value={emailForm.senderEmail}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, senderEmail: e.target.value }))}
                            className="w-full bg-noir-gray/50 border border-white/10 p-5 text-white font-mono text-lg focus:border-phantom-pink transition-all outline-none"
                            placeholder="soul@void.net"
                          />
                        </div>
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-phantom-pink/60 tracking-widest uppercase">Subject Cipher</label>
                          <input
                            required value={emailForm.subject}
                            placeholder="Something is in the walls..."
                            onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full bg-noir-gray/50 border border-white/10 p-5 text-white font-mono text-lg focus:border-phantom-pink transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="block font-pixel text-sm text-phantom-pink/60 tracking-widest uppercase">Raw Post Content</label>
                          <span className="font-pixel text-xs text-white/20 tracking-widest uppercase">{stats.email.words} WORDS</span>
                        </div>
                        <textarea
                          required rows={isFocusMode ? 25 : 15} value={emailForm.content}
                          placeholder="Paste the raw submission..."
                          onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-noir-gray/50 border border-white/10 p-6 text-white font-mono text-lg leading-relaxed focus:border-phantom-pink transition-all outline-none resize-none min-h-[400px]"
                        />
                      </div>
                      <div className="relative pt-4">
                        <AnimatePresence>
                          {showSavedToast && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-phantom-pink font-pixel text-xs uppercase tracking-widest">
                              <ShieldCheck className="w-3 h-3" /> Post Cached
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button type="submit" disabled={loading} className="retro-button-pink w-full text-2xl font-gothic py-8 tracking-[0.3em] uppercase">
                          {loading ? 'FILING...' : 'GENERATE BROADCAST TICKET'}
                        </button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <AnimatePresence>
              {!isFocusMode && (
                <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} className="lg:col-span-4 space-y-10">
                  <div className="retro-panel bg-white/[0.02] border-white/5 p-8">
                    <h3 className="font-gothic text-2xl mb-8 text-white flex items-center gap-3 tracking-widest uppercase">
                      <Info className="w-6 h-6 text-slime-green/60" /> ARCHIVE RULES
                    </h3>
                    <div className="font-pixel text-base text-white/30 space-y-8 leading-relaxed uppercase tracking-widest">
                      <div className="space-y-2">
                        <p className="text-slime-green/60">NARRATIVES:</p>
                        <p>Reserved for long-form episodes. These receive top priority in the Zine.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-phantom-pink/60">POSTS (TICKETS):</p>
                        <p>Listener communications and smaller curiosities. Can be promoted to Narratives.</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/10 uppercase">Vault Auto-Save active</span>
                        <div className="w-2 h-2 rounded-full bg-slime-green animate-pulse shadow-[0_0_8px_rgba(40,167,69,0.4)]" />
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {!isFocusMode && <RetroFooter />}
    </div>
  );
}