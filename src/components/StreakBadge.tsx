"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const isHighStreak = currentStreak >= 7;

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Current</span>
        <div className="flex items-center gap-1 group">
          <motion.div
            animate={isHighStreak ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame className={cn(
              "w-5 h-5 transition-colors",
              currentStreak > 0 ? "text-green-500" : "text-zinc-700",
              isHighStreak && "fill-green-500/20"
            )} />
          </motion.div>
          <span className="text-3xl font-mono font-bold">{currentStreak}</span>
        </div>
      </div>
      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
        Best: <span className="text-zinc-400">{longestStreak}</span>
      </div>
    </div>
  );
}
