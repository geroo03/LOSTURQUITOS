// Los Turquitos — Service Worker de Firebase Cloud Messaging.
// Tiene que vivir en la RAÍZ del sitio (junto a admin.html), no en /tienda/, porque el service worker
// solo recibe pushes para páginas dentro de su mismo scope (carpeta) o por debajo.
//
// ⚠️ Reemplazar firebaseConfig con los datos reales del proyecto de Firebase antes de publicar
// (Firebase Console → ⚙️ Configuración del proyecto → tus apps → app Web → "Config").
// Son los mismos valores que en panel_tienda.html: hay que pegarlos en los dos lugares.
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'REEMPLAZAR',
  authDomain: 'REEMPLAZAR.firebaseapp.com',
  projectId: 'REEMPLAZAR',
  storageBucket: 'REEMPLAZAR.appspot.com',
  messagingSenderId: 'REEMPLAZAR',
  appId: 'REEMPLAZAR',
});

const messaging = firebase.messaging();

// Notificación cuando llega un push y el panel está cerrado o en otra pestaña.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Los Turquitos', {
    body: body || 'Tenés novedades en el panel.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: (payload.data && payload.data.url) || '/admin.html' },
  });
});

// Al tocar la notificación, abre (o enfoca) el panel.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/admin.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes('/admin.html'));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
