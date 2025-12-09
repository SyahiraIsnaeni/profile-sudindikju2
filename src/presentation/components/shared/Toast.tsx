'use client';

import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  action,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const config = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
      border: 'border-emerald-400',
      icon: <Check size={24} className="text-white flex-shrink-0" />,
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-900',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-500',
      border: 'border-red-400',
      icon: <XCircle size={24} className="text-white flex-shrink-0" />,
      lightBg: 'bg-red-50',
      lightText: 'text-red-900',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      border: 'border-amber-400',
      icon: <AlertCircle size={24} className="text-white flex-shrink-0" />,
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-900',
    },
  }[type];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .toast-enter {
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .toast-exit {
          animation: slideOutRight 0.3s ease-in-out;
        }

        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 50;
          max-width: 420px;
          pointer-events: auto;
        }

        @media (max-width: 640px) {
          .toast-container {
            left: 16px;
            right: 16px;
            max-width: none;
          }
        }
      `}</style>

      <div className={`toast-container ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
        {/* Dark Theme Toast */}
        <div
          className={`${config.bg} text-white px-6 py-5 rounded-xl shadow-2xl border-l-4 ${config.border} flex items-start gap-4 backdrop-blur-sm bg-opacity-95`}
        >
          {/* Icon Container */}
          <div className="pt-0.5 flex-shrink-0">
            {config.icon}
          </div>

          {/* Content Container */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug">{message}</p>
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                className="mt-2 text-xs font-medium underline hover:opacity-80 transition-opacity"
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200"
            aria-label="Close notification"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
