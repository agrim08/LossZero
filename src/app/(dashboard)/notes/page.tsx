"use client";

import { useState, useEffect } from "react";
import { Trash2, Send, StickyNote, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [notesRes, topicsRes] = await Promise.all([
        fetch("/api/notes"),
        fetch("/api/topics")
      ]);
      setNotes(await notesRes.json());
      setTopics(await topicsRes.json());
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !selectedTopic || isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ topicId: selectedTopic, content }),
    });

    if (res.ok) {
      const newNote = await res.json();
      // To show the populated topic title immediately, we find it locally
      const topic = topics.find(t => t._id === selectedTopic);
      setNotes(prev => [{ ...newNote, topicId: { title: topic.title } }, ...prev]);
      setContent("");
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes(prev => prev.filter(n => n._id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-green-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          <StickyNote className="w-3 h-3" /> Core_Memory
        </div>
        <h2 className="text-3xl font-bold tracking-tighter">Rolling Study Log</h2>
        <p className="text-xs text-zinc-600 font-mono uppercase tracking-tighter">Stored locally for 120 hours (5 days) only.</p>
      </header>

      {/* Write Form */}
      <form onSubmit={handleSubmit} className="bg-[#111] border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-2xl">
        <div className="flex gap-4">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono text-zinc-400 focus:outline-none focus:border-green-500/50 transition-colors"
            required
          >
            <option value="">SELECT_ASSOC_TOPIC</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>
          <div className={cn(
            "flex items-center px-3 py-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-[10px] font-mono",
            content.length > 2500 ? "text-orange-500" : "text-zinc-600"
          )}>
            {content.length}/3000
          </div>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 3000))}
            placeholder="Document key insights or implementation details..."
            className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-700 min-h-[150px] focus:outline-none focus:border-green-500/50 transition-colors resize-none"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !content || !selectedTopic}
            className="absolute bottom-4 right-4 p-2 bg-green-500 hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Feed */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 flex items-center gap-2">
          <Clock className="w-3 h-3" /> Recent_Insights
        </h3>
        
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setExpandedNote(expandedNote === note._id ? null : note._id)}
                className={cn(
                  "group bg-[#0c0c0c] border border-zinc-900 p-6 rounded-2xl relative transition-all hover:border-zinc-700 cursor-pointer overflow-hidden",
                  expandedNote === note._id && "ring-1 ring-green-500/30 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]"
                )}
              >
                {/* Scanner effect on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[2s] pointer-events-none" />

                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-green-500/70 uppercase tracking-widest leading-none">
                        {note.topicId?.title}
                      </span>
                      {expandedNote === note._id && (
                        <span className="text-[8px] font-mono text-zinc-700 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">Full_Access</span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">
                      {format(new Date(note.createdAt), 'yyyy-MM-dd')} • {formatDistanceToNow(new Date(note.createdAt))} ago
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[8px] font-mono text-zinc-800 uppercase tracking-tighter">
                      {expandedNote === note._id ? "ESC_TO_CLOSE" : "CLICK_TO_EXPAND"}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note._id);
                      }}
                      className="p-2 text-zinc-800 hover:text-red-500/80 hover:bg-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <p className={cn(
                  "text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap transition-all duration-500 ease-in-out",
                  expandedNote !== note._id ? "line-clamp-2 blur-[0.2px] opacity-60" : "opacity-100"
                )}>
                  {note.content}
                </p>

                {expandedNote === note._id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-6 pt-6 border-t border-zinc-900/50 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-[8px] font-mono text-zinc-700 uppercase">Integrity_Check</div>
                        <div className="h-1 w-32 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500/20 w-full animate-pulse" />
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-700 uppercase">END_OF_BLOCK</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
              <p className="text-zinc-700 font-mono text-[10px] uppercase">No active memory blocks in high-speed cache</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
