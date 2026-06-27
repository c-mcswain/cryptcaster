import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skull, Zap, Ghost, MessageSquare, Megaphone, AlertCircle, Activity } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story, ZineContent } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import { useAuth } from '@/hooks/use-auth';
import { SubmissionHero } from '@/components/SubmissionHero';
import { cn } from '@/lib/utils';

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
    intro:
      'The sweet scent of forbidden orchards drifts through the terminal tonight, carrying the weight of a thousand unread screams. The Midnight Zine has returned to chronicle the morally grim. Stay vigilant.',
    announcements: [
      'The Shadow Market: Now accepting crypt currency',
      '(Un)Alive Reading: Time, Date, and Realm TBD',
      'Submit your chronicles or be forgotten',
      'Vampire Facial Giveaway: Win a pint of O-Negative'
    ],
    featuredStoryId: 's8',
    coverImageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    lastUpdated: Date.now(),
    editorName: 'CreepQueen',
    advertisement:
      "O-NEGATIVE ENERGY DRINK - IT’S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION."
  };

  const featuredStory = displayZine.featuredStoryId
    ? stories.find((s) => s.id === displayZine.featuredStoryId)
    : null;

  const voidCoverUrl =
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  const isBreaking = featuredStory?.title?.includes('ILLEGAL') || featuredStory?.id === 's8';

  const issueDate = new Date(displayZine.lastUpdated);
  const month = String(issueDate.getMonth() + 1).padStart(2, '0');
  const day = String(issueDate.getDate()).padStart(2, '0');
  const issueStr = `X${issueDate.getFullYear()}.${month}.${day}`;

  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-x-hidden selection:bg-slime-green selection:text-black">
      <VampiricAtmosphere />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-6 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-9 md:mb-12">
            <div className="flex items-center gap-3 group cursor-default">
              <Skull className="w-7 h-7 md:w-8 md:h-8 text-slime-green group-hover:rotate-180 transition-transform duration-700" />
              <div className="font-pixel text-xs sm:text-sm md:text-base tracking-[0.22em] md:tracking-[0.3em] text-white/40 uppercase">
                MORALLY GRIM BROADCASTS
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                to="/submit"
                className="font-pixel text-[10px] md:text-xs text-phantom-pink hover:text-white uppercase tracking-widest px-3 md:px-5 py-2 border border-phantom-pink/20 bg-phantom-pink/5 transition-all"
              >
                SUBMIT TALE
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/crypt"
                  className="font-pixel text-[10px] md:text-xs text-slime-green hover:text-white uppercase tracking-widest px-3 md:px-5 py-2 border border-slime-green/20 bg-slime-green/5 transition-all"
                >
                  DASHBOARD
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="font-pixel text-[10px] md:text-xs text-white/20 hover:text-white uppercase tracking-widest px-3 md:px-5 py-2 border border-white/5 transition-all"
                >
                  STAFF
                </Link>
              )}
            </div>
          </div>

          {!loading && (
            <section className="space-y-10 md:space-y-14 mb-12 md:mb-20">
              <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slime-green/10 to-transparent -z-10" />

                <h1 className="gothic-header text-[clamp(3rem,9vw,7.25rem)] mb-3 tracking-[0.08em] sm:tracking-[0.14em] md:tracking-[0.22em] animate-pulse-glow leading-[0.9] break-normal">
                  THE MIDNIGHT ZINE
                </h1>

                <p className="font-pixel text-xs md:text-sm text-slime-green/60 uppercase tracking-[0.22em] md:tracking-[0.36em]">
                  ISSUE: {issueStr} // VOL. 04.2
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-4 flex flex-col gap-5">
                  <div className="retro-window border-white/5 flex-1 shadow-2xl">
                    <div className="retro-window-header bg-white/5 text-white/60 italic tracking-widest">
                      Editorial_Introit.log
                    </div>

                    <div className="p-5 md:p-6 bg-black/80 font-mono text-sm md:text-base leading-[1.65] text-white/60 italic space-y-4">
                      <p className="indent-6 break-words">"{displayZine.intro}"</p>

                      <div className="pt-5 border-t border-white/5 font-pixel text-[10px] md:text-xs text-slime-green tracking-[0.24em] not-italic">
                        — {displayZine.editorName.toUpperCase()} // CHIEF ARCHIVIST
                      </div>
                    </div>
                  </div>

                  {displayZine.advertisement && (
                    <div className="retro-panel border-phantom-pink/40 bg-phantom-pink/5 group hover:bg-phantom-pink/10 transition-colors p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-4 text-phantom-pink">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
                        <span className="font-pixel text-xs md:text-sm uppercase tracking-[0.18em] font-black">
                          OFFICIAL SPONSOR
                        </span>
                      </div>

                      <p className="font-mono text-xs md:text-sm text-white/70 leading-relaxed uppercase italic break-words">
                        "{displayZine.advertisement}"
                      </p>
                    </div>
                  )}

                  <div className="retro-panel bg-black/40 border-white/5 p-5 md:p-6">
                    <h3 className="font-gothic text-lg text-phantom-pink tracking-widest uppercase mb-5">
                      Grim Announcements
                    </h3>

                    <ul className="space-y-4 font-pixel text-xs md:text-sm text-white/40 tracking-widest uppercase">
                      {displayZine.announcements.map((a, i) => (
                        <li key={i} className="flex gap-3 group cursor-default">
                          <span className="text-phantom-pink group-hover:animate-blink">»</span>
                          <span className="group-hover:text-white transition-colors">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-8 h-full">
                  <div
                    className={cn(
                      'relative aspect-[16/11] lg:aspect-[16/9] border-4 md:border-6 group overflow-hidden shadow-[0_0_70px_rgba(0,0,0,1)] transition-all duration-700',
                      isBreaking
                        ? 'border-phantom-pink/60 shadow-[0_0_40px_rgba(179,27,77,0.3)]'
                        : 'border-white/5'
                    )}
                  >
                    <img
                      src={featuredStory ? displayZine.coverImageUrl || voidCoverUrl : voidCoverUrl}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
                      alt="Zine Cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-slime-green/40 font-pixel text-[9px] md:text-[10px] text-slime-green tracking-[0.24em] z-20">
                      <Activity className="w-3 h-3 animate-pulse" /> TERMINAL_LIVE
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex flex-col items-start gap-4 md:gap-6">
                      <div className="flex flex-col gap-3">
                        {isBreaking && (
                          <div className="flex items-center gap-2 bg-blood-red border border-phantom-pink px-3 py-2 text-white font-pixel text-[10px] md:text-xs uppercase tracking-[0.28em] animate-blink w-fit shadow-[0_0_20px_rgba(179,27,77,0.5)]">
                            <AlertCircle className="w-4 h-4" /> MORALLY GRIM BULLETIN
                          </div>
                        )}

                        <div className="flex items-center gap-3 bg-phantom-pink px-4 md:px-5 py-2 text-black font-pixel text-xs md:text-sm uppercase tracking-[0.22em] shadow-lg w-fit">
                          <Zap className="w-4 h-4 fill-current" /> Featured Chronicle
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2
                          className={cn(
                            'font-gothic text-3xl md:text-5xl lg:text-6xl text-white tracking-[0.08em] leading-[1.05] uppercase transition-all duration-700',
                            isBreaking && 'text-white drop-shadow-[0_0_15px_rgba(179,27,77,0.8)]'
                          )}
                        >
                          {featuredStory?.title || 'VOID SELECTION'}
                        </h2>

                        <p className="font-mono text-sm md:text-lg text-white/60 line-clamp-4 max-w-3xl leading-[1.55]">
                          {featuredStory?.content ||
                            'The shadows remain silent this week. Check back for new unsealed chronicles.'}
                          {featuredStory?.content && ' ... [UNSEALED_DATA]'}
                        </p>
                      </div>

                      {featuredStory && (
                        <Link
                          to={isAuthenticated ? `/read/${featuredStory.id}` : '/login'}
                          className={cn(
                            'font-pixel text-sm md:text-base px-6 py-3 transition-all uppercase tracking-[0.22em] flex items-center gap-3 mt-2',
                            isBreaking
                              ? 'bg-phantom-pink text-white hover:bg-white hover:text-black animate-pulse shadow-[0_0_30px_rgba(179,27,77,0.4)]'
                              : 'bg-slime-green/5 text-slime-green border border-slime-green/40 hover:bg-slime-green hover:text-black'
                          )}
                        >
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

          <section className="py-14 md:py-24 border-t border-white/5 mt-14 md:mt-20 max-w-5xl mx-auto text-center space-y-8">
            <div className="flex justify-center gap-8 md:gap-12 opacity-10">
              <Ghost className="w-10 h-10 md:w-14 md:h-14" />
              <Skull className="w-10 h-10 md:w-14 md:h-14" />
              <MessageSquare className="w-10 h-10 md:w-14 md:h-14" />
            </div>

            <h2 className="gothic-header text-3xl md:text-5xl tracking-[0.18em] md:tracking-[0.24em] text-white/20 uppercase">
              A Morally Grim Production
            </h2>

            <div className="font-mono text-sm md:text-lg text-white/30 leading-relaxed space-y-6 uppercase tracking-widest max-w-3xl mx-auto px-6">
              <p>
                CURATING THE UNEXPLAINED, THE MALICIOUS, AND THE MORALLY GRIM. THE CRYPTCASTER IS
                THE FINAL RESTING PLACE FOR THE TRUTH NO ONE WANTS TO HEAR.
              </p>

              <div className="pt-6 flex flex-col gap-2">
                <span className="text-slime-green/30 text-xs md:text-sm tracking-[0.35em] md:tracking-[0.5em]">
                  ESTABLISHED 1996 // TERMINAL_ACTIVE
                </span>
                <span className="text-white/10 text-[10px] tracking-[0.7em] md:tracking-[1em]">
                  BROADCASTING FROM SECTOR 0-V
                </span>
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
