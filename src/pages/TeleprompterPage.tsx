import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Eye, Skull, Mail, ScrollText } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
import { wordCount, cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [isRecording, setIsRecording] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const requestRef = useRef<number>();
  const isScrollingRef = useRef(isScrolling);
  const scrollSpeedRef = useRef(scrollSpeed);
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);
  useEffect(() => {
    scrollSpeedRef.current = scrollSpeed;
  }, [scrollSpeed]);
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
    if (isScrollingRef.current) {
      if (currentScroll < totalHeight - 5) {
        window.scrollBy(0, scrollSpeedRef.current / 4);
      } else {
        setIsScrolling(false);
      }
    }
    setScrollProgress(totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0);
    requestRef.current = requestAnimationFrame(animate);
  }, []);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStealthMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
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
      try {
        await navigator.clipboard.writeText(generateReport());
        toast.success('Session report copied and tomb sealed.');
      } catch (err) {
        toast.success('Tomb sealed.');
      }
      navigate('/');
    } catch (err) {
      toast.error('Failed to seal the tomb');
    }
  };
  if (!story) return <div className="bg-black min-h-screen flex items-center justify-center font-gothic text-3xl text-white/20 tracking-widest">UNSEALING...</div>;
  return (
    <div className={cn("bg-[#010003] min-h-screen transition-all duration-1000", stealthMode && "cursor-none")}>
      {!stealthMode && (
        <div className="border-b border-white/5 p-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-black/95 sticky top-0 z-50 backdrop-blur-3xl gap-6">
          <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
            <Link to="/" className="text-white/40 hover:text-slime-green transition-all"><ArrowLeft className="w-10 h-10" /></Link>
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                {story.kind === 'email' ? <Mail className="w-6 h-6 text-phantom-pink" /> : <ScrollText className="w-6 h-6 text-slime-green" />}
                <h1 className="font-gothic text-2xl text-white/90 truncate max-w-sm uppercase tracking-wider">{story.title}</h1>
                <span className={cn("font-pixel text-xs px-3 py-0.5 border", story.kind === 'email' ? "border-phantom-pink text-phantom-pink" : "border-slime-green text-slime-green")}>
                  {story.kind?.toUpperCase() || 'STORY'}
                </span>
              </div>
              <p className="font-pixel text-xs text-white/30 mt-2 uppercase tracking-[0.2em]">
                {story.source} {story.metadata?.ticketId && `// ID: ${story.metadata.ticketId}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-12">
            <div className="flex items-center bg-noir-gray/80 border border-white/5 p-1.5 rounded-sm">
              <button
                onClick={() => setIsScrolling(prev => !prev)}
                className={cn("p-3 rounded-sm transition-colors", isScrolling ? "bg-phantom-pink text-white" : "text-white/30 hover:text-white")}
              >
                {isScrolling ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-4 px-5">
                <span className="font-pixel text-sm text-white/20">SPD</span>
                <input type="range" min="1" max="20" value={scrollSpeed} onChange={(e) => setScrollSpeed(Number(e.target.value))} className="w-24 accent-slime-green opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex bg-noir-gray/80 border border-white/5 rounded-sm font-pixel text-base">
              <button onClick={() => setFontSize(s => Math.max(16, s - 4))} className="px-5 py-2 hover:bg-white/10 text-white/40">-</button>
              <div className="px-8 py-2 border-x border-white/5 min-w-[70px] text-center text-white/80">{fontSize}</div>
              <button onClick={() => setFontSize(s => Math.min(128, s + 4))} className="px-5 py-2 hover:bg-white/10 text-white/40">+</button>
            </div>
            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setStealthMode(true)} className="p-3 border border-white/10 hover:border-white/40 text-white/30 hover:text-white transition-all">
                      <Eye className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="font-pixel text-sm bg-black border border-white/20">STEALTH MODE (ESC)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button onClick={markRecorded} className="bg-white/90 text-black px-10 py-3 font-gothic text-base font-black uppercase shadow-retro hover:bg-slime-green hover:text-black transition-all">SEAL TOMB</button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-black z-[100]">
        <div className="h-full bg-blood-red/80 transition-all duration-300 shadow-[0_0_10px_rgba(61,3,3,0.5)]" style={{ width: `${scrollProgress}%` }} />
      </div>
      <main className="max-w-4xl mx-auto px-10 pt-40 pb-96">
        <div className="font-mono text-white/80 leading-[1.7] whitespace-pre-wrap select-none tracking-normal" style={{ fontSize: `${fontSize}px` }}>
          {story.content}
        </div>
        <div className="mt-80 text-center opacity-10 border-t border-white/5 pt-32">
          <Skull className="w-24 h-24 mx-auto mb-12" />
          <p className="font-gothic text-5xl tracking-[0.3em] uppercase">TOMB SEALED</p>
          <p className="font-pixel text-xl mt-6 tracking-widest uppercase">END OF BROADCAST SESSION</p>
        </div>
      </main>
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-6 z-50">
        <button
          onClick={() => setIsRecording(prev => !prev)}
          className={cn("flex items-center gap-5 px-10 py-5 font-gothic text-xl border transition-all duration-700", isRecording ? "bg-blood-red/90 border-phantom-pink text-white shadow-[0_0_30px_rgba(179,27,77,0.4)]" : "bg-black/60 text-white/20 border-white/5 hover:border-white/20")}
        >
          <div className={cn("w-3 h-3 rounded-full", isRecording ? "bg-white animate-blink" : "bg-white/10")} />
          <span className="tracking-[0.2em]">{isRecording ? 'ON AIR' : 'START SESSION'}</span>
        </button>
      </div>
    </div>
  );
}