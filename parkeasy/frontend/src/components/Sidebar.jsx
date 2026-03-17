import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { haversineDistance, formatDistance, statusBgClass, statusGlow } from '../utils/helpers';

const TYPES = ['all', 'mall', 'lot', 'garage', 'street', 'p2p'];
const STATUSES = ['all', 'available', 'filling', 'full'];
const SORTS = ['availability', 'price', 'distance'];

export default function Sidebar({ parkings, onSelect, selectedParking, userPosition, requestLocation, geoLoading, showListForm, onToggleListForm, children }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50);
  const [sort, setSort] = useState('availability');

  const filtered = useMemo(() => {
    let list = parkings.filter(p => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.area.toLowerCase().includes(q)) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (statusFilter !== 'all' && p.availability?.status !== statusFilter) return false;
      if (p.ratePerHour > maxPrice) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === 'availability') return (b.availability?.percentage || 0) - (a.availability?.percentage || 0);
      if (sort === 'price') return a.ratePerHour - b.ratePerHour;
      if (sort === 'distance' && userPosition) {
        const dA = haversineDistance(userPosition.lat, userPosition.lng, a.lat, a.lng);
        const dB = haversineDistance(userPosition.lat, userPosition.lng, b.lat, b.lng);
        return dA - dB;
      }
      return 0;
    });

    return list;
  }, [parkings, search, typeFilter, statusFilter, maxPrice, sort, userPosition]);

  return (
    <div className="hidden md:flex flex-col w-[360px] bg-black border-r border-neon-green/15 overflow-hidden grid-bg">
      <div className="p-4 space-y-3 border-b border-neon-green/15">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green/40" />
          <input
            type="text"
            placeholder=">> search zone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-neon-green/5 border border-neon-green/20 text-neon-green rounded text-sm font-mono focus:outline-none focus:border-neon-green/60 focus:shadow-neon placeholder:text-neon-green/25"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${typeFilter === t ? 'bg-neon-green text-black shadow-neon' : 'bg-neon-green/5 border border-neon-green/15 text-neon-green/60 hover:border-neon-green/40'}`}
            >
              {t === 'all' ? 'ALL' : t}
            </button>
          ))}
        </div>

        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${statusFilter === s ? 'bg-neon-green text-black shadow-neon' : 'bg-neon-green/5 border border-neon-green/15 text-neon-green/60 hover:border-neon-green/40'}`}
            >
              {s === 'all' ? 'ALL' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neon-green/40 font-mono tracking-wider">MAX ₹{maxPrice}/hr</span>
          <input
            type="range"
            min={0}
            max={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neon-green/40 font-mono tracking-wider">SORT:</span>
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              disabled={s === 'distance' && !userPosition}
              className={`px-2 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${sort === s ? 'bg-neon-green text-black shadow-neon' : 'bg-neon-green/5 border border-neon-green/15 text-neon-green/60 hover:border-neon-green/40'} disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={requestLocation}
            disabled={geoLoading}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-medium bg-neon-green/5 border border-neon-green/15 text-neon-green/60 hover:border-neon-green/40"
          >
            {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
            GPS
          </button>
        </div>

        <button
          onClick={onToggleListForm}
          className="w-full py-2 rounded text-sm font-mono font-semibold bg-neon-green text-black hover:bg-neon-dim transition-colors shadow-neon tracking-wider"
        >
          {showListForm ? '[ CLOSE ]' : '[ + LIST SPOT ]'}
        </button>
      </div>

      {children}

      <div className="sidebar flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-neon-green/30 text-xs py-8 font-mono">// no results found</p>
        )}
        {filtered.map(p => (
          <motion.div
            layout
            key={p.id}
            onClick={() => onSelect(p)}
            className={`p-3 rounded cursor-pointer transition-all border ${selectedParking?.id === p.id ? 'border-neon-green/60 bg-neon-green/10 shadow-neon' : 'border-neon-green/10 bg-neon-green/[0.02] hover:border-neon-green/30 hover:bg-neon-green/5'}`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-xs font-mono font-semibold text-neon-green leading-tight">{p.name}</h3>
              {p.source === 'p2p' ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neon-green text-black tracking-wider">P2P</span>
              ) : (
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-black ${statusBgClass(p.availability?.status)}`}>
                  {p.availability?.status?.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-neon-green/40 mb-2 font-mono">{p.area} // ₹{p.ratePerHour}/hr
              {userPosition ? ` // ${formatDistance(haversineDistance(userPosition.lat, userPosition.lng, p.lat, p.lng))}` : ''}
            </p>
            <div className="w-full h-1 bg-neon-green/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusBgClass(p.availability?.status)}`}
                style={{ width: `${p.availability?.percentage || 0}%` }}
              />
            </div>
            <p className="text-[10px] text-neon-green/30 mt-1 font-mono">{p.availability?.available ?? '?'}/{p.availability?.total ?? '?'} free</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
