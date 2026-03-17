import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const REPORT_OPTIONS = [
  { status: 'available', label: 'OPEN', color: 'bg-neon-green hover:bg-neon-dim text-black' },
  { status: 'filling', label: 'FILLING', color: 'bg-park-yellow hover:bg-yellow-400 text-black' },
  { status: 'full', label: 'FULL', color: 'bg-park-red hover:bg-red-500 text-black' },
];

export default function ReportButton({ parkingId, addToast, refetch }) {
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleReport = async (status) => {
    setSubmitting(true);
    try {
      await api.post(`/parkings/${parkingId}/report`, { status });
      addToast('Report transmitted', 'success');
      refetch();
      setCooldown(60);
    } catch (err) {
      addToast('Transmission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || cooldown > 0;

  return (
    <div>
      <h3 className="text-[10px] font-mono font-semibold text-neon-green/50 mb-2 uppercase tracking-[0.2em]">Report Status</h3>
      <div className="flex gap-2">
        {REPORT_OPTIONS.map(opt => (
          <button
            key={opt.status}
            onClick={() => handleReport(opt.status)}
            disabled={disabled}
            className={`flex-1 py-2 rounded text-[10px] font-mono font-bold transition-colors ${opt.color} disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 uppercase tracking-wider`}
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : opt.label}
          </button>
        ))}
      </div>
      {cooldown > 0 && (
        <p className="text-[10px] text-neon-green/30 text-center mt-1 font-mono tracking-wider">cooldown: {cooldown}s</p>
      )}
    </div>
  );
}
