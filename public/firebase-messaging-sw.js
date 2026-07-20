import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCZQVzjkRYyXsLzWqUL7AQwqn3RJ8iHQCA',
  authDomain: 'jobpulse-5ed2d.firebaseapp.com',
  projectId: 'jobpulse-5ed2d',
  storageBucket: 'jobpulse-5ed2d.firebasestorage.app',
  messagingSenderId: '284062351250',
  appId: '1:284062351250:web:d0c21d9e4757956a160b4b',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  const title = payload.notification?.title || 'JobPulse';
  const options = {
    body: payload.notification?.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: payload.data?.tag || 'jobpulse-notification',
    data: { url: payload.data?.url || '/' },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
