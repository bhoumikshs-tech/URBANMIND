import { useState } from 'react';
import { Settings, ShieldCheck, Cpu, KeyRound, Check, RefreshCw } from 'lucide-react';

export default function SettingsNode() {
  const [apiKeyConfirm, setApiKeyConfirm] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  const triggerReset = () => {
    setClearingLogs(true);
    setTimeout(() => {
      setClearingLogs(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
            <Settings className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-sans">
              System Configurations Node
            </h3>
            <p className="text-xs text-slate-400 font-mono">Module 11 • System Variables & Core Pipeline Diagnostics</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/20 px-2.5 py-0.5 rounded border border-emerald-900/30">
          ● STABLE INFRASTRUCTURE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Secrets Diagnostics card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-mono text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" /> API Authentication Secrets
            </div>
            <p className="text-[11px] font-mono text-slate-400 leading-normal">
              UrbanMind AI routes large language questions through a secure backend proxy to protect development credentials.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase">Gemini API Key Payload status</label>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>GEMINI_API_KEY</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> INJECTED
              </span>
            </div>
          </div>

          <p className="text-[10.5px] font-mono text-slate-500 italic leading-relaxed">
            *Secrets can be modified dynamically via the **Settings ➔ Secrets** panel inside the Google AI Studio UI.
          </p>
        </div>

        {/* Pipeline diagnostic panel */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-mono text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" /> YOLO Thread diagnostics
            </div>
            <p className="text-[11px] font-mono text-slate-400 leading-normal">
              CCTV analytical frames parse in isolated thread containers to preserve low latency telemetry flow curves.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Automated Pipeline thread reset</span>
            <button
              onClick={triggerReset}
              className="py-2 px-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${clearingLogs ? 'animate-spin' : ''}`} />
              {clearingLogs ? 'Re-keying locks...' : 'Re-optimize pipeline threads'}
            </button>
          </div>

          <div className="p-2 bg-slate-900/40 border border-slate-850 rounded-lg text-[10px] font-mono text-slate-500">
            Node: 0.0.0.0:3000 • Ingress Port: COMPASS // ACTIVE
          </div>
        </div>

      </div>
    </div>
  );
}
