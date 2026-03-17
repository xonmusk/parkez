import './components/LeafletIconFix';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useParkingData } from './hooks/useParkingData';
import { useGeolocation } from './hooks/useGeolocation';
import { useToast } from './hooks/useToast';
import StatsHeader from './components/StatsHeader';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ParkingDetail from './components/ParkingDetail';
import MobileBottomSheet from './components/MobileBottomSheet';
import ListSpotForm from './components/ListSpotForm';
import Toast from './components/Toast';

export default function App() {
  const { parkings, stats, loading, error, refetch } = useParkingData();
  const { position, loading: geoLoading, requestLocation } = useGeolocation();
  const { toasts, addToast } = useToast();

  const [selectedParking, setSelectedParking] = useState(null);
  const [showListForm, setShowListForm] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [pickedCoords, setPickedCoords] = useState(null);

  const handleSelect = (parking) => setSelectedParking(parking);
  const handleClose = () => setSelectedParking(null);

  const handlePickLocation = (coords) => {
    setPickedCoords(coords);
    setPickMode(false);
  };

  const handleListSuccess = () => {
    setShowListForm(false);
    refetch();
  };

  return (
    <div className="h-screen flex flex-col bg-navy-900 text-gray-100">
      <StatsHeader stats={stats} loading={loading} />

      {error && (
        <div className="px-4 py-2 bg-red-900/40 text-red-300 text-sm flex items-center justify-between">
          <span>Failed to load data: {error}</span>
          <button onClick={refetch} className="text-xs underline hover:text-red-200">Retry</button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          parkings={parkings}
          onSelect={handleSelect}
          selectedParking={selectedParking}
          userPosition={position}
          requestLocation={requestLocation}
          geoLoading={geoLoading}
          showListForm={showListForm}
          onToggleListForm={() => setShowListForm(f => !f)}
        >
          <AnimatePresence>
            {showListForm && (
              <ListSpotForm
                onSubmitSuccess={handleListSuccess}
                addToast={addToast}
                onPickModeToggle={setPickMode}
                pickedCoords={pickedCoords}
                pickMode={pickMode}
              />
            )}
          </AnimatePresence>
        </Sidebar>

        <MapView
          parkings={parkings}
          selectedParking={selectedParking}
          onSelect={handleSelect}
          userPosition={position}
          pickMode={pickMode}
          onPickLocation={handlePickLocation}
          loading={loading}
        />

        <AnimatePresence>
          {selectedParking && (
            <ParkingDetail
              parking={selectedParking}
              onClose={handleClose}
              addToast={addToast}
              refetch={refetch}
            />
          )}
        </AnimatePresence>
      </div>

      <MobileBottomSheet
        parking={selectedParking}
        onClose={handleClose}
        addToast={addToast}
        refetch={refetch}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
