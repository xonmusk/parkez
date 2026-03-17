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
      className="hidden md:block w-[380px] bg-black border-l border-neon-green/15 overflow-y-auto grid-bg"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-mono font-bold text-neon-green drop-shadow-[0_0_6px_#00ff4155]">{parking.name}</h2>
            <p className="text-xs text-neon-green/40 mt-0.5 font-mono">{parking.address}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded border border-neon-green/15 hover:border-neon-green/40 hover:bg-neon-green/5">
            <X className="w-4 h-4 text-neon-green/50" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="text-[10px] font-mono font-medium px-2 py-1 rounded border border-neon-green/15 text-neon-green/60 uppercase tracking-wider">{parking.type}</span>
          <span className={`text-[10px] font-mono font-medium px-2 py-1 rounded text-black ${isP2P ? 'bg-neon-green' : statusBgClass(avail.status)}`}>
            {isP2P ? 'P2P' : avail.status?.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-1 rounded border border-neon-green/15 text-neon-green/60">₹{parking.ratePerHour}/hr</span>
        </div>

        {!isP2P && (
          <div className="mb-4 p-3 rounded border border-neon-green/15 bg-neon-green/[0.02]">
            <div className="flex justify-between text-xs mb-2 font-mono">
              <span className="text-neon-green/40 tracking-wider uppercase text-[10px]">Capacity</span>
              <span className="text-neon-green font-semibold">{avail.available}/{avail.total}</span>
            </div>
            <div className="w-full h-2 bg-neon-green/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${statusBgClass(avail.status)}`}
                style={{ width: `${avail.percentage || 0}%` }}
              />
            </div>
          </div>
        )}

        {isP2P && parking.availableHours && (
          <div className="flex items-center gap-2 text-xs text-neon-green/50 mb-4 font-mono">
            <Clock className="w-4 h-4" />
            <span>{parking.availableHours}</span>
          </div>
        )}

        {isP2P && parking.photoUrl && (
          <img src={parking.photoUrl} alt={parking.name} className="w-full h-40 object-cover rounded border border-neon-green/15 mb-4" />
        )}

        {isP2P && parking.contact && (
          <p className="text-xs text-neon-green/40 mb-4 font-mono">Contact: <span className="text-neon-green">{parking.contact}</span></p>
        )}

        {!isP2P && parking.reports && Array.isArray(parking.reports) && parking.reports.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[10px] font-mono font-semibold text-neon-green/50 mb-2 uppercase tracking-[0.2em]">Recent Reports</h3>
            <div className="space-y-1">
              {parking.reports.slice(-3).reverse().map((r, i) => (
                <div key={i} className="flex justify-between text-[11px] font-mono py-1 border-b border-neon-green/5">
                  <span className={`font-medium capitalize ${r.status === 'full' ? 'text-park-red' : r.status === 'filling' ? 'text-park-yellow' : 'text-neon-green'}`}>
                    {r.status}
                  </span>
                  <span className="text-neon-green/30">{timeAgo(r.timestamp)}</span>
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
          className="w-full mt-4 py-2.5 rounded text-xs font-mono font-bold bg-neon-green text-black hover:bg-neon-dim transition-colors shadow-neon flex items-center justify-center gap-2 uppercase tracking-[0.15em]"
        >
          <Navigation className="w-4 h-4" />
          Navigate
        </button>
      </div>
    </motion.div>
  );
}
