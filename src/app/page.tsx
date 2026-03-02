import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Terminal, Sparkles, LayoutDashboard, Send } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-green-500/30">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-black text-lg">L</div>
          <span className="text-xl font-bold tracking-tighter">LossZero</span>
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-5 py-2 text-xs font-mono border border-zinc-800 rounded-full hover:bg-zinc-900 transition-all uppercase tracking-widest text-zinc-400 hover:text-white">
              Access_System
            </button>
          </SignInButton>
        </SignedOut>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-500 uppercase tracking-widest animate-pulse">
            <Terminal className="w-3 h-3" /> System_Protocol_Online
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[0.9] text-white">
            MASTER ML BY <br />
            <span className="text-green-500">MINIMIZING LOSS</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-lg mx-auto font-medium">
            A strict, data-dense progression tracker for serious machine learning practitioners.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="group relative flex items-center gap-3 bg-white text-black px-4 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Sparkles className="w-5 h-5" />
                GET_STARTED_NOW
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-zinc-900/50 w-full mt-12">
          {[
            { label: 'TRACKING', val: 'GitHub Style' },
            { label: 'CURRICULUM', val: 'Adaptive' },
            { label: 'INSIGHTS', val: '300W AI Note' },
            { label: 'INTERFACE', val: 'Terminal Dark' }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{stat.label}</div>
              <div className="text-sm font-bold text-zinc-300">{stat.val}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-12 px-8 border-t border-zinc-900/50 flex flex-col items-center gap-4">
        <p className="text-[10px] font-mono text-zinc-800 uppercase tracking-tighter">
          LossZero Intelligence Systems © 2026 • v1.2.0-stable
        </p>
      </footer>
    </div>
  );
}
