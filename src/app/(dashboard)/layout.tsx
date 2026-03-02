"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CheckSquare, StickyNote, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Curriculum", href: "/topics", icon: CheckSquare },
  { name: "Daily Notes", href: "/notes", icon: StickyNote },
  { name: "Analytics", href: "/stats", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "relative border-r border-zinc-900 flex flex-col pt-8 transition-all duration-300 ease-in-out bg-[#080808]",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <div className={cn("px-6 mb-12 transition-all", isCollapsed && "px-4 flex flex-col items-center")}>
          {!isCollapsed ? (
            <>
              <h1 className="text-xl font-bold tracking-tighter text-green-500">LossZero</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">3-Month Mastery</p>
            </>
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-black text-lg">L</div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.name : ""}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group relative",
                  isActive 
                    ? "bg-green-500/10 text-green-500 font-medium" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-green-500" : "text-zinc-500 group-hover:text-zinc-200")} />
                {!isCollapsed && <span>{item.name}</span>}
                {isCollapsed && isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-green-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn("p-6 border-t border-zinc-900 flex items-center justify-between", isCollapsed && "p-4 justify-center")}>
          <UserButton afterSignOutUrl="/" />
          {!isCollapsed && <span className="text-[10px] font-mono text-zinc-700">v1.2.0-stable</span>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
