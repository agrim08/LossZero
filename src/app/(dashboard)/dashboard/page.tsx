"use client";

import { useEffect, useState } from "react";
import { Heatmap } from "@/components/Heatmap";
import { StreakBadge } from "@/components/StreakBadge";
import { TopicCard } from "@/components/TopicCard";
import { Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [hint, setHint] = useState<any>(null);
  const [latestNote, setLatestNote] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [streakRes, topicsRes, hintRes, notesRes] = await Promise.all([
        fetch("/api/streak"),
        fetch("/api/topics"),
        fetch("/api/hint", { method: "POST" }),
        fetch("/api/notes?limit=1")
      ]);
      
      const [streakData, topicsData, hintData, notesData] = await Promise.all([
        streakRes.json(),
        topicsRes.json(),
        hintRes.json(),
        notesRes.json()
      ]);

      setData(streakData);
      setTopics(topicsData);
      setHint(hintData);
      setLatestNote(notesData[0]);
    };

    fetchData();
  }, []);

  const handleToggle = async (id: string, completed: boolean) => {
    const res = await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({ topicId: id, completed }),
    });
    if (res.ok) {
      setTopics(prev => prev.map(t => t._id === id ? { ...t, completed } : t));
      // Refresh streak
      const streakRes = await fetch("/api/streak");
      const streakData = await streakRes.json();
      setData(streakData);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/topics?topicId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTopics(prev => prev.filter(t => t._id !== id));
    }
  };

  const todayTopics = topics.filter(t => !t.completed).slice(0, 3);

  if (!data) return <div className="animate-pulse text-zinc-800 font-mono">INITIALIZING_DASHBOARD...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Top Section: Streak & Metrics */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tighter">System Overview</h2>
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> status: online</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>active_user_session</span>
          </div>
        </div>
        <StreakBadge currentStreak={data.currentStreak} longestStreak={data.longestStreak} />
      </header>

      {/* AI Hint Banner */}
      {hint && (
        <section className="relative overflow-hidden p-6 rounded-2xl bg-[#111] border border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)]">
          <div className="relative z-10 flex gap-4">
            <div className="p-2 bg-green-500/10 rounded-lg h-fit">
              <Sparkles className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-500 italic">"{hint.motivation}"</p>
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-tighter">
                  EOD_SUMMARY: <span className="text-zinc-400 normal-case">{hint.summary}</span>
                </div>
                {hint.next_suggestion && (
                  <div className="font-mono text-[11px] text-green-500 uppercase tracking-tighter">
                    NEXT_OBJECTIVE: <span className="text-green-400 font-bold normal-case underline decoration-green-900 underline-offset-4">{hint.next_suggestion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-2 opacity-5">
             <Terminal className="w-32 h-32" />
          </div>
        </section>
      )}

      {/* Heatmap & Latest Note Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Heatmap activeDates={data.activeDates} />
        </div>
        
        {latestNote ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-[#0a0a0a] border border-green-500/10 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-green-500/50 uppercase tracking-widest">Latest_Insight</span>
                <span className="text-[8px] font-mono text-zinc-700 uppercase">{formatDistanceToNow(new Date(latestNote.createdAt))} ago</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-300">{latestNote.topicId?.title}</h4>
              <p className="text-xs text-zinc-500 line-clamp-4 leading-relaxed italic">
                "{latestNote.content}"
              </p>
            </div>
            <a href="/notes" className="mt-4 text-[10px] font-mono text-green-500 hover:text-green-400 underline underline-offset-4 decoration-green-900">
              VIEW_ALL_NOTES {"->"}
            </a>
          </motion.div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-zinc-900 flex items-center justify-center text-center">
            <p className="text-[10px] font-mono text-zinc-700 uppercase">No insights logged yet</p>
          </div>
        )}
      </div>

      {/* Quick Completion Panel */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Incoming Objectives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayTopics.length > 0 ? (
            todayTopics.map((topic: any) => (
              <TopicCard
                key={topic._id}
                id={topic._id}
                title={topic.title}
                tag={topic.tag}
                completed={topic.completed}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-3 py-12 border border-dashed border-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 font-mono text-[10px] uppercase">
              All objectives cleared for today
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
