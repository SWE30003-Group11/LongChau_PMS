"use client"
import { AnimatePresence, motion } from '@/lib/framer';
import { AlertCircle, CheckCircle, Info, X, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/contexts/NotificationContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: Date;
}

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5" />;
    case 'error':
      return <XCircle className="h-5 w-5" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getStyles = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'error':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200';
  }
};

const NotificationBar = () => {
  const { notifications, dismissNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              'rounded-lg border p-4 shadow-lg backdrop-blur-sm',
              getStyles(notification.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-medium mb-1">{notification.title}</h3>
                <p className="text-sm opacity-90">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;