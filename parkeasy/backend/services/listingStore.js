const { v4: uuidv4 } = require('uuid');

const listings = [];

function addListing({ name, address, lat, lng, ratePerHour, availableHours, contact, photoUrl }) {
  const listing = {
    id: 'lst-' + uuidv4().slice(0, 8),
    name,
    address,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    ratePerHour: parseInt(ratePerHour, 10),
    availableHours: availableHours || '9am-6pm',
    contact,
    photoUrl: photoUrl || null,
    createdAt: new Date().toISOString(),
    source: 'p2p',
    type: 'p2p',
    areaType: 'commercial',
    capacity: 1,
    area: 'User Listed'
  };
  listings.push(listing);
  return listing;
}

function getAllListings() {
  return listings;
}

module.exports = { addListing, getAllListings };
