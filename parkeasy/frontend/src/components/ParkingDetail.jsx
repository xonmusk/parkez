import { motion } from 'framer-motion';
import { X, Navigation, Clock } from 'lucide-react';
import { statusBgClass } from '../utils/helpers';
import { timeAgo } from '../utils/timezone';
import ReportButton from './ReportButton';

export default function ParkingDetail({ parking, onClose, addToast, refetch }) {
  if (!parking) return null;

  const avail = parking.availability || {};
  const isP2P = parking.source === 'p2p';

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="hidden md:block w-[380px] bg-navy-800 border-l border-navy-700 overflow-y-auto"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-100">{parking.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{parking.address}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-navy-700">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="text-xs font-medium px-2 py-1 rounded bg-navy-700 text-gray-300 capitalize">{parking.type}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded text-white ${isP2P ? 'bg-park-blue' : statusBgClass(avail.status)}`}>
            {isP2P ? 'P2P Spot' : avail.status?.toUpperCase()}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded bg-navy-700 text-gray-300">₹{parking.ratePerHour}/hr</span>
        </div>

        {!isP2P && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Availability</span>
              <span className="text-gray-200 font-semibold">{avail.available} of {avail.total} spots</span>
            </div>
            <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${statusBgClass(avail.status)}`}
                style={{ width: `${avail.percentage || 0}%` }}
              />
            </div>
          </div>
        )}

        {isP2P && parking.availableHours && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Clock className="w-4 h-4" />
            <span>{parking.availableHours}</span>
          </div>
        )}

        {isP2P && parking.photoUrl && (
          <img src={parking.photoUrl} alt={parking.name} className="w-full h-40 object-cover rounded-lg mb-4" />
        )}

        {isP2P && parking.contact && (
          <p className="text-sm text-gray-400 mb-4">Contact: <span className="text-gray-200">{parking.contact}</span></p>
        )}

        {!isP2P && parking.reports && Array.isArray(parking.reports) && parking.reports.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Recent Reports</h3>
            <div className="space-y-1">
              {parking.reports.slice(-3).reverse().map((r, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className={`font-medium capitalize ${r.status === 'full' ? 'text-park-red' : r.status === 'filling' ? 'text-park-yellow' : 'text-park-green'}`}>
                    {r.status}
                  </span>
                  <span className="text-gray-500">{timeAgo(r.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isP2P && (
          <ReportButton parkingId={parking.id} addToast={addToast} refetch={refetch} />
        )}

        <button
          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${parking.lat},${parking.lng}`, '_blank')}
          className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold bg-park-green text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </motion.div>
  );
}
