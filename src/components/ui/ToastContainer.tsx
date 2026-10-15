import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg text-sm transition-all"
            role="status"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-500" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-600 dark:text-blue-500" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
