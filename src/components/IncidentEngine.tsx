import { useState, useEffect, FormEvent } from 'react';
import { AlertCircle, AlertTriangle, Shield, CheckCircle2, Siren, User2, Zap, Car, Compass, Navigation, RefreshCw } from 'lucide-react';

interface Incident {
  id: string;
  type: 'Collision' | 'Flooded Road' | 'Breakdown' | 'Wrong-site driving' | 'Illegal Parking' | 'Roadblock';
  location: string;
  severity: number; // /10
  etaImpact: number; // minutes
  description: string;
  symptomText: string;
  status: 'active' | 'mitigating' | 'cleared';
  timestamp: string;
}

export default function IncidentEngine() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-104',
      type: 'Collision',
      location: 'MG Road Junction',
      severity: 8.4,
      etaImpact: 17,
      description: 'Multi-Vehicle high-energy collision on slip road. Blockage of center lanes.',
      symptomText: 'Cascade queue buildup. Visual loop CCTV indicates immediate bypass routing required.',
      status: 'active',
      timestamp: '0 mins ago • LIVE'
    },
    {
      id: 'inc-105',
      type: 'Flooded Road',
      location: 'Silk Board flyover entrance',
      severity: 7.9,
      etaImpact: 12,
      description: 'Severe monsoon localized waterlogging on access slip roads.',
      symptomText: 'Hydroplaning caution flag active. Speeds dropped below 15 km/h.',
      status: 'active',
      timestamp: '4 mins ago • LIVE'
    },
    {
      id: 'inc-106',
      type: 'Breakdown',
      location: 'Halasuru Metro Node',
      severity: 5.2,
      etaImpact: 8,
      description: 'Public transit bus engine seized in central transit line.',
      symptomText: 'Lane 1 restricted. Dynamic towing unit dispatched via central line tracker.',
      status: 'active',
      timestamp: '12 mins ago'
    },
    {
      id: 'inc-107',
      type: 'Wrong-site driving',
      location: 'Electronic City Tollway',
      severity: 9.1,
      etaImpact: 22,
      description: 'Two-wheeler moving northwards on southern express freeway lane.',
      symptomText: 'Severe impact velocity risk. Toll authorities alerted for automated interception barriers.',
      status: 'active',
      timestamp: '1 min ago • LIVE'
    }
  ]);

  // Driver Risk Scores Registry for Category 4
  const [mockDrivers, setMockDrivers] = useState([
    {
      licensePlate: 'KA-01-AB-1234',
      riskScore: 82,
      reason: 'Frequent lane switches, high braking deceleration, and speed variance.',
      speedTrend: [25, 68, 12, 75, 18],
      signalJumps: 2,
      rashOvertakes: 7,
      accidentProb: 44,
      status: 'High Threat Flagged'
    },
    {
      licensePlate: 'KA-03-MX-7890',
      riskScore: 31,
      reason: 'Slightly slow average speed, steady tracking, low acceleration spikes.',
      speedTrend: [40, 42, 38, 41, 40],
      signalJumps: 0,
      rashOvertakes: 0,
      accidentProb: 8,
      status: 'Stable Safe Operator'
    },
    {
      licensePlate: 'KA-05-ZZ-9999',
      riskScore: 94,
      reason: 'Sustained tailgating detected via YOLO grid, multiple lane crossings without signals.',
      speedTrend: [85, 92, 10, 88, 95],
      signalJumps: 4,
      rashOvertakes: 15,
      accidentProb: 79,
      status: 'Immediate Dispatch / Warning Sent'
    }
  ]);

  const [searchPlate, setSearchPlate] = useState('KA-01-AB-1234');
  const [selectedDriver, setSelectedDriver] = useState<typeof mockDrivers[0] | null>(mockDrivers[0]);
  const [mitigationProgress, setMitigationProgress] = useState<{ [key: string]: boolean }>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSearchPlate = (e: FormEvent) => {
    e.preventDefault();
    const result = mockDrivers.find(d => d.licensePlate.toUpperCase().replace(/\s/g, '') === searchPlate.toUpperCase().replace(/\s/g, ''));
    if (result) {
      setSelectedDriver(result);
    } else {
      // Create random on the fly to avoid blank results
      const randRisk = Math.floor(20 + Math.random() * 75);
      const randomDriver = {
        licensePlate: searchPlate.toUpperCase(),
        riskScore: randRisk,
        reason: randRisk > 70 
          ? 'Reckless acceleration profile, unstable lateral lane stability indices.' 
          : 'Normal urban transit signature. Compliant with standard velocity bands.',
        speedTrend: Array.from({ length: 5 }, () => Math.floor(30 + Math.random() * 50)),
        signalJumps: randRisk > 70 ? Math.floor(Math.random() * 3) : 0,
        rashOvertakes: Math.floor(randRisk / 10),
        accidentProb: Math.round(randRisk * 0.7),
        status: randRisk > 70 ? 'Warning Flagged' : 'Normal / Compliant Node'
      };
      setMockDrivers(prev => [...prev, randomDriver]);
      setSelectedDriver(randomDriver);
    }
  };

  const handleMitigate = (incId: string, location: string) => {
    setMitigationProgress(prev => ({ ...prev, [incId]: true }));
    setSuccessToast(`🚨 EMERGENCY CORRIDOR ROUTED TO ${location.toUpperCase()} (Signals auto-synchronized, ETA delays reduced)`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 5000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-6 animate-fadeIn">
      
      {/* SUCCESS ACTION TOAST POPUP */}
      {successToast && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] bg-slate-950 border-2 border-pink-500 p-4 rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.35)] z-50 animate-fadeIn font-mono text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2 text-pink-400 font-bold uppercase">
            <Siren className="w-4 h-4 animate-bounce" />
            URBANMIND Emergency Preemption Clear
          </div>
          <p className="text-slate-100 tracking-wide font-semibold whitespace-pre-line leading-relaxed">
            {successToast}
          </p>
          <div className="flex justify-between items-center bg-pink-500/10 p-2 rounded text-pink-400 font-bold mt-1 text-[10px]">
            <span>WITHOUT AI: 19 Mins Delay</span>
            <span>WITH AI PREEMPTION: 8 Mins</span>
            <span className="text-emerald-400 font-black">58% Reduction!</span>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/40 shadow-inner">
            <Siren className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight font-sans">
              AI Incident Detection & Driver Risk profiling
            </h3>
            <p className="text-xs text-rose-400 font-mono">Module 12 • Real-Time Crisis Autopilot Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-slate-450 uppercase">Active Sensors: 1,480 CCTV nodes active</span>
        </div>
      </div>

      {/* PRIMARY COLUMN LAYOUT: CRISIS AI REGISTRY (LEFT) vs COGNITIVE DRIVER PROFILING (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CRISIS DETECTED CARD ARRAY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between pl-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              🚨 Active Traffic Crisis Alerts
            </span>
            <span className="text-[10px] bg-red-950/40 text-red-400 px-2.5 py-0.5 rounded border border-red-900/35 font-mono">
              Action Required
            </span>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto pr-1">
            {incidents.map((inc) => {
              const isMitigating = mitigationProgress[inc.id];
              return (
                <div
                  key={inc.id}
                  className={`border rounded-xl p-4 bg-slate-950 transition-all duration-200 ${
                    isMitigating 
                      ? 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                      : inc.severity > 8 
                        ? 'border-rose-500/40 shadow-[0_0_10px_rgba(239,68,68,0.05)]' 
                        : 'border-slate-850'
                  }`}
                >
                  {/* Card Title Header details */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-900 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg text-xs leading-none font-bold font-mono uppercase ${
                        inc.severity > 8 ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-amber-950/40 text-amber-500 border border-amber-900/30'
                      }`}>
                        {inc.type}
                      </span>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-slate-300">{inc.location}</h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">{inc.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col">
                      <span className="text-xs font-mono font-bold text-red-400">Severity {inc.severity}/10</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Impact: +{inc.etaImpact} mins ETA</span>
                    </div>
                  </div>

                  {/* Incident Description */}
                  <div className="py-3 flex flex-col gap-1.5">
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{inc.description}</p>
                    <p className="text-[10px] font-mono text-slate-500 italic block border-l-2 border-slate-800 pl-2">
                      Symptom Telemetry: {inc.symptomText}
                    </p>
                  </div>

                  {/* Action Button: Emergency Corridor trigger on-click */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3" /> Auto bypass status: {isMitigating ? 'Sovereign preemption' : 'Awaiting confirmation'}
                    </span>

                    {isMitigating ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30 shadow-inner">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Green corridor open
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMitigate(inc.id, inc.location)}
                        className="py-1.5 px-3 bg-rose-500 text-slate-950 font-bold font-mono text-[10.5px] rounded-lg transition hover:bg-rose-400 hover:shadow-[0_0_12px_rgba(244,63,94,0.35)] cursor-pointer flex items-center gap-1"
                      >
                        <Siren className="w-3 h-3 animate-spin" /> Open Emergency Corridor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: COGNITIVE DRIVER RISK PROFILER */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-1 border-b border-slate-900 pb-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User2 className="w-4 h-4 text-rose-500" /> Cognitive Driver Risk Score
            </span>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              Automated License Plate intelligence. Analyzes lane drift and sudden deceleration events to predict signal jumps.
            </p>
          </div>

          {/* Search Bar for KA License plate lookup */}
          <form onSubmit={handleSearchPlate} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Plate e.g. KA-01-AB-1234"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/60 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 uppercase"
            />
            <button
              type="submit"
              className="py-2 px-4 bg-rose-500/10 border border-rose-500/40 hover:bg-rose-500 hover:text-slate-950 rounded-lg text-xs font-mono font-bold text-rose-400 transition cursor-pointer"
            >
              Analyze
            </button>
          </form>

          {/* Driver Risk profile Card summary */}
          {selectedDriver ? (
            <div className="flex flex-col gap-4 bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Target License Plate</span>
                  <div className="text-sm font-black text-slate-200 mt-0.5 tracking-widest bg-black border border-slate-750 px-2 py-0.5 rounded font-mono inline-block">
                    {selectedDriver.licensePlate}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Risk Level</span>
                  <span className={`text-2xl font-black font-mono block ${
                    selectedDriver.riskScore > 75 ? 'text-red-400 animate-pulse' : selectedDriver.riskScore > 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedDriver.riskScore}%
                  </span>
                </div>
              </div>

              {/* Accident Probability & Signal jump statistics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-black/45 p-2 rounded-lg border border-slate-850/60 text-center">
                  <span className="text-[8px] text-slate-500 uppercase block">Accident Probability</span>
                  <span className="text-sm font-bold text-red-400">{selectedDriver.accidentProb}%</span>
                </div>
                <div className="bg-black/45 p-2 rounded-lg border border-slate-850/60 text-center">
                  <span className="text-[8px] text-slate-500 uppercase block">Rash Overtaking</span>
                  <span className="text-sm font-bold text-amber-500">{selectedDriver.rashOvertakes} counts</span>
                </div>
              </div>

              {/* Reasoning telemetry explanation */}
              <div className="flex flex-col gap-1 bg-black/35 p-3 rounded-lg border border-slate-900">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-black">Reasoning Analysis:</span>
                <p className="text-[10.5px] leading-relaxed text-slate-400 font-mono">
                  {selectedDriver.reason}
                </p>
              </div>

              {/* Miniature telemetry chart simulation speed */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>LAST 5 SEC SENSOR SAMPLING SPEED VELOCITY</span>
                  <span className="text-rose-400 font-bold uppercase">Critical Velocity Peaks</span>
                </div>
                {/* Visual bar chart representing velocity spikes */}
                <div className="flex items-end justify-between h-[45px] bg-black/60 rounded-lg p-2 gap-2 border border-slate-850/40">
                  {selectedDriver.speedTrend.map((sh, idx) => (
                    <div key={`st-${idx}`} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={`w-full rounded-t transition-all duration-300 ${
                          sh > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : sh > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ height: `${(sh / 100) * 32}px` }}
                      />
                      <span className="text-[7.5px] font-mono text-slate-600 font-semibold">{sh}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Intercept dispatch alert decision trigger */}
              <button
                type="button"
                onClick={() => {
                  setSuccessToast(`🚨 CRITICAL THREAT WARNING FLAG BROADCASTED FOR ${selectedDriver.licensePlate} (Officer units within immediate block warned of reckless deceleration patterns)`);
                  setTimeout(() => {
                    setSuccessToast(null);
                  }, 4000);
                }}
                className={`w-full py-2.5 rounded-xl border font-mono text-[10px] font-black tracking-wider shadow transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedDriver.riskScore > 70 
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> {selectedDriver.riskScore > 70 ? 'BROADCAST POLICE INTERCEPT WARNING' : 'LOG AS SECURITY CHECK COMPLIANT'}
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10 font-mono text-xs">Awaiting license lookup input.</div>
          )}

          <div className="bg-[#0b0c0f] border border-slate-900 p-3 rounded-lg text-[9px] font-mono text-slate-500 leading-normal uppercase">
            ⚠️ Automated under State Grid Protocol Code Act-236. Cognitive telemetry retains compliance privacy indicators.
          </div>
        </div>

      </div>
    </div>
  );
}
