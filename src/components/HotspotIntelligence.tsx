import { useState } from 'react';
import { Target, AlertCircle, ShieldAlert, BarChart3, HelpCircle } from 'lucide-react';

export default function HotspotIntelligence() {
  const [activeTab, setActiveTab] = useState<'congestion' | 'danger' | 'violations' | 'stress'>('congestion');

  const getHotspots = () => {
    switch (activeTab) {
      case 'danger':
        return [
          { rank: 1, name: 'Hebbal Flyover Loops', metric: '6.4 Acc/Million km', status: 'Critical', color: 'text-red-400' },
          { rank: 2, name: 'Silk Board Lower Exit', metric: '4.8 Acc/Million km', status: 'Critical', color: 'text-red-400' },
          { rank: 3, name: 'Marathahalli Underpassing Lane', metric: '3.2 Acc/Million km', status: 'Moderate', color: 'text-orange-400' },
          { rank: 4, name: 'Richmond Road Connector', metric: '2.5 Acc/Million km', status: 'Moderate', color: 'text-orange-400' },
          { rank: 5, name: 'Tin Factory Lane Merger', metric: '1.9 Acc/Million km', status: 'Low Risk', color: 'text-emerald-400' }
        ];
      case 'violations':
        return [
          { rank: 1, name: 'Silk Board - Sector 2 Exit', metric: '340 citations/hr', status: 'Critical', color: 'text-red-400' },
          { rank: 2, name: 'KR Puram Suspension Bridge', metric: '210 citations/hr', status: 'Critical', color: 'text-red-400' },
          { rank: 3, name: 'Whitefield ITPL Main Rd', metric: '180 citations/hr', status: 'Moderate', color: 'text-orange-400' },
          { rank: 4, name: 'MG Road Metro Access', metric: '92 citations/hr', status: 'Moderate', color: 'text-orange-400' },
          { rank: 5, name: 'Indiranagar Main Linkway', metric: '43 citations/hr', status: 'Low Risk', color: 'text-emerald-400' }
        ];
      case 'stress':
        return [
          { rank: 1, name: 'Central Silk Board Ring Road', metric: '94 Stress Score', status: 'Critical', color: 'text-red-400' },
          { rank: 2, name: 'Goraguntepalya Outer Ring Rd', metric: '89 Stress Score', status: 'Critical', color: 'text-red-400' },
          { rank: 3, name: 'Hebbal Flyover Core Access', metric: '85 Stress Score', status: 'Moderate', color: 'text-orange-400' },
          { rank: 4, name: 'Marathahalli Outer Ring Rd', metric: '81 Stress Score', status: 'Moderate', color: 'text-orange-400' },
          { rank: 5, name: 'Whitefield Graphite India Rd', metric: '74 Stress Score', status: 'Low Risk', color: 'text-emerald-400' }
        ];
      case 'congestion':
      default:
        return [
          { rank: 1, name: 'Silk Board Junction', metric: '92% Peak density', status: 'Critical', color: 'text-red-400' },
          { rank: 2, name: 'Hebbal Flyover Entrance', metric: '88% Peak density', status: 'Critical', color: 'text-red-400' },
          { rank: 3, name: 'KR Puram Suspension Bridge', metric: '84% Peak density', status: 'Moderate', color: 'text-orange-400' },
          { rank: 4, name: 'Marathahalli Multiplex Lane', metric: '86% Peak density', status: 'Moderate', color: 'text-orange-400' },
          { rank: 5, name: 'Whitefield ITPL Road', metric: '76% Peak density', status: 'Low Risk', color: 'text-emerald-400' }
        ];
    }
  };

  const currentList = getHotspots();

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/40 border border-red-900/35">
            <Target className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Hotspot Intelligence
            </h3>
            <p className="text-xs text-rose-400 font-mono">Module 09 • Top-10 Municipal Black Spot Tracker</p>
          </div>
        </div>

        {/* Selected hotspots criteria tabs */}
        <div className="bg-slate-950/80 border border-slate-800 p-0.5 rounded-lg flex flex-wrap gap-1">
          {[
            { id: 'congestion', label: 'Congested' },
            { id: 'danger', label: 'Dangerous' },
            { id: 'violations', label: 'Violation' },
            { id: 'stress', label: 'Stressed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main hot List panel */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-850">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-6 pl-2">Location Identifier</div>
          <div className="col-span-3 text-right">Yield Metric</div>
          <div className="col-span-2 text-center">Threat Level</div>
        </div>

        <div className="flex flex-col divide-y divide-slate-900">
          {currentList.map((item) => (
            <div
              key={`hotspot-${item.rank}`}
              className="grid grid-cols-12 gap-2 p-3 text-xs font-mono items-center hover:bg-slate-900/35 transition"
            >
              <div className="col-span-1 text-center font-bold text-slate-500">#{item.rank}</div>
              <div className="col-span-6 pl-2 font-semibold text-slate-200">{item.name}</div>
              <div className="col-span-3 text-right text-cyan-400 font-bold">{item.metric}</div>
              <div className="col-span-2 text-center">
                <span className={`text-[10px] uppercase font-bold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center gap-2.5 text-xs font-mono text-slate-400 leading-normal">
        <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0" />
        High priority resources are optimized automatically behind the curtains to clear threat zones during gridlock transitions.
      </div>
    </div>
  );
}
