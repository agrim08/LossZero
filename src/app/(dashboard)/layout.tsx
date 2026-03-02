"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CheckSquare, StickyNote, BarChart3 } from "lucide-react";
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

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 flex flex-col pt-8">
        <div className="px-6 mb-12">
          <h1 className="text-xl font-bold tracking-tighter text-green-500">ML_TRACKER</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">3-Month Mastery</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group",
                  isActive 
                    ? "bg-green-500/10 text-green-500 font-medium" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-green-500" : "text-zinc-500 group-hover:text-zinc-200")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-900 flex items-center justify-between">
          <UserButton afterSignOutUrl="/" />
          <span className="text-[10px] font-mono text-zinc-700">v1.2.0-stable</span>
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
