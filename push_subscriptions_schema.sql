-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase (https://supabase.com/dashboard)

-- 1. Crear la tabla de suscripciones Push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    auth_key TEXT NOT NULL,
    p256dh_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Configurar Row Level Security (RLS)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas 
-- Los administradores (o la Edge Function) pueden leer/escribir todas las suscripciones
-- Un usuario solo puede insertar/actualizar sus propias suscripciones (desde la app)

CREATE POLICY "Los usuarios pueden insertar sus propias suscripciones"
ON public.push_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias suscripciones"
ON public.push_subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden borrar sus propias suscripciones"
ON public.push_subscriptions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Para que las Edge Functions u otros componentes en servidor puedan leer los endpoint (usando roles con BYPASS RLS)
CREATE POLICY "Permitir select a usuario autenticado de sus propias llaves"
ON public.push_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ¡Listo! Ahora la tabla está preparada para recibir las suscripciones del Service Worker.
