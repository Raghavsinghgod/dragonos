// DragonOS Toast Notifications
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from './context';
import { Info, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

const typeColors: Record<string, string> = {
  info: 'border-l-[#3b82f6]',
  success: 'border-l-[#22c55e]',
  error: 'border-l-[#dc2626]',
  warning: 'border-l-[#f59e0b]',
  achievement: 'border-l-[#a855f7]',
};

const typeIcons: Record<string, ReactNode> = {
  info: <Info size={14} className="text-[#3b82f6]" />,
  success: <CheckCircle size={14} className="text-[#22c55e]" />,
  error: <XCircle size={14} className="text-[#dc2626]" />,
  warning: <AlertTriangle size={14} className="text-[#f59e0b]" />,
  achievement: <Trophy size={14} className="text-[#a855f7]" />,
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
              <span className="mt-0.5 flex-shrink-0">{typeIcons[toast.type]}</span>
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
