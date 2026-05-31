import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Copilot
  app.post("/api/copilot", async (req, res) => {
    const { prompt, cityStats } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const fallbackAns = generateFallbackResponse(prompt, cityStats);
      return res.json({ text: fallbackAns, source: "simulation-engine" });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const statsString = JSON.stringify(cityStats || {}, null, 2);
      const systemInstruction = `You are UrbanMind Copilot, the AI Traffic Intelligence Command Center assistant for Bengaluru, India. 
You provide critical, high-impact tactical advice for traffic police, city operators, emergency response, and municipal planners.
Analyze real-time congestion alerts, signal optimizing profiles, violation frequencies, and emergency green corridors.
The user is asking a question or requesting action: "${prompt}".
Here is the current live traffic intelligence stats across Bangalore:
${statsString}
Provide highly technical, startup-professional, constructive suggestions. Use clear lists, metrics, or Markdown formatting. Keep the tone sharp, executive, and direct (no generic fluffy speech).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ text: response.text, source: "gemini-3.5-flash" });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to query Gemini AI" });
    }
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UrbanMind AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackResponse(prompt: string, cityStats: any) {
  const query = prompt.toLowerCase();
  const stats = cityStats || {
    avgDensity: 74,
    congestedRoads: ["Silk Board Junction", "Whitefield Main Rd"],
    efficiencyIndex: 82
  };

  if (query.includes("kr puram") || (query.includes("optimize") && query.includes("puram"))) {
    return `### ⚡ KR Puram Junction Signal Optimization Node
Optimization completed successfully for **KR Puram Junction**:

- **Current Congestion**:
  **84%**

- **Primary Cause**:
  **School dispersal peak**

- **Recommendation**:
  * **+12 sec green northbound**
  * **-8 sec eastbound**

- **Expected Reduction**:
  **18%**

*Tactical dispatch deployed to traffic signal controllers via dynamic priority override.*`;
  }

  if (query.includes("flipkart") || query.includes("logistics") || query.includes("delivery")) {
    return `### 📦 Flipkart Fleet Logistics Optimization
Active scheduling priority routed for Flipkart Delivery Fleets:

- **Fleet Segment ID**: FK-GRID-BENGALURU
- **Active Couriers**: 142 vehicles transiting southeast corridor
- **Current Operational Metrics**:
  - Baseline Route ETA: **34 Mins**
  - AI Preemptive Routed ETA: **21 Mins**
  - Net Fleet Fuel Saving: **22%**
  - Primary Route: Silk Board Bypass Area via Outer Ring Road Link

- **Dynamic Command**: Activating prioritised green bands on Sector 3-B routes to avoid Silk Board congestion spikes.`;
  }

  if (query.includes("accidents") && (query.includes("south") || query.includes("bengaluru"))) {
    return `### 🚨 South Bengaluru Incident Telemetry Summary
Query search completed for operator voice command: *"Show accidents in Bengaluru South"*

- **Active Alerts**: 2 collisions identified by CCTV YOLOv8 feeds
- **Locations**:
  1. Outer Ring Road, Sector 5 Underpass (Two-wheeler lane drift collision, clearance in progress)
  2. Silk Board Approach B (Light commercial truck bumper tap, moved to hard shoulder)
- **Mitigation Status**: Emergency responders dispatched, signal timing plan 'INCIDENT-FLUSH-40' loaded.`;
  }

  if (query.includes("rainfall") || query.includes("weather") || query.includes("monsoon")) {
    return `### ⛈️ Monsoon Mode Heavy Rainfall Predictive Advisory
Query completed for voice command: *"Predict traffic after rainfall"*

- **Precipitation State**: Heavy convective storm front predicted in **37 Mins**
- **Impact Zone Density**: Red Alerts triggered across **5 key intersections**
  1. Silk Board (Flooding risk: 88%)
  2. KR Puram Underpass (Waterlogging risk: 92%)
  3. Electronic City Sector Entrance
  4. Whitefield Link Road Hub
  5. Hebbal Low-lying Overpass
- **Counter-proposals**: Preemptively deploying field municipal units, clearing drainage vents at Sector 4, and routing deep detours early.`;
  }

  if (query.includes("signal") || query.includes("optimize") || query.includes("timing")) {
    return `### 🚥 UrbanMind Copilot Signal Optimization Advisory
Based on vehicle queuing queues and lane occupancy at peak nodes:

1. **Silk Board Junction (Junction 14)**:
   - **Tactical Adjustment**: Retime Phase A to **+18s** Green cycle.
   - **Rationale**: Immediate surge in auto and bus count (+14%) detected on Outer Ring Road approach direction.
   - **Predicted Impact**: **-12%** queue depth, preventing spillback into Sector 4 within 10 minutes.

2. **KR Puram (Junction 22)**:
   - **Tactical Adjustment**: Actuate dynamic headway offset of **-8s** red pause for Marathahalli side.
   - **Predicted Impact**: Estimated fuel savings of **~140 liters** of diesel during morning peak hour.

3. **Electronic City Expressway Exit**:
   - **Tactical Adjustment**: Trigger ramp-metering interval at **45-second** slots.
   - **Predicted Impact**: Keeps Expressway outflow steady without bottom-of-ramp clogging.`;
  }

  if (query.includes("emergency") || query.includes("corridor") || query.includes("ambulance")) {
    return `### 🚑 Green Corridor Dynamic Intercept Route
Active tracking system engaged:

- **Active Vehicle**: Advanced Life Support Ambulance (**ALS-09**)
- **Sector Route**: Whitefield Rd ➔ Manipal Hospital (HAL)
- **Current Signal Priority Status**: Active queue flushing at Whitefield Ring Road intersection.
- **Tactical Recommendations**:
  - Hold North-South flow at Whitefield-Indiranagar Link Road for **40 seconds**.
  - Flush HAL road junction with direct preemption window.
- **Estimated Arrival**: Travel time reduced by **4.2 minutes** below baseline, critical for emergency care.`;
  }

  if (query.includes("violation") || query.includes("wrong") || query.includes("helmet")) {
    return `### 🚨 UrbanMind Violation Analytics Summary
High-yield CCTV analytics detected the following violation clusters in the past hour:

1. **Silk Board - Sector 2 Exit**: 
   - Wrong-side driving counts are up by **27%** today, mostly two-wheelers overtaking heavy cargo trucks.
   - **Action Item**: Recommend immediate deployment of automated intercept cameras at Section 2B.

2. **MG Road Junction**:
   - Lane discipline drift detected at **82%**, highest during bus lane occupancy overlap.
   - Automated citation queue created and sent to the nearest Traffic Inspector Beat No. 12.`;
  }

  if (query.includes("twin") || query.includes("simulate") || query.includes("rain") || query.includes("closure")) {
    return `### 🌐 Digital Twin Scenario Intelligence Forecast
Simulating scenario context: **Heaviest Rain Season Precipitation (5.2cm/hr rainfall in Bengaluru South)**

- **System-Wide Impact Forecast**: 
  - Network travel times will surge by **+38%** if no action is taken.
  - Whitefield/Marathahalli underpass has a **high risk of flooding (85% probability)**.

- **Proactive Mitigation Playbook**:
  - Dispatch municipal drainage team to **Outlet Sector B** immediately.
  - Divert inbound IT Corridor heavy cargo vehicles to **Outer Ring Road Bypass** early at KR Puram.`;
  }

  return `### 🤖 UrbanMind Traffic Copilot Analysis
Welcome to the Smart City Mobility Control Panel. Here is an overview of active Bengaluru traffic conditions:

- **Current Network Load Index**: **${stats.avgDensity || 74}%**
- **Hotspot Alert Level**: High (particularly around **Silk Board Junction** and **KR Puram**)
- **Anomalous Spikes**: Overtaking speed variability standard deviation increased by 19% on Outer Ring Road.

**Recommended Tactical Protocols**:
1. Actuate Green Corridor priority indicators on Sector 3 routes to bypass KR Puram underpass.
2. Dispatch a warning to the Hebbal CCTV queue manager regarding Bus lane lane-drifts.
3. Apply smart micro-timing adjustments (+12s) on Signal Node 11.

*Note: For real-time intelligent Bengaluru analysis, authenticate with your Gemini API Key in the Settings panel.*`;
}

startServer();
