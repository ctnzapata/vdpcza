// Service Worker para Web Push Notifications
// Este archivo procesa los mensajes entrantes incluso con la app cerrada.

self.addEventListener('install', () => {
    self.skipWaiting(); // Forzar activación del nuevo service worker
});

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push Recibido:', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/logo.svg', // Idealmente usar una versión png o ico para compatibilidad
        badge: '/logo.svg',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    });
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Si ya hay una ventana abierta de la app, enfocarla y navegar a la url especificada
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url && 'focus' in client) {
                    if (e.notification.data.url) client.navigate(e.notification.data.url);
                    return client.focus();
                }
            }
            // Si la app está cerrada, abrir una nueva ventana con la url especificada
            if (clients.openWindow) {
                return clients.openWindow(e.notification.data.url || '/');
            }
        })
    );
});
