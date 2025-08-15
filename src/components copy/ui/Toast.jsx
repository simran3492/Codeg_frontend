import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, AlertCircle, Info, X, Users, Share2, Link } from 'lucide-react';
import { createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    addToast({ type: 'success', message, ...options });
  };

  const showError = (message, options = {}) => {
    addToast({ type: 'error', message, ...options });
  };

  const showInfo = (message, options = {}) => {
    addToast({ type: 'info', message, ...options });
  };

  const showCopySuccess = (sessionId, options = {}) => {
    addToast({
      type: 'copy',
      sessionId,
      message: 'Session ID copied!',
      ...options
    });
  };

  return (
    <ToastContext.Provider value={{ 
      addToast, removeToast, showSuccess, showError, showInfo, showCopySuccess 
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500/10 border-green-500/20',
          textColor: 'text-green-400',
          iconColor: 'text-green-400'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-500/10 border-red-500/20',
          textColor: 'text-red-400',
          iconColor: 'text-red-400'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-500/10 border-blue-500/20',
          textColor: 'text-blue-400',
          iconColor: 'text-blue-400'
        };
      case 'copy':
        return {
          icon: Share2,
          bgColor: 'bg-purple-500/10 border-purple-500/20',
          textColor: 'text-purple-400',
          iconColor: 'text-purple-400'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-slate-500/10 border-slate-500/20',
          textColor: 'text-slate-400',
          iconColor: 'text-slate-400'
        };
    }
  };

  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm
        ${config.bgColor} ${config.textColor}
        shadow-lg shadow-black/20
        max-w-sm w-full
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
      
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">
              {toast.message}
            </p>
            
            {toast.type === 'copy' && toast.sessionId && (
              <div className="mt-2 space-y-2">
                <div className="bg-slate-800/50 rounded px-2 py-1 text-xs font-mono border border-slate-600/30">
                  {toast.sessionId}
                </div>
                <p className="text-xs opacity-75 flex items-center gap-1">
                  <Users size={12} />
                  Share this ID with your friend to start collaborating!
                </p>
              </div>
            )}
            
            {toast.description && (
              <p className="text-xs opacity-75 mt-1">
                {toast.description}
              </p>
            )}
          </div>
          
          <button
            onClick={onRemove}
            className={`
              flex-shrink-0 p-1 rounded-full hover:bg-white/10 
              transition-all duration-200 ${config.iconColor}
              ${isHovered ? 'opacity-100' : 'opacity-50'}
            `}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${config.iconColor.replace('text-', 'bg-')} opacity-30`}
      />
    </motion.div>
  );
}