import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Skull } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function AddStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', source: '', content: '' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Title and content are required!');
      return;
    }
    setLoading(true);
    try {
      await api('/api/stories', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      toast.success('Story added to the crypt!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to add story.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Link to="/" className="text-slime-green font-pixel hover:text-hot-pink flex items-center gap-2 mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO THE CRYPT
        </Link>
        <div className="retro-panel relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-10">
            <Skull className="w-32 h-32" />
          </div>
          <h2 className="font-creepy text-5xl mb-8 text-slime-green glow-text">ADD NEW TALE</h2>
          <form onSubmit={handleSubmit} className="space-y-6 font-pixel text-lg">
            <div>
              <label className="block mb-2 text-hot-pink">STORY TITLE</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-black border-4 border-slime-green p-3 text-slime-green focus:outline-none focus:border-hot-pink transition-colors"
                placeholder="The Whispering Monitor..."
              />
            </div>
            <div>
              <label className="block mb-2 text-hot-pink">SOURCE / SENDER</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full bg-black border-4 border-slime-green p-3 text-slime-green focus:outline-none focus:border-hot-pink transition-colors"
                placeholder="Listener Email / r/nosleep"
              />
            </div>
            <div>
              <label className="block mb-2 text-hot-pink">THE HORROR (CONTENT)</label>
              <textarea
                required
                rows={10}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-black border-4 border-slime-green p-3 text-slime-green font-mono text-sm focus:outline-none focus:border-hot-pink transition-colors resize-none"
                placeholder="Paste your spooky text here..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="retro-button-pink w-full py-4 text-2xl"
            >
              {loading ? 'INGESTING...' : 'INGEST STORY'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}