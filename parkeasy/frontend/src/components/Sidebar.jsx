import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { haversineDistance, formatDistance, statusBgClass } from '../utils/helpers';

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
    <div className="hidden md:flex flex-col w-[360px] bg-navy-800 border-r border-navy-700 overflow-hidden">
      <div className="p-4 space-y-3 border-b border-navy-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-navy-700 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-park-blue"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-1 rounded text-xs font-medium capitalize ${typeFilter === t ? 'bg-park-blue text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'}`}
            >
              {t === 'all' ? 'All Types' : t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusFilter === s ? 'bg-park-blue text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'}`}
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Max ₹{maxPrice}/hr</span>
          <input
            type="range"
            min={0}
            max={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-park-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Sort:</span>
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              disabled={s === 'distance' && !userPosition}
              className={`px-2 py-1 rounded text-xs font-medium capitalize ${sort === s ? 'bg-park-blue text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={requestLocation}
            disabled={geoLoading}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-navy-700 text-gray-300 hover:bg-navy-600"
          >
            {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
            Near Me
          </button>
        </div>

        <button
          onClick={onToggleListForm}
          className="w-full py-2 rounded-lg text-sm font-semibold bg-park-blue text-white hover:bg-blue-600 transition-colors"
        >
          {showListForm ? 'Close Form' : '+ List Your Spot'}
        </button>
      </div>

      {/* ListSpotForm is injected here as children */}
      {children}

      <div className="sidebar flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">No parkings match your filters</p>
        )}
        {filtered.map(p => (
          <motion.div
            layout
            key={p.id}
            onClick={() => onSelect(p)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedParking?.id === p.id ? 'bg-navy-600 ring-1 ring-park-blue' : 'bg-navy-700 hover:bg-navy-600'}`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-100 leading-tight">{p.name}</h3>
              {p.source === 'p2p' ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-park-blue text-white">P2P</span>
              ) : (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${statusBgClass(p.availability?.status)}`}>
                  {p.availability?.status?.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">{p.area} · ₹{p.ratePerHour}/hr
              {userPosition ? ` · ${formatDistance(haversineDistance(userPosition.lat, userPosition.lng, p.lat, p.lng))}` : ''}
            </p>
            <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusBgClass(p.availability?.status)}`}
                style={{ width: `${p.availability?.percentage || 0}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{p.availability?.available ?? '?'} of {p.availability?.total ?? '?'} spots free</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
