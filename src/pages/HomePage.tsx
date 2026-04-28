import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Plus, Play, CheckCircle, FileText } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="mb-12 text-center">
          <h1 className="font-creepy text-6xl md:text-8xl text-slime-green glow-text mb-4 animate-pulse">
            WELCOME TO THE CRYPT
          </h1>
          <p className="font-pixel text-xl text-hot-pink">YOUR HUB FOR SPOOKY BROADCASTS</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/add" className="retro-button-pink flex items-center gap-2">
              <Plus className="w-5 h-5" /> ADD NEW TALE
            </Link>
          </div>
        </header>
        <div className="flex gap-4 mb-8 font-pixel text-lg justify-center md:justify-start overflow-x-auto pb-2">
          {(['all', 'unread', 'recorded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 border-2 transition-colors whitespace-nowrap ${
                filter === f ? 'bg-slime-green text-black border-slime-green' : 'border-slime-green text-slime-green'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center font-creepy text-4xl animate-bounce mt-20">Summoning data...</div>
        ) : filteredStories.length === 0 ? (
          <div className="retro-panel text-center py-20">
            <Ghost className="w-20 h-20 mx-auto mb-4 text-hot-pink animate-float" />
            <p className="text-2xl font-creepy">THE CRYPT IS EMPTY...</p>
            <p className="font-pixel mt-2">ADD A STORY TO GET STARTED</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div key={story.id} className="retro-panel group hover:scale-[1.02] transition-transform flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-pixel text-xs text-hot-pink border border-hot-pink px-2 py-0.5">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                  {story.isRecorded && <CheckCircle className="w-5 h-5 text-slime-green" />}
                </div>
                <h3 className="font-creepy text-3xl mb-2 group-hover:text-hot-pink transition-colors">
                  {story.title}
                </h3>
                <p className="font-pixel text-sm text-muted-foreground mb-4 line-clamp-1 italic">
                  From: {story.source}
                </p>
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground/80 line-clamp-3 mb-6">
                    {story.content}
                  </p>
                </div>
                <Link 
                  to={`/read/${story.id}`}
                  className="retro-button w-full flex items-center justify-center gap-2 mt-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> READ NOW
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}