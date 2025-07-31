"use client"
import { AnimatePresence, motion } from '@/lib/framer';
import { AlertCircle, CheckCircle, Info, X, XCircle, AlertTriangle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/contexts/NotificationContext';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
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
      return <Bell className="h-5 w-5" />;
  }
};

const getStyles = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-white/90 backdrop-blur-xl border-emerald-200/30 shadow-2xl',
        icon: 'text-emerald-600',
        title: 'text-gray-900',
        message: 'text-gray-700',
        progress: 'bg-emerald-500'
      };
    case 'error':
      return {
        container: 'bg-white/90 backdrop-blur-xl border-red-200/30 shadow-2xl',
        icon: 'text-red-600',
        title: 'text-gray-900',
        message: 'text-gray-700',
        progress: 'bg-red-500'
      };
    case 'warning':
      return {
        container: 'bg-white/90 backdrop-blur-xl border-amber-200/30 shadow-2xl',
        icon: 'text-amber-600',
        title: 'text-gray-900',
        message: 'text-gray-700',
        progress: 'bg-amber-500'
      };
    default:
      return {
        container: 'bg-white/90 backdrop-blur-xl border-blue-200/30 shadow-2xl',
        icon: 'text-blue-600',
        title: 'text-gray-900',
        message: 'text-gray-700',
        progress: 'bg-blue-500'
      };
  }
};

const NotificationBar = () => {
  const { notifications, dismissNotification } = useNotification();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getStyles(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className={cn(
                'relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-xl',
                'transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                styles.container
              )}
            >
              {/* Progress bar */}
              <motion.div
                className={cn('absolute bottom-0 left-0 h-1', styles.progress)}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{
                  duration: (notification.duration || 5000) / 1000,
                  ease: "linear"
                }}
              />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn('flex-shrink-0 p-2 rounded-xl bg-white/50 backdrop-blur-sm', styles.icon)}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={cn('text-sm font-semibold mb-1', styles.title)}>
                          {notification.title}
                        </h3>
                        <p className={cn('text-sm leading-relaxed', styles.message)}>
                          {notification.message}
                        </p>
                        <p className="text-xs opacity-60 mt-2 font-medium">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100/50 transition-all duration-200 hover:scale-110"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;