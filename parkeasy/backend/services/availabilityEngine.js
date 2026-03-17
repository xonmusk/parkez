function getISTTime() {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffsetMs + now.getTimezoneOffset() * 60000);
  return { hour: ist.getHours(), day: ist.getDay() };
}

function getAvailability(parking, crowdReports = []) {
  const { hour, day } = getISTTime();
  const isWeekend = (day === 0 || day === 6);
  let baseOccupancy;

  // 1. Base occupancy by areaType + time
  if (parking.areaType === 'it') {
    if (isWeekend) { baseOccupancy = 40; }
    else if (hour >= 9 && hour < 11) baseOccupancy = 85;
    else if (hour >= 11 && hour < 14) baseOccupancy = 90;
    else if (hour >= 14 && hour < 17) baseOccupancy = 85;
    else if (hour >= 17 && hour < 20) baseOccupancy = 70;
    else baseOccupancy = 30;
  } else if (parking.areaType === 'commercial') {
    if (isWeekend) {
      baseOccupancy = (hour >= 11 && hour < 21) ? 85 : 20;
    } else {
      baseOccupancy = (hour >= 10 && hour < 20) ? 75 : 25;
    }
  } else if (parking.areaType === 'tourist') {
    if (isWeekend) {
      baseOccupancy = (hour >= 10 && hour < 20) ? 80 : 25;
    } else {
      baseOccupancy = (hour >= 10 && hour < 18) ? 65 : 30;
    }
  } else if (parking.areaType === 'mall') {
    if (isWeekend) {
      baseOccupancy = (hour >= 11 && hour < 22) ? 90 : 25;
    } else {
      baseOccupancy = (hour >= 11 && hour < 21) ? 60 : 20;
    }
  } else {
    baseOccupancy = 50; // fallback
  }

  // 2. Random fluctuation ±8
  baseOccupancy += Math.floor(Math.random() * 17) - 8;

  // 3. Blend with crowd reports (40% crowd, 60% algorithm)
  if (crowdReports.length > 0) {
    const crowdScore = crowdReports.reduce((sum, r) => {
      if (r.status === 'full') return sum + 95;
      if (r.status === 'filling') return sum + 65;
      return sum + 25; // available
    }, 0) / crowdReports.length;
    baseOccupancy = Math.round(baseOccupancy * 0.6 + crowdScore * 0.4);
  }

  // 4. Clamp
  baseOccupancy = Math.max(5, Math.min(98, baseOccupancy));

  // 5. Compute
  const available = Math.floor(parking.capacity * (1 - baseOccupancy / 100));
  const percentage = Math.round((available / parking.capacity) * 100);
  const status = baseOccupancy >= 90 ? 'full' : baseOccupancy >= 60 ? 'filling' : 'available';

  return { available, total: parking.capacity, percentage, status };
}

module.exports = { getAvailability };
