import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'warning' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'warning',
  actionLabel,
  onAction,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    let timer: number;
    if (!onAction) { // Only auto-close if there's no action
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onClose, duration, onAction]);

  return (
    <div 
      role="alert"
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${
        type === 'error' 
          ? 'bg-red-50 text-red-800 border border-red-200'
          : 'bg-amber-50 text-amber-800 border border-amber-200'
      }`}
    >
      <AlertCircle size={20} className="flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              type === 'error'
                ? 'bg-red-100 hover:bg-red-200 text-red-800'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
            }`}
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
          aria-label="Sluiten"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;