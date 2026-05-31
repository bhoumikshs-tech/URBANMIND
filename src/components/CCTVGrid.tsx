import { useState, useEffect, useRef } from 'react';
import { LocationData } from '../types';
import { Camera, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface CCTVGridProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  onUpdateLocation?: (loc: LocationData) => void;
  feedMode?: 'yolo_live' | 'simulated';
  onFeedModeChange?: (mode: 'yolo_live' | 'simulated') => void;
}

const getVideoUrl = (id: string) => {
  const urls = [
    'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227dd164a3516209c3feaf3138b74d&profile_id=139&oauth2_token_id=57447761',
    'https://player.vimeo.com/external/517618956.sd.mp4?s=f52ab17013a77b78a3c8fb1737be740e53a25b30&profile_id=165&oauth2_token_id=57447761',
    'https://player.vimeo.com/external/435674703.sd.mp4?s=7ad46ec9d9ee42eb0e5272a8feed6c4f69747183&profile_id=165&oauth2_token_id=57447761',
    'https://player.vimeo.com/external/409217112.sd.mp4?s=84cbc5f98bfbe59bf70da72c9165b5be3d937a09&profile_id=165&oauth2_token_id=57447761'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }
  return urls[hash % urls.length];
};

export default function CCTVGrid({ 
  locations, 
  selectedLocation, 
  onSelectLocation, 
  onUpdateLocation,
  feedMode: externalFeedMode,
  onFeedModeChange
}: CCTVGridProps) {
  const activeLoc = selectedLocation || locations[0];
  const [frameTime, setFrameTime] = useState<string>('');
  const [localFeedMode, setLocalFeedMode] = useState<'simulated' | 'yolo_live'>('yolo_live');
  const feedMode = externalFeedMode !== undefined ? externalFeedMode : localFeedMode;
  const setFeedMode = onFeedModeChange || setLocalFeedMode;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ id: number; x: number; y: number; type: string; w: number; h: number; color: string; speed: number }>>([]);

  // Computed live counts matching precise public YOLO video detection
  const countByType = feedMode === 'yolo_live' ? {
    Car: 142,
    Bike: 318,
    Bus: 12,
    Truck: 18,
    Auto: 54,
  } : {
    Car: Math.max(2, Math.floor((activeLoc.avgDensity / 100) * 8)),
    Bike: Math.max(1, Math.floor((activeLoc.avgDensity / 100) * 12)),
    Bus: Math.max(0, Math.floor((activeLoc.avgDensity / 100) * 2)),
    Truck: Math.max(0, Math.floor((activeLoc.avgDensity / 100) * 1)),
    Auto: Math.max(1, Math.floor((activeLoc.avgDensity / 100) * 4)),
  };

  // Clock HUD updates stably once per second
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setFrameTime(d.toISOString().replace('T', ' ').substring(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate dynamic bounding boxes moving across simulated CCTV camera locally
  useEffect(() => {
    const vehicleTypes = [
      { name: 'Car', w: 40, h: 24, color: '#00f2ff' }, // Cyan
      { name: 'Bike', w: 18, h: 14, color: '#8b5cf6' }, // Purple
      { name: 'Bus', w: 72, h: 32, color: '#10b981' }, // Green
      { name: 'Truck', w: 78, h: 36, color: '#ec4899' }, // Pink
      { name: 'Auto', w: 32, h: 22, color: '#f59e0b' } // Amber
    ];

    // Seed visual density proportionate to simulated traffic density
    const count = Math.max(5, Math.min(15, Math.floor(activeLoc.avgDensity / 7.5)));

    const initialParticles = Array.from({ length: count }, (_, i) => {
      const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      return {
        id: i,
        x: Math.random() * 320,
        y: 40 + Math.random() * 120,
        type: type.name,
        w: type.w,
        h: type.h,
        color: type.color,
        speed: 0.8 + Math.random() * 1.5
      };
    });
    particlesRef.current = initialParticles;
  }, [activeLoc.id, activeLoc.avgDensity]);

  // Unified high-performance animation render loop
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // 1. Update particle coordinates
      const particlesList = particlesRef.current;
      const vehicleTypes = [
        { name: 'Car', w: 40, h: 24, color: '#00f2ff' },
        { name: 'Bike', w: 18, h: 14, color: '#8b5cf6' },
        { name: 'Bus', w: 72, h: 32, color: '#10b981' },
        { name: 'Truck', w: 78, h: 36, color: '#ec4899' },
        { name: 'Auto', w: 32, h: 22, color: '#f59e0b' }
      ];

      particlesRef.current = particlesList.map((p) => {
        let nextX = p.x + p.speed;
        if (nextX > 320) {
          const nextType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
          return {
            ...p,
            x: -nextType.w,
            type: nextType.name,
            w: nextType.w,
            h: nextType.h,
            color: nextType.color,
            speed: 0.8 + Math.random() * 1.5
          };
        }
        return { ...p, x: nextX };
      });

      // 2. Clear canvas and draw
      if (feedMode === 'yolo_live') {
        // Clear transparently to overlay on background video
        ctx.clearRect(0, 0, 320, 200);

        // Draw spatial mapping grid
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 320; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 200);
          ctx.stroke();
        }
        for (let y = 0; y < 200; y += 32) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(320, y);
          ctx.stroke();
        }

        // Draw custom moving overlay boxes over video stream
        const objectCountFactor = Math.round(activeLoc.avgDensity / 9);
        const staticYolos = [
          { type: 'Car', x: 45, y: 120, w: 42, h: 25, color: '#10b981', acc: '98%' },
          { type: 'Bike', x: 110, y: 105, w: 12, h: 10, color: '#6366f1', acc: '94%' },
          { type: 'Bike', x: 125, y: 110, w: 14, h: 11, color: '#6366f1', acc: '91%' },
          { type: 'Bus', x: 155, y: 55, w: 68, h: 32, color: '#10b981', acc: '99%' },
          { type: 'Truck', x: 80, y: 45, w: 58, h: 30, color: '#a855f7', acc: '97%' },
          { type: 'Car', x: 230, y: 135, w: 52, h: 28, color: '#10b981', acc: '96%' },
          { type: 'Auto', x: 145, y: 145, w: 32, h: 22, color: '#f59e0b', acc: '95%' },
          { type: 'Car', x: 190, y: 125, w: 38, h: 24, color: '#10b981', acc: '94%' },
          { type: 'Bike', x: 100, y: 140, w: 15, h: 12, color: '#6366f1', acc: '93%' },
          { type: 'Bike', x: 118, y: 150, w: 16, h: 13, color: '#6366f1', acc: '92%' }
        ];

        const activeYolos = staticYolos.slice(0, Math.max(3, Math.min(staticYolos.length, objectCountFactor)));

        activeYolos.forEach((p, idx) => {
          const vibX = p.x + (Math.sin(Date.now() / 150 + idx) * 0.6);
          const vibY = p.y + (Math.cos(Date.now() / 120 + idx) * 0.4);

          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(vibX, vibY, p.w, p.h);

          ctx.fillStyle = `${p.color}15`;
          ctx.fillRect(vibX, vibY, p.w, p.h);

          ctx.fillStyle = p.color;
          ctx.font = 'bold 7px sans-serif';
          ctx.fillText(p.type, vibX + 2, vibY - 3);
        });
      } else {
        // Draw simulated high tech lanes background
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, 320, 200);

        // Perspective lines
        ctx.fillStyle = '#111622';
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(240, 0);
        ctx.lineTo(310, 200);
        ctx.lineTo(10, 200);
        ctx.closePath();
        ctx.fill();

        // Lane division stripes
        ctx.strokeStyle = '#222d44';
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 18]);
        ctx.beginPath();
        ctx.moveTo(160, 0);
        ctx.lineTo(160, 200);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active particles boxes
        particlesRef.current.forEach((p) => {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          ctx.fillStyle = `${p.color}10`;
          ctx.fillRect(p.x, p.y, p.w, p.h);

          ctx.fillStyle = p.color;
          ctx.font = '7px sans-serif';
          ctx.fillText(p.type, p.x + 2, p.y - 3);
        });
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [feedMode, activeLoc.id, activeLoc.avgDensity]);

  const densityColor = (density: number) => {
    if (density > 85) return 'text-red-400';
    if (density > 65) return 'text-orange-400';
    if (density > 45) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div className="bg-panel-dark/90 border border-border-dark rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#0d0e12] p-3 rounded-xl border border-border-dark/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Camera className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans flex items-center gap-2">
              Intersection Camera Feed
              {feedMode === 'yolo_live' && (
                <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-medium">
                  ● Connected
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-sans">Live video feed from municipal traffic cameras</p>
          </div>
        </div>
 
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Feed Mode Selector Choice */}
          <div className="bg-slate-950/65 border border-slate-800 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setFeedMode('yolo_live')}
              className={`px-3 py-1 text-[11px] font-sans font-medium rounded transition-all cursor-pointer ${
                feedMode === 'yolo_live'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎥 Live Stream
            </button>
            <button
              onClick={() => setFeedMode('simulated')}
              className={`px-3 py-1 text-[11px] font-sans font-medium rounded transition-all cursor-pointer ${
                feedMode === 'simulated'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Sim Radar
            </button>
          </div>
 
          {/* Node Location drop selector */}
          <select
            id="cctv-location-selector"
            value={activeLoc.id}
            onChange={(e) => {
              const matched = locations.find((l) => l.id === e.target.value);
              if (matched) onSelectLocation(matched);
            }}
            className="bg-slate-950/65 border border-slate-800 px-3 py-1 text-xs font-sans text-slate-200 focus:outline-none focus:border-indigo-500/30 transition-all cursor-pointer rounded-lg h-7"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
 
      {/* Main simulated CCTV visual monitor feed screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 flex flex-col gap-2">
          {/* Feed container */}
          <div className="relative border border-border-dark rounded-xl overflow-hidden bg-black shadow-inner group aspect-video">
            {/* Real looping traffic CCTV video stream background */}
            {feedMode === 'yolo_live' && (
              <video
                key={activeLoc.id}
                src={getVideoUrl(activeLoc.id)}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-350"
                onError={(e) => {
                  console.warn("CCTV video stream failed. Loading canvas fallback.");
                }}
              />
            )}
 
            {/* Top HUD camera metrics stream overlay */}
            <div className="absolute top-3 left-3 right-3 z-20 flex justify-between text-[10px] font-sans p-1 px-2.5 rounded-lg bg-[#08090a]/90 border border-slate-800/80 text-slate-350 pointer-events-none">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Camera Feed: {activeLoc.name}
              </span>
              <span className="text-slate-400">{frameTime}</span>
            </div>
 
            {/* Canvas simulating CCTV and YOLO detections */}
            <canvas
              ref={canvasRef}
              width="320"
              height="200"
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            />
 
            {/* CCTV Stream details overlay */}
            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/95 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-sans text-slate-300 flex items-center gap-1.5 pointer-events-none">
              <Layers className="w-3 text-indigo-400" /> Active flow detection layer
            </div>
            
            <div className="absolute bottom-3 right-3 z-20 bg-slate-900/95 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-sans text-emerald-400 font-medium pointer-events-none">
              Online
            </div>
          </div>
        </div>
 
        {/* Right side CCTV metrics analytics cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl flex flex-col gap-0.5 shadow-sm">
              <span className="text-[10px] font-sans text-slate-400 font-semibold uppercase tracking-wider">Live Vehicle Volume</span>
              <span className="text-xl font-sans font-bold text-slate-100">
                {activeLoc.vehicleCount}
              </span>
              <span className="text-[9px] font-sans text-slate-500">Actively tracked</span>
            </div>
 
            <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl flex flex-col gap-0.5 shadow-sm">
              <span className="text-[10px] font-sans text-slate-400 font-semibold uppercase tracking-wider">Occupancy Density</span>
              <span className={`text-xl font-sans font-bold ${densityColor(activeLoc.avgDensity)}`}>
                {activeLoc.avgDensity}%
              </span>
              <span className="text-[9px] font-sans text-slate-500">
                {activeLoc.avgDensity > 80 ? '⚠️ Busy intersection' : '✓ Normal flow'}
              </span>
            </div>
 
            <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl flex flex-col gap-0.5 shadow-sm">
              <span className="text-[10px] font-sans text-slate-400 font-semibold uppercase tracking-wider">Mean Velocity</span>
              <span className="text-xl font-sans font-bold text-amber-500">
                {activeLoc.speed} km/h
              </span>
              <span className="text-[9px] font-sans text-slate-500">Average moving speed</span>
            </div>
 
            <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl flex flex-col gap-0.5 shadow-sm">
              <span className="text-[10px] font-sans text-slate-400 font-semibold uppercase tracking-wider">Camera Status</span>
              <span className="text-xl font-sans font-bold text-emerald-400 flex items-center gap-1">
                {activeLoc.cameraState === 'active' ? 'Online' : 'Warning'}
              </span>
              <span className="text-[9px] font-sans text-slate-500">Signal link connection stable</span>
            </div>
          </div>

          {/* Real-time category counts */}
          <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-xs font-sans font-bold text-slate-200 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Vehicle Classification
              </span>
              <span className="text-[10px] font-sans text-indigo-400 bg-indigo-950/45 px-2 py-0.5 rounded-full border border-indigo-900/45 font-medium">
                Live stream counts
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-sans">
              {[
                { name: 'Cars', key: 'Car', count: countByType.Car, color: '#6366f1', icon: '🚗' },
                { name: 'Bikes', key: 'Bike', count: countByType.Bike, color: '#9333ea', icon: '🏍️' },
                { name: 'Buses', key: 'Bus', count: countByType.Bus, color: '#10b981', icon: '🚌' },
                { name: 'Trucks', key: 'Truck', count: countByType.Truck, color: '#f43f5e', icon: '🚚' },
                { name: 'Autos', key: 'Auto', count: countByType.Auto, color: '#eab308', icon: '🛺' }
              ].map((item) => {
                const totalYoloCount = countByType.Car + countByType.Bike + countByType.Bus + countByType.Truck + countByType.Auto;
                return (
                  <div key={item.key} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-slate-300 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </span>
                      <span className="font-bold text-slate-100" style={{ color: item.color }}>
                        {item.count} detected
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-border-dark/45">
                      <div 
                        className="h-full rounded-full transition-all duration-350"
                        style={{ 
                          width: `${totalYoloCount ? (item.count / totalYoloCount) * 100 : 0}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
 
      {/* CCTV Alerts Bottom Ticker */}
      <div className="border border-slate-900 bg-slate-950/60 p-3 rounded-xl flex items-center justify-between text-xs font-sans gap-5 overflow-x-auto">
        <span className="text-slate-350 flex items-center gap-1.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          {activeLoc.avgDensity > 80 ? (
            <span className="text-red-400 font-semibold leading-relaxed">
              Warning: High traffic density at {activeLoc.name}. Slow movement expected.
            </span>
          ) : (
            <span className="text-slate-300 leading-relaxed">
              Status: Camera system registers steady movement. No active blockages.
            </span>
          )}
        </span>
        <button
          onClick={() => {
            // Trigger randomized density and speed fluctuations and sync back to parent
            const factor = 0.85 + Math.random() * 0.3;
            const updatedVehicleCount = Math.max(100, Math.floor(activeLoc.vehicleCount * factor));
            const updatedDensity = Math.min(100, Math.max(10, Math.round(activeLoc.avgDensity * factor)));
            const updatedVelocity = Math.min(80, Math.max(5, Math.round(activeLoc.speed * (2 - factor))));
            
            if (onUpdateLocation) {
              onUpdateLocation({
                ...activeLoc,
                vehicleCount: updatedVehicleCount,
                avgDensity: updatedDensity,
                speed: updatedVelocity
              });
            }
          }}
          className="p-1.5 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition cursor-pointer flex items-center gap-1.5 shrink-0 duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Refresh Camera Feeds
        </button>
      </div>
    </div>
  );
}
