import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Maximize2, Minimize2, Info, Eye, Settings } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
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
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (id) {
      api<Story>(`/api/stories/${id}`)
        .then(setStory)
        .catch(() => toast.error('Story lost in the void'));
    }
  }, [id]);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.documentElement;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      setScrollProgress((currentScroll / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const markRecorded = async () => {
    if (!id) return;
    try {
      await api(`/api/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRecorded: true })
      });
      toast.success('Broadcast archived in the crypt!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to mark as recorded');
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
        <div className="border-b border-white/10 p-6 flex justify-between items-center bg-black/90 sticky top-0 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-white hover:text-slime-green transition-all hover:scale-105">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-gothic text-2xl text-white tracking-wider truncate max-w-md">
                  {story.title}
                </h1>
                <span className="text-phantom-pink font-pixel text-[10px] border border-phantom-pink/40 px-2 py-0.5 rounded-sm">HUD_STATION_v2.0</span>
              </div>
              <p className="font-pixel text-xs text-phantom-pink/60 uppercase tracking-widest mt-1">MORALLY GRIM PRODUCTION // {story.source}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-black border border-white/20 font-pixel text-lg">
              <button
                onClick={() => setFontSize(s => Math.max(16, s - 4))}
                className="px-4 py-1 hover:bg-white hover:text-black transition-colors"
              >
                -
              </button>
              <div className="px-6 py-1 min-w-[70px] text-center border-x border-white/10 text-white">{fontSize}</div>
              <button
                onClick={() => setFontSize(s => Math.min(96, s + 4))}
                className="px-4 py-1 hover:bg-white hover:text-black transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center gap-3 px-6 py-2 font-pixel text-lg border-2 transition-all ${
                isRecording
                  ? 'bg-blood-red border-phantom-pink text-white shadow-[0_0_15px_rgba(212,20,90,0.4)]'
                  : 'bg-black border-white/20 text-white/60 hover:border-white hover:text-white'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
              {isRecording ? 'ON AIR' : 'START REC'}
            </button>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setStealthMode(true)}
                      className="p-3 border border-white/20 bg-black text-white/60 hover:text-white hover:border-white transition-colors"
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
                onClick={markRecorded}
                className="bg-white text-black px-8 py-2 font-gothic text-lg hover:bg-slime-green transition-colors font-bold"
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
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 font-pixel text-black bg-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">EXIT STEALTH</span>
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
      {isRecording && (
        <div className="fixed bottom-12 right-12 flex items-center gap-4 bg-blood-red text-white px-8 py-4 font-gothic text-2xl border border-phantom-pink z-50 shadow-[0_0_20px_rgba(74,4,4,0.6)]">
          <Radio className="w-6 h-6 animate-pulse" />
          ON AIR
        </div>
      )}
    </div>
  );
}