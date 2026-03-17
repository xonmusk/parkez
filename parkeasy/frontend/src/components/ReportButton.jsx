import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const REPORT_OPTIONS = [
  { status: 'available', label: 'Available', color: 'bg-park-green hover:bg-green-600' },
  { status: 'filling', label: 'Filling Up', color: 'bg-park-yellow hover:bg-yellow-600' },
  { status: 'full', label: 'Full', color: 'bg-park-red hover:bg-red-600' },
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
      addToast('Report submitted!', 'success');
      refetch();
      setCooldown(60);
    } catch (err) {
      addToast('Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || cooldown > 0;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Report Status</h3>
      <div className="flex gap-2">
        {REPORT_OPTIONS.map(opt => (
          <button
            key={opt.status}
            onClick={() => handleReport(opt.status)}
            disabled={disabled}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${opt.color} disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1`}
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : opt.label}
          </button>
        ))}
      </div>
      {cooldown > 0 && (
        <p className="text-xs text-gray-500 text-center mt-1">Wait {cooldown}s</p>
      )}
    </div>
  );
}
