import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Radio } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Story } from '@shared/types';
import { toast } from 'sonner';
export function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [fontSize, setFontSize] = useState(32);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    if (id) {
      api<Story>(`/api/stories/${id}`)
        .then(setStory)
        .catch(() => toast.error('Story lost in the void'));
    }
  }, [id]);
  const markRecorded = async () => {
    if (!id) return;
    try {
      await api(`/api/stories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRecorded: true })
      });
      toast.success('Broadcast recorded successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to mark as recorded');
    }
  };
  if (!story) return <div className="text-center font-creepy text-4xl mt-40">SUMMONING SCRIPT...</div>;
  return (
    <div className="bg-black min-h-screen">
      {/* HUD Header */}
      <div className="border-b-4 border-slime-green p-4 flex justify-between items-center bg-crypt-purple sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-slime-green hover:text-hot-pink transition-colors">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <div>
            <h1 className="font-pixel text-xl text-slime-green truncate max-w-md">{story.title}</h1>
            <p className="font-pixel text-xs text-hot-pink uppercase">Source: {story.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black border-2 border-slime-green font-pixel">
            <button onClick={() => setFontSize(s => Math.max(16, s - 4))} className="px-3 py-1 hover:bg-slime-green hover:text-black">A-</button>
            <div className="px-3 py-1 border-x-2 border-slime-green">{fontSize}px</div>
            <button onClick={() => setFontSize(s => Math.min(72, s + 4))} className="px-3 py-1 hover:bg-slime-green hover:text-black">A+</button>
          </div>
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 px-4 py-2 font-pixel border-4 transition-all ${
              isRecording ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-black border-slime-green text-slime-green'
            }`}
          >
            <Radio className="w-4 h-4" /> {isRecording ? 'ON AIR' : 'REC'}
          </button>
          <button 
            onClick={markRecorded}
            className="retro-button-pink py-2"
          >
            <CheckCircle2 className="w-5 h-5 inline mr-2" /> DONE
          </button>
        </div>
      </div>
      {/* Reading Area */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div 
          className="font-mono text-slime-green leading-relaxed whitespace-pre-wrap transition-all duration-300"
          style={{ fontSize: `${fontSize}px` }}
        >
          {story.content}
        </div>
      </div>
      {/* Recording Overlay Indicator */}
      {isRecording && (
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-red-600 text-white px-6 py-3 font-pixel text-xl border-4 border-red-400 z-50">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          RECORDING...
        </div>
      )}
    </div>
  );
}