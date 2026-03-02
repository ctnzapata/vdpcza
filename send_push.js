import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

// 1. Cargar Variables
// En un ambiente real Cloud, estas vendrían como process.env
const SUPABASE_URL = 'https://aczbvdoodomuyzubijwy.supabase.co';
// Usa la SERVICE_ROLE_KEY de Supabase aquí en producción real
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const VAPID_PUBLIC = 'BGizkyMKV7X_8M2r3InGP2hl_RA2tkk6XFQ8Qwk3cumOtrB_00neAUeRioxTePUBdTSBR5jvfptvYaed2bZaFKk';
const VAPID_PRIVATE = 'Hn5FmfJK590k6atr9Px6rjyFkS1kMzJ6pfZFpkyfj-Y';

// 2. Setup VAPID
webpush.setVapidDetails(
    'mailto:ctnzapata@gmail.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
);

// 3. Conectar a Supabase (Necesita una llave Admin o Anon según los RLS de push_subscriptions)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const userIdDestino = process.argv[2]; // Pasa el id del user como argumento: node send_push.js <id>

async function sendNotification() {
    if (!userIdDestino) {
        console.log('Por favor especifica un User ID: node send_push.js <uuid>');
        process.exit(1);
    }

    // Buscar todas las suscripciones (endpoints) asociadas a la pareja
    const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userIdDestino);

    if (error) {
        console.error('Error buscando suscripciones:', error.message);
        return;
    }

    if (!subscriptions || subscriptions.length === 0) {
        console.log(`El usuario ${userIdDestino} no tiene dispositivos registrados para Notificaciones Push.`);
        return;
    }

    const pushPayload = JSON.stringify({
        title: "✨ Tienes una nueva sorpresa",
        body: "¡He preparado algo especial para ti! Entra a nuestra historia mágica para abrirlo.",
        url: "/gifts",
    });

    // Enviar push a cada dispositivo registrado del usuario
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
            console.log(`Notificación enviada con éxito al dispositivo: ${sub.id}`);
        } catch (err) {
            console.error(`Error enviando notificación al dispositivo ${sub.id}:`, err);
            // Si el endpoint expiró (err.statusCode === 410), podríamos borrarlo de BD
            if (err.statusCode === 410) {
                await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            }
        }
    }
}

sendNotification();
