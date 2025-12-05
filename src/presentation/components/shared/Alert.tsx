'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // ms, auto-close jika set
  onClose?: () => void;
}

export const Alert = ({
  type,
  message,
  duration = 4000,
  onClose,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} animate-fade-in`}
      role="alert"
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="text-lg cursor-pointer opacity-70 hover:opacity-100"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};