'use client';

import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import Icon from '@/components/ui/Icon';

interface ToastData {
  id: string;
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
}

interface ToastContextType {
  show: (toast: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const MAX_VISIBLE = 3;

  const show = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const next = [...prev, { ...toast, id }];
      // If over max, remove oldest
      if (next.length > MAX_VISIBLE) {
        return next.slice(next.length - MAX_VISIBLE);
      }
      return next;
    });
    // Stagger dismiss: each toast auto-dismisses at its own interval
    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-in-right cursor-pointer max-w-xs"
            onClick={() => dismiss(t.id)}
          >
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-card backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                borderColor: t.color || '#3b82f6',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${t.color || '#3b82f6'}40`,
              }}
            >
              {t.icon && <Icon name={t.icon} size={22} color={t.color} />}
              <p className="text-sm font-medium text-text-primary">{t.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
