import { useState, FormEvent } from 'react';
import { Smartphone, ShieldAlert, Sparkles, Send, CheckCircle2, MapPin, AlertCircle, RefreshCw, ThumbsUp, CloudDrizzle, Navigation, Eye, Check } from 'lucide-react';

interface CrowdReport {
  id: string;
  category: 'Pothole' | 'Accident' | 'Signal Failure' | 'Other';
  location: string;
  description: string;
  upvotes: number;
  status: 'In Review' | 'Dispatched' | 'Resolved';
  timestamp: string;
}

export default function CitizenPortal() {
  const [reports, setReports] = useState<CrowdReport[]>([
    {
      id: 'cr-401',
      category: 'Pothole',
      location: 'Koramangala 80 Feet Road',
      description: 'Massive cavernous pothole on center lane, causes severe motorcycle swervings.',
      upvotes: 42,
      status: 'Dispatched',
      timestamp: '20 mins ago'
    },
    {
      id: 'cr-402',
      category: 'Signal Failure',
      location: 'Richmond Town Ring Road',
      description: 'Blinking orange hazard lights are on, but green segment never triggers.',
      upvotes: 18,
      status: 'In Review',
      timestamp: '1 hour ago'
    },
    {
      id: 'cr-403',
      category: 'Accident',
      location: 'Bannerghatta Toll Junction',
      description: 'Minor bumper crash between two sedans restricting the right-most freeway exit.',
      upvotes: 29,
      status: 'Resolving',
      timestamp: '30 mins ago'
    }
  ]);

  // Citizen Report Submission Fields
  const [cat, setCat] = useState<'Pothole' | 'Accident' | 'Signal Failure' | 'Other'>('Pothole');
  const [locName, setLocName] = useState('Indiranagar 100 Feet Rd');
  const [descText, setDescText] = useState('Deep tarmac degradation causing severe axle impact speeds.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'report' | 'stats' | 'routes'>('report');
  
  // Simulated Mobile Phone Indicators
  const timeStr = "10:42 AM";
  const batteryPct = "88%";

  const handleCreateReport = (e: FormEvent) => {
    e.preventDefault();
    if (!locName || !descText) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRep: CrowdReport = {
        id: `cr-${Math.floor(400 + Math.random() * 200)}`,
        category: cat,
        location: locName,
        description: descText,
        upvotes: 1,
        status: 'In Review',
        timestamp: 'Just now • SECURE'
      };

      setReports(prev => [newRep, ...prev]);
      setLocName('');
      setDescText('');
      setIsSubmitting(false);
    }, 900);
  };

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-6 animate-fadeIn">
      
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-900/30">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Citizen Portal Ecosystem
            </h3>
            <p className="text-xs text-cyan-400 font-mono">Module 15 • Decentralized Community Crowdsourcing Node</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400">Citizen App Version 2.1.0</span>
      </div>

      {/* TWO PANEL GRID: BRIEF (LEFT) vs high-fidelity mobile simulator interface (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: THEMATIC ARCHITECTURE EXPLANATION */}
        <div className="lg:col-span-6 flex flex-col gap-5 text-sans text-xs">
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
            <h4 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Ecosystem Connected Thinking
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Modern smart cities succeed through civic integration. Under traditional configurations, operator modules rely purely on expensive camera sensors. 
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong>UrbanMind Citizen Portal</strong> delivers peer-approved crowd telemetry. Submissions for road potholes, crashes, or signal malfunctions are directly broadcasted to the Command Grid, creating a self-healing municipal model:
            </p>
            
            <ul className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px] text-slate-300">
              <li className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-slate-900">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Pothole Tag Tracker
              </li>
              <li className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-slate-900">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Peer Upvoting Filtering
              </li>
              <li className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-slate-900">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Auto-Dispatched Teams
              </li>
              <li className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-slate-900">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Pollution Detours
              </li>
            </ul>
          </div>

          {/* ACTIVE LIVE CROWD FEEDS GLYPH TRACKER */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">
              Active Peer-Dispatched Feed in Database
            </span>

            <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-black/50 border border-slate-850/80 p-3 rounded-lg flex flex-col gap-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-cyan-400 font-bold uppercase">[{rep.category}] {rep.id}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] bg-slate-900/60 border border-slate-800 text-slate-400">
                      {rep.status}
                    </span>
                  </div>
                  <h5 className="font-sans font-bold text-slate-300">{rep.location}</h5>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed font-sans">{rep.description}</p>
                  
                  <div className="flex items-center justify-between mt-1 text-[10px] pt-1.5 border-t border-slate-900">
                    <span className="text-slate-500">{rep.timestamp}</span>
                    <button
                      onClick={() => handleUpvote(rep.id)}
                      className="flex items-center gap-1.5 text-cyan-400 font-bold hover:text-white transition cursor-pointer"
                    >
                      <ThumbsUp className="w-3" /> Upvote ({rep.upvotes})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-FIDELITY SMARTPHONE EMULATOR SCREEN */}
        <div className="lg:col-span-6 flex justify-center">
          
          {/* Smartphone Bezels Outer Frame */}
          <div className="w-[330px] h-[610px] bg-black border-[8px] border-slate-800 rounded-[35px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            
            {/* Top Speaker Notch bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-850 h-5 w-32 rounded-b-xl z-20 flex items-center justify-center p-0.5 select-none">
              <div className="w-10 h-1 bg-black rounded-full" />
            </div>

            {/* Simulated Phone UI Mobile Header */}
            <div className="bg-[#0f1115] pt-6 pb-2.5 px-4 flex justify-between items-center text-[9px] font-mono text-slate-400 border-b border-slate-850 select-none">
              <span>{timeStr}</span>
              <div className="flex items-center gap-1">
                <span>LTE 5G</span>
                <span className="h-2 w-3 bg-slate-500 rounded-sm inline-block" />
                <span>{batteryPct}</span>
              </div>
            </div>

            {/* Simulated App Container Inner Viewport */}
            <div className="flex-1 bg-[#090b0d] p-4 overflow-y-auto scrollbar-none flex flex-col justify-between gap-4">
              
              {/* App BRANDING */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-black text-[9px]">
                    UM
                  </span>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-200 tracking-wider">URBANMIND PAY</h5>
                    <p className="text-[7.5px] font-mono text-[rgba(0,242,255,0.7)] tracking-widest leading-none">BENGALURU OPERATOR SATELLITE</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[7.5px] font-mono text-emerald-400">APP SYNC: LIVE</span>
                </div>
              </div>

              {/* THREE NAVIGATION SUB-PAGES WRAPPED TABS INSIDE PHONE */}
              <div className="flex justify-between p-0.5 bg-slate-950 border border-slate-850 rounded-lg text-[9px] font-mono">
                <button
                  onClick={() => setActiveScreen('report')}
                  className={`flex-1 py-1 rounded text-center cursor-pointer ${
                    activeScreen === 'report' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Report Case
                </button>
                <button
                  onClick={() => setActiveScreen('stats')}
                  className={`flex-1 py-1 rounded text-center cursor-pointer ${
                    activeScreen === 'stats' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pollution Detours
                </button>
                <button
                  onClick={() => setActiveScreen('routes')}
                  className={`flex-1 py-1 rounded text-center cursor-pointer ${
                    activeScreen === 'routes' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Smart Nav
                </button>
              </div>

              {/* ACTIVE PAGE CONTENT INSIDE PHONE VIEWPORT */}
              <div className="flex-1 flex flex-col justify-between pt-1 select-none">
                
                {activeScreen === 'report' && (
                  /* TAB 1: SUBMIT PEER CROWD REPORT FOR PATHWAYS */
                  <form onSubmit={handleCreateReport} className="flex-1 flex flex-col justify-between gap-3 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                        Describe Road Hazard
                      </span>

                      {/* Hazard category drop dropdown */}
                      <div className="flex flex-col gap-1.5 text-[10px] font-sans">
                        <label className="text-[8.5px] font-mono text-slate-500 uppercase">Incident Profile</label>
                        <select
                          value={cat}
                          onChange={(e) => setCat(e.target.value as any)}
                          className="bg-black border border-slate-800 text-slate-200 rounded p-1.5 text-[10px] focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          <option value="Pothole">🚧 Road Pothole degradation</option>
                          <option value="Accident">💥 Minor vehicular Collision</option>
                          <option value="Signal Failure">🚥 Signal / Lights Blinking fault</option>
                          <option value="Other">⚠️ Obstruction / Debris blockage</option>
                        </select>
                      </div>

                      {/* Location Input box */}
                      <div className="flex flex-col gap-1 text-[10px] font-sans">
                        <label className="text-[8.5px] font-mono text-slate-500">Location Area</label>
                        <input
                          type="text"
                          value={locName}
                          onChange={(e) => setLocName(e.target.value)}
                          placeholder="e.g. Indiranagar Junction"
                          className="bg-black border border-slate-800 text-slate-200 rounded p-1.5 text-[10px] focus:outline-none placeholder-slate-600 font-mono"
                        />
                      </div>

                      {/* Description Area */}
                      <div className="flex flex-col gap-1 text-[10px] font-sans">
                        <label className="text-[8.5px] font-mono text-slate-500">Hazard details</label>
                        <textarea
                          rows={2}
                          value={descText}
                          onChange={(e) => setDescText(e.target.value)}
                          placeholder="What did you observe?"
                          className="bg-black border border-slate-800 text-slate-200 rounded p-1.5 text-[10px] focus:outline-none placeholder-slate-600 font-sans resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold font-mono text-[10px] rounded-lg tracking-wider hover:brightness-110 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1 select-none"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" /> DISPATCHING REPORT...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-slate-950" /> TRANSMIT TO CENTRAL PORTAL
                        </>
                      )}
                    </button>
                  </form>
                )}

                {activeScreen === 'stats' && (
                  /* TAB 2: POLLUTION MAP AND GREEN RECOMMENDATIONS inside micro app */
                  <div className="flex-1 flex flex-col justify-between gap-3 animate-fadeIn text-[10px] font-mono select-none">
                    <div className="flex flex-col gap-2.5">
                      <div className="bg-cyan-950/15 border border-cyan-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-cyan-400 tracking-wider">LIVE HEALTH ALERT</span>
                        <h6 className="font-bold text-slate-200">Central AQI Map index: 124 (Moderate)</h6>
                        <p className="text-slate-400 font-sans text-[9px] leading-relaxed leading-normal">
                          Pollution accumulation is high at Richmond road. System recommends detour paths to vulnerable commuters.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                          <span>AQI INDICATOR RADIAL</span>
                          <span>LEVEL</span>
                        </div>
                        
                        <div className="bg-slate-950 border border-slate-850 p-2 rounded flex justify-between items-center">
                          <span className="text-emerald-400">M.G. Road (Low)</span>
                          <span className="text-emerald-400 font-bold">48 AQI</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 p-2 rounded flex justify-between items-center">
                          <span className="text-amber-500">Silk Board (Elevated)</span>
                          <span className="text-amber-500 font-bold">186 AQI</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 p-2 rounded flex justify-between items-center">
                          <span className="text-red-400">Electronic City (Severe Gas)</span>
                          <span className="text-red-400 font-bold">312 AQI</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-emerald-950/20 border border-emerald-800/40 rounded text-emerald-400 text-[8.5px] leading-relaxed font-sans select-none">
                      💡 Commute Insight: Re-routing via Outer Ring Road reduces inhaled particulate loads by up to 48%. Safe journey active.
                    </div>
                  </div>
                )}

                {activeScreen === 'routes' && (
                  /* TAB 3: SMART ROUTE DETOUR RECOMMENDER */
                  <div className="flex-1 flex flex-col justify-between gap-3 animate-fadeIn text-[10px] font-mono select-none">
                    <div className="flex flex-col gap-2">
                      <span className="text-[8.5px] text-slate-500 font-black block uppercase">
                        Active Route Preemption:
                      </span>

                      <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex gap-2 items-start">
                        <Navigation className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8.5px] text-slate-400">CURRENT COMMUTE SUGGESTION:</span>
                          <span className="font-bold text-slate-200 font-sans">Koramangala to Tech Park</span>
                          <span className="text-emerald-400 mt-1 font-bold block text-[9px] uppercase">
                            🔀 Detour suggested: Save 9Mins!
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 pl-1 text-[9.5px]">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="h-2 w-2 rounded-full col bg-red-500" />
                          <span>Standard Route: 32 mins (Heavy congestion)</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <span className="h-2 w-2 rounded-full col bg-emerald-400" />
                          <span>Smart AI Detour: 23 mins (Green corridor bypass)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-black/40 border border-slate-850 rounded text-slate-400 text-[8.5px] leading-relaxed select-none">
                      *By taking AI routing, commuters assist the grid in dispersing concentrated traffic bottlenecks. Thank you for grid compliance.
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Simulated Phone Bar home button indicator */}
            <div className="bg-black py-2 text-center select-none border-t border-slate-850/20">
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
