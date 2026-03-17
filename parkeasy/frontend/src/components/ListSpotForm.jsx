import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function ListSpotForm({ onSubmitSuccess, addToast, onPickModeToggle, pickedCoords, pickMode }) {
  const [form, setForm] = useState({ name: '', address: '', lat: '', lng: '', ratePerHour: '', availableHours: '', contact: '' });
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pickedCoords) {
      setForm(f => ({ ...f, lat: pickedCoords.lat.toFixed(6), lng: pickedCoords.lng.toFixed(6) }));
    }
  }, [pickedCoords]);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || lat < 17.2 || lat > 17.6) e.lat = '17.2–17.6';
    if (isNaN(lng) || lng < 78.2 || lng > 78.7) e.lng = '78.2–78.7';
    if (!form.ratePerHour || parseInt(form.ratePerHour) <= 0) e.ratePerHour = '> 0';
    if (!form.contact.trim()) e.contact = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Spot listed successfully', 'success');
      setForm({ name: '', address: '', lat: '', lng: '', ratePerHour: '', availableHours: '', contact: '' });
      setPhoto(null);
      onSubmitSuccess();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to list spot', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 bg-neon-green/5 border text-neon-green rounded text-sm font-mono focus:outline-none focus:border-neon-green/60 focus:shadow-neon placeholder:text-neon-green/20 ${errors[field] ? 'border-park-red/60 shadow-neon-red' : 'border-neon-green/15'}`;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border-b border-neon-green/15"
    >
      <div className="p-4 space-y-3">
        <h3 className="text-[10px] font-mono font-bold text-neon-green/60 uppercase tracking-[0.2em]">[ New Listing ]</h3>

        <div>
          <input placeholder="Spot Name *" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass('name')} />
          {errors.name && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.name}</p>}
        </div>
        <div>
          <input placeholder="Address *" value={form.address} onChange={e => update('address', e.target.value)} className={inputClass('address')} />
          {errors.address && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.address}</p>}
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input placeholder="Lat *" type="number" step="any" value={form.lat} onChange={e => update('lat', e.target.value)} className={inputClass('lat')} />
            {errors.lat && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.lat}</p>}
          </div>
          <div className="flex-1">
            <input placeholder="Lng *" type="number" step="any" value={form.lng} onChange={e => update('lng', e.target.value)} className={inputClass('lng')} />
            {errors.lng && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.lng}</p>}
          </div>
          <button
            type="button"
            onClick={() => onPickModeToggle(!pickMode)}
            className={`px-3 py-2 rounded text-[10px] font-mono font-bold flex items-center gap-1 border uppercase ${pickMode ? 'bg-neon-green text-black border-neon-green shadow-neon animate-neon-pulse' : 'border-neon-green/15 text-neon-green/60 hover:border-neon-green/40'}`}
          >
            <MapPin className="w-3 h-3" />
            {pickMode ? 'ON' : 'PICK'}
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <input placeholder="₹/hr *" type="number" value={form.ratePerHour} onChange={e => update('ratePerHour', e.target.value)} className={inputClass('ratePerHour')} />
            {errors.ratePerHour && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.ratePerHour}</p>}
          </div>
          <div className="flex-1">
            <input placeholder="Hours (9am-6pm)" value={form.availableHours} onChange={e => update('availableHours', e.target.value)} className={inputClass('availableHours')} />
          </div>
        </div>

        <div>
          <input placeholder="Phone *" type="tel" value={form.contact} onChange={e => update('contact', e.target.value)} className={inputClass('contact')} />
          {errors.contact && <p className="text-[10px] text-park-red mt-0.5 font-mono">{errors.contact}</p>}
        </div>

        <div>
          <label className="block text-[10px] text-neon-green/30 mb-1 font-mono uppercase tracking-wider">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0] || null)} className="text-[10px] text-neon-green/40 font-mono file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-neon-green/15 file:text-[10px] file:font-mono file:font-medium file:bg-neon-green/5 file:text-neon-green/60 hover:file:border-neon-green/40" />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2.5 rounded text-xs font-mono font-bold bg-neon-green text-black hover:bg-neon-dim transition-colors disabled:opacity-40 shadow-neon flex items-center justify-center gap-2 uppercase tracking-[0.15em]"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'TRANSMITTING...' : '[ SUBMIT ]'}
        </button>
      </div>
    </motion.div>
  );
}
