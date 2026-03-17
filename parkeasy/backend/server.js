const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getAvailability } = require('./services/availabilityEngine');
const { getReports } = require('./services/reportStore');
const parkingRoutes = require('./routes/parkingRoutes');
const listingRoutes = require('./routes/listingRoutes');

const app = express();
const PORT = 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Load seed data ---
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'seedParkings.json'), 'utf-8'));

// --- Generate 25 extra locations from seed ---
function generateExtraLocations(seeds) {
  const extra = [];
  let count = 0;
  const suffixes = ['Public Lot', 'Street Parking', 'Open Lot', 'Basement Parking', 'Surface Lot'];
  for (let i = 0; i < seeds.length && count < 25; i++) {
    const s = seeds[i];
    const numToCreate = i < 10 ? 2 : 1; // first 10 seeds get 2 extras, rest get 1
    for (let j = 0; j < numToCreate && count < 25; j++) {
      const sign = j % 2 === 0 ? 1 : -1;
      extra.push({
        id: 'pg' + (count + 1),
        name: `${s.area} ${suffixes[count % suffixes.length]} ${count + 1}`,
        area: s.area,
        areaType: s.areaType,
        lat: parseFloat((s.lat + sign * (0.002 + Math.random() * 0.003)).toFixed(6)),
        lng: parseFloat((s.lng + sign * (0.002 + Math.random() * 0.003)).toFixed(6)),
        type: ['lot', 'street', 'lot', 'garage'][count % 4],
        capacity: Math.max(20, Math.floor(s.capacity / 2)),
        ratePerHour: s.ratePerHour,
        address: `Near ${s.name}, ${s.area}`
      });
      count++;
    }
  }
  return extra;
}

const extraLocations = generateExtraLocations(seedData);
const allParkings = [...seedData, ...extraLocations];
app.locals.parkings = allParkings;

// --- Availability Cache (pre-computed every 30s) ---
app.locals.availabilityCache = new Map();

function refreshAvailabilityCache() {
  const cache = new Map();
  for (const p of app.locals.parkings) {
    const reports = getReports(p.id);
    cache.set(p.id, getAvailability(p, reports));
  }
  app.locals.availabilityCache = cache;
}

refreshAvailabilityCache();
setInterval(refreshAvailabilityCache, 30000);

// --- Mount routes ---
app.use('/api', parkingRoutes);
app.use('/api', listingRoutes);

app.listen(PORT, () => {
  console.log(`ParkEasy backend running on http://localhost:${PORT}`);
  console.log(`Loaded ${allParkings.length} parking locations (${seedData.length} seed + ${extraLocations.length} generated)`);
});
