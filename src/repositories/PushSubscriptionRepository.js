import { supabase } from '../supabaseClient';

export const PushSubscriptionRepository = {
    /**
     * Guarda una nueva suscripción de notificaciones push vinculada al usuario
     */
    async saveSubscription(userId, subscription) {
        try {
            // Intentamos insertar o actualizar based on endpoint (que sería único)
            const { data, error } = await supabase
                .from('push_subscriptions')
                .upsert(
                    {
                        user_id: userId,
                        endpoint: subscription.endpoint,
                        auth_key: subscription.keys.auth,
                        p256dh_key: subscription.keys.p256dh
                    },
                    { onConflict: 'endpoint' }
                );

            if (error) {
                console.error('Error guardando push subscription en capa de red:', error);
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error saving subscription:', error.message);
            return null;
        }
    },

    /**
     * Elimina una suscripción si el usuario cierra sesión o revoca permisos
     */
    async removeSubscription(endpoint) {
        try {
            const { error } = await supabase
                .from('push_subscriptions')
                .delete()
                .eq('endpoint', endpoint);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error al remover suscripcion:', err.message);
            return false;
        }
    }
};
