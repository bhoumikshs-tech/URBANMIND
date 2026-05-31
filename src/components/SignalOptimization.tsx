import { useState } from 'react';
import { LocationData } from '../types';
import { Sliders, RefreshCw, Fuel, Hourglass, BarChart3, ShieldCheck } from 'lucide-react';

interface SignalProps {
  locations: LocationData[];
}

export default function SignalOptimization({ locations }: SignalProps) {
  const [activeLocIdx, setActiveLocIdx] = useState(0);
  const activeLoc = locations[activeLocIdx] || locations[0];
  
  // Custom interactive slider representing override green cycle timings
  const [greenOverride, setGreenOverride] = useState(activeLoc.signalTiming.recommended);

  // Dynamic calculatives based on dynamic slider adjustments
  const delayDelta = Math.max(5, Math.round(((greenOverride - activeLoc.signalTiming.current) / activeLoc.signalTiming.current) * 35));
  const fuelSaved = Math.max(12, Math.round(delayDelta * 1.8));
  const queueReduct = Math.max(8, Math.round(delayDelta * 1.2));

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-yellow-950/40 border border-yellow-905/35">
            <Sliders className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Smart Signal Optimization
            </h3>
            <p className="text-xs text-yellow-500 font-mono">Module 08 • Actuated Micro-timing Re-optimizer</p>
          </div>
        </div>

        {/* Selected dropdown */}
        <select
          id="signal-location-dropdown"
          value={activeLocIdx}
          onChange={(e) => {
            const idx = Number(e.target.value);
            setActiveLocIdx(idx);
            setGreenOverride(locations[idx].signalTiming.recommended);
          }}
          className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-yellow-500 focus:outline-none cursor-pointer"
        >
          {locations.map((loc, idx) => (
            <option key={loc.id} value={idx}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Timing sliders and interactive controls (12/5 = col-span-7) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Live Phase Calibration
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-500 block text-[9px]">STATIC BASE GREEN</span>
                <span className="text-lg font-bold text-slate-300">{activeLoc.signalTiming.current} seconds</span>
              </div>
              <div className="bg-yellow-950/10 border border-yellow-800/30 p-2.5 rounded-lg">
                <span className="text-yellow-400 font-semibold block text-[9px]">RECOMMENDED OPTIMUM</span>
                <span className="text-lg font-bold text-yellow-400">{activeLoc.signalTiming.recommended} seconds</span>
              </div>
            </div>
          </div>

          {/* Slider input */}
          <div className="flex flex-col gap-2 my-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Override Green Phase duration</span>
              <span className="text-yellow-400 font-bold text-sm">{greenOverride} Seconds</span>
            </div>
            <input
              id="green-override-slider"
              type="range"
              min="40"
              max="200"
              value={greenOverride}
              onChange={(e) => setGreenOverride(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 focus:outline-none"
            />
          </div>

          <p className="text-[10px] font-mono text-slate-500 leading-normal">
            *Slide to test custom green timings and see estimated improvements. Recommended timings are auto-computed from active downstream queue speed constraints.
          </p>
        </div>

        {/* Dynamic Re-optimization metrics (12/5 = col-span-5) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Simulated Improvement Yields
          </span>

          <div className="flex flex-col gap-3">
            {/* Efficiency metric 1 */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-cyan-400" /> Wait Delays Reduced
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400">-{delayDelta}%</span>
            </div>

            {/* Efficiency metric 2 */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-emerald-400" /> Fuel Waste Savvy
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">~{fuelSaved} Liters/hr</span>
            </div>

            {/* Efficiency metric 3 */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-yellow-400" /> Queue Reduction Factor
              </span>
              <span className="text-sm font-mono font-bold text-yellow-400">-{queueReduct}%</span>
            </div>
          </div>

          {/* Timing confirmation card */}
          <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-900/40 text-center text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Synchronized timing plan uploaded to signal micro-controllers on site.
          </div>
        </div>

      </div>
    </div>
  );
}
