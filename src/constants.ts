import { LocationData, DigitalScenario, Violation, EmergencyVehicle } from './types';

export const BENGALURU_NODES: LocationData[] = [
  {
    id: 'silk-board',
    name: 'Silk Board Junction',
    lat: 78,
    lng: 48,
    vehicleCount: 1420,
    avgDensity: 92,
    trafficScore: 88,
    cameraState: 'active',
    speed: 12,
    stressScore: 94,
    personality: 'Chaotic',
    congestionTrend: [75, 80, 82, 85, 88, 90, 94, 95, 93, 92],
    predictions: {
      min5: 94,
      min10: 96,
      min15: 98,
      confidence: 96
    },
    wrongSideCount: 18,
    helmetViolationCount: 35,
    illegalParkingCount: 12,
    signalTiming: { current: 120, recommended: 145 }
  },
  {
    id: 'electronic-city',
    name: 'Electronic City Tollway',
    lat: 92,
    lng: 78,
    vehicleCount: 840,
    avgDensity: 58,
    trafficScore: 45,
    cameraState: 'active',
    speed: 55,
    stressScore: 42,
    personality: 'Calm',
    congestionTrend: [40, 42, 45, 50, 52, 55, 60, 58, 59, 58],
    predictions: {
      min5: 56,
      min10: 55,
      min15: 54,
      confidence: 94
    },
    wrongSideCount: 2,
    helmetViolationCount: 8,
    illegalParkingCount: 5,
    signalTiming: { current: 90, recommended: 85 }
  },
  {
    id: 'kr-puram',
    name: 'KR Puram Suspension Bridge',
    lat: 32,
    lng: 82,
    vehicleCount: 1150,
    avgDensity: 84,
    trafficScore: 78,
    cameraState: 'warning',
    speed: 18,
    stressScore: 81,
    personality: 'Aggressive',
    congestionTrend: [65, 70, 75, 78, 80, 82, 85, 84, 83, 84],
    predictions: {
      min5: 86,
      min10: 89,
      min15: 91,
      confidence: 91
    },
    wrongSideCount: 11,
    helmetViolationCount: 22,
    illegalParkingCount: 8,
    signalTiming: { current: 100, recommended: 115 }
  },
  {
    id: 'hebbal',
    name: 'Hebbal Flyover Entrance',
    lat: 16,
    lng: 32,
    vehicleCount: 1310,
    avgDensity: 88,
    trafficScore: 82,
    cameraState: 'active',
    speed: 22,
    stressScore: 85,
    personality: 'Unstable',
    congestionTrend: [70, 74, 78, 82, 85, 88, 90, 89, 87, 88],
    predictions: {
      min5: 90,
      min10: 92,
      min15: 94,
      confidence: 95
    },
    wrongSideCount: 9,
    helmetViolationCount: 19,
    illegalParkingCount: 14,
    signalTiming: { current: 110, recommended: 125 }
  },
  {
    id: 'whitefield',
    name: 'Whitefield ITPL Main Rd',
    lat: 52,
    lng: 91,
    vehicleCount: 950,
    avgDensity: 76,
    trafficScore: 70,
    cameraState: 'active',
    speed: 28,
    stressScore: 74,
    personality: 'Chaotic',
    congestionTrend: [60, 64, 68, 70, 72, 75, 78, 77, 75, 76],
    predictions: {
      min5: 78,
      min10: 80,
      min15: 84,
      confidence: 89
    },
    wrongSideCount: 14,
    helmetViolationCount: 26,
    illegalParkingCount: 19,
    signalTiming: { current: 90, recommended: 105 }
  },
  {
    id: 'mg-road',
    name: 'MG Road Metro Station',
    lat: 44,
    lng: 48,
    vehicleCount: 1080,
    avgDensity: 70,
    trafficScore: 61,
    cameraState: 'active',
    speed: 34,
    stressScore: 59,
    personality: 'Calm',
    congestionTrend: [50, 52, 55, 58, 62, 65, 68, 71, 72, 70],
    predictions: {
      min5: 72,
      min10: 74,
      min15: 75,
      confidence: 93
    },
    wrongSideCount: 3,
    helmetViolationCount: 12,
    illegalParkingCount: 6,
    signalTiming: { current: 80, recommended: 85 }
  },
  {
    id: 'marathahalli',
    name: 'Marathahalli Multiplex Ring Rd',
    lat: 58,
    lng: 76,
    vehicleCount: 1240,
    avgDensity: 86,
    trafficScore: 80,
    cameraState: 'active',
    speed: 15,
    stressScore: 89,
    personality: 'Aggressive',
    congestionTrend: [72, 76, 78, 81, 84, 87, 89, 88, 85, 86],
    predictions: {
      min5: 88,
      min10: 91,
      min15: 93,
      confidence: 92
    },
    wrongSideCount: 15,
    helmetViolationCount: 29,
    illegalParkingCount: 11,
    signalTiming: { current: 100, recommended: 120 }
  }
];

// Ensure they match correct personality type
BENGALURU_NODES.forEach(n => {
  if (n.id === 'whitefield') {
    n.personality = 'Chaotic'; // Align types strictly
  }
});

export const MAP_CONNECTIONS = [
  { from: 'hebbal', to: 'mg-road' },
  { from: 'mg-road', to: 'silk-board' },
  { from: 'silk-board', to: 'electronic-city' },
  { from: 'hebbal', to: 'kr-puram' },
  { from: 'kr-puram', to: 'whitefield' },
  { from: 'mg-road', to: 'marathahalli' },
  { from: 'marathahalli', to: 'whitefield' },
  { from: 'silk-board', to: 'marathahalli' },
  { from: 'marathahalli', to: 'kr-puram' }
];

export const DEMO_VIOLATIONS: Violation[] = [
  {
    id: 'viol-1',
    type: 'Wrong-side driving',
    location: 'Silk Board Junction',
    time: '09:47:12 AM',
    severity: 'Critical',
    evidenceImg: 'Black Activa 5G (KA-03-HL-4911) riding on the freeway entry ramp against oncoming heavy traffic flow.',
    status: 'Alerting'
  },
  {
    id: 'viol-2',
    type: 'Helmet violation',
    location: 'KR Puram Suspension Bridge',
    time: '09:45:04 AM',
    severity: 'Minor',
    evidenceImg: 'Rider on white KTM Duke (KA-53-E-8820) passing the toll camera without helmet. Fast speed profile tags applied.',
    status: 'Acknowledged'
  },
  {
    id: 'viol-3',
    type: 'Illegal parking',
    location: 'Whitefield ITPL Main Rd',
    time: '09:42:30 AM',
    severity: 'Major',
    evidenceImg: 'Yellow Delivery Van (KA-01-MD-9031) blocking the leftmost transit lane on the heavy shoulder curb.',
    status: 'Issued'
  },
  {
    id: 'viol-4',
    type: 'Red-light jumping',
    location: 'Marathahalli Multiplex Ring Rd',
    time: '09:39:15 AM',
    severity: 'Critical',
    evidenceImg: 'Red SUV (KA-51-P-3392) jumped signal phase 4 during amber transitioning, speed exceeded transit margin of 45km/h.',
    status: 'Alerting'
  }
];

export const DEMO_EMERGENCY_VEHICLES: EmergencyVehicle[] = [
  {
    id: 'em-1',
    type: 'Ambulance',
    route: ['electronic-city', 'silk-board', 'mg-road'],
    currentPositionIdx: 0,
    etaMinutes: 11,
    priorityLevel: 'Ultra',
    recommendedAction: 'Trigger Green Corridor phase override over Silk Board Sector A intersection to preempt congestion gridlock.',
    isActive: true,
    pulseOffset: 0
  },
  {
    id: 'em-2',
    type: 'Fire Brigade',
    route: ['whitefield', 'marathahalli', 'silk-board'],
    currentPositionIdx: 0,
    etaMinutes: 14,
    priorityLevel: 'High',
    recommendedAction: 'Divert surrounding cargo fleet onto Indiranagar expressway connector to prevent bottleneck at Marathahalli flyover.',
    isActive: true,
    pulseOffset: 12
  }
];

export const SCENARIOS: DigitalScenario[] = [
  {
    id: 'rain',
    name: 'Heavy Monsoon Rain (5cm/hr)',
    description: 'Bengaluru South hits saturation. Marathahalli and Silk Board waterlogging pools occur, bringing average speeds down.',
    type: 'rain',
    impactBefore: { avgSpeed: 35, travelTime: 22, density: 65 },
    impactAfter: { avgSpeed: 10, travelTime: 72, density: 96 }
  },
  {
    id: 'accident',
    name: 'Silk Board Multi-Vehicle Blockage',
    description: 'A chemical container breakdown at Central Silk Board slip road blocks 2 lanes, causing major spillback into Sector 4.',
    type: 'accident',
    impactBefore: { avgSpeed: 12, travelTime: 15, density: 92 },
    impactAfter: { avgSpeed: 4, travelTime: 55, density: 98 }
  },
  {
    id: 'construction',
    name: 'Flyover Structural Repairs (Hebbal)',
    description: 'Sub-grouting flyover reinforcement on National Highway Hebbal main loop closes secondary lane.',
    type: 'construction',
    impactBefore: { avgSpeed: 22, travelTime: 18, density: 88 },
    impactAfter: { avgSpeed: 8, travelTime: 45, density: 95 }
  }
];
