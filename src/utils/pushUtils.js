import { PushSubscriptionRepository } from '../repositories/PushSubscriptionRepository';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const setupPushNotifications = async (userId) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push Notifications are not supported in this browser.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado exitosamente');

        // Revisar si ya hay una suscripción
        const subscription = await registration.pushManager.getSubscription();

        // Solo mostramos el prompt si no estamos suscritos
        // Si no estamos suscritos, pedimos permiso.
        if (!subscription) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                const newSub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });

                // Extraer keys y endpoint para guardar en backend
                const subData = JSON.parse(JSON.stringify(newSub));
                await PushSubscriptionRepository.saveSubscription(userId, subData);
                console.log('Suscrito a Push Notifications y guardado en DB');
            }
        } else {
            // En cada carga aseguramos actualizar/renovar la suscripción en el backend 
            // por seguridad en caso el usuario se haya logueado desde otro lado o sea la primera carga.
            const subData = JSON.parse(JSON.stringify(subscription));
            await PushSubscriptionRepository.saveSubscription(userId, subData);
        }

    } catch (error) {
        console.error('Error durante la registración de Service Worker/Push:', error);
    }
};
