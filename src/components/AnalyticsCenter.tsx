import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Truck, 
  CloudRain, 
  Wind, 
  Gauge, 
  Workflow, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsCenter() {
  const [activePane, setActivePane] = useState<'roi' | 'flipkart' | 'monsoon' | 'pollution' | 'forecast'>('roi');
  const [flipkartPriority, setFlipkartPriority] = useState(false);
  const [monsoonSimulated, setMonsoonSimulated] = useState(false);

  return (
    <div id="analytics-center-container" className="bg-panel-dark/95 border border-border-dark rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-5">
      
      {/* Title Header */}
      <div id="analytics-header" className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/35">
            <BarChart3 className="w-5 h-5 text-accent-cyan animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight font-sans flex items-center gap-2">
              Urban analytics & ROI command deck
              <span className="text-[9px] bg-accent-blue/20 text-accent-blue border border-accent-blue/30 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                LIVE METRICS
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-mono">Real-time smart-city yields & logistics priority dispatch triggers</p>
          </div>
        </div>

        {/* Horizontal Navigation Pane Tags */}
        <div id="analytics-pane-navigation" className="flex flex-wrap bg-black/45 border border-border-dark p-1 rounded-xl gap-1">
          {[
            { id: 'roi', label: '📊 Impact ROI', icon: Gauge },
            { id: 'flipkart', label: '📦 Flipkart Grid', icon: Truck },
            { id: 'monsoon', label: '⛈️ Monsoon Mode', icon: CloudRain },
            { id: 'pollution', label: '🍃 Air Quality', icon: Wind },
            { id: 'forecast', label: '🔮 Forecast & Score', icon: TrendingUp }
          ].map((pane) => {
            const Icon = pane.icon;
            const isActive = activePane === pane.id;
            return (
              <button
                key={pane.id}
                id={`pane-tab-${pane.id}`}
                onClick={() => setActivePane(pane.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent-cyan text-slate-950 font-black shadow-[0_0_12px_rgba(3,250,255,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {pane.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Pane Contents */}
      <div id="analytics-pane-viewport" className="min-h-[220px]">
        
        {/* PANE 1: IMPACT & ROI DASHBOARD */}
        {activePane === 'roi' && (
          <div id="roi-pane" className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
            
            <div className="bg-black/40 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-semibold">
                  ⚡ FUEL ECONOMIC GAINS
                </span>
                <h4 className="text-3xl font-black font-mono text-emerald-400 mt-2">2.4M Liters</h4>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
                Cumulative fuel saved by dynamic corridor priority & micro-timing signal mitigation.
              </p>
            </div>

            <div className="bg-black/40 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-semibold">
                  ⏱️ COMMUTER TIME RECOVERY
                </span>
                <h4 className="text-3xl font-black font-mono text-cyan-400 mt-2">18M Hours</h4>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
                Aggregate rush-hour commute delays prevented across Silk Board & KR Puram routes.
              </p>
            </div>

            <div className="bg-black/40 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-semibold">
                  🛡️ ACCIDENTS PREVENTED
                </span>
                <h4 className="text-3xl font-black font-mono text-red-400 mt-2">1,420</h4>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
                Collisions averted by real-time automated alerts on wrong-side driving & lane drifts.
              </p>
            </div>

            <div className="bg-black/40 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-semibold">
                  🌱 CO₂ EMISSIONS SLASHED
                </span>
                <h4 className="text-3xl font-black font-mono text-pink-400 mt-2">-17.2%</h4>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
                Lower idling times at signals reduced localized particulate emissions and greenhouse loads.
              </p>
            </div>

          </div>
        )}

        {/* PANE 2: FLIPKART LOGISTICS */}
        {activePane === 'flipkart' && (
          <div id="flipkart-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center animate-fadeIn">
            
            <div className="lg:col-span-4 flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400 animate-bounce" />
                <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
                  Flipkart Sponsor Alignment
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
                Fleets Dispatch Optimization
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                Integrate logistics delivery routes with our preemptive smart signal system. Giving delivery fleet trucks priority green pathways dynamically cuts supply-chain overheads.
              </p>

              {/* Priority Toggle button */}
              <button
                id="toggle-flipkart-priority-btn"
                onClick={() => setFlipkartPriority(!flipkartPriority)}
                className={`mt-2 py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border ${
                  flipkartPriority 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'bg-black/35 text-amber-400 border-amber-500/30 hover:bg-amber-400/5'
                }`}
              >
                {flipkartPriority ? '✓ FLIPKART PRIORITIZATION ENGAGED' : 'ENGAGE FLIPKART LOGISTICS PRIORITY'}
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/35 border border-border-dark p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono text-[9px] text-[#f2cc05] bg-[#362b00] border border-[#a68200] p-1 rounded font-bold uppercase tracking-wider">
                <Workflow className="w-2.5 h-2.5 animate-spin" /> Route: Dynamic loop
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg flex flex-col gap-1 border border-border-dark/40">
                <span className="text-[10px] font-mono text-slate-500">BASELINE ETA</span>
                <span className="text-xl font-bold font-mono text-slate-400 line-through">34 Mins</span>
                <span className="text-[9px] font-mono text-slate-600">Standard route navigation</span>
              </div>

              <div className="bg-amber-950/20 p-3 rounded-lg flex flex-col gap-1 border border-amber-900/30 relative">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">UrbanMind AI ETA</span>
                <span className="text-2xl font-black font-mono text-amber-400 animate-pulse">21 Mins</span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 13m Recovered
                </span>
              </div>

              <div className="bg-emerald-950/20 p-3 rounded-lg flex flex-col gap-1 border border-emerald-900/30">
                <span className="text-[10px] font-mono text-emerald-450 uppercase font-semibold">Fuel Saving Yield</span>
                <span className="text-xl font-bold font-mono text-emerald-400">22% SAVED</span>
                <span className="text-[9px] font-mono text-slate-500">Localized idling reduction</span>
              </div>

              <div className="col-span-3 text-[10px] font-mono bg-black/50 p-2.5 rounded-lg text-slate-300 border border-slate-850 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {flipkartPriority ? (
                    <strong className="text-amber-400 uppercase">Active Status: Priority routing bypass active. Signal hubs on Outer Ring Road and Sector 4 and 5 programmatically flushes delivery fleet transits.</strong>
                  ) : (
                    "Static scheduling mode. Click Engage above to simulate priority green bands for Flipkart dispatch fleets."
                  )}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* PANE 3: MONSOON MODE WEATHER */}
        {activePane === 'monsoon' && (
          <div id="monsoon-pane" className="flex flex-col gap-4 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <CloudRain className="w-6 h-6 text-blue-400 animate-bounce mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    ● MONSOON MODE RADAR
                    <span className="text-[9px] bg-red-950 text-red-400 border border-red-900/60 px-1 py-0.2 rounded font-semibold uppercase">
                      Predictive Risk Alert
                    </span>
                  </span>
                  <p className="text-xs text-slate-200">
                    Heavy severe rainfall forecast expects in <strong className="text-white ring-1 ring-blue-500/30 px-1.5 rounded font-mono">37 mins</strong> citywide.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  id="trigger-monsoon-sim"
                  onClick={() => setMonsoonSimulated(!monsoonSimulated)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300 ${
                    monsoonSimulated
                      ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {monsoonSimulated ? '⚠️ CANCEL MONSOON DEPLOYMENT' : '⚡ DEPLOY MONSOON TASK FORCE'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { name: 'Silk Board Underpass', type: 'Flooding risk', level: '88%', col: 'text-red-400' },
                { name: 'KR Puram Low Point', type: 'Waterlogging risk', level: '92%', col: 'text-red-400' },
                { name: 'Electronic City Entrance', type: 'Heavy pooling', level: '70%', col: 'text-orange-400' },
                { name: 'Whitefield Link Road', type: 'Medium ponding', level: '58%', col: 'text-yellow-400' },
                { name: 'Hebbal low-lying crossing', type: 'Low hazard risk', level: '35%', col: 'text-emerald-400' }
              ].map((loc, i) => (
                <div key={i} className="bg-black/45 border border-slate-850 p-3 rounded-xl text-center font-mono flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] text-slate-300 truncate block font-sans">{loc.name}</span>
                  <span className="text-[8px] text-slate-500 uppercase">{loc.type}</span>
                  <span className={`text-lg font-bold ${loc.col}`}>{loc.level}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg text-[10.5px] font-mono text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                {monsoonSimulated ? (
                  <strong className="text-red-400 uppercase">Task Force Activated: Municipal drainage teams and pumping units dispatched proactively to Sector Section B. Emergency signal flush protocols deployed early to prevent underwater grids.</strong>
                ) : (
                  "Operator Precautionary Advisory: Recommended to deploy traffic units proactively to these 5 intersections to handle localized bottlenecks."
                )}
              </span>
            </div>

          </div>
        )}

        {/* PANE 4: URBAN AIR QUALITY DATA */}
        {activePane === 'pollution' && (
          <div id="pollution-pane" className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            
            {/* PM 2.5 Widget */}
            <div className="bg-[#12080a] border border-red-950/40 p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  PM2.5 Fine Dust
                </span>
                <span className="text-red-400 bg-red-900/10 border border-red-900/40 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                  Unhealthy
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-mono font-bold text-red-400">138</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">µg/m³</span>
              </div>
              <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mt-1 relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" style={{ width: '100%' }} />
                <div className="absolute bg-white border border-black w-2.5 h-2.5 top-[-1px] rounded-full shadow-[0_0_5px_black]" style={{ left: '72%' }} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono mt-1 border-t border-slate-850/60 pt-2">
                Heavy micro-dust pollution detected in sector exit nodes. Re-routing advisory sent.
              </p>
            </div>

            {/* PM 10 Widget */}
            <div className="bg-[#120f08] border border-amber-950/40 p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  PM10 Coarse Dust
                </span>
                <span className="text-amber-400 bg-amber-900/10 border border-amber-900/40 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                  Moderate
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-mono font-bold text-amber-400">74</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">µg/m³</span>
              </div>
              <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mt-1 relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" style={{ width: '100%' }} />
                <div className="absolute bg-white border border-black w-2.5 h-2.5 top-[-1px] rounded-full shadow-[0_0_5px_black]" style={{ left: '48%' }} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono mt-1 border-t border-slate-850/60 pt-2">
                Localized industrial exhaust concentrations along the highway. Steady dispersion rate.
              </p>
            </div>

            {/* CO2 Gas Indicator */}
            <div className="bg-[#08120e] border border-emerald-950/40 p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  CO₂ Green Index
                </span>
                <span className="text-emerald-400 bg-emerald-900/10 border border-emerald-900/45 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                  Safe
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-mono font-bold text-emerald-400">380</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">ppm</span>
              </div>
              <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mt-1 relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" style={{ width: '100%' }} />
                <div className="absolute bg-white border border-black w-2.5 h-2.5 top-[-1px] rounded-full shadow-[0_0_5px_black]" style={{ left: '25%' }} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono mt-1 border-t border-slate-850/60 pt-2">
                Optimal green belt oxygen flow. Standard carbon footprint metrics across municipal lanes.
              </p>
            </div>

          </div>
        )}

        {/* PANE 5: TRAFFIC FORECAST & COMPOSITE SCORE */}
        {activePane === 'forecast' && (
          <div id="forecast-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-fadeIn">
            
            {/* Future Forecast Cards */}
            <div className="lg:col-span-6 bg-black/45 border border-border-dark p-4 rounded-xl flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-border-dark/60 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f2ff]" /> Silk Board Traffic Forecast Node
                </span>
                <span className="text-[9px] font-mono font-semibold text-slate-400 uppercase">
                  Prediction Window
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[8px] text-slate-500 block uppercase">CURRENT</span>
                  <span className="text-base font-bold text-slate-100 block mt-1">73%</span>
                  <span className="text-[7.5px] text-emerald-400 tracking-tight">Standard stable</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 relative">
                  <span className="text-[8px] text-orange-400 block uppercase font-bold">⏱️ +30 MIN</span>
                  <span className="text-lg font-black text-orange-400 block mt-1">92%</span>
                  <span className="text-[7.5px] text-red-400 leading-none">Office rush hour</span>
                </div>

                <div className="bg-[#180a0a] p-2.5 rounded-lg border border-red-900/30">
                  <span className="text-[8px] text-red-400 block uppercase font-bold">☠️ +1 HOUR</span>
                  <span className="text-lg font-black text-red-400 block mt-1">95%</span>
                  <span className="text-[7.5px] text-red-500 block font-semibold">Peak jam lock</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[8px] text-slate-500 block uppercase">+3 HOURS</span>
                  <span className="text-base font-bold text-emerald-400 block mt-1">38%</span>
                  <span className="text-[7.5px] text-slate-500 block">Dissipated</span>
                </div>
              </div>

              <div className="bg-black/50 p-2.5 rounded-lg border border-slate-850/60 text-[10px] font-mono text-slate-400 leading-relaxed">
                <strong className="text-orange-400 font-bold block mb-1">ST-LSTM NEURAL INFERENCE DETECTED:</strong>
                High forecast concentration at **+30min** corridor spike matches commuter dispatch dispersals alongside mild rainfall humidity. Advisories deployed.
              </div>
            </div>

            {/* Smart-City Efficiency Score */}
            <div className="lg:col-span-6 bg-black/45 border border-border-dark p-4 rounded-xl flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between border-b border-border-dark/60 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Urban AI Efficiency Score Card
                </span>
                <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  HEALTH SCORE: EXCELLENT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 mt-1">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Traffic Flow</span>
                    <strong className="text-cyan-400 text-xs">84 / 100</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded overflow-hidden mt-1 border border-slate-850">
                    <div className="h-full bg-cyan-400" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Safety Index</span>
                    <strong className="text-emerald-400 text-xs">92 / 100</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded overflow-hidden mt-1 border border-slate-850">
                    <div className="h-full bg-emerald-400" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Pollution Dispersion</span>
                    <strong className="text-yellow-405 text-yellow-400 text-xs">71 / 100</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded overflow-hidden mt-1 border border-slate-850">
                    <div className="h-full bg-yellow-400" style={{ width: '71%' }} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Signal Efficiency</span>
                    <strong className="text-purple-400 text-xs">88 / 100</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded overflow-hidden mt-1 border border-slate-850">
                    <div className="h-full bg-purple-400" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              {/* Aggregated Final Grade Score Card */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">COGNITIVE COMPOSITE RATING</span>
                  <span className="text-xs font-semibold text-white mt-1">Smart Municipality Rank #1</span>
                </div>
                <div className="text-right flex items-baseline gap-1 bg-black/60 px-3 py-1 border border-slate-850 rounded-lg">
                  <span className="text-2xl font-black font-mono text-emerald-400 leading-none">83</span>
                  <span className="text-[10px] font-mono text-slate-500 leading-none">/ 100</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
