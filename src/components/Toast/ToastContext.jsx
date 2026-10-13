import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import "./Toast.css";

// Lightweight toast notifications (replaces window.alert).
// Usage: const toast = useToast(); toast.success("Saved"); toast.error("Oops");
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, variant = "info", duration = 3500) => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-3), { id, message, variant }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = useRef(null);
  if (!api.current) {
    api.current = {
      show,
      info: (m, d) => show(m, "info", d),
      success: (m, d) => show(m, "success", d),
      error: (m, d) => show(m, "error", d ?? 5000),
      dismiss,
    };
  }

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant}`}>
            <span className="toast__msg">{t.message}</span>
            <button
              className="toast__close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
