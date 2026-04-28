import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skull, Zap, BookOpen, Ghost, MessageSquare, Megaphone } from 'lucide-react';
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
  const displayZine = zine || {
    intro: 'The terminal flickers with the weight of unspeakable records...',
    announcements: [
      "The Shadow Market: Now accepting crypt currency",
      "(Un)Alive Reading: Time, Date, and Realm TBD",
      "Submit your chronicles or be forgotten",
      "Vampire Facial Giveaway: Win a pint of O-Negative"
    ],
    featuredStoryId: null,
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    lastUpdated: Date.now(),
    editorName: 'CreepQueen',
    advertisement: "O-NEGATIVE ENERGY DRINK - IT’S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION."
  };
  const featuredStory = displayZine.featuredStoryId ? stories.find(s => s.id === displayZine.featuredStoryId) : null;
  const issueDate = new Date(displayZine.lastUpdated);
  const month = String(issueDate.getMonth() + 1).padStart(2, '0');
  const day = String(issueDate.getDate()).padStart(2, '0');
  const issueStr = `X${issueDate.getFullYear()}.${month}.${day}`;
  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-x-hidden selection:bg-slime-green selection:text-black">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-8 md:py-12">
          {/* PUBLIC HEADER */}
          <div className="flex justify-between items-center mb-12 md:mb-16">
            <div className="flex items-center gap-4 group cursor-default">
              <Skull className="w-8 h-8 text-slime-green group-hover:rotate-180 transition-transform duration-700" />
              <div className="font-pixel text-base md:text-lg tracking-[0.3em] text-white/40 uppercase">MORALLY GRIM BROADCASTS</div>
            </div>
            <div className="flex gap-4">
              <Link to="/submit" className="font-pixel text-xs md:text-sm text-phantom-pink hover:text-white uppercase tracking-widest px-4 md:px-6 py-2 border border-phantom-pink/20 bg-phantom-pink/5 transition-all">
                SUBMIT TALE
              </Link>
              {isAuthenticated ? (
                <Link to="/crypt" className="font-pixel text-xs md:text-sm text-slime-green hover:text-white uppercase tracking-widest px-4 md:px-6 py-2 border border-slime-green/20 bg-slime-green/5 transition-all">
                  DASHBOARD
                </Link>
              ) : (
                <Link to="/login" className="font-pixel text-xs md:text-sm text-white/20 hover:text-white uppercase tracking-widest px-4 md:px-6 py-2 border border-white/5 transition-all">
                  STAFF
                </Link>
              )}
            </div>
          </div>
          {/* MAIN ZINE CONTENT */}
          {!loading && (
            <section className="space-y-16 md:space-y-24 mb-20 md:mb-32">
              <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slime-green/10 to-transparent -z-10" />
                <h1 className="gothic-header text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] mb-4 tracking-[0.1em] md:tracking-[0.4em] animate-pulse-glow leading-none break-normal">
                  THE MIDNIGHT ZINE
                </h1>
                <p className="font-pixel text-lg md:text-2xl text-slime-green/60 uppercase tracking-[0.3em] md:tracking-[0.6em]">
                  ISSUE: {issueStr} // VOL. 04.2
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-start">
                {/* Left Side: Introit & Ad */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                   <div className="retro-window border-white/5 flex-1 shadow-2xl">
                      <div className="retro-window-header bg-white/5 text-white/60 italic tracking-widest">Editorial_Introit.log</div>
                      <div className="p-6 md:p-10 bg-black/80 font-mono text-base md:text-lg leading-[1.8] text-white/60 italic space-y-6">
                        <p className="indent-8 break-words">"{displayZine.intro}"</p>
                        <div className="pt-8 border-t border-white/5 font-pixel text-xs text-slime-green tracking-[0.3em] not-italic">
                          — {displayZine.editorName.toUpperCase()} // CHIEF ARCHIVIST
                        </div>
                      </div>
                   </div>
                   {displayZine.advertisement && (
                    <div className="retro-panel border-phantom-pink/40 bg-phantom-pink/5 group hover:bg-phantom-pink/10 transition-colors">
                      <div className="flex items-center gap-3 mb-4 text-phantom-pink">
                        <Megaphone className="w-5 h-5 animate-bounce" />
                        <span className="font-pixel text-sm uppercase tracking-[0.2em] font-black">OFFICIAL SPONSOR</span>
                      </div>
                      <p className="font-mono text-sm text-white/70 leading-relaxed uppercase italic break-words">
                        "{displayZine.advertisement}"
                      </p>
                    </div>
                   )}
                   <div className="retro-panel bg-black/40 border-white/5 p-8">
                      <h3 className="font-gothic text-xl text-phantom-pink tracking-widest uppercase mb-8">Grim Announcements</h3>
                      <ul className="space-y-6 font-pixel text-base text-white/40 tracking-widest uppercase">
                        {displayZine.announcements.map((a, i) => (
                          <li key={i} className="flex gap-4 group cursor-default">
                            <span className="text-phantom-pink group-hover:animate-blink">»</span>
                            <span className="group-hover:text-white transition-colors">{a}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
                {/* Right Side: Featured Story Card */}
                <div className="lg:col-span-8 h-full">
                  <div className="relative aspect-video lg:aspect-[4/3] border-4 md:border-8 border-white/5 group overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                    <img
                      src={displayZine.coverImageUrl}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
                      alt="Zine Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 flex flex-col items-start gap-6 md:gap-10">
                      <div className="flex items-center gap-4 bg-phantom-pink px-6 py-2 text-black font-pixel text-sm uppercase tracking-[0.3em] shadow-lg">
                        <Zap className="w-4 h-4 fill-current" /> Featured Chronicle
                      </div>
                      <div className="space-y-4">
                        <h2 className="font-gothic text-4xl md:text-8xl text-white tracking-[0.1em] leading-none uppercase">
                          {featuredStory?.title || "VOID SELECTION"}
                        </h2>
                        <p className="font-mono text-lg md:text-2xl text-white/50 line-clamp-3 max-w-3xl leading-relaxed">
                          {featuredStory?.content || "The shadows remain silent this week. Check back for new unsealed chronicles."}
                          {featuredStory?.content && " ... [UNSEALED]"}
                        </p>
                      </div>
                      {featuredStory && (
                        <Link to={`/read/${featuredStory.id}`} className="font-pixel text-lg text-slime-green border border-slime-green/40 px-8 py-3 bg-slime-green/5 hover:bg-slime-green hover:text-black transition-all uppercase tracking-[0.3em]">
                          ACCESS FULL RECORD
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          <SubmissionHero />
          {/* MISSION SECTION */}
          <section className="py-24 md:py-40 border-t border-white/5 mt-24 md:mt-32 max-w-5xl mx-auto text-center space-y-16">
            <div className="flex justify-center gap-12 md:gap-20 opacity-10">
              <Ghost className="w-12 h-12 md:w-20 md:h-20" />
              <Skull className="w-12 h-12 md:w-20 md:h-20" />
              <MessageSquare className="w-12 h-12 md:w-20 md:h-20" />
            </div>
            <h2 className="gothic-header text-4xl md:text-6xl tracking-[0.3em] text-white/20 uppercase">A Morally Grim Production</h2>
            <div className="font-mono text-lg md:text-2xl text-white/30 leading-relaxed space-y-10 uppercase tracking-widest max-w-3xl mx-auto px-6">
              <p>
                CURATING THE UNEXPLAINED, THE MALICIOUS, AND THE MORALLY GRIM.
                THE CRYPTCASTER IS THE FINAL RESTING PLACE FOR THE TRUTH NO ONE WANTS TO HEAR.
              </p>
              <div className="pt-10 flex flex-col gap-2">
                <span className="text-slime-green/30 text-sm tracking-[0.5em]">ESTABLISHED 1996 // TERMINAL_ACTIVE</span>
                <span className="text-white/10 text-[10px] tracking-[1em]">BROADCASTING FROM SECTOR 0-V</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <RetroFooter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}