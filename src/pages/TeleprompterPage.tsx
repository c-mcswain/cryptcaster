import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Eye, Play, Pause, RotateCcw, Share2, Sliders, Skull, Mail, ScrollText, Hash } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
import { wordCount, estimateReadTime, cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [fontSize, setFontSize] = useState(42);
  const [isRecording, setIsRecording] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const requestRef = useRef<number>();
  useEffect(() => {
    if (id) {
      api<Story>(`/api/stories/${id}`)
        .then(setStory)
        .catch(() => toast.error('Tale lost in the void'));
    }
  }, [id]);
  const animate = useCallback(() => {
    const element = document.documentElement;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const currentScroll = element.scrollTop;
    if (isScrolling) {
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
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);
  const generateReport = useCallback(() => {
    if (!story) return '';
    const now = new Date().toLocaleString();
    return `--- INVITE ME IN: ${story.kind?.toUpperCase() === 'EMAIL' ? 'POST TICKET' : 'GRIM NARRATIVE'} ---
Title: ${story.title.toUpperCase()}
Source: ${story.source}
TicketID: ${story.metadata?.ticketId || 'N/A'}
Words: ${wordCount(story.content)}
Broadcast Time: ${now}
Status: TOMB SEALED
---------------------------------------`;
  }, [story]);
  const markRecorded = async () => {
    if (!id) return;
    try {
      await api(`/api/stories/${id}`, { method: 'PATCH', body: JSON.stringify({ isRecorded: true }) });
      navigator.clipboard.writeText(generateReport());
      toast.success('Session report copied and tomb sealed.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to seal the tomb');
    }
  };
  if (!story) return <div className="bg-black min-h-screen flex items-center justify-center font-gothic text-2xl text-white">UNSEALING...</div>;
  return (
    <div className={cn("bg-[#020005] min-h-screen transition-opacity duration-1000", stealthMode && "cursor-none")}>
      {!stealthMode && (
        <div className="border-b border-white/10 p-4 md:px-8 flex flex-col md:flex-row justify-between items-center bg-black/95 sticky top-0 z-50 backdrop-blur-2xl gap-4">
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <Link to="/" className="text-white hover:text-slime-green transition-all"><ArrowLeft className="w-8 h-8" /></Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                {story.kind === 'email' ? <Mail className="w-5 h-5 text-phantom-pink" /> : <ScrollText className="w-5 h-5 text-slime-green" />}
                <h1 className="font-gothic text-xl text-white truncate max-w-xs uppercase">{story.title}</h1>
                <span className={cn("font-pixel text-[10px] px-2 border", story.kind === 'email' ? "border-phantom-pink text-phantom-pink" : "border-slime-green text-slime-green")}>
                  {story.kind?.toUpperCase() || 'STORY'}
                </span>
              </div>
              <p className="font-pixel text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                {story.source} {story.metadata?.ticketId && `// ID: ${story.metadata.ticketId}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            <div className="flex items-center bg-black/60 border border-white/10 p-1 rounded-sm">
              <button onClick={() => setIsScrolling(!isScrolling)} className={cn("p-2 rounded-sm", isScrolling ? "bg-phantom-pink text-white" : "text-white/40")}>
                {isScrolling ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2 px-3">
                <input type="range" min="1" max="20" value={scrollSpeed} onChange={(e) => setScrollSpeed(Number(e.target.value))} className="w-20 accent-slime-green" />
              </div>
            </div>
            <div className="flex bg-black/60 border border-white/10 rounded-sm font-pixel text-xs">
              <button onClick={() => setFontSize(s => Math.max(16, s - 4))} className="px-3 py-1 hover:bg-white hover:text-black">-</button>
              <div className="px-4 py-1 border-x border-white/10 min-w-[50px] text-center">{fontSize}</div>
              <button onClick={() => setFontSize(s => Math.min(96, s + 4))} className="px-3 py-1 hover:bg-white hover:text-black">+</button>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><button onClick={() => setStealthMode(true)} className="p-2 border border-white/10 hover:border-white text-white/40 hover:text-white"><Eye className="w-5 h-5" /></button></TooltipTrigger>
                  <TooltipContent className="font-pixel">STEALTH MODE (ESC)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button onClick={markRecorded} className="bg-white text-black px-6 py-2 font-gothic text-sm font-bold uppercase shadow-retro hover:bg-slime-green">SEAL TOMB</button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-black z-[100]">
        <div className="h-full bg-blood-red transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
      </div>
      <main className="max-w-4xl mx-auto px-8 pt-32 pb-80">
        <div className="font-mono text-white/90 leading-[1.8] whitespace-pre-wrap select-none" style={{ fontSize: `${fontSize}px` }}>
          {story.content}
        </div>
        <div className="mt-64 text-center opacity-20 border-t border-white/10 pt-20">
          <Skull className="w-16 h-16 mx-auto mb-8" />
          <p className="font-gothic text-4xl tracking-widest uppercase">TOMB SEALED: END OF BROADCAST</p>
        </div>
      </main>
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-50">
        <button onClick={() => setIsRecording(!isRecording)} className={cn("flex items-center gap-3 px-6 py-3 font-gothic border-2 transition-all", isRecording ? "bg-blood-red border-phantom-pink text-white animate-pulse" : "bg-black text-white/40 border-white/10 hover:border-white")}>
          <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-white animate-blink" : "bg-white/10")} />
          <span>{isRecording ? 'ON AIR' : 'START SESSION'}</span>
        </button>
      </div>
    </div>
  );
}