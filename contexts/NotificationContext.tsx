"use client"
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '@/components/notification-bar';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = uuidv4();
    const newNotification = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    setNotifications(prev => {
      // Limit to 5 notifications at a time
      const updatedNotifications = [...prev, newNotification];
      if (updatedNotifications.length > 5) {
        return updatedNotifications.slice(-5);
      }
      return updatedNotifications;
    });

    // Auto-dismiss after duration (default 5 seconds)
    if (notification.duration !== 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration || 5000);
    }
  }, [dismissNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification, clearAllNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}