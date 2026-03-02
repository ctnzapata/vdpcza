import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { senderId, title, message, url } = req.body;

        if (!senderId) {
            return res.status(400).json({ error: "senderId is required" });
        }

        const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://aczbvdoodomuyzubijwy.supabase.co';
        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!SUPABASE_SERVICE_ROLE_KEY) {
            return res.status(500).json({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY" });
        }

        const VAPID_PUBLIC = process.env.VITE_VAPID_PUBLIC_KEY;
        const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;

        if (!VAPID_PRIVATE || !VAPID_PUBLIC) {
            return res.status(500).json({ error: "Server missing VAPID keys" });
        }

        webpush.setVapidDetails(
            'mailto:ctnzapata@gmail.com', // Replace with admin email
            VAPID_PUBLIC,
            VAPID_PRIVATE
        );

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('*')
            .neq('user_id', senderId);

        if (error) {
            return res.status(500).json({ error: "Error fetching subscriptions", details: error.message });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: "El usuario no tiene dispositivos registrados para Notificaciones Push." });
        }

        const pushPayload = JSON.stringify({
            title: title || "✨ Nueva Sorpresa",
            body: message || "¡Revisa la app, hay algo especial para ti!",
            url: url || "/gifts",
        });

        const results = [];
        for (const sub of subscriptions) {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth_key,
                    p256dh: sub.p256dh_key
                }
            };

            try {
                await webpush.sendNotification(pushSubscription, pushPayload);
                results.push({ id: sub.id, success: true });
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await supabase.from('push_subscriptions').delete().eq('id', sub.id);
                }
                results.push({ id: sub.id, success: false, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
