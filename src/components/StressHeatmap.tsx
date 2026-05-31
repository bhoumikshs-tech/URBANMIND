import { useState } from 'react';
import { LocationData } from '../types';
import { HeartPulse, Megaphone, Skull, RotateCcw, Volume2, ShieldAlert } from 'lucide-react';

interface StressHeatmapProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
}

export default function StressHeatmap({ locations, selectedLocation, onSelectLocation }: StressHeatmapProps) {
  const activeLoc = selectedLocation || locations[0];

  // Dynamic weights representing live city sensors
  const [hornIntensity, setHornIntensity] = useState(82); // db/min
  const [stopGoRatio, setStopGoRatio] = useState(14); // count/km
  const [queueLength, setQueueLength] = useState(380); // meters

  // Calculate stress score based on parameters
  const calculatedStress = Math.min(
    100,
    Math.round(
      (activeLoc.avgDensity * 0.45) +
      (hornIntensity * 0.25) +
      ((stopGoRatio * 5) * 0.15) +
      ((queueLength / 6) * 0.15)
    )
  );

  const getStressDetails = (score: number) => {
    if (score > 75) return { category: 'Critical Stress Level', textColor: 'text-red-400', barColor: 'bg-red-500 shadow-[0_0_12px_#ef4444]', text: 'Unbearable congestion stress. Trigger dynamic route diversions to clear gridlock.' };
    if (score > 50) return { category: 'High Stress Level', textColor: 'text-purple-400', barColor: 'bg-purple-500 shadow-[0_0_12px_#a855f7]', text: 'High density combined with heavy signal latency. Commuter anxiety peaks.' };
    if (score > 25) return { category: 'Moderate Stress Level', textColor: 'text-yellow-400', barColor: 'bg-yellow-500 shadow-[0_0_12px_#eab308]', text: 'Normal flow with peak periodic stops. Underpass clearance levels standard.' };
    return { category: 'Low Stress Level', textColor: 'text-emerald-400', barColor: 'bg-emerald-500 shadow-[0_0_12px_#10b981]', text: 'Smooth arterial operations. Minimal acceleration variation.' };
  };

  const stressInfo = getStressDetails(calculatedStress);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-900/30">
            <HeartPulse className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Traffic Stress Heatmap
            </h3>
            <p className="text-xs text-indigo-400 font-mono">Module 04 • Decibel & Instability Pressure Matrix</p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Target Node: <span className="font-bold text-cyan-400">{activeLoc.name}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Instability Parameters Sliders (Left Column) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3.5 justify-between">
          <div className="text-xs font-mono text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Dynamic Telemetry Inputs
          </div>

          {/* Slider 1: Horn Intensity */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <Megaphone className="w-3 text-cyan-400" /> Horn Frequency Rate
              </span>
              <span className="text-slate-200 font-bold">{hornIntensity} db/min</span>
            </div>
            <input
              id="horn-intensity-slider"
              type="range"
              min="20"
              max="150"
              value={hornIntensity}
              onChange={(e) => setHornIntensity(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>

          {/* Slider 2: Stop-Go Cycles */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Stop-and-Go Frequency</span>
              <span className="text-slate-200 font-bold">{stopGoRatio} stops/km</span>
            </div>
            <input
              id="stop-go-slider"
              type="range"
              min="1"
              max="35"
              value={stopGoRatio}
              onChange={(e) => setStopGoRatio(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>

          {/* Slider 3: Queue length */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Backlog Gridlock Queue</span>
              <span className="text-slate-200 font-bold">{queueLength} meters</span>
            </div>
            <input
              id="queue-length-slider"
              type="range"
              min="10"
              max="800"
              value={queueLength}
              onChange={(e) => setQueueLength(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>

          <div className="text-[10px] font-mono text-slate-500 leading-normal border-t border-slate-800/40 pt-2">
            *Horn rates and stop frequencies are harvested automatically from spatial acoustic microphones and connected telematics loops.
          </div>
        </div>

        {/* Dynamic Stress Score Display Gauge (Right Column) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Synthesized Stress Index
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold font-mono text-indigo-400">
                {calculatedStress}
              </span>
              <span className="text-sm font-mono text-slate-500">
                /100 Index
              </span>
            </div>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${stressInfo.textColor}`}>
              {stressInfo.category}
            </span>
          </div>

          {/* Graphical Stress scale */}
          <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className={`h-full ${stressInfo.barColor} transition-all duration-300`} style={{ width: `${calculatedStress}%` }} />
          </div>

          {/* Descriptive advise box */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-lg flex gap-2.5 items-start">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-slate-300 leading-normal">
              {stressInfo.text}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
