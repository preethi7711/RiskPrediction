# HealthShield AI

HealthShield AI is a real-time predictive worker safety system built with React, Tailwind CSS, Node.js, Express, and Socket.io. It simulates wearable sensor data, detects safety risks, predicts likely danger, triggers alerts, and renders a live operations dashboard.

## Project Structure

```text
healthshield-ai/
|-- backend/
|   |-- package.json
|   `-- src/
|       |-- config.js
|       |-- constants.js
|       |-- index.js
|       |-- data/
|       |   `-- workerProfiles.js
|       |-- engines/
|       |   `-- safetyEngine.js
|       |-- services/
|       |   |-- alertService.js
|       |   |-- simulationService.js
|       |   `-- store.js
|       `-- utils/
|           `-- formatters.js
|-- frontend/
|   |-- package.json
|   |-- index.html
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- components/
|       |   |-- AlertsPanel.jsx
|       |   |-- EventLogTable.jsx
|       |   |-- Header.jsx
|       |   |-- OverviewCards.jsx
|       |   |-- SparklineChart.jsx
|       |   |-- StatusBadge.jsx
|       |   |-- WorkerCard.jsx
|       |   `-- WorkerGrid.jsx
|       |-- hooks/
|       |   `-- useDashboardSocket.js
|       `-- utils/
|           `-- formatters.js
|-- package.json
`-- README.md
```

## Quick Start

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Start the apps:

```bash
npm run dev
```

3. Open the dashboard at `http://localhost:5173`

4. Backend health endpoint: `http://localhost:4000/health`
"# RiskPrediction" 
