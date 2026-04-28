import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Plus, Play, CheckCircle, Skull, X, Minus, Square } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
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
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-16 text-center">
            <div className="inline-block relative">
              <h1 className="font-creepy text-7xl md:text-9xl text-slime-green animate-neon-flicker mb-2">
                INVITE ME IN
              </h1>
              <div className="font-pixel text-xl md:text-2xl text-hot-pink tracking-widest uppercase">
                PRESENTED BY MORALLY GRIM
              </div>
              <Skull className="absolute -top-12 -left-12 w-16 h-16 text-slime-green/20 -rotate-12" />
              <Skull className="absolute -bottom-8 -right-12 w-16 h-16 text-hot-pink/20 rotate-12" />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link to="/add" className="retro-button-pink flex items-center gap-2 text-xl px-8">
                <Plus className="w-6 h-6" /> INGEST NEW TALE
              </Link>
            </div>
          </header>
          <div className="flex gap-4 mb-10 font-pixel text-lg justify-center md:justify-start">
            {(['all', 'unread', 'recorded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 border-4 transition-all active:scale-95 ${
                  filter === f 
                    ? 'bg-slime-green text-black border-slime-green shadow-retro' 
                    : 'border-slime-green text-slime-green hover:bg-slime-green/10'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 border-8 border-slime-green border-t-transparent animate-spin" />
              <div className="text-center font-pixel text-2xl text-slime-green animate-pulse">SUMMONING DATA...</div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="retro-panel text-center py-24 border-dashed opacity-80">
              <Ghost className="w-24 h-24 mx-auto mb-6 text-hot-pink animate-bounce" />
              <p className="text-4xl font-creepy text-hot-pink">THE CRYPT IS EMPTY...</p>
              <p className="font-pixel text-xl mt-4 text-slime-green">NOTHING HAS BEEN INVITED IN YET.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredStories.map((story) => (
                <div key={story.id} className="retro-window group hover:-translate-y-2 transition-all duration-300">
                  <div className="retro-window-header">
                    <span className="truncate pr-2">TALE_ID_{story.id.slice(0, 4)}</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-black/20"><Minus className="w-full h-full" /></div>
                      <div className="w-3 h-3 bg-black/20"><Square className="w-full h-full" /></div>
                      <div className="w-3 h-3 bg-black/40"><X className="w-full h-full" /></div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full bg-black/40 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-pixel text-xs text-hot-pink border-2 border-hot-pink px-2 py-1">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      {story.isRecorded ? (
                        <div className="flex items-center gap-1 text-slime-green font-pixel text-xs border-2 border-slime-green px-2 py-1">
                          <CheckCircle className="w-3 h-3" /> RECORDED
                        </div>
                      ) : (
                        <div className="text-hot-pink font-pixel text-xs animate-pulse px-2 py-1 border-2 border-hot-pink">
                          PENDING
                        </div>
                      )}
                    </div>
                    <h3 className="font-creepy text-3xl mb-3 text-white group-hover:text-slime-green transition-colors">
                      {story.title}
                    </h3>
                    <p className="font-pixel text-sm text-hot-pink mb-4 italic">
                      SENDER: {story.source}
                    </p>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-foreground/70 line-clamp-4 mb-8 leading-relaxed">
                        {story.content}
                      </p>
                    </div>
                    <Link
                      to={`/read/${story.id}`}
                      className="retro-button w-full flex items-center justify-center gap-3 mt-auto text-lg"
                    >
                      <Play className="w-5 h-5 fill-current" /> ENTER PROMPTER
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