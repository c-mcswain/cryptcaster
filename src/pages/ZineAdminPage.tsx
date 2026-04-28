import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Layout, ListPlus, Trash2, Eye, Skull, Megaphone } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast, Toaster } from 'sonner';
import { RetroFooter } from '@/components/RetroFooter';
import { VampiricAtmosphere } from '@/components/VampiricAtmosphere';
import type { ZineContent, Story } from '@shared/types';
import { cn } from '@/lib/utils';
export function ZineAdminPage() {
  const navigate = useNavigate();
  const [zine, setZine] = useState<ZineContent | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([
      api<ZineContent>('/api/zine'),
      api<{ items: Story[] }>('/api/stories')
    ]).then(([zineData, storiesData]) => {
      setZine(zineData);
      setStories(storiesData.items);
      setLoading(false);
    }).catch(() => toast.error('Failed to access editorial archives.'));
  }, []);
  const handleSave = async () => {
    if (!zine) return;
    setSaving(true);
    try {
      await api('/api/zine', {
        method: 'PUT',
        body: JSON.stringify(zine)
      });
      toast.success('Zine published to the void.');
    } catch (err) {
      toast.error('Publication failed.');
    } finally {
      setSaving(false);
    }
  };
  const updateAnnouncement = (index: number, val: string) => {
    if (!zine) return;
    const next = [...zine.announcements];
    next[index] = val;
    setZine({ ...zine, announcements: next });
  };
  const addAnnouncement = () => {
    if (!zine) return;
    setZine({ ...zine, announcements: [...zine.announcements, ""] });
  };
  const removeAnnouncement = (index: number) => {
    if (!zine) return;
    setZine({ ...zine, announcements: zine.announcements.filter((_, i) => i !== index) });
  };
  if (loading || !zine) return <div className="min-h-screen bg-black flex items-center justify-center font-gothic text-white/20 text-3xl uppercase tracking-widest">Opening Zine Archives...</div>;
  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-x-hidden">
      <VampiricAtmosphere />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 z-10 w-full">
        <div className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="w-full md:w-auto">
              <Link to="/crypt" className="text-white/40 font-pixel text-xl hover:text-slime-green flex items-center gap-3 mb-6 transition-colors uppercase tracking-widest">
                <ArrowLeft className="w-5 h-5" /> EXIT TO CRYPT
              </Link>
              <h1 className="gothic-header text-5xl md:text-6xl tracking-widest">EDITORIAL CENTER</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="retro-button w-full md:w-auto px-12 py-6 text-xl flex items-center justify-center gap-4 bg-slime-green text-black font-gothic tracking-widest"
            >
              <Save className={cn("w-6 h-6", saving && "animate-spin")} /> {saving ? 'PUBLISHING...' : 'PUBLISH TO VOID'}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* EDIT FORM */}
            <div className="lg:col-span-7 space-y-10">
              <div className="retro-window border-slime-green/20">
                <div className="retro-window-header bg-slime-green/80 text-black">
                  <div className="flex items-center gap-3">
                    <Layout className="w-4 h-4" />
                    <span className="uppercase tracking-widest">EDITORIAL_MANIFEST_PRO</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 space-y-10 bg-black/40">
                  <div>
                    <label className="block font-pixel text-sm mb-4 text-slime-green/60 tracking-widest uppercase">Editor's Introit (Welcome Text)</label>
                    <textarea
                      rows={6} value={zine.intro}
                      onChange={e => setZine({ ...zine, intro: e.target.value })}
                      className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg leading-relaxed focus:border-slime-green transition-all outline-none resize-none placeholder:text-white/5"
                      placeholder="Welcome to the void..."
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-sm mb-4 text-phantom-pink/60 tracking-widest uppercase">Grim Advertisement (Satirical Plug)</label>
                    <textarea
                      rows={3} value={zine.advertisement || ''}
                      onChange={e => setZine({ ...zine, advertisement: e.target.value })}
                      className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg leading-relaxed focus:border-phantom-pink transition-all outline-none resize-none placeholder:text-white/5 border-dashed"
                      placeholder="e.g. Sponsored by O-Negative energy drink..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block font-pixel text-sm mb-4 text-slime-green/60 tracking-widest uppercase">Featured Reading</label>
                      <select
                        value={zine.featuredStoryId || ''}
                        onChange={e => setZine({ ...zine, featuredStoryId: e.target.value })}
                        className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none appearance-none"
                      >
                        <option value="">-- UNSELEKTED --</option>
                        {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-pixel text-sm mb-4 text-slime-green/60 tracking-widest uppercase">Editor Name</label>
                      <input
                        value={zine.editorName}
                        onChange={e => setZine({ ...zine, editorName: e.target.value })}
                        className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-pixel text-sm mb-4 text-slime-green/60 tracking-widest uppercase">Cover Media Asset (URL)</label>
                    <input
                      value={zine.coverImageUrl}
                      onChange={e => setZine({ ...zine, coverImageUrl: e.target.value })}
                      className="w-full bg-noir-gray border border-white/10 p-5 text-white font-mono text-lg focus:border-slime-green transition-all outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <label className="block font-pixel text-sm text-slime-green/60 tracking-widest uppercase">Grim Announcements</label>
                      <button onClick={addAnnouncement} className="text-slime-green hover:text-white flex items-center gap-2 font-pixel text-xs tracking-widest uppercase">
                        <ListPlus className="w-4 h-4" /> ADD ITEM
                      </button>
                    </div>
                    <div className="space-y-4">
                      {zine.announcements.map((ann, i) => (
                        <div key={i} className="flex gap-4 group">
                          <input
                            value={ann}
                            onChange={e => updateAnnouncement(i, e.target.value)}
                            className="flex-1 bg-noir-gray border border-white/10 p-4 text-white font-mono text-sm focus:border-slime-green transition-all outline-none"
                            placeholder="Announce your shadow..."
                          />
                          <button onClick={() => removeAnnouncement(i)} className="p-3 bg-red-900/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* PREVIEW */}
            <div className="lg:col-span-5 sticky top-12 h-fit">
              <div className="retro-window border-white/10">
                <div className="retro-window-header bg-white/10 text-white">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4" />
                    <span className="uppercase tracking-widest">MASTER_PREVIEW_REPLICA</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-black font-mono">
                  <div className="border-4 border-double border-white/10 p-10 space-y-12 shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                     <div className="text-center relative">
                        <p className="font-pixel text-xs text-phantom-pink tracking-[0.5em] mb-4 uppercase">Morally Grim Presents</p>
                        <h2 className="font-gothic text-4xl text-white tracking-widest uppercase">The Midnight Zine</h2>
                        <div className="h-px bg-white/10 w-32 mx-auto mt-6" />
                     </div>
                     <div className="space-y-10 relative">
                        {zine.advertisement && (
                          <div className="p-4 border border-phantom-pink/40 bg-phantom-pink/5 font-mono text-[10px] text-phantom-pink uppercase italic text-center">
                            <Megaphone className="w-3 h-3 inline mr-2" />
                            {zine.advertisement}
                          </div>
                        )}
                        <div className="space-y-4">
                          <h3 className="font-gothic text-lg text-slime-green tracking-widest uppercase italic">Editor's Introit</h3>
                          <p className="text-white/40 text-sm leading-relaxed italic line-clamp-4">"{zine.intro}"</p>
                        </div>
                        <div className="aspect-video bg-noir-gray border border-white/5 relative overflow-hidden group-hover:border-slime-green/40 transition-colors">
                          <img src={zine.coverImageUrl} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                             <div className="max-w-[70%]">
                                <Skull className="w-6 h-6 text-white/20 mb-2" />
                                <p className="font-pixel text-[10px] text-white tracking-widest uppercase line-clamp-2 leading-tight">
                                  Featured: {stories.find(s => s.id === zine.featuredStoryId)?.title || "NONE"}
                                </p>
                             </div>
                             <span className="font-pixel text-[8px] text-white/20 uppercase tabular-nums">{new Date().getFullYear()} // v4.0</span>
                          </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-white/5">
                           <h3 className="font-pixel text-xs text-phantom-pink tracking-widest uppercase">Announcements</h3>
                           <ul className="space-y-2">
                             {zine.announcements.map((a, i) => (
                               <li key={i} className="text-[10px] text-white/30 uppercase leading-tight flex gap-3">
                                 <span className="text-phantom-pink">»</span> {a}
                               </li>
                             ))}
                           </ul>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 font-pixel text-xs text-white/10 text-center uppercase tracking-widest">Live rendering reflects production display parameters</p>
            </div>
          </div>
        </div>
      </div>
      <RetroFooter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}