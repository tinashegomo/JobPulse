import { useEffect, useState, useCallback } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';

export const useForegroundMessages = () => {
  const [messages, setMessages] = useState([]);

  const dismiss = useCallback((index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = {
        title: payload.notification?.title || 'JobPulse',
        body: payload.notification?.body || '',
        url: payload.data?.url || '/',
        receivedAt: Date.now(),
      };

      setMessages((prev) => [...prev, notification]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.receivedAt !== notification.receivedAt));
      }, 8000);
    });

    return unsubscribe;
  }, []);

  return { messages, dismiss };
};
