import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
      const countRes = await apiClient.get('/notifications/unread-count');
      if (countRes.data.success) {
        setUnreadCount(countRes.data.data.unreadCount);
      }
    } catch (err) {
      // ignore in silent polling
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
