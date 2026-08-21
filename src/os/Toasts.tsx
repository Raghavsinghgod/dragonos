// DragonOS toasts — color-coded notifications with CSS transitions
import { memo } from 'react';
import { useToasts } from './context';
import { Info, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

const TYPE_COLORS: Record<string, string> = {
  info: 'border-l-[#3b82f6]',
  success: 'border-l-[#22c55e]',
  error: 'border-l-[#dc2626]',
  warning: 'border-l-[#f59e0b]',
  achievement: 'border-l-[#a855f7]',
};

const TYPE_ICONS: Record<string, ReactNode> = {
  info: <Info size={14} className="text-[#3b82f6]" />,
  success: <CheckCircle size={14} className="text-[#22c55e]" />,
  error: <XCircle size={14} className="text-[#dc2626]" />,
  warning: <AlertTriangle size={14} className="text-[#f59e0b]" />,
  achievement: <Trophy size={14} className="text-[#a855f7]" />,
};

// Individual toast — memoized
const ToastItem = memo(function ToastItem({ toast }: { toast: { id: string; title: string; message: string; type: string } }) {
  return (
    <div
      className={`toast-item max-w-[300px] rounded-lg px-4 py-3 border-l-4 ${TYPE_COLORS[toast.type] || TYPE_COLORS.info}`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex-shrink-0">{TYPE_ICONS[toast.type]}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white/90 font-inter">{toast.title}</p>
          <p className="text-[10px] text-white/50 font-inter mt-0.5">{toast.message}</p>
        </div>
      </div>
    </div>
  );
});

export default function Toasts() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
