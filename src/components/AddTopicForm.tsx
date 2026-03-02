"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddTopicFormProps {
  onAdd: (topic: { title: string; tag: string; week: number }) => void;
}

export function AddTopicForm({ onAdd }: AddTopicFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [week, setWeek] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsPending(true);
    try {
      const res = await fetch("/api/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tag, week }),
      });
      if (res.ok) {
        const newTopic = await res.json();
        onAdd(newTopic);
        setTitle("");
        setTag("");
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all border border-green-500/20 group"
        >
          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-green-500">Add_Custom</span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        >
          <div className="w-full max-w-md bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">New Objective</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                autoFocus
                type="text"
                placeholder="Topic Title (e.g. Advanced Transformer Architectures)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Tag (e.g. LLMs)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
              <div>
                <select
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors appearance-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Week {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-green-500 border border-green-600 hover:bg-green-400 text-black rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Deploy Objective"}
            </button>
          </div>
          </div>
        </motion.form>
      )}
    </div>
  );
}
