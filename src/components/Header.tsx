import { useState } from 'react';
import { TabId, LocationData } from '../types';
import { 
  Building2, Camera, Compass, HeartPulse, ShieldAlert,
  Ambulance, Cpu, Sliders, BarChart3, Settings, Eye,
  AlertTriangle, Smartphone, ChevronDown, Bell, LogOut, Info,
  Menu, X
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  activeLayer: 'traffic' | 'congestion' | 'stress' | 'violations' | 'emergency' | 'personality';
  onLayerChange: (layer: 'traffic' | 'congestion' | 'stress' | 'violations' | 'emergency' | 'personality') => void;
  cctvFeedMode: 'yolo_live' | 'simulated';
  onFeedModeChange: (mode: 'yolo_live' | 'simulated') => void;
  forecastTimeline: '5m' | '10m' | '15m';
  onForecastTimelineChange: (val: '5m' | '10m' | '15m') => void;
  unresolvedAlertsCount: number;
  activePreemptionActive: boolean;
  currentUser: {
    name: string;
    badge: string;
    contact: string;
    type: 'email' | 'mobile';
  } | null;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
  locations,
  selectedLocation,
  onSelectLocation,
  activeLayer,
  onLayerChange,
  cctvFeedMode,
  onFeedModeChange,
  forecastTimeline,
  onForecastTimelineChange,
  unresolvedAlertsCount,
  activePreemptionActive,
  currentUser,
  onLogout
}: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuGroups = [
    {
      id: 'operations',
      title: 'Operations',
      colorClass: 'text-indigo-400',
      borderClass: 'border-indigo-500/20',
      bgClass: 'bg-indigo-500/5',
      items: [
        { id: 'overview', label: 'Network Overview', icon: Building2, desc: 'Live map & smart metrics' },
        { id: 'cctv', label: 'CCTV Camera Feeds', icon: Camera, desc: 'Looping traffic cams' },
        { id: 'incidents', label: 'Incident Desk', icon: AlertTriangle, desc: 'Crisis alerts & reports' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Maps',
      colorClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/20',
      bgClass: 'bg-emerald-500/5',
      items: [
        { id: 'congestion', label: 'Congestion Forecast', icon: Eye, desc: 'Predictive bottleneck list' },
        { id: 'heatmap', label: 'Traffic Heatmap', icon: HeartPulse, desc: 'Road pressure tracking' },
        { id: 'personality', label: 'Driving Character', icon: Compass, desc: 'Driver behavioral profiles' }
      ]
    },
    {
      id: 'interventions',
      title: 'Interventions',
      colorClass: 'text-amber-400',
      borderClass: 'border-amber-500/20',
      bgClass: 'bg-amber-500/5',
      items: [
        { id: 'emergency', label: 'Ambulance Routes', icon: Ambulance, desc: 'Green corridor control' },
        { id: 'signal', label: 'Signal Timers', icon: Sliders, desc: 'Cycle length optimization' },
        { id: 'violations', label: 'Traffic Violations', icon: ShieldAlert, desc: 'Ticketing & plate radar' }
      ]
    },
    {
      id: 'portal',
      title: 'Portal & Twin',
      colorClass: 'text-pink-400',
      borderClass: 'border-pink-500/20',
      bgClass: 'bg-pink-500/5',
      items: [
        { id: 'twin', label: 'Digital Twin Sim', icon: Cpu, desc: 'Scenario dry-runs' },
        { id: 'analytics', label: 'Historic Charts', icon: BarChart3, desc: 'City progress metrics' },
        { id: 'citizen', label: 'Citizen Reports', icon: Smartphone, desc: 'Mobile public feedback' },
        { id: 'settings', label: 'System Settings', icon: Settings, desc: 'Advanced thresholds' }
      ]
    }
  ];

  const toggleDropdown = (id: string) => {
    setOpenDropdown(prev => prev === id ? null : id);
    setShowProfileMenu(false);
  };

  const handleItemClick = (id: TabId) => {
    onTabChange(id);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const getActiveGroup = () => {
    return menuGroups.find(g => g.items.some(item => item.id === activeTab));
  };

  const getActiveItem = () => {
    for (const group of menuGroups) {
      const found = group.items.find(item => item.id === activeTab);
      if (found) return found;
    }
    return null;
  };

  const getUserInitials = (name: string) => {
    const parts = name.replace(/INSP\.|COMMISSIONER|OPERATOR/gi, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'OP';
  };

  const activeGroup = getActiveGroup();
  const activeItem = getActiveItem();

  return (
    <header className="relative w-full shrink-0 bg-[#07090e]/95 border-b border-slate-900 z-50 shadow-lg select-none font-sans">
      {/* Invisible backdrop to dismiss open dropdowns easily */}
      {(openDropdown || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setOpenDropdown(null);
            setShowProfileMenu(false);
          }} 
        />
      )}

      {/* Main Bar */}
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo launcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md">
            UM
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight leading-none uppercase">
              UrbanMind
            </h1>
            <span className="text-[9px] text-[#38bdf8] font-bold tracking-wider mt-0.5">
              BENGALURU MONITORS
            </span>
          </div>
        </div>

        {/* Center: Horizontal Menu Triggers (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0b0e14]/60 border border-slate-900/80 p-1 rounded-xl">
          {menuGroups.map((group) => {
            const isGroupActive = activeGroup?.id === group.id;
            const isDropdownOpen = openDropdown === group.id;
            // Find active inside label
            const activeInside = group.items.find(item => item.id === activeTab);

            return (
              <div key={group.id} className="relative z-50">
                <button
                  onClick={() => toggleDropdown(group.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isGroupActive
                      ? 'bg-indigo-600/90 text-white border border-indigo-500/25 shadow-sm'
                      : isDropdownOpen
                      ? 'bg-slate-900 text-slate-100 border border-slate-800'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 bg-transparent border border-transparent'
                  }`}
                >
                  <span>{group.title}</span>
                  {activeInside && (
                    <span className="text-[10px] font-medium bg-black/40 text-indigo-300 font-sans px-1.5 py-0.5 rounded ml-0.5 max-w-[110px] truncate">
                      {activeInside.label}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Card */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-[#090c12]/95 border border-slate-800/90 rounded-xl shadow-2xl p-2.5 flex flex-col gap-1 z-50 animate-fadeIn backdrop-blur-md">
                    <div className="px-2 py-1.5 border-b border-slate-900 mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Select Workspace
                      </span>
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id as TabId)}
                          className={`w-full p-2 rounded-lg text-left text-xs transition duration-150 flex items-start gap-3 cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600/95 text-white'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md mt-0.5 ${isActive ? 'bg-indigo-500/20 text-white' : 'bg-slate-950 text-slate-400 border border-slate-900'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold leading-tight">{item.label}</span>
                            <span className={`text-[10px] font-light mt-0.5 truncate leading-none ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Dynamic option configurations & Profile menu */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 z-50">
          {/* Dynamic Option Selector depending on current tab */}
          {/* Node dropdown: present for overview, heatmap, emergency, cctv, congestion, personality, signals */}
          {['overview', 'heatmap', 'emergency', 'cctv', 'congestion', 'personality', 'signal'].includes(activeTab) && selectedLocation && (
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden xs:inline">📍 node:</span>
              <select
                id="navbar-location-selector"
                value={selectedLocation.id}
                onChange={(e) => {
                  const matched = locations.find((l) => l.id === e.target.value);
                  if (matched) onSelectLocation(matched);
                }}
                className="bg-transparent border-none text-[10px] sm:text-xs font-bold text-slate-200 focus:outline-none cursor-pointer max-w-[95px] sm:max-w-[130px] truncate"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200 font-semibold text-xs">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Map Layer switcher option */}
          {['overview', 'heatmap', 'emergency'].includes(activeTab) && (
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden xs:inline">🛡️ map layer:</span>
              <select
                value={activeLayer}
                onChange={(e) => onLayerChange(e.target.value as any)}
                className="bg-transparent border-none text-[10px] sm:text-xs font-bold text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="traffic" className="bg-slate-950 text-slate-200 font-semibold text-xs">Traffic Flow</option>
                <option value="congestion" className="bg-slate-950 text-slate-200 font-semibold text-xs">ML Forecast</option>
                <option value="stress" className="bg-slate-950 text-slate-200 font-semibold text-xs">Stress Heatmap</option>
                <option value="violations" className="bg-slate-950 text-slate-200 font-semibold text-xs">Violation Radar</option>
                <option value="emergency" className="bg-slate-950 text-slate-200 font-semibold text-xs">Emergency</option>
                <option value="personality" className="bg-slate-950 text-slate-200 font-semibold text-xs">Driving Behavior</option>
              </select>
            </div>
          )}

          {/* CCTV Mode details option */}
          {activeTab === 'cctv' && (
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden xs:inline">🎥 feed source:</span>
              <select
                value={cctvFeedMode}
                onChange={(e) => onFeedModeChange(e.target.value as any)}
                className="bg-transparent border-none text-[10px] sm:text-xs font-bold text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="yolo_live" className="bg-slate-950 text-slate-200 font-semibold text-xs">🎥 YOLO CNN Stream</option>
                <option value="simulated" className="bg-slate-950 text-slate-200 font-semibold text-xs">📊 Sim Radar Chart</option>
              </select>
            </div>
          )}

          {/* Forecast horizon select option */}
          {activeTab === 'congestion' && (
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider hidden xs:inline">🔮 forecast:</span>
              <select
                value={forecastTimeline}
                onChange={(e) => onForecastTimelineChange(e.target.value as any)}
                className="bg-transparent border-none text-[10px] sm:text-xs font-bold text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="5m" className="bg-slate-950 text-slate-200 font-semibold text-xs">5m Horizon</option>
                <option value="10m" className="bg-slate-950 text-slate-200 font-semibold text-xs">10m Horizon</option>
                <option value="15m" className="bg-slate-950 text-slate-200 font-semibold text-xs">15m Horizon</option>
              </select>
            </div>
          )}

          {/* Notification Alert Ticker */}
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:text-white transition relative cursor-pointer text-slate-400">
            <Bell className="w-4 h-4" />
            {unresolvedAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* User Account / Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setOpenDropdown(null);
              }}
              className="flex items-center gap-2 bg-slate-950/40 border border-slate-850 p-1.5 rounded-xl transition hover:bg-black/35 hover:border-indigo-500/25 cursor-pointer text-left focus:outline-none"
            >
              <div className="h-7 w-7 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400 uppercase">
                {getUserInitials(currentUser?.name || 'OP')}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-60 bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl z-50 animate-fadeIn font-sans text-xs flex flex-col gap-3">
                <div className="flex flex-col border-b border-slate-900 pb-2">
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Operator Session</span>
                  <span className="font-bold text-slate-200 mt-1">{currentUser?.name}</span>
                  <span className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.contact}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Duty Badge:</span>
                  <span className="text-[11px] text-slate-300 font-medium">{currentUser?.badge}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full mt-1 py-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-[#0d1017] border border-slate-800 text-slate-300 rounded-xl"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Responsive dropdown listing all categories inline) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-[#07090e]/98 p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {menuGroups.map((group) => {
            const isGroupActive = activeGroup?.id === group.id;
            return (
              <div key={group.id} className="flex flex-col gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider pl-1.5 ${isGroupActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {group.title}
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id as TabId)}
                        className={`p-2 rounded-lg text-left text-[11px] flex items-center gap-2 border transition duration-155 cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-950/60 border-slate-900 text-slate-300 hover:bg-slate-950 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-Header Area: Dynamic active route breadcrumbs descriptor */}
      {activeItem && (
        <div className="bg-[#0b0e14]/40 border-t border-slate-900/60 px-6 py-1.5 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">WORKSPACE:</span>
          <span className="text-indigo-400 uppercase tracking-wide">{onTabChange ? activeItem.label : activeTab}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500 leading-none truncate max-w-sm font-light">
            {activeItem.desc}
          </span>
        </div>
      )}
    </header>
  );
}
