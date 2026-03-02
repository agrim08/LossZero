"use client";

import { useMemo } from 'react';
import { format, eachDayOfInterval, subMonths, isSameDay, startOfMonth, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  activeDates: Date[];
}

export function Heatmap({ activeDates }: HeatmapProps) {
  const dates = useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 3);
    
    // Pad to full weeks (Sunday to Saturday)
    const dayOfWeek = start.getDay(); // 0 is Sunday
    const paddedStart = new Date(start);
    paddedStart.setDate(start.getDate() - dayOfWeek);

    const dates = eachDayOfInterval({ start: paddedStart, end });
    return dates.reverse();
  }, []);

  const getIntensity = (date: Date) => {
    const count = activeDates.filter(d => isSameDay(new Date(d), date)).length;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const monthLabels = useMemo(() => {
    const labels: { label: string, index: number }[] = [];
    dates.forEach((date, i) => {
      if (i % 7 === 0 && (i === 0 || !isSameMonth(date, dates[i - 7]))) {
        labels.push({ label: format(date, 'MMM'), index: i / 7 });
      }
    });
    return labels;
  }, [dates]);

  return (
    <div className="bg-[#0f0f0f] border border-zinc-800/50 p-6 rounded-lg w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">3-Month Activity</h3>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-600">Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#161b22]" />
            <div className="w-2 h-2 rounded-sm bg-[#0e4429]" />
            <div className="w-2 h-2 rounded-sm bg-[#006d32]" />
            <div className="w-2 h-2 rounded-sm bg-[#26a641]" />
            <div className="w-2 h-2 rounded-sm bg-[#39d353]" />
          </div>
          <span className="text-[10px] text-zinc-600">More</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Month Labels */}
        <div className="flex mb-2 text-[9px] font-mono text-zinc-700 uppercase tracking-tighter h-3">
          {monthLabels.map((m, i) => (
            <div 
              key={i} 
              className="absolute" 
              style={{ left: `${m.index * 13}px` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2 min-h-[85px]">
          {dates.map((date) => {
            const intensity = getIntensity(date);
            return (
              <div
                key={date.toISOString()}
                title={format(date, 'MMM do, yyyy')}
                className={cn(
                  "w-[11px] h-[11px] rounded-[2px] cursor-default transition-colors duration-500",
                  intensity === 0 && "bg-[#161b22]",
                  intensity === 1 && "bg-[#0e4429]",
                  intensity === 2 && "bg-[#006d32]",
                  intensity === 3 && "bg-[#26a641]",
                  intensity === 4 && "bg-[#39d353]"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
