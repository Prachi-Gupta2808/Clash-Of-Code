import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// 1. Added a default position of "top-right"
export const ToastProvider = ({ children, position = "top-right" }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
  };

  // 2. Map positions to Tailwind classes. 
  // Bottom positions use flex-col-reverse so new toasts pop in exactly at the corner.
  const positionClasses = {
    "top-right": "top-6 right-6 flex-col",
    "top-left": "top-6 left-6 flex-col",
    "top-center": "top-6 left-1/2 -translate-x-1/2 flex-col",
    "bottom-right": "bottom-6 right-6 flex-col-reverse",
    "bottom-left": "bottom-6 left-6 flex-col-reverse",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 flex-col-reverse",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className={`fixed z-[9999] flex gap-3 pointer-events-none ${positionClasses[position]}`}>
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem 
              key={t.id} 
              toast={t} 
              onRemove={() => removeToast(t.id)} 
              position={position} // Pass position to child for animation math
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove, position }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-orange-500" size={20} />,
  };

  const borderColors = {
    success: "border-emerald-500/20",
    error: "border-rose-500/20",
    info: "border-orange-500/20",
  };

  // 3. Make the animation slide down from the top, or up from the bottom
  const isTop = position.includes("top");
  const initialY = isTop ? -50 : 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: initialY, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 bg-[#0f1218] border ${borderColors[toast.type]} shadow-2xl p-4 rounded-xl w-80 text-white relative overflow-hidden`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium pr-6">{toast.message}</p>
      <button
        onClick={onRemove}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};