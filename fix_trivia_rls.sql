-- Habilitar RLS en la tabla si no está habilitado
ALTER TABLE public.trivia_questions ENABLE ROW LEVEL SECURITY;

-- 1. Política para Leer (Select): Cualquiera autenticado puede leer las preguntas
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON public.trivia_questions FOR SELECT 
TO authenticated 
USING (true);

-- 2. Política para Insertar (Insert): Usuarios autenticados pueden crear preguntas
CREATE POLICY "Permitir insertar a usuarios autenticados" 
ON public.trivia_questions FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Política para Actualizar (Update): Usuarios autenticados pueden editar sus preguntas
CREATE POLICY "Permitir actualizar a usuarios autenticados" 
ON public.trivia_questions FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Política para Eliminar (Delete): Usuarios autenticados pueden borrar preguntas
CREATE POLICY "Permitir eliminar a usuarios autenticados" 
ON public.trivia_questions FOR DELETE 
TO authenticated 
USING (true);
