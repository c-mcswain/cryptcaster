import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Info, Skull, Mail, ScrollText } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { wordCount, estimateReadTime } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
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
    const timeoutId = setTimeout(() => {
      setStoryDraft(storyForm);
      setEmailDraft(emailForm);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [storyForm, emailForm, setStoryDraft, setEmailDraft]);
  const stats = useMemo(() => ({
    story: { words: wordCount(storyForm.content), time: estimateReadTime(storyForm.content) },
    email: { words: wordCount(emailForm.content), time: estimateReadTime(emailForm.content) }
  }), [storyForm.content, emailForm.content]);
  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title.trim() || !storyForm.content.trim()) return toast.error('Required fields missing!');
    setLoading(true);
    try {
      await api('/api/stories', {
        method: 'POST',
        body: JSON.stringify({ ...storyForm, kind: 'story', metadata: {} })
      });
      toast.success('Grim narrative ingested.');
      clearStoryDraft();
      navigate('/');
    } catch (err) {
      toast.error('Submission failed.');
    } finally {
      setLoading(false);
    }
  };
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.subject.trim() || !emailForm.content.trim()) return toast.error('Subject and Body required!');
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
          metadata: {
            senderEmail: emailForm.senderEmail,
            subject: emailForm.subject,
            ticketId: ticketId
          }
        })
      });
      toast.success('Midnight post filed into the crypt.');
      clearEmailDraft();
      navigate('/');
    } catch (err) {
      toast.error('Failed to process ticket.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-1000 ${isFocusMode ? 'bg-black' : 'bg-nocturnal-purple/10'}`}>
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-10 lg:py-12">
          <AnimatePresence>
            {!isFocusMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Link to="/" className="text-white/60 font-pixel text-2xl hover:text-slime-green flex items-center gap-4 mb-12 group w-fit transition-all tracking-widest">
                  <ArrowLeft className="w-7 h-7 group-hover:-translate-x-3 transition-transform" />
                  <span className="uppercase">BACK TO CRYPT</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`grid grid-cols-1 ${isFocusMode ? '' : 'lg:grid-cols-12'} gap-12 transition-all duration-500`}>
            <div className={`${isFocusMode ? 'max-w-4xl mx-auto w-full' : 'lg:col-span-8'}`}>
              <Tabs defaultValue="story" className="w-full">
                {!isFocusMode && (
                  <TabsList className="grid w-full grid-cols-2 bg-black/60 border border-white/5 p-1.5 mb-10 h-auto">
                    <TabsTrigger value="story" className="font-gothic text-xl py-4 data-[state=active]:bg-slime-green data-[state=active]:text-black tracking-widest">
                      GRIM NARRATIVE
                    </TabsTrigger>
                    <TabsTrigger value="email" className="font-gothic text-xl py-4 data-[state=active]:bg-phantom-pink data-[state=active]:text-black tracking-widest">
                      MIDNIGHT POST
                    </TabsTrigger>
                  </TabsList>
                )}
                <TabsContent value="story">
                  <div className="retro-window border-slime-green/20">
                    <div className="retro-window-header bg-slime-green/80 text-black">
                      <div className="flex items-center gap-4">
                        <ScrollText className="w-5 h-5" />
                        <span className="tracking-widest uppercase">Ingestion_Protocol_04.1</span>
                      </div>
                      <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className="text-sm font-pixel uppercase border border-black/20 px-4 py-1 hover:bg-black hover:text-slime-green transition-colors">
                        {isFocusMode ? 'Minimize Interface' : 'Expand Terminal'}
                      </button>
                    </div>
                    <form onSubmit={handleStorySubmit} className="p-8 md:p-12 space-y-10 bg-black/40">
                      <div>
                        <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Tale Title</label>
                        <input
                          required value={storyForm.title}
                          placeholder="Untitled Grim Report..."
                          onChange={(e) => setStoryForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-noir-gray border border-white/10 p-5 text-white font-gothic text-2xl focus:border-slime-green transition-all outline-none placeholder:text-white/5"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Origin Source</label>
                          <input
                            value={storyForm.source}
                            placeholder="r/NoSleep, Dark Web Archive, etc."
                            onChange={(e) => setStoryForm(prev => ({ ...prev, source: e.target.value }))}
                            className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none placeholder:text-white/5"
                          />
                        </div>
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-slime-green/60 tracking-widest uppercase">Media Reference (URL)</label>
                          <input
                            value={storyForm.mediaUrl}
                            placeholder="YouTube / Article Link"
                            onChange={(e) => setStoryForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                            className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none placeholder:text-white/5"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="block font-pixel text-sm text-slime-green/60 tracking-widest uppercase">Body Content</label>
                          <span className="font-pixel text-xs text-white/20 tracking-tighter">{stats.story.words} WORDS / EST. {stats.story.time}</span>
                        </div>
                        <textarea
                          required rows={14} value={storyForm.content}
                          placeholder="The void awaits your report..."
                          onChange={(e) => setStoryForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-noir-gray border border-white/10 p-6 text-white font-mono text-lg leading-relaxed focus:border-slime-green transition-all outline-none resize-none placeholder:text-white/5"
                        />
                      </div>
                      <button type="submit" disabled={loading} className="retro-button w-full text-2xl font-gothic py-6 tracking-[0.2em]">
                        {loading ? 'Ingesting Record...' : 'Summon to the Crypt'}
                      </button>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="email">
                  <div className="retro-window border-phantom-pink/20">
                    <div className="retro-window-header bg-phantom-pink/80 text-black">
                      <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5" />
                        <span className="tracking-widest uppercase">Midnight_Post_Ticket_v1.3</span>
                      </div>
                      <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className="text-sm font-pixel uppercase border border-black/20 px-4 py-1 hover:bg-black hover:text-phantom-pink transition-colors">
                        {isFocusMode ? 'Minimize Interface' : 'Expand Terminal'}
                      </button>
                    </div>
                    <form onSubmit={handleEmailSubmit} className="p-8 md:p-12 space-y-10 bg-black/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-phantom-pink/60 tracking-widest uppercase">Sender Email</label>
                          <input
                            type="email" value={emailForm.senderEmail}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, senderEmail: e.target.value }))}
                            className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-phantom-pink transition-all outline-none"
                            placeholder="listener@the-void.com"
                          />
                        </div>
                        <div>
                          <label className="block font-pixel text-sm mb-3 text-phantom-pink/60 tracking-widest uppercase">Subject Line</label>
                          <input
                            required value={emailForm.subject}
                            placeholder="RE: Something followed me home..."
                            onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-phantom-pink transition-all outline-none placeholder:text-white/5"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-pixel text-sm mb-3 text-phantom-pink/60 tracking-widest uppercase">Media Reference (URL)</label>
                        <input
                          value={emailForm.mediaUrl}
                          placeholder="Supporting evidence (YouTube, Images, Links)"
                          onChange={(e) => setEmailForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                          className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-phantom-pink transition-all outline-none placeholder:text-white/5"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="block font-pixel text-sm text-phantom-pink/60 tracking-widest uppercase">Email Body</label>
                          <span className="font-pixel text-xs text-white/20 tracking-tighter">{stats.email.words} WORDS</span>
                        </div>
                        <textarea
                          required rows={14} value={emailForm.content}
                          placeholder="Paste the raw submission here..."
                          onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-noir-gray border border-white/10 p-6 text-white font-mono text-lg leading-relaxed focus:border-phantom-pink transition-all outline-none resize-none placeholder:text-white/5"
                        />
                      </div>
                      <button type="submit" disabled={loading} className="retro-button-pink w-full text-2xl font-gothic py-6 tracking-[0.2em]">
                        {loading ? 'Filing Report...' : 'Generate Broadcast Ticket'}
                      </button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            {!isFocusMode && (
              <aside className="lg:col-span-4 space-y-10">
                <div className="retro-panel bg-white/[0.02] border-white/5 p-8">
                  <h3 className="font-gothic text-2xl mb-6 text-white flex items-center gap-3">
                    <Info className="w-6 h-6 text-slime-green/60" /> BROADCAST PROTOCOL
                  </h3>
                  <div className="font-pixel text-base text-white/40 space-y-6 leading-relaxed">
                    <p>• NARRATIVES: Long-form stories destined for the main show block.</p>
                    <p>• TICKETS: Listener submissions requiring review or shorter segments.</p>
                    <p>• MEDIA: Supports YouTube embeds for react-style content.</p>
                  </div>
                </div>
                <div className="flex justify-center opacity-[0.03] py-20">
                  <Skull className="w-48 h-48" />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      {!isFocusMode && <RetroFooter />}
    </div>
  );
}