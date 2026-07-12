// ============================================================
// PilaniLabs CRM — Toast Notification System
// Simple client-side toast notifications
// ============================================================

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastNotification({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
    error: <XCircle className="h-5 w-5 text-destructive shrink-0" />,
    info: <AlertCircle className="h-5 w-5 text-primary shrink-0" />,
  };

  const styles = {
    success: "border-success/30 bg-white",
    error: "border-destructive/30 bg-white",
    info: "border-primary/30 bg-white",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-sm border shadow-[0_4px_16px_rgba(27,42,74,0.12)] animate-in slide-in-from-right-full duration-300",
        styles[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="text-sm text-navy flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-navy transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
