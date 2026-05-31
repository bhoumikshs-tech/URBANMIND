import { Building2, Compass, ArrowRight, ShieldCheck, Cpu, Play } from 'lucide-react';

interface HeroProps {
  onEnterDashboard: () => void;
}

export default function LandingHero({ onEnterDashboard }: HeroProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark p-6 lg:p-10 flex flex-col justify-center items-center relative min-h-screen">
      {/* Background Matrix Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Glowing background shapes */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-72 h-72 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
 
      {/* Main Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
        
        {/* Left text column (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start font-sans">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider leading-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            Bengaluru Traffic Management System
          </div>
 
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Real-time urban transit analytics, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-400 font-black">beautifully integrated</span>.
          </h2>
 
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
            Monitor transit sensors, optimize signal timing coordinates, track emergency vehicle routes, and analyze road congestion maps in a single unified dashboard built for modern city planners and traffic officers.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              id="hero-btn-enter"
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Enter Workspace <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-btn-demo"
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-350 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> Quick Tour
            </button>
          </div>
 
          {/* Micro startup credentials row */}
          <div className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-800/60 w-full text-center lg:text-left select-none">
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold font-sans text-indigo-400">Live Feeds</span>
              <span className="text-[10px] text-slate-550 font-sans font-medium uppercase tracking-wider">CCTV Streams</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold font-sans text-emerald-400">Smart Grid</span>
              <span className="text-[10px] text-slate-555 font-sans font-medium uppercase tracking-wider">Sensor Matrix</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold font-sans text-purple-400">Green Wave</span>
              <span className="text-[10px] text-slate-550 font-sans font-medium uppercase tracking-wider">Ambulance Priority</span>
            </div>
          </div>
 
        </div>
 
        {/* Right visualization vector hero (col-span-5) */}
        <div className="lg:col-span-5 flex justify-center selection:none">
          <div className="relative w-full aspect-square max-w-[340px] rounded-3xl bg-[#0e121e]/90 border border-slate-800/60 p-5 flex items-center justify-center shadow-lg overflow-hidden">
            {/* Animated background radial rings */}
            <div className="absolute inset-0 bg-radial-grid pointer-events-none opacity-40" />
            
            {/* Interactive network mapping mesh */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="glow-mesh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                </linearGradient>
              </defs>
  
              {/* Connections */}
              <line x1="20" y1="20" x2="50" y2="50" stroke="url(#glow-mesh)" strokeWidth="0.8" />
              <line x1="50" y1="50" x2="80" y2="30" stroke="url(#glow-mesh)" strokeWidth="0.8" />
              <line x1="80" y1="30" x2="75" y2="80" stroke="url(#glow-mesh)" strokeWidth="0.8" />
              <line x1="75" y1="80" x2="35" y2="70" stroke="url(#glow-mesh)" strokeWidth="0.8" />
              <line x1="35" y1="70" x2="20" y2="20" stroke="url(#glow-mesh)" strokeWidth="0.8" />
              <line x1="50" y1="50" x2="35" y2="70" stroke="url(#glow-mesh)" strokeWidth="0.8" />
  
              {/* Nodes dots with flashing overlays */}
              <circle cx="20" cy="20" r="3" fill="#10b981" />
              <circle cx="20" cy="20" r="5" fill="none" stroke="#10b981" strokeWidth="0.5" className="animate-pulse" />
  
              <circle cx="50" cy="50" r="4.5" fill="#6366f1" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="#6366f1" strokeWidth="0.5" className="animate-ping animate-duration-3000" />
  
              <circle cx="80" cy="30" r="3" fill="#10b981" />
              
              <circle cx="75" cy="80" r="3" fill="#a855f7" />
              <circle cx="75" cy="80" r="5" fill="none" stroke="#a855f7" strokeWidth="0.5" className="animate-pulse" />
  
              <circle cx="35" cy="70" r="3" fill="#a855f7" />
            </svg>
  
            {/* floating HUD overlays */}
            <div className="absolute top-8 left-8 bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl text-[10px] font-sans text-slate-200 flex flex-col gap-0.5 shadow-md pointer-events-none">
              <span className="font-semibold text-emerald-400">Intersection 12</span>
              <span className="text-slate-450">Active priority timing</span>
            </div>
  
            <div className="absolute bottom-8 right-8 bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl text-[10px] font-sans text-slate-200 flex flex-col gap-0.5 shadow-md pointer-events-none">
              <span className="font-semibold text-indigo-400 text-right">Madiwala</span>
              <span className="text-slate-450 text-right">Slowing, advisory ready</span>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
}
