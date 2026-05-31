import { useState, useEffect } from 'react';
import { LocationData } from '../types';
import { Compass, Sliders, Sparkles, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

interface PersonalityAIProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  onUpdateLocation?: (loc: LocationData) => void;
}

export default function PersonalityAI({ 
  locations, 
  selectedLocation, 
  onSelectLocation, 
  onUpdateLocation 
}: PersonalityAIProps) {
  const activeLoc = selectedLocation || locations[0];

  // Sliding behavior variables initialized to appropriate node characteristics
  const [suddenBraking, setSuddenBraking] = useState<number>(65);
  const [densitySpikes, setDensitySpikes] = useState<number>(55);
  const [laneSwitching, setLaneSwitching] = useState<number>(45);
  const [wrongSideMovement, setWrongSideMovement] = useState<number>(activeLoc.wrongSideCount);
  const [speedVariation, setSpeedVariation] = useState<number>(45);

  // Synchronize sliders whenever selected location updates
  useEffect(() => {
    // Map initial states beautifully
    setSuddenBraking(activeLoc.avgDensity > 80 ? 82 : activeLoc.avgDensity > 60 ? 64 : 42);
    setDensitySpikes(activeLoc.stressScore > 80 ? 86 : activeLoc.stressScore > 60 ? 68 : 36);
    setWrongSideMovement(activeLoc.wrongSideCount);
    setSpeedVariation(Math.max(10, Math.min(100, Math.round(85 - activeLoc.speed))));
    
    // Lane switching mapper
    const baseLane = activeLoc.personality === 'Chaotic' ? 88 
                   : activeLoc.personality === 'Aggressive' ? 72 
                   : activeLoc.personality === 'Unstable' ? 62 
                   : 28;
    setLaneSwitching(baseLane);
  }, [activeLoc.id]);

  // Analytical Behavioral Classifier Rule Base
  const classifyBehavior = (): 'Calm' | 'Aggressive' | 'Chaotic' | 'Unstable' => {
    // 1. Chaotic classification: Extreme wrong-side movement, or combination of severe lane shifting + braking
    if (wrongSideMovement > 11 || (laneSwitching > 75 && suddenBraking > 75)) {
      return 'Chaotic';
    }
    // 2. Aggressive: Reckless lane switching, high deceleration spikes, or heavy speed variance
    if (laneSwitching > 65 || suddenBraking > 68 || speedVariation > 70) {
      return 'Aggressive';
    }
    // 3. Unstable: Major density surges and flow-congestion swings
    if (densitySpikes > 65 || (speedVariation > 48 && densitySpikes > 48)) {
      return 'Unstable';
    }
    // 4. Calm: Balanced lane alignment and speed maintenance
    return 'Calm';
  };

  const currentClassification = classifyBehavior();

  // Traffic Personality Index (TPI) Composite Formulator (0-100)
  const computedTpi = Math.min(
    100,
    Math.round(
      (suddenBraking * 0.2) +
      (laneSwitching * 0.2) +
      (speedVariation * 0.2) +
      (densitySpikes * 0.2) +
      (Math.min(25, wrongSideMovement) * 4 * 0.2)
    )
  );

  // Styling attributes based on classifications
  const getPersonalityMeta = (cls: 'Calm' | 'Aggressive' | 'Chaotic' | 'Unstable') => {
    switch (cls) {
      case 'Chaotic':
        return {
          label: 'CHAOTIC BEHAVIOR',
          color: 'text-fuchsia-400',
          bg: 'bg-fuchsia-950/30 border-fuchsia-850 text-fuchsia-400',
          glow: 'rgba(217, 70, 239, 0.55)',
          svgColor: '#d946ef',
          desc: 'Flow exhibits dangerous wrong-side drift patterns, extreme lane-switching, and sudden braking. Immediate law enforcement intercept advised.'
        };
      case 'Aggressive':
        return {
          label: 'AGGRESSIVE PACE',
          color: 'text-orange-400',
          bg: 'bg-orange-950/30 border-orange-850 text-orange-400',
          glow: 'rgba(249, 115, 22, 0.5)',
          svgColor: '#f97316',
          desc: 'High acceleration variance and frequent overtaking maneuvers. Speed advisory limits recommended to mitigate slip road gridlock.'
        };
      case 'Unstable':
        return {
          label: 'UNSTABLE SWING',
          color: 'text-purple-400',
          bg: 'bg-purple-950/30 border-purple-850 text-purple-300',
          glow: 'rgba(168, 85, 247, 0.5)',
          svgColor: '#a855f7',
          desc: 'Highly volatile density accumulation spikes and unpredictable queue backups. Transit volume optimization threshold exceeded.'
        };
      case 'Calm':
      default:
        return {
          label: 'CALM / STABLE FLOW',
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/30 border-emerald-850 text-emerald-400',
          glow: 'rgba(16, 185, 129, 0.4)',
          svgColor: '#10b981',
          desc: 'Excellent lane-discipline adherence. Mean speeds match safety limits with uniform vehicular spacing.'
        };
    }
  };

  const meta = getPersonalityMeta(currentClassification);

  // Broadcast calculated behavior pattern back to outer cities representation
  const handlePersistClassification = () => {
    if (onUpdateLocation) {
      onUpdateLocation({
        ...activeLoc,
        personality: currentClassification,
        wrongSideCount: wrongSideMovement,
        stressScore: Math.round((densitySpikes + suddenBraking) / 2)
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-900/30 shadow-inner">
            <Compass className="w-5 h-5 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-tight font-sans">
              Traffic Personality AI
            </h3>
            <p className="text-xs text-pink-400 font-mono">Module 03 • Behavioral Road Profiling & TPI Engine</p>
          </div>
        </div>

        {/* Junction Selector */}
        <select
          id="personality-junction-selector"
          value={activeLoc.id}
          onChange={(e) => {
            const matched = locations.find((l) => l.id === e.target.value);
            if (matched) onSelectLocation(matched);
          }}
          className="bg-black/40 border border-slate-850 px-3 py-1.5 rounded-xl text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500/50 transition-all cursor-pointer self-start sm:self-auto"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.id === 'silk-board' ? '⚠️ SILK BOARD (Focus Area)' : loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid: Gauge vs Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Dynamic Personality Gauge Card (Left) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-805 p-5 rounded-xl flex flex-col items-center justify-between text-center gap-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899] animate-ping" />
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
          </div>

          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Traffic Personality Index (TPI)
          </span>

          {/* Symmetrical circle gauge panel */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full absolute transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                fill="none"
                stroke="rgba(30,41,59,0.4)"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                fill="none"
                stroke={meta.svgColor}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - computedTpi / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black font-mono tracking-tight" style={{ color: meta.svgColor }}>
                {computedTpi}
              </span>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">TPI INDEX</span>
            </div>
          </div>

          {/* Behavior Badge and Rules Explanation */}
          <div className="flex flex-col gap-2 items-center w-full">
            <span className={`px-3 py-1 text-xs font-mono font-black tracking-wider rounded border ${meta.bg}`}>
              {meta.label}
            </span>
            <p className="text-[10.5px] font-mono text-slate-400 leading-relaxed max-w-[280px]">
              {meta.desc}
            </p>
          </div>

          {/* Map persistence button */}
          <button
            onClick={handlePersistClassification}
            className="w-full py-2.5 px-4 rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-400 font-mono text-xs font-bold transition hover:bg-pink-500 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" /> Color-Code Central City Map
          </button>
        </div>

        {/* INPUT KNOBS SLIDERS (Right) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-805 p-4 rounded-xl flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-400" /> Profiler Pattern Array
            </span>
            <span className="text-[9px] font-mono text-slate-500">Telemetry inputs</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* 1. Sudden Braking Slider */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-slate-350">
                <span>Sudden Braking Deceleration</span>
                <span className="text-pink-400 font-bold">{suddenBraking}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={suddenBraking}
                onChange={(e) => setSuddenBraking(Number(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* 2. Density Spikes Slider */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-slate-350">
                <span>Density Surge / Queue Spikes</span>
                <span className="text-purple-400 font-bold">{densitySpikes}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={densitySpikes}
                onChange={(e) => setDensitySpikes(Number(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* 3. Lane Switching Slider */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-slate-350">
                <span>Lane Switching & Drifts</span>
                <span className="text-cyan-400 font-bold">{laneSwitching}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={laneSwitching}
                onChange={(e) => setLaneSwitching(Number(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* 4. Wrong-side Movement Slider */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-slate-350">
                <span>Wrong-Side Movement Incidents</span>
                <span className="text-red-400 font-bold">{wrongSideMovement} count</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={wrongSideMovement}
                onChange={(e) => setWrongSideMovement(Number(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* 5. Speed Variation Slider */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-mono text-slate-350">
                <span>Velocity Variation Standard Deviation</span>
                <span className="text-yellow-400 font-bold">{speedVariation}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={speedVariation}
                onChange={(e) => setSpeedVariation(Number(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-yellow-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
            <p className="text-[10px] font-mono text-slate-500 italic leading-relaxed">
              *Adjust parameter weights to observe classifier changes instantly. Persist to reflect on map layer.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-pink-400 font-bold bg-pink-950/20 px-2 py-0.5 rounded border border-pink-900/30 shrink-0">
              <Sparkles className="w-3" /> Classifier Active
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
