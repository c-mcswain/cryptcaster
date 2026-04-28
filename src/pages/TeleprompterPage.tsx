import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Maximize2, Minimize2, Eye, Play, Pause, RotateCcw, Share2, Settings2, Sliders } from 'lucide-react';
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
    if (isScrolling) {
      window.scrollBy(0, scrollSpeed / 5);
    }
    const element = document.documentElement;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const currentScroll = element.scrollTop;
    setScrollProgress(totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0);
    requestRef.current = requestAnimationFrame(animate);
  }, [isScrolling, scrollSpeed]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsScrolling(prev => !prev);
      }
      if (e.code === 'Escape') {
        setStealthMode(false);
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
Title: ${story.title}
Source: ${story.source}
Date: ${now}
Word Count: ${words}
Est. Duration: ${estimateReadTime(story.content)}
Status: ${isRecording ? 'RECORDED' : 'READ ONLY'}
---------------------------------------`;
  }, [story, isRecording]);
  const handleShare = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report);
    toast.success('Broadcast report copied to clipboard.');
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
      {/* HUD Header */}
      {!stealthMode && (
        <div className="border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center bg-black/90 sticky top-0 z-50 backdrop-blur-xl gap-4">
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <Link to="/" className="text-white hover:text-slime-green transition-all hover:scale-105">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="font-gothic text-xl md:text-2xl text-white tracking-wider truncate max-w-[200px] md:max-w-md">
                  {story.title}
                </h1>
                <span className="hidden sm:inline-block text-phantom-pink font-pixel text-[10px] border border-phantom-pink/40 px-2 py-0.5 rounded-sm">HUD_STATION_v3.1</span>
              </div>
              <p className="font-pixel text-[10px] md:text-xs text-phantom-pink/60 uppercase tracking-widest mt-1 truncate">
                {story.source} // {wordCount(story.content)} WORDS
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 w-full md:w-auto">
            {/* Scroll Controls */}
            <div className="flex items-center bg-black border border-white/20 p-1 gap-2 rounded-sm shadow-inner">
              <button
                onClick={() => setIsScrolling(!isScrolling)}
                className={`p-2 transition-colors rounded-sm ${isScrolling ? 'bg-phantom-pink text-white' : 'text-white/60 hover:text-white'}`}
              >
                {isScrolling ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <div className="flex items-center gap-3 px-3 border-l border-white/10">
                <Sliders className="w-4 h-4 text-slime-green" />
                <input 
                  type="range" min="1" max="20" step="1"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-24 accent-slime-green cursor-pointer"
                />
                <span className="font-pixel text-xs text-slime-green w-4 text-center">{scrollSpeed}</span>
              </div>
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsScrolling(false); }}
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Reset Scroll"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {/* Font Size */}
            <div className="flex bg-black border border-white/20 font-pixel text-lg">
              <button onClick={() => setFontSize(s => Math.max(16, s - 4))} className="px-3 py-1 hover:bg-white hover:text-black">-</button>
              <div className="px-4 py-1 min-w-[50px] text-center border-x border-white/10 text-white text-sm flex items-center">{fontSize}</div>
              <button onClick={() => setFontSize(s => Math.min(96, s + 4))} className="px-3 py-1 hover:bg-white hover:text-black">+</button>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setStealthMode(true)}
                      className="p-2.5 border border-white/20 bg-black text-white/60 hover:text-white hover:border-white transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-nocturnal-purple border border-white/20 text-white font-pixel">
                    STEALTH MODE (HUD OFF)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button
                onClick={handleShare}
                className="p-2.5 border border-white/20 bg-black text-white/60 hover:text-white hover:border-white transition-colors"
                title="Copy Session Report"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={markRecorded}
                className="bg-white text-black px-6 py-1.5 font-gothic text-sm hover:bg-slime-green transition-colors font-bold uppercase tracking-widest"
              >
                FINISH
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stealth Mode Exit Button */}
      {stealthMode && (
        <button
          onClick={() => setStealthMode(false)}
          className="fixed top-8 right-8 z-[100] p-4 bg-black/40 hover:bg-white border border-white/10 hover:border-black text-transparent hover:text-black transition-all group"
        >
          <Minimize2 className="w-8 h-8" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 font-pixel text-black bg-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">EXIT STEALTH (ESC)</span>
        </button>
      )}
      {/* Bleeding Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-black z-50">
        <div
          className="h-full bg-blood-red transition-all duration-300 shadow-[0_0_10px_#4A0404]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Reading Area */}
      <div className="max-w-4xl mx-auto px-8 py-32 md:py-48">
        <div
          ref={contentRef}
          className="font-mono text-white/90 leading-[1.8] whitespace-pre-wrap transition-all duration-500 select-none tracking-wide"
          style={{
            fontSize: `${fontSize}px`,
            textShadow: '0 0 2px rgba(255, 255, 255, 0.1)'
          }}
        >
          {story.content}
        </div>
        <div className="mt-64 text-center border-t border-white/10 pt-20 pb-40 opacity-40">
          <p className="font-gothic text-5xl mb-6 tracking-[0.3em] text-white">END OF BROADCAST</p>
          <div className="flex items-center justify-center gap-4 font-pixel text-xl text-phantom-pink">
            <div className="w-12 h-px bg-phantom-pink/30" />
            MORALLY GRIM PRODUCTION
            <div className="w-12 h-px bg-phantom-pink/30" />
          </div>
        </div>
      </div>
      {/* Recording Overlay Indicator */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-3 z-50">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`flex items-center gap-4 px-6 py-3 font-gothic text-xl border transition-all ${
            isRecording
              ? 'bg-blood-red border-phantom-pink text-white shadow-[0_0_20px_rgba(212,20,90,0.5)]'
              : 'bg-black/60 border-white/20 text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
          {isRecording ? 'ON AIR' : 'START SESSION'}
        </button>
        {isScrolling && (
          <div className="bg-slime-green/10 border border-slime-green/30 text-slime-green font-pixel text-[10px] px-3 py-1 text-center animate-pulse">
            AUTO-SCROLL ACTIVE
          </div>
        )}
      </div>
    </div>
  );
}