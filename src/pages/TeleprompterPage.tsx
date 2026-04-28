import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Radio, Maximize2, Minimize2, Settings2, Info } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
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
  const [fontSize, setFontSize] = useState(36);
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-black">
      <div className="w-20 h-20 border-8 border-slime-green border-t-transparent animate-spin rounded-full" />
      <div className="font-creepy text-5xl text-slime-green animate-pulse">INVITING SCRIPT...</div>
    </div>
  );
  return (
    <div className={`bg-black min-h-screen transition-all duration-500 ${stealthMode ? 'cursor-none' : ''}`}>
      {/* HUD Header */}
      {!stealthMode && (
        <div className="border-b-4 border-slime-green p-4 flex justify-between items-center bg-crypt-purple sticky top-0 z-50 shadow-retro-lg">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slime-green hover:text-hot-pink transition-all hover:scale-110">
              <ArrowLeft className="w-10 h-10" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-2xl text-slime-green uppercase glow-text truncate max-w-sm">
                  {story.title}
                </h1>
                <span className="text-hot-pink font-pixel text-xs border border-hot-pink px-1">HUD v1.99</span>
              </div>
              <p className="font-pixel text-sm text-hot-pink uppercase opacity-80">INVITE ME IN // {story.source}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-slime-green/50 hover:text-slime-green transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-crypt-purple border-2 border-slime-green text-slime-green font-pixel p-4">
                  <p className="font-bold mb-2">RECORDING TIPS:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• CHECK AUDIO LEVELS</li>
                    <li>• STAY IN FRAME</li>
                    <li>• PACE YOUR BREATHING</li>
                    <li>• BE MORALLY GRIM</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex bg-black border-4 border-slime-green font-pixel text-xl">
              <button 
                onClick={() => setFontSize(s => Math.max(16, s - 4))} 
                className="px-4 py-1 hover:bg-slime-green hover:text-black border-r-4 border-slime-green"
              >
                -
              </button>
              <div className="px-6 py-1 min-w-[80px] text-center">{fontSize}</div>
              <button 
                onClick={() => setFontSize(s => Math.min(96, s + 4))} 
                className="px-4 py-1 hover:bg-slime-green hover:text-black border-l-4 border-slime-green"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center gap-3 px-6 py-2 font-pixel text-xl border-4 transition-all shadow-retro ${
                isRecording 
                  ? 'bg-red-600 border-red-400 text-white animate-pulse' 
                  : 'bg-black border-slime-green text-slime-green hover:bg-slime-green/10'
              }`}
            >
              <Radio className={`w-5 h-5 ${isRecording ? 'animate-ping' : ''}`} /> 
              {isRecording ? 'ON AIR' : 'START REC'}
            </button>
            <button
              onClick={() => setStealthMode(true)}
              className="p-3 border-4 border-slime-green bg-black text-slime-green hover:bg-slime-green hover:text-black transition-colors"
              title="Enter Stealth Mode"
            >
              <Maximize2 className="w-6 h-6" />
            </button>
            <button
              onClick={markRecorded}
              className="retro-button-pink py-2 px-8 text-xl"
            >
              FINISH
            </button>
          </div>
        </div>
      )}
      {/* Stealth Mode Exit Button (Only visible on hover in corner) */}
      {stealthMode && (
        <button 
          onClick={() => setStealthMode(false)}
          className="fixed top-4 right-4 z-[100] p-4 bg-black/20 hover:bg-slime-green border-2 border-transparent hover:border-black text-transparent hover:text-black transition-all"
        >
          <Minimize2 className="w-8 h-8" />
        </button>
      )}
      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-black z-50">
        <div 
          className="h-full bg-slime-green transition-all duration-150 shadow-[0_0_10px_#39FF14]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Reading Area */}
      <div className="max-w-4xl mx-auto px-8 py-24 md:py-40">
        <div
          ref={contentRef}
          className="font-mono text-slime-green leading-[1.6] whitespace-pre-wrap transition-all duration-300 select-none"
          style={{ 
            fontSize: `${fontSize}px`,
            textShadow: '0 0 1px rgba(57, 255, 20, 0.5)'
          }}
        >
          {story.content}
        </div>
        <div className="mt-40 text-center border-t-8 border-slime-green border-double pt-12 opacity-50">
          <p className="font-creepy text-4xl mb-4">END OF BROADCAST</p>
          <p className="font-pixel text-xl">INVITE ME IN - MORALLY GRIM PRODUCTION</p>
        </div>
      </div>
      {/* Recording Overlay Indicator */}
      {isRecording && (
        <div className="fixed bottom-12 right-12 flex items-center gap-4 bg-red-600 text-white px-8 py-4 font-pixel text-2xl border-4 border-red-400 z-50 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
          <div className="w-5 h-5 rounded-full bg-white animate-pulse" />
          ON AIR
        </div>
      )}
    </div>
  );
}