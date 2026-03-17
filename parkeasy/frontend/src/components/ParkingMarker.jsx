import { CircleMarker, Tooltip } from 'react-leaflet';
import { statusColor } from '../utils/helpers';

export default function ParkingMarker({ parking, onClick }) {
  const avail = parking.availability || {};
  const isP2P = parking.source === 'p2p';
  const color = isP2P ? '#3b82f6' : statusColor(avail.status);

  return (
    <CircleMarker
      center={[parking.lat, parking.lng]}
      radius={isP2P ? 6 : 8}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2
      }}
      eventHandlers={{
        click: () => onClick(parking)
      }}
    >
      <Tooltip direction="top" offset={[0, -10]}>
        <div className="text-xs">
          <strong>{parking.name}</strong>
          <br />
          {isP2P ? 'P2P Spot' : `${avail.available ?? '?'}/${avail.total ?? '?'} spots`}
          <br />
          ₹{parking.ratePerHour}/hr
        </div>
      </Tooltip>
    </CircleMarker>
  );
}
