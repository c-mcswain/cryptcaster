import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Eye, Skull, Mail, ScrollText, Video, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [isRecording, setIsRecording] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);
  useEffect(() => {
    if (id) {
      api<Story>(`/api/stories/${id}`)
        .then(setStory)
        .catch(() => toast.error('Tale lost in the void'));
    }
  }, [id]);
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    const element = document.documentElement;
    const currentY = window.scrollY;
    const totalHeight = element.scrollHeight - element.clientHeight;
    if (isScrolling && totalHeight > 0) {
      // Check for manual interruption
      const drift = Math.abs(currentY - scrollPosRef.current);
      if (drift > 15) { // More sensitive but stable threshold
        setIsScrolling(false);
        scrollPosRef.current = currentY;
      } else {
        const pixelsPerSecond = scrollSpeed * 25;
        const moveBy = (pixelsPerSecond * deltaTime) / 1000;
        const newPos = Math.min(totalHeight, scrollPosRef.current + moveBy);
        scrollPosRef.current = newPos;
        window.scrollTo({
          top: newPos,
          behavior: 'auto'
        });
        if (newPos >= totalHeight) {
          setIsScrolling(false);
        }
      }
    } else {
      // Keep internal ref synchronized with manual scrolling when auto-engine is off
      scrollPosRef.current = currentY;
    }
    // Progress HUD Update
    if (progressBarRef.current) {
      const progress = totalHeight > 0 ? (currentY / totalHeight) * 100 : 0;
      progressBarRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isScrolling, scrollSpeed]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStealthMode(false);
      if (e.code === 'Space' && !stealthMode) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        setIsScrolling(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stealthMode]);
  const markRecorded = async () => {
    if (!id || !story) return;
    try {
      await api(`/api/stories/${id}`, { method: 'PATCH', body: JSON.stringify({ isRecorded: true }) });
      toast.success('Session report filed. Tomb sealed.');
      navigate('/crypt');
    } catch (err) {
      toast.error('Failed to seal the tomb');
    }
  };
  if (!story) return <div className="bg-black min-h-screen flex items-center justify-center font-gothic text-3xl text-white/20 tracking-widest uppercase">Unsealing Record...</div>;
  const ytId = story.mediaUrl ? (story.mediaUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2] ?? null) : null;
  return (
    <div className={cn("bg-[#010003] min-h-screen transition-all duration-1000 selection:bg-phantom-pink selection:text-white", stealthMode && "cursor-none")}>
      {!stealthMode && (
        <div className="border-b border-white/5 p-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-black/95 sticky top-0 z-[100] backdrop-blur-3xl gap-6">
          <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
            <Link to="/crypt" className="text-white/40 hover:text-slime-green transition-all"><ArrowLeft className="w-10 h-10" /></Link>
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                {story.kind === 'email' || story.kind === 'submission' ? <Mail className="w-6 h-6 text-phantom-pink" /> : <ScrollText className="w-6 h-6 text-slime-green" />}
                <h1 className="font-gothic text-2xl text-white/90 truncate max-w-sm uppercase tracking-wider">{story.title}</h1>
                <span className={cn("font-pixel text-xs px-3 py-0.5 border", (story.kind === 'email' || story.kind === 'submission') ? "border-phantom-pink text-phantom-pink" : "border-slime-green text-slime-green")}>
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
      <div className="fixed bottom-0 left-0 w-full h-1 bg-black z-[110]">
        <div
          ref={progressBarRef}
          className="h-full bg-blood-red transition-all duration-300 shadow-[0_0_10px_rgba(61,3,3,0.8)] w-0"
        />
      </div>
      <main className="max-w-4xl mx-auto px-10 pt-40 pb-96 relative z-10">
        <div className="font-mono text-white leading-[1.8] whitespace-pre-wrap select-none tracking-normal" style={{ fontSize: `${fontSize}px` }}>
          {story.content}
        </div>
        {story.mediaUrl && !stealthMode && (
          <div className="mt-40 border-t-2 border-white/10 pt-20">
            <h2 className="font-gothic text-3xl text-slime-green mb-10 flex items-center gap-4">
              <Video className="w-8 h-8" /> MEDIA VAULT
            </h2>
            {ytId ? (
              <div className="aspect-video w-full border-4 border-white/5 bg-black overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 border border-slime-green/20 pointer-events-none z-10" />
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ) : (
              <a
                href={story.mediaUrl} target="_blank" rel="noopener noreferrer"
                className="retro-button-pink w-full py-10 flex items-center justify-center gap-6 text-2xl"
              >
                <ExternalLink className="w-8 h-8" /> OPEN EXTERNAL REFERENCE
              </a>
            )}
          </div>
        )}
      </main>
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-6 z-[120]">
        <button
          onClick={() => setIsRecording(prev => !prev)}
          className={cn(
            "flex items-center gap-5 px-10 py-5 font-gothic text-xl border transition-all duration-700",
            isRecording
              ? "bg-blood-red border-phantom-pink text-white shadow-[0_0_40px_rgba(179,27,77,0.6)] scale-110"
              : "bg-black/80 text-white/20 border-white/5 hover:border-white/20"
          )}
        >
          <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]", isRecording ? "bg-white animate-blink" : "bg-white/10")} />
          <span className="tracking-[0.2em]">{isRecording ? 'ON AIR' : 'START SESSION'}</span>
        </button>
      </div>
    </div>
  );
}