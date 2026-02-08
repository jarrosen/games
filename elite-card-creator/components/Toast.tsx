import React, { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20';
  const textColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  const iconClass = type === 'success' ? 'fa-check' : 'fa-bolt';

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-300 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
        <i className={`fas ${iconClass}`}></i>
      </div>
      <p className="text-sm font-medium text-slate-200">{message}</p>
    </div>
  );
};

export default Toast;