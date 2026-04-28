import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Play, CheckCircle, Skull, X, Minus, Square, Moon, Zap } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
export function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'recorded'>('all');
  const fetchStories = async () => {
    try {
      const response = await api<{ items: Story[] }>('/api/stories');
      setStories(response.items.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error(err);
      toast.error('Failed to summon stories from the void.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStories();
  }, []);
  const filteredStories = stories.filter(s => {
    if (filter === 'unread') return !s.isRecorded;
    if (filter === 'recorded') return s.isRecorded;
    return true;
  });
  return (
    <div className="min-h-screen flex flex-col relative bg-nocturnal-purple/20">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10">
        <div className="py-12 md:py-16 lg:py-20">
          <header className="mb-20 text-center">
            <div className="inline-block relative">
              <h1 className="gothic-header text-6xl md:text-8xl lg:text-9xl mb-4 animate-pulse-glow">
                INVITE ME IN
              </h1>
              <div className="font-pixel text-xl md:text-2xl text-phantom-pink tracking-[0.3em] uppercase opacity-90">
                A MORALLY GRIM BROADCAST
              </div>
              <div className="absolute -top-16 -left-16 opacity-30">
                <Moon className="w-24 h-24 text-white rotate-[-15deg]" />
              </div>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8">
              <Link to="/add" className="retro-button-pink flex items-center gap-3 text-2xl px-10 py-4 group transition-all">
                <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform" /> 
                <span className="font-gothic">Ingest Tale</span>
              </Link>
            </div>
          </header>
          <div className="flex flex-wrap gap-4 mb-12 font-pixel text-lg justify-center md:justify-start">
            {(['all', 'unread', 'recorded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-2 border-2 transition-all active:scale-95 ${
                  filter === f
                    ? 'bg-slime-green text-black border-slime-green shadow-retro'
                    : 'border-slime-green/40 text-slime-green/60 hover:border-slime-green hover:text-slime-green'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="w-16 h-16 border-4 border-blood-red border-t-slime-green animate-spin rounded-full" />
              <div className="text-center font-gothic text-2xl text-white tracking-widest animate-pulse">SUMMONING FROM THE VOID</div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="retro-panel text-center py-32 border-dashed border-slime-green/20 bg-nocturnal-purple/40">
              <Zap className="w-20 h-20 mx-auto mb-6 text-phantom-pink/40" />
              <p className="text-5xl font-gothic text-white/20">EMPTY CRYPT</p>
              <p className="font-pixel text-xl mt-6 text-slime-green/40">NO SOULS HAVE BEEN INVITED IN YET.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredStories.map((story) => (
                <div key={story.id} className="retro-window group hover:border-white transition-all duration-500">
                  <div className="retro-window-header group-hover:bg-white group-hover:text-black transition-colors">
                    <span className="font-pixel text-sm">ARCHIVE_{story.id.slice(0, 6)}</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 border border-black/20 flex items-center justify-center opacity-50"><Minus className="w-3 h-3" /></div>
                      <div className="w-4 h-4 border border-black/20 flex items-center justify-center opacity-50"><Square className="w-3 h-3" /></div>
                      <div className="w-4 h-4 border border-black/20 flex items-center justify-center bg-black/10"><X className="w-3 h-3" /></div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col h-full bg-gradient-to-b from-black/60 to-nocturnal-purple/80">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-pixel text-xs text-phantom-pink tracking-widest border border-phantom-pink/30 px-3 py-1">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      {story.isRecorded ? (
                        <div className="flex items-center gap-1.5 text-slime-green font-pixel text-xs">
                          <CheckCircle className="w-4 h-4" /> ARCHIVED
                        </div>
                      ) : (
                        <div className="text-white font-pixel text-xs animate-pulse flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blood-red rounded-full animate-ping" /> PENDING
                        </div>
                      )}
                    </div>
                    <h3 className="font-gothic text-3xl mb-4 text-white group-hover:text-slime-green transition-colors leading-tight">
                      {story.title}
                    </h3>
                    <p className="font-pixel text-sm text-phantom-pink/80 mb-6 italic border-l-2 border-phantom-pink/20 pl-3">
                      SENDER: {story.source}
                    </p>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-foreground/60 line-clamp-3 mb-10 leading-relaxed group-hover:text-foreground/90 transition-colors">
                        {story.content}
                      </p>
                    </div>
                    <Link
                      to={`/read/${story.id}`}
                      className="retro-button w-full flex items-center justify-center gap-3 mt-auto text-xl py-3 group/btn"
                    >
                      <Play className="w-5 h-5 fill-current group-hover/btn:scale-110 transition-transform" /> 
                      <span className="font-gothic">Open Tome</span>
                    </Link>
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