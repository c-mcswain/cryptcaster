import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Maximize2, Minimize2, Eye, Play, Pause, RotateCcw, Share2, Settings2, Sliders, Skull } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
import { wordCount, estimateReadTime } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [fontSize, setFontSize] = useState(42);
  const [isRecording, setIsRecording] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  // Auto-scroll state
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5); // 1 to 20
  const requestRef = useRef<number>();
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (id) {
      api<Story>(`/api/stories/${id}`)
        .then(setStory)
        .catch(() => toast.error('Story lost in the void'));
    }
  }, [id]);
  const animate = useCallback(() => {
    const element = document.documentElement;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const currentScroll = element.scrollTop;
    if (isScrolling) {
      // Check if we reached the end to stop scrolling automatically
      if (currentScroll < totalHeight - 20) {
        window.scrollBy(0, scrollSpeed / 5);
      } else {
        setIsScrolling(false);
      }
    }
    setScrollProgress(totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0);
    requestRef.current = requestAnimationFrame(animate);
  }, [isScrolling, scrollSpeed]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
  // Keyboard controls - critical for distraction-free reading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsScrolling(prev => !prev);
      }
      if (e.code === 'Escape') {
        setStealthMode(false);
      }
      if (e.code === 'BracketRight') {
        setFontSize(s => Math.min(96, s + 4));
      }
      if (e.code === 'BracketLeft') {
        setFontSize(s => Math.max(16, s - 4));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const generateReport = useCallback(() => {
    if (!story) return '';
    const now = new Date().toLocaleString();
    const words = wordCount(story.content);
    return `--- INVITE ME IN: BROADCAST REPORT ---
Title: ${story.title.toUpperCase()}
Source: ${story.source.toUpperCase()}
Timestamp: ${now}
Word Count: ${words}
Est. Duration: ${estimateReadTime(story.content)}
Status: ${isRecording ? 'RECORDED' : 'READ ONLY'}
Archive ID: ${story.id}
---------------------------------------`;
  }, [story, isRecording]);
  const handleShare = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report);
    toast.success('Session report copied to clipboard.');
  };
  const markRecorded = async () => {
    if (!id) return;
    try {
      await api(`/api/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRecorded: true })
      });
      handleShare();
      toast.success('Tale archived in the permanent crypt!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to seal the archive');
    }
  };
  if (!story) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-black">
      <div className="w-16 h-16 border-4 border-blood-red border-t-white animate-spin rounded-full" />
      <div className="font-gothic text-4xl text-white tracking-[0.2em] animate-pulse">INVITING SCRIPT...</div>
    </div>
  );
  return (
    <div className={`bg-[#020005] min-h-screen transition-opacity duration-1000 ${stealthMode ? 'cursor-none' : ''}`}>
      {/* HUD Header - Optimized for visibility & hierarchy */}
      {!stealthMode && (
        <div className="border-b border-white/10 p-4 md:px-8 md:py-4 flex flex-col md:flex-row justify-between items-center bg-black/95 sticky top-0 z-50 backdrop-blur-2xl gap-4 shadow-2xl">
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <Link to="/" className="text-white hover:text-slime-green transition-all hover:scale-110 active:scale-95">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="font-gothic text-xl md:text-2xl text-white tracking-widest truncate max-w-[180px] md:max-w-md uppercase">
                  {story.title}
                </h1>
                <span className="hidden lg:inline-block text-phantom-pink font-pixel text-[10px] border border-phantom-pink/40 px-2 py-0.5 rounded-sm tracking-tighter bg-phantom-pink/5">
                  HUD_v3.1_LIVE
                </span>
              </div>
              <p className="font-pixel text-[10px] text-phantom-pink/60 uppercase tracking-[0.25em] mt-1 truncate">
                {story.source} // {wordCount(story.content)} WORDS
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 w-full md:w-auto">
            {/* Scroll Engine Controls */}
            <div className="flex items-center bg-black/60 border border-white/20 p-1.5 gap-2 rounded-sm shadow-inner group">
              <button
                onClick={() => setIsScrolling(!isScrolling)}
                className={`p-2 transition-all rounded-sm shadow-md active:scale-90 ${isScrolling ? 'bg-phantom-pink text-white animate-pulse' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                title="Space to Toggle"
              >
                {isScrolling ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <div className="flex items-center gap-3 px-3 border-l border-white/10">
                <Sliders className="w-4 h-4 text-slime-green opacity-50 group-hover:opacity-100 transition-opacity" />
                <input
                  type="range" min="1" max="20" step="1"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-20 md:w-32 accent-slime-green cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                />
                <span className="font-pixel text-xs text-slime-green w-4 text-center tabular-nums">{scrollSpeed}</span>
              </div>
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsScrolling(false); }}
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Reset Scroll"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {/* Font Control Group */}
            <div className="flex bg-black/60 border border-white/20 font-pixel text-lg shadow-inner overflow-hidden rounded-sm">
              <button 
                onClick={() => setFontSize(s => Math.max(16, s - 4))} 
                className="px-4 py-1 hover:bg-white hover:text-black transition-colors"
                title="Decrease Font ( [ )"
              >
                -
              </button>
              <div className="px-5 py-1 min-w-[60px] text-center border-x border-white/10 text-white text-sm flex items-center justify-center tabular-nums bg-white/5">
                {fontSize}
              </div>
              <button 
                onClick={() => setFontSize(s => Math.min(96, s + 4))} 
                className="px-4 py-1 hover:bg-white hover:text-black transition-colors"
                title="Increase Font ( ] )"
              >
                +
              </button>
            </div>
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setStealthMode(true)}
                      className="p-2.5 border border-white/20 bg-black/60 text-white/60 hover:text-white hover:border-white transition-all rounded-sm active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-nocturnal-purple border border-white/20 text-white font-pixel shadow-xl">
                    STEALTH MODE (ESC TO EXIT)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button
                onClick={handleShare}
                className="p-2.5 border border-white/20 bg-black/60 text-white/60 hover:text-white hover:border-white transition-all rounded-sm active:scale-95"
                title="Copy Session Report"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={markRecorded}
                className="bg-white text-black px-6 py-2 font-gothic text-sm hover:bg-slime-green transition-all font-black uppercase tracking-[0.2em] shadow-retro active:translate-x-0.5 active:translate-y-0.5"
              >
                FINISH
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stealth Mode UI elements */}
      {stealthMode && (
        <button
          onClick={() => setStealthMode(false)}
          className="fixed top-8 right-8 z-[100] p-4 bg-black/40 hover:bg-white border border-white/10 hover:border-black text-transparent hover:text-black transition-all group rounded-sm"
        >
          <Minimize2 className="w-8 h-8" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 font-pixel text-black bg-white px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest">EXIT STEALTH (ESC)</span>
        </button>
      )}
      {/* Bleeding Progress Bar - Visual cue for session length */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-black z-50">
        <div
          className="h-full bg-blood-red transition-all duration-300 shadow-[0_0_15px_#4A0404]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Main Reading Area - High contrast, legible typography */}
      <main className="max-w-4xl mx-auto px-8 pt-32 pb-64 md:pt-48 md:pb-80">
        <div
          ref={contentRef}
          className="font-mono text-white/90 leading-[1.85] whitespace-pre-wrap transition-all duration-700 select-none tracking-wide"
          style={{
            fontSize: `${fontSize}px`,
            textShadow: '0 0 2px rgba(255, 255, 255, 0.15)'
          }}
        >
          {story.content}
        </div>
        {/* Closing Narrative Elements */}
        <div className="mt-80 text-center border-t border-white/10 pt-24 pb-48 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
          <Skull className="w-20 h-20 mx-auto mb-10 text-phantom-pink animate-pulse" />
          <p className="font-gothic text-5xl md:text-7xl mb-8 tracking-[0.4em] text-white uppercase">End of Broadcast</p>
          <div className="flex items-center justify-center gap-6 font-pixel text-xl md:text-2xl text-phantom-pink">
            <div className="w-20 h-px bg-phantom-pink/40" />
            <span className="tracking-[0.3em]">MORALLY GRIM PRODUCTION</span>
            <div className="w-20 h-px bg-phantom-pink/40" />
          </div>
          <p className="mt-12 font-pixel text-xs text-white/30 tracking-widest uppercase">Thank you for your submission.</p>
        </div>
      </main>
      {/* Recording session status indicator */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 z-50">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`flex items-center gap-4 px-8 py-4 font-gothic text-xl border-2 transition-all duration-500 rounded-sm ${
            isRecording
              ? 'bg-blood-red border-phantom-pink text-white shadow-[0_0_30px_rgba(212,20,90,0.6)] animate-pulse'
              : 'bg-black/80 border-white/20 text-white/40 hover:text-white hover:border-white'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-white animate-blink' : 'bg-white/10'}`} />
          <span className="tracking-[0.2em]">{isRecording ? 'ON AIR' : 'START SESSION'}</span>
        </button>
        {isScrolling && (
          <div className="bg-slime-green/10 border border-slime-green/30 text-slime-green font-pixel text-[10px] px-4 py-1.5 text-center tracking-[0.2em] animate-pulse backdrop-blur-md rounded-sm">
            AUTO-SCROLL ACTIVE
          </div>
        )}
      </div>
    </div>
  );
}