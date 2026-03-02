"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart, Pie, Cell as PieCell } from "recharts";
import { Activity, Target, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";

const COLORS = ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"];

export default function StatsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [topicsRes, streakRes] = await Promise.all([
        fetch("/api/topics"),
        fetch("/api/streak")
      ]);
      setTopics(await topicsRes.json());
      setStreak(await streakRes.json());
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (topics.length === 0) return null;

    const completed = topics.filter(t => t.completed);
    const total = topics.length;
    const percent = Math.round((completed.length / total) * 100);

    // Weekly velocity (last 4 weeks)
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const start = startOfWeek(subWeeks(new Date(), i));
      const end = endOfWeek(subWeeks(new Date(), i));
      const count = completed.filter(t => {
        const d = new Date(t.completedAt);
        return d >= start && d <= end;
      }).length;
      weeklyData.push({
        name: `Week ${format(start, 'w')}`,
        count
      });
    }

    // Tag breakdown
    const tags: { [key: string]: number } = {};
    completed.forEach(t => {
      tags[t.tag] = (tags[t.tag] || 0) + 1;
    });
    const tagData = Object.entries(tags).map(([name, value]) => ({ name, value }));

    return { percent, completed: completed.length, total, weeklyData, tagData };
  }, [topics]);

  if (!stats) return <div className="font-mono text-zinc-800">CALCULATING_METRICS...</div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-green-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          <TrendingUp className="w-3 h-3" /> Analytics_Core
        </div>
        <h2 className="text-3xl font-bold tracking-tighter">Performance Metrics</h2>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Completion", value: `${stats.percent}%`, icon: Target, color: "text-green-500" },
          { label: "Current Streak", value: streak?.currentStreak || 0, icon: Activity, color: "text-orange-500" },
          { label: "Longest Streak", value: streak?.longestStreak || 0, icon: Award, color: "text-yellow-500" },
          { label: "Objectives Met", value: stats.completed, icon: TrendingUp, color: "text-blue-500" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111] border border-zinc-900 p-6 rounded-2xl space-y-2"
          >
            <item.icon className={cn("w-4 h-4 mb-2", item.color)} />
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{item.label}</div>
            <div className="text-2xl font-bold tracking-tight">{item.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Velocity */}
        <section className="bg-[#0c0c0c] border border-zinc-900 p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Weekly Velocity</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#3f3f46" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#3f3f46" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                  cursor={{ fill: '#18181b' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.weeklyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#22c55e' : '#27272a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tag Breakdown */}
        <section className="bg-[#0c0c0c] border border-zinc-900 p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Knowledge Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.tagData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.tagData.map((_, index) => (
                      <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {stats.tagData.slice(0, 5).map((tag, i) => (
                <div key={tag.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest">{tag.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-700">{tag.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Progress Ring Overlay (Conceptual) */}
      <section className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10 text-center space-y-4">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Overall Completion</div>
          <div className="text-8xl font-bold tracking-tighter text-zinc-100 italic relative">
            {stats.percent}<span className="text-green-500 text-4xl align-top select-none">%</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-700 uppercase">{stats.total - stats.completed} objectives remaining to target</p>
        </div>
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <div className="w-[400px] h-[400px] border-40 border-green-500 rounded-full" />
          <div className="absolute w-[300px] h-[300px] border-20 border-green-500 rounded-full" />
        </div>
      </section>
    </div>
  );
}
