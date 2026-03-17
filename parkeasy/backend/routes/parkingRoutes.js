const express = require('express');
const router = express.Router();
const { getAvailability } = require('../services/availabilityEngine');
const { addReport, getReports, getAggregated } = require('../services/reportStore');
const { getAllListings } = require('../services/listingStore');

// GET /api/parkings — all parkings + P2P listings, with cached availability
router.get('/parkings', (req, res) => {
  const parkings = req.app.locals.parkings;
  const cache = req.app.locals.availabilityCache;
  const listings = getAllListings();

  const result = parkings.map(p => ({
    ...p,
    source: p.source || 'public',
    availability: cache.get(p.id) || getAvailability(p, getReports(p.id)),
    reports: getAggregated(p.id)
  }));

  // Merge P2P listings with static availability
  const p2pMapped = listings.map(l => ({
    ...l,
    availability: { available: 1, total: 1, percentage: 100, status: 'available' },
    reports: { total: 0, breakdown: { available: 0, filling: 0, full: 0 }, latestStatus: null }
  }));

  res.json([...result, ...p2pMapped]);
});

// GET /api/parkings/:id — single parking with full reports
router.get('/parkings/:id', (req, res) => {
  const parkings = req.app.locals.parkings;
  const listings = getAllListings();
  const all = [...parkings, ...listings];
  const parking = all.find(p => p.id === req.params.id);
  if (!parking) return res.status(404).json({ error: 'Not found' });

  const cache = req.app.locals.availabilityCache;
  const availability = parking.source === 'p2p'
    ? { available: 1, total: 1, percentage: 100, status: 'available' }
    : (cache.get(parking.id) || getAvailability(parking, getReports(parking.id)));

  res.json({
    ...parking,
    source: parking.source || 'public',
    availability,
    reports: getReports(parking.id)
  });
});

// POST /api/parkings/:id/report — crowdsource report
router.post('/parkings/:id/report', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'filling', 'full'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be: available, filling, or full' });
  }
  const parkings = req.app.locals.parkings;
  const exists = parkings.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Parking not found' });

  addReport(req.params.id, status);
  res.json({ success: true });
});

// GET /api/stats — dashboard stats
router.get('/stats', (req, res) => {
  const parkings = req.app.locals.parkings;
  const cache = req.app.locals.availabilityCache;
  const listings = getAllListings();

  let totalSpots = 0;
  let availableNow = 0;
  let totalRate = 0;
  const areaOccupancy = {}; // area → [occupancy percentages]

  parkings.forEach(p => {
    const avail = cache.get(p.id) || getAvailability(p, getReports(p.id));
    totalSpots += p.capacity;
    availableNow += avail.available;
    totalRate += p.ratePerHour;

    if (!areaOccupancy[p.area]) areaOccupancy[p.area] = [];
    areaOccupancy[p.area].push(100 - avail.percentage);
  });

  // Add P2P listings to totals
  totalSpots += listings.length;
  availableNow += listings.length;
  listings.forEach(l => { totalRate += l.ratePerHour; });

  const totalCount = parkings.length + listings.length;
  const avgPrice = totalCount > 0 ? Math.round(totalRate / totalCount) : 0;

  // Busiest area = highest average occupancy
  let busiestArea = 'N/A';
  let maxOccupancy = 0;
  for (const [area, occs] of Object.entries(areaOccupancy)) {
    const avg = occs.reduce((a, b) => a + b, 0) / occs.length;
    if (avg > maxOccupancy) {
      maxOccupancy = avg;
      busiestArea = area;
    }
  }

  res.json({ totalSpots, availableNow, avgPrice, busiestArea });
});

module.exports = router;
