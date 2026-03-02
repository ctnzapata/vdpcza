-- Ejecuta esto en el SQL Editor para corregir el error RLS de Supabase
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propias suscripciones" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias suscripciones" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Los usuarios pueden borrar sus propias suscripciones" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Permitir select a usuario autenticado de sus propias llaves" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON public.push_subscriptions;

-- Simplificamos usando una única regla ALL que cubre Select, Insert, Update, Delete
CREATE POLICY "Enable ALL for users based on user_id" 
ON public.push_subscriptions FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
