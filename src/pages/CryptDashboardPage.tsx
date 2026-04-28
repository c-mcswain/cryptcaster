import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Skull, Trash2, Zap, Mail, ChevronRight, Newspaper, LogOut, Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function CryptDashboardPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | 'story' | 'email' | 'submission'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'recorded'>('all');
  const { logout } = useAuth();
  const fetchData = useCallback(async () => {
    try {
      const storiesRes = await api<{ items: Story[] }>('/api/stories');
      setStories([...storiesRes.items].sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      toast.error('Failed to summon archives from the void.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Are you certain you wish to purge this record from the crypt?')) return;
    try {
      await api(`/api/stories/${id}`, { method: 'DELETE' });
      toast.success('Record incinerated.');
      setStories(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      toast.error('Failed to purge record.');
    }
  };
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
    const isInbox = s.kind === 'email' || s.kind === 'submission';
    const matchesKind =
      kindFilter === 'all' ||
      (kindFilter === 'email' ? isInbox : s.kind === kindFilter);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? !s.isRecorded : s.isRecorded);
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKind && matchesStatus && matchesSearch;
  });
  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-12">
          {/* STAFF HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4 group">
                <Skull className="w-10 h-10 text-slime-green group-hover:rotate-12 transition-transform" />
                <h1 className="gothic-header text-4xl md:text-5xl tracking-widest text-white">CRYPT DASHBOARD</h1>
              </div>
              <p className="font-pixel text-sm text-slime-green/60 uppercase tracking-[0.3em]">Authorized Access // Staff Identity: CreepQueen</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/zine-admin" className="retro-button text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4" /> EDIT ZINE
              </Link>
              <Link to="/add" className="retro-button-pink text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> INGEST TALE
              </Link>
              <button onClick={logout} className="border border-white/10 hover:border-phantom-pink/40 px-4 py-2 font-pixel text-xs text-white/40 hover:text-phantom-pink transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" /> LOGOUT
              </button>
            </div>
          </div>
          {/* SEARCH & FILTERS BAR */}
          <div className="space-y-6 mb-16 border-y border-white/5 py-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="SEARCH THE ARCHIVES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-noir-gray/50 border border-white/10 p-4 pl-12 text-white font-mono placeholder:text-white/10 focus:border-slime-green outline-none transition-all"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-black/60 border border-white/5 rounded-sm font-pixel">
                {(['all', 'story', 'email'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setKindFilter(k)}
                    className={cn(
                      "px-6 md:px-10 py-2.5 transition-all text-sm tracking-widest whitespace-nowrap uppercase",
                      kindFilter === k ? "bg-slime-green text-black" : "text-white/40 hover:text-white"
                    )}
                  >
                    {k === 'email' ? 'INBOX' : k}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 md:gap-6 font-pixel text-base">
                {(['all', 'unread', 'recorded'] as const).map(s => (
                  <button
                    key={s} onClick={() => setStatusFilter(s)}
                    className={cn("border-b-2 px-4 md:px-6 py-2 transition-colors uppercase tracking-widest", statusFilter === s ? "border-phantom-pink text-phantom-pink" : "border-transparent text-white/30 hover:text-white/60")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* ARCHIVE GRID */}
          {loading ? (
            <div className="py-32 text-center font-gothic text-3xl animate-pulse tracking-widest opacity-40 uppercase text-white">Unsealing Archives...</div>
          ) : filteredStories.length === 0 ? (
            <div className="retro-panel py-48 text-center border-dashed border-white/10 bg-black/20">
              <p className="font-gothic text-6xl mb-6 text-white/10 uppercase">Void_Empty</p>
              <p className="font-pixel text-2xl text-white/5 tracking-[0.3em] uppercase">No narratives found in this sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {filteredStories.map((story) => (
                <div key={story.id} className={cn("retro-window group transition-all duration-500 hover:border-white/20", (story.kind === 'email' || story.kind === 'submission') ? "border-phantom-pink/20" : "border-slime-green/20")}>
                  <div className={cn("retro-window-header opacity-80", (story.kind === 'email' || story.kind === 'submission') ? "bg-phantom-pink" : "bg-slime-green")}>
                    <div className="flex items-center gap-3">
                      {(story.kind === 'email' || story.kind === 'submission') ? <Mail className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span className="font-pixel text-xs truncate uppercase tracking-tighter">
                        {story.kind?.toUpperCase() || 'NARR'}_REC_{story.id.slice(0, 6)}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteStory(story.id)} className="hover:text-black hover:bg-white/20 p-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                    <h3 className="font-gothic text-2xl text-white mb-4 line-clamp-2 min-h-[4rem] group-hover:text-slime-green transition-colors leading-relaxed">
                      {story.title}
                    </h3>
                    <p className="font-pixel text-xs text-white/40 mb-8 truncate tracking-wider uppercase">
                      {story.kind === 'story' ? `SOURCE: ${story.source}` : `SENDER: ${story.source}`}
                    </p>
                    <div className="mb-10 font-mono text-sm text-white/30 line-clamp-3 leading-relaxed h-[4.5rem]">
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
                                className="border border-white/5 hover:border-slime-green/40 bg-noir-gray/50 px-5 transition-all text-white/30 hover:text-slime-green group/zap"
                              >
                                <Zap className="w-5 h-5 group-hover/zap:fill-slime-green" />
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