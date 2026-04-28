import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skull, Zap, ChevronRight, BookOpen, Ghost, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story, ZineContent } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useAuth } from '@/hooks/use-auth';
import { SubmissionHero } from '@/components/SubmissionHero';
export function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [zine, setZine] = useState<ZineContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, zineRes] = await Promise.all([
          api<{ items: Story[] }>('/api/stories'),
          api<ZineContent>('/api/zine')
        ]);
        setStories(storiesRes.items);
        setZine(zineRes);
      } catch (err) {
        toast.error('The zine failed to materialize.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const featuredStory = zine?.featuredStoryId ? stories.find(s => s.id === zine.featuredStoryId) : null;
  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-x-hidden">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-12">
          {/* PUBLIC HEADER */}
          <div className="flex justify-between items-center mb-12 md:mb-16">
            <div className="flex items-center gap-4 group cursor-default">
              <Skull className="w-8 h-8 text-slime-green group-hover:rotate-12 transition-transform" />
              <div className="font-pixel text-lg tracking-widest text-white/40 uppercase">MORALLY GRIM BROADCASTS</div>
            </div>
            <div className="flex gap-4">
              <Link to="/submit" className="font-pixel text-sm text-phantom-pink hover:text-white uppercase tracking-widest px-6 py-2 border border-phantom-pink/20 bg-phantom-pink/5 transition-all">
                SUBMIT TALE
              </Link>
              {isAuthenticated ? (
                <Link to="/crypt" className="font-pixel text-sm text-slime-green hover:text-white uppercase tracking-widest px-6 py-2 border border-slime-green/20 bg-slime-green/5 transition-all">
                  DASHBOARD
                </Link>
              ) : (
                <Link to="/login" className="font-pixel text-sm text-white/20 hover:text-white uppercase tracking-widest px-6 py-2 border border-white/5 transition-all">
                  STAFF
                </Link>
              )}
            </div>
          </div>
          {/* MAIN ZINE CONTENT */}
          {!loading && zine && (
            <section className="space-y-16 md:space-y-20 mb-20 md:mb-24">
              <div className="text-center">
                <h1 className="gothic-header text-6xl md:text-8xl lg:text-[10rem] mb-4 tracking-[0.3em] animate-pulse-glow leading-none">THE MIDNIGHT ZINE</h1>
                <p className="font-pixel text-xl md:text-2xl text-slime-green/60 uppercase tracking-[0.5em]">Issue: {new Date(zine.lastUpdated).toLocaleDateString()} // VOL. 04</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                {/* Left Side: Introit */}
                <div className="lg:col-span-4 flex flex-col gap-8 md:gap-10">
                   <div className="retro-window border-white/10 flex-1">
                      <div className="retro-window-header bg-white/10 text-white italic">Editorial Introit</div>
                      <div className="p-6 md:p-8 bg-black/60 font-mono text-base leading-relaxed text-white/50 italic space-y-6">
                        <p className="indent-8 leading-loose">"{zine.intro}"</p>
                        <div className="pt-6 border-t border-white/5 font-pixel text-xs text-slime-green tracking-widest not-italic">
                          — {zine.editorName.toUpperCase()}
                        </div>
                      </div>
                   </div>
                   <div className="retro-panel bg-phantom-pink/5 border-phantom-pink/20">
                      <h3 className="font-gothic text-xl text-phantom-pink tracking-widest uppercase mb-6">Grim Announcements</h3>
                      <ul className="space-y-4 font-pixel text-base text-white/40 tracking-widest uppercase">
                        {zine.announcements.map((a, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-phantom-pink animate-blink">»</span> {a}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
                {/* Right Side: Featured Story Card */}
                <div className="lg:col-span-8">
                  <div className="relative aspect-video lg:aspect-auto lg:h-full border-4 border-white/10 group overflow-hidden shadow-2xl">
                    <img
                      src={zine.coverImageUrl}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      alt="Zine Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-start gap-4 md:gap-6">
                      <div className="flex items-center gap-4 bg-phantom-pink px-5 py-2 text-black font-pixel text-sm uppercase tracking-widest">
                        <Zap className="w-4 h-4 fill-current" /> Featured Reading
                      </div>
                      <h2 className="font-gothic text-4xl md:text-7xl text-white tracking-widest leading-tight">
                        {featuredStory?.title || "VOID SELECTION"}
                      </h2>
                      <p className="font-mono text-lg md:text-xl text-white/70 line-clamp-2 max-w-2xl">
                        {featuredStory?.content || "The shadows remain silent this week. Check back for new unearthed chronicles."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* MASSIVE CALL TO ACTION */}
          <SubmissionHero />
          {/* MISSION SECTION */}
          <section className="py-20 md:py-32 border-t border-white/5 mt-16 md:mt-24 max-w-4xl mx-auto text-center space-y-12">
            <div className="flex justify-center gap-8 opacity-20">
              <Ghost className="w-10 h-10 md:w-12 md:h-12" />
              <Skull className="w-10 h-10 md:w-12 md:h-12" />
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h2 className="gothic-header text-4xl md:text-5xl tracking-widest text-white/40 uppercase">A Morally Grim Production</h2>
            <div className="font-mono text-lg md:text-xl text-white/30 leading-relaxed space-y-8 uppercase tracking-wider">
              <p>
                WE CURATE THE UNEXPLAINED, THE MALICIOUS, AND THE MORALLY GRIM.
                FROM LEAKED EMAILS TO FORGOTTEN ARCHIVES, THE CRYPTCASTER
                IS THE FINAL RESTING PLACE FOR THE TRUTH NO ONE WANTS TO HEAR.
              </p>
              <p className="text-slime-green/40">
                ESTABLISHED 1996 // BROADCASTING FROM THE VOID
              </p>
            </div>
          </section>
        </div>
      </div>
      <RetroFooter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}