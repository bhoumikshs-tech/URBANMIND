import { useState, useEffect } from 'react';
import { EmergencyVehicle, LocationData } from '../types';
import { HeartPulse, Ambulance, Flame, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface EmergencyCorridorProps {
  emergencyVehicles: EmergencyVehicle[];
  onTriggerCorridor: (id: string) => void;
  locations: LocationData[];
}

export default function EmergencyCorridor({ emergencyVehicles, onTriggerCorridor, locations }: EmergencyCorridorProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<EmergencyVehicle | null>(emergencyVehicles[0] || null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ticker, setTicker] = useState(0);

  // Simple simulator increment loop when active
  useEffect(() => {
    let timerID: number;
    if (isSimulating && selectedVehicle) {
      timerID = window.setInterval(() => {
        setTicker((p) => {
          const nextVal = p + 1;
          if (nextVal > 100) {
            // Signal cleared/Completed
            setIsSimulating(false);
            if (selectedVehicle) {
              // Cycle index if routes allow
              const curIdx = selectedVehicle.currentPositionIdx;
              const maxIdx = selectedVehicle.route.length - 1;
              selectedVehicle.currentPositionIdx = curIdx < maxIdx ? curIdx + 1 : 0;
            }
            return 0;
          }
          return nextVal;
        });
      }, 80);
    }
    return () => clearInterval(timerID);
  }, [isSimulating, selectedVehicle]);

  const handleSimulate = (evId: string) => {
    onTriggerCorridor(evId);
    setTicker(0);
    setIsSimulating(true);
  };

  const getVehicleIcon = (type: 'Ambulance' | 'Fire Brigade' | 'Police') => {
    switch (type) {
      case 'Fire Brigade': return Flame;
      case 'Police': return Zap;
      case 'Ambulance':
      default:
        return Ambulance;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-900/30">
            <Ambulance className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Emergency Green Corridor AI
            </h3>
            <p className="text-xs text-pink-400 font-mono">Module 06 • Active Sirens Preemption & Flow Intercept</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
          <Sparkles className="w-3" /> System Guard Level: Ultra Peak
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Side Active Sirens Radar Log */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">
            Emergency Transponders Pinging
          </span>

          {emergencyVehicles.map((ev) => {
            const Icon = getVehicleIcon(ev.type);
            const isSelected = selectedVehicle?.id === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => { setSelectedVehicle(ev); setIsSimulating(false); }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-950 border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.15)]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-pink-950/40 border border-pink-800/40 text-pink-400' : 'bg-slate-900 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-slate-400">EMERGENCY VEHICLE {ev.id.toUpperCase()}</h4>
                    <span className="text-sm font-bold text-slate-200">{ev.type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono block text-pink-400 font-bold">{ev.etaMinutes} mins ETA</span>
                  <span className="text-[10px] font-mono text-slate-500">Priority: {ev.priorityLevel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Preemption Console */}
        {selectedVehicle && (
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-4">
            
            {/* Header Radar details */}
            <div className="flex flex-col gap-1 border-b border-sidebar-border pb-2.5">
              <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-widest">
                Corridor Routing Strategy
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-200 mt-0.5">
                {selectedVehicle.route.map((rid, idx) => {
                  const nameStr = locations.find(l => l.id === rid)?.name.replace(' Junction', '').replace(' Tollway', '').replace(' Flyover Entrance', '') || rid;
                  const isCurrent = idx === selectedVehicle.currentPositionIdx;
                  return (
                    <div key={`rc-${idx}`} className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded ${
                        isCurrent ? 'bg-pink-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-850'
                      }`}>
                        {nameStr}
                      </span>
                      {idx < selectedVehicle.route.length - 1 && <ArrowRight className="w-3 text-slate-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

             {/* Simulated clearing status gauge / radar */}
            <div className="flex flex-col gap-3.5">
              
              {/* Animated GNSS Pipeline Node */}
              <div className="bg-black/40 border border-slate-850 p-3 rounded-lg flex flex-col gap-2 font-mono text-[10px]">
                <span className="text-pink-400 font-bold uppercase tracking-widest block text-[9px]">
                  📡 Real-time Preemption Pipeline
                </span>
                
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-center text-slate-300">
                  <div className="bg-slate-900 border border-slate-800 p-1.5 rounded flex-1">
                    <span className="text-[8px] text-slate-500 block">GNSS FEED</span>
                    <span className="text-[10px] font-bold text-pink-405 text-pink-400">AMB GPS PING</span>
                  </div>
                  <span className="text-slate-650 font-bold">➔</span>
                  <div className="bg-slate-900 border border-slate-800 p-1.5 rounded flex-1">
                    <span className="text-[8px] text-slate-500 block">COGNITIVE ENGINE</span>
                    <span className="text-[10px] font-bold text-cyan-400">URBANMIND AI</span>
                  </div>
                  <span className="text-slate-650 font-bold">➔</span>
                  <div className="bg-slate-900 border border-slate-800 p-1.5 rounded flex-1">
                    <span className="text-[8px] text-slate-500 block">ACTIVE LIGHTS</span>
                    <span className="text-[10px] font-bold text-emerald-400">GREEN CORRIDOR</span>
                  </div>
                </div>
              </div>

              {/* KPI Comparator Section */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 border border-slate-850 p-3 rounded-lg font-mono">
                <div className="text-center p-1.5 bg-red-950/20 border border-red-900/25 rounded">
                  <span className="text-[8px] text-slate-500 block uppercase">Without AI</span>
                  <span className="text-sm font-black text-red-400">19 MIN</span>
                </div>
                <div className="text-center p-1.5 bg-emerald-950/20 border border-emerald-900/25 rounded">
                  <span className="text-[8px] text-slate-500 block uppercase">With AI Grid</span>
                  <span className="text-sm font-black text-emerald-400">8 MIN</span>
                </div>
                <div className="text-center p-1.5 bg-cyan-950/20 border border-cyan-900/25 rounded flex flex-col justify-center">
                  <span className="text-[8.5px] text-cyan-400 font-bold leading-tight">58% SAVINGS</span>
                  <span className="text-[7px] text-slate-500 leading-none mt-0.5">ETA REDUCTION</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg flex items-start gap-2.5">
                <div className="animate-ping h-2.5 w-2.5 rounded-full bg-pink-400 shrink-0 mt-1" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-slate-350 font-mono italic leading-relaxed">
                    "{selectedVehicle.recommendedAction}"
                  </span>
                </div>
              </div>

              {/* Progress bar simulation visual feedback */}
              {isSimulating && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-pink-400 font-semibold animate-pulse">OVERRIDING INTERSECTION SIGNALS...</span>
                    <span>{ticker}% STATED</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div className="h-full bg-pink-500 transition-all duration-75" style={{ width: `${ticker}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Launch override controls */}
            {!isSimulating ? (
              <button
                id={`btn-corridor-override-${selectedVehicle.id}`}
                onClick={() => handleSimulate(selectedVehicle.id)}
                className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-slate-950 font-mono text-xs shadow-[0_0_15px_rgba(236,72,153,0.3)] transition cursor-pointer"
              >
                DEPLOY GREEN CORRIDOR OVERRIDE AI
              </button>
            ) : (
              <div className="p-2.5 bg-pink-950/30 border border-pink-900/40 rounded-xl text-center text-xs font-mono text-pink-300 font-semibold flex items-center justify-center gap-1.5 shadow-md">
                <Sparkles className="w-4 h-4 text-pink-400 animate-spin" /> Emergency intercept actively flushing queue at targets.
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}
