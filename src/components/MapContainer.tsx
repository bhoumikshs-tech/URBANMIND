import React, { useState, useEffect } from 'react';
import { LocationData, TabId, EmergencyVehicle } from '../types';
import { MAP_CONNECTIONS } from '../constants';
import { ShieldAlert, Compass, Eye, HeartPulse, Activity, Flame, Ambulance } from 'lucide-react';

interface MapContainerProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  activeLayer: 'traffic' | 'congestion' | 'stress' | 'violations' | 'emergency' | 'personality';
  onLayerChange: (layer: 'traffic' | 'congestion' | 'stress' | 'violations' | 'emergency' | 'personality') => void;
  emergencyVehicles: EmergencyVehicle[];
}

export default function MapContainer({
  locations,
  selectedLocation,
  onSelectLocation,
  activeLayer,
  onLayerChange,
  emergencyVehicles
}: MapContainerProps) {
  const [pulse, setPulse] = useState(0);

  // Background grid and path particle animation timer
  useEffect(() => {
    const handle = setInterval(() => {
      setPulse((prev) => (prev + 1.5) % 100);
    }, 45);
    return () => clearInterval(handle);
  }, []);

  // Helper to color lines based on active layer criteria
  const getLineStyles = (fromNode: LocationData, toNode: LocationData) => {
    const avgScore = (fromNode.avgDensity + toNode.avgDensity) / 2;
    const avgStress = (fromNode.stressScore + toNode.stressScore) / 2;
    
    switch (activeLayer) {
      case 'congestion':
        const predScore = (fromNode.predictions.min15 + toNode.predictions.min15) / 2;
        if (predScore > 85) return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' };
        if (predScore > 65) return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' };
        return { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' };
        
      case 'stress':
        if (avgStress > 85) return { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.7)' }; // purple high stress
        if (avgStress > 60) return { stroke: '#ec4899', glow: 'rgba(236, 72, 153, 0.5)' }; // pink
        return { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' };
        
      case 'violations':
        const totalViols = fromNode.wrongSideCount + toNode.wrongSideCount;
        if (totalViols > 20) return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)' };
        return { stroke: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' };

      case 'emergency':
        // Highlight active emergency routes
        const isEmRoute = emergencyVehicles.some(ev => {
          if (!ev.isActive) return false;
          const fromIdx = ev.route.indexOf(fromNode.id);
          const toIdx = ev.route.indexOf(toNode.id);
          return fromIdx !== -1 && toIdx !== -1 && Math.abs(fromIdx - toIdx) === 1;
        });
        if (isEmRoute) return { stroke: '#ec4899', glow: 'rgba(236, 72, 153, 0.9)', width: 5 };
        return { stroke: '#1e293b', glow: 'rgba(30, 41, 59, 0.2)' };

      case 'personality':
        const behaviors = [fromNode.personality, toNode.personality];
        if (behaviors.includes('Chaotic')) {
          return { stroke: '#d946ef', glow: 'rgba(217, 70, 239, 0.6)' };
        } else if (behaviors.includes('Aggressive')) {
          return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' };
        } else if (behaviors.includes('Unstable')) {
          return { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' };
        } else {
          return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
        }

      case 'traffic':
      default:
        if (avgScore > 85) return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.7)' }; // red
        if (avgScore > 70) return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' }; // orange
        if (avgScore > 50) return { stroke: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' }; // yellow
        return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }; // green
    }
  };

  const getMarkerColor = (loc: LocationData) => {
    switch (activeLayer) {
      case 'congestion':
        const pred = loc.predictions.min15;
        if (pred > 85) return 'bg-red-500 shadow-[0_0_12px_#ef4444]';
        if (pred > 65) return 'bg-orange-500 shadow-[0_0_12px_#f97316]';
        return 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]';
      case 'stress':
        const s = loc.stressScore;
        if (s > 80) return 'bg-purple-500 shadow-[0_0_12px_#a855f7]';
        if (s > 60) return 'bg-pink-500 shadow-[0_0_12px_#ec4899]';
        return 'bg-blue-500 shadow-[0_0_12px_#3b82f6]';
      case 'violations':
        const viols = loc.wrongSideCount + loc.helmetViolationCount;
        if (viols > 35) return 'bg-rose-500 shadow-[0_0_12px_#f43f5e]';
        return 'bg-amber-500 shadow-[0_0_12px_#fbbf24]';
      case 'personality':
        if (loc.personality === 'Chaotic') return 'bg-fuchsia-500 shadow-[0_0_12px_#d946ef]';
        if (loc.personality === 'Aggressive') return 'bg-orange-500 shadow-[0_0_12px_#f97316]';
        if (loc.personality === 'Unstable') return 'bg-purple-500 shadow-[0_0_12px_#a855f7]';
        return 'bg-emerald-500 shadow-[0_0_12px_#10b981]'; // Calm
      case 'emergency':
        const hasAmbulance = emergencyVehicles.some(ev => ev.isActive && ev.route[ev.currentPositionIdx] === loc.id);
        if (hasAmbulance) return 'bg-pink-500 animate-ping shadow-[0_0_15px_#ec4899]';
        return 'bg-slate-500 shadow-none';
      case 'traffic':
      default:
        const sc = loc.avgDensity;
        if (sc > 85) return 'bg-red-500 shadow-[0_0_15px_#ef4444] animate-pulse';
        if (sc > 70) return 'bg-orange-500 shadow-[0_0_12px_#f97316]';
        if (sc > 50) return 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
        return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
    }
  };

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] rounded-2xl overflow-hidden bg-[#050607] border border-slate-900 shadow-[inset_0_2px_20px_rgba(0,0,0,0.9)]">
      {/* Absolute Header overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-4 font-sans">
        <span className="px-3 py-1 text-[11px] font-semibold tracking-wider text-indigo-400 rounded-md border border-slate-800 bg-[#08090a]/90 backdrop-blur-md shadow-lg flex items-center gap-1.5 uppercase">
          <Activity className="w-3" /> Area: Central Bengaluru Map
        </span>
        <span className="px-3 py-1 text-[11px] text-slate-400 rounded-md border border-slate-800 bg-[#08090a]/70 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sensors: Online
        </span>
      </div>

      {/* Map Layer Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap justify-between items-center gap-2 pointer-events-none font-sans">
        <div className="bg-[#050607]/95 border border-slate-900 p-1.5 rounded-xl backdrop-blur-md flex gap-1 shadow-2xl pointer-events-auto overflow-x-auto max-w-full">
          {[
            { id: 'traffic', label: 'Flow', icon: Activity, color: 'text-emerald-400' },
            { id: 'congestion', label: 'Prediction', icon: Eye, color: 'text-orange-400' },
            { id: 'stress', label: 'Stress Heat', icon: HeartPulse, color: 'text-violet-400' },
            { id: 'violations', label: 'Violations', icon: ShieldAlert, color: 'text-rose-400' },
            { id: 'emergency', label: 'Emergency', icon: Ambulance, color: 'text-pink-400' },
            { id: 'personality', label: 'Behavior', icon: Compass, color: 'text-teal-400' }
          ].map((layer) => {
            const Icon = layer.icon;
            const active = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                id={`map-layer-btn-${layer.id}`}
                onClick={() => onLayerChange(layer.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all outline-none duration-200 cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                <span className="hidden sm:inline">{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Legend Panel */}
        <div className="hidden sm:flex bg-[#050607]/95 border border-slate-900 px-3 py-2 rounded-xl backdrop-blur-md items-center gap-4 text-[11px] text-slate-400 shadow-2xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Clear
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Heavy
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Congested
          </div>
          {activeLayer === 'stress' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-purple"></span> High Stress
            </div>
          )}
          {activeLayer === 'personality' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Chaotic Road
            </div>
          )}
        </div>
      </div>

      {/* SVG Vector Drawing */}
      <div className="w-full h-full absolute inset-0 select-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Futuristic blueprint matrix lines */}
          <defs>
            <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(30,41,59,0.18)" strokeWidth="0.5" />
            </pattern>
            {/* Pulsing linear gradients for roads */}
            <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
            
            {/* Filter to create neon bloom glow */}
            <filter id="neon-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Matrix Grid overlay */}
          <rect width="100" height="100" fill="url(#grid-pattern)" />

          {/* Ambient center radial shading */}
          <circle cx="50" cy="50" r="40" fill="radial-gradient(circle, rgba(15,23,42,0) 0%, rgba(2,6,23,1) 100%)" opacity="0.3" />

          {/* Draw Roads / Connectors first */}
          {MAP_CONNECTIONS.map((conn, idx) => {
            const fromLoc = locations.find(l => l.id === conn.from);
            const toLoc = locations.find(l => l.id === conn.to);
            if (!fromLoc || !toLoc) return null;

            const styles = getLineStyles(fromLoc, toLoc);

            return (
              <React.Fragment key={`road-${idx}`}>
                {/* Glow layer underneath */}
                <line
                  x1={fromLoc.lng}
                  y1={fromLoc.lat}
                  x2={toLoc.lng}
                  y2={toLoc.lat}
                  stroke={styles.stroke}
                  strokeWidth={styles.width ? styles.width + 4 : 5}
                  strokeLinecap="round"
                  opacity={0.15}
                  style={{ filter: 'blur(3px)' }}
                />
                {/* Primary road core */}
                <line
                  x1={fromLoc.lng}
                  y1={fromLoc.lat}
                  x2={toLoc.lng}
                  y2={toLoc.lat}
                  stroke={styles.stroke}
                  strokeWidth={styles.width || 1.8}
                  strokeLinecap="round"
                  opacity={0.8}
                />

                {/* Animated speed flow particles along the road */}
                {activeLayer !== 'emergency' && (
                  <circle
                    cx={fromLoc.lng + (toLoc.lng - fromLoc.lng) * (pulse / 100)}
                    cy={fromLoc.lat + (toLoc.lat - fromLoc.lat) * (pulse / 100)}
                    r="0.8"
                    fill={styles.stroke === '#10b981' ? '#34d399' : (styles.stroke === '#ef4444' ? '#fca5a5' : '#67e8f9')}
                    filter="url(#neon-glow)"
                  />
                )}
                {activeLayer !== 'emergency' && (
                  <circle
                    cx={fromLoc.lng + (toLoc.lng - fromLoc.lng) * (((pulse + 50) % 100) / 100)}
                    cy={fromLoc.lat + (toLoc.lat - fromLoc.lat) * (((pulse + 50) % 100) / 100)}
                    r="0.8"
                    fill={styles.stroke === '#10b981' ? '#34d399' : (styles.stroke === '#ef4444' ? '#fca5a5' : '#67e8f9')}
                    filter="url(#neon-glow)"
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Emergency vehicles active animation */}
          {activeLayer === 'emergency' && emergencyVehicles.map((ev) => {
            if (!ev.isActive) return null;
            // Draw active routing path
            const pathPoints = ev.route.map(rid => locations.find(l => l.id === rid)).filter(Boolean) as LocationData[];
            if (pathPoints.length < 2) return null;

            // Calculate precise animation segment based on vehicle index
            const currentLoc = pathPoints[ev.currentPositionIdx];
            const nextLoc = pathPoints[ev.currentPositionIdx + 1] || currentLoc;

            // Simple movement simulation using sinusoidal bounce
            const progress = (pulse % 100) / 100;
            const curLng = currentLoc.lng + (nextLoc.lng - currentLoc.lng) * progress;
            const curLat = currentLoc.lat + (nextLoc.lat - currentLoc.lat) * progress;
            
            return (
              <React.Fragment key={`ev-marker-${ev.id}`}>
                {/* Emergency beacon pulse ring */}
                <circle
                  cx={curLng}
                  cy={curLat}
                  r="4"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="0.5"
                  opacity={(100 - pulse) / 100}
                />
                {/* Micro emergency vehicle dot */}
                <circle
                  cx={curLng}
                  cy={curLat}
                  r="1.6"
                  fill="#f43f5e"
                  filter="url(#neon-glow)"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Render Interactive DOM Markers Over Grid Map */}
        {locations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          
          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              style={{
                position: 'absolute',
                top: `${loc.lat}%`,
                left: `${loc.lng}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 group cursor-pointer transition-all duration-300"
            >
              {/* Outer hover rings */}
              <div className={`p-1.5 rounded-full transition-all duration-300 ${
                isSelected 
                  ? 'bg-cyan-500/10 border-2 border-cyan-400 rotate-45 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border border-transparent group-hover:scale-105'
              }`}>
                {/* Core flashing status indicator dot */}
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${getMarkerColor(loc)}`} />
              </div>

              {/* Float hover text HUD node metadata */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-slate-900/90 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono font-medium text-slate-100 backdrop-blur-sm pointer-events-none group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5 ${
                isSelected ? 'opacity-100 border-cyan-500/50 shadow-md' : 'opacity-0'
              }`}>
                <span className="font-semibold text-slate-200">{loc.name}</span>
                <span className="text-[9px] text-slate-400 flex items-center gap-1">
                  Speed: <span className="text-cyan-400 font-bold">{loc.speed} km/h</span> | Density: <span className="text-orange-400 font-bold">{loc.avgDensity}%</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
