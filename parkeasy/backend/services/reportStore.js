const reports = new Map();

const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

function cleanup(parkingId) {
  if (!reports.has(parkingId)) return;
  const now = Date.now();
  const fresh = reports.get(parkingId).filter(r => now - r.timestamp < EXPIRY_MS);
  if (fresh.length === 0) reports.delete(parkingId);
  else reports.set(parkingId, fresh);
}

function addReport(parkingId, status) {
  if (!reports.has(parkingId)) reports.set(parkingId, []);
  reports.get(parkingId).push({ status, timestamp: Date.now() });
}

function getReports(parkingId) {
  cleanup(parkingId);
  return reports.has(parkingId) ? reports.get(parkingId) : [];
}

function getAggregated(parkingId) {
  const list = getReports(parkingId);
  if (list.length === 0) return { total: 0, breakdown: { available: 0, filling: 0, full: 0 }, latestStatus: null };
  const breakdown = { available: 0, filling: 0, full: 0 };
  list.forEach(r => { if (breakdown[r.status] !== undefined) breakdown[r.status]++; });
  const latestStatus = list[list.length - 1].status;
  return { total: list.length, breakdown, latestStatus };
}

module.exports = { addReport, getReports, getAggregated };
