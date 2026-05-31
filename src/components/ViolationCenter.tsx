import { useState } from 'react';
import { Violation } from '../types';
import { ShieldAlert, AlertTriangle, Check, FileCheck2, Camera, Eye } from 'lucide-react';

interface ViolationCenterProps {
  violations: Violation[];
  onAcknowledgeViolation: (id: string, action: 'Acknowledge' | 'Issue') => void;
}

export default function ViolationCenter({ violations, onAcknowledgeViolation }: ViolationCenterProps) {
  const [selectedViol, setSelectedViol] = useState<Violation | null>(violations[0] || null);

  const getSeverityBadge = (severity: 'Critical' | 'Major' | 'Minor') => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 border-red-500/35 text-red-400';
      case 'Major':
        return 'bg-orange-500/10 border-orange-500/35 text-orange-400';
      case 'Minor':
      default:
        return 'bg-blue-500/10 border-blue-500/35 text-cyan-400';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/30">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              Violation Detection Center
            </h3>
            <p className="text-xs text-rose-400 font-mono">Module 05 • Real-time Traffic Citation & Evidence Log</p>
          </div>
        </div>

        <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-rose-500/15 border border-rose-800/40 text-rose-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
          {violations.filter(v => v.status === 'Alerting').length} Critical Unresolved
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Side Alert Queue (12/5 = col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
          {violations.map((v) => {
            const isSelected = selectedViol?.id === v.id;
            return (
              <div
                key={v.id}
                id={`viol-card-${v.id}`}
                onClick={() => setSelectedViol(v)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-950 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon status column */}
                  <div className={`p-2 rounded-lg shrink-0 ${
                    v.status === 'Alerting' ? 'bg-red-950/40 border border-red-800/35 text-red-400' : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-mono text-slate-400">{v.time}</span>
                    <h4 className="text-sm font-semibold text-slate-200">{v.type}</h4>
                    <span className="text-xs font-mono text-cyan-400">{v.location}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0 self-end sm:self-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getSeverityBadge(v.severity)}`}>
                    {v.severity}
                  </span>
                  <span className={`text-[10px] font-mono ${
                    v.status === 'Alerting' ? 'text-rose-400 font-bold' : v.status === 'Acknowledged' ? 'text-yellow-400' : 'text-emerald-500'
                  }`}>
                    {v.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Evidence Screen Inspector (12/5 = col-span-5) */}
        {selectedViol && (
          <div className="xl:col-span-5 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
            
            {/* Header Inspector */}
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-400" /> CCTV Snapshot Evidence
              </span>
              <span className="text-[9px] font-mono text-slate-500">ID: {selectedViol.id.toUpperCase()}</span>
            </div>

            {/* Simulated camera screenshot wireframe drawing using absolute CSS or custom stylized container */}
            <div className="relative w-full aspect-video bg-slate-900 border border-slate-800/50 rounded-lg overflow-hidden flex items-center justify-center p-3 text-center">
              {/* Sci-fi bounding crosshair overlays */}
              <div className="absolute top-2 left-2 border-t-2 border-l-2 border-cyan-500/60 w-3 h-3" />
              <div className="absolute top-2 right-2 border-t-2 border-r-2 border-cyan-500/60 w-3 h-3" />
              <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-cyan-500/60 w-3 h-3" />
              <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-cyan-500/60 w-3 h-3" />

              <div className="flex flex-col items-center gap-2 max-w-[90%] pointer-events-none">
                <Eye className="w-6 h-6 text-cyan-400 opacity-65 animate-pulse" />
                <p className="text-[10px] font-mono text-rose-200 leading-normal bg-rose-950/20 p-2.5 rounded border border-rose-900/30 italic">
                  "{selectedViol.evidenceImg}"
                </p>
                <span className="text-[9px] font-mono text-slate-500">
                  LICENSE GRID TARGET LOCK ENFORCED
                </span>
              </div>
            </div>

            {/* Interactive Control actions */}
            {selectedViol.status === 'Alerting' && (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  id={`btn-ack-${selectedViol.id}`}
                  onClick={() => onAcknowledgeViolation(selectedViol.id, 'Acknowledge')}
                  className="py-2 px-3 text-center rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 text-yellow-400" /> Acknowledge
                </button>
                <button
                  id={`btn-issue-${selectedViol.id}`}
                  onClick={() => onAcknowledgeViolation(selectedViol.id, 'Issue')}
                  className="py-2 px-3 text-center rounded-lg bg-rose-500 hover:bg-rose-600 font-bold text-slate-950 text-xs font-mono flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.3)] transition cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" /> Issue Ticket
                </button>
              </div>
            )}

            {selectedViol.status !== 'Alerting' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-center text-xs font-mono text-emerald-400 font-semibold">
                ✓ Event marked as {selectedViol.status.toUpperCase()} • Enforcement successful
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
