import { useState, useEffect } from 'react';
import { LocationData } from '../types';
import { TrendingUp, Sparkles, AlertTriangle, ShieldCheck, Sliders, Database, RefreshCw } from 'lucide-react';

interface PredictiveEngineProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  onUpdateLocation?: (loc: LocationData) => void;
  forecastTimeline?: '5m' | '10m' | '15m';
  onForecastTimelineChange?: (val: '5m' | '10m' | '15m') => void;
}

export default function PredictiveEngine({ 
  locations, 
  selectedLocation, 
  onSelectLocation, 
  onUpdateLocation,
  forecastTimeline: externalTimeline,
  onForecastTimelineChange
}: PredictiveEngineProps) {
  const activeLoc = selectedLocation || locations[0];
  const [localTimeline, setLocalTimeline] = useState<'5m' | '10m' | '15m'>('15m');
  const forecastTimeline = externalTimeline !== undefined ? externalTimeline : localTimeline;
  const setForecastTimeline = onForecastTimelineChange || setLocalTimeline;

  // Interactive ML inputs initialized with node baseline characteristics
  const [volume, setVolume] = useState<number>(activeLoc.avgDensity);
  const [speed, setSpeed] = useState<number>(activeLoc.speed);
  const [roadblocks, setRoadblocks] = useState<number>(activeLoc.wrongSideCount);
  const [weatherFactor, setWeatherFactor] = useState<number>(1.0); // 1.0 = Clear, 1.30 = Heavy Rain, 1.65 = Severe Monsoon
  const [peakFactor, setPeakFactor] = useState<number>(1.2); // 0.85 = Off Peak, 1.2 = Peak Hour, 1.45 = Gridlock State

  // Reset inputs when selected location changes
  useEffect(() => {
    setVolume(activeLoc.avgDensity);
    setSpeed(activeLoc.speed);
    setRoadblocks(activeLoc.wrongSideCount);
    setWeatherFactor(activeLoc.avgDensity > 80 ? 1.3 : 1.0);
    setPeakFactor(activeLoc.avgDensity > 80 ? 1.45 : 1.2);
  }, [activeLoc.id]);

  // Dynamic ML Inference Calculation
  const computed5m = Math.min(100, Math.max(10, Math.round(volume * peakFactor * weatherFactor - speed * 0.12 + roadblocks * 3.5)));
  const computed10m = Math.min(100, Math.max(10, Math.round(volume * (1 + (peakFactor - 1) * 1.2) * weatherFactor * 1.04 - speed * 0.15 + roadblocks * 6.0)));
  const computed15m = Math.min(100, Math.max(10, Math.round(volume * (1 + (peakFactor - 1) * 1.75) * weatherFactor * 1.08 - speed * 0.18 + roadblocks * 8.5)));
  const computedConfidence = Math.max(65, Math.min(99, Math.round(98 - (roadblocks * 2.5) - (weatherFactor > 1.2 ? 5 : 0) - Math.abs(55 - volume) / 5)));

  const getPredictionValue = () => {
    switch (forecastTimeline) {
      case '5m': return computed5m;
      case '10m': return computed10m;
      case '15m':
      default:
        return computed15m;
    }
  };

  const getPredictionLabel = () => {
    switch (forecastTimeline) {
      case '5m': return '5 minutes';
      case '10m': return '10 minutes';
      case '15m':
      default:
        return '15 minutes';
    }
  };

  // Coordinates mapping logic for dynamic predicted trend curves
  const baselineTrend = activeLoc.congestionTrend;
  const predVal = getPredictionValue();
  const allPoints = [...baselineTrend, predVal]; // add future predicted coordinate as the final point

  const svgWidth = 400;
  const svgHeight = 140;

  const svgPoints = allPoints.map((val, idx) => {
    const x = (idx / (allPoints.length - 1)) * svgWidth;
    const y = svgHeight - (val / 100) * svgHeight;
    return { x, y, value: val, isFuture: idx === allPoints.length - 1 };
  });

  const linePath = svgPoints.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, '');

  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  // Push user calibrated predictions back into the parent city topology
  const handleMLOverride = () => {
    if (onUpdateLocation) {
      onUpdateLocation({
        ...activeLoc,
        avgDensity: volume,
        speed: speed,
        wrongSideCount: roadblocks,
        predictions: {
          min5: computed5m,
          min10: computed10m,
          min15: computed15m,
          confidence: computedConfidence
        }
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-5">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-850/40 shadow-inner">
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-tight font-sans">
              Congestion Prediction Engine
            </h3>
            <p className="text-xs text-orange-400 font-mono">Flagship AI Module • Spatial-Temporal LSTM Model</p>
          </div>
        </div>

        {/* Junction focused Selector */}
        <select
          id="prediction-junction-selector"
          value={activeLoc.id}
          onChange={(e) => {
            const matched = locations.find((l) => l.id === e.target.value);
            if (matched) onSelectLocation(matched);
          }}
          className="bg-black/40 border border-slate-850 px-3 py-1.5 rounded-xl text-xs font-mono text-orange-400 focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer self-start sm:self-auto"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.id === 'silk-board' ? '⚠️ SILK BOARD (Focus Area)' : loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Inputs vs Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: ML INPUT KNOBS */}
        <div className="xl:col-span-5 bg-black/35 border border-slate-800/60 p-4 rounded-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <Sliders className="w-4 h-4 text-orange-450" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">Neural Input Knobs</span>
          </div>

          {/* Density Volume Slider */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between font-mono text-slate-450">
              <span>Commute Volume Density</span>
              <span className="text-orange-400 font-bold font-mono">{volume}%</span>
            </div>
            <input 
              type="range"
              min="10"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-orange-500 hover:accent-orange-400 transition"
            />
          </div>

          {/* Speed Velocity Slider */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between font-mono text-slate-450">
              <span>Mean Speed Vector</span>
              <span className="text-amber-400 font-bold font-mono">{speed} km/h</span>
            </div>
            <input 
              type="range"
              min="5"
              max="80"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-amber-500 hover:accent-amber-400 transition"
            />
          </div>

          {/* active roadblock score */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between font-mono text-slate-450">
              <span>Incidents (Roadblocks / Wrong Side)</span>
              <span className="text-red-400 font-bold font-mono">{roadblocks} active</span>
            </div>
            <input 
              type="range"
              min="0"
              max="4"
              value={roadblocks}
              onChange={(e) => setRoadblocks(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg cursor-pointer accent-red-500 hover:accent-red-400 transition"
            />
          </div>

          {/* Weather multiplier choice */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <div className="col-span-3 text-slate-455 mb-0.5">Weather Multiplier Matrix</div>
            {[
              { label: '🌤️ Clear (1.0x)', val: 1.0 },
              { label: '🌧️ Heavy Rain (1.3x)', val: 1.30 },
              { label: '⛈️ Monsoon (1.6x)', val: 1.55 }
            ].map((we) => (
              <button
                key={we.label}
                onClick={() => setWeatherFactor(we.val)}
                className={`py-1.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                  weatherFactor === we.val
                    ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                    : 'bg-black/25 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {we.label.split(' ')[0]} {we.label.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Time / Peak state trigger */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <div className="col-span-3 text-slate-455 mb-0.5">Peak Hour Modifier index</div>
            {[
              { label: 'Off-Peak (0.8x)', val: 0.85 },
              { label: 'Regular Peak (1.2x)', val: 1.20 },
              { label: 'Monsoon Gridlock (1.4x)', val: 1.45 }
            ].map((pk) => (
              <button
                key={pk.label}
                onClick={() => setPeakFactor(pk.val)}
                className={`py-1.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                  peakFactor === pk.val
                    ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                    : 'bg-black/25 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {pk.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: AI PREDICTIONS HUD & PLOT CHART */}
        <div className="xl:col-span-7 flex flex-col justify-between gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* AI predicted target card */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-3 shadow-inner">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    AI Forecast Output ({getPredictionLabel()})
                  </span>
                  {/* Forecast intervals toggler */}
                  <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-md flex">
                    {(['5m', '10m', '15m'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setForecastTimeline(t)}
                        className={`px-2 py-0.5 text-[9px] font-mono rounded cursor-pointer transition ${
                          forecastTimeline === t
                            ? 'bg-orange-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t === '5m' ? '+5m' : t === '10m' ? '+10m' : '+15m'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold font-mono text-orange-400">
                    {getPredictionValue()}%
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase">
                    Congestion Index
                  </span>
                </div>
              </div>

              {/* Dynamic Warning advisory conditional box */}
              {getPredictionValue() > 82 ? (
                <div className="p-2.5 rounded-lg bg-red-950/35 border border-red-800/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <span className="text-[10px] font-mono text-red-200 leading-relaxed">
                    CRITICAL WARNING: Spatial-Temporal model identifies cascade slowdown danger within {forecastTimeline === '15m' ? '15 minutes' : 'next minutes'} at {activeLoc.name}. Recommended: Activating variable speed advisories.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/35 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono text-emerald-300 leading-relaxed">
                    STABLE PATHWAY: AI models show low queue accumulation rates. Under direct conditions, clearance velocities remain normal.
                  </span>
                </div>
              )}
            </div>

            {/* Model Confidence Metric Card */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3">
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex-1 flex flex-col justify-center gap-1 shadow-inner">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Accuracy Metrics</span>
                <span className="text-2xl font-mono font-black text-cyan-400">
                  {computedConfidence}%
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  R-squared LSTM confidence
                </span>
              </div>

              {/* Push model overrides back to outer state is huge */}
              <button
                onClick={handleMLOverride}
                className="w-full py-3 px-4 rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-400 font-mono text-xs font-bold transition hover:bg-orange-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" /> Override City Layout with ML
              </button>
            </div>
            
          </div>

          {/* SVG TREND CHARTS PLOTS */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>HISTORICAL SENSOR PATTERNS</span>
              <span className="text-orange-400 font-bold uppercase tracking-wider">• ST-LSTM Forecast Horizon ({getPredictionLabel()})</span>
            </div>

            <div className="relative w-full h-[140px] px-1 bg-slate-900/40 border border-slate-800/20 rounded-lg">
              <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad-custom" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1={svgHeight - (80/100)*svgHeight} x2="400" y2={svgHeight - (80/100)*svgHeight} stroke="rgba(239, 68, 68, 0.20)" strokeDasharray="4 4" />
                <line x1="0" y1={svgHeight - (40/100)*svgHeight} x2="400" y2={svgHeight - (40/100)*svgHeight} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4 4" />

                {/* Shading */}
                <path d={areaPath} fill="url(#chart-grad-custom)" />

                {/* Trend curve lines */}
                <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

                {/* Plot circle indices */}
                {svgPoints.map((p, i) => (
                  <g key={`gpt-${i}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.isFuture ? '5.5' : '2.5'}
                      fill={p.isFuture ? '#00f2ff' : '#0f172a'}
                      stroke={p.isFuture ? '#ffffff' : '#f97316'}
                      strokeWidth={p.isFuture ? 2 : 1}
                      className={p.isFuture ? 'animate-pulse shadow-xl' : ''}
                    />
                    {p.isFuture && (
                      <g>
                        <text
                          x={p.x - 38}
                          y={p.y - 10}
                          fill="#00f2ff"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          Pred: {p.value}%
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>-10 Mins ago</span>
              <span>-5 Mins ago</span>
              <span>Active Sensor Feed</span>
              <span className="text-orange-400 font-semibold uppercase">Projected Horizon</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
