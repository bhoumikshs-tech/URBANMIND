export type TabId = 
  | 'overview' 
  | 'cctv' 
  | 'congestion' 
  | 'personality' 
  | 'heatmap' 
  | 'violations' 
  | 'emergency' 
  | 'twin' 
  | 'signal' 
  | 'analytics' 
  | 'incidents'
  | 'citizen'
  | 'settings';

export interface LocationData {
  id: string;
  name: string;
  lat: number;   // normalized coordinate for SVG (0-100)
  lng: number;   // normalized coordinate for SVG (0-100)
  vehicleCount: number;
  avgDensity: number; // 0-100 %
  trafficScore: number; // 0-100, lower is better
  cameraState: 'active' | 'warning' | 'offline';
  speed: number; // km/h
  stressScore: number; // 0-100
  personality: 'Calm' | 'Aggressive' | 'Chaotic' | 'Unstable';
  congestionTrend: number[]; // 10 historic data points
  predictions: {
    min5: number;
    min10: number;
    min15: number;
    confidence: number;
  };
  wrongSideCount: number;
  helmetViolationCount: number;
  illegalParkingCount: number;
  signalTiming: {
    current: number; // seconds
    recommended: number; // seconds
  };
}

export interface Violation {
  id: string;
  type: 'Wrong-side driving' | 'Red-light jumping' | 'Illegal parking' | 'Helmet violation' | 'Lane violation';
  location: string;
  time: string;
  severity: 'Critical' | 'Major' | 'Minor';
  evidenceImg: string; // inline dynamic Canvas representation or text description
  status: 'Alerting' | 'Acknowledged' | 'Issued';
}

export interface EmergencyVehicle {
  id: string;
  type: 'Ambulance' | 'Fire Brigade' | 'Police';
  route: string[]; // List of location IDs
  currentPositionIdx: number;
  etaMinutes: number;
  priorityLevel: 'Ultra' | 'High';
  recommendedAction: string;
  isActive: boolean;
  pulseOffset: number;
}

export interface DigitalScenario {
  id: string;
  name: string;
  description: string;
  type: 'closure' | 'rain' | 'accident' | 'metro' | 'construction';
  impactBefore: {
    avgSpeed: number; // km/h
    travelTime: number; // min
    density: number; // %
  };
  impactAfter: {
    avgSpeed: number; // km/h
    travelTime: number; // min
    density: number; // %
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
