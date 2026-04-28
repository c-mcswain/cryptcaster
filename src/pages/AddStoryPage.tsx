import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Info, AlertTriangle, Sparkles, Skull, Maximize2, Minimize2, RotateCcw, Mail, ScrollText, Hash } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { wordCount, estimateReadTime } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const isInitialized = useRef(false);
  const [activeTab, setActiveTab] = useState<'story' | 'email'>('story');
  // Persistent drafts for both types
  const [storyDraft, setStoryDraft, clearStoryDraft] = useLocalStorage('cryptcaster_story_draft', { title: '', source: '', content: '' });
  const [emailDraft, setEmailDraft, clearEmailDraft] = useLocalStorage('cryptcaster_email_draft', { senderEmail: '', subject: '', content: '' });
  const [storyForm, setStoryForm] = useState({ title: '', source: '', content: '' });
  const [emailForm, setEmailForm] = useState({ senderEmail: '', subject: '', content: '' });
  useEffect(() => {
    if (!isInitialized.current) {
      setStoryForm(storyDraft);
      setEmailForm(emailDraft);
      isInitialized.current = true;
      return;
    }
    const timeoutId = setTimeout(() => {
      setStoryDraft(storyForm);
      setEmailDraft(emailForm);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [storyForm, emailForm, setStoryDraft, setEmailDraft, storyDraft, emailDraft]);
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
        body: JSON.stringify({
          ...storyForm,
          kind: 'story',
          metadata: {}
        })
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
    <div className={`min-h-screen flex flex-col relative transition-colors duration-1000 ${isFocusMode ? 'bg-black' : 'bg-nocturnal-purple/20'}`}>
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-10 lg:py-12">
          {!isFocusMode && (
            <Link to="/" className="text-white font-pixel text-xl hover:text-slime-green flex items-center gap-3 mb-10 group w-fit transition-all">
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
              <span className="tracking-widest uppercase">BACK TO CRYPT</span>
            </Link>
          )}
          <div className={`grid grid-cols-1 ${isFocusMode ? '' : 'lg:grid-cols-12'} gap-12`}>
            <div className={`${isFocusMode ? 'max-w-4xl mx-auto w-full' : 'lg:col-span-8'}`}>
              <Tabs defaultValue="story" onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                {!isFocusMode && (
                  <TabsList className="grid w-full grid-cols-2 bg-black/40 border-2 border-white/10 p-1 mb-8 h-auto">
                    <TabsTrigger value="story" className="font-gothic py-3 data-[state=active]:bg-slime-green data-[state=active]:text-black">
                      GRIM NARRATIVE
                    </TabsTrigger>
                    <TabsTrigger value="email" className="font-gothic py-3 data-[state=active]:bg-phantom-pink data-[state=active]:text-black">
                      MIDNIGHT POST
                    </TabsTrigger>
                  </TabsList>
                )}
                <TabsContent value="story">
                  <div className="retro-window border-slime-green/30">
                    <div className="retro-window-header bg-slime-green text-black">
                      <div className="flex items-center gap-3">
                        <ScrollText className="w-4 h-4" />
                        <span>INGESTION_PROTOCOL_V4.0</span>
                      </div>
                      <button onClick={() => setIsFocusMode(!isFocusMode)} className="text-[10px] uppercase border border-black/20 px-2 py-0.5">
                        {isFocusMode ? 'MINIMIZE' : 'EXPAND'}
                      </button>
                    </div>
                    <form onSubmit={handleStorySubmit} className="p-6 md:p-10 space-y-8 bg-black/60">
                      <div>
                        <label className="block font-pixel text-xs mb-2 text-slime-green opacity-70">TALE TITLE</label>
                        <input
                          required value={storyForm.title}
                          onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                          className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-gothic text-xl focus:border-slime-green transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-pixel text-xs mb-2 text-slime-green opacity-70">ORIGIN SOURCE</label>
                        <input
                          value={storyForm.source}
                          onChange={(e) => setStoryForm({ ...storyForm, source: e.target.value })}
                          className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-mono focus:border-slime-green transition-all outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block font-pixel text-xs text-slime-green opacity-70">BODY CONTENT</label>
                          <span className="font-pixel text-[10px] text-white/40">{stats.story.words} WORDS</span>
                        </div>
                        <textarea
                          required rows={12} value={storyForm.content}
                          onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                          className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-mono leading-relaxed focus:border-slime-green transition-all outline-none resize-none"
                        />
                      </div>
                      <button type="submit" disabled={loading} className="retro-button w-full text-2xl font-gothic py-5">
                        {loading ? 'INGESTING...' : 'SUMMON TO CRYPT'}
                      </button>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="email">
                  <div className="retro-window border-phantom-pink/30">
                    <div className="retro-window-header bg-phantom-pink text-black">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4" />
                        <span>MIDNIGHT_POST_TICKET_V1.2</span>
                      </div>
                      <button onClick={() => setIsFocusMode(!isFocusMode)} className="text-[10px] uppercase border border-black/20 px-2 py-0.5">
                        {isFocusMode ? 'MINIMIZE' : 'EXPAND'}
                      </button>
                    </div>
                    <form onSubmit={handleEmailSubmit} className="p-6 md:p-10 space-y-8 bg-black/60">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block font-pixel text-xs mb-2 text-phantom-pink opacity-70">SENDER EMAIL</label>
                          <input
                            type="email" value={emailForm.senderEmail}
                            onChange={(e) => setEmailForm({ ...emailForm, senderEmail: e.target.value })}
                            className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                            placeholder="listener@void.com"
                          />
                        </div>
                        <div>
                          <label className="block font-pixel text-xs mb-2 text-phantom-pink opacity-70">SUBJECT LINE</label>
                          <input
                            required value={emailForm.subject}
                            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                            className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-mono focus:border-phantom-pink transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block font-pixel text-xs text-phantom-pink opacity-70">EMAIL BODY</label>
                          <span className="font-pixel text-[10px] text-white/40">{stats.email.words} WORDS</span>
                        </div>
                        <textarea
                          required rows={12} value={emailForm.content}
                          onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
                          className="w-full bg-black/40 border-2 border-white/10 p-4 text-white font-mono leading-relaxed focus:border-phantom-pink transition-all outline-none resize-none"
                        />
                      </div>
                      <button type="submit" disabled={loading} className="retro-button-pink w-full text-2xl font-gothic py-5">
                        {loading ? 'FILING...' : 'GENERATE TICKET'}
                      </button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            {!isFocusMode && (
              <aside className="lg:col-span-4 space-y-8">
                <div className="retro-panel bg-white/5 border-white/10">
                  <h3 className="font-gothic text-xl mb-4 text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-slime-green" /> PROTOCOL
                  </h3>
                  <div className="font-pixel text-sm text-white/60 space-y-4">
                    <p>• NARRATIVES: Long-form stories destined for the main show block.</p>
                    <p>• TICKETS: Listener submissions requiring review or shorter segments.</p>
                    <p>• AUTOMATION: Tickets are auto-prefixed with unique identifiers.</p>
                  </div>
                </div>
                <div className="flex justify-center opacity-10 py-10">
                  <Skull className="w-32 h-32" />
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