import { useEffect, useRef } from 'react';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  pulseSpeed: number;
  baseRadius: number;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  speedMultiplier: number;
  intensity: number;
  lanes: number;
}

interface Particle {
  fromNode: Node;
  toNode: Node;
  progress: number;
  speed: number;
  size: number;
  color: string;
  lane: number;
}

export default function CityGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Map Bengaluru key points into a normalized proportional canvas grid
    const nodes: Node[] = [
      { id: 'silkboard', name: 'Silk Board Junction', x: 0.35, y: 0.78, pulseSpeed: 0.03, baseRadius: 6, color: '#f59e0b' },
      { id: 'mgroad', name: 'MG Road Metro', x: 0.5, y: 0.45, pulseSpeed: 0.02, baseRadius: 5, color: '#10b981' },
      { id: 'hebbal', name: 'Hebbal Flyover', x: 0.48, y: 0.15, pulseSpeed: 0.015, baseRadius: 6, color: '#06b6d4' },
      { id: 'townhall', name: 'Town Hall Node', x: 0.31, y: 0.49, pulseSpeed: 0.025, baseRadius: 5, color: '#ef4444' },
      { id: 'tin_factory', name: 'Tin Factory Route', x: 0.75, y: 0.38, pulseSpeed: 0.035, baseRadius: 5.5, color: '#f59e0b' },
      { id: 'indiranagar', name: 'Indiranagar 100ft Rd', x: 0.65, y: 0.51, pulseSpeed: 0.022, baseRadius: 4.5, color: '#8b5cf6' },
      { id: 'koramangala', name: 'Koramangala Sony World', x: 0.48, y: 0.66, pulseSpeed: 0.028, baseRadius: 5, color: '#ec4899' },
      { id: 'whitefield', name: 'Whitefield ITPL', x: 0.88, y: 0.52, pulseSpeed: 0.018, baseRadius: 6, color: '#10b981' },
      { id: 'electronics_city', name: 'Electronic City Toll', x: 0.42, y: 0.92, pulseSpeed: 0.012, baseRadius: 6.5, color: '#06b6d4' },
      { id: 'yeshwanthpur', name: 'Yeshwanthpur Center', x: 0.22, y: 0.25, pulseSpeed: 0.021, baseRadius: 5.5, color: '#8b5cf6' },
    ];

    // Define major traffic arteries (connections) between Bangalore hubs
    const connections: Connection[] = [
      { from: 'hebbal', to: 'mgroad', speedMultiplier: 0.9, intensity: 0.85, lanes: 3 },
      { from: 'mgroad', to: 'indiranagar', speedMultiplier: 1.2, intensity: 0.9, lanes: 2 },
      { from: 'indiranagar', to: 'tin_factory', speedMultiplier: 0.8, intensity: 0.95, lanes: 3 },
      { from: 'indiranagar', to: 'koramangala', speedMultiplier: 1.4, intensity: 0.75, lanes: 2 },
      { from: 'koramangala', to: 'silkboard', speedMultiplier: 0.6, intensity: 1.0, lanes: 3 },
      { from: 'townhall', to: 'mgroad', speedMultiplier: 1.1, intensity: 0.8, lanes: 2 },
      { from: 'townhall', to: 'silkboard', speedMultiplier: 0.7, intensity: 0.9, lanes: 3 },
      { from: 'silkboard', to: 'electronics_city', speedMultiplier: 1.5, intensity: 0.8, lanes: 4 },
      { from: 'tin_factory', to: 'whitefield', speedMultiplier: 1.1, intensity: 0.85, lanes: 3 },
      { from: 'indiranagar', to: 'whitefield', speedMultiplier: 1.0, intensity: 0.7, lanes: 2 },
      { from: 'yeshwanthpur', to: 'hebbal', speedMultiplier: 1.3, intensity: 0.65, lanes: 3 },
      { from: 'yeshwanthpur', to: 'townhall', speedMultiplier: 0.9, intensity: 0.75, lanes: 2 },
    ];

    // Initialize flowing particles representing vehicles/packets
    const particles: Particle[] = [];
    const maxParticles = 60;

    const spawnParticle = (conn?: Connection) => {
      const connection = conn || connections[Math.floor(Math.random() * connections.length)];
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);

      if (!fromNode || !toNode) return;

      particles.push({
        fromNode,
        toNode,
        progress: 0,
        // Calculate dynamic relative speed based on connection profile
        speed: (0.0012 + Math.random() * 0.0018) * connection.speedMultiplier,
        size: 1 + Math.random() * 2,
        color: connection.intensity > 0.85 ? '#f59e0b' : '#38bdf8',
        lane: Math.floor(Math.random() * connection.lanes) - (connection.lanes - 1) / 2
      });
    };

    // Pre-seed initial particles
    for (let i = 0; i < maxParticles; i++) {
      spawnParticle();
      if (particles[i]) {
        particles[i].progress = Math.random(); // distribute evenly across lines
      }
    }

    let pulseTime = 0;

    const render = () => {
      // Create a trailing clear effect for ambient fluid motion
      ctx.fillStyle = 'rgba(7, 9, 14, 0.22)';
      ctx.fillRect(0, 0, width, height);

      pulseTime += 0.05;

      // Draw subtle digital telemetry grid background coordinates
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Bengaluru Geo-Watermark indicator top left
      ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SYS_LOC: 12.9716° N, 77.5946° E (BENGALURU)', 40, height - 80);
      ctx.fillText('NETWORK_CLOCK_SYNC: SECURE_LINK_OK', 40, height - 60);

      // Draw Connection Lines (Arteries/Roads)
      connections.forEach((conn) => {
        const from = nodes.find(n => n.id === conn.from);
        const to = nodes.find(n => n.id === conn.to);
        if (!from || !to) return;

        const x1 = from.x * width;
        const y1 = from.y * height;
        const x2 = to.x * width;
        const y2 = to.y * height;

        // Visual design for road styling
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // Highlight heavily congested routes with critical amber/orange hue
        if (conn.intensity > 0.85) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.07)';
          ctx.lineWidth = 4 + conn.lanes * 1.2;
        } else {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.045)';
          ctx.lineWidth = 3 + conn.lanes * 1;
        }
        ctx.stroke();

        // Inner glowing core road centerline
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.stroke();
      });

      // Update & Draw Flow Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        // If particle reached destination road node, reset & spawn new
        if (p.progress >= 1) {
          particles.splice(i, 1);
          spawnParticle();
          continue;
        }

        const x1 = p.fromNode.x * width;
        const y1 = p.fromNode.y * height;
        const x2 = p.toNode.x * width;
        const y2 = p.toNode.y * height;

        // Calculate current coordinate along step path
        let px = x1 + (x2 - x1) * p.progress;
        let py = y1 + (y2 - y1) * p.progress;

        // Add visual offset to particles in different lanes (orthogonal offset)
        if (p.lane !== 0) {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            const ox = (-dy / len) * (p.lane * 5);
            const oy = (dx / len) * (p.lane * 5);
            px += ox;
            py += oy;
          }
        }

        // Draw particle representation of a car/vehicle
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow state for performance
      }

      // Draw Static Nodes (Intersections)
      nodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;

        // Dynamic node pulse ring
        const pulse = Math.abs(Math.sin(pulseTime * node.pulseSpeed * 10)) * 14;
        
        ctx.beginPath();
        ctx.arc(nx, ny, node.baseRadius + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}15`; // transparent glow outline
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Core Solid Center Indicator
        ctx.beginPath();
        ctx.arc(nx, ny, node.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Label Tag naming
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '700 8.5px "JetBrains Mono", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name.toUpperCase(), nx, ny - node.baseRadius - 10);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Responsive Canvas Resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full object-cover pointer-events-none -z-10 bg-[#06080b]" 
      id="city-traffic-kinetic-background"
    />
  );
}
