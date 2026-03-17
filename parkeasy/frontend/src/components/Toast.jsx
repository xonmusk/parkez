import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'border-neon-green/50 bg-neon-green/10 text-neon-green',
    error: 'border-park-red/50 bg-park-red/10 text-park-red',
    info: 'border-neon-green/30 bg-neon-green/5 text-neon-green/80'
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${colors[toast.type]} border px-4 py-3 rounded shadow-neon flex items-center gap-2 min-w-[250px] backdrop-blur-sm`}
            >
              <Icon size={18} />
              <span className="text-sm font-mono">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
