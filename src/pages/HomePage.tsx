import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Skull, X, Zap, Mail, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [kindFilter, setKindFilter] = useState<'all' | 'story' | 'email'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'recorded'>('all');
  const fetchStories = async () => {
    try {
      const response = await api<{ items: Story[] }>('/api/stories');
      setStories([...response.items].sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      toast.error('Failed to summon from the void.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStories();
  }, []);
  const handleConvertToStory = async (id: string) => {
    try {
      await api(`/api/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ kind: 'story' })
      });
      toast.success('Ticket promoted to Grim Narrative.');
      fetchStories();
    } catch (err) {
      toast.error('Promotion failed.');
    }
  };
  const filteredStories = stories.filter(s => {
    const matchesKind = kindFilter === 'all' || s.kind === kindFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? !s.isRecorded : s.isRecorded);
    return matchesKind && matchesStatus;
  });
  return (
    <div className="min-h-screen flex flex-col relative bg-nocturnal-purple/5">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-12 md:py-16">
          <header className="mb-20 text-center">
            <h1 className="gothic-header text-5xl md:text-8xl mb-6 animate-pulse-glow tracking-[0.2em]">INVITE ME IN</h1>
            <div className="font-pixel text-2xl text-phantom-pink tracking-[0.4em] uppercase opacity-60">MORALLY GRIM ARCHIVES</div>
            <div className="mt-14 flex justify-center gap-6">
              <Link to="/add" className="retro-button-pink px-16 py-5 font-gothic text-2xl flex items-center gap-4 transition-transform hover:scale-105 active:scale-100">
                <Plus className="w-6 h-6" /> NEW INGESTION
              </Link>
            </div>
          </header>
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="flex gap-2 p-1.5 bg-black/60 border border-white/5 rounded-sm font-pixel">
              {(['all', 'story', 'email'] as const).map(k => (
                <button
                  key={k} onClick={() => setKindFilter(k)}
                  className={cn("px-8 py-2.5 transition-all text-sm tracking-widest", kindFilter === k ? "bg-slime-green text-black" : "text-white/40 hover:text-white")}
                >
                  {k === 'email' ? 'INBOX' : k.toUpperCase()}
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
                <div key={story.id} className={cn("retro-window group transition-all duration-500 hover:border-white/20", story.kind === 'email' ? "border-phantom-pink/20" : "border-slime-green/20")}>
                  <div className={cn("retro-window-header opacity-80", story.kind === 'email' ? "bg-phantom-pink" : "bg-slime-green")}>
                    <div className="flex items-center gap-3">
                      {story.kind === 'email' ? <Mail className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span className="font-pixel text-xs truncate uppercase tracking-tighter">
                        {story.kind === 'email' ? 'POST_REC' : 'NARR_REC'}_{story.id.slice(0, 6)}
                      </span>
                    </div>
                    <X className="w-4 h-4 opacity-30" />
                  </div>
                  <div className="p-8 flex flex-col h-full bg-black/60">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-pixel text-xs text-white/30 uppercase tracking-widest tabular-nums">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      {story.kind === 'email' && (
                        <span className="bg-noir-gray text-phantom-pink/80 font-pixel text-xs px-3 py-1 border border-phantom-pink/20">
                          ID: {story.metadata?.ticketId || 'NA'}
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
                      {story.kind === 'email' ? `SENDER: ${story.source}` : `SOURCE: ${story.source}`}
                    </p>
                    <div className="mb-10 font-mono text-sm text-white/20 line-clamp-3 leading-relaxed h-[4.5rem]">
                      {story.content}
                    </div>
                    <div className="mt-auto pt-6 flex gap-4">
                      <Link to={`/read/${story.id}`} className="retro-button flex-1 py-4 text-base flex items-center justify-center gap-3 font-gothic tracking-widest hover:scale-[1.02] transition-transform">
                        <Skull className="w-5 h-5 fill-current" /> OPEN TOMB
                      </Link>
                      {story.kind === 'email' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
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