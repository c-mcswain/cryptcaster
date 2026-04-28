import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Play, Skull, X, Minus, Square, Moon, Zap, Archive, BookOpen, Clock, FileText, Mail, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { wordCount, estimateReadTime, cn } from '@/lib/utils';
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
    <div className="min-h-screen flex flex-col relative bg-nocturnal-purple/20">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-12 md:py-16">
          <header className="mb-16 text-center">
            <h1 className="gothic-header text-6xl md:text-8xl mb-4 animate-pulse-glow">THE CRYPT</h1>
            <div className="font-pixel text-xl text-phantom-pink tracking-[0.3em] uppercase">MORALLY GRIM ARCHIVES</div>
            <div className="mt-12 flex justify-center gap-6">
              <Link to="/add" className="retro-button-pink px-12 py-4 font-gothic text-2xl flex items-center gap-3">
                <Plus /> NEW INGESTION
              </Link>
            </div>
          </header>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <div className="flex gap-2 p-1 bg-black/40 border-2 border-white/10 rounded-sm font-pixel">
              {(['all', 'story', 'email'] as const).map(k => (
                <button
                  key={k} onClick={() => setKindFilter(k)}
                  className={cn("px-6 py-2 transition-all", kindFilter === k ? "bg-slime-green text-black" : "text-white/60 hover:text-white")}
                >
                  {k === 'email' ? 'INBOX' : k.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-4 font-pixel text-sm">
               {(['all', 'unread', 'recorded'] as const).map(s => (
                <button
                  key={s} onClick={() => setStatusFilter(s)}
                  className={cn("border-b-2 px-4 py-1", statusFilter === s ? "border-phantom-pink text-phantom-pink" : "border-transparent text-white/40 hover:text-white/80")}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="py-32 text-center font-gothic text-2xl animate-pulse">INVOKING DATABASE...</div>
          ) : filteredStories.length === 0 ? (
            <div className="retro-panel py-32 text-center opacity-30 border-dashed">
              <p className="font-gothic text-4xl mb-4">NOTHING LURKS HERE</p>
              <p className="font-pixel text-xl">THE ARCHIVE IS VOID OF LIFE.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredStories.map((story) => (
                <div key={story.id} className={cn("retro-window group transition-all duration-300", story.kind === 'email' ? "border-phantom-pink/40" : "border-slime-green/40")}>
                  <div className={cn("retro-window-header", story.kind === 'email' ? "bg-phantom-pink" : "bg-slime-green")}>
                    <div className="flex items-center gap-2">
                      {story.kind === 'email' ? <Mail className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span className="font-pixel text-[10px] truncate uppercase">{story.kind === 'email' ? 'TICKET_REC' : 'NARRATIVE_REC'}_{story.id.slice(0, 4)}</span>
                    </div>
                    <X className="w-3 h-3 opacity-40" />
                  </div>
                  <div className="p-6 flex flex-col h-full bg-black/40">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-pixel text-[10px] text-white/40 uppercase tabular-nums">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      {story.kind === 'email' && (
                        <span className="bg-phantom-pink/20 text-phantom-pink font-pixel text-[10px] px-2 py-0.5 border border-phantom-pink/30">
                          ID: {story.metadata?.ticketId || 'NA'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-gothic text-2xl text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-slime-green transition-colors">
                      {story.title}
                    </h3>
                    <p className="font-pixel text-xs text-white/50 mb-6 truncate italic">
                      {story.kind === 'email' ? `SENDER: ${story.source}` : `SOURCE: ${story.source}`}
                    </p>
                    <div className="mb-8 font-mono text-xs text-white/40 line-clamp-3 leading-relaxed">
                      {story.content}
                    </div>
                    <div className="mt-auto pt-4 flex gap-3">
                      <Link to={`/read/${story.id}`} className="retro-button flex-1 py-3 text-sm flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-current" /> READ
                      </Link>
                      {story.kind === 'email' && (
                        <button 
                          onClick={() => handleConvertToStory(story.id)}
                          className="border-2 border-white/10 hover:border-white px-4 transition-all text-white/60 hover:text-white"
                          title="Promote to Narrative"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
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