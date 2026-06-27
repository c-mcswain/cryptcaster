import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Skull,
  Zap,
  Ghost,
  MessageSquare,
  Megaphone,
  AlertCircle,
  Activity,
  BookOpen,
} from 'lucide-react';

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
          api<ZineContent>('/api/zine'),
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
      'Another evening, another inbox full of ghoulish complaints from humans who insist they are “probably not haunted,” which is exactly what haunted people say. The Cryptcaster terminal is open, the void is behaving poorly, and I remain deeply invested in the wellbeing of mortals for normal, unsuspicious reasons.',
    announcements: [
      'The Cryptcaster inbox is accepting spooky complaints, haunted gossip, and suspiciously specific human problems.',
      'The current issue is being assembled by candlelight, static, and questionable judgment.',
      'Phantom friends are encouraged to submit chronicles before the void gets bored.',
    ],
    featuredStoryId: null,
    coverImageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    lastUpdated: Date.now(),
    editorName: 'Vamp Von Vixen',
    advertisement:
      "O-NEGATIVE ENERGY DRINK — IT’S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION.",
  };

  const featuredStory = displayZine.featuredStoryId
    ? stories.find((s) => s.id === displayZine.featuredStoryId)
    : null;

  const voidCoverUrl =
    displayZine.coverImageUrl ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  const isBreaking =
    Boolean(featuredStory?.title?.includes('ILLEGAL')) ||
    featuredStory?.id === 's8';

  const issueDate = new Date(displayZine.lastUpdated);
  const month = String(issueDate.getMonth() + 1).padStart(2, '0');
  const day = String(issueDate.getDate()).padStart(2, '0');
  const issueStr = `X${issueDate.getFullYear()}.${month}.${day}`;

  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-x-hidden selection:bg-slime-green selection:text-black">
      <VampiricAtmosphere />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8 md:mb-10">
            <div className="flex items-center gap-4 group cursor-default">
              <Skull className="w-7 h-7 md:w-8 md:h-8 text-slime-green group-hover:rotate-180 transition-transform duration-700" />

              <div className="font-pixel text-sm md:text-base tracking-[0.22em] md:tracking-[0.3em] text-white/48 uppercase">
                Morally Grim Broadcasts
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/submit"
                className="font-pixel text-sm md:text-base text-phantom-pink hover:text-white uppercase tracking-widest px-4 md:px-5 py-2 border border-phantom-pink/20 bg-phantom-pink/5 transition-all"
              >
                Submit Tale
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/crypt"
                  className="font-pixel text-sm md:text-base text-slime-green hover:text-white uppercase tracking-widest px-4 md:px-5 py-2 border border-slime-green/20 bg-slime-green/5 transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="font-pixel text-sm md:text-base text-white/35 hover:text-white uppercase tracking-widest px-4 md:px-5 py-2 border border-white/10 transition-all"
                >
                  Staff
                </Link>
              )}
            </div>
          </div>

          {!loading && (
            <section className="space-y-8 md:space-y-10 mb-10 md:mb-12">
              <div className="text-center relative max-w-6xl mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slime-green/10 to-transparent -z-10" />

                <p className="font-pixel text-sm md:text-base text-phantom-pink/72 uppercase tracking-[0.3em] md:tracking-[0.42em] mb-4">
                  Current Issue
                </p>

                <h1 className="gothic-header text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5 tracking-[0.08em] md:tracking-[0.13em] animate-pulse-glow leading-[0.96] break-normal">
                  THE MIDNIGHT ZINE
                </h1>

                <p className="font-pixel text-xl md:text-3xl text-slime-green/86 uppercase tracking-[0.16em] md:tracking-[0.28em] leading-relaxed">
                  ISSUE: {issueStr} // VOL. 04.2
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 md:gap-9 items-stretch">
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="retro-window border-white/5 flex-1 shadow-2xl">
                    <div className="retro-window-header bg-white/5 text-white/68 italic tracking-widest">
                      Editorial_Introit.log
                    </div>

                    <div className="p-6 md:p-7 bg-black/80 font-mono text-base md:text-lg leading-[1.62] text-white/72 italic space-y-5">
                      <p className="indent-6 break-words">
                        “{displayZine.intro}”
                      </p>

                      <div className="pt-5 border-t border-white/5 font-pixel text-sm text-slime-green/90 tracking-[0.16em] not-italic leading-relaxed">
                        — {displayZine.editorName.toUpperCase()} // CHIEF
                        ARCHIVIST
                      </div>
                    </div>
                  </div>

                  {displayZine.advertisement && (
                    <div className="retro-panel border-phantom-pink/40 bg-phantom-pink/5 group hover:bg-phantom-pink/10 transition-colors">
                      <div className="flex items-center gap-3 mb-4 text-phantom-pink">
                        <Megaphone className="w-5 h-5 animate-bounce" />

                        <span className="font-pixel text-base uppercase tracking-[0.16em] font-black">
                          Official Sponsor
                        </span>
                      </div>

                      <p className="font-mono text-base text-white/78 leading-7 uppercase italic break-words">
                        “{displayZine.advertisement}”
                      </p>
                    </div>
                  )}

                  <div className="retro-panel bg-black/40 border-white/5 p-6 md:p-7">
                    <h3 className="font-gothic text-2xl text-phantom-pink tracking-widest uppercase mb-5">
                      Grim Announcements
                    </h3>

                    <ul className="space-y-4 font-pixel text-base md:text-lg text-white/55 tracking-widest uppercase leading-relaxed">
                      {displayZine.announcements.map((announcement, index) => (
                        <li
                          key={index}
                          className="flex gap-4 group cursor-default"
                        >
                          <span className="text-phantom-pink group-hover:animate-blink">
                            »
                          </span>

                          <span className="group-hover:text-white transition-colors">
                            {announcement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-8 h-full">
                  <div
                    className={cn(
                      'relative min-h-[390px] md:min-h-[460px] lg:min-h-full border-4 md:border-6 group overflow-hidden shadow-[0_0_55px_rgba(0,0,0,1)] transition-all duration-700 bg-black/80',
                      isBreaking
                        ? 'border-phantom-pink/60 shadow-[0_0_36px_rgba(179,27,77,0.28)]'
                        : 'border-white/8',
                    )}
                  >
                    <img
                      src={
                        featuredStory
                          ? displayZine.coverImageUrl || voidCoverUrl
                          : voidCoverUrl
                      }
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-14 group-hover:grayscale-0 group-hover:opacity-38 transition-all duration-[2000ms] scale-105 group-hover:scale-100"
                      alt="Zine Cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/76 to-black/42" />

                    <div className="absolute top-5 md:top-7 right-5 md:right-7 flex items-center gap-3 px-4 py-1.5 bg-black/82 border border-slime-green/40 font-pixel text-xs text-slime-green tracking-[0.22em] z-20">
                      <Activity className="w-3 h-3 animate-pulse" />
                      TERMINAL_LIVE
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-8">
                      <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-white" />
                    </div>

                    <div className="relative z-10 min-h-[390px] md:min-h-[460px] h-full p-6 md:p-9 lg:p-10 flex flex-col justify-end">
                      <div className="max-w-4xl space-y-5">
                        <div className="flex flex-col gap-3">
                          {isBreaking && (
                            <div className="flex items-center gap-3 bg-blood-red border border-phantom-pink px-4 py-2 text-white font-pixel text-xs md:text-sm uppercase tracking-[0.25em] animate-blink w-fit shadow-[0_0_20px_rgba(179,27,77,0.5)]">
                              <AlertCircle className="w-4 h-4" />
                              MORALLY GRIM BULLETIN
                            </div>
                          )}

                          <div className="flex items-center gap-3 bg-phantom-pink px-5 py-2 text-black font-pixel text-sm md:text-base uppercase tracking-[0.18em] shadow-lg w-fit">
                            <Zap className="w-4 h-4 fill-current" />
                            Featured Chronicle
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h2
                            className={cn(
                              'font-gothic text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] text-white tracking-[0.055em] md:tracking-[0.07em] leading-[1.05] uppercase transition-all duration-700 max-w-4xl',
                              isBreaking &&
                                'text-white drop-shadow-[0_0_15px_rgba(179,27,77,0.8)]',
                              !featuredStory && 'text-white/78',
                            )}
                          >
                            {featuredStory?.title ||
                              'Awaiting This Issue’s Feature'}
                          </h2>

                          <p className="font-mono text-base md:text-xl text-white/72 line-clamp-4 max-w-4xl leading-[1.52]">
                            {featuredStory?.content ||
                              'The Cryptcaster terminal is open, the inbox is humming, and the current featured chronicle has not yet been unsealed. Suspicious? Obviously.'}

                            {featuredStory?.content && ' ... [UNSEALED_DATA]'}
                          </p>
                        </div>

                        {featuredStory ? (
                          <Link
                            to={
                              isAuthenticated
                                ? `/read/${featuredStory.id}`
                                : '/login'
                            }
                            className={cn(
                              'font-pixel text-base md:text-lg px-7 md:px-9 py-4 transition-all uppercase tracking-[0.2em] flex items-center gap-4 w-fit mt-1',
                              isBreaking
                                ? 'bg-phantom-pink text-white hover:bg-white hover:text-black animate-pulse shadow-[0_0_30px_rgba(179,27,77,0.4)]'
                                : 'bg-slime-green/5 text-slime-green border border-slime-green/40 hover:bg-slime-green hover:text-black',
                            )}
                          >
                            ACCESS FULL RECORD
                          </Link>
                        ) : (
                          <Link
                            to="/submit"
                            className="font-pixel text-sm md:text-base px-6 md:px-8 py-4 transition-all uppercase tracking-[0.2em] flex items-center gap-4 w-fit mt-1 bg-slime-green/5 text-slime-green border border-slime-green/35 hover:bg-slime-green hover:text-black"
                          >
                            SUBMIT A CHRONICLE
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <SubmissionHero />

          <section className="pt-6 md:pt-7 pb-7 md:pb-8 border-t border-white/10 mt-4 md:mt-5 max-w-5xl mx-auto text-center">
            <div className="flex justify-center gap-8 md:gap-12 mb-5 md:mb-6">
              <Ghost className="w-11 h-11 md:w-14 md:h-14 text-slime-green/58 drop-shadow-[0_0_18px_rgba(40,167,69,0.58)]" />
              <Skull className="w-11 h-11 md:w-14 md:h-14 text-phantom-pink/62 drop-shadow-[0_0_18px_rgba(179,27,77,0.58)]" />
              <MessageSquare className="w-11 h-11 md:w-14 md:h-14 text-white/45 drop-shadow-[0_0_18px_rgba(255,255,255,0.24)]" />
            </div>

            <h2 className="gothic-header text-4xl md:text-5xl tracking-[0.13em] md:tracking-[0.17em] text-white/92 uppercase leading-none mb-5">
              A Morally Grim Production
            </h2>

            <div className="font-mono text-base md:text-lg text-white/62 leading-snug uppercase tracking-[0.1em] md:tracking-[0.14em] max-w-3xl mx-auto px-6">
              <p>
                CURATING THE UNEXPLAINED, THE MALICIOUS, AND THE MORALLY GRIM.
                THE CRYPTCASTER IS THE FINAL RESTING PLACE FOR THE TRUTH NO ONE
                WANTS TO HEAR.
              </p>

              <div className="pt-5 flex flex-col gap-2 font-pixel leading-tight">
                <span className="text-slime-green/72 text-base md:text-lg tracking-[0.18em] md:tracking-[0.22em]">
                  ESTABLISHED 1996 // TERMINAL_ACTIVE
                </span>

                <span className="text-white/52 text-sm md:text-base tracking-[0.2em] md:tracking-[0.24em]">
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
