import { useEffect, useState, useCallback } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';
import { useAuth } from './useAuth';
import { saveFCMToken } from '../api/firestoreService';

export const useFCMToken = () => {
  const { currentUser } = useAuth();
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const requestPermission = useCallback(async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
          await saveFCMToken(currentToken, currentUser?.uid || null);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    if (permission === 'granted' && !token && currentUser) {
      getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      })
        .then((currentToken) => {
          if (currentToken) {
            setToken(currentToken);
            return saveFCMToken(currentToken, currentUser.uid);
          }
          return null;
        })
        .catch((err) => setError(err.message));
    }
  }, [permission, token, currentUser]);

  return { permission, token, error, requestPermission };
};
