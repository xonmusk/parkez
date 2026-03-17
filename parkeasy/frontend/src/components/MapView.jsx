import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import ParkingMarker from './ParkingMarker';
import { Loader2 } from 'lucide-react';

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

function MapClickHandler({ pickMode, onPickLocation }) {
  useMapEvents({
    click(e) {
      if (pickMode && onPickLocation) {
        onPickLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

export default function MapView({ parkings, selectedParking, onSelect, userPosition, pickMode, onPickLocation, loading }) {
  const flyTo = selectedParking ? [selectedParking.lat, selectedParking.lng] : null;

  return (
    <div className={`relative flex-1 ${pickMode ? 'cursor-crosshair' : ''}`}>
      {loading && (
        <div className="absolute inset-0 z-[999] bg-navy-900/60 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-park-blue animate-spin" />
        </div>
      )}
      {pickMode && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-park-blue text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Click on the map to set parking location
        </div>
      )}
      <MapContainer
        center={[17.385, 78.4867]}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler pickMode={pickMode} onPickLocation={onPickLocation} />
        <FlyToMarker position={flyTo} />
        {parkings.map(p => (
          <ParkingMarker key={p.id} parking={p} onClick={onSelect} />
        ))}
        {userPosition && (
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={10}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.6 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
