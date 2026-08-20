// DragonOS Toast Notifications
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../context';

const typeColors: Record<string, string> = {
  info: 'border-l-[#3b82f6]',
  success: 'border-l-[#22c55e]',
  error: 'border-l-[#dc2626]',
  warning: 'border-l-[#f59e0b]',
  achievement: 'border-l-[#a855f7]',
};

const typeIcons: Record<string, string> = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  achievement: '🏆',
};

export default function Toasts() {
  const { state } = useOS();

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {state.toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto max-w-[300px] rounded-lg px-4 py-3 border-l-4 ${typeColors[toast.type] || typeColors.info}`}
            style={{
              background: 'rgba(12,12,18,0.92)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{typeIcons[toast.type]}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/90 font-inter">{toast.title}</p>
                <p className="text-[10px] text-white/50 font-inter mt-0.5">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
