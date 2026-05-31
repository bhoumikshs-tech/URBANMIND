import { useState } from 'react';
import { TabId, LocationData, Violation, EmergencyVehicle } from './types';
import { BENGALURU_NODES, DEMO_VIOLATIONS, DEMO_EMERGENCY_VEHICLES } from './constants';
import Header from './components/Header';
import CityGridBackground from './components/CityGridBackground';
import LandingHero from './components/LandingHero';
import MapContainer from './components/MapContainer';
import CCTVGrid from './components/CCTVGrid';
import PredictiveEngine from './components/PredictiveEngine';
import PersonalityAI from './components/PersonalityAI';
import StressHeatmap from './components/StressHeatmap';
import ViolationCenter from './components/ViolationCenter';
import EmergencyCorridor from './components/EmergencyCorridor';
import DigitalTwin from './components/DigitalTwin';
import SignalOptimization from './components/SignalOptimization';
import HotspotIntelligence from './components/HotspotIntelligence';
import AnalyticsCenter from './components/AnalyticsCenter';
import SettingsNode from './components/SettingsNode';
import CopilotAssistant from './components/CopilotAssistant';
import LoginPage from './components/LoginPage';
import IncidentEngine from './components/IncidentEngine';
import CitizenPortal from './components/CitizenPortal';
import { AlertCircle, User, LayoutGrid, Search, Bell, LogOut, Building2, Camera, ShieldAlert, Ambulance, Info, AlertTriangle, Eye, HeartPulse, Compass, Sliders, Cpu, BarChart3, Settings, Smartphone } from 'lucide-react';

export default function App() {
  // Onboarding & Help Guide state
  const [enteredDashboard, setEnteredDashboard] = useState(false);
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('urbanmind_guide_dismissed') !== 'true';
  });

  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem('urbanmind_guide_dismissed', 'true');
  };

  // Authenticated Operator State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    badge: string;
    contact: string;
    type: 'email' | 'mobile';
  } | null>(() => {
    try {
      const saved = localStorage.getItem('urbanmind_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLoginSuccess = (operator: { name: string; badge: string; contact: string; type: 'email' | 'mobile' }) => {
    setCurrentUser(operator);
    localStorage.setItem('urbanmind_session', JSON.stringify(operator));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('urbanmind_session');
    setShowProfileMenu(false);
    setEnteredDashboard(false);
  };

  const getUserInitials = (name: string) => {
    const parts = name.replace(/INSP\.|COMMISSIONER|OPERATOR/gi, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'OP';
  };

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [locations, setLocations] = useState<LocationData[]>(BENGALURU_NODES);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(BENGALURU_NODES[0]);
  const [violations, setViolations] = useState<Violation[]>(DEMO_VIOLATIONS);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>(DEMO_EMERGENCY_VEHICLES);
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'congestion' | 'stress' | 'violations' | 'emergency' | 'personality'>('traffic');
  const [cctvFeedMode, setCctvFeedMode] = useState<'yolo_live' | 'simulated'>('yolo_live');
  const [forecastTimeline, setForecastTimeline] = useState<'5m' | '10m' | '15m'>('15m');

  // Violation updater
  const handleAcknowledgeViolation = (id: string, action: 'Acknowledge' | 'Issue') => {
    setViolations((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updatedStatus = action === 'Issue' ? 'Issued' : 'Acknowledged';
          return { ...v, status: updatedStatus };
        }
        return v;
      })
    );
  };

  // Emergency prioritizer simulation trigger
  const handleTriggerCorridor = (evId: string) => {
    setEmergencyVehicles((prev) =>
      prev.map((ev) => {
        if (ev.id === evId) {
          return { ...ev, isActive: true, currentPositionIdx: 0 };
        }
        return ev;
      })
    );
    // automatically shift layer focus to Emergency
    setActiveLayer('emergency');
  };

  // Global updater to allow sub-modules to update traffic stats in parent state persistent
  const handleUpdateLocation = (updatedLoc: LocationData) => {
    setLocations((prev) => prev.map((l) => (l.id === updatedLoc.id ? updatedLoc : l)));
    if (selectedLocation?.id === updatedLoc.id) {
      setSelectedLocation(updatedLoc);
    }
  };

  const getWorkspaceIcon = (tab: TabId) => {
    switch (tab) {
      case 'overview': return Building2;
      case 'cctv': return Camera;
      case 'incidents': return AlertTriangle;
      case 'congestion': return Eye;
      case 'heatmap': return HeartPulse;
      case 'personality': return Compass;
      case 'emergency': return Ambulance;
      case 'signal': return Sliders;
      case 'violations': return ShieldAlert;
      case 'twin': return Cpu;
      case 'analytics': return BarChart3;
      case 'citizen': return Smartphone;
      case 'settings': return Settings;
      default: return Info;
    }
  };

  const getWorkspaceName = (tab: TabId) => {
    switch (tab) {
      case 'overview': return 'Bengaluru Mobility Map';
      case 'cctv': return 'Live CCTV Camera Tracking';
      case 'incidents': return 'Crisis Incident Control Room';
      case 'congestion': return 'LSTM Congestion Forecasting';
      case 'personality': return 'Driver Psychology & Behavioral TPI';
      case 'violations': return 'Plate Scanning Enforcement';
      case 'signal': return 'AI Signal Cycle Optimizer';
      case 'twin': return 'Digital Twin Scenario Sandbox';
      case 'analytics': return 'Urban Analytics Intelligence';
      case 'citizen': return 'Public Action Citizen Portal';
      case 'settings': return 'System Configurations Portal';
      case 'heatmap': return 'Traffic Stress Heatmap';
      case 'emergency': return 'Ambulance Preemption Channels';
      default: return 'UrbanMind Intelligence Suite';
    }
  };

  const getWorkspaceDescription = (tab: TabId) => {
    switch (tab) {
      case 'overview': return 'Explore real-time telemetry across Central Bengaluru intersection nodes.';
      case 'cctv': return 'Watch live camera streams overlayed with YOLO CNN speed calculations.';
      case 'incidents': return 'Review automated drone alerts, road blockages, and active police events.';
      case 'congestion': return 'View AI predictions of traffic bottlenecks based on historic flows.';
      case 'personality': return 'Profile driver traits based on acceleration peaks & speed variance.';
      case 'violations': return 'Manage red-light runners, wrong-side helmet violations, and illegal parking.';
      case 'signal': return 'Compare manual cycles with AI optimized patterns and trigger overrides.';
      case 'twin': return 'Simulate extreme monsoon floods, gridlock events and metro roadworks.';
      case 'analytics': return 'Audit historic city health values, carbon indexing curves, and vehicle loads.';
      case 'citizen': return 'Crowdsource active pothole complaints and hazard logs from citizen mobile apps.';
      case 'settings': return 'Adjust camera feed intervals, ML detection filters and simulation speeds.';
      case 'heatmap': return 'Review acoustic noise scores and structural friction across municipal nodes.';
      case 'emergency': return 'Coordinate active sirens, audio tracks and prioritize ambulance channels.';
      default: return 'Real-time city-scale mobile twin visualization suite.';
    }
  };

  // Safe tab selection wrapper
  const handleTabSelection = (tab: TabId) => {
    setActiveTab(tab);
    // align matching layers on map transition
    if (tab === 'cctv') setActiveLayer('traffic');
    if (tab === 'congestion') setActiveLayer('congestion');
    if (tab === 'personality') setActiveLayer('personality');
    if (tab === 'heatmap') setActiveLayer('stress');
    if (tab === 'violations') setActiveLayer('violations');
    if (tab === 'emergency') setActiveLayer('emergency');
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col antialiased select-none font-sans overflow-hidden relative">
      
      {/* Animated Bengaluru Traffic Flow Grid Background */}
      <CityGridBackground />

      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-cyan/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-accent-purple/2 rounded-full blur-3xl pointer-events-none" />

      {/* Render Main Header */}
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabSelection}
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        cctvFeedMode={cctvFeedMode}
        onFeedModeChange={setCctvFeedMode}
        forecastTimeline={forecastTimeline}
        onForecastTimelineChange={setForecastTimeline}
        unresolvedAlertsCount={violations.filter(v => v.status === 'Alerting').length}
        activePreemptionActive={emergencyVehicles.some(ev => ev.isActive)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Primary Context Dashboard layout */}
      {activeTab === 'overview' && !enteredDashboard ? (
        <LandingHero 
          onEnterDashboard={() => {
            setEnteredDashboard(true);
            handleTabSelection('overview');
          }} 
        />
      ) : (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">

          {/* Main scrollable viewport */}
          <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
            
            {/* Layout Engine Choice */}
            {(() => {
              const isMapCritical = activeTab === 'overview' || activeTab === 'heatmap' || activeTab === 'emergency';
              
              if (isMapCritical) {
                // MAP INTEGRATED NETWORK MONITORING SCENE
                return (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* Map Content Column (xl:col-span-8) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">
                      
                      {/* Interactive Help Tour Banner */}
                      {showGuide && activeTab === 'overview' && (
                        <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl relative backdrop-blur-md shadow-sm">
                          <button 
                            onClick={dismissGuide}
                            className="absolute top-3 right-3 text-slate-400 hover:text-white transition duration-150 cursor-pointer text-xs"
                            title="Dismiss guide"
                          >
                            ✕
                          </button>
                          <div className="flex items-start gap-3.5 pr-6">
                            <div className="p-2 border border-indigo-500/20 bg-indigo-500/10 rounded-xl mt-0.5 text-indigo-400 shrink-0">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1.5 font-sans">
                              <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                                Quick Start Guide
                              </h4>
                              <p className="text-[11.5px] leading-relaxed text-slate-300">
                                Welcome to the traffic control center. The operational workspaces are integrated as follows:
                              </p>
                              <ul className="text-[11px] text-slate-400 list-disc list-inside flex flex-col gap-1 mt-0.5">
                                <li>
                                  <strong className="text-slate-200">Interactive Map:</strong> Select any intersection node (circles on the map) to query sensor feeds, average speeds, and traffic scores.
                                </li>
                                <li>
                                  <strong className="text-slate-200">Unified Sidebar:</strong> Navigate via the categorized sidebar to view real-time traffic camera feeds, pre-emptive ambulance corridors, or flood logs.
                                </li>
                                <li>
                                  <strong className="text-slate-200">Digital Copilot:</strong> Ask the assistant questions like "Where are the bottleneck zones right now?" to coordinate updates.
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                                          {/* KPI Summary Cards on Overview tab */}
                      {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Network Peak Load</span>
                              <span className="text-xl font-bold font-sans text-indigo-400">74.2%</span>
                              <span className="text-[9px] text-slate-400 mt-0.5">Steady overall flow</span>
                            </div>
                            <div className="text-indigo-400 opacity-20 group-hover:opacity-30 transition-opacity">
                              <Building2 className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Active Stream Feeds</span>
                              <span className="text-xl font-bold font-sans text-emerald-400">12 / 12 Nodes</span>
                              <span className="text-[9px] text-emerald-400/95 mt-0.5">● Monitoring active</span>
                            </div>
                            <div className="text-emerald-400 opacity-20 group-hover:opacity-30 transition-opacity">
                              <Camera className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Alerts & Incidents</span>
                              <span className="text-xl font-bold font-sans text-rose-400">
                                {violations.filter(v => v.status === 'Alerting').length} Critical
                              </span>
                              <span className="text-[9px] text-slate-400 mt-0.5">Pending operator review</span>
                            </div>
                            <div className="text-rose-400 opacity-20 group-hover:opacity-30 transition-opacity">
                              <ShieldAlert className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Active Preemption</span>
                              <span className="text-xl font-bold font-sans text-violet-400">
                                {emergencyVehicles.some(ev => ev.isActive) ? '1 Corridor Active' : '0 Sirens'}
                              </span>
                              <span className="text-[9px] text-slate-400 mt-0.5">Emergency audio/route</span>
                            </div>
                            <div className="text-violet-400 opacity-20 group-hover:opacity-30 transition-opacity">
                              <Ambulance className="w-8 h-8" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Main Dynamic Map Container Wrapper */}
                      <section id="map-layer-section" className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-sans font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Bengaluru Mobility Map
                          </span>
                          <span className="text-[10.5px] font-sans text-slate-400">
                            Select a node on the map to query data
                          </span>
                        </div>
                        <MapContainer
                          locations={locations}
                          selectedLocation={selectedLocation}
                          onSelectLocation={setSelectedLocation}
                          activeLayer={activeLayer}
                          onLayerChange={setActiveLayer}
                          emergencyVehicles={emergencyVehicles}
                        />
                      </section>

                      {/* Submodule clean routing rendering */}
                      <div className="transition-all duration-300">
                        {activeTab === 'heatmap' && (
                          <StressHeatmap
                            locations={locations}
                            selectedLocation={selectedLocation}
                            onSelectLocation={setSelectedLocation}
                          />
                        )}

                        {activeTab === 'emergency' && (
                          <EmergencyCorridor
                            emergencyVehicles={emergencyVehicles}
                            onTriggerCorridor={handleTriggerCorridor}
                            locations={locations}
                          />
                        )}
                      </div>

                      {/* Unified Command Deck analytics card */}
                      {activeTab === 'overview' && (
                        <AnalyticsCenter />
                      )}

                    </div>

                    {/* Chat and HUD Sidebar Column (xl:col-span-4) */}
                    <div className="xl:col-span-4 flex flex-col gap-5 sticky top-0">
                      <CopilotAssistant locations={locations} />

                      {/* Selected Location widget */}
                      {selectedLocation && (
                        <div className="bg-slate-950/95 border border-slate-900 p-4 rounded-2xl backdrop-blur-md shadow-xl flex flex-col gap-3 font-sans">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Selected Intersection</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-sm font-semibold text-slate-100">{selectedLocation.name}</h4>
                            <span className="text-xs text-indigo-400">Node ID: BNG_{selectedLocation.id.toUpperCase().substring(0, 4)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="bg-slate-900/60 border border-slate-800/65 p-2.5 rounded-xl flex flex-col gap-0.5">
                              <span className="text-[9px] text-slate-400 uppercase font-semibold">Average Velocity</span>
                              <span className="text-sm font-bold text-amber-500">{selectedLocation.speed} km/h</span>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800/65 p-2.5 rounded-xl flex flex-col gap-0.5">
                              <span className="text-[9px] text-slate-400 uppercase font-semibold">Acoustic Score</span>
                              <span className="text-sm font-bold text-violet-400">{selectedLocation.stressScore}/100</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              } else {
                // SPECIAL WORKSPACE FULL-WIDTH CLEAN DETAIL PANEL (CCTV, Congestion, Violations, Signal, Twin, etc.)
                return (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* Specialized Full Width Component Workspace (xl:col-span-9) */}
                    <div className="xl:col-span-9 flex flex-col gap-6">

                      {/* Router for self-contained components */}
                      <div className="transition-all duration-300">
                        {activeTab === 'cctv' && (
                          <CCTVGrid
                            locations={locations}
                            selectedLocation={selectedLocation}
                            onSelectLocation={setSelectedLocation}
                            onUpdateLocation={handleUpdateLocation}
                            feedMode={cctvFeedMode}
                            onFeedModeChange={setCctvFeedMode}
                          />
                        )}

                        {activeTab === 'congestion' && (
                          <PredictiveEngine
                            locations={locations}
                            selectedLocation={selectedLocation}
                            onSelectLocation={setSelectedLocation}
                            onUpdateLocation={handleUpdateLocation}
                            forecastTimeline={forecastTimeline}
                            onForecastTimelineChange={setForecastTimeline}
                          />
                        )}

                        {activeTab === 'personality' && (
                          <PersonalityAI
                            locations={locations}
                            selectedLocation={selectedLocation}
                            onSelectLocation={setSelectedLocation}
                            onUpdateLocation={handleUpdateLocation}
                          />
                        )}

                        {activeTab === 'violations' && (
                          <ViolationCenter
                            violations={violations}
                            onAcknowledgeViolation={handleAcknowledgeViolation}
                          />
                        )}

                        {activeTab === 'twin' && <DigitalTwin />}
                        {activeTab === 'incidents' && <IncidentEngine />}
                        {activeTab === 'citizen' && <CitizenPortal />}
                        {activeTab === 'signal' && <SignalOptimization locations={locations} />}
                        {activeTab === 'analytics' && <HotspotIntelligence />}
                        {activeTab === 'settings' && <SettingsNode />}
                      </div>

                    </div>

                    {/* Copilot Sidebar (xl:col-span-3 - perfectly fits beside compact wide workspace) */}
                    <div className="xl:col-span-3 flex flex-col gap-5 sticky top-0">
                      <CopilotAssistant locations={locations} />

                      {/* Collapsed Mode Node Info */}
                      {selectedLocation && (
                        <div className="bg-slate-950/95 border border-slate-900 p-4 rounded-2xl backdrop-blur-md shadow-xl flex flex-col gap-3 font-sans">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Intersection</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-semibold text-slate-100">{selectedLocation.name}</h4>
                            <span className="text-[10px] text-indigo-400 font-medium">BNG_{selectedLocation.id.toUpperCase().substring(0, 4)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div className="bg-slate-900/60 border border-slate-800/65 px-2.5 py-1.5 rounded-lg flex flex-col gap-0.5">
                              <span className="text-[8px] text-slate-400 uppercase font-semibold">Velocity</span>
                              <span className="font-bold text-amber-500">{selectedLocation.speed} km/h</span>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800/65 px-2.5 py-1.5 rounded-lg flex flex-col gap-0.5">
                              <span className="text-[8px] text-slate-400 uppercase font-semibold">Stress</span>
                              <span className="font-bold text-violet-400">{selectedLocation.stressScore}/100</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              }
            })()}

          </main>

        </div>
      )}

    </div>
  );
}
