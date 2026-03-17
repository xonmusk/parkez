const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { addListing, getAllListings } = require('../services/listingStore');

// POST /api/listings — list a P2P parking spot
router.post('/listings', upload.single('photo'), (req, res) => {
  const { name, address, lat, lng, ratePerHour, availableHours, contact } = req.body;

  // Validation
  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required' });
  }
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (isNaN(latNum) || latNum < 17.2 || latNum > 17.6) {
    return res.status(400).json({ error: 'Latitude must be between 17.2 and 17.6' });
  }
  if (isNaN(lngNum) || lngNum < 78.2 || lngNum > 78.7) {
    return res.status(400).json({ error: 'Longitude must be between 78.2 and 78.7' });
  }
  if (!ratePerHour || parseInt(ratePerHour, 10) <= 0) {
    return res.status(400).json({ error: 'Rate per hour must be greater than 0' });
  }
  if (!contact) {
    return res.status(400).json({ error: 'Contact is required' });
  }

  const photoUrl = req.file ? '/uploads/' + req.file.filename : null;

  const listing = addListing({
    name, address, lat: latNum, lng: lngNum,
    ratePerHour: parseInt(ratePerHour, 10),
    availableHours: availableHours || '',
    contact,
    photoUrl
  });

  res.status(201).json(listing);
});

// GET /api/listings — all P2P listings
router.get('/listings', (req, res) => {
  res.json(getAllListings());
});

module.exports = router;
