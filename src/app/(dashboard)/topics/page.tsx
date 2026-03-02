"use client";

import { useEffect, useState, useMemo } from "react";
import { TopicCard } from "@/components/TopicCard";
import { AddTopicForm } from "@/components/AddTopicForm";
import { ChevronDown, ChevronRight, BookOpen, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]); // Default week 1 open

  useEffect(() => {
    fetch("/api/topics")
      .then(res => res.json())
      .then(data => setTopics(data));
  }, []);

  const weeks = useMemo(() => {
    const groups: { [key: number]: any[] } = {};
    topics.forEach(t => {
      if (!groups[t.week]) groups[t.week] = [];
      groups[t.week].push(t);
    });
    return groups;
  }, [topics]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const res = await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({ topicId: id, completed }),
    });
    if (res.ok) {
      setTopics(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
      // Note: AI note is generated on server, will appear on refresh or when visiting Notes page
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

  const handleAdd = (newTopic: any) => {
    setTopics(prev => [...prev, newTopic].sort((a, b) => a.week - b.week));
  };

  const totalCompleted = topics.filter(t => t.completed).length;
  const progressPercent = topics.length > 0 ? (totalCompleted / topics.length) * 100 : 0;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            <BookOpen className="w-3 h-3" /> Curriculum_Engine
          </div>
          <h2 className="text-3xl font-bold tracking-tighter italic">Machine Learning Path</h2>
        </div>
        <div className="text-right space-y-1">
          <div className="text-[10px] font-mono text-zinc-600 uppercase">Total Progress</div>
          <div className="text-xl font-mono font-bold text-zinc-300">
            {totalCompleted}<span className="text-zinc-700 mx-1">/</span>{topics.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          className="h-full bg-green-500"
        />
      </div>

      <AddTopicForm onAdd={handleAdd} />

      <div className="space-y-4">
        {Object.entries(weeks).map(([week, weekTopics]) => {
          const weekNum = parseInt(week);
          const isExpanded = expandedWeeks.includes(weekNum);
          const completedInWeek = weekTopics.filter(t => t.completed).length;
          const isWeekDone = completedInWeek === weekTopics.length;

          return (
            <div key={week} className="border border-zinc-900 rounded-2xl overflow-hidden bg-[#0c0c0c]">
              <button
                onClick={() => toggleWeek(weekNum)}
                className={cn(
                  "w-full flex items-center justify-between p-5 hover:bg-zinc-900/50 transition-colors",
                  isWeekDone && "opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs border",
                    isWeekDone ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  )}>
                    W{weekNum}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-zinc-200">Week {weekNum} Bloom</h3>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                      {completedInWeek} OF {weekTopics.length} OBJECTIVES CLEARED
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-700" /> : <ChevronRight className="w-4 h-4 text-zinc-700" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-900"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {weekTopics.map((topic) => (
                        <TopicCard
                          key={topic._id}
                          id={topic._id}
                          title={topic.title}
                          tag={topic.tag}
                          completed={topic.completed}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onAIComplete={() => {
                            // Refresh topics to show new note (if we were displaying notes here)
                            // For now just re-fetch for safety or feedback
                            fetch("/api/topics").then(res => res.json()).then(setTopics);
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
