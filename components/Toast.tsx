
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${bgColors[type]}`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-white text-xl`}></i>
      <span className="text-white font-bold text-sm">{message}</span>
    </div>
  );
};

export default Toast;
