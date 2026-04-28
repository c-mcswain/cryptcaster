import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Skull, X, Zap, Mail, ChevronRight, Send, LogOut, BookOpen, Newspaper } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story, ZineContent } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useAuth } from '@/hooks/use-auth';
import { SubmissionHero } from '@/components/SubmissionHero';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [zine, setZine] = useState<ZineContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [kindFilter, setKindFilter] = useState<'all' | 'story' | 'email' | 'submission'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'recorded'>('all');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const [storiesRes, zineRes] = await Promise.all([
        api<{ items: Story[] }>('/api/stories'),
        api<ZineContent>('/api/zine')
      ]);
      setStories([...storiesRes.items].sort((a, b) => b.createdAt - a.createdAt));
      setZine(zineRes);
    } catch (err) {
      toast.error('Failed to summon from the void.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleConvertToStory = async (id: string) => {
    try {
      await api(`/api/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ kind: 'story' })
      });
      toast.success('Ticket promoted to Grim Narrative.');
      fetchData();
    } catch (err) {
      toast.error('Promotion failed.');
    }
  };
  const filteredStories = stories.filter(s => {
    const matchesKind = kindFilter === 'all' || s.kind === kindFilter || (kindFilter === 'email' && s.kind === 'submission');
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? !s.isRecorded : s.isRecorded);
    return matchesKind && matchesStatus;
  });
  const featuredStory = stories.find(s => s.id === zine?.featuredStoryId);
  return (
    <div className="min-h-screen flex flex-col relative bg-nocturnal-purple/5">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-10 lg:py-12">
          {/* HEADER / NAVIGATION */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <Skull className="w-8 h-8 text-slime-green" />
              <div className="font-pixel text-lg tracking-widest text-white/40 uppercase">MORALLY GRIM ARCHIVES</div>
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/zine-admin" className="font-pixel text-sm text-slime-green hover:text-white flex items-center gap-2 px-4 py-2 border border-slime-green/20 bg-slime-green/5 hover:bg-slime-green/20 transition-all">
                    <Newspaper className="w-4 h-4" /> EDITOR
                  </Link>
                  <button onClick={logout} className="font-pixel text-sm text-phantom-pink hover:text-white flex items-center gap-2 px-4 py-2 border border-phantom-pink/20 bg-phantom-pink/5 hover:bg-phantom-pink/20 transition-all">
                    <LogOut className="w-4 h-4" /> LOGOUT
                  </button>
                </>
              ) : (
                <Link to="/login" className="font-pixel text-sm text-white/40 hover:text-white uppercase tracking-widest px-4 py-2 border border-white/5 transition-all">
                  STAFF LOGIN
                </Link>
              )}
            </div>
          </div>
          {/* MIDNIGHT ZINE HERO */}
          {!loading && zine && (
            <section className="mb-24">
              <div className="text-center mb-16">
                <h1 className="gothic-header text-6xl md:text-9xl mb-4 tracking-[0.3em] animate-pulse-glow">THE MIDNIGHT ZINE</h1>
                <p className="font-pixel text-xl text-slime-green/60 uppercase tracking-[0.5em]">Issue: {new Date(zine.lastUpdated).toLocaleDateString()} // VOL. 4</p>
              </div>
              
              <SubmissionHero />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Introit */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                   <div className="retro-window border-white/10 flex-1">
                      <div className="retro-window-header bg-white/10 text-white italic">The Editor's Introit</div>
                      <div className="p-8 bg-black/40 font-mono text-sm leading-relaxed text-white/50 italic space-y-6">
                        <p>"{zine.intro}"</p>
                        <div className="pt-6 border-t border-white/5 font-pixel text-xs text-slime-green tracking-widest not-italic">
                          — {zine.editorName.toUpperCase()}
                        </div>
                      </div>
                   </div>
                   <div className="retro-panel bg-phantom-pink/5 border-phantom-pink/20">
                      <h3 className="font-gothic text-lg text-phantom-pink tracking-widest uppercase mb-4">Grim Announcements</h3>
                      <ul className="space-y-3 font-pixel text-sm text-white/40 tracking-widest uppercase">
                        {zine.announcements.map((a, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-phantom-pink animate-pulse">»</span> {a}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
                {/* Right Side: Featured Card */}
                <div className="lg:col-span-8">
                  <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full border-4 border-white/10 group overflow-hidden shadow-2xl">
                    <img 
                      src={zine.coverImageUrl} 
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                      alt="Zine Cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col items-start gap-6">
                      <div className="flex items-center gap-4 bg-phantom-pink px-4 py-1 text-black font-pixel text-xs uppercase tracking-widest animate-mist">
                        <Zap className="w-3 h-3 fill-current" /> Featured This Week
                      </div>
                      <h2 className="font-gothic text-4xl md:text-6xl text-white tracking-widest leading-tight">
                        {featuredStory?.title || "ARCHIVE SELECTION PENDING"}
                      </h2>
                      <p className="font-mono text-lg text-white/60 line-clamp-2 max-w-2xl">
                        {featuredStory?.content || "The void is quiet tonight. Check back soon for the next featured narrative."}
                      </p>
                      {featuredStory && (
                        <Link to={`/read/${featuredStory.id}`} className="retro-button-pink text-2xl font-gothic px-12 py-5 mt-4 group">
                          READ THE TALE <ChevronRight className="inline-block w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* ACTION BAR */}
          <div className="mt-20 mb-16 flex flex-wrap justify-center gap-8 border-y border-white/5 py-12">
              <Link to="/add" className="retro-button-pink px-12 py-4 font-gothic text-xl flex items-center gap-4 transition-transform hover:scale-105 active:scale-100">
                <Plus className="w-5 h-5" /> NEW INGESTION
              </Link>
              <Link to="/submit" className="retro-button px-12 py-4 font-gothic text-xl flex items-center gap-4 border-slime-green transition-transform hover:scale-105 active:scale-100">
                <Send className="w-5 h-5" /> SUBMIT TALE
              </Link>
          </div>
          {/* ARCHIVE SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="font-gothic text-4xl text-white/20 tracking-widest">ARCHIVES</h2>
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-black/60 border border-white/5 rounded-sm font-pixel max-w-full">
              {(['all', 'story', 'email', 'submission'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setKindFilter(k)}
                  className={cn(
                    "px-8 py-2.5 transition-all text-sm tracking-widest whitespace-nowrap uppercase",
                    kindFilter === k ? "bg-slime-green text-black" : "text-white/40 hover:text-white"
                  )}
                >
                  {k === 'email' ? 'INBOX' : k}
                </button>
              ))}
            </div>
            <div className="flex gap-6 font-pixel text-base">
               {(['all', 'unread', 'recorded'] as const).map(s => (
                <button
                  key={s} onClick={() => setStatusFilter(s)}
                  className={cn("border-b-2 px-6 py-2 transition-colors uppercase tracking-widest", statusFilter === s ? "border-phantom-pink text-phantom-pink" : "border-transparent text-white/30 hover:text-white/60")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="py-32 text-center font-gothic text-3xl animate-pulse tracking-widest opacity-40">INVOKING DATABASE...</div>
          ) : filteredStories.length === 0 ? (
            <div className="retro-panel py-48 text-center border-dashed border-white/10 bg-black/20">
              <p className="font-gothic text-6xl mb-6 text-white/10">VOID_DETECTED</p>
              <p className="font-pixel text-2xl text-white/5 tracking-[0.3em] uppercase">The archive is empty of souls.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredStories.map((story) => (
                <div key={story.id} className={cn("retro-window group transition-all duration-500 hover:border-white/20", (story.kind === 'email' || story.kind === 'submission') ? "border-phantom-pink/20" : "border-slime-green/20")}>
                  <div className={cn("retro-window-header opacity-80", (story.kind === 'email' || story.kind === 'submission') ? "bg-phantom-pink" : "bg-slime-green")}>
                    <div className="flex items-center gap-3">
                      {(story.kind === 'email' || story.kind === 'submission') ? <Mail className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span className="font-pixel text-xs truncate uppercase tracking-tighter">
                        {story.kind?.toUpperCase() || 'NARR'}_REC_{story.id.slice(0, 6)}
                      </span>
                    </div>
                    <X className="w-4 h-4 opacity-30" />
                  </div>
                  <div className="p-8 flex flex-col h-full bg-black/60">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-pixel text-xs text-white/30 uppercase tracking-widest tabular-nums">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      {story.metadata?.ticketId && (
                        <span className="bg-noir-gray text-phantom-pink/80 font-pixel text-[10px] px-3 py-1 border border-phantom-pink/20">
                          {story.metadata.ticketId}
                        </span>
                      )}
                      {story.isRecorded && (
                        <span className="bg-slime-green/10 text-slime-green font-pixel text-[10px] px-2 py-0.5 border border-slime-green/20 tracking-tighter uppercase">Recorded</span>
                      )}
                    </div>
                    <h3 className="font-gothic text-2xl text-white/90 mb-4 line-clamp-2 min-h-[4rem] group-hover:text-slime-green transition-colors leading-relaxed">
                      {story.title}
                    </h3>
                    <p className="font-pixel text-xs text-white/40 mb-8 truncate tracking-wider">
                      {story.kind === 'story' ? `SOURCE: ${story.source}` : `SENDER: ${story.source}`}
                    </p>
                    <div className="mb-10 font-mono text-sm text-white/20 line-clamp-3 leading-relaxed h-[4.5rem]">
                      {story.content}
                    </div>
                    <div className="mt-auto pt-6 flex gap-4">
                      <Link to={`/read/${story.id}`} className="retro-button flex-1 py-4 text-base flex items-center justify-center gap-3 font-gothic tracking-widest hover:scale-[1.02] transition-transform">
                        <Skull className="w-5 h-5 fill-current" /> OPEN TOMB
                      </Link>
                      {(story.kind === 'email' || story.kind === 'submission') && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleConvertToStory(story.id)}
                                className="border border-white/5 hover:border-white/20 bg-noir-gray/50 px-5 transition-all text-white/30 hover:text-white"
                              >
                                <Zap className="w-5 h-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border border-white/20 font-pixel text-xs">PROMOTE TO NARRATIVE</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <RetroFooter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}