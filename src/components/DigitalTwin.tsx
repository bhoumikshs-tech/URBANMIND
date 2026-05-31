import { useState, useEffect, useRef } from 'react';
import { DigitalScenario } from '../types';
import { SCENARIOS } from '../constants';
import { Layers, ShieldCheck, Flame, Cpu, Gauge, AlertOctagon, HelpCircle, Laptop2, Eye, Sun, Moon, Sparkles } from 'lucide-react';

export default function DigitalTwin() {
  const [activeScenario, setActiveScenario] = useState<DigitalScenario | null>(SCENARIOS[0]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'signals' | 'buildings' | 'flows'>('all');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scenario stress calculations
  const speedImpact = activeScenario ? activeScenario.impactAfter.avgSpeed : 25;
  const timeImpact = activeScenario ? activeScenario.impactAfter.travelTime : 40;
  const densityImpact = activeScenario ? activeScenario.impactAfter.density : 80;

  // 3D Isometric Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Canvas resize handler
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 550;
      canvas.height = 360;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Isometric coordinates transform helper
    // ISO angles: cos(30deg) = 0.866, sin(30deg) = 0.5
    const toIso = (x: number, y: number, z: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;
      const isoX = centerX + (x - y) * 0.866;
      const isoY = centerY + (x + y) * 0.5 - z;
      return { x: isoX, y: isoY };
    };

    // Simulated 3D Elements parameters
    const gridSize = 140; // Isometric grid cells boundary
    const buildings = [
      { gridX: -80, gridY: -80, width: 35, height: 110, label: 'Tech Tower A' },
      { gridX: 60, gridY: -90, width: 45, height: 140, label: 'Civic Hub' },
      { gridX: -100, gridY: 40, width: 40, height: 75, label: 'MG Plaza' },
      { gridX: 80, gridY: 60, width: 35, height: 95, label: 'Metro Hub' },
    ];

    const intersections = [
      { name: 'Koramangala Node', loc: { x: 0, y: 0 }, signalState: 'green' },
      { name: 'Domlur Intersect', loc: { x: -110, y: -110 }, signalState: 'red' },
      { name: 'Silk Board Gate', loc: { x: 110, y: 110 }, signalState: 'amber' }
    ];

    // Vehicles particles active tracking
    const particles: {x: number, y: number, lane: 'A' | 'B' | 'C' | 'D', speed: number, color: string}[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        lane: (['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]) as any,
        speed: (0.6 + Math.random() * 1.4) * speedMultiplier,
        color: ['#06b6d4', '#ec4899', '#f59e0b', '#3b82f6'][Math.floor(Math.random() * 4)]
      });
    }

    // Animation Tick Draw Loop
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw atmospheric background space
      ctx.fillStyle = '#07080b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background guides
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.lineWidth = 1;
      for (let d = -180; d <= 180; d += 30) {
        // Draw continuous iso grid lines
        const ptA1 = toIso(-180, d, 0);
        const ptB1 = toIso(180, d, 0);
        ctx.beginPath();
        ctx.moveTo(ptA1.x, ptA1.y);
        ctx.lineTo(ptB1.x, ptB1.y);
        ctx.stroke();

        const ptA2 = toIso(d, -180, 0);
        const ptB2 = toIso(d, 180, 0);
        ctx.beginPath();
        ctx.moveTo(ptA2.x, ptA2.y);
        ctx.lineTo(ptB2.x, ptB2.y);
        ctx.stroke();
      }

      // 2. Draw 3D Roads Overlay (Lanes crossing central coordinate axis)
      if (activeLayer === 'all' || activeLayer === 'flows') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.25)';
        ctx.lineWidth = 4;

        // X-axis Central Parkway
        ctx.beginPath();
        const r1 = toIso(-180, -20, 0);
        const r2 = toIso(180, -20, 0);
        const r3 = toIso(180, 20, 0);
        const r4 = toIso(-180, 20, 0);
        ctx.moveTo(r1.x, r1.y);
        ctx.lineTo(r2.x, r2.y);
        ctx.lineTo(r3.x, r3.y);
        ctx.lineTo(r4.x, r4.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Y-axis Central Parkway
        ctx.beginPath();
        const ry1 = toIso(-20, -180, 0);
        const ry2 = toIso(20, -180, 0);
        const ry3 = toIso(20, 180, 0);
        const ry4 = toIso(-20, 180, 0);
        ctx.moveTo(ry1.x, ry1.y);
        ctx.lineTo(ry2.x, ry2.y);
        ctx.lineTo(ry3.x, ry3.y);
        ctx.lineTo(ry4.x, ry4.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw centerline dotted yellow road indicators
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.setLineDash([6, 8]);
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        const d1 = toIso(-180, 0, 0);
        const d2 = toIso(180, 0, 0);
        ctx.moveTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.stroke();

        ctx.beginPath();
        const dy1 = toIso(0, -180, 0);
        const dy2 = toIso(0, 180, 0);
        ctx.moveTo(dy1.x, dy1.y);
        ctx.lineTo(dy2.x, dy2.y);
        ctx.stroke();

        ctx.setLineDash([]); // clear dash
      }

      // 3. Draw Moving Simulated Car Vectors
      if (activeLayer === 'all' || activeLayer === 'flows') {
        particles.forEach((part) => {
          // Move particle
          const stepSpeed = part.speed * (activeScenario ? 0.75 : 1.2);
          if (part.lane === 'A') {
            part.x += stepSpeed;
            part.y = 8;
            if (part.x > 180) part.x = -180;
          } else if (part.lane === 'B') {
            part.x = -8;
            part.y += stepSpeed;
            if (part.y > 180) part.y = -180;
          } else if (part.lane === 'C') {
            part.x -= stepSpeed;
            part.y = -8;
            if (part.x < -180) part.x = 180;
          } else {
            part.x = 8;
            part.y -= stepSpeed;
            if (part.y < -185) part.y = 185;
          }

          // Projection coordinate
          const pos = toIso(part.x, part.y, 0);

          // Draw neon vehicle point
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = part.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = part.color;
          ctx.fill();
          ctx.shadowBlur = 0; // Reset shadow for efficiency
        });
      }

      // 4. Draw Glowing Isometric Skyscraper Towers
      if (activeLayer === 'all' || activeLayer === 'buildings') {
        buildings.forEach((b) => {
          const cornerA = toIso(b.gridX, b.gridY, 0);
          const cornerB = toIso(b.gridX + b.width, b.gridY, 0);
          const cornerC = toIso(b.gridX + b.width, b.gridY + b.width, 0);
          const cornerD = toIso(b.gridX, b.gridY + b.width, 0);

          const roofA = toIso(b.gridX, b.gridY, b.height);
          const roofB = toIso(b.gridX + b.width, b.gridY, b.height);
          const roofC = toIso(b.gridX + b.width, b.gridY + b.width, b.height);
          const roofD = toIso(b.gridX, b.gridY + b.width, b.height);

          // Render Wall Segment Left (Shadowed)
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cornerA.x, cornerA.y);
          ctx.lineTo(cornerB.x, cornerB.y);
          ctx.lineTo(roofB.x, roofB.y);
          ctx.lineTo(roofA.x, roofA.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Render Wall Segment Right (Highlighted Face)
          ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
          ctx.beginPath();
          ctx.moveTo(cornerB.x, cornerB.y);
          ctx.lineTo(cornerC.x, cornerC.y);
          ctx.lineTo(roofC.x, roofC.y);
          ctx.lineTo(roofB.x, roofB.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Render Roof flat polygonal cap
          ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
          ctx.beginPath();
          ctx.moveTo(roofA.x, roofA.y);
          ctx.lineTo(roofB.x, roofB.y);
          ctx.lineTo(roofC.x, roofC.y);
          ctx.lineTo(roofD.x, roofD.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Neon windows outline (simulating visual HUD grid columns)
          ctx.strokeStyle = 'rgba(0, 242, 255, 0.155)';
          ctx.lineWidth = 0.5;
          for (let step = 15; step < b.height - 10; step += 15) {
            const windA = toIso(b.gridX + b.width - 2, b.gridY + b.width / 2, step);
            const windB = toIso(b.gridX + b.width - 2, b.gridY + b.width - 2, step);
            ctx.beginPath();
            ctx.moveTo(windA.x, windA.y);
            ctx.lineTo(windB.x, windB.y);
            ctx.stroke();
          }

          // Floating neon label over topmost roof node
          if (frame % 160 > 100) {
            ctx.fillStyle = 'rgba(0, 242, 255, 0.85)';
            ctx.font = '7.5px monospace';
            ctx.fillText(b.label, roofA.x - 20, roofA.y - 8);
          }
        });
      }

      // 5. Draw Digital Traffic Signals Intersections
      if (activeLayer === 'all' || activeLayer === 'signals') {
        intersections.forEach((inter, idx) => {
          const pt = toIso(inter.loc.x, inter.loc.y, 0);

          // Cycle color signals
          let signalColor = '#ef4848'; // red
          const cycleSeed = (frame + idx * 80) % 240;
          if (cycleSeed < 100) {
            signalColor = '#10b981'; // green
          } else if (cycleSeed < 130) {
            signalColor = '#f59e0b'; // amber
          }

          // Vertical Signal Pole
          const topPT = toIso(inter.loc.x, inter.loc.y, 35);
          ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(topPT.x, topPT.y);
          ctx.stroke();

          // Glowing Signal Cap
          ctx.beginPath();
          ctx.arc(topPT.x, topPT.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = signalColor;
          ctx.shadowBlur = 12;
          ctx.shadowColor = signalColor;
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Floating mini HUD indicator text
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.font = '8px monospace';
          ctx.fillText(inter.name, topPT.x + 8, topPT.y + 2);
        });
      }

      // 6. Draw outer UI telemetry lines on the canvas overlay
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Label corners
      ctx.fillStyle = 'rgba(0, 242, 255, 0.4)';
      ctx.font = '6.5px monospace';
      ctx.fillText('[ COORD SYNC BNG_GRID ]', 18, 22);
      ctx.fillText('[ MODE: ISOMETRIC ortho_3D ]', canvas.width - 150, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [speedMultiplier, activeScenario, activeLayer]);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4 text-sans">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Digital Twin 3D City Sim
            </h3>
            <p className="text-xs text-emerald-400 font-mono">Module 07 • Bengaluru Virtual Replica & Scenario Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#090b0d] border border-slate-800 rounded-lg p-1 px-2.5 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          3D GRAPHICS ACCELERATED
        </div>
      </div>

      {/* CORE GRID LAYOUT: SIMULATOR CANVAS (LEFT) vs COMPARISONS (RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPONENT: ISOMETRIC GLOWING CANVAS SCREEN WITH CONTROLS (col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          
          {/* Layer switcher bar */}
          <div className="flex justify-between items-center bg-[#07090d] border border-slate-850 p-1.5 rounded-lg text-[10px] font-mono">
            <span className="text-slate-500 uppercase pl-1.5">Model Layers:</span>
            <div className="flex gap-1">
              {(['all', 'signals', 'buildings', 'flows'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-2 py-0.5 rounded capitalize cursor-pointer transition ${
                    activeLayer === layer ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive HTML5 Drawing Canvas */}
          <div className="w-full h-[360px] bg-black border border-slate-800/80 rounded-xl relative overflow-hidden select-none">
            <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
            
            {/* Speed slider overlaid bottom-left */}
            <div className="absolute bottom-3 left-3 bg-[#0a0c10]/90 border border-slate-800 p-2 rounded-lg flex items-center gap-2 text-[9px] font-mono shadow-lg select-none z-10 w-44">
              <span className="text-slate-500 uppercase shrink-0">Flow Speed:</span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-500 bg-slate-950 h-1 rounded cursor-pointer"
              />
              <span className="text-emerald-400 font-bold w-6 text-right">{speedMultiplier}x</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPLEMENTARY STRESS MODULE (col-span-5) */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">
              Stress catalysts simulation
            </span>

            {/* Scenario loop list */}
            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {SCENARIOS.map((sc) => {
                const isSelected = activeScenario?.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setActiveScenario(sc)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className={`p-1.5 rounded text-xs shrink-0 ${
                      isSelected ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                    }`}>
                      <AlertOctagon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 leading-tight flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-slate-200">{sc.name}</h4>
                      <p className="text-[10px] text-slate-500 font-sans line-clamp-1">{sc.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATED METRICS CHART COMPARE ROWS */}
          {activeScenario && (
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl flex flex-col gap-3 font-mono text-[11px] select-none">
              <span className="text-slate-300 font-bold border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Comparison (Baseline vs Scenario)
              </span>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Transit Rate:</span>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-bold">{activeScenario.impactBefore.avgSpeed} km/h</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-red-400 font-black">{speedImpact} km/h</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Grid Latency:</span>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-bold">{activeScenario.impactBefore.travelTime}m</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-red-400 font-black">{timeImpact}m</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Lattice Saturation:</span>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-bold">{activeScenario.impactBefore.density}%</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-red-405 font-black text-red-400">{densityImpact}%</span>
                  </div>
                </div>
              </div>

              {/* Advisory diagnostic warning */}
              <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded text-[9.5px] leading-relaxed text-red-400 mt-1">
                ⚠️ Cascade Alert: Locally simulated density surged by {Math.round(densityImpact - activeScenario.impactBefore.density)}%. High delay key areas marked in Twin layout model. Preemption suggested.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
