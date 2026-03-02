"use client";

import { motion } from "framer-motion";
import { Check, Trash2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TopicCardProps {
  id: string;
  title: string;
  tag: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  onAIComplete?: () => void;
  compact?: boolean;
}

export function TopicCard({ 
  id, 
  title, 
  tag, 
  completed, 
  onToggle, 
  onDelete,
  onAIComplete,
  compact = false 
}: TopicCardProps) {
  const [isPending, setIsPending] = useState(false);

  const [isAiPending, setIsAiPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);
    await onToggle(id, !completed);
    setIsPending(false);
  };

  const handleAI = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAiPending(true);
    try {
      const res = await fetch("/api/ai-note", {
        method: "POST",
        body: JSON.stringify({ topicId: id }),
      });
      if (res.ok) {
        onAIComplete?.();
        console.log("AI note generated successfully", res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiPending(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: completed ? 0.4 : 1 }}
      className={cn(
        "group flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        completed 
          ? "bg-[#0c0c0c] border-zinc-900" 
          : "bg-[#111] border-zinc-800 hover:border-zinc-700 shadow-xl"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{tag}</span>
        <h4 className={cn(
          "text-sm font-medium tracking-tight",
          completed ? "text-zinc-400 line-through decoration-zinc-700" : "text-zinc-200"
        )}>
          {title}
        </h4>
      </div>

      <div className="flex items-center gap-2">
        {completed && (
          <button
            onClick={handleAI}
            disabled={isAiPending}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-purple-400 transition-colors"
            title="Generate AI Note"
          >
            {isAiPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
            title="Delete Topic"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            "w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300",
            completed 
              ? "bg-green-500/10 border-green-500/50 text-green-500" 
              : "border-zinc-700 hover:border-green-500/50 text-transparent hover:text-green-500/30",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
