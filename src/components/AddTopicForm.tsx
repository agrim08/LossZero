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
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Add Custom Module</span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="p-6 bg-[#0f0f0f] border border-zinc-800 rounded-xl space-y-4 shadow-2xl"
        >
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
              className="w-full py-3 bg-zinc-200 hover:bg-white text-black rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Deploy Objective"}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
